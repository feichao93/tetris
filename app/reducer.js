import { Map, Set } from 'immutable'
import { MOVE, SET_TETROMINO, SET_TILES, SET_SCORE, RESET_GAME } from './actions'
import { isValidTetromino } from './common'

const initialState = Map({
  tiles: Set(),
  tetromino: null,
  score: 0,
  gameover: false, // todo 用于标志游戏结束, 游戏结束之后提示用户游戏已经结束
  // on: false, // todo 用于标志游戏正在进行中
})

export default function reducer(state = initialState, action) {
  const { tetromino, tiles } = state.toObject()
  if (action.type === RESET_GAME) {
    return initialState
  } else if (action.type === SET_TETROMINO) {
    return state.set('tetromino', action.tetromino)
  } else if (action.type === SET_TILES) {
    return state.set('tiles', action.tiles)
  } else if (action.type === SET_SCORE) {
    return state.set('score', action.score)
  } else if (action.type === MOVE) {
    const { dx, dy, rotate } = action
    const movedTetromino = tetromino.updateIn(['refPoint', 'x'], x => x + dx)
      .updateIn(['refPoint', 'y'], y => y + dy)
      .update('angle', angle => angle + rotate)
      .amendAngle()
    if (isValidTetromino(movedTetromino, tiles)) {
      return state.set('tetromino', movedTetromino)
    }
    return state
  }
  return state
}
