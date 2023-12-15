import { takeEvery, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { deleteTodoSuccess, fetchTodosSuccess, addTodoSuccess } from './todosSlice';

// Worker saga to delete a todo
function* deleteTodoSaga(action) {
  try {
    // Make an API request to delete the todo
    yield call(axios.delete, `http://localhost:8080/todos/${action.payload}`);

    // Dispatch the success action
    yield put(deleteTodoSuccess(action.payload));
  } catch (error) {
    // Handle error, e.g., dispatch an error action
    console.error('Error deleting todo:', error);
  }
}

// Worker saga to fetch todos
function* fetchTodosSaga() {
  try {
    // Make an API request to fetch todos
    const result = yield call(axios.get, 'http://localhost:8080/todos');

    // Dispatch the success action
    yield put(fetchTodosSuccess(result.data));
  } catch (error) {
    // Handle error, e.g., dispatch an error action
    console.error('Error fetching todos:', error);
  }
}

// Worker saga to add a todo
function* addTodoSaga(action) {
  try {
    // Make an API request to add a todo
    const result = yield call(axios.post, 'http://localhost:8080/todos', action.payload);

    // Dispatch the success action
    yield put(addTodoSuccess(result.data));
  } catch (error) {
    // Handle error, e.g., dispatch an error action
    console.error('Error adding todo:', error);
  }
}

// Watcher saga to watch for deleteTodo, fetchTodos, and addTodo actions
function* rootSaga() {
  yield takeEvery('todos/deleteTodo', deleteTodoSaga);
  yield takeEvery('todos/fetchTodos', fetchTodosSaga);
  yield takeEvery('todos/addTodo', addTodoSaga);
}

export default rootSaga;
