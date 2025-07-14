console.log('Side panel script loaded');
const videoIds = [
  'bBOBn1Jx5BY',
  'dQw4w9WgXcQ', 
  'jNQXAC9IVRw',
];

let currentVideoIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Side panel loaded');
    const iframe = document.getElementById('bg-video');
    function loadYouTubeVideo(videoId) {
        const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playlist=${videoId}`;
        iframe.src = embedUrl;
        console.log('Loading YouTube video:', videoId);
    }
    
    // Load video
    loadYouTubeVideo(videoIds[currentVideoIndex]);
});