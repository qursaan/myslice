/* 

	affiche la liste des possibililt�es d'affichage lors de la connexion au serveur


*/


function recup_liste ( method )
{
				var method2 = "opt_"+method;
				var element, t,label,type_text,input ;
					 j.getJSON("methods/" + method, function(data) 
					{
						j.each(data	, function(key, val) 
						{
						
							switch ( method ) 
							{
							
								case 'dynamic':
									
									for( var i=0 ; i < val.length ; i++ )
									{	
										label			= document.createElement("label");
										input 		= document.createElement("input");
										input.id = ( val[i].id.toString() ) ;
										input.setAttribute ( "type","checkbox");
										label.appendChild(input);
										input.setAttribute ( "onclick","client.ape_join('"+val[i].id.toString()+"')");

										t 			= document.createTextNode(val[i].name+" ");
										label.appendChild(t);
										document.getElementById(method2).appendChild(label);
										document.getElementById(method2).appendChild(document.createElement("br"));
									}
									
									
								break;
								
								default:
									for( var i=0 ; i < val.length ; i++ )
									{	
										label			= document.createElement("label");
										label.title 	= val[i].descriptif;
										label.setAttribute 	("class", "masterTooltip");
										input 		= document.createElement("input");
										input.id = ( val[i].id.toString() ) ;
										input.setAttribute ( "type","checkbox");
										label.appendChild(input);

										t 			= document.createTextNode(val[i].name+" ");
										label.appendChild(t);
										document.getElementById(method2).appendChild(label);
										

										// gestion des contraintes 
										
										if ( val[i].contraints.length != null ) {
										
											//var texte="recup_data(\"methods/"+method.toString()+"/constraints=";
											var texte="recup_data(\""+method.toString()+"/";
											for (var  j=0 ; j< val[i].contraints.length ;j++ ) // asscoci� � un nom 
											{
												for ( var k=0 ; k < val[i].contraints[j].ens.length ; k++ ) //associ� a un ensemble de contraite
												{
													var contrainte = "";
													element			= document.createElement("input");
													element.setAttribute("style","width:75px");
													if ( k != 0 ) contrainte += ",";
													switch ( val[i].contraints[j].ens[k].type )
													{
							
														case 'date':
																element.setAttribute ( "type","text");
																element.className = "datepicker";
																element.id = "contrainte"+val[i].id.toString()+i.toString()+k.toString();
																document.getElementById(method2).appendChild(element);
																jQuery(function() {
																	jQuery(".datepicker").datepicker({
																		showOtherMonths: true,
																		selectOtherMonths: true,
																		showAnim: 'slideDown',
																		//regional: 'fr',
																		dateFormat: 'dd/mm/yy'
																	});
																	jQuery(".datepicker").datepicker("setDate", -14);
																});
																jQuery("contrainte"+val[i].id.toString()+i.toString()+k.toString()).datepicker("setDate", -14);

																contrainte += "'"+val[i].contraints[j].ens[k].op.toString()+val[i].contraints[j].ens[k].variable.toString()+"':\"+j(\"#contrainte"+val[i].id.toString()+i.toString()+k.toString()+"\").datepicker(\"getDate\").getTime()/1000+\"";
														break;
														
														case 'texte':
																element 		= document.createElement("input");
																element.setAttribute("type","text");
																element.setAttribute("id","contrainte"+val[i].id.toString()+i.toString()+k.toString());
																contrainte += "'"+val[i].contraints[j].ens[k].op.toString()+val[i].contraints[j].ens[k].varariable.toString()+"':\"+this.value+\"	";
														break;
														
														default:
															alert ( 'mauvais type dans le fichier conf') ;
														break;
													}
													tooltip();

												}
												//texte += contrainte +"&id="+val[i].id.toString()+"\",\""+val[i].id.toString()+"\",\""+method.toString()+"\");" ;
												texte += contrainte +"/"+val[i].id.toString()+"\",\""+val[i].id.toString()+"\",\""+method.toString()+"\");" ;
												document.getElementById(method2).appendChild(document.createElement("br"));
											}
													
												
											/* type_text		= document.createElement("input");
											type_text.setAttribute("id",val[i].id.toString()+"2" );
											type_text.setAttribute("type","text");						
											type_text.value 	= val[i].contraints;
											document.getElementById(method2).insertBefore(type_text,document.getElementById(method2).childNodes[0]);
											var texte = "recup_data(\"lib/cgi/static.py?constraints=']date_created':\"+j(\".datepicker\").datepicker(\"getDate\").getTime()/1000+\"&id="+val[i].id.toString()+"\","+val[i].id.toString()+","+method.toString()+")";
											element.setAttribute("onclick","if ( this.checked ){if ( "+texte+"}else{set_visibility(false,"+val[i].id.toString()+")}");
											*/
											
										} else { 
											
											var texte = "recup_data(\""+method.toString()+"/']date_created':\"+j(\".datepicker\").datepicker(\"getDate\").getTime()/1000+\"/"+val[i].id.toString()+"\",\""+val[i].id.toString()+"\",\""+method.toString()+"\");";
											//var texte = "recup_data(\"methods/"+method.toString()+"?constraints=']date_created':\"+j(\".datepicker\").datepicker(\"getDate\").getTime()/1000+\"&id="+val[i].id.toString()+"\",\""+val[i].id.toString()+"\",\""+method.toString()+"\");";
											document.getElementById(method2).appendChild(document.createElement("br"));	
										}
										input.setAttribute("onclick","if ( this.checked ){"+texte+"}else{set_visibility(false,"+val[i].id.toString()+",\""+method.toString()+"\")}");


									}
								break;
								
							}
							
						});
					});
}


function tooltip ()
{
					jQuery('.masterTooltip').hover(function(){
							// Hover over code
							var title = j(this).attr('title');
							j(this).data('tipText', title).removeAttr('title');
							j('<p class="tooltip"></p>')
							.text(title)
							.appendTo('body')
							.fadeIn('slow');
					}, function() {
							// Hover out code
							j(this).attr('title', j(this).data('tipText'));
							j('.tooltip').remove();
					}).mousemove(function(e) {
							var mousex = e.pageX + 20; //Get X coordinates
							var mousey = e.pageY + 10; //Get Y coordinates
							j('.tooltip')
							.css({ top: mousey, left: mousex })
					});
}
