export const RESTART_GAME = 'RESTART_GAME'
export const restartGame = () => ({ type: RESTART_GAME })

export const MOVE = 'MOVE'
export const moveLeft = () => ({ type: MOVE, dx: -1, dy: 0, rotate: 0 })
export const moveRight = () => ({ type: MOVE, dx: 1, dy: 0, rotate: 0 })
export const rotate = () => ({ type: MOVE, dx: 0, dy: 0, rotate: 90 })
