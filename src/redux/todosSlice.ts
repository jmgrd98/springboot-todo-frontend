import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    fetchTodosSuccess: (state, action) => {
      return [...action.payload];
    },
    fetchTodosFailure: (state, action) => {
      // Handle failure state
    },
    addTodoSuccess: (state, action) => {
      state.push(action.payload);
    },
    addTodoFailure: (state, action) => {
      // Handle failure state
    },
    deleteTodoSuccess: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload);
    },
    deleteTodoFailure: (state, action) => {
      // Handle failure state
    },
  },
});

export const {
  fetchTodosSuccess,
  fetchTodosFailure,
  addTodoSuccess,
  addTodoFailure,
  deleteTodoSuccess,
  deleteTodoFailure,
} = todosSlice.actions;

export default todosSlice.reducer;
