/**
 * Description: display a query result in a Google map
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

/* based on the leases.js code in PLE WWW interface for MyPLC by Thierry Parmentelat -- INRIA */

/* XXX Those declarations should not be part of the js file... */

/* decorations / headers */
/* note: looks like the 'font' attr is not effective... */

// vertical rules
var attr_rules={'fill':"#888", 'stroke-dasharray':'- ', 'stroke-width':0.5};
// set font-size separately in here rather than depend on the height
var txt_timelabel = {"font": 'Times, "Trebuchet MS", Verdana, Arial, Helvetica, sans-serif', 
             stroke: "none", fill: "#008", 'font-size': 9};
var txt_allnodes = {"font": '"Trebuchet MS", Verdana, Arial, Helvetica, sans-serif', stroke: "none", fill: "#404"};
var txt_nodelabel = {"font": '"Trebuchet MS", Verdana, Arial, Helvetica, sans-serif', stroke: "none", fill: "#008"};

var attr_timebutton = {'fill':'#bbf', 'stroke': '#338','stroke-width':1, 
               'stroke-linecap':'round', 'stroke-linejoin':'miter', 'stroke-miterlimit':3};
var attr_daymarker = {'stroke':'#000','stroke-width':2};
var attr_half_daymarker = {'stroke':'#444','stroke-width':2};

/* lease dimensions and colors */
/* refrain from using gradient color, seems to not be animated properly */
/* lease was originally free and is still free */
var attr_lease_free_free={'fill':"#def", 'stroke-width':0.5, 'stroke-dasharray':''};
/* lease was originally free and is now set for our usage */
var attr_lease_free_mine={'fill':"green", 'stroke-width':1, 'stroke-dasharray':'-..'};
/* was mine and is still mine */
var attr_lease_mine_mine={'fill':"#beb", 'stroke-width':0.5, 'stroke-dasharray':''};
/* was mine and is about to be released */
var attr_lease_mine_free={'fill':"white", 'stroke-width':1, 'stroke-dasharray':'-..'};
var attr_lease_other={'fill':"#f88"};

/* other slices name */
var txt_otherslice = {"font": '"Trebuchet MS", Verdana, Arial, Helvetica, sans-serif', stroke: "none", fill: "#444", "font-size": "12px"};

(function($){

    var Scheduler = Plugin.extend({

        init: function(options, element) 
        {
            this._super(options, element);

            /* Member variables */
            this.options = options;
            this.canvas_id = 'leases_area-' + options.plugin_uuid;

            this.query_uuid = options.query_uuid;
            this.rows = null;
            // XXX TODEL
            //this.current_resources = Array();
            //this.current_leases = Array();

            this.myLeases = Array();
            this.allLeases = Array();

            this.listLeases = Array();

            this.axisx = Array();
            this.axisy = Array();
            this.data = Array();
            this.default_granularity = 1800; /* 30 min */
            this.initial_timestamp = null;

            /* This should be updated to be the ppcm of all granularities */
            this.min_granularity = this.default_granularity;

            // the data contains slice names, and lease_id, we need this to find our own leases (mine)
            this.paper=null;

            /* XXX Events */

            /* XXX Keys */

            /* Listening to queries */
            this.listen_query(options.query_uuid);
            this.listen_query(options.query_lease_uuid);

            /* XXX GUI setup and event binding */
            jQuery("#datepicker").datetimepicker({
                //Timezone wise selection option
                //timeFormat: 'hh:mm tt z',
                //showTimezone: true,
                
                onSelect: function(value) { 
                    //console.log(value);
                    //converting time to timestamp
                    currentDate= Math.round(Date.parse(value)/ 1000);
                    // TODO -- DONE
                    // convert value to timestamp --done
                    // Get jQuery("#timepicker").val(); - no need anymore
                    // convert timepicker into seconds - no need
                    // Add time to date - done
                    // pass the result to init_axisx - done
                    //console.log(currentDate);
                    s.clear();
                    s.init_axisx(currentDate);
                    s.draw();
                    // Do we need to populate the timeslots with existing leases? 
                    // Look how to populate with initial_leases [we have to show the leases]
                    
                } 
            });
            //console.log(s.nodelabels[1]);
            // Do we need to populate the timeslots with existing leases? 
            // Look how to populate with initial_leases
            
            // TODO -- DONE  Note: autocomplete is not search box
            // Implement a filtering functionality, on the name of the node
            // http://jqueryui.com/autocomplete/
            // pass s.nodelabels to autocomplete function
            //jQuery("#search").autocomplete('s.nodelabel');
            //console.log(s.nodelabel);
            
            /*
             * TODO
             * During init, there are no resources
             * So the list of nodes is empty
             * The function triggered by the subscription to the resources query
             * var RESULTS_RESOURCES = '/results/' + options.resource_query_uuid + '/changed';
             * $.subscribe(RESULTS_RESOURCES, function(e, resources) { s.set_resources(resources);   });
             * Will have to update the list of nodes available through autocomplete (availableTags)
             * 
             * Be inspired by QueryEditor plugin
             * 
             * Resources informations in s.axisy ???
             * 
             * Filter what has been selected in other plugins:
             * QueryEditor
             * QuickFilter
             * AdvancedFilter
             * 
             * Implement an action of filtering while typing
             * filter what correspond to the user choice
             * 
             */
            $(function() {
                var availableTags = ['omf','nitos','ple', s.nodelabel];
            $( "#search" ).autocomplete({
              source: availableTags
                });
            });

            this.init_axisx('');
            this.draw();

        }, /* init */

        /* Default settings */
        default_options: {
            leases_offset:       0,
            leases_slots:        36,
            leases_w:            180,
            leases_granularity:  3600,

            x_nodelabel:         200,   /* space for the nodenames */
            x_sep:               20,    /* right space after the nodename - removed from the above */
            y_header:            12,    /* height for the (two) rows of timelabels */
            y_sep:               10,    /* space between nodes */
            leases_w:            20,    /* 1-grain leases attributes */
            y_node:              15,
            radius:              6,
            anim_delay:          350,
            checkboxes:          false,
            resource_query_uuid: null,  /* resources */
            lease_query_uuid:    null,  /* leases */
        },

        /* PLUGIN EVENTS */

        /* GUI EVENTS */

        /* GUI MANIPULATION */

        /* TEMPLATES */

        /* QUERY HANDLERS */

        set_resources: function(resources) 
        {
            //console.log(resources);
            var scheduler = this;
            jQuery.each(resources, function(i, resource) {
                // ... add reservable ones to the x axis
                if ((typeof resource.exclusive != 'undefined') && (resource.exclusive)) {
                    scheduler.axisy.push(Array(resource.urn, resource.resource_hrn, resource.type));
                }
                // ... if we do not have information about slivers (first update), update it
                if (typeof resource.sliver != 'undefined') {
                    // XXX
                }
            });

            this.draw(this.canvas_id);
        }

        this.set_leases = function(leases) {
            this.initial_leases=leases;
            this.draw(this.canvas_id);
        }

        this.update_resources = function(resources) {
            //
        }

        this.update_leases = function(leases) {
            //
        }

        /* RECORD HANDLERS */

        /* INTERNAL FUNCTIONS */

        /**
         * @brief Return the number of time slots
         */
        nb_grains: function () 
        {
            return this.axisx.length; 
        },

        /**
         * @brief Returns whether there is a pending lease at this timestamp
         */
        find_lease: function(urn, timestamp)
        {
            var scheduler = this;
            var result = null;

            $.each(Array(scheduler.myLeases, scheduler.allLeases), function(i, array) {
                $.each(array, function(i, lease) {
                    if (lease[0] == urn) {
                        if ((timestamp >= lease[1]) && (timestamp < (lease[1] + lease[2] * 1800))) {
                            result = lease;
                            
                            return false;
                        }
                    }
                });
                if (result)
                    return false;
            });
            return result;
        },

        /**
         * @brief Draw
         */
        draw: function() 
        { 
            var canvas_id = this.canvas_id;
            var o = this.options;
            var total_width = o.x_nodelabel + this.nb_grains() * this.options.leases_w;
            var total_height = 2 * o.y_header /* the timelabels */
                             + 2 * o.y_sep    /* extra space */
                             + o.y_node	  /* all-nodes & timebuttons row */ 
                             + (this.axisy.length)*(o.y_node+o.y_sep);  /* the regular nodes and preceding space */

            /* reuse for paper if exists with same size, or (re-)create otherwise */
            var paper;
            if (this.paper == null) {
                paper = Raphael (canvas_id, total_width+o.x_sep, total_height);
            } else if (this.paper.width==total_width && this.paper.height==total_height) {
                paper=this.paper;
                paper.clear();
            } else {
                $$("#"+canvas_id)[0].innerHTML="";
                paper = Raphael (canvas_id, total_width+o.x_sep, total_height);
            }
            this.paper=paper;

            /* the path for the triangle-shaped buttons */
            this.timebutton_path = "M1,0L"+(this.options.leases_w-1)+",0L"+(this.options.leases_w/2)+","+o.y_header+"L1,0";

            var axisx = this.axisx;
            var axisy = this.axisy;

            /* maintain the list of nodelabels for the 'all nodes' button */
            this.nodelabels=[];
            

            /* create the time slots legend */
            var top = 0;
            var left = o.x_nodelabel;

            var daymarker_height= 2*o.y_header + 2*o.y_sep + (axisy.length+1)*(o.y_node+o.y_sep);
            var daymarker_path="M0,0L0," + daymarker_height;

            var half_daymarker_off= 2*o.y_header + o.y_sep;
            var half_daymarker_path="M0," + half_daymarker_off + "L0," + daymarker_height;

            var col=0;
            for (var i=0, len=axisx.length; i < len; ++i) {
                /* pick the printable part */
                var timelabel=axisx[i][1];
                var y = top + o.y_header;
                if (col%2 == 0) y += o.y_header;
                col +=1;
                /* display time label */
                var timelabel=paper.text(left,y,timelabel).attr(txt_timelabel).attr({"text-anchor":"middle"});
                /* draw vertical line */
                var path_spec="M"+left+" "+(y+o.y_header/2)+"L"+left+" "+this.total_height;
                var rule=paper.path(path_spec).attr(attr_rules);
                /* show a day marker when relevant */
                var timestamp=parseInt(axisx[i][0]);
                if ( (timestamp%(24*3600))==0) {
                    paper.path(daymarker_path).attr({'translation':left+','+top}).attr(attr_daymarker);
                } else if ( (timestamp%(12*3600))==0) {
                    paper.path(half_daymarker_path).attr({'translation':left+','+top}).attr(attr_daymarker);
                }
                left += this.options.leases_w;
            },

            ////////// the row with the timeslot buttons (the one labeled 'All nodes')
            this.granularity= this.min_granularity; // XXX axisx[1][0]-axisx[0][0];

            // move two lines down
            top += 2*o.y_header + 2*o.y_sep;
            left=o.x_nodelabel;
            // all nodes buttons
            var allnodes = paper.text (o.x_nodelabel-o.x_sep,top+o.y_node/2,"All nodes").attr(txt_allnodes)
                .attr ({"font-size":o.y_node, "text-anchor":"end","baseline":"bottom"});
            allnodes.scheduler=this;
            allnodes.click(allnodes_methods.click);
            
            // timeslot buttons [it's the triangles above the slots]
            for (var i=0, len=axisx.length; i < len; ++i) {
                var timebutton=paper.path(this.timebutton_path).attr({'translation':left+','+top}).attr(attr_timebutton);
                timebutton.from_time=axisx[i][0];
                timebutton.scheduler=this;
                timebutton.click(timebutton_methods.click);
                left+=(this.options.leases_w);
            }
            
            //////// the body of the scheduler : loop on nodes
            top += o.y_node + o.y_sep;
            var data_index=0;
            this.leases=[];
            for (var i=0, len=axisy.length; i<len; ++i) {
                var urn=axisy[i][0];
                var nodename=axisy[i][1];
                var type=axisy[i][2];
                left=0;            
                /*
                 *  MODIFIED font-size
                var nodelabel = paper.text(o.x_nodelabel-x_sep,top+y_node/2,nodename).attr(txt_nodelabel)
                .attr ({"font-size":y_node, "text-anchor":"end","baseline":"bottom"});
                */
                var nodelabel = paper.text(o.x_nodelabel-o.x_sep,top+o.y_node/3,nodename).attr(txt_nodelabel)
                .attr ({"font-size":"12px", "text-anchor":"end","baseline":"bottom"});    
                //console.log(nodelabel);
                nodelabel_methods.selected(nodelabel,1);
                //nodelabel_methods.selected( this, ! this.selected );
                nodelabel.click(nodelabel_methods.click); //click action works here
                //timebutton.click(timebutton_methods.click);
                
               // lease_methods.init_free(nodelabel.click, lease_methods.click_mine);
               //lease_methods.init_free(nodelabel.lease);
                this.nodelabels.push(nodelabel);
                
                left += o.x_nodelabel;
                var grain=0;
                // data index contains the full array of leases
                // not the same amount of grains per node

                // NOTE: remembering the previous lease might help for long leases.
                while (grain < this.nb_grains()) {

                    if (l = this.find_lease(urn, this.initial_timestamp + grain * 1800)) {
                        slicename = l.slice_id;
                    } else {
                        slicename = "";
                    }

                    //lease_id  = this.data[data_index][0];
                    //slicename = this.data[data_index][1];
                    /* Duration should not be the lease duration, but the grain */
                    var duration = 1; // this.data[data_index][2];

                    var lease=paper.rect (left,top,this.options.leases_w*duration,o.y_node,o.radius);
                    // record scheduler in lease - early as we need this in init_other
                    lease.scheduler=this;
                    //lease.lease_id=lease_id;
                    lease.nodename=nodename;
                    lease.urn=urn;
                    lease.nodelabel=nodelabel;
                    if (slicename == "") {
                        lease.initial="free";
                        lease_methods.init_free(lease);
                    } else if (slicename == this.options.slicename) {
                        lease.initial="mine";
                        lease_methods.init_mine(lease);
                    } else {
                        lease.initial="other";
                        lease_methods.init_other(lease,slicename);
                    }
                    lease.from_time = axisx[grain%this.nb_grains()][0];
                    grain += duration;
                    lease.until_time = axisx[grain%this.nb_grains()][0];
                    // and vice versa
                    this.leases.push(lease);
                    // move on with the loop
                    left += this.options.leases_w*duration;
                    data_index +=1;
                }
                top += o.y_node + o.y_sep;
            };
        }, /* draw */

        init_axisx: function(currentDate) 
        {
            this.axisx = Array();
    
            if(currentDate=="") {
                // creating timestamp of the current time
                currentDate = new Date().getTime() / 1000;
            }
            this.initial_timestamp = currentDate;
            //console.log(currentDate);
    
            // round it by granularity (becomes an Int)
            var rounded = Math.round(currentDate/this.min_granularity)*this.min_granularity;
            // Convert Int to Date
            rounded = new Date(rounded*1000);
            // get hours and minutes in a 24h format 00:00
            var roundedHours=(rounded.getHours()<10?'0':'') + rounded.getHours();
            var roundedMinutes=(rounded.getMinutes()<10?'0':'') + rounded.getMinutes();
    
            //timeFrame.push(rounded);
            this.axisx.push(Array(rounded, roundedHours+":"+roundedMinutes));
    
            // Generate as man slots as we need
            for(i=0; i<this.options.leases_slots;i++) {
                rounded = this.min_granularity+(rounded.getTime()/1000);
                rounded = new Date(rounded*1000);
                roundedHours=(rounded.getHours()<10?'0':'') + rounded.getHours();
                roundedMinutes=(rounded.getMinutes()<10?'0':'') + rounded.getMinutes();
    
                //timeFrame.push(rounded);
                this.axisx.push(Array(rounded, roundedHours+":"+roundedMinutes));
            }
        },

        clear: function ()
        {
            for (var i=0, len=this.leases.length; i<len; ++i) {
                var lease=this.leases[i];
                if (lease.current != lease.initial) {
                if (lease.initial == 'free') lease_methods.init_free(lease,lease_methods.click_mine);
                else			     lease_methods.init_mine(lease,lease_methods.click_free);
                }
            }
        },

        // XXX Couldn't find how to inhererit from the raphael objects...

        /* ---------------------------------------------------------------------
         * The 'all nodes' button
         */
        allnodes_methods: {
            click: function (event) {
                var scheduler=this.scheduler;
                /* decide what to do */
                var unselected=0;
                for (var i=0, len=scheduler.nodelabels.length; i<len; ++i) 
                    if (! scheduler.nodelabels[i].selected) unselected++;
                /* if at least one is not selected : select all */
                var new_state = (unselected >0) ? 1 : 0;
                for (var i=0, len=scheduler.nodelabels.length; i<len; ++i) 
                    nodelabel_methods.selected(scheduler.nodelabels[i],new_state);
            }
        },

        /* ---------------------------------------------------------------------
         * The buttons for managing the whole timeslot
         */
        timebutton_methods: {

            /* clicking */
            click: function (event) {
                var scheduler = this.scheduler;
                var from_time = this.from_time;
                var until_time = from_time + scheduler.granularity;
                /* scan leases on selected nodes, store in two arrays */
                var relevant_free=[], relevant_mine=[];
                for (var i=0,len=scheduler.leases.length; i<len; ++i) {
                    var scan=scheduler.leases[i];
                    if ( ! scan.nodelabel.selected) continue;
                    // overlap ?
                    if (scan.from_time<=from_time && scan.until_time>=until_time) {
                    if (scan.current == "free")       relevant_free.push(scan);
                    else if (scan.current == "mine")  relevant_mine.push(scan);
                    }
                }
                // window.console.log("Found " + relevant_free.length + " free and " + relevant_mine.length + " mine");
                /* decide what to do, whether book or release */
                if (relevant_mine.length==0 && relevant_free.length==0) {
                    alert ("Nothing to do in this timeslot on the selected nodes");
                    return;
                }
                // if at least one is free, let's book
                if (relevant_free.length > 0) {
                    for (var i=0, len=relevant_free.length; i<len; ++i) {
                        var lease=relevant_free[i];
                        lease_methods.init_mine(lease,lease_methods.click_free);
                    }
                // otherwise we unselect
                } else {
                    for (var i=0, len=relevant_mine.length; i<len; ++i) {
                        var lease=relevant_mine[i];
                        lease_methods.init_free(lease,lease_methods.click_mine);
                    }
                }
            } /* click */
        }, 

        /* ---------------------------------------------------------------------
         * The nodelabel buttons
         */
        nodelabel_methods: {
            
            // set selected mode and render visually
            selected: function (nodelabel, flag) {
                nodelabel.selected=flag;
                nodelabel.attr({'font-weight': (flag ? 'bold' : 'normal')});
                // TODO
                // 
                // loop on axis x and select each timebutton
                // for (var i=0, len=axisx.length; i < len; ++i)
                // figure out how to use timebutton_methods.click();
                    
            },

            // toggle selected
            click: function (event) {
                nodelabel_methods.selected( this, ! this.selected );
            }
        },


        /* ---------------------------------------------------------------------
         * The lease buttons
         */
        lease_methods: {
        
            init_free: function (lease, unclick) {
                var o = lease.scheduler.options;
                lease.current="free";
                // set color
                lease.animate((lease.initial=="free") ? attr_lease_free_free : attr_lease_mine_free, o.anim_delay);
                // keep track of the current status
                // record action
                lease.click (lease_methods.click_free);
                if (unclick) lease.unclick(unclick);
            },
                     
            // find out all the currently free leases that overlap this one
            click_free: function (event) {
                var scheduler = this.scheduler;
                lease_methods.init_mine(this,lease_methods.click_free);        
                //publish
                //this.from_time
                //this.urn
                //this.until_time
                var urn = this.urn
                var start_time=new Date(this.from_time).getTime() / 1000;        
                var end_time=new Date(this.until_time).getTime() / 1000;
                var duration=(end_time-start_time)/1800; // XXX HARDCODED LEASE GRAIN

                /* Add a new lease : XXX should be replaced by a dictionary */
                // Do we have a lease with the same urn  just before or just after ?
                var removeIdBefore = null;
                var removeIdAfter = null;
                jQuery.each(scheduler.listLeases, function(i, lease) {
                    if (lease[0] == urn) {
                        if (lease[1] + lease[2] * 1800 == start_time) { // XXX HARDCODED LEASE GRAIN
                            // Merge with previous lease
                            removeIdBefore = i;
                            start_time = lease[1];
                            duration += lease[2];
                        }
                        if (lease[1] == end_time) {
                            // Merge with following lease
                            removeIdAfter = i;
                            duration += lease[2];
                        }
                    }
                });
                if (removeIdBefore != null) {
                    scheduler.listLeases.splice(removeIdBefore , 1);
                    if (removeIdAfter != null)
                        removeIdAfter -= 1;
                }
                if (removeIdAfter != null) {
                    scheduler.listLeases.splice(removeIdAfter , 1);
                }

                scheduler.listLeases.push([this.urn, start_time, duration]);

                console.log(scheduler.listLeases);
                //jQuery.publish('/update-set/' + scheduler.options.query_uuid, [scheduler.listLeases]);
                jQuery.publish('/update-set/' + scheduler.options.lease_query_uuid, [scheduler.listLeases]);
            },

            init_mine: function (lease, unclick) {
                var o = lease.scheduler.options;
                lease.current="mine";
                lease.animate((lease.initial=="mine") ? attr_lease_mine_mine : attr_lease_free_mine,o.anim_delay);
                lease.click (lease_methods.click_mine);
                if (unclick) lease.unclick(unclick);
            },
            
            /* TODO: remove selected lease from array listLeases and publish change */
            click_mine: function (event) {
                var scheduler = this.scheduler;
                // this lease was originally free but is now marked for booking
                // we free just this lease
                //console.log('this is mine');
                lease_methods.init_free(this, lease_methods.click_mine);
            },


            init_other: function (lease, slicename) {
                lease.animate (attr_lease_other,anim_delay);
                /* a text obj to display the name of the slice that owns that lease */
                var otherslicelabel = lease.scheduler.paper.text (lease.attr("x")+lease.attr("width")/2,
                                          // xxx
                                          lease.attr("y")+lease.attr("height")/2,slicename).attr(txt_otherslice);
                /* hide it right away */
                otherslicelabel.hide();
                /* record it */
                lease.label=otherslicelabel;
                lease.hover ( function (e) {this.label.toFront();this.label.show();},
                          function (e) {this.label.hide();} ); 
            }
        }

    });

    $.plugin('Scheduler', Scheduler);

})(jQuery);
