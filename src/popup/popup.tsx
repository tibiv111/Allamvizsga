import React, { Component, useEffect, createRef } from 'react'
import ReactDOM from 'react-dom'
import lottie from 'lottie-web';
import './popup.scss'

const App: React.FC<{}> = () => {
  return (
    <div className='container'>
      <div className='title'>
        <img src='./logo.png' width={300} height={100}></img>
      </div>
      <div className='content'>
        <button className="button-64" onClick={activateDOMSelector}>

          <span className="text">
            <img src='./elementDelete.png' width={16} height={16}></img>
            Block element
          </span>
        </button>
        <button className="button-64" onClick={openOptionsPage}>
          <span className="text">
            <img src='./settings.png' width={16} height={16}></img>
            Options
          </span>
        </button>

      </div>
      <div className="animation-container">
        <img src="./adblock_animation.gif" alt="popup_animation" />
      </div>
    </div>
  )
};
export default App;






//DOM selector activation for block elements
var isDOMSelectorActive = false;
function activateDOMSelector() {
  if (!isDOMSelectorActive) {
    var command = "turnOn"

  } else {
    var command = 'turnOff'
  }
  var message = "DOMSelectorControl"
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { "message": message, "command": command });
  });
  isDOMSelectorActive = !isDOMSelectorActive;
}

function openOptionsPage() {
  chrome.runtime.openOptionsPage()
  //chrome.storage.sync.clear()
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
