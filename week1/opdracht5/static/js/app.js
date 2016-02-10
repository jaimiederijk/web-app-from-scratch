'use strict';
(function(){

	var app = {
		init: function() {
			routes.init();

		}
	};

	var routes = {
		init: function() {
			var currentHash = window.location.hash; //get current hash
			var hash = currentHash ? currentHash : "#start";//if there is a hash stay there else go to start
			sections.toggle(hash);//call toggle
			window.addEventListener('hashchange', function(){sections.toggle()} ,false);//event hashchange fires sections.toggle
		}
	};

	var sections = {
		toggle: function(route) {
			var id = route ? route : window.location.hash; //if there is a route take that one else current hash
			var sections = document.querySelectorAll("section"); //et all sections from html dom
			var matchingSection = document.querySelector(id); //find coresponding section id

			for (var i = 0; i < sections.length; i++) { //hide all sections via loop
				sections[i].classList.add("hidden");
			};

			matchingSection.classList.remove("hidden");//show the matching section

		}
	};

	app.init() //start app
})();