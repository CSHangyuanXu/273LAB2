import React, { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

import Button from "@mui/material/Button";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import "../css/components/SingleItem.css";
import baseUrl from "../constants/baseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function SingleItem({
  item,
  favourites,
  setFavourites,
  showEditButton,
  openEditForm,
  setSelectedItem,
}) {
  const [isLiked, setIsLiked] = useState(item.isFavourite);
  const addToFavourites = (e) => {
    /// prevent default
    e.preventDefault();
    axios({
      method: "post",
      url: baseUrl + "/favourites/add",
      withCredentials: true,
      data: {
        productId: item._id,
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
        productId: item._id,
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
          if (favourites) {
            let temp = [...favourites];
            temp = temp.filter((fav) => fav._id !== item._id);
            setFavourites(temp);
          }
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <Link className="singleItem" to={`/item-details/${item._id}`}>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={`${baseUrl}/productImages/${item?.img}`}
            alt={item?.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {item?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${item?.price}
            </Typography>
          </CardContent>
        </CardActionArea>
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
        {showEditButton && (
          <Button
            variant="contained"
            size="large"
            id="edit-btn"
            onClick={(e) => {
              e.preventDefault();
              openEditForm(true);
              setSelectedItem(item);
            }}
          >
            Edit
          </Button>
        )}
      </Card>
    </Link>
  );
}

export default SingleItem;
