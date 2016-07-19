import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { Range } from 'immutable'
import { GRID_SIZE, BOARD_WIDTH, BOARD_HEIGHT, TETROMINOS } from '../constants'
import { TileInfo, TetrominoInfo } from '../types'
import { getPoints } from '../common'

const getProps = state => state.toObject()

@connect(getProps)
export default class Board extends React.Component {
  static propTypes = {
    tiles: ImmutablePropTypes.iterableOf(TileInfo.propTypes.isRequired).isRequired,
    tetromino: TetrominoInfo.propTypes,
  }

  render() {
    const { tiles, tetromino } = this.props
    return (
      <div className="board">
        <div className="grids">
          {Range(0, BOARD_WIDTH * BOARD_HEIGHT).map(index =>
            <Grid key={index} x={index % BOARD_WIDTH} y={Math.floor(index / BOARD_WIDTH)} />
          ).toArray()}
        </div>
        <div className="tiles">
          {tiles.toList().map((tile, index) =>
            <Tile key={index} tile={tile} />
          ).toArray()}
        </div>
        {tetromino ?
          <Tetromino tetromino={tetromino} />
          : null}
      </div>
    )
  }
}

const Tetromino = ({ tetromino }) => (
  <div>
    {getPoints(tetromino).map((point, index) =>
      <Tile key={index} tile={TileInfo({ point, color: TETROMINOS[tetromino.type].color })} />
    ).toArray()}
  </div>
)

Tetromino.propTypes = {
  tetromino: TetrominoInfo.propTypes.isRequired,
}

const Tile = ({ tile }) => (
  <div
    className="tile"
    style={{
      transform: `translate(${GRID_SIZE * tile.point.x}px, ${GRID_SIZE * tile.point.y}px)`,
      background: tile.color,
      width: GRID_SIZE,
      height: GRID_SIZE,
    }}
  />
)
Tile.propTypes = {
  tile: TileInfo.propTypes.isRequired,
}

const Grid = ({ x, y }) => (
  <div
    className="grid"
    style={{
      transform: `translate(${GRID_SIZE * x}px, ${GRID_SIZE * y}px)`,
      width: GRID_SIZE,
      height: GRID_SIZE,
    }}
  />
)
Grid.propTypes = {
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
}
