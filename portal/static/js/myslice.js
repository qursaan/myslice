/*
 * MySlice Class
 */

function list() {
	this.elements = [];
}

list.prototype.save = function() {
	for (var prop in this) {
      if (typeof this[prop] != 'function') {
        console.log("prop: " + prop);
      } else {
      	console.log("func: " + prop);
      }
    }
	//localStorage.setItem(name, JSON.stringify(value));
};

list.prototype.load = function(name) {
	this.pending = JSON.parse(localStorage.getItem(name));
	if (!this.pending) {
		this.pending = [];
	}
};

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

function users() {
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

/*
 * Slice
 */
function slice(name) {
	this.name = name;
	this.resources = new resources();
	this.users = new users();
	this.leases = new leases();
	
};
slice.prototype.pending = function() {
	
};
slice.prototype.reserve = function() {
	
};
slice.prototype.unreserve = function() {
	
};

/*
 * User
 */
function user(u) {
	this.u = u;
	this.testbeds = {};
	this.slices = {};
	
	for (i = 0; i < this.u.slices.length; i++) {
		this.slices[this.u.slices[i]] = new slice(this.u.slices[i]);
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
    
    getSlices: function(name) {
    	
    },
    
    refreshUser: function() {
    	
    },
    
    apply: function() {
    	$('div#loading').show();
    	this.pending = [];
    	this.save();
    	// setTimeout(function(){
    		// $('div#loading').hide();
    		// window.location.href = '/resources/' + this.slice + '?message=true';
    		// },6000);
    	
    	 

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
    			update.push({ 'resource': v });
    		});
    		console.log(update);
    		$.post("/update/slice/", { 'filters': { 'slice_hrn' : 'ple.upmc.myslicedemo'  }, 'params' : update }, function(data) {
    			console.log(data);
    		});
    	});
    	//console.log(this.slice);
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

myslice.user.slice('ple.upmc.myslicedemo').resources.pending.add(resource);

