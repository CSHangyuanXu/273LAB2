import React from "react";
import "../css/components/BaketItem.css";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import baseUrl from "../constants/baseUrl";

function BaketItem({ item, refresh }) {
  const [qant, setQant] = React.useState(item.qant);

  const removeItem = () => {
    let basket = JSON.parse(localStorage.getItem("basket"));
    basket.splice(basket.indexOf(item), 1);
    localStorage.setItem("basket", JSON.stringify(basket));
    refresh();
  };
  const updateQant = (e) => {
    setQant(e.target.value);

    // save to local storage
    let basket = JSON.parse(localStorage.getItem("basket"));
    basket[basket.indexOf(item)].qant = e.target.value;
    localStorage.setItem("basket", JSON.stringify(basket));
    refresh();
  };
  return (
    <div id="baketItem">
      <div className="left">
        <img src={`${baseUrl}/ProductImages/${item.img}`} alt="" />
        <div>
          <p>{item.name}</p>
          <Button variant="outlined" color="error" onClick={removeItem}>
            Remove
          </Button>
        </div>
      </div>

      <div className="right">
        <p>Quantity</p>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={qant}
          label="Quantity"
          onChange={updateQant}
        >
          {item.stockArray.map((item, index) => {
            return <MenuItem value={index + 1}>{index + 1}</MenuItem>;
          })}
        </Select>
        <h2>${item.price * qant}</h2>
      </div>
    </div>
  );
}

export default BaketItem;
