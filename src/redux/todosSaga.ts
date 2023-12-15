import { put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import { fetchTodosSuccess, fetchTodosFailure, addTodoSuccess, addTodoFailure, deleteTodoSuccess, deleteTodoFailure } from './todosSlice';

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

function* deleteTodoSaga(action: any) {
  console.log("ENTROU NA SAGA")
  try {
    yield axios.delete(`http://localhost:8080/todos/${action.payload}`);
    yield put(deleteTodoSuccess(action.payload));
  } catch (error) {
    yield put(deleteTodoFailure(error));
  }
}

function* watchTodosSaga() {
  yield takeLatest('todos/fetchTodos', fetchTodosSaga);
  yield takeLatest('todos/addTodo', addTodoSaga);
  yield takeLatest('todos/deleteTodo', deleteTodoSaga);
}

export default function* rootSaga() {
  yield all([watchTodosSaga()]);
}
