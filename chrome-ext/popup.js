var port = chrome.extension.connect({
    name: "Sample Communication"
});

let btnSet = document.getElementById('btnSet')
let inpPort = document.getElementById('inpPort')
let toggle = document.getElementById('toggle')

chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    port.postMessage(JSON.stringify({action: 'getInfo', tab: tabs[0].id}));
    port.onMessage.addListener(function (msg) {
        if (JSON.parse(msg).port) {
            inpPort.value = JSON.parse(msg).port
            toggle.checked = true
            inpPort.disabled = true
        }
    });
});

toggle.onchange = function (e) {
    e.preventDefault()
    if (!toggle.checked) {
        console.log('x')
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            port.postMessage(JSON.stringify({action: 'deactivate', tab: tabs[0].id}));
            toggle.checked = false
            inpPort.disabled = false
        });
    } else {
        e.preventDefault()
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            port.postMessage(JSON.stringify({action: 'activate', port: inpPort.value, tab: tabs[0].id}));
            toggle.checked = true
            inpPort.disabled = true
        });
    }
}
