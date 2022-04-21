import React, { useState, useEffect } from "react";
import "../css/pages/EditProfile.css";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AllCountriesDropdown from "../components/AllCountiesDropdown";
import baseUrl from "../constants/baseUrl";
import axios from "axios";
import { toast } from "react-toastify";

const theme = createTheme();
export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [country, setCountry] = useState("");

  const [dateOfBirth, setDateOfBirth] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [about, setAbout] = useState("");
  const [address, setAddress] = useState("");

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const allFields = {
      email: data.get("email"),
      fullName: data.get("firstName") + " " + data.get("lastName"),
      phone: data.get("phone"),
      country,
      address: data.get("address"),
      about: data.get("about"),
      dateOfBirth,
    };
    const formData = new FormData();
    formData.append("email", allFields.email);
    formData.append("fullName", allFields.fullName);
    formData.append("phone", allFields.phone);
    formData.append("country", allFields.country);
    formData.append("address", allFields.address);
    formData.append("about", allFields.about);
    formData.append("dateOfBirth", allFields.dateOfBirth);
    const avatar = document.getElementById("userAvatar").files[0];
    if (avatar) {
      formData.append("avatar", avatar);
    } else {
      formData.append("avatar", user.avatar);
    }

    axios({
      method: "post",
      url: baseUrl + "/auth/update",
      withCredentials: true,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.isSuccess) {
          toast.success("User updated successfully");
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

  useEffect(() => {
    setEmail(user?.email);
    setFirstName(user?.fullName.split(" ")[0]);
    setLastName(user?.fullName.split(" ")[1]);
    setPhoneNumber(user?.phone);
    setCountry(user?.country);
    setAddress(user?.address);
    setDateOfBirth(
      user
        ? new Date(user.dateOfBirth ? user.dateOfBirth : new Date())
            .toISOString()
            .substr(0, 10)
        : new Date().toISOString().substr(0, 10)
    );
    setAbout(user?.about);
  }, [user]);

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
    <div id="editProfile">
      <h1>Your Public Profile</h1>
      <div className="avatar-continer">
        <InputLabel id="demo-simple-select-label">Prfile Image</InputLabel>
        <div>
          <input type="file" id="userAvatar" accept="image/*" />
          {user && user.avatar ? (
            <img src={baseUrl + "/profileImages/" + user.avatar} alt="" />
          ) : (
            "No profile image"
          )}
        </div>
      </div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    type="tel"
                    id="phone"
                    autoComplete="phone"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <InputLabel id="demo-simple-select-label">
                    Date of Biirth
                  </InputLabel>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <InputLabel id="demo-simple-select-label">Country</InputLabel>
                  <AllCountriesDropdown
                    handleChange={handleCountryChange}
                    c={country}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="address"
                    label="Full Address"
                    type="text"
                    id="address"
                    autoComplete="address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel id="demo-simple-select-label">About</InputLabel>
                  <textarea
                    name="about"
                    id="about"
                    cols="50"
                    rows="10"
                    value={about}
                    onChange={(event) => setAbout(event.target.value)}
                  ></textarea>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Save Chnages
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
