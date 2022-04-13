




chrome.runtime.onMessage.addListener((msg, sender, response) =>{
  if(msg.name == "getAdDomains"){
    const apiCall = "https://raw.githubusercontent.com/anudeepND/blacklist/14e5970c8484781dfeb3137c7692ede89932a92b/adservers.txt"
    console.log(apiCall)
    fetch(apiCall).then(function(res) {
      console.log("TESZT")
      if(res.status !== 200){
        response({word: 'Error', desc: 'There was a problem loading the ad domains'})
        return;
      }
      res.text().then(function(data){
        response({word: data});
      });
    }).catch(function(err){
      response({word: 'Error', desc: 'There was a problem loading the ad domains'})
    });

  }
  return true;
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

