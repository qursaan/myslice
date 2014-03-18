$(document).ready(function() {
    $('li#GoogleMap').click(function (e) {
        $('.'+this.id).trigger('show');
    });

    $('a.sl-platform').click(function (e) {
        $('.'+this.id).trigger('show');
    });


	$('ul.nav-resources a').click(function() {
        $('ul.nav-resources li').removeClass('active');
        $(this).parent().addClass('active');
        $('div.panel').hide();
        $('div#'+$(this).data('panel')).show();
        /*
        if ($(this).data('panel') == 'map') {
        	mapInit();
        }
        */
    });
    
    $.get("/rest/network", function(data) {
		var list = '<div class="list-group-item sl-platform"><span class="list-group-item-heading">Testbeds</span></div>';
		for(i=0; i<data.length;i++) {
			list += '<a href="#" class="list-group-item sl-platform" data-platform="'+data[i].network_hrn+'"><span class="list-group-item-heading">'+data[i].network_longname+'</span><p class="list-group-item-text">'+data[i].network_hrn+'</p></a>';
		}
		$('#select-platform').html(list);
	}).done(function() {
		
	});
	
	$('button#ApplyPendind').click(function() {
		myslice.apply();
		// $.each(myslice.pending, function(k, p) {
			// console.log(p);
		// });
		// $.post("/update/slice", {}, function() {
// 			
		// });
	});
	
   //google.maps.event.addDomListener(window, 'load', initialize);
});

function mapInit() {
	
    $.get("/rest/resource/", {"fields" : ["hostname","latitude","longitude"] }, function(data) {
  	
	  	var mapOptions = {
	      center: new google.maps.LatLng(48.8567, 2.3508),
	      zoom: 4,
	      scrollwheel: false
	    };
	    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	  	 marker = new google.maps.Marker({
		        position: new google.maps.LatLng(48.8567, 2.3508),
		        map: map,
		        icon: '/static/img/marker2.png'
		    });
		
	  	for (i = 0; i < data.length; i++) {  
	  		if (!data[i].longitude) continue;
		    marker = new google.maps.Marker({
		        position: new google.maps.LatLng(data[i].latitude, data[i].longitude),
		        map: map
		    });
			var infowindow = new google.maps.InfoWindow();

			google.maps.event.addListener(marker, 'click', (function(marker, i) {
		        return function() {
		          infowindow.setContent(data[i].hostname);
		          infowindow.open(map, marker);
		     	};
	      	})(marker, i));
	    }
	  });
}
