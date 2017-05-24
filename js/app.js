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
function ConstructorUSGS() {
    var self = this;
    this.getUSGSWeek= function(){
        $.ajax({
            url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson',
            method: 'get',
            success: function(returnResponse){
                self.sortUSGSWeek(returnResponse);
            },
            error: function (returnResponse) {
                console.log('error ', returnResponse);
            }
        });
    };
    this.getUSGSMonth = function () {
        $.ajax({
            url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson',
            method: 'get',
            success: function(returnResponse){
                self.sortUSGSMonth(returnResponse);
                setTimeout(function(){
                    $('.month').trigger('click');
                }, 1000)
            },
            error: function (returnResponse) {
                console.log('error ', returnResponse);
            }
        })
    };
    this.getUSGSDay = function () {
        $.ajax({
            url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson',
            method: 'get',
            success: function(returnResponse){
                self.sortUSGSDay(returnResponse);
            },
            error: function (returnResponse) {
                console.log('error ', returnResponse);
            }
        })
    };
    this.sortUSGSWeek = function (returnResponse) {
        for (var i = 0; i < returnResponse.features.length; i++) {
            var location = returnResponse.features[i].properties.place;
            var mag = returnResponse.features[i].properties.mag;
            var utcSecond = returnResponse.features[i].properties.time;
            var time = new Date(utcSecond);
            var long = returnResponse.features[i].geometry.coordinates[0];
            var lat = returnResponse.features[i].geometry.coordinates[1];
            var depth = returnResponse.features[i].geometry.coordinates[2];
            eqArrayWeekM4p5.push({location: location, mag: mag, time: time, lat: lat, long: long, depth: depth});
        }
    };
    this.sortUSGSMonth = function (returnResponse) {
        for (var i = 0; i < returnResponse.features.length; i++) {
            var location = returnResponse.features[i].properties.place;
            var mag = returnResponse.features[i].properties.mag;
            var utcSecond = returnResponse.features[i].properties.time;
            var time = new Date(utcSecond);
            var long = returnResponse.features[i].geometry.coordinates[0];
            var lat = returnResponse.features[i].geometry.coordinates[1];
            var depth = returnResponse.features[i].geometry.coordinates[2];
            eqArrayMonthM4p5.push({location: location, mag: mag, time: time, lat: lat, long: long, depth: depth});
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
            eqArrayDayM4p5.push({location: location, mag: mag, time: time, lat: lat, long: long, depth: depth});
        }
    };
}
var map;
var infowindow;
var request;
var service;
var circleArray = [];
$(document).ready(initialize);
function initialize() {
    clickHandler();
    mapInit();
    panelTransitions();
    getAddress();
    $(document).off('ready', initialize);
}
function clickHandler() {
    $('.daySelector').click(eqHistoryByDays);
    $('.clearEQ').click(clearCircles)
    $('#address').keypress(function(event){
        if(event.keyCode == 13){
        getAddress();
        event.preventDefault();
        event.stopPropagation();
        }
    });
    $(".glyphicon-search").click(getAddress);
}
function eqHistoryByDays() {
    clearCircles();
    var days_clicked = 0;
    days_clicked = $(this).attr('days');
    if (days_clicked == 1) {
        current_array = eqArrayDayM4p5;
    }
    else if (days_clicked == 7){
        current_array = eqArrayWeekM4p5;
    }
    else {
        current_array = eqArrayMonthM4p5;
    }
    earthquake(current_array, days_clicked);
}
function mapInit() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        mapTypeId: 'roadmap'
    });
    $('.glyphicon-search').click(getAddress);
}
function getAddress() {
    clearCircles();
    var geocoder = new google.maps.Geocoder();
    var address = $('#address').val();
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
function earthquake(current_array, days_clicked) {
    var eqData = {};
    for (var i = 0 ; i < current_array.length ; i++) {
        eqData = {
            lat_val: current_array[i].lat,
            lng_val: current_array[i].long,
            location: current_array[i].location,
            magnitude: current_array[i].mag.toString(),
            time: current_array[i].time
        };
        setTimeout((function(eqData){
            return function(){
                combineLatLongForGoogle(eqData);
            }
        })(eqData), (400 * days_clicked) * (current_array.length - i) / current_array.length)
    }
}
function combineLatLongForGoogle(eqData) {

    var temp = {
        lat: eqData.lat_val,
        lng: eqData.lng_val
    };
    generateCircle(temp, eqData);
}
function generateCircle(temp, eqData) {
    var eqDataMagStringToNumber = parseInt(eqData.magnitude);
    var tempColor = null;
    var tempOpacity = null;
    if (eqData.magnitude >= 7){
        tempColor = '#FFFFF';
        tempOpacity = 1;
    } else if(eqData.magnitude >= 6){
        tempColor = '#FF0000';
        tempOpacity = 1;
    } else if (eqData.magnitude < 6 && eqData.magnitude >= 5){
        tempColor = '#ff6201';
        tempOpacity = .65;
    } else{
        tempColor = '#fffa01';
        tempOpacity = .5;
    }
    circle = new google.maps.Circle({
        strokeColor: tempColor,
        strokeOpacity: 0.5,
        strokeWeight: .5,
        fillColor: tempColor,
        fillOpacity: tempOpacity,
        center: temp,
        map: map,
        radius: ((eqData.magnitude * eqData.magnitude) * 15000),
        data: {
            magnitude: eqData.magnitude,
            location: eqData.location,
            time: eqData.time
        }
    });
    infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(circle, 'click', function () {
            infowindow.setPosition(this.getCenter());
            var eqDataString = 'The Location is: ' + this.data.location + "<br/> Magnitude of: " + this.data.magnitude + "<br/> On this Date: " + this.data.time;
            infowindow.setContent(eqDataString);
            infowindow.open(map, this);
        });
    createClickHandler(circle, eqData);
    circleArray.push(circle);
}
function clearCircles() {
    for (var i = 0; i < circleArray.length; i++){
        circleArray[i].setMap(null);
    }
}
//------------------------- Twitter Starts ---------------------------------
function createClickHandler(circle, eqData){
    circle.addListener('click', clickRemoveExtraText.bind(this, eqData));
}
function clickRemoveExtraText(eqData) {
    var tempLocation = eqData.location;
    var stringArray = tempLocation.split(' ');
    var indexWordOf = stringArray.indexOf("of");
    var withOutOf = stringArray.slice(indexWordOf + 1);
    var searchTerm = withOutOf.join(' ');
    calltwitter(searchTerm);
}
function calltwitter(searchWord){
    $.ajax({
        data: {
            search_term: 'earthquake ' + searchWord
        },
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/hackathon/twitter/index.php?',
        method: 'post',
        success: function (returnResponse) {
            getTweets(returnResponse);
        },
        error: function(returnResponse){
            console.log('error ', returnResponse);
        }
    })
}
function getTweets(returnResponse) {
    for (var i = 0; i < returnResponse.tweets.statuses.length; i++) {
        var $screenName = returnResponse.tweets.statuses[i].user.screen_name;
        var $hello = returnResponse.tweets.statuses[i].text;
        var $row = $('<div>').addClass('row');
        var $imgContainer = $('<div>').addClass('imgLogo');
        var $imgDiv = $('<div>').addClass('col-xs-2 hidden-sm imgtweet');
        var $imgLogo = $('<img>').addClass('imgSource').attr('src', 'css/twitterlogo.png');
        var $twitterFeed = $('<div>').addClass('col-xs-10 twitterFeed');
        $($imgDiv).append($imgLogo);
        $($imgContainer).append($imgDiv);
        $($twitterFeed).append($screenName, $hello);
        $($row).append($imgContainer, $twitterFeed);
        $('#twitter').append($row);
    }
}
//------------------------- Twitter Ends ---------------------------------
function panelTransitions() {
    $('.twitterClick').on('click', function () {
        $('.rightPanel').toggleClass('on');
    });
    $('.infoClick').on('click', function () {
        $('.testPanel').toggleClass('on');
    });
}
function reset(){
    current_array = [];
}
