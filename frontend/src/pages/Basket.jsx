import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import BasketItem from "../components/BaketItem";
import "../css/pages/Basket.css";
import { toast } from "react-toastify";
import baseUrl from "../constants/baseUrl";
import axios from "axios";

function Basket() {
  const [basket, setBasket] = useState([]);

  const calculateTotal = () => {
    let total = 0;
    basket.forEach((item) => {
      total += item.price * item.qant;
    });
    return total;
  };

  const getBasket = () => {
    if (localStorage.getItem("basket")) {
      setBasket(JSON.parse(localStorage.getItem("basket")));
    }
  };
  useEffect(() => {
    getBasket();
  }, []);

  const purcahse = () => {
    axios({
      method: "post",
      url: baseUrl + "/purchase/bulk",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        productsToPurchaseList: JSON.stringify(basket),
      },
    }).then((response) => {
      if (response.data.isSuccess) {
        toast.success("Purchase Successful");
        localStorage.removeItem("basket");
        setBasket([]);
      } else {
        if (response.data.isNotLoggedIn) {
          toast.error("Please Login First");
        } else {
          toast.error("Purchase Failed");
        }
      }
    });
  };

  return (
    <div id="basketPage">
      <div className="left">
        {basket.map((item, index) => {
          return <BasketItem item={item} key={item.name} refresh={getBasket} />;
        })}
      </div>
      <div className="right">
        <div className="total-continer">
          <h2>Total ({basket.length} Items )</h2>
          <h2>$ {calculateTotal()}</h2>
        </div>
        <Button variant="contained" color="primary" onClick={purcahse}>
          Proceed to Chakout
        </Button>
      </div>
    </div>
  );
}

export default Basket;
