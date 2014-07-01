var myApp = angular.module('myApp', []);
myApp.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});
myApp.factory('$exceptionHandler', function () {
    return function (exception, cause) {
        if (exception.message.contains('leases')) {
            console.log(exception.message);
            
            var tmpScope = angular.element(document.getElementById('SchedulerCtrl')).scope();
            //tmpScope.initSlots(_schedulerCurrentCellPosition, _schedulerCurrentCellPosition + SchedulerTotalVisibleCells);
        }
            
    };
});

myApp.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});

// Create a private execution space for our controller. When
// executing this function expression, we're going to pass in
// the Angular reference and our application module.
(function (ng, app) {


    // Define our Controller constructor.
    function Controller($scope) {

        // Store the scope so we can reference it in our
        // class methods
        this.scope = $scope;

        // Set up the default scope value.
        this.scope.errorMessage = null;
        this.scope.name = "";

        //Pagin
        $scope.current_page = 1;
        this.scope.items_per_page = 10;
        $scope.from = 0; // JORDAN

        $scope.resources = new Array();
        $scope.slots = SchedulerSlotsViewData;
        $scope.granularity = DEFAULT_GRANULARITY; /* Will be setup */
        //$scope.msg = "hello";

        angular.element(document).ready(function() {
            //console.log('Hello World');
            //alert('Hello World');
            //afterAngularRendered();
        });

        // Jordan
/*
        $scope.redraw = function()
        {

            // Refresh slots
            $scope.slots = [];
            for (var i = $scope.from; i < $scope.from + SchedulerTotalVisibleCells; i++)
                $scope.slots.push(SchedulerSlots[i]);


            // Collect lease information. This could be made once if no refresh... 
            lease_by_resource = {};
            manifold.query_store.iter_visible_records($scope.options.query_lease_uuid, function (record_key, record) {
                lease_by_resource[record['resource']] = record;
                // Need something to interrupt the loop
            });

            // Create resources
            $scope.resources = [];
            // current_page, items_per_page indicates which resources to show
            manifold.query_store.iter_visible_records($scope.options.query_uuid, function (record_key, record) {
                // copy not to modify original record
                var resource = jQuery.extend(true, {}, record);
                resource.leases = []; // a list of occupied timeslots

                // How many timeslots ? SchedulerTotalVisibleCells
                // SchedulerDateSelected
                // from : to ??
                // slot duration ?
                for (i=0; i < SchedulerTotalVisibleCells; i++) {
                    resource.leases.push({
                        'id': 'coucou',
                        'status': 'free', // 'selected', 'reserved', 'maintenance'
                    });
                }

                // For each lease we need to mark slots appropriately
                if (lease_by_resource[resource['urn']]) {
                    $.each(lease_by_resource[resource['urn']], function(i, lease) {
                        // $scope.from * GRANULARITY minutes since start
                        $scope.from * GRANULARITY
                        from_date = new Date(date.getTime() + ($scope.from * GRANULARITY) * 60000);
                        to_date   = new Date(date.getTime() + (($scope.from + SchedulerTotalVisibleCells) * GRANULARITY) * 60000);
                        // start_time, end_time
                    });
                }
                
                $scope.resources.push(resource);
                $scope.$apply();
            });
        }
*/
        $scope.clearStuff = function() {
            $scope.resources = new Array();
            $scope.$apply();
        }

        // Called at initialization, after filtering, and after changing the date.
        // this is like setpage(1) ???
/*
        $scope.initSchedulerResources = function (items_per_page) {
            $scope.resources = new Array();

            for (var k = 0; k < items_per_page; k++) {
                $scope.resources.push(jQuery.extend(true, {}, SchedulerDataViewData[k]));
                $scope.resources[k].leases = [];
            }
            $scope.items_per_page = items_per_page;
            $scope.current_page = 0;
            $scope.totalPages = parseInt(Math.ceil(SchedulerDataViewData.length / $scope.items_per_page));
            $scope.initSlots(0, SchedulerTotalVisibleCells);
        };
*/

        // Pagination

        $scope.range = function() {
            var range_size = $scope.page_count() > DEFAULT_PAGE_RANGE ? DEFAULT_PAGE_RANGE : $scope.page_count();
            var ret = [];
            var start;

            start = $scope.current_page;
            if ( start > $scope.page_count()-range_size ) {
              start = $scope.page_count()-range_size+1;
            }

            for (var i=start; i<start+range_size; i++) {
              ret.push(i);
            }
            return ret;
        };

        $scope.prevPage = function() {
          if ($scope.current_page > 1) {
            $scope.current_page--;
          }
        };

        $scope.prevPageDisabled = function() {
          return $scope.current_page === 1 ? "disabled" : "";
        };
  
        $scope.page_count = function() {
          return Math.ceil($scope.resources.length/$scope.items_per_page);
        };
  
        $scope.nextPage = function() {
          if ($scope.current_page < $scope.page_count()) {
            $scope.current_page++;
          }
        };
  
        $scope.nextPageDisabled = function() {
          return $scope.current_page === $scope.page_count() ? "disabled" : "";
        }; 

        $scope.setPage = function(n) {
            $scope.current_page = n;
        };
        // END pagination

        // FILTER

        $scope.filter_visible = function(resource)
        {
            return manifold.query_store.get_record_state($scope.options.query_uuid, resource['urn'], STATE_VISIBLE);
        };

        // SELECTION

        $scope.select = function(index, model_lease, model_resource)
        {
            // XXX
            // XXX Events won't work until we properly handle sets with composite keys
            // XXX
            console.log("Selected", index, model_lease, model_resource);

            if (model_lease.status != 'free') {
                console.log("Already selected slot");
                return;
            }
            
            var day_timestamp = SchedulerDateSelected.getTime() / 1000;
            var start_time = day_timestamp + index       * model_resource.granularity;
            var end_time   = day_timestamp + (index + 1) * model_resource.granularity;
            var start_date = new Date(start_time * 1000);
            var end_date   = new Date(end_time   * 1000);

            var lease_key = manifold.metadata.get_key('lease');

            // We search for leases in the cache we previously constructed
            var resource_leases = $scope._leases_by_resource[model_resource.urn];
            if (resource_leases) {
                /* Search for leases before */
                $.each(resource_leases, function(i, other) {
                    if (other.end_time != start_time)
                        return true; // ~ continue

                    /* The lease 'other' is just before, and there should not exist
                     * any other lease before it */
                    start_time = other.start_time;

                    other_key = {
                        resource:   other.resource,
                        start_time: other.start_time,
                        end_time:   other.end_time
                    }
                    // This is needed to create a hashable object
                    other_key.hashCode = manifold.record_hashcode(lease_key.sort());
                    other_key.equals   = manifold.record_equals(lease_key);

                    manifold.raise_event($scope.options.query_lease_uuid, SET_REMOVED, other_key);
                    /* Remove from local cache also, unless we listen to events from outside */
                    $.grep($scope._leases_by_resource[model_resource.urn], function(x) { return x != other; });
                    return false; // ~ break
                });

                /* Search for leases after */
                $.each(resource_leases, function(i, other) {
                    if (other.start_time != end_time)
                        return true; // ~ continue

                    /* The lease 'other' is just after, and there should not exist
                     * any other lease after it */
                    end_time = other.end_time;
                    // XXX SET_ADD and SET_REMOVE should accept full objects
                    other_key = {
                        resource:   other.resource,
                        start_time: other.start_time,
                        end_time:   other.end_time
                    }
                    // This is needed to create a hashable object
                    other_key.hashCode = manifold.record_hashcode(lease_key.sort());
                    other_key.equals   = manifold.record_equals(lease_key);

                    manifold.raise_event($scope.options.query_lease_uuid, SET_REMOVED, other_key);
                    /* Remove from local cache also, unless we listen to events from outside */
                    $.grep($scope._leases_by_resource[model_resource.urn], function(x) { return x != other; });
                    return false; // ~ break
                });
            }

            /* Create a new lease */
            new_lease = {
                resource:   model_resource.urn,
                start_time: start_time,
                end_time:   end_time,
            };

            // This is needed to create a hashable object
            new_lease.hashCode = manifold.record_hashcode(lease_key.sort());
            new_lease.equals   = manifold.record_equals(lease_key);

            manifold.raise_event($scope.options.query_lease_uuid, SET_ADD, new_lease);
            /* Add to local cache also, unless we listen to events from outside */
            if (!(model_resource.urn in $scope._leases_by_resource))
                $scope._leases_by_resource[model_resource.urn] = [];
            $scope._leases_by_resource[model_resource.urn].push(new_lease);

            // XXX Shall we set it or wait for manifold event ?
            model_lease.status = 'reserved'; // XXX pending

            // DEBUG: display all leases and their status in the log
            var leases = manifold.query_store.get_records($scope.options.query_lease_uuid);
            console.log("--------------------");
            $.each(leases, function(i, lease) {
                var key = manifold.metadata.get_key('lease');
                var lease_key = manifold.record_get_value(lease, key);
                var state = manifold.query_store.get_record_state($scope.options.query_lease_uuid, lease_key, STATE_SET);
                var state_str;
                switch(state) {
                    case STATE_SET_IN:
                        state_str = 'STATE_SET_IN';
                        break;
                    case STATE_SET_OUT:
                        state_str = 'STATE_SET_OUT';
                        break;
                    case STATE_SET_IN_PENDING:
                        state_str = 'STATE_SET_IN_PENDING';
                        break;
                    case STATE_SET_OUT_PENDING:
                        state_str = 'STATE_SET_OUT_PENDING';
                        break;
                    case STATE_SET_IN_SUCCESS:
                        state_str = 'STATE_SET_IN_SUCCESS';
                        break;
                    case STATE_SET_OUT_SUCCESS:
                        state_str = 'STATE_SET_OUT_SUCCESS';
                        break;
                    case STATE_SET_IN_FAILURE:
                        state_str = 'STATE_SET_IN_FAILURE';
                        break;
                    case STATE_SET_OUT_FAILURE:
                        state_str = 'STATE_SET_OUT_FAILURE';
                        break;
                }
                console.log("LEASE", new Date(lease.start_time * 1000), new Date(lease.end_time * 1000), lease.resource, state_str);
            });
        };
  

/*
        $scope.setPage = function(page) {
            var tmpFrm = $scope.items_per_page * page;
            var tmpTo = tmpFrm + $scope.items_per_page;
            tmpTo = SchedulerDataViewData.length < tmpTo ? SchedulerDataViewData.length : tmpTo;
            $scope.current_page = page;
            $scope.resources = [];
            var j = 0;
            for (var k = tmpFrm; k < tmpTo; k++) {
                $scope.resources.push(jQuery.extend(true, {}, SchedulerDataViewData[k]));
                $scope.resources[j].leases = [];
                j++;
            }
            //fix slider
            $('#tblSlider').slider('value', 0);
            //init Slots
            $scope.initSlots(0, SchedulerTotalVisibleCells);
        };*/

        // Typically we will only init visible slots
        $scope.initSlots = function (from, to) {
            return; // JORDAN !!!

            //init
            $scope.slots = [];

            var resourceIndex; //gia to paging
            //set
            for (var i = from; i < to; i++) {
                $scope.slots.push(SchedulerSlots[i]);
                resourceIndex = $scope.items_per_page * $scope.current_page;
                for (var j = 0; j < $scope.resources.length; j++) {
                    if (i == from) {
                        $scope.resources[j].leases = [];
                    }
                    $scope.resources[j].leases.push(SchedulerDataViewData[resourceIndex].leases[i]);
                    resourceIndex++;
                }
            }
            //apply
            $scope.$apply();
        };

/*
        $scope.getPageNumbers = function () {
            var totalNumbersShowned = ($scope.totalPages > 10 ? 10 : $scope.totalPages + 1 );
            var tmtNumDiv = totalNumbersShowned / 2;
            //local
            var numFrom = 1;
            var numTo = totalNumbersShowned;
            var rtrnArr = new Array();

            if (totalNumbersShowned > 1) {
                //set from - to
                if ($scope.totalPages > totalNumbersShowned) {
                    if ($scope.current_page <= tmtNumDiv) {
                        //nothing
                    } else if ($scope.current_page >= $scope.totalPages - tmtNumDiv) {
                        numTo = $scope.totalPages;
                        numFrom = numTo - totalNumbersShowned;
                    } else {
                        numFrom = $scope.current_page - tmtNumDiv;
                        numTo = numFrom + totalNumbersShowned;
                    }
                }

                for (var i = numFrom; i < numTo; i++)
                    rtrnArr.push(i);
            } else {
                rtrnArr.push(1);
            }
            return rtrnArr;
        };
*/
        // Return this object reference.
        return (this);

    }


    // Define the Controller as the constructor function.
    app.controller("SchedulerCtrl", Controller);


})(angular, myApp);
