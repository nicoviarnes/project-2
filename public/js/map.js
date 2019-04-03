$(document).ready(function(){

    // const express = require("express");
    // const app = express();
    // const path = require("path");

    // app.use(express.static(path.join(__dirname,"/css")));
    
    if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function() {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        };
    }
    
    // form Button / appends new pin
    $("#formBtn").on("click", function(){
        var userNameInput = $("#userName").val().trim();
        var userAddressInput = $("#userAddress").val().trim();
        var userAddressQuery = encodeURIComponent(userAddressInput.trim());
        var cityName = $("#cityId").val().trim();
        var stateName = $("#stateId").val().trim();
        console.log(userAddressQuery);
        var x = stores.length;
        
        
        // Converts address into lat and long cords
        const latLongUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+userAddressQuery+"%20"+cityName+"%20"+stateName+".json?access_token="+mapboxgl.accessToken+"&cachebuster=1554258551887&autocomplete=true";
        
        $.ajax({
            url: latLongUrl,
            type: "get",
            success: function(result){
                // console.log(result);
                userLong = result.features[0].center[0];
                userLat = result.features[0].center[1];
                console.log(userLong);
            },
            error: function(err){
        console.log(err);
    }
    
    // Waits until lat and long are calculated
    // Pushes new object into musicians array
}).then(function(){   
    var newObject =
    {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [
                userLong,
                userLat
            ]
        },
        properties: {
            name: userNameInput,
            phoneFormatted: '(202) 507-8357',
            phone: '2025078357',
            address: userAddressInput,
            city: cityName,
            country: 'United States',
            crossStreet: 'at 22nd St NW',
            postalCode: '20037',
            state: stateName,
            instrument: 'guitar'
        }
    }
    //  jQuery.extend(stores.features[3], newObject);
    stores.features.push(newObject);
    console.log(stores);
    mapPins();
})


// Geocoder
const geoUrl="https://api.mapbox.com/geocoding/v5/mapbox.places/"+cityName+"%2C%20"+stateName+"%2C%20United%20States.json?access_token="+ mapboxgl.accessToken +"&cachebuster=1554243021563&autocomplete=true";

$.ajax({
    url: geoUrl,
    type: "get",
    success: function(result){
        // console.log(result);
        longitude = result.features[0].bbox[0];
        latitude = result.features[0].bbox[1];
        // console.log(latitude);
    },
    error: function(err){
        console.log(err);
    }
}).then(function(){
    
    
    //   Directions and distances
    const distUrl = "https://api.mapbox.com/directions/v5/mapbox/driving/-73.989%2C40.733%3B"+longitude+"%2C"+latitude+".json?access_token="+mapboxgl.accessToken;
    
    $.ajax({
        url: distUrl,
        type: "get",
        success: function(result){
            // console.log(result.routes[0].distance);
        },
        error: function(err){
            console.log(err);
        }
    })
})
})







mapboxgl.accessToken = 'pk.eyJ1IjoiNm4yciIsImEiOiJjanR2dTVrcHgxczl6NDVwaWhsZnZmYmluIn0.IUrjr1At8xiyqHacqoV6fg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-77.034084142948, 38.909671288923],
    zoom: 13,
    scrollZoom: true
});

var stores = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    -77.034084142948,
                    38.909671288923
                ]
            },
            properties: {
                phoneFormatted: '(202) 234-7336',
                phone: '2022347336',
                address: '1471 P St NW',
                city: 'Washington DC',
                country: 'United States',
                crossStreet: 'at 15th St NW',
                postalCode: '20005',
                state: 'D.C.',
                instrument: 'piano',
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    -77.149766,
                    38.980772
                ]
            },
            properties: {
                phoneFormatted: '(202) 507-8357',
                phone: '2025078357',
                address: '2221 I St NW',
                city: 'Washington DC',
                country: 'United States',
                crossStreet: 'at 22nd St NW',
                postalCode: '20037',
                state: 'D.C.',
                instrument: 'guitar',
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    -77.043929,
                    38.910525
                ]
            },
            properties: {
                name: "dog",
                phoneFormatted: '(202) 387-9338',
                phone: '2023879338',
                address: '1512 Connecticut Ave NW',
                city: 'Washington DC',
                country: 'United States',
                crossStreet: 'at Dupont Circle',
                postalCode: '20036',
                state: 'D.C.',
                instrument: 'vocal'
            }
        }]
    };
    
    
    
    // Displays pins
    var mapPins = function(){
        
        stores.features.forEach(function(marker, i) {
            var el = document.createElement('div'); // Create an img element for the marker
            el.id = 'marker-' + i;
            el.className = 'marker';
            // Add markers to the map at all points
            new mapboxgl.Marker(el, { offset: [0, -23] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
            
            el.addEventListener('click', function(e) {
                flyToStore(marker); // Fly to the point
                createPopUp(marker); // Close all other popups and display popup for clicked store
                var activeItem = document.getElementsByClassName('active'); 
            });
            
            // Changes pin image based on instrument
            for (var i = 0; i < stores.features.length; i++){
                if($("#marker-"+i).css('background-image') == 'none'){
                    
                    if (stores.features[i].properties.instrument == "piano"){
                        $("#marker-"+i).css("background-image", "url(../assets/images/pianoPin.png)");
                    }if (stores.features[i].properties.instrument == "guitar"){
                        $("#marker-"+i).css("background-image", "url(../assets/images/pianoPin.png)");
                        
                    }if (stores.features[i].properties.instrument == "vocal"){
                        $("#marker-"+i).css("background-image", "url(../assets/images/pianoPin.png)");
                    }
                }
            }
        });
    }
    
    mapPins();
    
    // Add `new mapboxgl.Geocoder` code here
    
    // Add the `map.addSource` and `map.addLayer` here
    
    // Add the `geocode` event listener here
    
    // Add `forEach` function here
    
    // Add `sort` function here
    
    // Add function that fits bounds to search and closest store here
    
    
    /// Displays pins
    var mapPins = function(){
        
        stores.features.forEach(function(marker, i) {
            var el = document.createElement('div'); // Create an img element for the marker
            el.id = 'marker-' + i;
            el.className = 'marker';
            // Add markers to the map at all points
            new mapboxgl.Marker(el, { offset: [0, -23] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
            
            el.addEventListener('click', function(e) {
                flyToStore(marker); // Fly to the point
                createPopUp(marker); // Close all other popups and display popup for clicked store
                var activeItem = document.getElementsByClassName('active'); 
            });
            
            // Changes pin image based on instrument
            for (var i = 0; i < stores.features.length; i++){
                
                if (stores.features[i].properties.instrument == "piano"){
                    $("#marker-"+i).css("background-image", "url(../../public/assets/images/pianoPin.png)");
                }if (stores.features[i].properties.instrument == "guitar"){
                    $("#marker-"+i).css("background-image", "url(../../public/assets/images/guitarPin.png)");
                    
                }if (stores.features[i].properties.instrument == "vocal"){
                    $("#marker-"+i).css("background-image", "url(../../public/assets/images/drumsPin2.png)");
                }
            }
        });
    }
    
    // Centers camera to clicked pin
  function flyToStore(currentFeature) {
      map.flyTo({
          center: currentFeature.geometry.coordinates,
          zoom: 15
        });
    }
    
    
    // pop up for name/address
    function createPopUp(currentFeature) {
        var popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();
        
        var popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML('<h3>' + currentFeature.properties.name + '</h3>' +
        '<h4>' + currentFeature.properties.address + '</h4>')
        .addTo(map);
    }
    
    // Renders list to page
    function buildLocationList(data) {
        for (i = 0; i < data.features.length; i++) {
            var currentFeature = data.features[i];
            var prop = currentFeature.properties;
        }
    }
    
});