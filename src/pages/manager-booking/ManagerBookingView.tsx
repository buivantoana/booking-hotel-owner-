import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Pagination,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Menu,
} from "@mui/material";
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  CalendarToday,
  CalendarTodayOutlined,
  ContentCopy,
  PauseCircle,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const statusColors: Record<
  string,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  "Chờ nhận phòng": "primary",
  "Đã nhận phòng": "secondary",
  "Hủy phòng": "error",
  "Không nhận phòng": "error",
  "Chờ khách xác nhận": "warning",
  "Chờ xử lý": "warning",
  "Hoàn thành": "success",
};



export default function ManagerBookingView({
  hotels,
  idHotel,
  setIdHotel,
  bookings,           // ← Thêm
  pagination,         // ← Thêm
  loading,            // ← Thêm
  onPageChange,       // ← Thêm
  fetchBookings
}: {
  hotels: any[];
  idHotel: string | null;
  setIdHotel: (id: string) => void;
  bookings: any[];
  pagination: { page: number; total_pages: number; total: number };
  loading: boolean;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(null);
  const [openNote, setOpenNote] = useState(false);
  const [idBooking, setIdBooking] = useState(null); 
  const [openCancel, setOpenCancel] = useState(false);
  const [openAccepp, setOpenAccepp] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <Typography variant='h5' fontWeight='bold' mb={1}>
          Quản lý đặt phòng
        </Typography>

        {/* Hotel Selector */}
        <FormControl fullWidth sx={{ mb: 3, ml: 1, maxWidth: 300 }}>

          <HotelSelect
            value={idHotel}
            hotelsData={hotels}
            onChange={(id) => {
              setIdHotel(id);
              console.log("ID khách sạn được chọn:", id);
            }}
          />
        </FormControl>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack spacing={4}>
            {/* Label căn chuẩn */}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              mb={4}
              spacing={2}
              alignItems='end'>
              {/* Tìm kiếm */}
              <Box>
                <Typography sx={{ mb: 1.5 }}>Tìm kiếm</Typography>
                <TextField
                  defaultValue='123456'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon sx={{ color: "#999" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: 280,
                    "& .MuiOutlinedInput-root": {
                      height: 40,
                      borderRadius: "24px",
                      border: "2px solid #cddc39",
                      backgroundColor: "#fff",
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography sx={{ mb: 1.5 }}>Loại đặt phòng</Typography>
                <Select
                  displayEmpty
                  defaultValue=''
                  sx={{
                    width: 200,
                    height: 40,
                    borderRadius: "24px",
                    bgcolor: "#fff",
                  }}>
                  <MenuItem value='' disabled>
                    Chọn loại đặt phòng
                  </MenuItem>
                  <MenuItem value='theogio'>Theo giờ</MenuItem>
                  <MenuItem value='quadem'>Qua đêm</MenuItem>
                </Select>
              </Box>

              {/* 2 ô DatePicker – ĐÃ FIX LỖI 100% */}
              <Box>
                <Typography sx={{ mb: 1.5 }}>Thời gian nhận phòng</Typography>
                <Stack direction='row' alignItems='center' spacing={1} sx={{}}>
                  <DatePicker
                    value={fromDate}
                    onChange={setFromDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        InputProps: {
                          sx: {
                            height: 40,
                            borderRadius: "20px",
                            // Input text
                            width: "160px",
                            "& .MuiInputBase-input": {
                              height: "40px",
                              padding: "0 12px",
                              boxSizing: "border-box",
                              borderRadius: "20px",
                            },

                            // Outline
                            "& .MuiOutlinedInput-notchedOutline": {
                              top: 0,
                            },
                          },
                        },

                        // 👉 FIX LABEL BỊ LỆCH
                        InputLabelProps: {
                          sx: {
                            lineHeight: "1", // Giữ độ cao label
                            transform: "translate(14px, 12px) scale(1)", // Vị trí khi chưa focus
                            "&.MuiInputLabel-shrink": {
                              transform: "translate(14px, -8px) scale(0.75)", // Vị trí khi nổi lên
                            },
                          },
                        },
                      },
                    }}
                    // ← Dòng này fix lỗi ngay lập tức
                    format='DD/MM/YYYY'
                  />

                  <Typography sx={{ color: "#999" }}>-</Typography>

                  <DatePicker
                    value={toDate}
                    onChange={setToDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        InputProps: {
                          sx: {
                            height: 40,
                            borderRadius: "20px",
                            // Input text
                            width: "160px",
                            "& .MuiInputBase-input": {
                              height: "40px",
                              padding: "0 12px",
                              boxSizing: "border-box",
                            },

                            // Outline
                            "& .MuiOutlinedInput-notchedOutline": {
                              top: 0,
                            },
                          },
                        },

                        // 👉 FIX LABEL BỊ LỆCH
                        InputLabelProps: {
                          sx: {
                            lineHeight: "1", // Giữ độ cao label
                            transform: "translate(14px, 12px) scale(1)", // Vị trí khi chưa focus
                            "&.MuiInputLabel-shrink": {
                              transform: "translate(14px, -8px) scale(0.75)", // Vị trí khi nổi lên
                            },
                          },
                        },
                      },
                    }}
                    format='DD/MM/YYYY'
                  />
                </Stack>
              </Box>

              {/* Nút */}
              <Stack direction='row' alignItems={"end"} spacing={1}>
                <Button
                  variant='contained'
                  sx={{
                    borderRadius: "24px",
                    bgcolor: "#8bc34a",
                    height: 40,
                    minWidth: 120,
                  }}>
                  Tìm kiếm
                </Button>
                <Button
                  variant='outlined'
                  sx={{
                    borderRadius: "24px",
                    height: 40,
                    minWidth: 120,
                    border: "1px solid rgba(208, 211, 217, 1)",
                    background: "rgba(240, 241, 243, 1)",
                    color: "rgba(208, 211, 217, 1)",
                  }}>
                  Xóa tìm kiếm
                </Button>
              </Stack>
            </Stack>

            {/* Chip */}
            <Stack direction='row' flexWrap='wrap' gap={1.5} mt={3}>
              {[
                { label: "Tất cả", count: 5, active: true },
                { label: "Chờ nhận phòng", count: 2 },
                { label: "Đã nhận phòng", count: 2 },
                { label: "Chờ Hotel Booking xử lý", count: 1 },
                { label: "Đã hủy", count: 1 },
                { label: "Không nhận phòng", count: 1 },
                { label: "Hoàn thành", count: 1 },
                { label: "Chờ khách xác nhận", count: 1 },
              ].map((item) => (
                <Chip
                  key={item.label}
                  label={`${item.label} ${item.count}`}
                  sx={{
                    borderRadius: "18px",
                    height: 36,
                    bgcolor: item.active ? "#8bc34a" : "transparent",
                    color: item.active ? "white" : "#666",
                    border: item.active ? "none" : "1px solid #e0e0e0",
                    fontWeight: item.active ? "bold" : "normal",
                  }}
                />
              ))}
            </Stack>
          </Stack>
          <TableContainer sx={{ mt: 5, width: "100%" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>
                    <strong>Mã đặt phòng</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tổng số tiền thanh toán</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Loại đặt phòng</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Thời gian</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Thời gian nhận phòng</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tình trạng đặt phòng</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Ghi chú</strong>
                  </TableCell>
                  <TableCell align='center'>
                    <strong>Thao tác</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography>Đang tải...</Typography>
                    </TableCell>
                  </TableRow>
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography>Không có dữ liệu đặt phòng</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((row) => {
                    // Format ngày giờ
                    const formatDateTime = (dateString: string) => {
                      return dayjs(dateString).format("DD/MM/YYYY, HH:mm");
                    };

                    const rentTypeLabel =
                      row.rent_type === "hourly"
                        ? "Theo giờ"
                        : row.rent_type === "daily"
                          ? "Qua ngày"
                          : row.rent_type === "overnight"
                            ? "Qua đêm"
                            : "Không xác định";

                    const statusLabel = {
                      pending: "Chờ nhận phòng",
                      confirmed: "Chờ khách xác nhận",
                      checked_in: "Đã nhận phòng",
                      checked_out: "Hoàn thành",
                      cancelled: "Hủy phòng",
                      no_show: "Không nhận phòng",
                    }[row.status] || "Chờ xử lý";

                    const roomName = row.room_types?.[0]?.name || "N/A";

                    return (
                      <TableRow key={row.id} hover>
                        <TableCell
                          sx={{
                            fontWeight: row.code.includes("(G)") ? "bold" : "normal",
                            color: row.code.includes("(G)") ? "#1976d2" : "inherit",
                          }}>
                          {row.code}
                        </TableCell>
                        <TableCell>
                          <div>{row.total_price.toLocaleString()}đ</div>
                          <div style={{ fontSize: "0.875rem", color: "#666" }}>
                            {row.status === "cancelled" ? "Đã hoàn tiền" : "Đã thanh toán"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {rentTypeLabel}
                          <br />
                          <span style={{ color: "#666", fontSize: "0.875rem" }}>
                            {roomName}
                          </span>
                        </TableCell>
                        <TableCell>{formatDateTime(row.created_at)}</TableCell>
                        <TableCell>{formatDateTime(row.check_in)}</TableCell>
                        <TableCell>
                          <Chip
                            label={statusLabel}
                            color={statusColors[statusLabel] || "default"}
                            size="small"
                            sx={{ minWidth: 110 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={row.note || "Không có ghi chú"}>
                            <IconButton size="small">
                              <EditIcon onClick={()=>{
                                setIdBooking(row)
                                setOpenNote(true)
                              }} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <ActionMenu
                            booking={row}
                            setOpenAccepp={setOpenAccepp}
                            setOpenCancel={setOpenCancel}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
            <Pagination
              key={pagination.page} // ← THÊM DÒNG NÀY ĐỂ FORCE RE-RENDER KHI PAGE THAY ĐỔI
              count={pagination.total_pages}
              page={pagination.page}
              onChange={onPageChange}
              siblingCount={1}
              boundaryCount={1}
              color="primary"
              size={isMobile ? "medium" : "large"}
              
            />

          </Stack>
        </Paper>

        {/* Table */}

        {/* Pagination */}

      </Box>
      <NoteModal openNote={openNote} fetchBookings={fetchBookings} idHotel={idHotel} booking={idBooking} onClose={() => setOpenNote(false)} />
      <CancelBookingModal
        openCancel={openCancel}
        onClose={() => setOpenCancel(false)}
      />
      <CheckoutConfirmModal
        openAccepp={openAccepp}
        onClose={() => setOpenAccepp(false)}
      />
    </LocalizationProvider>
  );
}

import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function NoteModal({ openNote, onClose, booking,fetchBookings,idHotel }) {
  const [note, setNote] = useState("");

  // Khi modal mở và có booking, điền sẵn ghi chú hiện tại (nếu có)
  useEffect(() => {
    if (openNote && booking?.note) {
      setNote(booking.note || "");
    } else if (openNote) {
      setNote(""); // Reset nếu không có note
    }
  }, [openNote, booking]);

  if (!booking) {
    return null; // Tránh render khi chưa có booking
  }

  // Format thời gian
  const formatDateTime = (dateString) => {
    return dayjs(dateString).format("HH:mm, DD/MM/YYYY");
  };

  // Map loại đặt phòng
  const rentTypeLabel =
    booking.rent_type === "hourly"
      ? "Theo giờ"
      : booking.rent_type === "daily"
      ? "Qua ngày"
      : booking.rent_type === "overnight"
      ? "Qua đêm"
      : "Không xác định";

  // Map trạng thái để hiển thị chip
  const statusLabel = {
    pending: "Chờ nhận phòng",
    confirmed: "Chờ khách xác nhận",
    checked_in: "Đã nhận phòng",
    checked_out: "Hoàn thành",
    cancelled: "Hủy phòng",
    no_show: "Không nhận phòng",
  }[booking.status] || "Chờ xử lý";

  const statusColor = {
    pending: { bg: "#e3f2fd", color: "#1976d2" },
    confirmed: { bg: "#fff3e0", color: "#ef6c00" },
    checked_in: { bg: "#e8f5e9", color: "#388e3c" },
    checked_out: { bg: "#e8f5e9", color: "#388e3c" },
    cancelled: { bg: "#ffebee", color: "#d32f2f" },
    no_show: { bg: "#ffebee", color: "#d32f2f" },
  }[booking.status] || { bg: "#f5f5f5", color: "#666" };

  const roomName = booking.room_types?.[0]?.name || "N/A";

  const handleNoteBooking = async()=>{
    try {
      let result  = await updateBooking(booking.id,{note:note})
      if(result?.booking_id){
        toast.success(result?.message)
        fetchBookings(idHotel)
      }else{
        toast.success(result?.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog
      open={openNote}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 1, pt: 3, px: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Ghi chú
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 2, pb: 4 }}>
        {/* Mã đặt phòng */}
        <Stack spacing={0.5} mb={3}>
          <Typography color="text.secondary" fontSize="0.875rem">
            Mã đặt phòng:
          </Typography>
          <Typography fontWeight="bold" fontSize="1.1rem">
            {booking.code}
          </Typography>
        </Stack>

        {/* Ô nhập ghi chú */}
        <Stack spacing={1} mb={3}>
          <Typography fontSize="0.875rem" color="text.secondary">
            Nhập nội dung (không bắt buộc)
          </Typography>
          <TextField
            multiline
            rows={4}
            placeholder="Nhập ghi chú..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ alignSelf: "flex-end", mb: 1, mr: 1 }}>
                  <Typography variant="caption" color="text.disabled">
                    {note.length}/300
                  </Typography>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                bgcolor: "#f9f9f9",
                "& textarea": { resize: "none" },
              },
            }}
          />
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Thông tin đặt phòng */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontWeight="bold" color="primary">
            Thông tin đặt phòng
          </Typography>
          <Chip
            label={statusLabel}
            size="small"
            sx={{
              bgcolor: statusColor.bg,
              color: statusColor.color,
              fontWeight: "medium",
              borderRadius: 2,
            }}
          />
        </Box>

        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Loại đặt phòng:</Typography>
            <Typography fontWeight="medium">{rentTypeLabel}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Loại phòng:</Typography>
            <Typography fontWeight="medium">{roomName}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography color="text.secondary">Thời gian:</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTimeIcon fontSize="small" sx={{ color: "#999" }} />
              <Typography fontWeight="medium">
                {formatDateTime(booking.check_in)} - {formatDateTime(booking.check_out)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Nút hành động */}
        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={5}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderRadius: 8,
              px: 4,
              textTransform: "none",
              color: "#666",
              borderColor: "#ddd",
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // TODO: Gọi API lưu ghi chú ở đây
              handleNoteBooking()
              onClose();
            }}
            sx={{
              borderRadius: 8,
              px: 5,
              bgcolor: "#8bc34a",
              color: "white",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(139,195,74,0.4)",
              "&:hover": { bgcolor: "#7cb342" },
              textTransform: "none",
            }}
          >
            Lưu ghi chú
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}


import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LogoutIcon from "@mui/icons-material/Logout"; // Icon cho trả phòng

function ActionMenu({
  booking,
  setOpenCheckIn,     // Mở modal nhận phòng
  setOpenCheckOut,    // Mở modal trả phòng
  setOpenCancel,      // Mở modal hủy
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!booking) return null;

  const status = booking.status;

  // Quyết định hiển thị những action nào
  const showCheckIn = status === "pending";                    // Chờ nhận phòng → cho nhận phòng
  const showCheckOut = status === "checked_in";                // Đã nhận phòng → cho trả phòng
  const showCancel = ["pending", "confirmed"].includes(status); // Chờ xử lý hoặc chờ xác nhận → cho hủy

  // Nếu không có action nào thì không hiển thị nút
  if (!showCheckIn && !showCheckOut && !showCancel) {
    return null; // hoặc return một Typography nhỏ "Không có thao tác"
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        endIcon={<MoreVertIcon />}
        onClick={handleClick}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          borderColor: "rgba(152, 183, 32, 1)",
          color: "rgba(152, 183, 32, 1)",
          fontWeight: 500,
          minWidth: 110,
          "&:hover": { borderColor: "#bbb" },
        }}
      >
        Thao tác
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            mt: 1,
          },
        }}
      >
        {/* Khách nhận phòng - chỉ hiện khi pending */}
        {showCheckIn && (
          <MenuItem
            onClick={() => {
              setOpenCheckIn(true);
              handleClose();
            }}
            sx={{ gap: 1.5, fontSize: 14 }}
          >
            <CheckCircleOutlineIcon fontSize="small" sx={{ color: "#388e3c" }} />
            Khách nhận phòng
          </MenuItem>
        )}

        {/* Khách trả phòng - chỉ hiện khi checked_in */}
        {showCheckOut && (
          <MenuItem
            onClick={() => {
              setOpenCheckOut(true);
              handleClose();
            }}
            sx={{ gap: 1.5, fontSize: 14 }}
          >
            <LogoutIcon fontSize="small" sx={{ color: "#1976d2" }} />
            Khách trả phòng
          </MenuItem>
        )}

        {/* Hủy đặt phòng - chỉ hiện khi pending hoặc confirmed */}
        {showCancel && (
          <MenuItem
            onClick={() => {
              setOpenCancel(true);
              handleClose();
            }}
            sx={{ gap: 1.5, fontSize: 14, color: "#d32f2f" }}
          >
            <HighlightOffIcon fontSize="small" />
            Hủy đặt phòng
          </MenuItem>
        )}
      </Menu>
    </>
  );
}



import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import HotelSelect from "../../components/HotelSelect";
import { updateBooking } from "../../service/booking";
import { toast } from "react-toastify";

function CancelBookingModal({ openCancel, onClose }) {
  const [reason, setReason] = useState("");

  const reasons = [
    "Khách sạn hết phòng",
    "Khách sạn sửa chữa/ tạm thời đóng cửa",
    "Khách sạn muốn dừng hợp tác",
    "Lý do bất khả kháng: Thiên tai/ mất điện / mất nước",
    "Hư hỏng thiết bị, Cơ sở vật chất",
    "Khách sạn cái đặt sai giá phòng",
    "Khách có dấu hiệu vi phạm pháp luật",
  ];

  return (
    <Dialog
      open={openCancel}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        },
      }}>
      {/* Header */}
      <DialogTitle sx={{ pb: 1 }}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'>
          <Typography variant='h6' fontWeight='bold'>
            Hủy đặt phòng
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Thông tin đặt phòng - giống hệt ảnh */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#f9ffe6",
            border: "1px solid #d0e8a0",
            borderRadius: 3,
            p: 2,
            mb: 3,
          }}>
          <Stack spacing={1.5}>
            <Stack direction='row' justifyContent='space-between'>
              <Typography fontSize='0.95rem'>Loại phòng:</Typography>
              <Typography fontWeight='bold' color='#7cb342'>
                Vip123
              </Typography>
            </Stack>
            <Divider sx={{ bgcolor: "#d0e8a0" }} />
            <Stack
              direction='row'
              alignItems='center'
              spacing={1}
              justifyContent='space-between'>
              <Stack direction='row' alignItems='center' spacing={1}>
                <AccessTimeIcon sx={{ fontSize: 18, color: "#999" }} />
                <Typography fontSize='0.95rem'>Theo giờ</Typography>
              </Stack>
              <Typography fontWeight='medium'>
                09:00 - 12:00 ngày 21/11/2025
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Chọn lý do hủy - BẮT BUỘC */}
        <Typography fontWeight='medium' mb={2}>
          Chọn lý do hủy phòng{" "}
          <span style={{ color: "#ef6c00" }}>(bắt buộc)</span>
        </Typography>

        <RadioGroup value={reason} onChange={(e) => setReason(e.target.value)}>
          <Stack spacing={1.5}>
            {reasons.map((item) => (
              <FormControlLabel
                key={item}
                value={item}
                control={
                  <Radio
                    size='small'
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                  />
                }
                label={
                  <Typography fontSize='0.95rem' sx={{ ml: 0.5 }}>
                    {item}
                  </Typography>
                }
                sx={{
                  bgcolor: "#fafafa",
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.8,
                  border: "1px solid #eee",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              />
            ))}
          </Stack>
        </RadioGroup>

        {/* Nút hành động */}
        <Stack direction='row' justifyContent='flex-end' spacing={2} mt={5}>
          <Button
            variant='outlined'
            onClick={onClose}
            sx={{
              borderRadius: 8,
              px: 4,
              textTransform: "none",
              color: "#666",
              borderColor: "#ddd",
            }}>
            Hủy
          </Button>
          <Button
            variant='contained'
            disabled={!reason}
            sx={{
              borderRadius: 8,
              px: 5,
              minWidth: 140,
              bgcolor: "#8bc34a",
              color: "white",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(139,195,74,0.4)",
              "&:hover": { bgcolor: "#7cb342" },
              "&:disabled": { bgcolor: "#c8e6c9" },
              textTransform: "none",
            }}>
            Hủy đặt phòng
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

function CheckoutConfirmModal({ openAccepp, onClose }) {
  return (
    <Dialog
      open={openAccepp}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
          overflow: "hidden",
        },
      }}>
      {/* Header */}
      <DialogTitle sx={{ pb: 1, pt: 3 }}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'>
          <Typography variant='h6' fontWeight='bold'>
            Xác nhận Khách trả phòng
          </Typography>
          <IconButton onClick={onClose} size='small'>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 4 }}>
        {/* Thông tin khách sạn & mã đặt phòng */}
        <Stack spacing={2} mb={3}>
          <Stack direction='row' justifyContent='space-between'>
            <Typography color='text.secondary' fontSize='0.95rem'>
              Khách sạn:
            </Typography>
            <Typography fontWeight='bold'>Khách sạn 123</Typography>
          </Stack>

          <Stack direction='row' justifyContent='space-between'>
            <Typography color='text.secondary' fontSize='0.95rem'>
              Mã đặt phòng:
            </Typography>
            <Typography fontWeight='bold' fontSize='1.1rem'>
              123456
            </Typography>
          </Stack>
        </Stack>

        {/* Khung thông tin phòng - giống hệt ảnh */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#f9ffe6",
            border: "1px solid #d0e8a0",
            borderRadius: 3,
            p: 2.5,
            mb: 4,
          }}>
          <Stack spacing={2}>
            <Stack direction='row' justifyContent='space-between'>
              <Typography fontSize='0.95rem'>Loại phòng:</Typography>
              <Typography fontWeight='bold' color='#7cb342'>
                Vip123
              </Typography>
            </Stack>

            <Divider sx={{ bgcolor: "#d0e8a0" }} />

            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'>
              <Stack direction='row' alignItems='center' spacing={1.5}>
                <CheckCircleOutlineIcon
                  sx={{ color: "#8bc34a", fontSize: 20 }}
                />
                <Typography fontWeight='medium'>Theo giờ</Typography>
              </Stack>

              <Typography fontWeight='medium' textAlign='right'>
                09:00 - 12:00 ngày 21/11/2025
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Nút hành động */}
        <Stack direction='row' justifyContent='flex-end' spacing={2} mt={2}>
          <Button
            variant='outlined'
            onClick={onClose}
            sx={{
              borderRadius: 8,
              px: 4,
              minWidth: 120,
              textTransform: "none",
              color: "#666",
              borderColor: "#ddd",
            }}>
            Hủy
          </Button>

          <Button
            variant='contained'
            startIcon={<CheckCircleOutlineIcon />}
            sx={{
              borderRadius: 8,
              px: 5,
              minWidth: 180,
              bgcolor: "#8bc34a",
              color: "white",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(139,195,74,0.4)",
              "&:hover": { bgcolor: "#7cb342" },
              textTransform: "none",
            }}>
            Khách trả phòng
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
