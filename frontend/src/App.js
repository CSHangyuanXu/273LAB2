import React, { useEffect, useState } from "react";

import "./App.css";
import TopBar from "./components/TopBar";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Favourites from "./pages/Favourites";
import Home from "./pages/Home";
import EditProfile from "./pages/EditProfile";
import Shop from "./pages/Shop";
import ItemDetails from "./pages/ItemDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import baseUrl from "./constants/baseUrl";
import axios from "axios";
import ShopCreate from "./pages/ShopCreate";
import Basket from "./pages/Basket";
import Search from "./pages/Search";
import Purchase from "./pages/Purchase";

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios({
      method: "get",
      url: baseUrl + "/auth/user",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
      },
    }).then((response) => {
      if (response.data.isLogin) {
        setUser(response.data.user);
        console.log(response.data.user);
      }
    });
  }, []);

  return (
    <div className="app">
      <ToastContainer position="top-right" />
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </header> */}

      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<SignUp />} />
        <Route path="*" element={<TopBar user={user} />} />
      </Routes>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/favourites" exact element={<Favourites />} />
        <Route path="/edit-profile" exact element={<EditProfile />} />
        <Route path="/shop/:id" exact element={<Shop />} />
        <Route path="/item-details/:id" exact element={<ItemDetails />} />
        <Route path="/seller-onboard" exact element={<ShopCreate />} />
        <Route path="/basket" exact element={<Basket />} />
        <Route path="/search" exact element={<Search />} />
        <Route path="/purchases" exact element={<Purchase />} />
      </Routes>
    </div>
  );
}

export default App;
