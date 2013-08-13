/*
                        *********
 ******* JQuery for the MySlice [Local] account buttons ********************* 
                        ********
Authors:
  Mohammed Yasin Rahman <mohammed-yasin.rahman@lip6.fr>
Copyright 2013, UPMC Sorbonne Universités / LIP6
   
 */

jQuery(document).ready(function(){
                      // jquery functionalities of different buttons [Edit, Cancel, Upload]
                      //edit name
                      jQuery("#edit_name").click(function(){

                              jQuery("#span_name").show();
                              jQuery("#nameval").hide();
                              jQuery("#edit_name").hide();
                              // enforcing when one edit is clicked the rest will not work at same time
                              jQuery("#span_pass").hide();
                              jQuery("#edit_pass").show();
                              jQuery("#passval").show();
                              jQuery("#span_aff").hide();
                              jQuery("#edit_aff").show();
                              jQuery("#affval").show();
                              jQuery("#span_email").hide();
                              jQuery("#edit_email").show();
                              jQuery("#emailval").show();
                              jQuery("#span_upload").hide();
                              jQuery("#keyval").show();
                              jQuery("#dl_file").show();
                              jQuery("#upload_file").show();
                      });
                      jQuery("#cancel_name_change").click(function(){

                              jQuery("#span_name").hide();
                              jQuery("#nameval").show();
                              jQuery("#edit_name").show();


                      });
                      //edit pass
                      jQuery("#edit_pass").click(function(){

                              jQuery("#span_pass").show();
                              jQuery("#passval").hide();
                              jQuery("#edit_pass").hide();
                              // enforcing when one edit is clicked the rest will not work at same time
                              jQuery("#span_name").hide();
                              jQuery("#edit_name").show();
                              jQuery("#nameval").show();
                              jQuery("#span_aff").hide();
                              jQuery("#edit_aff").show();
                              jQuery("#affval").show();
                              jQuery("#span_email").hide();
                              jQuery("#edit_email").show();
                              jQuery("#emailval").show();
                              jQuery("#span_upload").hide();
                              jQuery("#keyval").show();
                              jQuery("#dl_file").show();
                              jQuery("#upload_file").show();
                      });
                      jQuery("#cancel_pass_change").click(function(){

                              jQuery("#span_pass").hide();
                              jQuery("#passval").show();
                              jQuery("#edit_pass").show();
                      });
                      // both password should be same
                      jQuery("#editForm").validate({
                        rules: {
                            password: { 
                                required: true
                                }, 
                            confirmpassword: { 
                                required: true, equalTo: "#password"
                                }
                            }
                      });
                      //edit affiliation
                      jQuery("#edit_aff").click(function(){

                              jQuery("#span_aff").show();
                              jQuery("#affval").hide();
                              jQuery("#edit_aff").hide();
                              // enforcing when one edit is clicked the rest will not work at same time
                              jQuery("#span_pass").hide();
                              jQuery("#edit_pass").show();
                              jQuery("#passval").show();
                              jQuery("#span_name").hide();
                              jQuery("#edit_name").show();
                              jQuery("#nameval").show();
                              jQuery("#span_email").hide();
                              jQuery("#edit_email").show();
                              jQuery("#emailval").show();
                              jQuery("#span_upload").hide();
                              jQuery("#keyval").show();
                              jQuery("#dl_file").show();
                              jQuery("#upload_file").show();
                      });
                      jQuery("#cancel_aff_change").click(function(){

                              jQuery("#span_aff").hide();
                              jQuery("#affval").show();
                              jQuery("#edit_aff").show();
                      });
                      //edit email
                      /* edit email will be done by PI if needed
                      jQuery("#edit_email").click(function(){

                              jQuery("#span_email").show();
                              jQuery("#emailval").hide();
                              jQuery("#edit_email").hide();
                              // enforcing when one edit is clicked the rest will not work at same time
                              jQuery("#span_pass").hide();
                              jQuery("#edit_pass").show();
                              jQuery("#passval").show();
                              jQuery("#span_aff").hide();
                              jQuery("#edit_aff").show();
                              jQuery("#affval").show();
                              jQuery("#span_name").hide();
                              jQuery("#edit_name").show();
                              jQuery("#nameval").show();
                              jQuery("#span_upload").hide();
                              jQuery("#keyval").show();
                              jQuery("#dl_file").show();
                              jQuery("#upload_file").show();
                      });
                      jQuery("#cancel_email_change").click(function(){

                              jQuery("#span_email").hide();
                              jQuery("#emailval").show();
                              jQuery("#edit_email").show();
                      }); */
                      //upload pub keys
                      jQuery("#upload_file").click(function(){

                              jQuery("#span_upload").show();
                              jQuery("#dl_file").hide();
                              jQuery("#upload_file").hide();
                              jQuery("#keyval").hide();
                              // enforcing when one edit is clicked the rest will not work at same time
                              jQuery("#span_name").hide();
                              jQuery("#edit_name").show();
                              jQuery("#nameval").show();
                              jQuery("#span_pass").hide();
                              jQuery("#edit_pass").show();
                              jQuery("#passval").show();
                              jQuery("#span_aff").hide();
                              jQuery("#edit_aff").show();
                              jQuery("#affval").show();
                              jQuery("#span_email").hide();
                              jQuery("#edit_email").show();
                              jQuery("#emailval").show();
                      });
                      jQuery("#cancel_upload").click(function(){

                              jQuery("#span_upload").hide();
                              jQuery("#keyval").show();
                              jQuery("#dl_file").show();
                              jQuery("#upload_file").show();
                      });
                  });

// alert box for the "Generate new Key Pair button"
function myFunction()
{
alert("You have requested to generate new key pairs. Please download and save the new keypairs after receiving the success message.");
}

function emailAlert()
{
alert("To edit email please contact the administratior. You will be redirected to the support page now");
window.location.href = "/support";
}

function affAlert()
{
alert("To edit affiliation please contact the administratior. You will be redirected to the support page now");
window.location.href = "/support";
}
/*
 // alert having ok or cancel option
function show_confirm()
{
var r=confirm("Press a button!");
if (r==true)
  {
  alert("You pressed OK!");
  }
else
  {
  alert("You pressed Cancel!");
  }
}
*/


