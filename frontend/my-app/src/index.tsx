import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SheetsComp from "./features/sheets/SheetsComp";
import Layout from "./Layout"; // Import the Layout component
import InventoryWrapper from "./InventoryWrapper";
import TraitsWrapper from "./TraitsWrapper";
import ChatWrapper from "./chatWrapper";
import ChatRoomView from "./features/ChatRoom/ChatRoomView";
import Paypal from "./features/Paypal/Paypal";
import GameComponent from "./features/game/GameComponent";
import About from "./features/about/About";
import FriendsList from "./features/friends_list/FriendsList";
import { ThemeProviderWrapper } from "./features/DarkModeSwitch/ThemeProviderWrapper";
import Register from "./features/Register/Register";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProviderWrapper>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          
          <Route element={<Layout />}>
            {/* Exclude / and /login from rendering FriendsList */}
            <Route path="/" element={<About />} />
            <Route path="/login" element={<App />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sheets" element={<SheetsComp />} />
            <Route path="game/:sheetID" element={<GameComponent />} />
            <Route path="game/:sheetID/inventory" element={<InventoryWrapper />} />
            <Route path="game/:sheetID/traits" element={<TraitsWrapper />} />
            <Route path="game/:sheetID/chat" element={<ChatWrapper />} />
            <Route path="game/:sheetID/chat/:roomName" element={<ChatRoomView />} />
            <Route path="/orders" element={<Paypal />} />
            <Route path="/friendsList" element={<FriendsList isSidenavOpen={false} openNav={() => {}} closeNav={() => {}} isDarkMode/>} /> </Route>
            
        </Routes>
      </Provider>
    </BrowserRouter>
    </ThemeProviderWrapper>
  </React.StrictMode>
);
