import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InsightsIcon from "@mui/icons-material/Insights";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../src/images/Frame 1321318032.png";

// Giữ nguyên UserProfileButton từ code gốc của bạn
import { Avatar, Button, Popover } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import PersonIcon from "@mui/icons-material/Person";
import { useBookingContext } from "../App"; // ← giữ nguyên import của bạn

const UserProfileButton = ({setMobileOpen}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const context = useBookingContext();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (isMobile) setMobileOpen(false);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          bgcolor: "white",
          borderRadius: "10px",
          padding: "10px 20px",
          border: "1px solid #e0e0e0",
          textTransform: "none",
          display: "flex",
          alignItems: "center",
          gap: 2,
          "&:hover": {
            bgcolor: "#f9f9f9",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#98B720",
            color: "white",
            width: 44,
            height: 44,
          }}
        >
          <PersonIcon />
        </Avatar>

        <Box sx={{ textAlign: "left", flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
            {context?.state?.user?.name}
          </Typography>
          {context?.state?.user?.phone && (
            <Typography variant="body2" color="text.secondary">
              +84 {context?.state?.user?.phone?.slice(3)}
            </Typography>
          )}
        </Box>

        <ArrowDropUpIcon
          sx={{
            color: "text.secondary",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            ml: 1,
          }}
        />
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              width: anchorEl ? anchorEl.offsetWidth : "auto",
              mt: 1.5,
              borderRadius: "16px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              overflow: "visible",
              bgcolor: "white",
              padding: 0,
            },
          },
        }}
      >
        <ArrowDropUpIcon
          sx={{
            position: "absolute",
            top: -15,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 32,
            color: "white",
            filter: "drop-shadow(0 -2px 4px rgba(0,0,0,0.1))",
          }}
        />

        <Box sx={{ px: 3.5, py: 3.5 }}>
          <Typography
            onClick={() => {
              handleClose();
              navigate("/manager-profile");
            }}
            sx={{ cursor: "pointer" }}
            variant="h6"
            color="text.primary"
            gutterBottom
          >
            Hồ sơ cá nhân
          </Typography>

          <Typography
            variant="body1"
            color="error.main"
            onClick={() => {
              context.dispatch({
                type: "LOGOUT",
                payload: { ...context.state, user: {} },
              });
              localStorage.removeItem("user");
              localStorage.removeItem("access_token");
              handleClose();
            }}
            fontWeight="bold"
            sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
          >
            Đăng xuất
          </Typography>
        </Box>
      </Popover>
    </>
  );
};



export default function SidebarMenu() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { id: "home", label: "Trang chủ", icon: <HomeOutlinedIcon />, path: "/" },
    {
      id: "review",
      label: "Quản lý đánh giá",
      icon: <StarBorderOutlinedIcon />,
      path: "/review",
    },
    {
      id: "roomType",
      label: "Quản lý loại phòng",
      icon: <AssignmentOutlinedIcon />,
      path: "/manager-room",
    },
    {
      id: "booking",
      label: "Quản lý đặt phòng",
      icon: <CalendarMonthOutlinedIcon />,
      path: "/manager-bookings",
    },
    {
      id: "hotelInfo",
      label: "Thông tin khách sạn",
      icon: <InfoOutlinedIcon />,
      path: "/info-hotel",
    },
    {
      id: "reconciliation",
      label: "Quản lý đối soát",
      icon: <InsightsIcon />,
      path: "/reconciliation",
    },
  ];

  const drawerContent = (
    <Box
      sx={{
        width: isMobile?"100%":260,
        height: "100vh",
        bgcolor: "#fff",
        borderRight: isMobile?"none":"1px solid #eee",
        p: isMobile?0:2,
        display: "flex",
        flexDirection: "column",
       
      }}
    >
      {!isMobile&&<Box my={3} display="flex" justifyContent="center">
        <img src={logo} width={200} alt="" />
      </Box>}

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.id}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                mb: 1,
                borderRadius: "20px",
                bgcolor: isActive ? "#F4FBE7" : "transparent",
                color: isActive ? "#7CB518" : "#8B93A1",
                "&:hover": {
                  bgcolor: isActive ? "#EAF7D3" : "#f5f5f5",
                },
                fontWeight: isActive ? 700 : 500,
              }}
            >
              <ListItemIcon
                sx={{ color: isActive ? "#7CB518" : "#8B93A1", minWidth: 40 }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: { fontSize: "16px", fontWeight: "inherit" },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mt: "auto",
          pb: 4,
          
        }}
      >
        <UserProfileButton setMobileOpen={setMobileOpen} />
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile: Hamburger ở header */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            bgcolor: "white",
           
            color: "text.primary",
            zIndex: (theme) => theme.zIndex.drawer + 2,
            padding:0
          }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
           <Box my={3} display="flex" justifyContent="center">
         <img src={logo} width={150} alt="" />
         </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: isMobile?"100%":260,pt:"120px" },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Sidebar desktop */}
      <Box
        sx={{
          width: isMobile?"100%":260,
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        {drawerContent}
      </Box>
    </>
  );
}