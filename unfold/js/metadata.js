// MANIFOLD_METADATA was formerly known as all_headers
var metadata = {
    get : function () {
	return MANIFOLD_METADATA;
    },
    // returns all fields of a given method
    fields : function (method) {
	var result=new Array();
	jQuery.each(MANIFOLD_METADATA, function(m,obj){
            if(m==method){
		jQuery.each(obj['column'], function(i,f){
                    result.push(f);
		});
		return false;
            }
	});
	result.sort(sort_by('column', false, function(a){return a.toUpperCase()}));
	//result=jQuery(result).sort("column", "asc");
	return result;
    },
    // returns all properties of a given field
    field : function (method, field) {
	var result=new Array();
	jQuery.each(MANIFOLD_METADATA, function(m,obj){
            if(m==method){
		jQuery.each(obj['column'], function(i,f){
                    if(f['column']==field){
			result.push(f);
			return false;
                    }
		});
		return false;
            }
	});
	return result[0];
    },
    // returns the value of a property from a field within a method (type of object : resource,node,lease,slice...)
    property : function (method, field, property) {
	var result=null;
	jQuery.each(MANIFOLD_METADATA, function(m,obj){
            if(m==method){
		jQuery.each(obj['column'], function(i,f){
                    if(f['column']==field){
			result=f[property];
			return false;
                    }
		});
		return false;
            }
	});
	return result;
    },
} // metadata object
