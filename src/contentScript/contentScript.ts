//LOCAL VARIABLES
import "./content.scss"

var rules: {
  [url: string]: () => void
};
var resultForRequests = [];
var resultsForCSS = [];


//RULES
function setRulesForCSS(){
  rules = {
    'gamecopyworld.com': filterGameCopyWorld,
    'StandardAdblock': adblockCSS
    };
}

//Function to test adblocking on website which does not have ad domains or are hidden.
async function filterGameCopyWorld() {
  const divs = document.getElementsByTagName('div')
  const iframes = document.getElementsByTagName('iframe') //iframe ads
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
   
    //ad videos block specific to this website
    if (
      div.style.display.indexOf('block') != -1 &&
      div.style.zIndex.indexOf('2147483647') != -1
    ) {
      div.style.display = 'none'
    }
  }
}

//block HTML elements if they contain the specific ad domains
async function adblockCSS(){
  //removeImages() //not working perfectly yet.
  removeLinks()
  //removeElements()
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
        if(resultsForCSS[j] != null){
          if(links[i].href.toString().includes(resultsForCSS[j].toString())){
            links[i].style.display = "none"
            break
          }
        }
      }
    }
  }
}

function removeElements(){
  var a = document.getElementsByTagName('a')
  for (var i = 0, l = a.length; i < l; i++) {
    if(a[i].href != null){
      for(var j = 0, max = resultsForCSS.length; j < max; j++){
        //console.log(resultsForCSS[j])
        if(resultsForCSS[j] != null){
          if(a[i].href.toString().includes(resultsForCSS[j].toString())){
            a[i].style.display = "none"
            //console.table(resultsForCSS[j])
            break
          }
        }
      }
    }
  }
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
  var actualHref = undefined;
  var actualParentHref = undefined;

  //jQuery function on current window -> tab
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
            e.stopPropagation();
            $(e.target).toggleClass('hovered', e.type === 'mouseover');
            
          })
          //hide element on click and disable hover styling
          $(element).on('click', function(e) {
            e.stopPropagation();
            var newElement = e.target
            newElement.className = e.target.className.replace(' hovered', " removedElementDetected");
            try{
              var root = newElement.attachShadow({mode: 'open'})
            }catch(k){
              root.removeChild(e.target)
            }
            var targetTrace = [root, element];
            var currentElem = element;
            //console.log(element)
            var p = 0;
            while(!currentElem.isEqualNode(document.body))
            {
              currentElem = currentElem.parentElement;
              targetTrace.push(currentElem)
              console.log(currentElem)            
              
            }
            // while(currentElem.isEqualNode(document.body)){
            //   currentElem = e.target
            //   console.log($(currentElem))
            //   targetTrace.push(currentElem)
            // }
            
            chrome.storage.sync.get('blockedHTMLElements', function(data){ 
              var setOfBlacklistedElements = new Set(data.blockedHTMLElements);
              var dataSet = {"blockedElementTag": e.target.tagName, "blockedElementClass": e.target.className, "blockedElementParentClass": e.target.parentElement.className, "blockedElementId": e.target.id, "blockedElementParentId": e.target.parentElement.id}
              setOfBlacklistedElements.add({"url": document.URL.toString().split('/')[2], "elementData" : e.target.parentElement.innerHTML, "rootData": targetTrace})
              chrome.storage.sync.set({ 'blockedHTMLElements': [...setOfBlacklistedElements] });
              
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
//deactivate DOM selector using jQuery
function deactivateDOMSelector(){
  $(document).off().find("*").off();
  $("body").find("*").each(function() {
    $(this).off("mouseover mouseout click");
});
}


//Upon reload remove already blocked elements
chrome.storage.sync.get('blockedHTMLElements', function(data){ 
  var setOfBlacklistedElements = new Set(data.blockedHTMLElements);
  for (var item of Array.from(setOfBlacklistedElements.values())) {
    if(document.URL.toString().includes(item['url'])){
      const currentElement = item["elementData"]
      const rootData : (HTMLElement | ShadowRoot)[] = item['rootData']      
      if(currentElement != null){
        searchElement(currentElement, rootData)
      }
    }
  }
})


/*
  DFS function to structure nodes of DOM and find the path to the blocked element.
  This is needed because the original selectors do not find all the elements in the DOM.
  Parameters:
    node - current node the algorithm is currently on
    nodeList - DOM tree / array of DOM elements 
    itemTrace - The blocked elements node path saved in an array *([document.body, .nextNode...]  )
    currentIndex - currently active node from itemTrace
*/
function depthFirstSearchRecursive(node, nodeList, itemTrace, currentIndex) {  
  if(itemTrace.length <= currentIndex+1)
  {
    return nodeList;
  }
  if (node) {    
      nodeList.push(node);    
      var children = node.children;
      for (var i = 0; i < children.length; i++) 
      {
        if(children[i].isEqualNode(itemTrace[currentIndex])){
          depthFirstSearchRecursive(children[i],nodeList, itemTrace, currentIndex+1);   

        }
         
      }

      
      //Each recursion passes down the traversed nodes and the array stored by the nodes
      
  }    
  return nodeList;  
} 


//DFS non-recursive version
function depthFirstSearch(node, searchedItem) {
  var nodes = [];
  if (node != null) {
      var stack = [];
      stack.push(node);
      while (stack.length != 0) {
        var item = stack.pop();
        nodes.push(item);
        var children = item.children;
          for (var i = children.length - 1; i >= 0; i--)
          {
            stack.push(children[i]);
          }
            
      }
  }
  return nodes;
}

//Main searching function for finding elements that were previously blocked on the given site
function searchElement(elementhtml, rootData: (HTMLElement | ShadowRoot)[]){
  var elements = createElementFromHTML(elementhtml)
  //console.log(elements)
  var element;
  if(elements.children.length){
    for(const current of elements.children){
      if(current.className.includes("removedElementDetected")){
        element = current
      }
    }
  }else{
    element = elements;
  }
  //console.log(element)
  $(element).removeClass("removedElementDetected")
  var nodeList = []
  var bodyElements= depthFirstSearchRecursive(document.body, nodeList=[], rootData.reverse(), 0)
  //depthFirstSearch(document.body, <Node>element)

  return false
  
 }

 function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div;
}

//Helper functions
function searchStringInArray (str, strArray) {
  for (var j=0; j<strArray.length; j++) {
      if (strArray[j].match(str)) return j;
  }
  return -1;
}
