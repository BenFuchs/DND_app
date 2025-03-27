import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import sheetReducer from '../features/sheets/sheetsSlice';
import gameReducer from '../features/game/gameSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import traitsReducer from '../features/traits/traitsSlice'
import classFeaturesReducer from '../features/classFeats/classFeatsSlice'
import chatRoomReducer from '../features/ChatRoom/chatRoomSlice';
import authReducer from '../features/Login/loginSlice'
import friendsListReducer from '../features/friends_list/friendsListSlice'
import registerReducer from '../features/Register/registerSlice'
export const store = configureStore({
  reducer: {
    sheets: sheetReducer,
    game: gameReducer,
    inventory: inventoryReducer,
    raceTraits: traitsReducer,
    classTraits: classFeaturesReducer,
    chatRoom: chatRoomReducer,
    login: authReducer,
    friendsList: friendsListReducer,
    register: registerReducer,
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
