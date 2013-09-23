	//initialisation no conflict et de la config APE
	
	j = jQuery.noConflict();
	j.getScript('/static/js/config.js');
	
	//fin
	
			var direct = 0;
			var map;
			var ref = [];
			var chargement = 1 ;
			var requete = 0;
			// sauvegarde des position en LatLng
			
			var pos_marker = [];
			var pos_line = [];
			var pos_circle = [];
			
			//Sauvegarde des options ( timestamp + options s'il y a )
			
			var opt_line = [];
			var opt_marker = [];
			var opt_circle = [];
			
			// sauvegarde des structures
			
			var marker= [];
			var circle = [];
			var line = [];
			
			//sauvegarde option du fichier conf 
			
			opt_conf = [];
			
			var visible = true ;
			
function initialiser() {
	var latlng = new google.maps.LatLng(49.35, 21.97);
	//objet contenant des propri�t�s avec des identificateurs pr�d�finis dans Google Maps permettant
	//de d�finir des options d'affichage de notre carte
	var options = {
	center: latlng,
		zoom: 2,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		streetViewControl: false,
		panControl : false,
		maxzoom: 4
		
	};

	//constructeur de la carte qui prend en param�tre le conteneur HTML
	//dans lequel la carte doit s'afficher et les options

	map = new google.maps.Map(document.getElementById("gmaps"), options);
}
