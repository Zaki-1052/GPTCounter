let count = 0;
let timer = null;

function startTimer() {
    let startTime = Date.now();
    timer = setInterval(function() {
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        let remainingTime = Math.max(0, 3*60*60 - elapsedTime);
        chrome.storage.local.set({'time': remainingTime}, function() {
            if (remainingTime === 0) {
                clearInterval(timer);
                timer = null;
                count = 0;
                chrome.storage.local.set({'count': count});
            }
        });
    }, 1000);
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.method === 'POST' && details.url.includes('https://chat.openai.com/')) {
            count++;
            if (count === 1) {
                startTimer();
            }
            chrome.storage.local.set({'count': count});
        }
    },
    {urls: ["<all_urls>"]}
);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.reset) {
        count = 0;
        chrome.storage.local.set({'count': count}, function() {
            document.getElementById('count').textContent = '0';
        });
    }
});