import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import sheetReducer from '../features/sheets/sheetsSlice';
import gameReducer from '../features/game/gameSlice';

export const store = configureStore({
  reducer: {
    sheets: sheetReducer,
    game: gameReducer,
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
