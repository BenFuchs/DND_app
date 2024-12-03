import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SheetsComp from "./features/sheets/SheetsComp";
import GameComponent from "./features/game/GameComponent";
import Layout from "./Layout"; // Import the Layout component
import InventoryWrapper from "./InventoryWrapper";
import TraitsWrapper from "./TraitsWrapper";
import ChatWrapper from "./chatWrapper";
import ChatRoomView from "./features/ChatRoom/ChatRoomView";
import Paypal from "./features/Paypal/Paypal";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/sheets" element={<SheetsComp />} />
            <Route path="game/:sheetID" element={<GameComponent />} />
            <Route
              path="game/:sheetID/inventory"
              element={<InventoryWrapper />}
            />
            <Route path="game/:sheetID/traits" element={<TraitsWrapper />} />
            <Route path="game/:sheetID/chat" element={<ChatWrapper />} />
            <Route path="game/:sheetID/chat/:roomName" element={<ChatRoomView />} />
            <Route path="/orders" element={   <Paypal />} />
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
