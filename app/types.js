import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Record } from 'immutable'
import { COLORS, TETROMINO_TYPES } from './constants'

const { recordOf } = ImmutablePropTypes
const { number, string } = React.PropTypes

export const Point = Record({
  x: 0,
  y: 0,
})
Point.propTypes = recordOf({
  x: number.isRequired,
  y: number.isRequired,
})
Object.assign(Point.prototype, {
  // todo 需要考虑I/O这两个形状的angle是限制的情况
  relative({ dx = 0, dy = 0, angle = 0 }) {
    const rotate = (angle / 90) % 4
    switch (rotate) {
      case 0:
        return this.update('x', x => x + dx).update('y', y => y + dy)
      case 1:
        return this.update('x', x => x - dy).update('y', y => y + dx)
      case 2:
        return this.update('x', x => x - dx).update('y', y => y - dy)
      case 3:
        return this.update('x', x => x + dy).update('y', y => y - dx)
      default:
        throw new Error(`Invalid angle: ${angle}`)
    }
  },
})


export const TileInfo = Record({
  color: COLORS.CYAN,
  point: Point(),
})
TileInfo.propTypes = recordOf({
  color: string.isRequired,
  point: Point.propTypes.isRequired,
})
TileInfo.of = function (x, y, color) {
  return TileInfo({ point: Point({ x, y }), color })
}


export const TetrominoInfo = Record({
  type: TETROMINO_TYPES.I,
  refPoint: Point(),
  angle: 0,
})
TetrominoInfo.propTypes = recordOf({
  type: string.isRequired,
  refPoint: Point.propTypes.isRequired,
  angle: number.isRequired,
})
