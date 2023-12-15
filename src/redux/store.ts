// store.js
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga'; // Import saga middleware
import rootSaga from './todosSaga'; // Import root saga
import todosReducer from './todosSlice';

const sagaMiddleware = createSagaMiddleware(); // Create saga middleware

const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  middleware: () => [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export default store;
