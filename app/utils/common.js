import { Set, Range } from 'immutable'
import { TETROMINO_TYPES, BOARD_HEIGHT, BOARD_WIDTH } from '../constants'
import { Point, TetrominoInfo } from '../types'

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
  const afterMove = tetromino.updateIn(['refPoint', 'y'], y => y + 1)
  return isValidTetromino(afterMove, tiles)
}

/** 移除可以消除的方块, 并返回新的tiles集合 */
export function removeTiles(tiles) {
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
  const rowIndices = shouldRemove.filter(x => x).keySeq() // 要移除的tiles的y坐标值
  const downLength = Range(0, BOARD_HEIGHT).map(n => rowIndices.filter(x => x > n).count())
  // rowIndices example: [0, 2, 3]  表示有三行可以移除
  return tiles.filterNot(tile => rowIndices.includes(tile.point.y)) // 移除满足条件的若干行
    .map(tile => tile.updateIn(['point', 'y'], y => y + downLength.get(y))) // 更新剩下的tiles的y坐标值
}

/** 获得一个随机整数, 返回结果为[start, end) */
function randInt(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
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
    refPoint: Point({ x: randInt(1, 8), y: 3 }),
    angle: 90,
  })
}
