function recup_sites (url)
{
		var test = false;
	if ( visible ) 
	{
		test = true;
		set_visibility (false);
	}
		bulle = [];
		opt_bulle = [] ;
		pos = [];
		x = [];
		y = [];
		name = [];

		j.getJSON(url, function(data) 
		{
			j.each(data	, function(key, val) {
	
		for ( var i= 0; i<val.length;i++)
			{
				x.push(val[i].latitude);
				y.push(val[i].longitude);
				name.push(val[i].site_id);
			}					
		});
		for ( var i=0 ; i<x.length ; i++ )
		{
			pos.push( new google.maps.LatLng(x[i], y[i]));
			opt_bulle.push ({
				position: pos[i],
				visible: visible,
				map : map,
				title : name[i]
			});
			bulle.push( new google.maps.Marker(opt_bulle[i]));
		  	google.maps.event.addListener(bulle[i], 'click', function() {
				var url = '/cgi-bin/max-perso/prod/get_site_property.py?site_id='+this.getTitle();
   			 	j.getJSON(url, function (data)
				{
					j.each( data, function ( key, val )
					{
						for ( var j=0; j<val.length ;j++ )
						{
							j("#site_name").empty();
							j("#site_name").append( val[j].name);
						}
					});
				});
			});

		}


		//var info = new google.maps.InfoWindow({content:"test"});
		//info.open( map, bulle[0]); 
		});    
		if ( test ) 
		{
		set_visibility(true);      
		}
}


