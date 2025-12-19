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
import { useLocation, useNavigate } from "react-router-dom";
import InsightsIcon from '@mui/icons-material/Insights';
export default function SidebarMenu() {
  const location = useLocation();
  const navigate = useNavigate();

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
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.id}
              onClick={() => navigate(item.path)}
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
                // Set fontSize ở đây là tốt nhất
                sx={{
                  "& .MuiTypography-root": {
                    fontSize: "18px", // hoặc "1rem"
                    fontWeight: "inherit", // Kế thừa fontWeight từ ListItemButton
                  }
                }}

                // Hoặc dùng primaryTypographyProps
                primaryTypographyProps={{
                  sx: {
                    fontSize: "16px",
                    fontWeight: "inherit",
                  }
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
