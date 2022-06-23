import React from 'react'
import ReactDOM from 'react-dom'
import './options.scss'


const App: React.FC<{}> = () => {
  return (
    <div className='options-container'>
      <div className='title' >
        <img src='./logo.png' width={"10%"} height={"10%"}></img>
      </div>
      <div className='content'>
        <div className='subTitle'>
          Settings
        </div>
        <div className='separator'>
          <div className='menu-options'>
            <div className='list-item'>
              <button className="button-64" onClick={showBlacklistedElements}>
                <span className="text">
                  <img src='./elementDelete.png' width={24} height={24}></img>
                  Show blacklist elements
                </span>
              </button>
            </div>
            <div className='list-item'>
              <button className="button-64" onClick={showBlacklistedElements}>
                <span className="text">
                  <img src='./elementDelete.png' width={24} height={24}></img>
                  SOMETHING ELSE
                </span>
              </button>
            </div>
          </div>
          <div className='data-container'>
            <div className='data'>
              Valami
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)

var setOfBlacklistedElements;
function showBlacklistedElements() {
  chrome.storage.sync.get('blockedHTMLElements', function (data) {
    setOfBlacklistedElements = new Set(data.blockedHTMLElements);
  })
}

function clearLocalStorage() {
  chrome.storage.sync.clear()
}
