$().ready(startUSGS);

var usgsData = null;
var eqArrayWeekM4p5 = [];
var eqArrayMonthM4p5 = [];
var eqArrayDayM4p5 = [];
var current_array = eqArrayMonthM4p5;

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
                self.sortUSGSMonth(returnResponse);
               // earthquake();    // -------------------- Might have to change this later, right it is set to load when the page is loaded.
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
        for(var i = 0; i <   returnResponse.features.length; i++){
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

var map;
var infowindow;
var request;
var service;
var markers = [];

$(document).ready(initialize);
function initialize() {
    mapInit();
    clickHandler();

    // $('#1day').on('click', function(){
    //     current_array = eqArrayDayM4p5;
    // });
    // $('#7day').on('click', function(){
    //     current_array = eqArrayWeekM4p5;
    // });
    // $('#30day').on('click', function(){
    //     current_array = eqArrayMonthM4p5;
    // });
    // daysClicked(current_array);
}

function clickHandler() {
    $('.btn').click(eqHistoryByDays);
    $('.glyphicon-search').click(searchSubmitClicked);
}

function eqHistoryByDays() {
    console.log("Working!");
    days_clicked = $(this).val();
    if (days_clicked == 1) {
        current_array = eqArrayDayM4p5;
    }
    else if (days_clicked == 7){
        current_array = eqArrayWeekM4p5;

    }
    else {
        current_array = eqArrayMonthM4p5;
    }

    earthquake(current_array);
}

function searchSubmitClicked() {
    console.log("Search Clicked Working!");
    //mapInit();
}

function mapInit() {
    var coordinates = $('#address').val();
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': coordinates}, function (results, status) {
        if (status == 'OK'){
            coordinates = results[0].geometry.location;
            // var marker = new google.maps.Marker
        }
    });

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat: 36.778259, lng: -119.417931},
        mapTypeId: 'roadmap'
    });
}



// var geocoder;
// function getCoordinates() {
//     var coordinates = $('#address').val();
//     geocoder.geocode({'address': coordinates}, function (results, status) {
//         if (status == 'OK'){
//             coordinates = results[0].geometry.location;
//             // var marker = new google.maps.Marker
//         }
//     })
// }

function earthquake(current_array) {
    var lat_val = 0;
    var lng_val = 0;
    var location = null;
    for (var i = 0 ; i < current_array.length ; i++) {
        lat_val = current_array[i].lat;
        lng_val = current_array[i].long;
        location = current_array[i].location;
        combineLatLongForGoogle(lat_val, lng_val, location);
    }
}
function combineLatLongForGoogle(lat_val, lng_val, location) {
    var temp = {
        lat: lat_val,
        lng: lng_val
    };
    generateCircle(temp, location);
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

//------------------------- Twitter Starts ---------------------------------
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
            search_term: 'earthquake ' + searchWord
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
//------------------------- Twitter Ends ---------------------------------

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

// ---------- Reset ---------------
function reset(){
    current_array = [];
}