export const GRID_SIZE = 30
export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 20

export const TETROMINO_TYPES = {
  I: 'I',
  J: 'J',
  L: 'L',
  O: 'O',
  S: 'S',
  T: 'T',
  Z: 'Z',
}

export const ADD_SCORE = {
  0: 0,
  [BOARD_WIDTH]: 2,
  [2 * BOARD_WIDTH]: 5,
  [3 * BOARD_WIDTH]: 15,
  [4 * BOARD_WIDTH]: 60,
}

export const TETROMINOS = {
  [TETROMINO_TYPES.I]: { color: 'cyan', direction: 2 },
  [TETROMINO_TYPES.J]: { color: 'blue', direction: 4 },
  [TETROMINO_TYPES.L]: { color: 'orange', direction: 4 },
  [TETROMINO_TYPES.O]: { color: 'yellow', direction: 1 },
  [TETROMINO_TYPES.S]: { color: 'lime', direction: 2 },
  [TETROMINO_TYPES.T]: { color: 'purple', direction: 4 },
  [TETROMINO_TYPES.Z]: { color: 'red', direction: 2 },
}
