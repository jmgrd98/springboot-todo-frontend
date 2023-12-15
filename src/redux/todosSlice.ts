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
    editTodoSuccess: (state, action) => {
      // Find the index of the edited todo
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        // Update the todo at the found index
        state[index] = action.payload;
      }
    },
    editTodoFailure: (state, action) => {
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
  editTodoSuccess,
  editTodoFailure,
  deleteTodoSuccess,
  deleteTodoFailure,
} = todosSlice.actions;

export default todosSlice.reducer;
