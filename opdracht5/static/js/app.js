'use strict';
(function(){

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

	app.init()
})();