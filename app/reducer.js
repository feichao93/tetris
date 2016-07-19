import { Map, Set } from 'immutable'
import {
  START,
  RESET,
  SET_SPEED,
  SET_TETROMINO,
  SET_TILES,
  SET_SCORE,
  GAME_OVER,
  PAUSE,
  RESUME,
  CRAZY,
} from './actions'

const initialState = Map({
  tiles: Set(),
  tetromino: null,
  score: 0,
  on: false, // 标记游戏是否正在进行中
  paused: false, // 标记游戏是否暂停
  gameover: false, // 标记游戏是否结束
  crazy: false,
  speed: 2,
})

export default function reducer(state = initialState, action) {
  if (action.type === RESET) {
    const { speed, crazy } = state.toObject()
    return initialState.merge({ speed, crazy })
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
  } else if (action.type === SET_SPEED) {
    return state.set('speed', action.speed)
  } else if (action.type === CRAZY) {
    return state.set('crazy', true)
  }
  return state
}
