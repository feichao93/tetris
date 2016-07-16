export const START_TIMER = 'START_TIMER'
export const STOP_TIMER = 'STOP_TIMER'
// export const PAUSE_TIMER = 'PAUSE_TIMER'
// export const RESUME_TIMER = 'RESUME_TIMER'
export const TICK = 'TICK'

export const startTimer = interval => ({ type: START_TIMER, interval })
export const stopTimer = () => ({ type: STOP_TIMER })

let handler // todo 需要继续改进 这样的设计只能使用一个handler
export default ({ dispatch }) => next => action => {
  if (typeof action === 'object') {
    if (action.type === START_TIMER) {
      clearInterval(handler)
      handler = setInterval(() => dispatch({ type: TICK }), action.interval || 1000)
    } else if (action.type === STOP_TIMER) {
      clearInterval(handler)
    }
  }

  return next(action)
}
