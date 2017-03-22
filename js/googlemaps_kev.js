
var map;
var infowindow;

$(document).ready(mapInit);

function mapInit() {
    var center = new google.maps.LatLng(37.422, -122.084058);
    map = new google.maps.Map(document.getElementById('map'), {
       center: center,
        zoom: 13
    });
    var request = {
        location: center,
        radius: 8047,
        types: ['cafe'] // Change this
    };

    infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0 ; i < results.length ; i++) {
            createMarker(results[i]);
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
    })
}