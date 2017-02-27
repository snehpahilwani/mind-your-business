var map, heatmap ,latitude, longitude, category;
var bounds,infowindow,rectangle;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 29.6, lng: -82.3},
    styles: [
      {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
      }
    ]
  });

  bounds = new google.maps.LatLngBounds();
  rectangle = new google.maps.Rectangle({
    bounds: bounds,
    editable: true,
    draggable: true
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(data),
    map: map
  });


  rectangle.setMap(map);
  rectangle.addListener('drag', showNewRect);
  infoWindow = new google.maps.InfoWindow();

  var input = document.getElementById('search');
  var autocomplete = new google.maps.places.Autocomplete(input);
}

function showNewRect(event) {
  var ne = rectangle.getBounds().getNorthEast();
  var sw = rectangle.getBounds().getSouthWest();
  var numB = data.filter(d => d.lat >= sw.lat() && d.lat <= ne.lat() &&
    d.lng >= sw.lng() && d.lng <= ne.lng());
  var summ = 0;
  var weightSum = numB.forEach(d => summ += d.weight);
  var contentString = '<b>Area Statistics</b><br>' +
      'Number of Businesses: ' + numB.length  +  '<br>' +
      'Average Rating: ' + parseFloat(summ/numB.length).toFixed(2);

  // Set the info window's content and position.
  infoWindow.setContent(contentString);
  infoWindow.setPosition(ne);

  infoWindow.open(map);
}

//Get Latitutde Longitude value from textbox
function GetLatlong(geocoder, callback) {
  var address = document.getElementById('search').value;
  geocoder.geocode({ 'address': address }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      callback(results);
    }
    else{
      console.log("Unable to find coordinates");
    }
  });
}

function onClick(){
  var geocoder = new google.maps.Geocoder();
  GetLatlong(geocoder, function(results) {
    latitude  = results[0].geometry.location.lat();
    longitude  = results[0].geometry.location.lng();
      
    category = document.getElementById("categorySelect").value;
    console.log("Latitude: "+latitude+" Longitude: "+longitude+" Category: "+category); 
    getNewData(latitude,longitude,category);
  });      
}

//new function to get API data 
function getNewData(lat,lng,cat) {
  $('.overlay').show();
  $.get( "http://localhost:5000/business?lat="+lat+"&lng="+lng+"&cat="+cat, function(dat) {
    data = JSON.parse(dat);
    var points = getPoints(data);
    heatmap.setData(points);
    map.setCenter(new google.maps.LatLng(lat, lng));
    $('.overlay').hide();
  });
}


function getPoints(dat) {
    bounds = new google.maps.LatLngBounds();
  	var coordinates = [];
  	for(var i=0;i<dat.length;i++) {
  		var loc = new google.maps.LatLng(dat[i]['lat'], dat[i]['lng']);
      bounds.extend(loc);
      coordinates.push({location: loc, weight: dat[i]['weight']*100});
  	}
    map.fitBounds(bounds);
    rectangle.setBounds(bounds);
  	return coordinates;
}


function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3' +
      '&key=' + key + '&libraries=visualization,places&callback=initMap';
  document.body.appendChild(script);
}

window.onload = loadScript;
