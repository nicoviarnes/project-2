// This grabs the users lat long based on current location ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const newUser = event => {
  event.preventDefault();
  var $username = $("#username")
    .val()
    .trim();
  var $password = $("#password")
    .val()
    .trim();
  var $firstName = $("#firstName")
    .val()
    .trim();
  var $lastName = $("#lastName")
    .val()
    .trim();
  var $email = $("#email")
    .val()
    .trim();
  var $address = $("#address")
    .val()
    .trim();
  var $city = $("#city")
    .val()
    .trim();
  var $state = $("#state")
    .val()
    .trim();
  var $instruments = $("#instruments")
    .val()
    .trim();
  var $genres = $("#genres")
    .val()
    .trim();
  var $bio = $("#bio")
    .val()
    .trim();

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  var $latitude = crd.latitude;
  var $longitude = crd.longitude;
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  let user = {
    username: $username,
    password: $password,
    firstName: $firstName,
    lastName: $lastName,
    email: $email,
    address: $address,
    city: $city,
    state: $state,
    instruments: $instruments,
    genres: $genres,
    bio: $bio,
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    latitude: $latitude,
    longitude: $longitude
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  };

  console.log(user);

  $.post("/register", user);
};

// Add event listeners
$("#register").on("click", newUser);
