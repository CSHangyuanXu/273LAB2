import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import baseUrl from "../constants/baseUrl";
import SingleItem from "../components/SingleItem";

function Search() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const serachQuery = window.location.search.split("=")[1];

    axios({
      method: "get",
      url: baseUrl + "/product/search?search=" + serachQuery,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setItems(response.data.product);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{
          marginBottom: "20px",
        }}
      >
        Search Results
      </h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : items.length > 0 ? (
        items.map((item) => <SingleItem key={item._id} item={item} />)
      ) : (
        <div>No items found</div>
      )}
    </div>
  );
}

export default Search;
