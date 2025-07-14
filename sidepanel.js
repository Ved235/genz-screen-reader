console.log('Side panel script loaded');
const videoIds = [
  'bBOBn1Jx5BY',
  'MTLM8wgscaM', 
  'l98w9OSKVNA',
];

let currentVideoIndex = 0;
function loadYouTubeVideo(videoId) {
    const iframe = document.getElementById('bg-video');
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playlist=${videoId}`;
    iframe.src = embedUrl;
    console.log('Loading YouTube video:', videoId);
}
document.addEventListener('DOMContentLoaded', () => {
    console.log('Side panel loaded');
    
    // Load video
    loadYouTubeVideo(videoIds[currentVideoIndex]);
});

document.getElementById('next-btn').addEventListener('click', () => {
    currentVideoIndex = (currentVideoIndex + 1) % videoIds.length;
    loadYouTubeVideo(videoIds[currentVideoIndex]);
    console.log('Next video loaded:', videoIds[currentVideoIndex]);
});

document.getElementById('prev-btn').addEventListener('click', () => {
    currentVideoIndex = (currentVideoIndex - 1 + videoIds.length) % videoIds.length;
    loadYouTubeVideo(videoIds[currentVideoIndex]);
    console.log('Previous video loaded:', videoIds[currentVideoIndex]);
});