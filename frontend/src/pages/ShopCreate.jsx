import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import baseUrl from "../constants/baseUrl";
import { toast } from "react-toastify";
import InputLabel from "@mui/material/InputLabel";
import Shop from "./Shop";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        Etsy
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function ShopCreate() {
  const [shopName, setShopName] = React.useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const allFields = {
      name: data.get("shopName"),
    };
    const shopAvatar = document.getElementById("shopAvatar").files[0];
    const formData = new FormData();
    formData.append("name", allFields.name);
    formData.append("avatar", shopAvatar);

    axios({
      method: "post",
      url: baseUrl + "/shop/create",
      withCredentials: true,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.isSuccess) {
          toast.success("Shop created successfully");
          window.location.href = "/shop/" + data.shopId;
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const checkShopName = () => {
    if (shopName.length === 0) {
      toast.error("Shop name can't be empty");
    } else {
      axios({
        method: "post",
        url: baseUrl + "/shop/checkShopName",
        withCredentials: true,
        data: {
          shopName: shopName,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          const data = response.data;
          if (data.isAvailable) {
            toast.success("Shop Name is available");
            //window.location.href = "/";
          } else {
            toast.error("Shop Name is not available");
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <div style={{ display: "flex" }}>
              <TextField
                margin="shopName"
                required
                fullWidth
                id="shopName"
                label="Enter Shop Name"
                name="shopName"
                type="text"
                autoComplete="shopName"
                autoFocus
                onChange={(event) => {
                  setShopName(event.target.value);
                }}
              />
              <Button
                size="large"
                variant="contained"
                style={{ fontSize: "10px" }}
                onClick={checkShopName}
              >
                Check Availability
              </Button>
            </div>
            <InputLabel style={{ marginTop: "1rem", marginBottom: "1rem" }}>
              Shop Avatar
            </InputLabel>
            <input type="file" id="shopAvatar" />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Shop
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
