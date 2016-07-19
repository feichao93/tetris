import React from 'react'
import Controller from './components/Controller.jsx'
import Board from './components/Board.jsx'
import Help from './components/Help.jsx'
import './styles/app.styl'

const App = () => (
  <div className="app">
    <Controller />
    <Board />
    <Help />
  </div>
)

export default App
