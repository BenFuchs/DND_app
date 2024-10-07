import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterTEMP/counterSlice';
import sheetReducer from '../features/counter/sheets/sheetsSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    sheets: sheetReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
