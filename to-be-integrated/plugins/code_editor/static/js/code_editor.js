/**
 * Description: CodeEditor plugin
 * Copyright (c) 2012 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

/*
 * It's a best practice to pass jQuery to an IIFE (Immediately Invoked Function
 * Expression) that maps it to the dollar sign so it can't be overwritten by
 * another library in the scope of its execution.
 */

(function($){

     var default_code_mirror_options = {
       gutters: ["note-gutter", "CodeMirror-linenumbers"],
       tabSize: 4,
       indentUnit: 4,
       matchBrackets: true,
       lineNumbers: true,
       lineWrapping: true,
       tabMode: 'spaces' // or 'shift'
     };

    
    // routing calls
    jQuery.fn.CodeEditor = function( method ) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			jQuery.error( 'Method ' +  method + ' does not exist on jQuery.CodeEditor' );
		}    
    };

    /***************************************************************************
     * Public methods
     ***************************************************************************/

    var methods = {

        /**
         * @brief Plugin initialization
         * @param options : an associative array of setting values
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        init : function ( options ) {

            /* Default settings */
            var options = $.extend( {
                useCodeMirror: true,
                codeMirrorOptions: default_code_mirror_options,
                syntaxHighlighting: []
            }, options);

            return this.each(function() {

                var $this = $(this);

                /* An object that will hold private variables and methods */
                var plugin = new CodeEditor(options);
                $this.data('Manifold', plugin);

                /* Events */
                $this.on('show.CodeEditor', methods.show);

            }); // this.each
        }, // init

        /**
         * @brief Plugin destruction
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        destroy : function( ) {

            return this.each(function() {
                var $this = $(this);
                var hazelnut = $this.data('Manifold');

                // Unbind all events using namespacing
                $(window).unbind('Manifold');

                // Remove associated data
                hazelnut.remove();
                $this.removeData('Manifold');
            });
        }, // destroy

        show : function( ) {
            var $this=$(this);
            // xxx wtf. why [1] ? would expect 0...
            if (debug)
                messages.debug("Hitting suspicious line in hazelnut.show");
            var oTable = $($('.dataTable', $this)[1]).dataTable();
            oTable.fnAdjustColumnSizing()

            /* Refresh dataTabeles if click on the menu to display it : fix dataTables 1.9.x Bug */
            $(this).each(function(i,elt) {
                if (jQuery(elt).hasClass('dataTables')) {
                    var myDiv=jQuery('#hazelnut-' + this.id).parent();
                    if(myDiv.height()==0) {
                        var oTable=$('#hazelnut-' + this.id).dataTable();
                        oTable.fnDraw();
                    }
                }
            });
        } // show

    }; // var methods;

    /***************************************************************************
     * Plugin object
     ***************************************************************************/

    function CodeEditor(options)
    {
      
        this.initialize = function() {
            this.validationTooltip;
        
            // switch off CodeMirror for IE
            //if (Browser.Engine.trident) options.useCodeMirror = false;
            this.element = $('#' + this.options.plugin_uuid + '-textarea')[0]; // jordan added [0] for jquery
            if (!this.options.syntaxHighlighting.contains(this.options.language)) {
                this.forceDefaultCodeMirrorOptions();
            }
            //this.setOptions(this.options);
            var is_disallowed = (disallowedPlatforms.contains(Browser.Platform.name));
            if (this.options.useCodeMirror && !is_disallowed) {
                // hide textarea
                this.element.hide();
                // prepare settings
                if (!this.options.codeMirrorOptions.stylesheet && this.options.stylesheet) {
                    this.options.codeMirrorOptions.stylesheet = this.options.stylesheet.map(function(path) {
                        return mediapath + path;
                    });
                }
                if (!this.options.codeMirrorOptions.path) {
                    var codemirrorpath = ''; // jordan
                    this.options.codeMirrorOptions.path = codemirrorpath + 'js/';
                }
                if (!this.options.codeMirrorOptions.content) {
                    this.options.codeMirrorOptions.content = this.element.get('value');
                }
          
                var parentNode = this.element.getParent();
                var options = { value: this.element.value };
                options = Object.append(options, this.options.codeMirrorOptions);
                this.editor = CodeMirror(parentNode, options);
          
                // run this after initialization
                if (!this.options.codeMirrorOptions.initCallback){
                    if (this.options.codeMirrorOptions.autofocus) {
                        // set current editor
                        Layout.current_editor = this.options.name;
                    }
                }
          
                // set editor options that can only be set once the editor is initialized
                var cur = this.editor.getLineHandle(this.editor.getCursor().line);
                this.setEditorEvents({
                    focus: function(){
                        Layout.current_editor = this.options.name;
                        // this.editor.removeLineClass(cur, 'background', 'activeline');
                        // this.editor.hlLine = this.editor.addLineClass(0, "background", "activeline");
                    },
                    cursorActivity: function(){
                        // var cur = this.editor.getLineHandle(this.editor.getCursor().line);
                        // if (cur != this.editor.hlLine) {
                        //   this.editor.removeLineClass(this.editor.hlLine, 'background', 'activeline');
                        //   this.editor.hlLine = this.editor.addLineClass(cur, 'background', 'activeline');
                        // }
                    },
                    blur: function(){
                        // this.editor.removeLineClass(this.editor.hlLine, 'background', 'activeline');
                    },
                    change: function(){
                        this.validateEditorInput.call(this, parentNode);
                        window.editorsModified = true;
                    }.bind(this)
                });
          
                // disable new line insertion when saving fiddle
                CodeMirror.keyMap.default['Ctrl-Enter'] = function(){
                    return false;
                };
        
                // don't let Emmet capture this
                delete CodeMirror.keyMap.default['Cmd-L'];
            }
        
            this.editorLabelFX = new Fx.Tween(this.getLabel(), {
                property: 'opacity',
                link: 'cancel'
            });
        
            this.getWindow().addEvents({
                mouseenter: function() {
                    this.editorLabelFX.start(0);
                }.bind(this),
                mouseleave: function() {
                    this.editorLabelFX.start(0.8);
                }.bind(this)
            });
        
            // jordan commented
            //    mooshell.addEvents({
            //      'run': this.b64decode.bind(this)
            //    });
        
            Layout.registerEditor(this);
            this.setLabelName(this.options.language || this.options.name);
        },
      
        /**
         *
         */
        this.validateEditorInput = function(parentNode){
            var currentValue = this.getCode();
            var warnings = [];
      
            // destroy tooltip if it already exists for this editor
            if (this.validationTooltip){
                this.validationTooltip.destroy();
            }
      
            // create the container
            this.validationTooltip = Element('ul', {
                'class': 'warningTooltip'
            });
      
            // collect warnings
            Object.each(this.options.disallowed, function(value, key){
                if (currentValue.test(key, 'i')){
                    warnings.push('<li>' + value + '</li>');
                }
            });
      
            // inject container
            this.validationTooltip = this.validationTooltip.inject(parentNode);
      
            // squash and apply warnings
            this.validationTooltip.set({
                html: warnings.join('')
            });
        },
      
        /**
         *
         */
        this.getEditor = function() {
            return this.editor || this.element;
        },
      
        /**
         *
         */
        this.getWindow = function() {
            if (!this.window) {
                this.window = this.element.getParent('.window');
            }
            return this.window;
        },
      
        /**
         *
         */
        this.getLabel = function() {
            return this.getWindow().getElement('.window_label');
        },
      
        /**
         *
         */
        this.b64decode = function() {
            this.element.set('value', this.before_decode);
        },
      
        /**
         *
         */
        this.getCode = function() {
            return (this.editor) ? this.editor.getValue() : this.element.get('value');
        },
      
        /**
         *
         */
        this.updateFromMirror = function() {
            this.before_decode = this.getCode();
            this.element.set('value', Base64.encode(this.before_decode));
        },
      
        /**
         *
         */
        this.updateCode = function() {
            this.element.set('value', this.getCode());
        },
      
        /**
         *
         */
        this.clean = function() {
            this.element.set('value', '');
            this.cleanEditor();
        },
      
        /**
         *
         */
        this.cleanEditor = function() {
            if (this.editor) this.editor.setCode('');
        },
      
        /**
         *
         */
        this.hide = function() {
            this.getWindow().hide();
        },
      
        this.show = function() {
            this.getWindow().show();
        },
      
        /**
         *
         */
        this.setEditorOptions = function(options){
            Object.each(options, function(fn, key){
                this.editor.setOption(key, fn.bind(this));
            }, this);
        },
      
        /**
         *
         */
        this.setEditorEvents = function(e){
            Object.each(e, function(fn, key){
                this.editor.on(key, fn.bind(this));
            }, this);
        },
      
        /**
         *
         */
        this.setLanguage = function(language) {
            // Todo: This is hacky
            this.setLabelName(language);
        },
      
        /**
         *
         */
        this.setLabelName = function(language) {
            this.getLabel().set('text', this.window_names[language] || language);
        },
      
        /**
         *
         */
        this.setStyle = function(key, value) {
            if (this.editor) return $(this.editor.frame).setStyle(key, value);
            return this.element.setStyle(key, value);
        },
      
        /**
         *
         */
        this.setStyles = function(options) {
            if (this.editor) return $(this.editor.frame).setStyles(options);
            return this.element.setStyles(options);
        },
      
        /**
         *
         */
        this.setWidth = function(width) {
            this.getWindow().setStyle('width', width);
        },
      
        /**
         *
         */
        this.setHeight = function(height) {
            this.getWindow().setStyle('height', height);
        },
      
        /**
         *
         */
        this.getPosition = function() {
            if (this.editor) return $(this.editor.frame).getPosition();
            return this.element.getPosition();
        },
      
        /**
         *
         */
        this.forceDefaultCodeMirrorOptions = function() {
            this.options.codeMirrorOptions = default_code_mirror_options;
        }

        // BEGIN CONSTRUCTOR

        /* member variables */
        this.options = options;

        var object = this;

        // adapted from EditorCM.js from jsfiddle.net

        var disallowedPlatforms = ['ios', 'android', 'ipod'];

        this.window_names = {
          'javascript': 'JavaScript',
          'html': 'HTML',
          'css': 'CSS',
          'scss': 'SCSS',
          'coffeescript': 'CoffeeScript',
          'javascript 1.7': 'JavaScript 1.7'
        };

        this.initialize();
        // END CONSTRUCTOR
    } // function CodeEditor

})( jQuery );

