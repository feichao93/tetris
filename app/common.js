import { Set, Range, Map } from 'immutable'
import { TETROMINO_TYPES, BOARD_HEIGHT, BOARD_WIDTH, TETROMINOS } from './constants'
import { Point, TetrominoInfo, TileInfo } from './types'

/** 判断一个点是否合法 */
export function isValidPoint(point) {
  return (point.x >= 0 && point.x < BOARD_WIDTH)
    && (point.y >= 0 && point.y < BOARD_HEIGHT)
}

/** 获取tetromino的坐标集合 */
export function getPoints({ type, refPoint, angle }) {
  if (type === TETROMINO_TYPES.O) {
    return Set([
      refPoint,
      refPoint.relative({ dx: 1, angle }),
      refPoint.relative({ dy: -1, angle }),
      refPoint.relative({ dx: 1, dy: -1, angle }),
    ])
  }
  if (type === TETROMINO_TYPES.I) {
    return Set([
      refPoint,
      refPoint.relative({ dx: -1, angle }),
      refPoint.relative({ dx: 1, angle }),
      refPoint.relative({ dx: 2, angle }),
    ])
  }
  if (type === TETROMINO_TYPES.T) {
    return Set([
      refPoint,
      refPoint.relative({ dx: -1, angle }),
      refPoint.relative({ dx: 1, angle }),
      refPoint.relative({ dy: 1, angle }),
    ])
  }
  if (type === TETROMINO_TYPES.J) {
    return Set([
      refPoint,
      refPoint.relative({ dy: -1, angle }),
      refPoint.relative({ dy: 1, angle }),
      refPoint.relative({ dx: -1, dy: 1, angle }),
    ])
  }
  if (type === TETROMINO_TYPES.L) {
    return Set([
      refPoint,
      refPoint.relative({ dy: -1, angle }),
      refPoint.relative({ dy: 1, angle }),
      refPoint.relative({ dx: 1, dy: 1, angle }),
    ])
  }
  if (type === TETROMINO_TYPES.S) {
    return Set([
      refPoint,
      refPoint.relative({ dx: 1, angle }),
      refPoint.relative({ dy: 1, angle }),
      refPoint.relative({ dx: -1, dy: 1, angle }),
    ])
  }
  if (type === TETROMINO_TYPES.Z) {
    return Set([
      refPoint,
      refPoint.relative({ dx: -1, angle }),
      refPoint.relative({ dy: 1, angle }),
      refPoint.relative({ dx: 1, dy: 1, angle }),
    ])
  }
  return Set()
}

export function isValidTetromino(tetromino, tiles) {
  const points = getPoints(tetromino)
  return points.every(isValidPoint)
    && points.intersect(tiles.map(tile => tile.point)).size === 0
}

/** 判断tetromino能否继续往下移动 */
export function canMoveDown(tetromino, tiles) {
  const afterMove = tetromino.move({ dy: 1 })
  return isValidTetromino(afterMove, tiles)
}

function getRemoveRowIndices(tiles) {
  const points = tiles.map(tile => tile.point).toSet()
  let shouldRemove = Range(0, BOARD_HEIGHT).map(() => true).toMap()
  Range(0, BOARD_HEIGHT).forEach(y => {
    Range(0, BOARD_WIDTH).forEach(x => {
      const p = Point({ x, y })
      if (!points.includes(p)) {
        shouldRemove = shouldRemove.set(y, false)
        return false
      }
      return true
    })
  })
  return shouldRemove.filter(x => x).keySeq() // 要移除的tiles的y坐标值
}

/** 移除可以消除的方块, 并返回新的tiles集合 */
export function removeTiles(tiles) {
  const rowIndices = getRemoveRowIndices(tiles)
  const downLength = Range(0, BOARD_HEIGHT).map(n => rowIndices.filter(x => x > n).count())
  // rowIndices example: [0, 2, 3]  表示有三行可以移除
  return tiles.filterNot(tile => rowIndices.includes(tile.point.y)) // 移除满足条件的若干行
    .map(tile => tile.updateIn(['point', 'y'], y => y + downLength.get(y))) // 更新剩下的tiles的y坐标值
}

function getRandomTetrominoType() {
  const r = Math.random()
  const array = Object.keys(TETROMINO_TYPES)
  return array[Math.floor(r * array.length)]
}

/** 生成新的tetromino */
export function spawn() {
  return TetrominoInfo({
    type: getRandomTetrominoType(),
    refPoint: Point({ x: 5, y: 1 }),
    angle: 0,
  })
}

function dropToBottom(tetromino, tiles) {
  const points = getPoints(tetromino)
  const tilePoints = tiles.map(tile => tile.point)
  const tetrominoBottom = points.groupBy(p => p.x).map(ps => ps.map(p => p.y).max())
  const relatedXs = tetrominoBottom.keySeq().toSet()
  const tilesTop = relatedXs.toMap().map(x => {
    const ps = tilePoints.filter(p => p.x === x)
    return ps.isEmpty() ? BOARD_HEIGHT : ps.map(p => p.y).min()
  })
  const dys = relatedXs.toMap().map(x => tilesTop.get(x) - tetrominoBottom.get(x))
  return tetromino.move({ dy: dys.min() - 1 })
}

export function spawnCrazy(tiles) {
  let spawnType
  let removeCountMap = Map()

  Map(TETROMINO_TYPES).sortBy(type => TETROMINOS[type].hard)
    .reverse()
    .forEach(type => {
      const removeCount = Range(0, TETROMINOS[type].direction).map(n =>
        Range(0, BOARD_WIDTH).map(x => TetrominoInfo({
          type,
          refPoint: Point({ x, y: 1 }),
          angle: 90 * n,
        })))
        .flatten(true)
        .filter(tetromino => isValidTetromino(tetromino, Set()))
        .map(tetromino => dropToBottom(tetromino, tiles))
        .map(tetromino => {
          const afterUnion = tiles.union(getPoints(tetromino).map(point => TileInfo({
            point,
            color: TETROMINOS[tetromino.type].color,
          })))
          return getRemoveRowIndices(afterUnion).count()
        })
        .max()

      if (removeCount === 0) {
        spawnType = type
        return false // stop iteration
      }
      removeCountMap = removeCountMap.set(type, removeCount)
      return true
    })

  if (!spawnType) {
    const minCount = removeCountMap.min()
    const candidates = removeCountMap.filter(count => count === minCount).keySeq().toList()
    spawnType = candidates.get(Math.floor(Math.random() * candidates.size))
  }

  return TetrominoInfo({
    type: spawnType,
    refPoint: Point({ x: 5, y: 1 }),
    angle: 0,
  })
}
