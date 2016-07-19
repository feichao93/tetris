import { START, STOP, tick } from './actions'

let handler // todo 需要继续改进 这样的设计只能使用一个handler
export default ({ dispatch }) => next => action => {
  if (typeof action === 'object') {
    if (action.type === START) {
      clearInterval(handler)
      handler = setInterval(() => dispatch(tick), action.interval || 1000)
    } else if (action.type === STOP) {
      clearInterval(handler)
    }
  }

  return next(action)
}
