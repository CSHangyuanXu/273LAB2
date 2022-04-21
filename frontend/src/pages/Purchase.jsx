import React, { useEffect, useState } from "react";
import baseUrl from "../constants/baseUrl";
import { toast } from "react-toastify";
import axios from "axios";
import PurchaseCard from "../components/PurchaseCard";

function Purchase() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios({
      method: "get",
      url: baseUrl + "/purchase/get",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.data.isSuccess) {
          setPurchases(response.data.purchases);
          setLoading(false);
          console.log(response.data.purchases);
        } else {
          if (response.data.isNotLoggedIn) {
            window.location.href = "/login";
          } else {
            toast.error(response.data.message);
            setLoading(false);
          }
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Your Purchases</h1>
      {loading ? (
        <div>Loading...</div>
      ) : purchases.length > 0 ? (
        <div>
          {purchases.map((purchase) => {
            return <PurchaseCard item={purchase} />;
          })}
        </div>
      ) : (
        <div>No purchases yet</div>
      )}
    </div>
  );
}

export default Purchase;
