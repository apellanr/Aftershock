//---------------- Google Maps Start ----------------
var map;
var infowindow;
var request;
var service;
var markers = [];

$(document).ready(initialize);

function initialize() {
    mapInit();
    earthquake();
}

function mapInit() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {lat: 36.778259, lng: -119.417931},
        mapTypeId: 'terrain'
    });
}

function earthquake() {
    var lat_val = 0;
    var lng_val = 0;
    for (var i = 0 ; i < eqArray30DaysM4p5.length ; i++) {
        lat_val = eqArray30DaysM4p5[i].lat;
        lng_val = eqArray30DaysM4p5[i].long;
        combineLatLongForGoogle(lat_val, lng_val);
    }

}


function combineLatLongForGoogle(lat_val, lng_val) {
    var temp = {
        lat: lat_val,
        lng: lng_val
    };
    generateCircle(temp);
    console.log(temp);
}


function generateCircle(temp) {
    var marker = new google.maps.Marker({
        position: temp,
        map: map
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

console.log(eqArray30DaysM4p5);

