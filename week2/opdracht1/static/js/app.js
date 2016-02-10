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
			});
			//debugger

		}
	}

	app.init();

	data.requestDataPromise(data.baseUrl+"satellites/25544","issData");
	//var testData = data.requestDataPeg('https://api.wheretheiss.at/v1/' + 'satellites/25544');


//})();