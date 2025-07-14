console.log('Side panel script loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('Side panel loaded');
    const video = document.getElementById('bg-video');
    video.src = chrome.runtime.getURL('test.mp4');
    console.log('Image source set to:', img.src);
    console.log('Setting video source to:', video.src);
    
    // Add event listeners to debug video loading
    video.addEventListener('loadstart', () => console.log('Video loading started'));
    video.addEventListener('canplay', () => console.log('Video can start playing'));
    video.addEventListener('error', (e) => console.error('Video error:', e));
    video.addEventListener('loadeddata', () => console.log('Video data loaded'));
});