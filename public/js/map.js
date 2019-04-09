$(document).ready(function() {
  // MapBox access token
  mapboxgl.accessToken =
    "your_key_here";

  // Inital map display, removes MapBox JS errors
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/dark-v10",
    center: [-122.2712798, 37.8720731],
    zoom: 13,
    scrollZoom: true
  });

  //   Users object, used to generate map points and properties
  var users = {
    type: "FeatureCollection",
    features: []
  };

  // Grabs API info for all users
  $.ajax({
    url: "/map/api",
    type: "get",
    success: function(result) {
      result.forEach(user => {
        var newObject = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [user.latitude, user.longitude]
          },
          properties: {
            name: user.username,
            address: user.address,
            city: user.city,
            country: "United States",
            state: user.state,
            instrument: user.instruments,
            genre: user.genres,
          }
        };
        users.features.push(newObject);
      });
    }
  }).then(function(data) {
    mapPins();
  });

  // Displays pins
  var mapPins = function() {
    users.features.forEach(function(marker, i) {
      var el = document.createElement("div"); // Create an img element for the marker
      el.id = "marker-" + i;
      el.className = "marker";
      // for loop here
      switch (marker.properties.instrument) {
        case "guitarist":
          $(el).css("background-image", "url(../images/guitarPin.png)");
          break;
        case "bassist":
          $(el).css("background-image", "url(../images/bassPin.png)");
          break;
        case "vocalist":
          $(el).css("background-image", "url(../images/vocalPin.png)");
          break;
        case "drummer":
          $(el).css("background-image", "url(../images/drumsPin2.png)");
          break;
      }

      // Add markers to the map at all points
      new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

      el.addEventListener("click", function(e) {
        flyToStore(marker); // Fly to the point
        createPopUp(marker); // Close all other popups and display popup for clicked store
        var activeItem = document.getElementsByClassName("active");
      });
    });
  };

  // Centers camera to clicked pin
  function flyToStore(currentFeature) {
    map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15
    });
  }

  // pop up for name/address
  function createPopUp(currentFeature) {
    var popUps = document.getElementsByClassName("mapboxgl-popup");
    if (popUps[0]) popUps[0].remove();

    var popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        "<h3>" +
          currentFeature.properties.name +
          "</h3>" +
          "<h4>" +
          currentFeature.properties.instrument +
          "</h4>" +
          "<h4>Genre: " +
          currentFeature.properties.genre +
          "</h4>"
      )
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
