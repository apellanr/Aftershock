// jinwoo start
$().ready(startUSGS);
//global var
var usgsData = null;
var eqArrayWeekM4p5 = [];
var eqArrayMonthM4p5 = [];
var eqArrayDayM4p5 = [];

//global var
function startUSGS(){
    usgsData = new ConstructorUSGS;
    usgsData.getUSGSWeek();
    usgsData.getUSGSMonth();
    usgsData.getUSGSDay();
}
function ConstructorUSGS(){
    var self = this;

    this.getUSGSWeek= function(){
        $.ajax({
            url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson',
            method: 'get',
            success: function(returnResponse){
                // console.log(returnResponse);
                self.sortUSGSWeek(returnResponse);
            },
            error: function(returnResponse){
                self.displayServerModal('Delete Error: ' + returnResponse.responseText, "Status Code: " + returnResponse.status);
                console.log('error ', returnResponse);
            }
        });
    };
    this.getUSGSMonth = function(){
        $.ajax({
            url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson',
            method: 'get',
            success: function(returnResponse){
                // console.log(returnResponse);
                self.sortUSGSMonth(returnResponse);
                earthquake();    // -------------------- Might have to change this later, right it is set to load when the page is loaded.
            },
            error: function(returnResponse){
                self.displayServerModal('Delete Error: ' + returnResponse.responseText, "Status Code: " + returnResponse.status);
                console.log('error ', returnResponse);
            }
        })
    };
    this.getUSGSDay = function(){
        $.ajax({
            url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson',
            method: 'get',
            success: function(returnResponse){
                // console.log(returnResponse);
                self.sortUSGSDay(returnResponse);
            },
            error: function(returnResponse){
                self.displayServerModal('Delete Error: ' + returnResponse.responseText, "Status Code: " + returnResponse.status);
                console.log('error ', returnResponse);
            }
        })
    };
    this.sortUSGSWeek = function(returnResponse){
        for (var i = 0; i < returnResponse.features.length; i++) {
            var location = returnResponse.features[i].properties.place;
            var mag = returnResponse.features[i].properties.mag;
            var utcSecond = returnResponse.features[i].properties.time;
            var time = new Date(utcSecond);
            var long = returnResponse.features[i].geometry.coordinates[0];
            var lat = returnResponse.features[i].geometry.coordinates[1];
            var depth = returnResponse.features[i].geometry.coordinates[2];
            eqArrayWeekM4p5.push({location, mag, time, lat, long, depth});
        }
    };
    this.sortUSGSMonth = function(returnResponse){
        for (var i = 0; i < returnResponse.features.length; i++) {
            var location = returnResponse.features[i].properties.place;
            var mag = returnResponse.features[i].properties.mag;
            var utcSecond = returnResponse.features[i].properties.time;
            var time = new Date(utcSecond);
            var long = returnResponse.features[i].geometry.coordinates[0];
            var lat = returnResponse.features[i].geometry.coordinates[1];
            var depth = returnResponse.features[i].geometry.coordinates[2];
            eqArrayMonthM4p5.push({location, mag, time, lat, long, depth});

        }
    };
    this.sortUSGSDay = function(returnResponse){
        for(var i = 0; i < 	returnResponse.features.length; i++){
            var location = returnResponse.features[i].properties.place;
            var mag = returnResponse.features[i].properties.mag;
            var utcSeconds = returnResponse.features[i].properties.time;
            var time = new Date(utcSeconds);
            var lat = returnResponse.features[i].geometry.coordinates[1];
            var long = returnResponse.features[i].geometry.coordinates[0];
            var depth = returnResponse.features[i].geometry.coordinates[2];
            eqArrayDayM4p5.push({location, mag, time, lat, long, depth});
        }
    };
}

// Jinwoo end

var map;
var infowindow;
var request;
var service;
var markers = [];

$(document).ready(initialize);

function initialize() {
    mapInit();
}

function mapInit() {

    geocoder = new google.maps.Geocoder(); // initalizer function

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat: 36.778259, lng: -119.417931},
        mapTypeId: 'roadmap'
    });


}


var geocoder;


function getCoordinates() {

    var coordinates = $('#address').val();
    geocoder.geocode({'address': coordinates}, function (results, status) {
        if (status == 'OK'){
            coordinates = results[0].geometry.location;
            // var marker = new google.maps.Marker
        }

    })
}

//radio checked
function radioInput() {
    $('input').on('click', function(){})
}

function earthquake() {
    var lat_val = 0;
    var lng_val = 0;

    var location = null;
    for (var i = 0 ; i < eqArrayMonthM4p5.length ; i++) {
        lat_val = eqArrayMonthM4p5[i].lat;
        lng_val = eqArrayMonthM4p5[i].long;
        location = eqArrayMonthM4p5[i].location;
        combineLatLongForGoogle(lat_val, lng_val, location);
    }
}

function combineLatLongForGoogle(lat_val, lng_val, location) {
    var temp = {
        lat: lat_val,
        lng: lng_val
    };
    generateCircle(temp, location);
    // console.log(temp);
}

function generateCircle(temp, location) {
    var marker = new google.maps.Marker({
        position: temp,
        map: map
    });

    infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent("Hi"); // Need to change this to show data.
        infowindow.open(map, this);
    });
    createClickHandler(marker, location);
    return marker;
}


//function locationLookup() {
//   address = new LocationConstruct();
//    createClickHandler(marker, location);

//}

//Josh twitter start
function createClickHandler(marker, location){
	marker.addListener('click', funk.bind(this, location));
}

function funk (location) {
   	calltwitter(location);	
}

function calltwitter(searchWord){
	console.log(searchWord);

    $.ajax({
    	data: {
    		search_term: 'earthquake ' + searchWord,
    	},
    	dataType: 'json',
        url: 'http://s-apis.learningfuze.com/hackathon/twitter/index.php?',
        method: 'post',
        success: function(returnResponse){
            console.log('works kinda: ', returnResponse);
            getTweets(returnResponse);
        },
        error: function(returnResponse){
            // self.displayServerModal('Delete Error: ' + returnResponse.responseText, "Status Code: " + returnResponse.status);
            console.log('error ', returnResponse);
        }
    })
}
function getTweets(returnResponse){
	for(var i = 0; i < returnResponse.tweets.statuses.length; i++){
		console.log(returnResponse.tweets.statuses[i].text);
		//ryan this is where you append to the dom or you can make a function
	}
}


//Josh twitter end

// open panel functions
$(document).ready(glyphClick);

function glyphClick() {
    $('.glyphicon-bell').on('click', function(){
        $('.testPanel').toggleClass('on');
    });

    $('.glyphicon-list').on('click', function(){
        $('.rightPanel').toggleClass('on');
    });
}





// Create a <script> tag and set the USGS URL as the source.
//  var script = document.createElement('script');

// This example uses a local copy of the GeoJSON stored at
// http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
// script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
//  document.getElementsByTagName('head')[0].appendChild(script);

/*
 map.data.setStyle(function(feature) {
 var magnitude = feature.getProperty('mag');
 return {
 icon: getCircle(magnitude)
 };
 });
 }

 function getCircle(magnitude) {
 return {
 path: google.maps.SymbolPath.CIRCLE,
 fillColor: 'red',
 fillOpacity: .2,
 scale: Math.pow(2, magnitude) / 2,
 strokeColor: 'white',
 strokeWeight: .5
 };
 }

 function eqfeed_callback(results) {
 map.data.addGeoJson(results);
 }



 /*
 var center = new google.maps.LatLng(37.6554, 71.9091);
 map = new google.maps.Map(document.getElementById('map'), {
 center: center,
 zoom: 13
 });
 request = {
 location: center,
 radius: 8047
 // types: ['food'] // Change this
 };



 service = new google.maps.places.PlacesService(map);
 service.nearbySearch(request, callback);

 google.maps.event.addListener(map, 'rightclick', function (event) {
 map.setCenter(event.latLng);
 clearResults(markers);

 var request = {
 location: event.latLng,
 radius: 8047
 //types: ['food']
 };
 service.nearbySearch(request, callback);
 })
 }

 function callback(results, status) {
 if (status == google.maps.places.PlacesServiceStatus.OK) {
 for (var i = 0 ; i < results.length ; i++) {
 markers.push(createMarker(results[i]));
 }



 function clearResults(markers) {
 for (var m in markers) {
 markers[m].setMap(null)
 }
 markers = [];
 }

 */



