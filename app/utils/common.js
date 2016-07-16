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
  let shouldRemove = Range(0, BOARD_HEIGHT).map(() => true).toList()
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
  const rowIndices = shouldRemove.filter(x => x).keySeq().reverse()
  // rowIndices example: [0, 2, 3]  表示有三行可以移除
  // console.log(String(rowIndices))
  // todo 移除若干行
  return tiles
}

/** 获得一个随机整数, 返回结果为[start, end) */
function randInt(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

/** 生成新的tetromino */
export function spawn() {
  return TetrominoInfo({
    type: TETROMINO_TYPES.O,
    refPoint: Point({ x: randInt(1, 8), y: 3 }),
    angle: 90,
  })
}
