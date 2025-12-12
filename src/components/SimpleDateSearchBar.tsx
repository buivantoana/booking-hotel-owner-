"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Stack,
  Button,
  Typography,
  Popper,
  ClickAwayListener,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Search, KeyboardArrowDown } from "@mui/icons-material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";



// Popup chọn ngày nhận - trả (chỉ dành cho đặt theo ngày)
const DateRangePicker = ({
  open,
  anchorEl,
  onClose,
  onApply,
  initialCheckIn,
  initialCheckOut,
}: {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onApply: (checkIn: Dayjs | null, checkOut: Dayjs | null) => void;
  initialCheckIn?: Dayjs | null;
  initialCheckOut?: Dayjs | null;
}) => {
  const [checkIn, setCheckIn] = useState<Dayjs | null>(initialCheckIn || dayjs());
  const [checkOut, setCheckOut] = useState<Dayjs | null>(initialCheckOut || dayjs().add(1, "day"));

  const handleDateClick = (date: Dayjs) => {
    if (!checkIn || (checkOut && date.isBefore(checkIn))) {
      setCheckIn(date);
      setCheckOut(null);
    } else if (!checkOut && date.isAfter(checkIn)) {
      setCheckOut(date);
    } else {
      setCheckIn(date);
      setCheckOut(null);
    }
  };

  const handleApply = () => {
    onApply(checkIn, checkOut);
    onClose();
  };

  const handleReset = () => {
    setCheckIn(dayjs());
    setCheckOut(dayjs().add(1, "day"));
  };

  if (!open || !anchorEl) return null;

  return (
    <Popper open={open} anchorEl={anchorEl} placement="bottom" sx={{ zIndex: 50 }}>
      <Paper elevation={8} sx={{ mt: 1, borderRadius: "24px", overflow: "hidden", width: 680 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack>
            <Box p={2} bgcolor="#f9f9f9" borderBottom="1px solid #eee">
              <Typography fontWeight={600}>Chọn ngày nhận - trả phòng</Typography>
            </Box>

            <Stack direction="row">
              <Box sx={{ flex: 1, p: 1, borderRight: "1px solid #eee" }}>
                <DateCalendar
                  value={checkIn}
                  disablePast
                  slots={{
                    day: (props) => {
                      const isStart = checkIn?.isSame(props.day, "day");
                      const isEnd = checkOut?.isSame(props.day, "day");
                      const isInRange = checkIn && checkOut && props.day.isAfter(checkIn) && props.day.isBefore(checkOut);

                      return (
                        <Button
                          {...props}
                          onClick={() => handleDateClick(props.day)}
                          sx={{
                            minWidth: 36,
                            height: 36,
                            borderRadius: "50%",
                            bgcolor: isStart || isEnd ? "#98b720" : isInRange ? "#f0f8f0" : "transparent",
                            color: isStart || isEnd ? "white" : "inherit",
                            "&:hover": { bgcolor: "#e8f5e8" },
                          }}>
                          {props.day.format("D")}
                        </Button>
                      );
                    },
                  }}
                />
              </Box>

              <Box sx={{ flex: 1, p: 1 }}>
                <DateCalendar
                  value={checkIn}
                  disablePast
                  slots={{
                    day: (props) => {
                      const isStart = checkIn?.isSame(props.day, "day");
                      const isEnd = checkOut?.isSame(props.day, "day");
                      const isInRange = checkIn && checkOut && props.day.isAfter(checkIn) && props.day.isBefore(checkOut);

                      return (
                        <Button
                          {...props}
                          onClick={() => handleDateClick(props.day)}
                          sx={{
                            minWidth: 36,
                            height: 36,
                            borderRadius: "50%",
                            bgcolor: isStart || isEnd ? "#98b720" : isInRange ? "#f0f0" : "transparent",
                            color: isStart || isEnd ? "white" : "inherit",
                            "&:hover": { bgcolor: "#e8f5e8" },
                          }}>
                          {props.day.format("D")}
                        </Button>
                      );
                    },
                  }}
                />
              </Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between" p={2} bgcolor="#f9f9f9" borderTop="1px solid #eee">
              <Button variant="outlined" onClick={handleReset} sx={{ borderRadius: "50px" }}>
                Bất kỳ ngày nào
              </Button>
              <Button
                variant="contained"
                onClick={handleApply}
                sx={{ bgcolor: "#98b720", borderRadius: "50px", px: 4 }}>
                Áp dụng
              </Button>
            </Stack>
          </Stack>
        </LocalizationProvider>
      </Paper>
    </Popper>
  );
};

// Component chính – siêu gọn
export default function SimpleDateSearchBar() {
  const navigate = useNavigate();
  const dateRef = useRef<HTMLDivElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [checkIn, setCheckIn] = useState<Dayjs | null>(dayjs());
  const [checkOut, setCheckOut] = useState<Dayjs | null>(dayjs().add(1, "day"));

  const formatDate = (date: Dayjs | null, fallback: string) => {
    return date ? date.format("DD/MM/YYYY") : fallback;
  };

  const handleSearch = () => {
    if (!checkIn || !checkOut) return;

    const params = new URLSearchParams({
      checkIn: checkIn.format("YYYY-MM-DD"),
      checkOut: checkOut.format("YYYY-MM-DD"),
    });

    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ClickAwayListener onClickAway={() => setPickerOpen(false)}>
        <Box  zIndex={10}>
          <Container maxWidth="md">
          
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="center">
                {/* Ô chọn ngày */}
                <Box
                  ref={dateRef}
                  onClick={() => setPickerOpen(true)}
                  sx={{
                    flex: 1,
                    cursor: "pointer",
                    border: pickerOpen ? "2px solid #98b720" : "1px solid #eee",
                    borderRadius: "16px",
                    px: 2,
                    bgcolor: pickerOpen ? "#f8fff8" : "white",
                    transition: "all 0.2s",
                    py:1
                  }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box textAlign="center">
                     
                      
                      <Typography fontWeight={500} color="#333">
                        {formatDate(checkIn, "Chọn ngày")}
                      </Typography>
                    </Box>

                    <Typography color="#999" >-</Typography>

                    <Box textAlign="center">
                    
                     
                      <Typography fontWeight={500} color="#333">
                        {formatDate(checkOut, "Chọn ngày")}
                      </Typography>
                    </Box>

                    
                  </Stack>
                </Box>

                {/* Nút tìm kiếm */}
               
              </Stack>
            

            {/* Popup lịch */}
            <DateRangePicker
              open={pickerOpen}
              anchorEl={dateRef.current}
              onClose={() => setPickerOpen(false)}
              onApply={(ci, co) => {
                setCheckIn(ci);
                setCheckOut(co);
              }}
              initialCheckIn={checkIn}
              initialCheckOut={checkOut}
            />
          </Container>
        </Box>
      </ClickAwayListener>
    </LocalizationProvider>
  );
}