/* 

	Gére les affichages static, dynamiques ( le static est utiliser pour afficher un marker a la fois ) 
	sinon affiche une erreur

*/

var animation = [];
var temps ;
var toto = 0;
var save_long ;
function afficher_par_id (id,method)
{
	toto = 0 ;
	animation[id] = [];
	switch ( method )
		{
			case 'static':
				switch ( ref[id] ) 
					{
						case 'marker' :
							for ( var i = 0; i < opt_marker[id].length ; i++ ) 
							{
								marker[id][i] = new google.maps.Marker(opt_marker[id][i]);
								marker[id][i].setVisible ( true );
							}
						break;
						
						case 'line' :
							for ( var i = 0; i < opt_line[id].length ; i++ ) 
							{
								line[id][i] = new google.maps.Polyline(opt_line[id][i]);
								line[id][i].setVisible ( true );
							}
						break;
						case 'circle' :
							for ( var i = 0; i < opt_circle[id].length ; i++ ) 
							{
								circle[id][i] = new google.maps.Circle(opt_circle[id][i]);
								circle[id][i].setVisible ( true );
							}
						break;
						default :
							{ alert ( " mauvaise referance" ); }
						break;
					}
					
			break;
			
			case 'animation':
				document.getElementById("statusbar").innerHTML = "ANIMATION EN COURS " ;
				switch ( ref[id] ) 
					{
						case 'marker':
						save_long = opt_marker[id].length;
						
						for ( var i = 0; i < opt_marker[id].length ; i++ )
						{
							temps =(10.5 - j( "#interval_animation" ).slider( "option", "value" )) * 1000 *(i+1) ;
							animation [id][i] = setTimeout ( function()
							{	
								marker[id][toto] = new google.maps.Marker(opt_marker[id][toto]);
								marker[id][toto].setVisible ( true );
								map.panTo ( pos_marker[id][toto]);
								toto++;
								if ( toto == save_long)  document.getElementById("statusbar").innerHTML = "ANIMATION TERMINEE " ;
							}, temps );
						}
						break;
						case 'line' :
						save_long = opt_line[id].length;
						for ( var i = 0; i < opt_line[id].length ; i++ )
						{
							temps =(10.5 - j( "#interval_animation" ).slider( "option", "value" )) * 1000 *(i+1) ;
							animation [id][i] = setTimeout ( function()
							{	
								
								line[id][toto] = new google.maps.Polyline(opt_line[id][toto]);
								line[id][toto].setVisible ( true );
								map.panTo ( pos_line[id][toto][0]);
								toto++;
								if ( toto == save_long)  document.getElementById("statusbar").innerHTML = "ANIMATION TERMINEE " ;
							}, temps );
						}
						break;
						case 'circle' :
						save_long = opt_circle[id].length;
						for ( var i = 0; i < opt_circle[id].length ; i++ )
						{
							temps =(10.5 - j( "#interval_animation" ).slider( "option", "value" )) * 1000 *(i+1) ;
							setTimeout ( function()
							{	
								
								circke[id][toto] = new google.maps.Circle(opt_circle[id][toto]);
								circle[id][toto].setVisible ( true );
								map.panTo ( pos_circle[id][toto][0]);
								toto++;
								if ( toto == save_long)  document.getElementById("statusbar").innerHTML = "ANIMATION TERMINEE " ;
							}, temps );
						}
						default :
							{}
						break;
					}
				;
			break ;
			
			default:
				alert ( "afficher_par_id : Erreur dans la method" );
			break;
		}
}
