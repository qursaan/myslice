/*
 * MySlice Class
 */

var myslice = {
    pending: [],
    
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
    }
    
};

$(document).ready(function() {
	// Put the object into storage
	//localStorage.setItem('testObject', JSON.stringify(testObject));

	// Retrieve the object from storage
	myslice.load();

});
