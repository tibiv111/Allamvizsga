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

  if(response.status == 200){
    resultForRequests = parseServers(response.message, true); //result has the formatted ad servers. False means we want css injection
    resultsForCSS = parseServers(response.message, false);
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
  }
  
})

//When the user clicks on the "Block element" button on the popup page the DOMSelector activates / deactivates
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "DOMSelectorControl" ) {
      if(request.command == 'turnOff'){
        deactivateDOMSelector()
        isEditing = false;
      }
      else{
        DOMSelectorControl();
        isEditing = true;
      }
      
    }
  }
);
var isEditing = false;
window.addEventListener("beforeunload", event => {
  console.log(isEditing)
  if (!isEditing) return
  event.preventDefault()
  // Chrome requires returnValue to be set.
  event.returnValue = ""
})


//If the DOMSelector is activated on hover we highlight the DOM elements and on click we hide it.
function DOMSelectorControl(){
  //search for element

  jQuery(window).on('mouseover mouseout click',function(e) {
    isEditing = false;
    var selectedHTMLElement;
    var wasSelected = false;
      var x = e.clientX, y = e.clientY,
          elementMouseIsOver = document.elementFromPoint(x, y);
          var element = <HTMLElement>elementMouseIsOver
          //styling on hovered element
          $(element).on('mouseover mouseout', function(e){
            if(!wasSelected){
              selectedHTMLElement = e.target;
              wasSelected = true;
            }
            
            $(e.target).toggleClass('hovered', e.type === 'mouseover');
            e.stopPropagation();
          })
          //hide element on click and disable hover styling
          $(element).on('click', function(e) {
            $(e.target).css("display", "none")

            chrome.storage.sync.get('blockedHTMLElements', function(data){ 
              var setOfBlacklistedElements = new Set(data.blockedHTMLElements);
              
              var dataSet = {"blockedElementTag": e.target.tagName, "blockedElementClass": e.target.className, "blockedElementParentClass": e.target.parentElement.className, "blockedElementId": e.target.id, "blockedElementParentId": e.target.parentElement.id}
              setOfBlacklistedElements.add({"url": document.URL.toString().split('/')[2], "elementData" : selectedHTMLElement.outerHTML})
              chrome.storage.sync.set({ 'blockedHTMLElements': [...setOfBlacklistedElements] });
              //console.log(setOfBlacklistedElements)
              
            })
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



chrome.storage.sync.get('blockedHTMLElements', function(data){ 
  var setOfBlacklistedElements = new Set(data.blockedHTMLElements);
  for (var item of Array.from(setOfBlacklistedElements.values())) {
    if(document.URL.toString().includes(item['url'])){
      //const currentElement = item["elementData"]
      // const currentElement = item["elementData"].replace(' hovered" style="display: none;', "");
      // if(currentElement != null){
      //   if(searchElement(currentElement)){
      //     console.log("True")
      //   }
        
        
      //   // if(currentElement['blockedElementId'] != null){
      //   //   document.getElementById(currentElement['blockedElementId'])
      //   // }
      //   // else{
      //   //   if(currentElement['blockedElementClass'] != null){
      //   //     const classes = document.getElementsByClassName(currentElement['blockedElementClass'])
      //   //     for(const newItem of classes){
      //   //       if(newItem.parentElement.id == )
      //   //     }
            
      //   //   }
      //   // }

      //   // }
      //   // console.log(currentElement['blockedElementTag'])

        
      //   // console.log(currentElement['blockedElementParentClass'])
      //   // console.log(currentElement['blockedElementId'])
      // }
      
      //"blockedElementTag": e.target.tagName, "blockedElementClass": e.target.className, "blockedElementParentClass": e.target.parentElement.className, "blockedElementId": e.target.id
    }
    
  }
  
})

function searchElement(elementhtml){
  
  
  var currElement = elementhtml.split(";").slice(-1)[0];
  const tag = currElement.split(" ")[0].substring(1)
  currElement = currElement.split("/"+tag)[0]+"/"+tag+">"
  
  jQuery(document).ready(function(){
    //console.log(createElementFromHTML(currElement))
    console.log(document.body.querySelectorAll(tag).values())
    $('span IqJTee').empty();
    //console.log($('span IqJTee'))
  })
  
  //console.log(jQuery.data(createElementFromHTML(currElement)))
  //document.body.appendChild(createElementFromHTML(elementhtml))
  // const myClass = currElement.split('class="')[1].split('"')[0];

  // const elements = document.querySelector(myClass);
  // console.log(elements)

  // document.querySelectorAll(tag).forEach(element =>{
  //   console.log(element)
  //   if(element.outerHTML.toString().includes(currElement) ){
  //     console.log(element.outerHTML)
  //     $(element).css("display", "none")
  //     return true
  //   }else{
  //     //console.log(element)
  //   }
  // })
  return false
  
  
 }

 function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}