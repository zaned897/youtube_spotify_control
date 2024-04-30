chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.command == "pause_spotify") {
        console.log("Pausing Spotify Access token integrated.");
        fetch('http://localhost:3000/pause', {
          method: 'POST'
        }).then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('Error:', error));
      } else if (request.command == "play_spotify") {
        console.log("Playing Spotify. Access token integrated.");
        fetch('http://localhost:3000/play', {
          method: 'POST'
        }).then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('Error:', error));
      }
    }
  );
  