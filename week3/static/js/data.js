var data = {
	config : {
		issBaseUrl:"https://api.wheretheiss.at/v1/",
		movieBaseUrl:"http://api.themoviedb.org/3/",
		movieApiKey:"3974f78e9e581f953c413271e51a527a",
	},

	requestDataIss:function (url, target) {	//target = under what name should the the data be saved
		var self = this;
		var target = target;
		var googleMap = require('./googleMap');
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
		var sections = require('./sections');
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

module.exports = data;