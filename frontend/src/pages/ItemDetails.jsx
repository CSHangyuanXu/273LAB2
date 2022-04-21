import React, { useState, useEffect } from "react";
import "../css/pages/ItemDetils.css";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Select from "@mui/material/Select";
import baseUrl from "../constants/baseUrl";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function ItemDetails({}) {
  const [qant, setQant] = useState("");
  const [product, setProduct] = useState(null);
  const [productShop, setProductShop] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [stockArray, setStockArray] = useState([]);
  const { id } = useParams();

  const handleQantChange = (event) => {
    setQant(event.target.value);
  };

  useEffect(() => {
    axios({
      method: "get",
      url: baseUrl + "/product/?id=" + id,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.data.isSuccess) {
          setProduct(response.data.product);
          setIsLiked(response.data.product.isFavourite);
          setProductShop(response.data.shop);
          for (let i = 0; i < response.data.product.stock; i++) {
            setStockArray((old) => [...old, i + 1]);
          }
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  const addToBasket = () => {
    if (qant === "") {
      toast.error("Please select quantity");
    } else {
      let itemToBeAdded = { ...product, qant: qant, stockArray: stockArray };
      if (localStorage.getItem("basket")) {
        let basket = JSON.parse(localStorage.getItem("basket"));
        basket.push(itemToBeAdded);
        localStorage.setItem("basket", JSON.stringify(basket));
      } else {
        localStorage.setItem("basket", JSON.stringify([itemToBeAdded]));
      }
      window.location.href = "/basket";
    }
  };

  const addToFavourites = (e) => {
    /// prevent default
    e.preventDefault();
    axios({
      method: "post",
      url: baseUrl + "/favourites/add",
      withCredentials: true,
      data: {
        productId: product._id,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.data.isSuccess) {
          setIsLiked(true);
        }
        if (!response.data.isSuccess && response.data.isNotLoggedIn) {
          toast.error("You must be logged in to add to favourites");
        } else {
          toast.info(response.data.message);
          //console.log(response.data);
          if (!response.data.isNotLoggedIn) {
            setIsLiked(true);
          }
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const removeFromFavourites = (e) => {
    e.preventDefault();
    axios({
      method: "post",
      url: baseUrl + "/favourites/remove",
      withCredentials: true,
      data: {
        productId: product._id,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        toast.info(response.data.message);
        if (response.data.isSuccess) {
          // remove from favourites
          setIsLiked(false);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <div id="itemDetils">
      <div className="left">
        {isLiked ? (
          <button
            className="heart"
            onClick={removeFromFavourites}
            style={{ color: "red" }}
          >
            <FavoriteIcon color="inherit" />
          </button>
        ) : (
          <button className="heart" onClick={addToFavourites}>
            <FavoriteBorderOutlinedIcon color="inherit" />
          </button>
        )}
        <img src={`${baseUrl}/productImages/${product?.img}`} alt="" />
      </div>
      <div className="right">
        <h3>{product?.name}</h3>
        <h1>USD {product?.price}</h1>
        <p>{product?.sales} Sales</p>
        <p>Quantity</p>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={qant}
          label="Quantity"
          onChange={handleQantChange}
        >
          {stockArray.map((item, index) => {
            return <MenuItem value={index + 1}>{index + 1}</MenuItem>;
          })}
        </Select>

        <Button variant="contained" size="large" onClick={addToBasket}>
          Add to Basket
        </Button>
        <h3>Descrption</h3>
        <p>{product?.desc}</p>
        <h3>Shop</h3>
        <Link to={`/shop/${productShop?._id}`}>
          <p>{productShop?.name}</p>
        </Link>
      </div>
    </div>
  );
}

export default ItemDetails;
