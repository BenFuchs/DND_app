import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SheetsComp from './features/sheets/SheetsComp';
import GameComponent from './features/game/GameComponent';
import Layout from './Layout'; // Import the Layout component
import InventoryWrapper from './InventoryWrapper';
import TraitsWrapper from './TraitsWrapper';
import ChatRoom from './chatRoomComp';



const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route element={<Layout />}> {/* Wrap routes in the Layout */}
            <Route path="/" element={<App />} />
            <Route path="/sheets" element={<SheetsComp />} />
            <Route path="game/:sheetID" element={<GameComponent />} />
            <Route path="game/:sheetID/inventory" element={<InventoryWrapper />} /> 
            <Route path="game/:sheetID/traits" element={<TraitsWrapper />} />   
                 {/* roomName is currently hardcoded for testing purposes, need to create an input to let the users set the roomname amongus style */}
            <Route path='/testchat' element={<ChatRoom roomName={"test"} />} /> 
            </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
