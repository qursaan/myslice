/* 

		meme chose que recup_data sauf qu'il n'y a pas besoin d'url puisque cela r�agi a l'envoi du d�mon 
		
*/


function recup_direct(data, method,id) 
				{
					//j.each(data	, function(key, val) 
					//{			
						//alert ( data.data.print_method );
						switch ( data.data.print_method )
							{
								case 'marker' :
										pos_marker[id]= [];
										opt_marker[id] =[];
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
						for ( var i= 0; i<data.data.message.length;i++)
						{
							var longueur;
							switch ( data.data.print_method )
							{
								case 'marker' :
									pos_marker[id].push( new google.maps.LatLng(data.data.message[i].ape_position[0].latitude,data.data.message[i].ape_position[0].longitude));

										opt_marker[id].push 
										({
											position: pos_marker[id][pos_marker[id].length - 1],
											visible: true,
											map : map
											//title : data.data.message.ape_timestamp
										});
									
									//marker[id].push( new google.maps.Marker(opt_marker[id][opt_marker[id].length - 1 ]));	
									if ( data.data.print_options )
									{
										opt_conf[id] = data.data.print_options;
									}
									
								break;
								
								case 'line' :
									for ( var j = 0 ; j < val[i].params.data.message.ape_position.length ; j++ ) 
									{
										pos_line[id].push(new google.maps.LatLng(data.data.message[i].ape_position[j].latitude,data.data.message[i].ape_position[j].longitude)) ;
									}	
									
									opt_line[id].push
									({
										path : pos_line[id] ,
										map : map,
										strokeColor: "#FF0000",
										strokeOpacity: 1.0,
										strokeWeight: 2
									})

									if ( data.data.print_options )
									{
										opt_conf[id] = data.data.print_options;
									}
									
								break;
								
								case 'circle':
								
									longueur = circle.length;
									circle[longueur] = [];
									// circle[longueur].push (val[i].message.ape_position[0].latitude) ; pour le timestamp
									pos_circle[longueur].push(new google.maps.LatLng(val[i].data.message.ape_position[0].latitude,val[i].data.message.ape_position[1].longitude));
									// pos_circle[longueur].push circle[longueur][1][1] = val[i].message.ape_position[0].radian;
									opt_circle.push({
										map : map,
										center : pos_circle[longueur][0],
										radius : pos_circle[longueur][1]
									})
									if ( data.data.print_options )
									{
										opt_conf[id] = data.data.print_options;
									}
									
								break;
								
								default :
									alert("pas bon");
								break;
							}
								
						}
						
					//});
					afficher_par_id(id,"static");
					set_options(id);
				}

