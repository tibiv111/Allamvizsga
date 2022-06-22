chrome.runtime.onMessage.addListener((msg, sender, response) =>{
  //API call happens in background when "getAdDomains" message arrives, then sends back the result
  if(msg.name == "getAdDomains"){
    const apiCall = "https://raw.githubusercontent.com/anudeepND/blacklist/14e5970c8484781dfeb3137c7692ede89932a92b/adservers.txt"
    fetch(apiCall).then(function(res) {
      if(res.status !== 200){
        response({message: "There was a problem loading the ad domains" , status: res.status})
        return;
      }
      res.text().then(function(data){
        response({message: data, status: res.status});
        return true;
      });
    }).catch(function(err){
      response({message: 'Error: ' + err, desc: 'There was a problem loading the ad domains'})
    });
  }
      return true
})

chrome.storage.sync.set({"isDOMSelectorActive": false})


chrome.storage.sync.get('blockedHTMLElements', function(data){
  if(data.blockedHTMLElements === null){
    var blockedHTMLElementsSet = new Set();
    chrome.storage.sync.set({ 'blockedHTMLElements': [...blockedHTMLElementsSet] });
  }
})






// chrome.runtime.onUpdateAvailable.addListener(function() {
//     console.log('open');
//   })

//   function forwardRequest(message) {
//     return new Promise((resolve, reject) => {
//       chrome.runtime.sendMessage(message, (response) => {
//         if (!response) return reject(chrome.runtime.lastError)
//         return resolve(response)
//       })
//     })
//   }

//   chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     // sendResponse can be used to send back a result to the content script
//     fetch(`https://github.com/${request.url}`)
//          .then((response) => response.json())
//          .then((codeTourContent) => sendResponse(codeTourContent))
//     // As we will reply asynchronously to the request, we need to tell chrome to wait for our response
//     return true
// })

