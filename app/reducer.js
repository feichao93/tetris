import { Map, Set } from 'immutable'
import {
  START,
  RESET,
  MOVE,
  SET_TETROMINO,
  SET_TILES,
  SET_SCORE,
  GAME_OVER,
  PAUSE,
  RESUME,
} from './actions'
import { isValidTetromino } from './common'

const initialState = Map({
  tiles: Set(),
  tetromino: null,
  score: 0,
  on: false, // 标记游戏是否正在进行中
  paused: false, // 标记游戏是否暂停
  gameover: false, // 标记游戏是否结束
  tickInterval: 250,
})

export default function reducer(state = initialState, action) {
  const { tetromino, tiles, tickInterval } = state.toObject()
  if (action.type === RESET) {
    return initialState.set('tickInterval', tickInterval)
  } else if (action.type === START) {
    return state.set('on', true)
  } else if (action.type === PAUSE) {
    return state.set('paused', true)
  } else if (action.type === RESUME) {
    return state.set('paused', false)
  } else if (action.type === GAME_OVER) {
    return state.set('gameover', true)
  } else if (action.type === SET_TETROMINO) {
    return state.set('tetromino', action.tetromino)
  } else if (action.type === SET_TILES) {
    return state.set('tiles', action.tiles)
  } else if (action.type === SET_SCORE) {
    return state.set('score', action.score)
  } else if (action.type === MOVE) {
    const { dx, dy, rotate } = action
    const movedTetromino = tetromino.move({ dx, dy, rotate })
    if (isValidTetromino(movedTetromino, tiles)) {
      return state.set('tetromino', movedTetromino)
    }
    return state
  }
  return state
}
