jQuery(function ($) {
    
    var x = 100000000; 
    var count = 0;
var gid;
    var me = this;
    var conexion_selecionada = null;
    var objeto_selecionado = null;
    var windows;
    var arrow_style = "Straight";

	$( "#sortable-element li" ).draggable({
        appendTo: "body",
        helper: function() {
            return $("<ul class='sortable-element'></ul>").append( $(this).clone() );
        }
    });

    $( "#editor" ).droppable({
        accept: "#sortable-element li",
        drop: function(event,ui){
            var nodetype;
            var input;
            var type = $(ui.draggable).attr('attr-type');
            var clase = 'diagrama';
            count++;

            switch(type){
                case "actor":
                    clase = 'actor';
					nodetype=false;
                break;
				case "wireless":
                    clase = 'wireless';
					nodetype=true;
                break;
				case "openflow":
                    clase = 'openflow';
					nodetype=false;
                break;
                default:
                    clase = 'diagrama';
					nodetype=false;
                break;
            }
//objeto_selecionado = this;
		nodeid(0,0,count);
        console.log(count);
		getItemsList(count,nodetype);
		console.log(count);
		readItemsList(count);
            input = "<span> Node-"+count+"</span>"+
                    "<div class='connect'></div>";
          
            $(" <div style='"+posicion_drop(ui)+"' id='"+count+"' class='objeto "+clase+"'></div> ").append(input).appendTo(this);
            workflow();
        }
    });


    $("body").on('dblclick','.objeto span',function(){
        var texto = prompt("Title");
		//var text2 = prompt("Title2");
        $(this).html(texto);
    });
	    $("body").on('click','#editor',function(){
		
        $("#menu").hide();
    });
/*$(document).bind("contextmenu", function(event) { 
    event.preventDefault();
    $("<div class='custom-menu'>Custom menu</div>")
        .appendTo("body")
        .css({top: event.pageY + "px", left: event.pageX + "px"});
}).bind("click", function(event) {
    $("div.custom-menu").hide();
});
*/
	// Trigger action when the contexmenu is about to be shown
$("body").on("contextmenu",'.objeto', function (event) {
    objeto_selecionado = this;
		nodeid(0,0,this.id);
       readItemsList(this.id);
		gid=this.id;
    // Avoid the real one
    event.preventDefault();
    
    // Show contextmenu
    $("#cssmenu").finish().toggle(100).
    
    // In the right position (the mouse)
	
    css({
        top: event.pageY-150 + "px",
        left: event.pageX-450 + "px"
    });
	console.log(this.id);
	
});


// If the document is clicked somewhere
$("body").bind("mousedown",'.objeto', function (e) {
    
    // If the clicked element is not the menu
    if (!$(e.target).parents("#cssmenu").length > 0) {
        
        // Hide it
        $("#cssmenu").hide(100);
    }
});


// If the menu element is clicked
$("#cssmenu li").click(function(){
   
    // This is the triggered action name
    switch($(this).attr("data-action")) {
        
        // A case for each action. Your actions here
        case "first":document.getElementById('testbet').value="";getItemsList(gid); break;
        case "second":document.getElementById('testbet').value="omf:netmode";getItemsList(gid); break;
        case "third": alert("third"); break;
    }
  
    // Hide it AFTER the action was triggered
    $("#cssmenu").hide(100);
  });
	
 $("body").on('dblclick','.objeto',function(){
 //$("#menu").hide();
 $( "#menu" ).offset({ top: -10, left: -10 });
 //console.log(this.name);
 console.log(this.offsetTop);
 var t = this.offsetTop;
var l = this.offsetLeft;
 //var x = $(this.name).position();
//console.log(x.top);
$( "#menu" ).offset({ top: t, left: l });
    $menu.menu();
	$("#menu").show();

 });
    $("body").on('click','.objeto',function(){
		$('.objeto').contextMenu(menu);
        objeto_selecionado = this;
		nodeid(0,0,this.id);
       
		//getItemsList(this.id);
		console.log(menu);
		
		
    });

    
    workflow = function(){
        
        jsPlumb.importDefaults({
            Endpoint : ["Dot", {radius:2}],
            HoverPaintStyle : {strokeStyle:"#1e8151", lineWidth:0 },
            
        });       

        windows = jsPlumb.getSelector('.objeto');
        
        jsPlumb.makeSource(windows, {

            filter:".connect",               
            anchor:"Continuous",
            connector:[ arrow_style, { curviness:63 } ],
            connectorStyle:{ 
                strokeStyle:"#5c96bc", 
                lineWidth:2, 
                outlineColor:"transparent", 
                outlineWidth:4
            },
			connectorOverlays:[ 
      [ "Label", { label:"", id:"label" } ]
    ],
            isTarget:true,
            dropOptions : targetDropOptions
            
        }); 

        jsPlumb.makeTarget(windows, {
            dropOptions:{ hoverClass:"dragHover" },
            anchor: "Continuous"             
        });


        var targetDropOptions = {
            tolerance:'touch',
            hoverClass:'dropHover',
            activeClass:'dragActive'
        };
        
        
        me.arrastrable();


        jsPlumb.bind("click", function(conn, originalEvent) {
            conexion_selecionada = conn;
            console.log(this);
            me.menu_arrow();
        });
    }


    posicion_drop = function(ui){
        var top = parseInt(ui.position['top'], 10) - 250;
        var left = parseInt(ui.position['left'], 10) - 560;
        var style = 'position:absolute;top:' + top + 'px;left:' + left + 'px;'
        return style;
    }

    
    
    $(document).keyup(function(e){
        if(e.keyCode == 46){
            if(conexion_selecionada != null){
                jsPlumb.detach(conexion_selecionada);
                conexion_selecionada = null;
				$("#menu").hide();
            }

            if(objeto_selecionado != null){
                jsPlumb.remove(objeto_selecionado);
				resetForm('',objeto_selecionado.id);
				console.log(objeto_selecionado.id);
                objeto_selecionado = null;
            }
        }

        console.log(jsPlumb.getSelector('.objeto'));
    }) 


    //Menu de opciones en la conexión (flecha,unión)
    me.menu_arrow = function(){
        $.contextMenu({
            selector: '._jsPlumb_connector ',
            trigger: 'left',
            callback: function(key, options) {
                var m = key;
                me.menu_accion(key);
            },
            items: {
                
                "fold1":{
                    "name": "Conector", 
                    "items": {
                        "flecha":   {"name": "Recto"},
                        "diagrama": {"name": "Diagrama"},
                        "ondular":  {"name": "Ondular"},
                        "cursiva":  {"name": "Cursiva"},
                    }
                },
                "fold1a": {
                    "name": "Estilo", 
                    "items": {
                        "solido":       {"name": "Solido"},
                        "discontinua":  {"name": "Discontinua"}
                    }
                },
                "sep1": "---------",
                "Eliminar":{"name": "Eliminar", "icon": "delete"},
            }
        });
    }


    me.menu_accion = function(accion){
        console.log(conexion_selecionada);
        if(accion == "Eliminar"){
            jsPlumb.detach(conexion_selecionada, {
                fireEvent: false, 
                forceDetach: false 
            })
        }

        if(accion == "flecha"){
            conexion_selecionada.setConnector("Straight");
        }

        if(accion == "diagrama"){
            conexion_selecionada.setConnector("Flowchart");
        }

        if(accion == "ondular"){
            conexion_selecionada.setConnector("Bezier");
        }

        if(accion == "cursiva"){
            conexion_selecionada.setConnector("StateMachine");
        }

        if(accion == "discontinua"){
            conexion_selecionada.setPaintStyle({ 
                strokeStyle:"#000", 
                lineWidth:2, 
                outlineColor:"transparent", 
                outlineWidth:4,
                dashstyle: "4 2"
            });
        }

        if(accion == "solido"){
            conexion_selecionada.setPaintStyle({ 
                strokeStyle:"#000", 
                lineWidth:2, 
                outlineColor:"transparent", 
                outlineWidth:4
            });
        }

    }
        
    me.arrastrable = function(){
        jsPlumb.draggable($(".objeto"), {
		
          containment:"editor"
        });
    }

var menu = [{
        name: 'create',
        img: 'images/create.png',
        title: 'create button',
        fun: function () {
            alert('i am add button')
        }
    }, {
        name: 'update',
        img: 'images/update.png',
        title: 'update button',
        subMenu: [{
            name: 'merge',
            title: 'It will merge row',
            img:'images/merge.png',
            fun: function () {
                alert('It will merge row')
            }
        }, {
            name: 'replace',
            title: 'It will replace row',
            img:'images/replace.png',
            subMenu: [{
                name: 'replace top 100',
                img:'images/top.png',
                fun:function(){
                alert('It will replace top 100 rows');
                }
 
            }, {
                name: 'replace all',
                img:'images/all.png',
                fun:function(){
                alert('It will replace all rows');
                }
            }]
        }]
    }, {
        name: 'delete',
        img: 'images/delete.png',
        title: 'create button',
        subMenu: [{
            'name': 'soft delete',
            img:'images/soft_delete.png',
            fun:function(){
            alert('You can recover back');
            }
        }, {
            'name': 'hard delete',
            img:'images/hard_delete.png',
            fun:function(){
            alert('It will delete permanently');
            }
        }]
 
    }];
     
//Calling context menu
 
	
    var getMenuItem = function (itemData) {
	console.log(itemData);
        var item = $("<li>")
            .append(
        $("<a>", {
            href: '#' + itemData.link,
            html: itemData.name
        }));
        if (itemData.sub) {
            var subList = $("<ul>");
            $.each(itemData.sub, function () {
                subList.append(getMenuItem(this));
            });
            item.append(subList);
        }
        return item;
    };
    
    var $menu = $("#menu");
    $.each(data.menu, function () {
        $menu.append(
            getMenuItem(this)
        );
		
		
    });
	
	
	$("#menu").hide();
});