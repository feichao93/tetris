import { createStore, applyMiddleware } from 'redux'
import timerMiddleware from './utils/timerMiddleware'
import reducer from './reducer'

export default createStore(reducer, applyMiddleware(timerMiddleware))
