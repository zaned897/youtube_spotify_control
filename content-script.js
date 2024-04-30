console.log('Content script loaded');

function setupVideoControls() {
    const videoElement = document.querySelector('video');
    if (videoElement) {
        console.log('Video found');
        videoElement.addEventListener('play', () => {
            fetch('http://localhost:3000/pause', { method: 'POST' })
                .then(response => console.log('Spotify play triggered'))
                .catch(error => console.error('Error triggering Spotify play', error));
        });

        videoElement.addEventListener('pause', () => {
            fetch('http://localhost:3000/play', { method: 'POST' })
                .then(response => console.log('Spotify pause triggered'))
                .catch(error => console.error('Error triggering Spotify pause', error));
        });
    } else {
        console.log('Video not found, retrying...');
        setTimeout(setupVideoControls, 1000);
    }
}

setupVideoControls();