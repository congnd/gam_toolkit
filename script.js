var dataDOMElement = document.createElement('div');
dataDOMElement.id = '__interceptedData';
dataDOMElement.style.height = 0;
dataDOMElement.style.overflow = 'hidden';

document.addEventListener("DOMContentLoaded", function(event) {
    document.body.appendChild(dataDOMElement);
})

var XHR = XMLHttpRequest.prototype;
      var send = XHR.send;
      var open = XHR.open;
      XHR.open = function(method, url) {
          this.url = url; // the request url
          return open.apply(this, arguments);
      }
      XHR.send = function(body) {
          this.addEventListener('load', function() {
              if (body != undefined) {
                try {
                var request = JSON.parse(body)
                if ((request != null) && (request.method == 'getAdUnit')) {
                    if (document.URL.includes(request.params['1226'])) {
                        dataDOMElement.setAttribute("data", this.response);
                    }
                }               
                } catch (error) {
                    console.log(error);
                }
              }
          });
          return send.apply(this, arguments);
      };