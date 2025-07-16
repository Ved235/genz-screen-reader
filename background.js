console.log('Background script loaded');

const tabTextCache = {};

chrome.action.onClicked.addListener((tab) => {
  console.log('Opening side panel for tab:', tab.id);
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;

  if (message.type === 'text') {
    console.log(`Caching and forwarding text for tab ${tabId}:`, message.text.substring(0, 50) + '...');
    if (tabId) {
      tabTextCache[tabId] = message.text;
    }
    
    chrome.runtime.sendMessage({
      type: 'displayText',
      text: message.text
    }).catch((error) => {
    });
    sendResponse({ received: true });

  } else if (message.type === 'getLatestText') {
    const tabId = message.tabId;
    if (tabId && tabTextCache[tabId]) {
      console.log(`Sending cached text to side panel for tab ${tabId}`);
      sendResponse({ text: tabTextCache[tabId] });
    } else {
      console.log(`No cached text found for tab ${tabId}`);
      sendResponse({ text: 'Waiting for text... 💭' });
    }
    return true; 
  }
});