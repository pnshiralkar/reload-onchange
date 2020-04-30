let lastChange = {}

let activatedTabs = {}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['activatedTabs'], (res) => {
        if(res.activatedTabs)
            activatedTabs = res.activatedTabs
        if(res.lastChange)
            lastChange = res.lastChange
    });
    chrome.alarms.create('check', {when: Date.now() + 500})
})

chrome.alarms.onAlarm.addListener((alarm) => {
    for (p in activatedTabs) {
        $.ajax({
            url: 'http://127.0.0.1:' + p.toString(),
            success: function (data, c, n) {
                let p = this.url.split(':')[2]
                data = JSON.parse(data)
                if (data[data.length - 1].timestamp != lastChange[p].timestamp) {
                    lastChange[p] = data[data.length - 1];
                    chrome.storage.local.set({lastChange})
                    for (i in activatedTabs[p]) {
                        tab = activatedTabs[p][i]
                        chrome.tabs.executeScript(
                            tab,
                            {code: 'location.reload()'}, () => chrome.runtime.lastError);
                    }
                }
            }
        })
    }
    chrome.alarms.create('check', {when: Date.now() + 500})
})

function activate(port, tab) {
    console.log('port ', port, ' tab ', tab)
    if (!activatedTabs[port])
        activatedTabs[port] = []
    activatedTabs[port].push(tab)
    if (!lastChange[port])
        lastChange[port] = {
            event: 'init',
            filename: '.',
            timestamp: Date.now()
        }
    chrome.storage.local.set({lastChange})
}

function getPort(tab) {
    for (p in activatedTabs) {
        for (t in activatedTabs[p])
            if (activatedTabs[p][t] === tab)
                return p;
    }
    return null
}

function deactivate(tab) {
    console.log('Deactivate tab ', tab)
    for (p in activatedTabs) {
        for (t in activatedTabs[p])
            if (activatedTabs[p][t] === tab) {
                activatedTabs[p].pop(tab)
                if (activatedTabs[p].length === 0) {
                    delete activatedTabs[p]
                    delete lastChange[p]
                }
            }
    }
    chrome.storage.local.set({lastChange})
    chrome.storage.local.set({activatedTabs})
}

chrome.extension.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (msg) {
        if (JSON.parse(msg).action === 'activate') {
            let serverPort = JSON.parse(msg).port
            let tab = JSON.parse(msg).tab
            activate(serverPort, tab)
        } else if (JSON.parse(msg).action === 'getInfo') {
            port.postMessage(JSON.stringify({port: getPort(JSON.parse(msg).tab)}))
        } else if (JSON.parse(msg).action === 'deactivate') {
            deactivate(JSON.parse(msg).tab)
        }

    });
})