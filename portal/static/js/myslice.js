/*
 * MySlice Class
 */

function list() {
	this.elements = [];
}

list.prototype.add = function(element) {
	if (!this.has(element)) {
		this.elements.push(element);
	}
};
    
list.prototype.del = function(element) {
	if (this.has(element)) {
		this.elements.splice(index, 1);
	}
};
    
list.prototype.has = function(element) {
	index = $.inArray( element, this.elements );
	if (index != -1) {
		return true;
	}
	return false;
};
    
list.prototype.count = function() {
    return this.elements.length;
};


/*
 * resources, users, leases
 */

function resources() {
	this.pending = {
		toremove: new list(),
		toadd: new list(),
	};
};

function leases() {
	this.pending = {
		toremove: new list(),
		toadd: new list(),
	};
};

function users() {
	this.pending = {
		toremove: new list(),
		toadd: new list(),
	};
};

/*
 * Slice
 */
function slice(name) {
	this.name = name;
	this.resources = new resources();
	this.users = new users();
	this.leases = new leases();
	
};


/*
 * User
 */
function user(user) {
	this.user = user;
	this.testbeds = new list();
	this.slices = new list();
	
	for (i = 0; i < this.user.slices.length; i++) {
		this.slices[this.user.slices[i]] = new slice(this.user.slices[i]);
	}
};

user.prototype.slice = function(name) {
	return this.slices[name];
};

user.prototype.list = function() {
    for (s in this.slices) {
    for (o in s) {
      if (typeof o != 'function') {
        console.log(o);
      } else {
      	console.log("w "+o);
      }
      }
    }
};

/*
 * MySlice
 */
var myslice = {
	user: {},
	
	user: function() {
		if ($.isEmptyObject(this.user)) {
			//this.login(function() { return this.user; });
            if(localStorage.getItem('user')!='undefined'){
			    this.user = JSON.parse(localStorage.getItem('user'));
            }else{
                return false;
            }
		}
		return this.user;
	},
    loadSlices: function(slices) {
        if (typeof(slices) == "undefined"){

            if(myslice.user != null && typeof(myslice.user.slices) != "undefined" && myslice.user.slices.length>0){
                slices = myslice.user.slices
            }
        }
        // myslice.user is in LocalStorage
        if(typeof(slices) != "undefined"){
            /*
                Launch queries to get the resources and leases in Manifold Cache
            */
            $.post("/rest/resource/", function( data ) {
            });
            $.post("/rest/lease/", function( data ) {
            });

            $.each( slices, function(i, val) {
                /*
                Launch a Query for each slice to get resources and leases in Manifold Cache
                */
                $.post("/rest/slice/", { 'filters': { 'slice_hrn' : val } }, function(data) {
                });
            });
        }

    },
	login: function(fn) {
        user = localStorage.getItem('user');
        if($.isEmptyObject(user)){
            // REGISTRY ONLY TO BE REMOVED WITH MANIFOLD-V2
		    $.post("/rest/myslice:user/",{'filters':{'user_hrn':'$user_hrn'}}, function( data ) {
			    //myslice.user = new user(data[0]);
			    localStorage.setItem('user', JSON.stringify(data[0]));
                myslice.loadSlices(data[0].slices);
		    });
        }
	},
    getSlices: function(name) {
    	
    },
    
    refreshUser: function() {
    	
    },
    
    apply: function() {

    	//$('div#loading').show();
    	//this.pending = [];
    	//this.save();
    	//setTimeout(function(){
    		//$('div#loading').hide();
    		//window.location.href = '/resources/' + this.slice + '?message=true';
    		//},6000);
    	
    	 

    	 $.post("/rest/slice/", { 'fields': ['resource','slice_hrn'], 'filters': { 'slice_hrn' : this.slice  } }, function(data) {
    		 console.log(data);
    		 resources = [];
    		 reserved = [];
    		 update = [];
    		 if ('resource' in data[0]) {
    			 $.each(data[0].resource, function(idx, r) {
    				 resources.push(r.urn);
    			 });
    		 }
    		 //myslice.pending
    		 console.log(myslice.pending);
    		 console.log(resources);
    		 $.each(resources.concat(myslice.pending), function(idx, v) {
    			 update.push( v );
    		 });
    		 console.log(update);
    		 $.post("/update/slice/", { 'filters': { 'slice_hrn' : myslice.slice  }, 'params' : update }, function(data) {
    			 console.log(data);
    		 });
    	 });
    	console.log(this.slice);
    }
    
};


/* MySlice Init */

// var Reflector = function(obj) {
  // this.getProperties = function() {
    // var properties = [];
    // for (var prop in obj) {
      // if (typeof obj[prop] != 'function') {
        // properties.push(prop);
        // console.log("prop: " + prop);
      // } else {
      	// console.log("func: " + prop);
      // }
    // }
    // return properties;
  // };
// };
// var reflector = new Reflector(myslice.slices[0].resources.pending);
// reflector.getProperties();


$(document).ready(function() {
	//console.log(myslice.user().slices);
	
	// $.post("/rest/user/",{'filters':{'user_hrn':'$user_hrn'}}, function(data) {
		// myslice.user = new user(data[0]);
		// console.log(myslice.user.slices);
		// myslice.user.list();
// 	  
	// }).fail(function() {
		// throw "error retreiving user data";
	// });
	// Put the object into storage
	//localStorage.setItem('testObject', JSON.stringify(testObject));

	// Retrieve the object from storage
	//myslice.load();

});

/* EXEMPLES */
// add a resource to pending

//myslice.user.slice('ple.upmc.myslicedemo').resources.pending.add(resource);

