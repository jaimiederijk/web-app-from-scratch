'use strict';
//(function(){

	var app = {
		init: function() {
			routes.init();

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

		}
	};

	var data = {
		baseUrl:"https://api.wheretheiss.at/v1/",

		// requestDataPeg: function(url) {

		// 	pegasus(url).then(
		// 		function (data,xhr) {
		// 			return data
		// 		}, function (data,xhr) {
		// 			console.error(data, xhr.status)
		// 		}
		// 	);
		// },
		requestData:function (url,target) {
			var self = this;
			var target = target;
			promise.get(url).then(function(error, text, xhr) {
			    if (error) {
			        alert('Error ' + xhr.status);
			        return;
			    }
			    self[target] = JSON.parse(text);
			    //googleMap.setMapCordinates();

			    googleMap.setupMap()
			});
			//debugger

		}
	};

	var googleMap = {
		setMapCordinates : function() {
			
			this.myLatLng.lat = data.issData.latitude;
			this.myLatLng.lng = data.issData.longitude;
		},
		setupMap : function () {
			if (document.getElementById('map-canvas')){
 
			    // Coordinates to center the map
			    var myLatlng = new google.maps.LatLng(data.issData.latitude,data.issData.longitude);
			 
			    // Other options for the map, pretty much selfexplanatory
			    var mapOptions = {
			        zoom: 3,
			        center: myLatlng,
			        mapTypeId: google.maps.MapTypeId.ROADMAP
			    };
			    var myLatLng = {
			      lat: data.issData.latitude,
			      lng: data.issData.longitude
			    };
			  
			    // Attach a map to the DOM Element, with the defined settings
			    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
			}


			var marker = new google.maps.Marker({
			    position: myLatLng,
			    map: map,
			    title: 'Bijna'
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

	data.requestData(data.baseUrl+"satellites/25544","issData");


	//var testData = data.requestDataPeg('https://api.wheretheiss.at/v1/' + 'satellites/25544');


//})();