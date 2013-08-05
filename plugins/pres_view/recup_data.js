function recup_data (url,id,method)
{			
				var longueur;
				j.getJSON(url, function(data) 
				{
					j.each(data	, function(key, val) 
					{	
						switch ( val.params.data.print_method )
							{
								case 'marker' :
										pos_marker[id]= [];
										opt_marker[id]= [];
										marker[id]= [];
										ref[id] = 'marker';
								break;
								case 'line' :
										opt_line[id] =[];
										pos_line[id]= [];
										line[id]= [];
										ref[id] = 'line';
								break;
								case 'circle' :
										opt_circle[id] =[];
										pos_circle[id]= [];
										circle[id]= [];
										ref[id] = 'circle';
								break;
								default:
									alert ("unknown method");
								break;
							}	
						for ( var i= 0; i<val.params.data.message.length;i++)
						{
							var longueur;
							switch ( val.params.data.print_method )
							{
								case 'marker' :
									pos_marker[id].push( new google.maps.LatLng(val.params.data.message[i].ape_position[0].latitude,val.params.data.message[i].ape_position[0].longitude));

										opt_marker[id].push 
										({
											position: pos_marker[id][pos_marker[id].length - 1],
											visible: true,
											map : map
											//title : val.params.data.message.ape_timestamp
										});
									
									//marker[id].push( new google.maps.Marker(opt_marker[id][opt_marker[id].length - 1 ]));	
									if ( val.params.data.print_options )
									{
										opt_conf[id] = val.params.data.print_options;
									}
									
								break;
								
								case 'line' :
									for ( var j = 0 ; j < val.params.data.message[i].ape_position.length ; j++ ) 
									{
										pos_line[id].push(new google.maps.LatLng(val.params.data.message[i].ape_position[j].latitude,val.params.data.message[i].ape_position[j].longitude)) ;
									}	
									
									opt_line[id].push
									({
										path : pos_line[id] ,
										map : map,
										strokeColor: "#FF0000",
										strokeOpacity: 1.0,
										strokeWeight: 2
									})

									if ( val.params.data.print_options )
									{
										opt_conf[id] = val.params.data.print_options;
									}
									
								break;
								
								case 'circle':
									
									longueur = pos_circle[id].length;
									pos_circle[id][longueur]= [];
									pos_circle[id][longueur].push( new google.maps.LatLng(val.params.data.message[i].ape_position[0].latitude,val.params.data.message[i].ape_position[0].longitude));
									var l_radius=get_Radius(val.params.data.message[i], val.params.data.print_options);
									opt_circle[id].push({
										map : map,
										center : pos_circle[id][longueur][0],
										radius : l_radius
									})
									if ( val.params.data.print_options )
									{
										opt_conf[id] = val.params.data.print_options;
									}
									
								break;
								
								default :
									alert("pas bon");
								break;
							}
								
						}
						
					});
					afficher_par_id(id,method);
					set_options(id);
				});
				
}

function set_options(id) {
	if (opt_conf[id]){
		
		switch ( ref[id] ) 
				{
					case 'marker' :
						for ( var i = 0; i < marker[id].length ; i++ ) 
							{
								{
										if ( opt_conf[id].icon ) // color need to be in english 
										{
											marker[id][i].setIcon("http://labs.google.com/ridefinder/images/mm_20_"+opt_conf[id].icon+".png");
										}
								}
							}
						break;
						
					case'circle':
					
					break;
					
					case'line':
					
					
					break;
						
						
					default :
							{ alert ( "set_options : mauvais id" );}
					break;
					}
	}
}

function get_Radius(message,print_options){
	var tiny 	=	1000;
	var small	=	5000;
	var avg		=	10000;
	var big		=	100000;
	var giant	=	500000;
	console.log(print_options.circle_radius_arg+"--"+message.date_created);
	console.log(eval('message.'+print_options.circle_radius_arg));
	data = eval('message.'+print_options.circle_radius_arg);
	if (data < print_options.size.tiny){return tiny;}
	else if(data < print_options.size.small){return small;}
	else if(data < print_options.size.avg){return avg;}
	else if(data < print_options.size.big){return big;}
	else {return giant;}
}
