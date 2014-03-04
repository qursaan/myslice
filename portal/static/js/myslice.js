/*
 * MySlice Class
 */

var myslice = {
	slice: null,
    pending: [],
    reserved: [],
    
    add: function(resource) {
    	if (!this.has(resource)) {
    		this.pending.push(resource);
    		this.save();
    	}
    },
    
    del: function(resource) {
    	if (this.has(resource)) {
    		this.pending.splice(index, 1);
    	}
    },
    
    has: function(resource) {
    	index = jQuery.inArray( resource, this.pending );
    	if (index != -1) {
    		return true;
    	}
    	return false;
    },
    
    count: function() {
    	return this.pending.length;
    },
    
    save: function() {
    	localStorage.setItem('pending', JSON.stringify(this.pending));
    },
    
    load: function() {
    	this.pending = JSON.parse(localStorage.getItem('pending'));
    	if (!this.pending) {
    		this.pending = [];
    	}
    },
    
    apply: function() {
    	$('div#loading').show();
    	this.pending = [];
    	this.save();
    	setTimeout(function(){
    		$('div#loading').hide();
    		window.location.href = '/resources/' + this.slice + '?message=true';
    		},6000);
    	
    	 

    	// $.post("/rest/slice/", { 'fields': ['resource','slice_hrn'], 'filters': { 'slice_hrn' : this.slice  } }, function(data) {
    		// console.log(data);
    		// resources = [];
    		// reserved = [];
    		// update = [];
    		// if ('resource' in data[0]) {
    			// $.each(data[0].resource, function(idx, r) {
    				// resources.push(r.urn);
    			// });
    		// }
    		// //myslice.pending
    		// console.log(myslice.pending);
    		// console.log(resources);
    		// $.each(resources.concat(myslice.pending), function(idx, v) {
    			// update.push({ 'resource': v });
    		// });
    		// console.log(update);
    		// $.post("/update/slice/", { 'filters': { 'slice_hrn' : myslice.slice  }, 'params' : update }, function(data) {
    			// console.log(data);
    		// });
    	// });
    	//console.log(this.slice);
    }
    
};

$(document).ready(function() {
	// Put the object into storage
	//localStorage.setItem('testObject', JSON.stringify(testObject));

	// Retrieve the object from storage
	myslice.load();

});
