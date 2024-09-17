"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/libs/hook";
import { logout } from "@/libs/features/auth/authSlice";
import useAxiosAuth from "@/libs/hooks/useAxiosAuth";
import useRole from "@/libs/hooks/useRole";
import { Role } from "@/constants/enums/Role";
import { useAuth } from "@/contexts/AuthProvider";
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import IconLogout from "@mui/icons-material/Logout";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Badge from "@mui/material/Badge";

const Header: React.FC = () => {
  const { isAuthenticated, loading, logout: logoutContext } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const photo = useAppSelector((state) => state.auth.photo);
  const cart = useAppSelector((state) => state.cart);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const axiosAuth = useAxiosAuth();

  const isAdmin = useRole(Role.ADMIN);

  const logOut = async () => {
    const { status } = await axiosAuth("/auth/logout");
    if (status === 200) {
      handleClose();
      logoutContext();
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="flex flex-col w-[100%] fixed top-[0px] z-[10] shadow-md">
        {/* first section */}
        <div className="w-[100%] flex justify-center bg-white">
          <div className="flex w-[80%] justify-between items-center">
            {/* Logo */}
            <Link href={"/"}>
              <Image
                src={"/u-palm.jpg"}
                width={70}
                height={70}
                alt={"u-palm"}
                className="cursor-pointer"
              />
            </Link>

            {/* sign in / up && cart user information */}
            {loading ? (
              "Loading..."
            ) : isAuthenticated ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {isAdmin && <Link href="/admin/overview">Admin</Link>}

                <Link href={"../cart"}>
                  <IconButton>
                    <Badge
                      badgeContent={cart.items ? cart.items.length : 0}
                      color="primary"
                    >
                      <ShoppingCartOutlinedIcon />
                    </Badge>
                  </IconButton>
                </Link>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar
                      src={photo ? photo : undefined}
                      sx={{ width: 32, height: 32 }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <div className="flex gap-2 text-primary-500 text-[12.5px] items-center">
                <Link
                  href={"/login"}
                  className="border-[1px] border-[#fff] px-3 hover:text-secondary-500 rounded-md transition-all h-[30px]"
                >
                  เข้าสู่ระบบ
                </Link>
                {/* line between sign & sign up */}
                <div className="h-[20px] w-[1px] bg-primary-200"></div>
                <Link
                  href={"/register"}
                  className="border-[1px] border-[#fff] px-3 hover:text-secondary-500 rounded-md transition-all h-[30px]"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>
        </div>
        {/* second section */}
        <div className="w-[100%] flex justify-center bg-primary-700 py-2">
          <div className="w-[80%] flex justify-between">
            {/* nav section */}
            <div className="flex gap-3 text-white text-[13px]">
              <Link
                href={"/"}
                className="pr-5 hover:text-secondary-500 transition-all"
              >
                หน้าหลัก
              </Link>
              <Link
                href={"/"}
                className="hover:text-secondary-500 transition-all"
              >
                สินค้าทั้งหมด
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        className="z-50"
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={logOut}>
          <ListItemIcon>
            <IconLogout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
