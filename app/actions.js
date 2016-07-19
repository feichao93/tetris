import { Range } from 'immutable'
import { spawn, spawnCrazy, isValidTetromino, canMoveDown, getPoints, removeTiles } from './common'
import { TileInfo, Point } from './types'
import { TETROMINOS, ADD_SCORE, BOARD_WIDTH, BOARD_HEIGHT } from './constants'

// 重置tick的倒计时
export const RESET_TICK_TIMEOUT = 'RESET_TICK_TIMEOUT'

export const START = 'START'
export const PAUSE = 'PAUSE'
export const RESUME = 'RESUME'
export const GAME_OVER = 'GAME_OVER'
export const RESET = 'RESET'

export const SET_TETROMINO = 'SET_TETROMINO'
export const SET_SCORE = 'SET_SCORE'
export const SET_TILES = 'SET_TILES'
export const SET_SPEED = 'SET_SPEED'
export const CRAZY = 'CRAZY'
export const startCrazy = () => ({ type: CRAZY })

export const start = () => ({ type: START })
export const setSpeed = speed => dispatch => {
  dispatch({ type: SET_SPEED, speed })
  dispatch({ type: START }) // dispatch START刷新计时器
}
export const restart = () => dispatch => {
  dispatch({ type: RESET })
  dispatch({ type: START })
}
export const pause = () => ({ type: PAUSE })
export const resume = () => ({ type: RESUME })

export const move = ({ dx = 0, dy = 0, rotate = 0 }) => (dispatch, getState) => {
  const { tetromino, tiles } = getState().toObject()
  const movedTetromino = tetromino.move({ dx, dy, rotate })
  if (isValidTetromino(movedTetromino, tiles)) {
    dispatch({ type: SET_TETROMINO, tetromino: movedTetromino })
    return
  }
  const points = getPoints(movedTetromino)
  const minX = points.minBy(p => p.x).x
  if (minX < 0) { // 旋转之后tetromino太靠左, 需要自动向右移动
    const amendedTetromino = movedTetromino.move({ dx: -minX })
    if (isValidTetromino(amendedTetromino, tiles)) {
      dispatch({ type: SET_TETROMINO, tetromino: amendedTetromino })
      return
    }
  }
  const maxX = points.maxBy(p => p.x).x
  if (maxX >= BOARD_WIDTH) { // 旋转之后tetromino太靠右, 需要自动向左移动
    const amendedTetromino = movedTetromino.move({ dx: -maxX + BOARD_WIDTH - 1 })
    if (isValidTetromino(amendedTetromino, tiles)) {
      dispatch({ type: SET_TETROMINO, tetromino: amendedTetromino })
    }
  }
  // 否则该次移动无效
}

export const moveLeft = () => move({ dx: -1 })
export const moveRight = () => move({ dx: 1 })
export const moveDown = () => dispatch => {
  dispatch(move({ dy: 1 }))
  dispatch({ type: RESET_TICK_TIMEOUT })
}
export const rotate = () => move({ rotate: 270 })

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
  const { tetromino, tiles, score, crazy } = getState().toObject()
  // tick=0 时需要生成第一个tetromino
  if (!tetromino) {
    dispatch({ type: SET_TETROMINO, tetromino: crazy ? spawnCrazy(tiles) : spawn() })
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
  const afterUnion = tiles.union(getPoints(tetromino).map(point => TileInfo({
    point,
    color: TETROMINOS[tetromino.type].color,
  })))
  const afterRemove = removeTiles(afterUnion)
  dispatch({
    type: SET_SCORE,
    score: score + ADD_SCORE[afterUnion.size - afterRemove.size],
  })
  dispatch({ type: SET_TETROMINO, tetromino: crazy ? spawnCrazy(afterRemove) : spawn() })
  dispatch({ type: SET_TILES, tiles: afterRemove })
}

export const special = () => (dispatch, getState) => {
  // 清理最下面3行
  const { tiles, score } = getState().toObject()
  const helpers = Range(BOARD_HEIGHT - 3, BOARD_HEIGHT).map(y =>
    Range(0, BOARD_WIDTH).map(x => TileInfo({
      point: Point({ x, y }),
      color: 'gold',
    }))).flatten(true)
    .toSet()
  const afterUnion = tiles.union(helpers)
  const afterRemove = removeTiles(afterUnion)
  dispatch({ type: SET_TILES, tiles: afterRemove })
  dispatch({
    type: SET_SCORE,
    score: score + ADD_SCORE[3 * BOARD_WIDTH],
  })
}
