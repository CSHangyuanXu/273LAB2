import React, { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { Link } from "react-router-dom";
import axios from "axios";
import baseUrl from "../constants/baseUrl";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function TopBar({ user }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = (logout) => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link to="/edit-profile" style={{ color: "black" }}>
        <MenuItem onClick={handleMenuClose}>My Account</MenuItem>{" "}
      </Link>
      <Link to="/purchases" style={{ color: "black" }}>
        <MenuItem onClick={handleMenuClose}>My Purchases</MenuItem>{" "}
      </Link>
      {user && (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            axios({
              method: "get",
              url: baseUrl + "/auth/logout",
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Accept: "application/json",
              },
            }).then((response) => {
              if (response.data.isSuccess) {
                window.location.reload();
              }
            });
          }}
        >
          Logout
        </MenuItem>
      )}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Link
          to="/favourites"
          style={{ color: "black", display: "flex", alignItems: "center" }}
        >
          <IconButton size="large" color="inherit">
            <FavoriteBorderIcon />
          </IconButton>
          <p>Favourites</p>
        </Link>
      </MenuItem>
      <MenuItem>
        <Link
          to="/basket"
          style={{ color: "black", display: "flex", alignItems: "center" }}
        >
          <IconButton size="large" color="inherit">
            <ShoppingBasketIcon />
          </IconButton>
          <p>Basket</p>
        </Link>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  const [search, setSearch] = useState("");
  useEffect(() => {
    /// listen for enter key
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        window.location.href = `/search?q=${search}`;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [search]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Link to="/" className="link">
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Etsy
            </Typography>
          </Link>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          {user ? null : (
            <Link to="/login" className="link">
              <Box sx={{ display: { xs: "none", md: "flex" } }}>Login</Box>
            </Link>
          )}
          {user &&
            (user.isSeller ? (
              <>
                <Link
                  to={`/shop/${user.shopId._id}`}
                  className="link"
                  style={{ marginLeft: "20px" }}
                >
                  <Box sx={{ display: { xs: "none", md: "flex" } }}>
                    Seller Dashboard
                  </Box>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/seller-onboard"
                  className="link"
                  style={{ marginLeft: "20px" }}
                >
                  <Box sx={{ display: { xs: "none", md: "flex" } }}>
                    Become Seller
                  </Box>
                </Link>
              </>
            ))}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Link to="/favourites" style={{ color: "white" }}>
              <IconButton
                size="large"
                aria-label="favorites items"
                color="inherit"
              >
                <FavoriteBorderIcon />
              </IconButton>
            </Link>
            <Link to="/basket" style={{ color: "white" }}>
              <IconButton size="large" aria-label="cart items" color="inherit">
                <ShoppingBasketIcon />
              </IconButton>
            </Link>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
