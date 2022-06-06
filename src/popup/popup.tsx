import React from 'react'
import ReactDOM from 'react-dom'
import * as FlexLayout from "flexlayout-react";
import './popup.scss'

const App: React.FC<{}> = () => {
  return (
      <div className='container'>
        <div className='title'>MadBlock</div>
        <div className='content'></div>
      </div>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
