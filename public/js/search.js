const search = event => {
  event.preventDefault();
  var $instrument = $("input[name='instrument']:checked").val();
  var $genre = $("input[name='genre']:checked").val();

  var resultsDiv = $(".quickSearchResults");

  let query = {
    instrument: $instrument,
    genre: $genre
  };

  $.post("/api/search", query).then(function(data) {
    resultsDiv.empty();
    if (data.length === 0) {
      var card = `
      <div class="row">
        <div class="card searchRes">
          <div class="card-divider" style="background-color:black;">
          </div>
          <div class="card-section">
            <h4>No results found</h4>
          </div>
        </div>
      </div> 
      `;
      resultsDiv.append(card);
    } else {
      data.forEach(user => {
        var card = `
        <div class="row">
          <div class="card searchRes">
            <div class="card-divider" style="background-color:black;">
              <a href="/user/${user.username}">Jam with ${user.username}</a>
            </div>
            <div class="card-section">
              <h4>I'm a ${user.instruments}</h4>
              <p>I'm interested in: ${user.genres}</p>
              <p>A little about me: ${user.bio}</p>
            </div>
          </div>
        </div> 
        `;
        resultsDiv.append(card);
      });
    }
  });
};

// Add event listeners
$(document).on("click", ".search", search);
