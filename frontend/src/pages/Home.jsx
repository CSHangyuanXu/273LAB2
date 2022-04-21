import React, { useState, useEffect } from "react";
import SingleItem from "../components/SingleItem";
import { toast } from "react-toastify";
import axios from "axios";
import baseUrl from "../constants/baseUrl";

function Home() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    axios({
      method: "get",
      url: baseUrl + "/product/all",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.data.isSuccess) {
          setItems(response.data.products);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);
  return (
    <div className="items-flex" style={{ padding: "20px" }}>
      {items.map((item) => {
        return <SingleItem item={item} key={item._id} liked={false} />;
      })}
    </div>
  );
}

export default Home;
