import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import * as FlexLayout from "flexlayout-react";
import './popup.scss'

const App: React.FC<{}> = () => {
  return (
      <div className='container'>
        <div className='title'>VT-Adblock</div>
        <div className='content'>
          <button onClick={activateDOMSelector}>
            Block Element
          </button>
        </div>
      </div>
  )
}



var isDOMSelectorActive = false; 
function activateDOMSelector(){
 if(!isDOMSelectorActive){
  var command = "turnOn"

 }else{
  var command = 'turnOff'
 }
 var message = "DOMSelectorControl"
 chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, {"message": message, "command": command});
 });
 isDOMSelectorActive = !isDOMSelectorActive;
}




const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
