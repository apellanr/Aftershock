// josh start work ong josh.js
$().ready(startUSGS);
//global var
var usgsData = null;
var eqArray30DaysM4p5 = [];
//global var
function startUSGS(){
	usgsData = new ConstructorUSGS;
	usgsData.getUSGS();
}
function ConstructorUSGS(){
	var self = this;
	this.getUSGS = function(){
		$.ajax({
			url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson',
			method: 'get',
			success: function(returnResponse){
				self.sortUSGSData(returnResponse);
			},
			error: function(returnResponse){
				self.displayServerModal('Delete Error: ' + returnResponse.responseText, "Status Code: " + returnResponse.status);
				console.log('error ', returnResponse);
			}
		})
	};
	this.sortUSGSData = function(returnResponse){
		for(var i = 0; i < 	returnResponse.features.length; i++){
			var location = returnResponse.features[i].properties.place;
			var mag = returnResponse.features[i].properties.mag;
			var utcSeconds = returnResponse.features[i].properties.time;
			var time = new Date(utcSeconds);
			var lat = returnResponse.features[i].geometry.coordinates[1];
			var long = returnResponse.features[i].geometry.coordinates[0];
			var depth = returnResponse.features[i].geometry.coordinates[2];
			eqArray30DaysM4p5.push({location, mag, time, lat, long, depth})
		}
	}
}
// josh end work ong josh.js
