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
                console.log(returnResponse);
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
                console.log(returnResponse);
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
                console.log(returnResponse);
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
    console.log("2");
}

function mapInit() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {lat: 36.778259, lng: -119.417931},
        mapTypeId: 'roadmap'
    });
}


//radio checked
function radioInput() {
    $('input').on('click', function(){

function earthquake() {
    console.log("1");
    var lat_val = 0;
    var lng_val = 0;

    for (var i = 0 ; i < eqArrayMonthM4p5.length ; i++) {   // Will have to change the array to a variable.
        lat_val = eqArrayMonthM4p5[i].lat;
        lng_val = eqArrayMonthM4p5[i].long;
        combineLatLongForGoogle(lat_val, lng_val);
    }


    });
}
//
function earthquake() {
    // var lat_val = 0;
    // var lng_val = 0;
    // for (var i = 0 ; i < eqArray30DaysM4p5.length; i++) {
    //     // lat_val = eqArray30DaysM4p5[i].lat;
    //     // lng_val = eqArray30DaysM4p5[i].long;
    //     combineLatLongForGoogle(lat_val, lng_val);
    // }
}

function combineLatLongForGoogle(lat_val, lng_val) {
        var temp = {
        lat: lat_val,
        lng: lng_val
    };
    generateCircle(temp);
}

function generateCircle(temp) {
    var marker = new google.maps.Marker({
        position: temp,
        map: map
    });
}

// function search() {
//     var searchInput = $('#search');
//     var autocomplete = new google.maps.places.Autocomplete(searchInput);
// }


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

 infowindow = new google.maps.InfoWindow();

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
 }
 }

 function createMarker(place) {
 var placeLoc = place.geometry.location;
 var marker = new google.maps.Marker({
 map: map,
 position: place.geometry.location
 });

 google.maps.event.addListener(marker, 'click', function () {
 infowindow.setContent(place.name);
 infowindow.open(map, this);
 });
 return marker;
 }

 function clearResults(markers) {
 for (var m in markers) {
 markers[m].setMap(null)
 }
 markers = [];
 }

 */

//---------------- Google Maps Ends ----------------

//---------------- USGS Data Starts ----------------

console.log(eqArrayMonthM4p5);

