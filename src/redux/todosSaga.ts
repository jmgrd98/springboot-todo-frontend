import { put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import { 
  fetchTodosSuccess, 
  fetchTodosFailure, 
  addTodoSuccess, 
  addTodoFailure, 
  editTodoSuccess,
  editTodoFailure,
  deleteTodoSuccess, 
  deleteTodoFailure,
  setEditStatus
} from './todosSlice';

function* fetchTodosSaga() {
  try {
    const response = yield axios.get('http://localhost:8080/todos');
    yield put(fetchTodosSuccess(response.data));
  } catch (error) {
    yield put(fetchTodosFailure(error));
  }
}

function* addTodoSaga(action: any) {
  try {
    const response = yield axios.post('http://localhost:8080/todos', action.payload);
    yield put(addTodoSuccess(response.data));
  } catch (error) {
    yield put(addTodoFailure(error));
  }
}

function* editTodoSaga(action: any) {
  try {
    const response = yield axios.put(`http://localhost:8080/todos/${action.payload.id}`, action.payload);
    yield put(editTodoSuccess(response.data));
  } catch (error) {
    yield put(editTodoFailure(error));
  }
}

function* deleteTodoSaga(action: any) {
  try {
    yield axios.delete(`http://localhost:8080/todos/${action.payload}`);
    yield put(deleteTodoSuccess(action.payload));
  } catch (error) {
    yield put(deleteTodoFailure(error));
  }
}

function* setEditStatusSaga(action) {
  try {
    yield put(setEditStatus(action.payload));
  } catch (error) {
    console.error(error);
  }
}

function* watchTodosSaga() {
  yield takeLatest('todos/fetchTodos', fetchTodosSaga);
  yield takeLatest('todos/addTodo', addTodoSaga);
  yield takeLatest('todos/editTodo', editTodoSaga);
  yield takeLatest('todos/deleteTodo', deleteTodoSaga);
}

function* watchEditStatusSaga() {
  yield takeLatest('todos/setEditStatus', setEditStatusSaga);
}

export default function* rootSaga() {
  yield all([watchTodosSaga(), watchEditStatusSaga()]);
}