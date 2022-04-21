import React from "react";
import "../css/components/BaketItem.css";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import baseUrl from "../constants/baseUrl";

function PurchaseCard({ item }) {
  function formatDate(date) {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  }
  return (
    <div id="baketItem">
      <div className="left">
        <img src={`${baseUrl}/ProductImages/${item.product.img}`} alt="" />
        <div>
          <p>{item.product.name}</p>
          <p>{formatDate(new Date(item.date))}</p>
        </div>
      </div>

      <div className="right">
        <p>Quantity</p>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Quantity"
          value={item.quantity}
          readOnly={true}
        >
          <MenuItem value={item.quantity}>{item.quantity}</MenuItem>
        </Select>
        <h2>$ {item.quantity * item.product.price}</h2>
      </div>
    </div>
  );
}

export default PurchaseCard;
