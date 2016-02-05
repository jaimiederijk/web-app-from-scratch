'use strict';
(function(){

	var app = {
		init: function() {
			routes.init();
		}
	};

	var routes = {
		init: function() {
			sections.toggle("#start");
			window.addEventListener('hashchange', function(){sections.toggle()} ,false);
		}
	};

	var sections = {
		toggle: function(route) {
			var route = window.location.hash;
			var sections = document.querySelectorAll("section");

			[].forEach.call(sections, function (section) {
				section.classList.add("hidden");
			};

			matchingSection.classList.remove("hidden");
		}
	};

	app.init()
})();