import { Map, Set } from 'immutable'
import { TICK } from './utils/timerMiddleware'
import { MOVE } from './actions'
import { TileInfo, TetrominoInfo, Point } from './types'
import { COLORS, TETROMINO_TYPES, TETROMINO_COLORS } from './constants'
import { canMoveDown, getPoints, removeTiles, spawn, isValidTetromino } from './utils/common'

const initialState = Map({
  tiles: Set([
    TileInfo.of(0, 19, COLORS.CYAN),
    TileInfo.of(1, 19, COLORS.CYAN),
    TileInfo.of(2, 19, COLORS.CYAN),
    TileInfo.of(3, 19, COLORS.CYAN),
    TileInfo.of(4, 19, COLORS.CYAN),
    TileInfo.of(6, 19, COLORS.PURPLE),
    TileInfo.of(7, 19, COLORS.RED),
    TileInfo.of(8, 19, COLORS.RED),
    TileInfo.of(9, 19, COLORS.RED),
  ]),
  tetromino: TetrominoInfo({
    type: TETROMINO_TYPES.I,
    refPoint: Point({ x: 5, y: 0 }),
    angle: 90,
  }),
  score: 0,
})


export default function reducer(state = initialState, action) {
  const { tetromino, tiles, score } = state.toObject()
  if (action.type === TICK) {
    // todo 可能需要先判断游戏是否已经结束, 或是游戏是否处于暂停状态等
    // if(isGameOver(state)) {
    //   return state.xxx
    // }
    if (canMoveDown(tetromino, tiles)) {
      return state.updateIn(['tetromino', 'refPoint', 'y'], y => y + 1)
    }
    // The tetromino cannot move down. We need to do following things:
    // 1. Turn the tetromino into cooresponding tiles.
    // 2. Judge whether the tiles cound be removed and update the score.
    // 3. Try to spawn new tetromino.
    // -- If cannot spawn, then game is over.
    // -- If can spawn, then game continues.
    // state.update('tiles', ts => ts.union(getPoints(tetromino)))
    const unionedTiles = tiles.union(
      getPoints(tetromino).map(({ x, y }) => TileInfo.of(x, y, TETROMINO_COLORS[tetromino.type])))
    const clearedTiles = removeTiles(unionedTiles)
    const newScore = score + unionedTiles.size - clearedTiles.size
    return state.merge({
      tiles: clearedTiles,
      tetromino: spawn(), // todo reducer has side-effect
      score: newScore,
    })
  } else if (action.type === MOVE) {
    const { dx, dy, rotate } = action
    const movedTetromino = tetromino.updateIn(['refPoint', 'x'], x => x + dx)
      .updateIn(['refPoint', 'y'], y => y + dy)
      .update('angle', angle => (angle + rotate) % 360)
    if (isValidTetromino(movedTetromino, tiles)) {
      return state.set('tetromino', movedTetromino)
    }
    return state
  }
  return state
}
