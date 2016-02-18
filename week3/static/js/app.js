'use strict';
//(function(){

	var htmlElements = {
		body: document.querySelector('body'),
		navLi: document.querySelectorAll('nav li'),
		sections: document.querySelectorAll('section'),
		movies: document.querySelector('#searchmovies'),
		movie: document.querySelector('#onemovie'),
		home: document.querySelector('#start'),
		iss: document.querySelector('#isstracker'),
		movieSearch: document.querySelector('#searchmovies form'),
		moviesTemplate: document.querySelector("#template-movies"),
		moviesTemplateLoader: document.querySelector("#template-movies div")
	};

	var app = {
		init: function() {
			// sections.firstHideAllSections();
			routes.init();
			googleMap.setupMap();
			sections.refreshIssMarker.markerInterval();
			
			ui.setupEvents();
			ui.setupGestures();
		}
	};

	var routes = {
		init: function() {
			routie('', function() {
				sections.displaySection("home");
			});
			routie('movies', function() {
				sections.displaySection("movies");
				//
			});
			routie('iss', function() {
				sections.displaySection("iss");
			});
			routie('movies/:id', function(id) {
				if (data.searchedMovies) {//has data been collected then continue
					sections.displaySection("movie");
					sections.renderMoviePage(id);
				} else {
					routie('movies');
				};
			});
		}

	};
	var ui = {
		setupEvents : function () {
			document.addEventListener("touchstart", function(){}, true)
			htmlElements.movieSearch.addEventListener("submit", function () {
					sections.setupMovieSearched(event.target[0].value);
			});
		},
		setupGestures : function () {
			var hammertime = new Hammer(htmlElements.body);
			hammertime.on('swiperight', function(ev) {
			    ui.switchSection("right");			    
			});
			hammertime.on('swipeleft', function(ev) {
			    ui.switchSection("left");			    
			});
		},
		switchSection : function (direction) {
			var newShow;
			var newSection;
			var current = _.findIndex(htmlElements.navLi, function(item) {
				return item.dataset.section==window.location.hash;
			})			
			if ( direction === "right" ) {
				newShow = current == htmlElements.navLi.length-1 ? 0 : current+1;	
			} else if ( direction === "left" ) {
				newShow = current == 0 ? htmlElements.navLi.length-1 : current-1;
			}
			newSection = htmlElements.navLi[newShow].dataset.section;
			routie(newSection);
		}
	}


	var sections = {
		setupMovieSearched : function (input) {
			
			if (data.searchedMovies) {
				Transparency.render(htmlElements.moviesTemplate,"");
				data.oldSearchedMovies = _.filter(data.searchedMovies.results, function(item){
					return item.vote_average > 5.5;
				});
			}
			htmlElements.moviesTemplateLoader.classList.add("loader");	
			
			data.searchMovie(input,"searchedMovies");
		},
		renderMovieSearched : function () {
			var temp = htmlElements.moviesTemplate;

			var movies = data.searchedMovies;
			var directives = {
				deeplink : {
					href : function (params) {
						return "#movies/#" + this.id;
					}
				}
			};
			htmlElements.moviesTemplateLoader.classList.remove("loader");
			Transparency.render(temp,movies.results,directives);
		},
		renderMoviePage : function (id) {
			var movie = _.find(data.searchedMovies.results,function(id){ return id = id; });
			var temp = document.querySelector("#template-movie");
			Transparency.render(temp,movie);
		},
		// firstHideAllSections : function() {
		// 	var sections = htmlElements.sections;
		// 	for (var i = 0; i < sections.length; i++) { //hide all sections via loop
		// 		sections[i].classList.add("notransition");
		// 	};
		// },
		hideAllSections : function () {
			var sections = htmlElements.sections;
			for (var i = 0; i < sections.length; i++) { //hide all sections via loop
				sections[i].classList.remove("show");
				sections[i].classList.add("hidden");
				//sections[i].classList.remove("notransition");
			};
		},
		displaySection : function (sectionName) {
			this.hideAllSections();
			var section = htmlElements[sectionName];
			section.classList.remove("hidden");
			section.classList.add("show");
		},
		refreshIssMarker : {
			markerInterval : function() {this.interval = window.setInterval(this.sendIssRequest ,2000)},
			sendIssRequest : function() {
				data.requestDataIss(data.config.issBaseUrl+"satellites/25544","issData");

			},
			stopInterval : function() {
				clearInterval(this.interval);
			}
		}
	};

	var data = {
		config : {
			issBaseUrl:"https://api.wheretheiss.at/v1/",
			movieBaseUrl:"http://api.themoviedb.org/3/",
			movieApiKey:"3974f78e9e581f953c413271e51a527a",
		},

		requestDataIss:function (url, target) {	//target = under what name should the the data be saved
			var self = this;
			var target = target;
			promise.get(url).then(function(error, text, xhr) {
			    if (error) {
			    	sections.refreshIssMarker.stopInterval();
			        alert('Error ' + xhr.status);
			        return;
			    }
			    self[target] = JSON.parse(text);
			    //googleMap.setMapCordinates();
			    googleMap.setupMarker(target);
			});
			//debugger
		},
		searchMovie :function(input, target) {	//target = under what name should the the data be saved
			var url = this.config.movieBaseUrl + 'search/multi?query=' + input +'&api_key=' + this.config.movieApiKey;
			var self = this;
			promise.get(url).then(function(error, text, xhr) {
				if (error) {
			        alert('Error ' + xhr.status);
			        return;
			    };
			    self[target] = JSON.parse(text);
			    setTimeout(function(){ sections.renderMovieSearched(); }, 1000); //test load animation
			    //sections.renderMovieSearched();
			    //console.log(JSON.parse(text));
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
				map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions );

			}
		},
		setupMarker : function (target) {
			var image = {
				url: "static/images/dot.png",
			    scaledSize: new google.maps.Size(20, 20), // scaled size
			    origin: new google.maps.Point(0,0), // origin
			    anchor: new google.maps.Point(0, 0) // anchor
			};

			var marker = new google.maps.Marker({
			    position: this.getCordinates(target),
			    map: map,
			    title: target,
			    icon: image
			});
		}
	};


	app.init();




//})();