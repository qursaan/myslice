/**
 * Description: implements a wizard-like interface
 * Copyright (c) 2012 UPMC Sorbonne Universite
 * License: GPLv3
 */

/*
 * It's a best practice to pass jQuery to an IIFE (Immediately Invoked Function
 * Expression) that maps it to the dollar sign so it can't be overwritten by
 * another library in the scope of its execution.
 */

(function($){
    // routing calls
    $.fn.Wizard = function( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.Wizard' );
        }    
    };

    /***************************************************************************
     * Public methods
     ***************************************************************************/

    var methods = {

        init : function ( options ) {
            return this.each(function() {
                var $this = $(this);

                // Initialize the smart-wizard third-party jquery plugin
                $(wizard, this).smartWizard({
                    selected    : options.start_step - 1,
                    errorSteps  : [5],
                    onLeaveStep : leaveAStepCallback,
//                  onFinish    : onFinishCallback
                });

                // XXX Mark some steps as done !
                $(wizard, this).smartWizard('setDone',{stepnum: 1, isdone:true});

                function leaveAStepCallback(obj){
                    var step_num= obj.attr('rel')-1; // get the current step number
                    func = options.validate_step_js[step_num];
                    if (func == 'null')
                        return true;
                    return window[func]();
                }

                function onFinishCallback(){
                    window.location.href('/');
                }


            }); // this.each
        } // init

    };
})( jQuery );
