import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Avatar from "@mui/material/Avatar";

import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InputLabel from "@mui/material/InputLabel";

import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import baseUrl from "../constants/baseUrl";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",

  boxShadow: 24,
  p: 4,
};

const theme = createTheme();

export default function EditItemFormPopup({ isOpen, setOpen, item }) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.desc);
  const [price, setPrice] = useState(item.price);
  const [stock, setStock] = useState(item.stock);
  useEffect(() => {
    setName(item.name);
    setDescription(item.desc);
    setPrice(item.price);
    setStock(item.stock);
  }, [item]);
  const handleClose = () => setOpen(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const formData = new FormData();
    formData.append("name", data.get("itemName"));
    formData.append("desc", data.get("itemDescription"));
    formData.append("price", data.get("itemPrice"));
    formData.append("stock", data.get("itemStock"));
    const img = document.getElementById("itemImg").files[0];
    formData.append("_id", item._id);
    if (img) {
      formData.append("img", img);
    } else {
      formData.append("img", item.img);
    }

    axios({
      method: "post",
      url: baseUrl + "/product/update",
      withCredentials: true,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.isSuccess) {
          toast.success("Item Updated successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid item xs={12}>
                    <InputLabel id="demo-simple-select-label">
                      Item Image
                    </InputLabel>
                    <div
                      className="itemImageUpload"
                      style={{ marginBottom: "1rem" }}
                    >
                      <input type="file" id="itemImg" />
                    </div>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="itemName"
                        label="Item Name"
                        name="itemName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="itemDescription"
                        label="Item Description"
                        type="text"
                        id="itemDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="itemPrice"
                        label="Item Price in USD"
                        type="number"
                        id="itemPrice"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="itemStock"
                        label="How many items are in stock?"
                        type="number"
                        id="itemStock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Update Item
                  </Button>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </Box>
      </Modal>
    </div>
  );
}
