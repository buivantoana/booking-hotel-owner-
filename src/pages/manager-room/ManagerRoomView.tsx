import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  useMediaQuery,
  Card,
  Checkbox,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import LockIcon from "@mui/icons-material/Lock";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function ManagerRoomView() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [active, setActive] = useState("hourly");
  const [dateRange, setDateRange] = useState("19/11/2025 - 20/11/2025");
  const [openQuickBlock, setOpenQuickBlock] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [action, setAction] = useState("manager");

  const tabs = [
    { key: "hourly", label: "Theo giờ" },
    { key: "overnight", label: "Qua đêm" },
    { key: "daily", label: "Theo ngày" },
  ];

  return (
    <>
      {action == "create" && <CreateRoom setAction={setAction} />}
      {action == "lock" && <LockRoomSetup setAction={setAction} />}
      {action == "manager" && (
        <Box py={2} px={isMobile ? 1 : 3}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'>
            {/* Left section */}
            <Box display='flex' flexDirection='column' gap={0.5}>
              <Typography fontSize={isMobile ? 18 : 22} fontWeight={600}>
                Danh sách loại phòng
              </Typography>

              <Box display='flex' alignItems='center' gap={1}>
                <Typography fontSize={14} color='grey.700' fontWeight={500}>
                  Khách sạn 123
                </Typography>
                <KeyboardArrowDownIcon
                  sx={{ fontSize: 20, color: "grey.700" }}
                />

                <Box display='flex' alignItems='center' gap={0.5} ml={2}>
                  <RefreshIcon sx={{ fontSize: 18, color: "#8BC34A" }} />
                  <Typography fontSize={13} color='#8BC34A' fontWeight={500}>
                    Nhấn cập nhật dữ liệu
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Right section */}
            <Box display='flex' alignItems='center' gap={2}>
              <Box
                display='flex'
                alignItems='center'
                onClick={() => setAction("lock")}
                gap={0.5}
                sx={{ cursor: "pointer" }}>
                <LockIcon sx={{ fontSize: 18, color: "#8BC34A" }} />
                <Typography fontSize={14} color='#8BC34A' fontWeight={500}>
                  Khóa phòng
                </Typography>
              </Box>

              <Divider orientation='vertical' flexItem />

              <Box
                display='flex'
                alignItems='center'
                gap={0.5}
                onClick={() => setAction("create")}
                sx={{ cursor: "pointer" }}>
                <AddCircleOutlineIcon sx={{ fontSize: 20, color: "#8BC34A" }} />
                <Typography fontSize={14} color='#8BC34A' fontWeight={500}>
                  Tạo thêm loại phòng
                </Typography>
              </Box>
            </Box>
          </Box>
          <Card sx={{ mt: 4 }}>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
              py={2}
              px={isMobile ? 1 : 2}
              sx={{ background: "#fff" }}>
              {/* Tabs */}
              <Box display='flex' alignItems='center' gap={3}>
                {tabs.map((t) => (
                  <Box
                    key={t.key}
                    sx={{ cursor: "pointer" }}
                    onClick={() => setActive(t.key)}>
                    <Typography
                      fontSize={15}
                      fontWeight={500}
                      sx={{
                        color: active === t.key ? "#8BC34A" : "#555",
                        borderBottom:
                          active === t.key
                            ? "2px solid #8BC34A"
                            : "2px solid transparent",
                        pb: 0.5,
                        transition: "all 0.25s",
                      }}>
                      {t.label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Date Range */}
              <Box
                display='flex'
                alignItems='center'
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 0.6,
                  minWidth: isMobile ? 150 : 220,
                  cursor: "pointer",
                }}>
                <Typography fontSize={14} color='#444' flex={1}>
                  {dateRange}
                </Typography>
                <KeyboardArrowDownIcon sx={{ fontSize: 20, color: "#555" }} />
              </Box>
            </Box>
            <Box py={3}>
              {active == "hourly" && (
                <RoomScheduleTableHourly
                  handleOpenQuickBlock={() => setOpenQuickBlock(true)}
                  handleOpenEdit={() => setOpenEdit(true)}
                />
              )}
              {active == "daily" && (
                <RoomScheduleTableDaily
                  handleOpenQuickBlock={() => setOpenQuickBlock(true)}
                  handleOpenEdit={() => setOpenEdit(true)}
                />
              )}
              {active == "overnight" && (
                <RoomScheduleTableOvernight
                  handleOpenQuickBlock={() => setOpenQuickBlock(true)}
                  handleOpenEdit={() => setOpenEdit(true)}
                />
              )}
            </Box>
          </Card>
          <QuickBlockDialog
            openQuickBlock={openQuickBlock}
            onClose={() => setOpenQuickBlock(false)}
          />
          <EditOperationDialog
            openEdit={openEdit}
            onClose={() => setOpenEdit(false)}
          />
        </Box>
      )}
    </>
  );
}
("use client");

import {
  Dialog,
  DialogContent,
  Select,
  MenuItem,
  FormControl,
  Stack,
  Chip,
  Paper,
} from "@mui/material";
import {
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

function QuickBlockDialog({ openQuickBlock, onClose }) {
  const [blockType] = useState("Theo giờ");
  const [startDate] = useState(dayjs("19/11/2025", "DD/MM/YYYY"));
  const [endDate] = useState(dayjs("21/11/2025", "DD/MM/YYYY"));
  const [startTime] = useState(dayjs().hour(15).minute(0));
  const [endTime] = useState(dayjs().hour(16).minute(0));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='vi'>
      <Dialog
        open={openQuickBlock}
        maxWidth='sm'
        fullWidth
        fullScreen={typeof window !== "undefined" && window.innerWidth < 600}
        PaperProps={{
          sx: {
            m: 0,
            borderRadius: { xs: 0, sm: "24px" },
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          },
        }}>
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            position: "relative",
            borderBottom: "1px solid #eee",
          }}>
          <Typography
            variant='h6'
            sx={{ fontWeight: 600, fontSize: "18px", color: "#333" }}>
            Khóa nhanh
          </Typography>
          <IconButton sx={{ position: "absolute", right: 12, top: 12 }}>
            <CloseIcon onClick={onClose} sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ bgcolor: "#fff", p: 3 }}>
          <Stack spacing={3.5}>
            {/* Khách sạn */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography fontSize={15} color='#888' fontWeight={500}>
                Khách sạn muốn khóa:
              </Typography>
              <Box
                sx={{
                  mt: 0.5,
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#333",
                }}>
                Khách sạn 123
              </Box>
            </Box>

            {/* Loại phòng */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography fontSize={15} color='#888' fontWeight={500}>
                Loại phòng:
              </Typography>
              <Box
                sx={{
                  mt: 0.5,
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#1b5e20",
                }}>
                Vip123
              </Box>
            </Box>

            {/* Loại đặt phòng muốn khóa */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography fontSize={13} color='#888' fontWeight={500}>
                Loại đặt phòng muốn khóa
              </Typography>
              <FormControl fullWidth sx={{ mt: 0.8, width: "60%" }}>
                <Select
                  value={blockType}
                  size='small'
                  displayEmpty
                  sx={{
                    "& .MuiSelect-select": { py: 1.6, fontSize: "14px" },
                    borderRadius: "8px",
                    height: "40px",
                  }}>
                  <MenuItem value='Theo giờ'>Theo giờ</MenuItem>
                  <MenuItem value='Qua đêm'>Qua đêm</MenuItem>
                  <MenuItem value='Theo ngày'>Theo ngày</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Khoảng thời gian */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography fontSize={13} color='#888' fontWeight={500}>
                Khoảng thời gian
              </Typography>
              <Stack
                direction='row'
                alignItems='center'
                width={"60%"}
                spacing={1.5}
                mt={1}>
                <MobileDatePicker
                  value={startDate}
                  format='DD/MM/YYYY'
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      sx: { "& .MuiInputBase-root": { borderRadius: "8px" } },
                    },
                  }}
                />
                <Typography color='#aaa' fontSize={14}>
                  —
                </Typography>
                <MobileDatePicker
                  value={endDate}
                  format='DD/MM/YYYY'
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      sx: { "& .MuiInputBase-root": { borderRadius: "8px" } },
                    },
                  }}
                />
              </Stack>
            </Box>

            {/* Khung giờ */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography fontSize={13} color='#888' fontWeight={500}>
                Khung giờ
              </Typography>
              <Stack
                direction='row'
                alignItems='center'
                width={"60%"}
                spacing={2}
                mt={1}>
                <MobileTimePicker
                  value={startTime}
                  ampm={false}
                  slotProps={{
                    textField: {
                      size: "small",
                      placeholder: "15:00",
                      sx: { "& .MuiInputBase-root": { borderRadius: "8px" } },
                      InputProps: {
                        endAdornment: (
                          <AccessTimeIcon
                            sx={{ fontSize: 18, color: "#999" }}
                          />
                        ),
                      },
                    },
                  }}
                />
                <Typography color='#aaa' fontSize={18}>
                  —
                </Typography>
                <MobileTimePicker
                  value={endTime}
                  ampm={false}
                  slotProps={{
                    textField: {
                      size: "small",
                      placeholder: "16:00",
                      sx: { "& .MuiInputBase-root": { borderRadius: "8px" } },
                      InputProps: {
                        endAdornment: (
                          <AccessTimeIcon
                            sx={{ fontSize: 18, color: "#999" }}
                          />
                        ),
                      },
                    },
                  }}
                />
              </Stack>
            </Box>

            {/* Hộp thông báo giống hệt */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "#f5f8e9",
                border: "1px solid #c8e6c9",
                borderRadius: "12px",
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
              }}>
              <CheckCircle sx={{ fontSize: 18, color: "#66bb6a", mt: 0.3 }} />
              <Box>
                <Typography fontSize={13} color='#33691e' lineHeight={1.5}>
                  Khách sẽ không thể đặt phòng tại{" "}
                  <strong>Khách sạn 123</strong> đối với đặt phòng:
                </Typography>
                <Chip
                  label='Theo giờ'
                  size='small'
                  sx={{
                    mt: 1,
                    bgcolor: "#98B720",
                    color: "white",
                    fontWeight: 600,
                    height: 26,
                    fontSize: "12px",
                  }}
                />
                <Typography
                  fontSize={13}
                  color='#1b5e20'
                  mt={1}
                  fontWeight={500}>
                  15:00 - 16:00 từ ngày 19/11/2025 - 21/11/2025
                </Typography>
              </Box>
            </Paper>

            {/* Nút hành động - giống hệt ảnh */}
            <Stack
              direction='row'
              justifyContent='space-between'
              spacing={2}
              mt={2}>
              <Button
                variant='outlined'
                onClick={onClose}
                sx={{
                  flex: 1,
                  borderRadius: "50px",
                  borderColor: "#ddd",
                  color: "#666",
                  textTransform: "none",
                  fontWeight: 500,
                  py: 1.5,
                  boxShadow: "none",
                  "&:hover": { borderColor: "#ccc" },
                }}>
                Hủy
              </Button>

              <Button
                variant='contained'
                sx={{
                  flex: 1,
                  borderRadius: "50px",
                  bgcolor: "#98B720",
                  "&:hover": { bgcolor: "#4caf50" },
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5,
                  boxShadow: "none",
                  fontSize: "15px",
                }}>
                Thêm lịch khóa phòng
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
}
import { TextField } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LaunchIcon from "@mui/icons-material/Launch";
import { MobileDatePicker, MobileTimePicker } from "@mui/x-date-pickers";
function RoomScheduleTableHourly({ handleOpenQuickBlock, handleOpenEdit }) {
  const isMobile = useMediaQuery("(max-width:768px)");

  const hours = [
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];
  return (
    <Box p={isMobile ? 1 : 2}>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}></Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Typography
            p={1}
            width={"98%"}
            borderBottom={"1px solid rgba(240, 241, 243, 1)"}>
            Tháng 11/2025
          </Typography>
          <Box p={1} borderBottom={"1px solid rgba(240, 241, 243, 1)"}>
            <Button
              variant='contained'
              sx={{ background: "rgba(152, 183, 32, 1)", height: "24px" }}>
              19 thứ 4
            </Button>
          </Box>
          <Box borderBottom={"1px solid rgba(240, 241, 243, 1)"}>
            <Box
              display='flex'
              alignItems='center'
              sx={{ overflowX: "auto", whiteSpace: "nowrap" }}>
              {hours.map((h, i) => (
                <Box
                  width={"6.66%"}
                  py={1}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderRight={
                    i == hours.length - 1
                      ? "none"
                      : "1px solid rgba(240, 241, 243, 1)"
                  }>
                  <Typography key={h} fontSize={14} color='#666'>
                    {h}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              fontWeight={600}
              display={"flex"}
              alignItems={"center"}
              fontSize={"17px"}
              gap={1}>
              Vip123 <KeyboardArrowUpIcon />
            </Typography>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"14px"}
              color='rgba(152, 183, 32, 1)'
              gap={1}>
              Xem <LaunchIcon sx={{ fontSize: "15px" }} />
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box>
            <Box
              display='flex'
              alignItems='center'
              sx={{ overflowX: "auto", whiteSpace: "nowrap" }}>
              {hours.map((h, i) => (
                <Box
                  width={"6.66%"}
                  py={3}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderRight={
                    i == hours.length - 1
                      ? "none"
                      : "1px solid rgba(240, 241, 243, 1)"
                  }>
                  <Typography key={h} fontSize={14} color='#666'></Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"15px"}
              gap={1}>
              Tình trạng phòng
            </Typography>
            <Typography
              fontWeight={500}
              display={"flex"}
              onClick={handleOpenQuickBlock}
              sx={{ cursor: "pointer" }}
              alignItems={"center"}
              fontSize={"14px"}
              color='rgba(152, 183, 32, 1)'
              gap={1}>
              Khóa nhanh
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box py={1}>
            <Box
              height={"36px"}
              color={"rgba(32, 183, 32, 1)"}
              display={"flex"}
              alignItems={"center"}
              pl={1}
              borderRadius={"50px"}
              bgcolor={"rgba(234, 245, 237, 1)"}>
              Còn phòng
            </Box>
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"15px"}
              gap={1}>
              Số phòng đặt
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            display='flex'
            alignItems='center'
            sx={{ overflowX: "auto", whiteSpace: "nowrap" }}>
            {hours.map((h, i) => (
              <Box
                width={"6.66%"}
                py={1.5}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                borderRight={
                  i == hours.length - 1
                    ? "none"
                    : "1px solid rgba(240, 241, 243, 1)"
                }>
                <Typography key={h} fontSize={14} color='#666'>
                  {i}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"15px"}
              gap={1}>
              Số phòng còn lại
            </Typography>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"14px"}
              color='rgba(152, 183, 32, 1)'
              onClick={handleOpenEdit}
              sx={{ cursor: "pointer" }}
              gap={1}>
              Chỉnh sửa
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            display='flex'
            alignItems='center'
            sx={{ overflowX: "auto", whiteSpace: "nowrap" }}>
            {hours.map((h, i) => (
              <Box
                width={"6.66%"}
                py={1}
                px={0.5}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                borderRight={
                  i == hours.length - 1
                    ? "none"
                    : "1px solid rgba(240, 241, 243, 1)"
                }>
                <TextField
                  key={h}
                  defaultValue='10'
                  size='small'
                  inputProps={{ style: { textAlign: "center" } }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"15px"}
              gap={1}>
              Giá phòng/2h đầu
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box py={1}>
            <Box
              height={"36px"}
              color={"rgba(234, 106, 0, 1)"}
              display={"flex"}
              alignItems={"center"}
              pl={1}
              borderRadius={"50px"}
              bgcolor={"rgba(255, 243, 233, 1)"}>
              150.000đ
            </Box>
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"15px"}
              gap={1}>
              GIá 1 giờ thêm
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box py={1}>
            <Box
              height={"36px"}
              color={"rgba(78, 106, 255, 1)"}
              display={"flex"}
              alignItems={"center"}
              pl={1}
              borderRadius={"50px"}
              bgcolor={"rgba(238, 241, 255, 1)"}>
              100.000đ
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
function RoomScheduleTableDaily({ handleOpenQuickBlock }) {
  const isMobile = useMediaQuery("(max-width:768px)");

  const hours = [
    "19 T4",
    "20 T5",
    "21 T6",
    "22 T7",
    "23 CN",
    "24 T2",
    "25 T3",
    "26 T4",
    "27 T5",
    "28 T6",
    "29 T7",
    "30 CN",
    "31 T2",
    "1 T3",
    "2 T4",
  ];

  return (
    <Box p={isMobile ? 1 : 2}>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}></Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Typography
            p={1}
            width={"98%"}
            borderBottom={"1px solid rgba(240, 241, 243, 1)"}>
            Tháng 11/2025
          </Typography>

          <Box borderBottom={"1px solid rgba(240, 241, 243, 1)"}>
            <Box
              display='flex'
              alignItems='center'
              sx={{ overflowX: "auto", whiteSpace: "nowrap" }}>
              {hours.map((h, i) => (
                <Box
                  width={"6.66%"}
                  py={1}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderRight={
                    i == hours.length - 1
                      ? "none"
                      : "1px solid rgba(240, 241, 243, 1)"
                  }>
                  <Typography key={h} fontSize={14} color='#666'>
                    {h}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              fontWeight={600}
              display={"flex"}
              alignItems={"center"}
              fontSize={"17px"}
              gap={1}>
              Vip123 <KeyboardArrowUpIcon />
            </Typography>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"14px"}
              color='rgba(152, 183, 32, 1)'
              gap={1}>
              Xem <LaunchIcon sx={{ fontSize: "15px" }} />
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box>
            <Box
              display='flex'
              alignItems='center'
              sx={{ overflowX: "auto", whiteSpace: "nowrap" }}>
              {hours.map((h, i) => (
                <Box
                  width={"6.66%"}
                  py={3}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderRight={
                    i == hours.length - 1
                      ? "none"
                      : "1px solid rgba(240, 241, 243, 1)"
                  }>
                  <Typography key={h} fontSize={14} color='#666'></Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"15px"}
              gap={1}>
              Tình trạng phòng
            </Typography>
            <Typography
              fontWeight={500}
              display={"flex"}
              onClick={handleOpenQuickBlock}
              sx={{ cursor: "pointer" }}
              alignItems={"center"}
              fontSize={"14px"}
              color='rgba(152, 183, 32, 1)'
              gap={1}>
              Khóa nhanh
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box py={1}>
            <Box
              height={"36px"}
              color={"rgba(32, 183, 32, 1)"}
              display={"flex"}
              alignItems={"center"}
              pl={1}
              borderRadius={"50px"}
              bgcolor={"rgba(234, 245, 237, 1)"}>
              Còn phòng
            </Box>
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"15px"}
              gap={1}>
              Số phòng đặt
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            display='flex'
            alignItems='center'
            sx={{ overflowX: "auto", whiteSpace: "nowrap" }}>
            {hours.map((h, i) => (
              <Box
                width={"6.66%"}
                py={1.5}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                borderRight={
                  i == hours.length - 1
                    ? "none"
                    : "1px solid rgba(240, 241, 243, 1)"
                }>
                <Typography key={h} fontSize={14} color='#666'>
                  {i}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"15px"}
              gap={1}>
              Số phòng còn lại
            </Typography>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"14px"}
              color='rgba(152, 183, 32, 1)'
              onClick={handleOpenEdit}
              sx={{ cursor: "pointer" }}
              gap={1}>
              Chỉnh sửa
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            display='flex'
            alignItems='center'
            sx={{ overflowX: "auto", whiteSpace: "nowrap" }}>
            {hours.map((h, i) => (
              <Box
                width={"6.66%"}
                py={1}
                px={0.5}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                borderRight={
                  i == hours.length - 1
                    ? "none"
                    : "1px solid rgba(240, 241, 243, 1)"
                }>
                <TextField
                  key={h}
                  defaultValue='10'
                  size='small'
                  inputProps={{ style: { textAlign: "center" } }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"15px"}
              gap={1}>
              Giá phòng/đêm
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box py={1}>
            <Box
              height={"36px"}
              color={"rgba(234, 106, 0, 1)"}
              display={"flex"}
              alignItems={"center"}
              pl={1}
              borderRadius={"50px"}
              bgcolor={"rgba(255, 243, 233, 1)"}>
              150.000đ
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
function RoomScheduleTableOvernight({ handleOpenQuickBlock }) {
  const isMobile = useMediaQuery("(max-width:768px)");

  const hours = [
    "19 T4",
    "20 T5",
    "21 T6",
    "22 T7",
    "23 CN",
    "24 T2",
    "25 T3",
    "26 T4",
    "27 T5",
    "28 T6",
    "29 T7",
    "30 CN",
    "31 T2",
    "1 T3",
    "2 T4",
  ];

  return (
    <Box p={isMobile ? 1 : 2}>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}></Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Typography
            p={1}
            width={"98%"}
            borderBottom={"1px solid rgba(240, 241, 243, 1)"}>
            Tháng 11/2025
          </Typography>

          <Box borderBottom={"1px solid rgba(240, 241, 243, 1)"}>
            <Box
              display='flex'
              alignItems='center'
              sx={{ overflowX: "auto", whiteSpace: "nowrap" }}>
              {hours.map((h, i) => (
                <Box
                  width={"6.66%"}
                  py={1}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderRight={
                    i == hours.length - 1
                      ? "none"
                      : "1px solid rgba(240, 241, 243, 1)"
                  }>
                  <Typography key={h} fontSize={14} color='#666'>
                    {h}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              fontWeight={600}
              display={"flex"}
              alignItems={"center"}
              fontSize={"17px"}
              gap={1}>
              Vip123 <KeyboardArrowUpIcon />
            </Typography>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"14px"}
              color='rgba(152, 183, 32, 1)'
              gap={1}>
              Xem <LaunchIcon sx={{ fontSize: "15px" }} />
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box>
            <Box
              display='flex'
              alignItems='center'
              sx={{ overflowX: "auto", whiteSpace: "nowrap" }}>
              {hours.map((h, i) => (
                <Box
                  width={"6.66%"}
                  py={3}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderRight={
                    i == hours.length - 1
                      ? "none"
                      : "1px solid rgba(240, 241, 243, 1)"
                  }>
                  <Typography key={h} fontSize={14} color='#666'></Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"15px"}
              gap={1}>
              Tình trạng phòng
            </Typography>
            <Typography
              fontWeight={500}
              onClick={handleOpenQuickBlock}
              sx={{ cursor: "pointer" }}
              display={"flex"}
              alignItems={"center"}
              fontSize={"14px"}
              color='rgba(152, 183, 32, 1)'
              gap={1}>
              Khóa nhanh
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box py={1}>
            <Box
              height={"36px"}
              color={"rgba(32, 183, 32, 1)"}
              display={"flex"}
              alignItems={"center"}
              pl={1}
              borderRadius={"50px"}
              bgcolor={"rgba(234, 245, 237, 1)"}>
              Còn phòng
            </Box>
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"15px"}
              gap={1}>
              Số phòng đặt
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            display='flex'
            alignItems='center'
            sx={{ overflowX: "auto", whiteSpace: "nowrap" }}>
            {hours.map((h, i) => (
              <Box
                width={"6.66%"}
                py={1.5}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                borderRight={
                  i == hours.length - 1
                    ? "none"
                    : "1px solid rgba(240, 241, 243, 1)"
                }>
                <Typography key={h} fontSize={14} color='#666'>
                  {i}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"15px"}
              gap={1}>
              Số phòng còn lại
            </Typography>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"14px"}
              onClick={handleOpenEdit}
              sx={{ cursor: "pointer" }}
              color='rgba(152, 183, 32, 1)'
              gap={1}>
              Chỉnh sửa
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            display='flex'
            alignItems='center'
            sx={{ overflowX: "auto", whiteSpace: "nowrap" }}>
            {hours.map((h, i) => (
              <Box
                width={"6.66%"}
                py={1}
                px={0.5}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                borderRight={
                  i == hours.length - 1
                    ? "none"
                    : "1px solid rgba(240, 241, 243, 1)"
                }>
                <TextField
                  key={h}
                  defaultValue='10'
                  size='small'
                  inputProps={{ style: { textAlign: "center" } }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box width={"100%"} display={"flex"}>
        <Box width={"25%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box
            px={2}
            height={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}>
            <Typography
              display={"flex"}
              alignItems={"center"}
              fontSize={"15px"}
              gap={1}>
              Giá phòng/đêm
            </Typography>
          </Box>
        </Box>
        <Box width={"75%"} border={"1px solid rgba(240, 241, 243, 1)"}>
          <Box py={1}>
            <Box
              height={"36px"}
              color={"rgba(234, 106, 0, 1)"}
              display={"flex"}
              alignItems={"center"}
              pl={1}
              borderRadius={"50px"}
              bgcolor={"rgba(255, 243, 233, 1)"}>
              150.000đ
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

import {
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import { CalendarToday, AccessTime } from "@mui/icons-material";

import "dayjs/locale/vi";
import LockRoomSetup from "./LockRoomSetup";
import CreateRoom from "./CreateRoom";

dayjs.locale("vi");

const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function EditOperationDialog({ openEdit, onClose }) {
  const [open] = useState(false);
  const [selectedDays, setSelectedDays] = useState([
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
  ]);
  const [roomCount, setRoomCount] = useState("");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='vi'>
      <Dialog
        open={openEdit}
        maxWidth='md'
        fullWidth
        fullScreen={typeof window !== "undefined" && window.innerWidth < 600}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: "28px" },
            m: { xs: 0, sm: 4 },
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          },
        }}>
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            position: "relative",
            borderBottom: "1px solid #eee",
          }}>
          <Typography
            variant='h6'
            sx={{ fontWeight: 600, fontSize: "18px", color: "#333" }}>
            Chỉnh sửa hoạt động
          </Typography>
          <IconButton sx={{ position: "absolute", right: 12, top: 12 }}>
            <CloseIcon onClick={onClose} sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ bgcolor: "#fff", p: 3 }}>
          <Stack spacing={3.5}>
            {/* Khách sạn */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography fontSize={15} color='#888' fontWeight={500}>
                Khách sạn muốn khóa:
              </Typography>
              <Box
                sx={{
                  mt: 0.5,
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#333",
                }}>
                Khách sạn 123
              </Box>
            </Box>

            {/* Loại phòng */}
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}>
              <Typography fontSize={15} color='#888' fontWeight={500}>
                Loại phòng:
              </Typography>
              <Box
                sx={{
                  mt: 0.5,
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#1b5e20",
                }}>
                Vip123
              </Box>
            </Box>

            {/* Khoảng ngày & Thời gian áp dụng */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {/* Khoảng ngày */}
              <Box width={"48%"}>
                <Typography
                  fontSize={13.5}
                  color='#777'
                  fontWeight={500}
                  mb={1}>
                  Khoảng ngày áp dụng
                </Typography>
                <Stack direction='row' alignItems='center' spacing={1.5}>
                  <MobileDatePicker
                    slots={{ openPickerIcon: CalendarToday }}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "Từ ngày",
                        fullWidth: true,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <CalendarToday
                                sx={{ fontSize: 18, color: "#999" }}
                              />
                            </InputAdornment>
                          ),
                        },
                        sx: {
                          "& .MuiInputBase-root": {
                            borderRadius: "12px",
                            height: 44,
                          },
                        },
                      },
                    }}
                  />
                  <Typography color='#aaa' fontSize={20}>
                    —
                  </Typography>
                  <MobileDatePicker
                    slots={{ openPickerIcon: CalendarToday }}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "Đến ngày",
                        fullWidth: true,
                        sx: {
                          "& .MuiInputBase-root": {
                            borderRadius: "12px",
                            height: 44,
                          },
                        },
                      },
                    }}
                  />
                </Stack>
              </Box>

              {/* Thời gian áp dụng */}
              <Box width={"48%"}>
                <Typography
                  fontSize={13.5}
                  color='#777'
                  fontWeight={500}
                  mb={1}>
                  Thời gian áp dụng
                </Typography>
                <Stack direction='row' alignItems='center' spacing={1.5}>
                  <MobileTimePicker
                    ampm={false}
                    slots={{ openPickerIcon: AccessTime }}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "Từ giờ",
                        fullWidth: true,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <AccessTime
                                sx={{ fontSize: 18, color: "#999" }}
                              />
                            </InputAdornment>
                          ),
                        },
                        sx: {
                          "& .MuiInputBase-root": {
                            borderRadius: "12px",
                            height: 44,
                          },
                        },
                      },
                    }}
                  />
                  <Typography color='#aaa' fontSize={20}>
                    —
                  </Typography>
                  <MobileTimePicker
                    ampm={false}
                    slots={{ openPickerIcon: AccessTime }}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "Đến giờ",
                        fullWidth: true,
                        sx: {
                          "& .MuiInputBase-root": {
                            borderRadius: "12px",
                            height: 44,
                          },
                        },
                      },
                    }}
                  />
                </Stack>
              </Box>
            </Stack>

            {/* Chọn ngày trong tuần */}
            <Box>
              <Typography fontSize={14} color='#333' fontWeight={500} mb={2}>
                Bạn muốn áp dụng thay đổi cho ngày nào trong tuần?
              </Typography>

              {/* Dùng Flex để dễ căn chỉnh, không cần RadioGroup nữa */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "space-between",
                }}>
                {daysOfWeek.map((day) => {
                  const isChecked = selectedDays.includes(day);

                  return (
                    <FormControlLabel
                      key={day}
                      control={
                        <Checkbox
                          size='small'
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDays([...selectedDays, day]);
                            } else {
                              setSelectedDays(
                                selectedDays.filter((d) => d !== day)
                              );
                            }
                          }}
                          sx={{
                            "& .MuiSvgIcon-root": { fontSize: 22 },
                            color: isChecked ? "#66bb6a" : "#ccc",
                            "&.Mui-checked": { color: "#66bb6a" },
                          }}
                        />
                      }
                      label={
                        <Typography fontSize={14} fontWeight={500}>
                          {day}
                        </Typography>
                      }
                      sx={{
                        bgcolor: isChecked ? "#e8f5e9" : "#f9f9f9",
                        borderRadius: "12px",
                        px: 2,
                        py: 1,
                        m: 0,
                        border: isChecked
                          ? "1px solid #a5d6a7"
                          : "1px solid #eee",
                        "& .MuiTypography-root": {
                          fontSize: 14,
                          fontWeight: 500,
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Cập nhật số phòng còn lại */}
            <Box>
              <Typography fontSize={14} color='#333' fontWeight={500} mb={1.5}>
                Cập nhật số phòng còn lại
              </Typography>
              <Stack direction='row' spacing={2}>
                <TextField
                  value={roomCount}
                  onChange={(e) => setRoomCount(e.target.value)}
                  placeholder='Nhập số'
                  size='small'
                  type='number'
                  sx={{
                    flex: 1,
                    "& .MuiInputBase-root": {
                      borderRadius: "12px",
                      height: 44,
                    },
                  }}
                />
                <Button
                  variant='outlined'
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#555",
                    borderColor: "#ddd",
                    px: 4,
                    height: 44,
                  }}>
                  Phòng
                </Button>
              </Stack>
            </Box>

            <Box sx={{ height: 16 }} />

            {/* Nút Hủy và Lưu */}
            <Stack direction='row' spacing={2} mt={3}>
              <Button
                fullWidth
                variant='outlined'
                onClick={onClose}
                sx={{
                  borderRadius: "50px",
                  py: 1.8,
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#777",
                  borderColor: "#ddd",
                  bgcolor: "#f5f5f5",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#eee" },
                }}>
                Hủy
              </Button>
              <Button
                fullWidth
                variant='contained'
                sx={{
                  borderRadius: "50px",
                  py: 1.8,
                  fontSize: "15px",
                  fontWeight: 600,
                  bgcolor: "#8bc34a",
                  "&:hover": { bgcolor: "#7cb342" },
                  color: "white",
                  textTransform: "none",
                  boxShadow: "none",
                }}>
                Lưu thay đổi
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
}
