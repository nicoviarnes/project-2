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
    bio: $bio
  };

  $.post("/register", user);
};

// Add event listeners
$("#register").on("click", newUser);
