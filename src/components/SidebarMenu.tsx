import React from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function SidebarMenu() {
  const [active, setActive] = React.useState("home");

  const menuItems = [
    { id: "home", label: "Trang chủ", icon: <HomeOutlinedIcon /> },
    {
      id: "review",
      label: "Quản lý đánh giá",
      icon: <StarBorderOutlinedIcon />,
    },
    {
      id: "roomType",
      label: "Quản lý loại phòng",
      icon: <AssignmentOutlinedIcon />,
    },
    {
      id: "booking",
      label: "Quản lý đặt phòng",
      icon: <CalendarMonthOutlinedIcon />,
    },
    {
      id: "hotelInfo",
      label: "Thông tin khách sạn",
      icon: <InfoOutlinedIcon />,
    },
  ];

  return (
    <Box
      sx={{
        width: { xs: "220px", sm: "260px" },
        height: "100vh",
        borderRight: "1px solid #eee",
        p: 2,
        bgcolor: "#fff",
        flex: 0.7,
      }}>
      <Typography variant='h6' sx={{ fontWeight: 700, mb: 4 }}>
        Logo
      </Typography>

      <List>
        {menuItems.map((item) => {
          const isActive = active === item.id;
          return (
            <ListItemButton
              key={item.id}
              onClick={() => setActive(item.id)}
              sx={{
                mb: 1,
                borderRadius: "20px",
                bgcolor: isActive ? "#F4FBE7" : "transparent",
                color: isActive ? "#7CB518" : "#8B93A1",
                "&:hover": {
                  bgcolor: isActive ? "#EAF7D3" : "#f5f5f5",
                },
              }}>
              <ListItemIcon
                sx={{ color: isActive ? "#7CB518" : "#8B93A1", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
