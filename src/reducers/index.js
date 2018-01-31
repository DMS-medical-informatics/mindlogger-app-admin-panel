import { reducer as form } from 'redux-form';
import { combineReducers } from 'redux';
import entities from './entities';

const reducers = {
  form,
  entities
}

export default combineReducers(reducers)

