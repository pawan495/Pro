// search itunes API
function searchArtist(searchTerm) {
   apiUrl = "https://itunes.apple.com/search?term=" + searchTerm;
   fetch(apiUrl).then(function (response) {
      // if request was successful
      if (response.ok) {
         response.json().then(function (data) {
            console.log(data);

            // loop through every search result
            data.results.forEach(function (item) {
               // check if both artist and title are present
               if (
                  item.artistName != undefined &&
                  item.trackName != undefined
               ) {
                  console.log(item.artistName + " — " + item.trackName);
                  // create list element and append
                  var listEl = document.createElement("li");
                  listEl.textContent = item.artistName + " — " + item.trackName;
                  document.querySelector("#results-list").appendChild(listEl);
               }
            });

            // check if list is empty after search
            if (document.querySelector("#results-list").innerHTML === "") {
               // output an error if so
               document.querySelector("#results-list").textContent =
                  "No results found for '" + searchTerm + "'!";
            }
         });
      }
   });
}

// search lyrics API
function searchLyrics(lyricSearch) {
   lyricsUrl = "https://api.lyrics.ovh/v1/" + lyricSearch.replace(" — ", "/");
   fetch(lyricsUrl).then(function (response) {
      if (response.ok) {
         response.json().then(function (data) {
            console.log(data);
            var songLyrics = data.lyrics;
            // display lyrics with  proper line breaks in html
            document.querySelector("#lyrics").innerHTML = songLyrics.replaceAll(
               "\n",
               "<br>"
            );
            // check if not already in history
            if (!storage.includes(lyricSearch)) {
               // check if history is at max size
               var maxHistory = 5;
               if (storage.length > maxHistory) {
                  storage.shift();
                  document
                     .querySelector("#search-history")
                     .removeChild(
                        document.getElementsByTagName("li")[maxHistory]
                     );
               }
               // add to search history
               storage.push(lyricSearch);
               localStorage.setItem("savedSongs", JSON.stringify(storage));
               displayHistoryItem(lyricSearch);
            }
         });
      } else {
         // output error
         document.querySelector("#lyrics").textContent =
            "No results found for '" + lyricSearch + "'!";
      }
   });
}

// append item to search history
function displayHistoryItem(songString) {
   // create list element and append
   var listEl = document.createElement("li");
   listEl.textContent = songString;
   document.querySelector("#search-history").prepend(listEl);
}

// search button click
document.querySelector("#searchBtn").addEventListener("click", function () {
   // clear results list
   document.querySelector("#results-list").innerHTML = "";
   // clear lyrics
   document.querySelector("#lyrics").innerHTML = "";
   // get value from input form
   var userInput = document.querySelector("#InputFromUser").value;
   // clear input form
   document.querySelector("#InputFromUser").value = "";
   // run search
   searchArtist(userInput);
});

// clicking a song in the results list or history
document
   .querySelector("#song-list")
   .addEventListener("click", function (event) {
      // check if element clicked is a <li> element
      if (event.target.tagName.toLowerCase() == "li") {
         console.log(event.target.textContent);
         // get text content
         var songInfo = event.target.textContent;
         // run the search
         searchLyrics(songInfo);
      }
   });

// load search history
var storage = JSON.parse(localStorage.getItem("savedSongs"));
if (storage == undefined) {
   storage = [];
} else {
   storage.forEach(function (item) {
      displayHistoryItem(item);
   });
}
