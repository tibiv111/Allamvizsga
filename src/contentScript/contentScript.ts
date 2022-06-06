const rules: {
  [url: string]: () => void
} = {
  'https://gamecopyworld.com/games/index.php': filterGameCopyWorld
}

function filterNYTTechnology() {
  const app = document.getElementById('site-content')
  const wrapper = document.getElementById('top-wrapper')
  app.removeChild(wrapper)
}

async function adblock(){
  const apiUrl = 'https://raw.githubusercontent.com/anudeepND/blacklist/14e5970c8484781dfeb3137c7692ede89932a92b/adservers.txt';
  const response = await fetch(apiUrl)
  const data = await response.json();
  this.setState({ webUrls: data.total })
  //console.log(this.webUrls)
}

async function filterGameCopyWorld() {
  //console.log("TEST")
  const divs = document.getElementsByTagName('div')
  const iframes = document.getElementsByTagName('iframe') //iframe-be menti a reklamot
  const as = document.getElementsByTagName('a')

  
  for (const div of divs) {
    if (div.className === 'chk') {
      div.style.display = 'none'
    }
    

    const iframeIds= ['bs', 'sk', 'btm', 'bn']
    for(const iframe of iframes){
      if(searchStringInArray(iframe.id, iframeIds) !== -1)
      {
        iframe.style.display = 'none'
      }
    }

    // for(const a of as){
    //   if(a.href)
    //   {
    //     a.style.display = 'none'
    //   }
    // }
    
    if (
      div.style.display.indexOf('block') != -1 &&
      div.style.zIndex.indexOf('2147483647') != -1
    ) {
      div.style.display = 'none'
    }
  }
}

function searchStringInArray (str, strArray) {
  for (var j=0; j<strArray.length; j++) {
      if (strArray[j].match(str)) return j;
  }
  return -1;
}


var result = [];
//The ad servers arrive here:
chrome.runtime.sendMessage({name: "getAdDomains"}, (response) => {
  result = parseServers(response.word, false) //result has the formatted ad servers. False means we want css injection
})


function parseServers(responseString, requestBlock)
{
    responseString = responseString.substring(responseString.indexOf("0.0.0.0 "));
    var responseArray = responseString.split(/\n/)
    //var responseArray = responseString.split(/\r?\n/)
    
    for (let i = 0; i < responseArray.length; i++)
    {
      if(requestBlock){ //if we want to block the request API
        responseArray[i] = responseArray[i].replace("0.0.0.0 ", "*://*.");
        responseArray[i] = responseArray[i].concat("/*");
      }else{ //if we want to block the css
        responseArray[i] = responseArray[i].replace("0.0.0.0 ", "");
      }
    }
    //TODO
    //
    return responseArray;
}


if (document.URL in rules) {
  //console.log("URL: ")
  //console.log(document.URL)
  rules[document.URL]()
}





// document.addEventListener("DOMContentLoaded", function(){
//   Array.from(
//     document.querySelectorAll('div[role=row] > div[role="rowheader"] > span > a').values(),
//   ).map(
//     async (parentElement) => {
//         const title = parentElement.getAttribute('title')
//         const href = parentElement.getAttribute('href')
//         const codeTourUrl = href.replace('blob', 'raw')

//         // Now forward request will behave like fetch
//         const content = await forwardRequest({ url: codeTourUrl })
//         console.log(title, content)
// })
// })


// chrome.webRequest.onBeforeRequest.addListener(
//   function() {
//       return {cancel: true};
//   },
//   {
//       urls: result
//   },
//   ["blocking"]
// );





// Ensures ads will be removed as the user scrolls
// setInterval(function () {
//   removeAds();
// }, 100000)