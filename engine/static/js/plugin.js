function getMetadata(){
    return all_headers;
}
// returns all fields of a given method
function getMetadata_fields(method){
    var result=new Array();
    jQuery.each(all_headers, function(m,obj){
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
}
// returns all properties of a given field
function getMetadata_field(method, field){
    //console.log(all_headers);
    var result=new Array();
    jQuery.each(all_headers, function(m,obj){
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
}
// returns the value of a property from a field within a method (type of object : resource,node,lease,slice...)
function getMetadata_property(method, field, property){
    //console.log(all_headers);
    var result=null;
    jQuery.each(all_headers, function(m,obj){
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
    //all_headers[method]['column']
    //[field][]
}
