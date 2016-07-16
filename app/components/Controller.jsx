import React from 'react'
import { connect } from 'react-redux'
import { startTimer, stopTimer } from '../utils/timerMiddleware'
import { restartGame, moveLeft, moveRight, rotate } from '../actions'
// import ImmutablePropTypes from 'react-immutable-proptypes'

@connect(state => state.toObject(), {
  startTimer,
  stopTimer,
  restartGame,
  moveLeft,
  moveRight,
  rotate,
})
export default class Controller extends React.Component {
  static propTypes = {
    score: React.PropTypes.number.isRequired,
    startTimer: React.PropTypes.func.isRequired,
    stopTimer: React.PropTypes.func.isRequired,
    restartGame: React.PropTypes.func.isRequired,
    moveLeft: React.PropTypes.func.isRequired,
    moveRight: React.PropTypes.func.isRequired,
    rotate: React.PropTypes.func.isRequired,
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keydown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydown)
  }

  keydown = event => {
    if (event.key === 'w' || event.keyCode === 87) {
      this.props.rotate()
    } else if (event.key === 'a' || event.keyCode === 65) {
      this.props.moveLeft()
    } else if (event.key === 'd' || event.keyCode === 68) {
      this.props.moveRight()
    } // s: 83
  }

  render() {
    const { score } = this.props
    return (
      <div className="controller">
        <h1>Controller</h1>
        <h2>当前分数: {score}</h2>
        <button onClick={() => this.props.startTimer(250)}>start</button>
        <button onClick={this.props.stopTimer}>stop</button>
        <button onClick={this.props.restartGame}>restart</button>
      </div>
    )
  }
}
