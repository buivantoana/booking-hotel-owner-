import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  TextField,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import remove from "../../images/delete.png";
import { ArrowBackIos } from "@mui/icons-material";
import RoomTypeManager from "../create_hotel/RoomTypeManager";

export default function CreateRoom({ setAction }) {
  const [hotel, setHotel] = React.useState("");
  const [roomType, setRoomType] = React.useState("");
  const [bookingType, setBookingType] = React.useState("");
  const [fromDate, setFromDate] = React.useState(null);
  const [toDate, setToDate] = React.useState(null);
  const [fromTime, setFromTime] = React.useState(null);
  const [toTime, setToTime] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, background: "#F7F9FB", minHeight: "100vh" }}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          mb={4}
          alignItems={"center"}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Nút back (có thể thay bằng Link hoặc onClick) */}
            <ArrowBackIos
              sx={{
                fontSize: 30,
                color: "#666",
                cursor: "pointer",
                "&:hover": { color: "#333" },
              }}
              onClick={() => setAction("manager")} // hoặc navigate(-1)
            />

            <Box>
              <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
                Tạo loại phòng
              </Typography>
              <Typography fontSize={13} color='#888' fontWeight={500}>
                Khách sạn 123
              </Typography>
            </Box>
          </Box>

          {/* Nút Duyệt phòng bên phải */}
          <Button
            variant='contained'
            sx={{
              bgcolor: "#98B720",
              color: "white",
              fontWeight: 600,
              fontSize: 15,
              px: 4,
              py: 1.2,
              borderRadius: "50px",
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(102, 187, 106, 0.35)",
              "&:hover": {
                bgcolor: "#4caf50",
                boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)",
              },
            }}>
            Duyệt phòng
          </Button>
        </Box>
        <RoomTypeManager />
      </Box>
    </LocalizationProvider>
  );
}
