'use strict';
(function(){

	var app = {
		init: function() {
			routes.init();
			googleMap.setupMap()
			sections.refreshIssMarker()
		}
	};

	var routes = {
		init: function() {
			var currentHash = window.location.hash;
			var hash = currentHash ? currentHash : "#start";//if there is a hash stay there else go to start
			sections.toggle(hash);
			window.addEventListener('hashchange', function(){sections.toggle()} ,false);//event hashchange fires sections.toggle
		}
	};

	var sections = {
		toggle: function(route) {
			var id = route ? route : window.location.hash; //if there is a route take that one else current hash
			var sections = document.querySelectorAll("section");
			var matchingSection = document.querySelector(id);

			for (var i = 0; i < sections.length; i++) { //hide all sections
				sections[i].classList.add("hidden");
			};

			matchingSection.classList.remove("hidden");//show the matching section

		},
		refreshIssMarker : function () {
			var markerInterval = window.setInterval(call ,2000);
			function call () {
				data.requestDataIss(data.issBaseUrl+"satellites/25544","issData")
			}
		}
	};

	var data = {
		issBaseUrl:"https://api.wheretheiss.at/v1/",
		movieBaseUrl:"https://api.themoviedb.org/3/",
		apiKey:"6cb38eaa7fe8c8602cce052374cdf3ad",

		requestDataIss:function (url,target) {
			var self = this;
			var target = target;
			promise.get(url).then(function(error, text, xhr) {
			    if (error) {
			        alert('Error ' + xhr.status);
			        return;
			    }
			    self[target] = JSON.parse(text);
			    //googleMap.setMapCordinates();
			    googleMap.setupMarker(target);
			    
			});
			//debugger
		},
		searchMovie :function(input) {
			var url = 'https://api.themoviedb.org/3/' + 'search/multi?query=' + input +'?api_key=6cb38eaa7fe8c8602cce052374cdf3ad';

			promise.get(url).then(function(error, text, xhr) {
				if (error) {
			        alert('Error ' + xhr.status);
			        return;
			    }
			    console.log(JSON.parse(text));
			});
		}
	};

	var map;

	var googleMap = {
		getCordinates : function(target) {
			var myLatLng = {
			      lat: data[target].latitude,
			      lng: data[target].longitude
			};
			return myLatLng
		},
		setupMap : function () {
			if (document.getElementById('map-canvas')){
 
			    // Coordinates to center the map
			    var myLatlng = new google.maps.LatLng(0,0);
			 
			    // Other options for the map, pretty much selfexplanatory
			    var mapOptions = {
			        zoom: 1,
			        center: myLatlng,
			        mapTypeId: google.maps.MapTypeId.ROADMAP
			    };

			    // Attach a map to the DOM Element, with the defined settings
				map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions )
			    
			}
		},
		setupMarker : function (target) {
			var image = {
				url: "static/images/dot.png",
			    scaledSize: new google.maps.Size(20, 20), // scaled size
			    origin: new google.maps.Point(0,0), // origin
			    anchor: new google.maps.Point(0, 0) // anchor
			}

			var marker = new google.maps.Marker({
			    position: this.getCordinates(target),
			    map: map,
			    title: target,
			    icon: image
			});
		}
			
		// myLatlng : new google.maps.LatLng(52.3661379,4.9160171),// Coordinates to center the map
		// mapOptions : {// Other options for the map, pretty much selfexplanatory   debugger

		// 	        zoom: 15,
		// 	        center: this.myLatlng ,
		// 	        mapTypeId: google.maps.MapTypeId.ROADMAP
		// },
		// myLatLng : {
	 //      			lat: 52.3645527,
	 //      			lng: 4.9118135
	 //    },
	 //    map : new google.maps.Map(document.getElementById("map-canvas"), this.mapOptions),// Attach a map to the DOM Element, with the defined settings
	 //    marker : new google.maps.Marker({
		// 		    position: this.myLatLng,
		// 		    map: this.map,
		// 		    title: 'Bijna'
  //   			})
	};
	//Code forked from: http://codepen.io/dbugger/pen/LouvE/
	// if HTML DOM Element that contains the map is found...

	app.init();

	


	//var testData = data.requestDataPeg('https://api.wheretheiss.at/v1/' + 'satellites/25544');


})();