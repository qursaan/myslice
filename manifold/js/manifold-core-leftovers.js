/*
 * This file is included in tophat_render.php
 */

/* getting random error messages with this... -- jordan
   wait until query code is fixed
jQuery(document).ready(function() {
    // ajax default settings
    jQuery.ajaxSetup({
        timeout: 3000,
        error:function(x,e){
            if('parsererror'==e) {
                alert('Sorry, we ran into a technical problem (parse error). Please try again...');
            } else if('timeout'==e) {
                alert('Request timed out. Please try again...');
            }
            else if ( "status" in x ) {
                if(0 == x.status){
                    alert('You are offline! Please check your network.');
                }else if (404 == x.status){
                    alert('Sorry, we ran into a technical problem (404). Please try again...');
                }else if(500 == x.status){
                    alert('Sorry, we ran into a technical problem (500). Please try again...');
                }
            }
            else {
                alert('Sorry, we ran into a technical problem (unknown error). Please try again...');
            }
        }
    });
});
*/

/*
From: http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
    I want to note that the .clone() method in jQuery only clones DOM elements. In order to clone JavaScript objects, you would do:

    // Shallow copy
    var newObject = jQuery.extend({}, oldObject);

    // Deep copy
    var newObject = jQuery.extend(true, {}, oldObject);

    More information can be found in the jQuery documentation <http://docs.jquery.com/Utilities/jQuery.extend>
*/
function clone_object(obj) {
    return jQuery.extend(true, {}, obj);
}

function executeFunctionByName(functionName, context /*, args */) {
  var args = Array.prototype.slice.call(arguments).splice(2);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for(var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(this, args);
}
