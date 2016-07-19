import React from 'react'
import { connect } from 'react-redux'
import { start, stop, moveLeft, moveRight, rotate } from '../actions'

@connect(state => state.toObject(), {
  start,
  stop,
  moveLeft,
  moveRight,
  rotate,
})
export default class Controller extends React.Component {
  static propTypes = {
    score: React.PropTypes.number.isRequired,
    start: React.PropTypes.func.isRequired,
    stop: React.PropTypes.func.isRequired,
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
        <button onClick={() => this.props.start(200)}>start</button>
        <button onClick={this.props.stop}>stop</button>
      </div>
    )
  }
}
