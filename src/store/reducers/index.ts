import {combineReducers, Reducer} from 'redux';
import {IFoState, NewsActionTypes} from '../actions/actionTypes';
import foReducer from './foReducer';
 export type IRootState = {
  fo: IFoState;
};
const rootReducer: Reducer<IRootState | undefined, NewsActionTypes> =
  combineReducers({
    fo: foReducer,
  });

export default rootReducer;
