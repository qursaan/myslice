function ape_initialize(){
	client = new APE.Controller();
};
		
function ape_load(){
	client.load({
		identifier: 'action'
	})
}


APE.Controller = new Class({
	Extends: APE.Client,	
	Implements: Options,	
	options: {
		container: null
	},	
	initialize: function(options){
		var j = jQuery.noConflict();
		this.setOptions(options);
		this.addEvent('load',this.start);
		this.onRaw('postmsg', this.onMsg);
		this.addEvent('ape_join',this.ape_join);
		this.addEvent('ape_leave',this.ape_leave);
		this.addEvent('ape_quit',this.ape_quit);
		this.addEvent('multiPipeCreate', function( pipe,options) {
    		console.log(pipe.getPubid());
    		console.log(options.pipe.properties.name);
			var myCookie = Cookie.write(options.pipe.properties.name,pipe.getPubid());
			});
	},
	
	start: function(core){
		this.core.start({'name': $time().toString()});
		channel_name = [];
		channel_id = [];
	},
	

	
	ape_join: function(channel_id){
		// il faut aussi initialier le tableau du canal
		// TODO 
		this.core.join(channel_id);		
	},
	
	ape_leave: function(channel_id){
		var myCookie = Cookie.read(channel_id);
		this.core.left(myCookie);
		Cookie.dispose(channel_id);		
	},
	
	ape_quit: function(){
		this.core.quit();		
	},
	
	
	onMsg: function(raw){
		/**console.log(raw);
		console.log(raw.data.message);
		console.log(raw.data.message['ape_position']);
		console.log(raw.data.message[0].ape_position[0].latitude);**/
		recup_direct(raw,channel_id,"dynamic")
		/**switch(raw.data.print_method)
		{
			case 'line':
				j("#test").append("line");
				g_map_printLine(raw);
				break;
			case 'circle':
				 j("#test").append("circle");
				//g_map_printCircle(data.item[i]);
				break;
			case 'marker':
				j("#test").append("marker");
				g_map_printMarker(raw);
				break;
		}**/
	
		
		
		
		
	}
	
	
	
	
});
