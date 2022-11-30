var s = document.createElement('script');
s.src = chrome.runtime.getURL('script.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

function waitForElmExist(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function waitForElmUpdate(selector, callback) {
    const observer = new MutationObserver(mutations => {
        console.log("heyyyyyyy");
        callback(document.querySelector(selector));
    });

    observer.observe(document.querySelector(selector), {
        attributes: true
    });
}

document.addEventListener("DOMContentLoaded", function(event) {
    waitForElmExist('#__interceptedData').then((e) => {
        waitForElmUpdate('#__interceptedData', (insertedNode) => {
            var data = JSON.parse(insertedNode.getAttribute("data"))
            var currentAdUnitId = data.result['3589']['1303']
            var hierarchy = data.result['3589']['1918']
            hierarchy.shift()
            hierarchy = hierarchy.map( e => e['2198'])
            hierarchy.push(currentAdUnitId)
            var fullId = '/' + hierarchy.join('/')
            
            let node = document.createElement("button");
            node.innerHTML = fullId
            node.type = "submit";
            node.style = "margin-left: 20px; padding: 4px;"
            node.onclick = function () {
                navigator.clipboard.writeText(fullId)
            }

            waitForElmExist('.title-container help-tooltip-icon').then((e) => {
                e.parentNode.insertBefore(node, e.nextSibling)
            })
        });
    });
});
