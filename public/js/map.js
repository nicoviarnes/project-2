$(document).ready(function() {
  // MapBox access token
  mapboxgl.accessToken =
    "pk.eyJ1IjoiNm4yciIsImEiOiJjanR2dTVrcHgxczl6NDVwaWhsZnZmYmluIn0.IUrjr1At8xiyqHacqoV6fg";


    // Inital map display, removes MapBox JS errors
    var map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v10",
      center: [-77, 30],
      zoom: 13,
      scrollZoom: true
    });

  //   Users object, used to generate map points and properties
  var users = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          // coordinates: [0,0]
        },
        properties: {

        }
      }
    ]
  };

  // Grabs API info for all users
  $.ajax({
    url: "/map/api",
    type: "get",
    success: function(result) {
      // result[0] is current user
      // result[1] is database users

      // current user 
      userFirstName = result[0].firstName;
      userLastName = result[0].lastName;
      userName = userFirstName +" "+ userLastName;
      userAddress = result[0].address;
      userCity = result[0].city;
      userState = result[0].state;
      userInstrument = result[0].instruments;

      // database users
      databaseLength = result[1].length;
      console.log(databaseLength);
      for (var i = 0; i < databaseLength; i++){

      dbFirstName = result[1][i].firstName;
      dbLastName = result[1][i].lastName;
      dbName = dbFirstName +" "+ dbLastName;

      dbAddress = result[1][i].address;
      dbCity = result[1][i].city;
      dbState = result[1][i].state;
      
      dbInstrument = result[1][i].instruments;


      var newObject = {
        type: "Feature",
        geometry: {
          type: "Point",
          // coordinates: [dbLong, dbLat]
        },
        properties: {
          name: dbName,
          phoneFormatted: "(202) 507-8357",
          phone: "2025078357",
          address: dbAddress,
          city: dbCity,
          country: "United States",
          state: dbState,
          instrument: dbInstrument
        }
      };
      // pushes db users into user object
      users.features.push(newObject);
      
      
      
      
    }
    console.log(users);
  }
  }).then(function(){

    
    
    
    // Calculates database users latitude and longitude
    const dbLatLongUrl =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    dbAddress +
    "%20" +
    dbCity +
    "%20" +
    dbState +
    ".json?access_token=" +
    mapboxgl.accessToken +
    "&cachebuster=1554258551887&autocomplete=true";
    
    
    // Calculates the lat long
    $.ajax({
      url: dbLatLongUrl,
      type: "get",
      success: function(result) {
        dbLong = result.features[0].center[0];
        dbLat = result.features[0].center[1];
        
        var newObject = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [dbLong, dbLat]
          },
          properties: {
            name: dbName,
            phoneFormatted: "(202) 507-8357",
            phone: "2025078357",
            address: dbAddress,
            city: dbCity,
            country: "United States",
            state: dbState,
            instrument: dbInstrument
          }
        };
        // pushes the db user with lat and long
        users.features.push(newObject);
        console.log(users);
        
        
      },
      error: function(err) {
        console.log(err);
      }
    
    });

}).then(function() {
    // Converts current users address into lat and long cords
    const latLongUrl =
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      userAddress +
      "%20" +
      userCity +
      "%20" +
      userState +
      ".json?access_token=" +
      mapboxgl.accessToken +
      "&cachebuster=1554258551887&autocomplete=true";

    $.ajax({
      url: latLongUrl,
      type: "get",
      success: function(result) {
        userLong = result.features[0].center[0];
        userLat = result.features[0].center[1];
        // console.log(userLong);
      },
      error: function(err) {
        console.log(err);
      }
      
      // Waits until lat and long are calculated
      // Sets map zoom to current user cords
     
    }).then(function(result) {
      map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v10",
        center: [userLong, userLat],
        zoom: 13,
        scrollZoom: true
      });
      });

      
      
      // Displays pins
      var mapPins = function() {
        users.features.forEach(function(marker, i) {
          var el = document.createElement("div"); // Create an img element for the marker
          el.id = "marker-" + i;
          el.className = "marker";
          // Add markers to the map at all points
          new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
      

        el.addEventListener("click", function(e) {
          flyToStore(marker); // Fly to the point
          createPopUp(marker); // Close all other popups and display popup for clicked store
          var activeItem = document.getElementsByClassName("active");
        })


        $(".marker").css(
          "background-image",
          "url(../images/pianoPin.png)"
          );
          
            // Changes pin image based on instrument
            for (var i = 0; i < users.features.length-1; i++) {
              if ($("#marker-" + i).css("background-image") == "none") {
            if (users.features[i].properties.instrument == "piano") {
              $("#marker-" + i).css(
                "background-image",
                "url(../images/pianoPin.png)"
                );
              }
              if (users.features[i].properties.instrument == "guitar") {
                $("#marker-" + i).css(
                "background-image",
                "url(../images/guitarPin.png)"
                );
              }
              if (users.features[i].properties.instrument == "vocal") {
                $("#marker-" + i).css(
                  "background-image",
                "url(../images/vocalPin.png)"
                );
              }
              if (users.features[i].properties.instrument == "drums") {
                $("#marker-" + i).css(
                  "background-image",
                  "url(../images/drumsPin.png)"
                  );
                }
                if (users.features[i].properties.instrument == "brass") {
                  $("#marker-" + i).css(
                    "background-image",
                    "url(../images/brassPin.png)"
              );
            }
            if (users.features[i].properties.instrument == "woodwind") {
              $("#marker-" + i).css(
                "background-image",
                "url(../../assets/images/woodwindPin.png)"
                );
              }
            }
          }
        });
      }; 
      mapPins();
    });


    
    
    
    
    // Centers camera to clicked pin
    function flyToStore(currentFeature) {
      map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 15
      });
      console.log(currentFeature);
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
        currentFeature.properties.address +
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