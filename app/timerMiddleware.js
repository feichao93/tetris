import { START, PAUSE, RESUME, GAME_OVER, RESET_TICK_TIMEOUT, tick } from './actions'

let handler // todo 需要继续改进 这样的设计只能使用一个handler
export default ({ dispatch, getState }) => next => action => {
  if (typeof action === 'object') {
    if (action.type === START || action.type === RESUME || action.type === RESET_TICK_TIMEOUT) {
      clearInterval(handler)
      handler = setInterval(() => dispatch(tick), 1000 / getState().get('speed'))
    } else if (action.type === PAUSE || action.type === GAME_OVER) {
      clearInterval(handler)
    }
  }

  return next(action)
}
