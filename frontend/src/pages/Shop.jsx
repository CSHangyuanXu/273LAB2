import React, { useState, useEffect } from "react";
import "../css/pages/Shop.css";
import Button from "@mui/material/Button";
import SingleItem from "../components/SingleItem";
import ItemFormPopup from "../components/ItemFormPoup";
import baseUrl from "../constants/baseUrl";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EditItemFormPopup from "../components/EditItemFormPopup";

function Shop() {
  const { id } = useParams();
  const [shop, setShop] = useState({});
  const [items, setItems] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    axios({
      method: "get",
      url: baseUrl + "/shop/details?shopId=" + id,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response.data);
      if (response.data.isSuccess) {
        setShop(response.data.shop);
        setItems(response.data.products);
        setIsOwner(response.data.isOwner);
      } else {
        toast.error(response.data.message);
      }
    });
  }, []);
  const [isShwoingAddItemPopup, setIsShwoingAddItemPopup] = useState(false);
  const [isShwoingEditItemPopup, setIsShwoingEditItemPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  return (
    <div id="shop">
      <ItemFormPopup
        isOpen={isShwoingAddItemPopup}
        setOpen={setIsShwoingAddItemPopup}
      />
      <EditItemFormPopup
        isOpen={isShwoingEditItemPopup}
        setOpen={setIsShwoingEditItemPopup}
        item={selectedItem}
      />
      <div className="shop-info">
        <img src={`${baseUrl}/shopImages/${shop.avatar}`} alt="" srcset="" />
        <div>
          <h1>{shop.name}</h1>
          <p> {shop.sales} sales </p>
          {isOwner && (
            <Button
              variant="contained"
              size="large"
              onClick={() => setIsShwoingAddItemPopup(true)}
            >
              Add New Item
            </Button>
          )}
        </div>
      </div>

      <h1>All Items</h1>
      <div className="items-flex">
        {items.map((item) => (
          <SingleItem
            key={item._id}
            item={item}
            showEditButton={isOwner}
            openEditForm={setIsShwoingEditItemPopup}
            setSelectedItem={setSelectedItem}
          />
        ))}
      </div>
    </div>
  );
}

export default Shop;
