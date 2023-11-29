import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import webfont from "webfontloader";
import Header from "./component/layout/Header/Header.js"
import Footer from "./component/layout/Footer/Footer.js"
import Home from "./component/Home/Home.js"
import WhatsAppChat from "./component/WhatsAppChat/WhatsAppChat.js"
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js";
import Account from "./component/User/Profile.js";
import LoginSignUp from "./component/User/LoginSignUp.js";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.js"
import { useSelector } from "react-redux";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from "axios";
import Payment from "./component/Cart/Payment.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    webfont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    })

    store.dispatch(loadUser());

    getStripeApiKey();
  }, [])

  return (
    <Router>
      <Header />

      {isAuthenticated && <UserOptions user={user} />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/products" element={<Products />} />

        <Route path="/products/:keyword" element={<Products />} />

        <Route path="/search" element={<Search />} />

        <Route path="/account" element={isAuthenticated ? <Account /> : <Navigate to="/login" replace={true} />} />

        <Route path="/me/update" element={isAuthenticated ? <UpdateProfile /> : <Navigate to="/login" replace={true} />} />

        <Route path="/password/update" element={isAuthenticated ? <UpdatePassword /> : <Navigate to="/login" replace={true} />} />

        <Route path="/password/forgot" element={<ForgotPassword />} />

        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/login" element={<LoginSignUp />} />

        <Route path="/shipping" element={isAuthenticated ? <Shipping /> : <Navigate to="/login" replace={true} />} />

        <Route path="/order/confirm" element={isAuthenticated ? <ConfirmOrder /> : <Navigate to="/login" replace={true} />} />

        <Route path="/process/payment" element={isAuthenticated ? (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <Payment />
          </Elements>
        ) : (
          <Navigate to="/login" replace={true} />
        )} />

      </Routes>
      <Footer />
      <WhatsAppChat />
    </Router>
  );
}

export default App;