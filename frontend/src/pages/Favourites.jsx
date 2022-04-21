import React, { useEffect, useState } from "react";
import "../css/pages/Favourites.css";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import axios from "axios";
import baseUrl from "../constants/baseUrl";
import { toast } from "react-toastify";
import SingleItem from "../components/SingleItem";

function Favourites() {
  const [favourites, setFavourites] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    axios({
      method: "get",
      url: baseUrl + "/favourites/get",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setIsLoading(false);
        if (response.data.isSuccess) {
          setFavourites(response.data.favourites);
          console.log(response.data.favourites);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  useEffect(() => {
    axios({
      method: "get",
      url: baseUrl + "/auth/user",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
      },
    }).then((response) => {
      if (response.data.isLogin) {
        setUser(response.data.user);
      } else {
        window.location.href = "/login";
      }
    });
  }, []);
  return (
    <div id="favourites">
      <header>
        <div className="user-info">
          {user && user.avatar ? (
            <img src={`${baseUrl}/profileImages/${user.avatar}`} alt="user" />
          ) : null}
          <p>
            <strong>{user?.fullName}</strong>
          </p>
          <button
            onClick={() => {
              window.location.href = "/edit-profile";
            }}
          >
            <EditIcon color="inherit" />
          </button>
        </div>
      </header>

      <h1 style={{ marginTop: "3rem" }}>Favourites Items</h1>

      <div className="favourites-items-container">
        {favourites
          ? favourites.map((item) => {
              return (
                <SingleItem
                  item={item}
                  key={item._id}
                  liked={true}
                  favourites={favourites}
                  setFavourites={setFavourites}
                />
              );
            })
          : isLoading
          ? "Loading..."
          : "No Favourites"}
      </div>
    </div>
  );
}

export default Favourites;
