//LOCAL VARIABLES
import "./content.scss"

var rules: {
  [url: string]: () => void
};
var resultForRequests = [];
var resultsForCSS = [];



async function filterGameCopyWorld() {
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

async function adblockCSS(){
  //removeImages() //not working perfectly yet.
  removeLinks()
}

function removeImages(){
  var images = document.getElementsByTagName('img');
  for (var i = 0, l = images.length; i < l; i++) {
    if(images[i].src != null){
      for(var j = 0, max = resultsForCSS.length; j < max; j++){
        //console.log(resultsForCSS[j])
        if(resultsForCSS[j] != null){
          if(images[i].src.toString().includes(resultsForCSS[j].toString())){
            images[i].style.display = "none"
            //console.table(resultsForCSS[j])
            break
          }
        }
      }
    }
  }
}

function removeLinks(){
  var links = document.getElementsByTagName('link')
  for (var i = 0, l = links.length; i < l; i++) {
    if(links[i].href != null){
      for(var j = 0, max = resultsForCSS.length; j < max; j++){
        //console.log(resultsForCSS[j])
        if(resultsForCSS[j] != null){
          if(links[i].href.toString().includes(resultsForCSS[j].toString())){
            links[i].style.display = "none"
            //console.table(resultsForCSS[j])
            break
          }
        }
      }
    }
  }
}

function searchStringInArray (str, strArray) {
  for (var j=0; j<strArray.length; j++) {
      if (strArray[j].match(str)) return j;
  }
  return -1;
}


function setRulesForCSS(){
  rules = {
    'gamecopyworld.com': filterGameCopyWorld,
    'StandardAdblock': adblockCSS
    };
}


function parseServers(responseString, isRequestBlock)
{
    responseString = responseString.substring(responseString.indexOf("0.0.0.0 "));
    var responseArray = responseString.split(/\n/)
    //var responseArray = responseString.split(/\r?\n/)
    
    for (let i = 0; i < responseArray.length; i++)
    {
      if(isRequestBlock){ //if we want to block the request API
        responseArray[i] = responseArray[i].replace("0.0.0.0 ", "*://*.");
        responseArray[i] = responseArray[i].concat("/*");
      }else{ //if we want to block the css
        responseArray[i] = responseArray[i].replace("0.0.0.0 ", "");
      }
    }
    return responseArray;
}




//The ad servers arrive here:
chrome.runtime.sendMessage({name: "getAdDomains"}, (response) => {
  resultForRequests = parseServers(response.word, true); //result has the formatted ad servers. False means we want css injection
  resultsForCSS = parseServers(response.word, false);
  setRulesForCSS();
  var isRealRule = false;

  for(const rule in rules){
    if (document.URL.toString().includes(rule)) {
      isRealRule = true;
      rules[rule]()
      break;
    }
  }
  if(!isRealRule){
    rules['StandardAdblock']()
  }
  
})

//When the user clicks on the "Block element" button on the popup page the DOMSelector activates / deactivates
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "DOMSelectorControl" ) {
      if(request.command == 'turnOff'){
        deactivateDOMSelector()
      }
      else{
        DOMSelectorControl();
      }
      
    }
  }
);

//If the DOMSelector is activated on hover we highlight the DOM elements and on click we hide it.
function DOMSelectorControl(){
  //search for element
  jQuery(window).on('mouseover mouseout click',function(e) {
      var x = e.clientX, y = e.clientY,
          elementMouseIsOver = document.elementFromPoint(x, y);
          var element = <HTMLElement>elementMouseIsOver
          //styling on hovered element
          $(element).on('mouseover mouseout', function(e){
            $(e.target).toggleClass('hovered', e.type === 'mouseover');
            e.stopPropagation();
          })
          //hide element on click and disable hover styling
          $(element).on('click', function(e) {
            $(e.target).css("display", "none")
            $(e.target).unbind('mouseover mouseout click')
            $(element).unbind('mouseover mouseout click')
            jQuery(window).off('mouseover mouseout click')
            $(document).off().find("*").off();
            $("body").find("*").each(function() {
              $(this).off("mouseover mouseout click");
          });
            e.stopPropagation();
          })
          
    });
}

function deactivateDOMSelector(){
  $(document).off().find("*").off();
  $("body").find("*").each(function() {
    $(this).off("mouseover mouseout click");
});
}
