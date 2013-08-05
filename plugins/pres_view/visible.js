/*

		modifie la visibilité des markers si une case est décoché 
		
*/



function set_visibility ( v, id, method ) 
{
	switch ( method )
	{
		case 'static':
			if ( typeof(marker[id])!='undefined' )
			{
				for ( var i=0 ; i< marker[id].length; i++ )
				{
					marker[id][i].setVisible(v);
				}
			}else if ( typeof(line[id])!='undefined' ){
				{
					for ( var i=0 ; i< line[id].length; i++ )
					{
						line[id][i].setVisible(v);
					}
				}
			}
			else if ( typeof(circle[id])!='undefined' ) {
				{
					for ( var i=0 ; i < circle[id].length; i++ )
					{
						circle[id][i].setVisible(v);
					}
				}
			}
		break;
		
		case 'animation':
			if ( opt_marker[id].length != null )
			{
				for ( var i=0 ; i< marker[id].length; i++ )
				{
					
					marker[id][i].setVisible(v);
				}
			}else if ( line[id].length != null ){
				{
					for ( var i=0 ; i< line[id].length; i++ )
					{
						line[id][i].setVisible(v);
					}
				}
			}
			else if ( circle[id].length != null ) {
				{
					for ( var i=0 ; i < circle[id].length; i++ )
					{
						circle[id][i].setVisible(v);
					}
				}
			}
			for ( var i=0 ; i< animation[id].length; i++ )
			{
				
				clearTimeout ( animation[id][i] );
			}
			animation [id] = []; 
		break;
		
		default:
		
		break;
	}
	
}

function sup_sites (tab)
{
	for( var i=0; i < tab.length; i++)
	{
		tab[i].setVisible(false);
	}
}