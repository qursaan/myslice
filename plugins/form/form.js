// Jquery for the Registration page. /views/register/tmpl/deafult.php
jQuery(document).ready(function(){
    
    jQuery("#commentForm").validate({
        rules: {
          password: { 
                required: true
          }, 
          confirmpassword: { 
                required: true, equalTo: "#password"
          }
        }
    });
    // upload button
    jQuery("#question").change(function(){
        if(this.value=="upload"){
            jQuery("#upload_key").show();
        }else{
            jQuery("#upload_key").hide();
        }
    });

});
