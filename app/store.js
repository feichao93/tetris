import { createStore, applyMiddleware } from 'redux'
import timerMiddleware from './timerMiddleware'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducer'

export default createStore(reducer, applyMiddleware(timerMiddleware, thunkMiddleware))
