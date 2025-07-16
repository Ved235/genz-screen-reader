console.log('Side panel script loaded');
const videoIds = [
  'bBOBn1Jx5BY',
  'MTLM8wgscaM', 
  'l98w9OSKVNA',
];

let currentVideoIndex = 0;
let currentText = '';
let words = [];
let utterance = null;

const textElement = document.getElementById('sr-text');
const playPauseBtn = document.getElementById('play-pause-btn');
const stopBtn = document.getElementById('stop-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

function loadYouTubeVideo(videoId) {
    const iframe = document.getElementById('bg-video');
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playlist=${videoId}`;
    iframe.src = embedUrl;
    console.log('Loading YouTube video:', videoId);
}

function speakAndDisplay(text) {
    window.speechSynthesis.cancel();

    if (!text || text.trim() === '') {
        textElement.textContent = 'No text to read. 🤷';
        return;
    }

    currentText = text;
    words = text.split(/\s+/);
    utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(v => v.name.includes('Google US English') || v.lang === 'en-US') || voices[0];
    utterance.pitch = 1.1;
    utterance.rate = 1.2;

    utterance.onboundary = (event) => {
        if (event.name === 'word') {
            const word = getWordAt(text, event.charIndex);
            textElement.textContent = `🗣️ ${word}`;
            textElement.classList.add('flash');
            setTimeout(() => textElement.classList.remove('flash'), 300);
        }
    };

    utterance.onend = () => {
        textElement.textContent = '✅ Done!';
        playPauseBtn.textContent = 'Play';
    };
    
    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        textElement.textContent = '💀 Speech failed.';
    };

    window.speechSynthesis.speak(utterance);
    playPauseBtn.textContent = 'Pause';
}

function getWordAt(str, pos) {
    const left = str.slice(0, pos + 1).search(/\S+$/);
    const right = str.slice(pos).search(/\s/);
    return str.slice(left, right < 0 ? str.length : pos + right);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'displayText') {
        speakAndDisplay(message.text);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('Side panel loaded');
    loadYouTubeVideo(videoIds[currentVideoIndex]);
    
    window.speechSynthesis.getVoices();

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const currentTabId = tabs[0].id;
            chrome.runtime.sendMessage({ type: 'getLatestText', tabId: currentTabId }, (response) => {
                if (response && response.text) {
                    currentText = response.text;
                    textElement.textContent = 'Press Play to start... ▶️';
                }
            });
        }
    });
});

playPauseBtn.addEventListener('click', () => {
    if (window.speechSynthesis.speaking) {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            playPauseBtn.textContent = 'Pause';
        } else {
            window.speechSynthesis.pause();
            playPauseBtn.textContent = 'Resume';
        }
    } else if (currentText) {
        speakAndDisplay(currentText);
    }
});

stopBtn.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    playPauseBtn.textContent = 'Play';
    textElement.textContent = 'Stopped. 🛑';
});

nextBtn.addEventListener('click', () => {
    currentVideoIndex = (currentVideoIndex + 1) % videoIds.length;
    loadYouTubeVideo(videoIds[currentVideoIndex]);
});

prevBtn.addEventListener('click', () => {
    currentVideoIndex = (currentVideoIndex - 1 + videoIds.length) % videoIds.length;
    loadYouTubeVideo(videoIds[currentVideoIndex]);
});