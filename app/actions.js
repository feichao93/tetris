import { spawn, isValidTetromino, canMoveDown, getPoints, removeTiles } from './common'
import { TileInfo } from './types'
import { TETROMINOS, ADD_SCORE } from './constants'

// 重置tick的倒计时
export const RESET_TICK_TIMEOUT = 'RESET_TICK_TIMEOUT'

export const MOVE = 'MOVE'
export const moveLeft = () => ({ type: MOVE, dx: -1, dy: 0, rotate: 0 })
export const moveRight = () => ({ type: MOVE, dx: 1, dy: 0, rotate: 0 })
export const moveDown = () => dispatch => {
  dispatch({ type: MOVE, dx: 0, dy: 1, rotate: 0 })
  dispatch({ type: RESET_TICK_TIMEOUT })
}
export const rotate = () => ({ type: MOVE, dx: 0, dy: 0, rotate: 270 })

export const START = 'START'
export const PAUSE = 'PAUSE'
export const RESUME = 'RESUME'
export const GAME_OVER = 'GAME_OVER'
export const RESET = 'RESET'

export const SET_TETROMINO = 'SET_TETROMINO'
export const SET_SCORE = 'SET_SCORE'
export const SET_TILES = 'SET_TILES'

export const start = () => ({ type: START })
export const restart = () => dispatch => {
  dispatch({ type: RESET })
  dispatch({ type: START })
}
export const pause = () => ({ type: PAUSE })
export const resume = () => ({ type: RESUME })

export const drop = () => (dispatch, getState) => {
  const state = getState()
  const tiles = state.get('tiles')
  let dropResult = state.get('tetromino')
  if (!dropResult) {
    return
  }
  while (isValidTetromino(dropResult, tiles)) {
    dropResult = dropResult.move({ dy: 1 })
  }
  dispatch({ type: SET_TETROMINO, tetromino: dropResult.move({ dy: -1 }) })
}

export const tick = (dispatch, getState) => {
  const { tetromino, tiles, score } = getState().toObject()
  // tick=0 时需要生成第一个tetromino
  if (!tetromino) {
    dispatch({ type: SET_TETROMINO, tetromino: spawn() })
    return
  }
  // 需要先判断游戏是否已经结束, 或是游戏是否处于暂停状态等
  if (!isValidTetromino(tetromino, tiles)) {
    // 这里的tetromino是上一个tick时生成的, 该tetromino非法说明游戏结束
    /* eslint-disable no-alert, no-console */
    dispatch({ type: GAME_OVER })
    alert('game over!')
    return
  }

  if (canMoveDown(tetromino, tiles)) {
    dispatch({
      type: SET_TETROMINO,
      tetromino: tetromino.move({ dy: 1 }),
    })
    return
  }

  // The tetromino cannot move down. We need to do following things:
  // 1. Turn the tetromino into cooresponding tiles.
  // 2. Judge whether the tiles cound be removed and update the score.
  // 3. Try to spawn new tetromino.
  // -- If cannot spawn, then game is over.
  // -- If can spawn, then game continues.
  const unionedTiles = tiles.union(getPoints(tetromino).map(point => TileInfo({
    point,
    color: TETROMINOS[tetromino.type].color,
  })))
  const removedTiles = removeTiles(unionedTiles)
  dispatch({
    type: SET_SCORE,
    score: score + ADD_SCORE[unionedTiles.size - removedTiles.size],
  })
  dispatch({ type: SET_TETROMINO, tetromino: spawn() })
  dispatch({ type: SET_TILES, tiles: removedTiles })
}
