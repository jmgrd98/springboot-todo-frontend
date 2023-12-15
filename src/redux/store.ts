// store.js
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga'; // Import saga middleware
import rootSaga from './sagas'; // Import root saga
import todosReducer from './todosSlice';

const sagaMiddleware = createSagaMiddleware(); // Create saga middleware

const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  middleware: () => [sagaMiddleware], // Add saga middleware
});

sagaMiddleware.run(rootSaga); // Run the root saga

export default store;
