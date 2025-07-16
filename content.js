console.log('Content script loaded and ready. v2');

// Function to extract all relevant text from the page into a single string
function getPageText() {
  const selectors = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'article', 'main'];
  let fullText = '';
  
  document.querySelectorAll(selectors.join(',')).forEach(el => {
    const elementText = Array.from(el.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent.trim())
      .join(' ');

    if (elementText) {
      fullText += elementText + ' ';
    }
  });

  return fullText.replace(/\s+/g, ' ').trim();
}

function sendTextToBackground(text) {
  if (text && text.length > 0) {
    console.log('Sending extracted text to background script:', text.substring(0, 100) + '...');
    chrome.runtime.sendMessage({ type: 'text', text: text });
  } else {
    console.log('No signifcant text found on the page.');
  }
}

function runExtraction() {
  const extractedText = getPageText();
  sendTextToBackground(extractedText);
}

runExtraction();

let debounceTimer;
const observer = new MutationObserver(mutations => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runExtraction, 1000);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});