import React from 'react'
import Controller from './components/Controller.jsx'
import Board from './components/Board.jsx'
import './styles/app.styl'

const App = () => (
  <div className="app">
    <Controller />
    <Board />
  </div>
)

export default App
