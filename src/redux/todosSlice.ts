import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    fetchTodosSuccess: (state, action) => {
      return [...action.payload];
    },
    fetchTodosFailure: (state, action) => {
      console.error('Failed to fetch todos:', action.payload);
    },
    addTodoSuccess: (state, action) => {
      state.push(action.payload);
    },
    addTodoFailure: (state, action) => {
      console.error('Failed to add todo:', action.payload);
    },
    editTodoSuccess: (state, action) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    editTodoFailure: (state, action) => {
      console.error('Failed to edit todo:', action.payload);
    },
    deleteTodoSuccess: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload);
    },
    deleteTodoFailure: (state, action) => {
      console.error('Failed to delete todo:', action.payload);
    },
  },
});

export const {
  fetchTodosSuccess,
  fetchTodosFailure,
  addTodoSuccess,
  addTodoFailure,
  editTodoSuccess,
  editTodoFailure,
  deleteTodoSuccess,
  deleteTodoFailure,
} = todosSlice.actions;

export default todosSlice.reducer;
