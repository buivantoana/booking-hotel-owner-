import React, { useState } from "react";
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

const data = [
  {
    id: "123456",
    amount: "160.000đ",
    payment: "Đã thanh toán",
    type: "Theo giờ",
    time: "21/10/2025, 09:00",
    checkin: "21/10/2025, 12:00",
    status: "Chờ nhận phòng",
  },
  {
    id: "123456 (G)",
    amount: "160.000đ",
    payment: "Đã thanh toán",
    type: "Theo giờ",
    time: "21/10/2025, 09:00",
    checkin: "21/10/2025, 12:00",
    status: "Chờ nhận phòng",
  },
  {
    id: "123456",
    amount: "160.000đ",
    payment: "Thanh toán tại KS",
    type: "Theo giờ",
    time: "21/10/2025, 09:00",
    checkin: "21/10/2025, 12:00",
    status: "Đã nhận phòng",
  },
  {
    id: "123456",
    amount: "160.000đ",
    payment: "Đã hoàn tiền",
    type: "Theo giờ",
    time: "21/10/2025, 09:00",
    checkin: "21/10/2025, 12:00",
    status: "Hủy phòng",
  },
  {
    id: "123456",
    amount: "160.000đ",
    payment: "Đã thanh toán",
    type: "Theo giờ",
    time: "21/10/2025, 09:00",
    checkin: "21/10/2025, 12:00",
    status: "Không nhận phòng",
  },
  {
    id: "123456",
    amount: "160.000đ",
    payment: "Chờ thanh toán",
    type: "Theo giờ",
    time: "21/10/2025, 09:00",
    checkin: "21/10/2025, 12:00",
    status: "Chờ khách xác nhận",
  },
  {
    id: "123456",
    amount: "160.000đ",
    payment: "Chờ xử lý",
    type: "Theo giờ",
    time: "21/10/2025, 09:00",
    checkin: "21/10/2025, 12:00",
    status: "Chờ xử lý",
  },
  {
    id: "123456",
    amount: "160.000đ",
    payment: "Đã thanh toán",
    type: "Theo giờ",
    time: "21/10/2025, 09:00",
    checkin: "21/10/2025, 12:00",
    status: "Hoàn thành",
  },
];

export default function ManagerBookingView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(null);
  const [openNote, setOpenNote] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [openAccepp, setOpenAccepp] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header */}
        <Typography variant='h5' fontWeight='bold' mb={3}>
          Quản lý đặt phòng
        </Typography>

        {/* Hotel Selector */}
        <FormControl fullWidth sx={{ mb: 3, maxWidth: 300 }}>
          <InputLabel>Khách sạn</InputLabel>
          <Select
            sx={{
              width: 200,
              height: 40,
              borderRadius: "24px",
              bgcolor: "#fff",
            }}
            defaultValue='123'
            label='Khách sạn'>
            <MenuItem value='123'>Khách sạn 123</MenuItem>
          </Select>
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
                {data.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell
                      sx={{
                        fontWeight: row.id.includes("(G)") ? "bold" : "normal",
                        color: row.id.includes("(G)") ? "#1976d2" : "inherit",
                      }}>
                      {row.id}
                    </TableCell>
                    <TableCell>
                      <div>{row.amount}</div>
                      <div style={{ fontSize: "0.875rem", color: "#666" }}>
                        {row.payment}
                      </div>
                    </TableCell>
                    <TableCell>
                      {row.type}
                      <br />
                      <span style={{ color: "#666", fontSize: "0.875rem" }}>
                        Vip 123
                      </span>
                    </TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.checkin}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={statusColors[row.status]}
                        size='small'
                        sx={{ minWidth: 110 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title='Chỉnh sửa ghi chú'>
                        <IconButton
                          onClick={() => setOpenNote(true)}
                          size='small'>
                          <EditIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align='center'>
                      <ActionMenu
                        setOpenAccepp={setOpenAccepp}
                        setOpenCancel={setOpenCancel}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Table */}

        {/* Pagination */}
        <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
          <Pagination
            count={10}
            defaultPage={1}
            siblingCount={1}
            boundaryCount={1}
          />
        </Stack>
      </Box>
      <NoteModal openNote={openNote} onClose={() => setOpenNote(false)} />
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

function NoteModal({ openNote, onClose }) {
  const [note, setNote] = useState("");

  return (
    <Dialog
      open={openNote}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          overflow: "hidden",
        },
      }}>
      {/* Header */}
      <DialogTitle sx={{ pb: 1, pt: 3, px: 2 }}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'>
          <Typography variant='h6' fontWeight='bold'>
            Ghi chú
          </Typography>
          <IconButton onClick={onClose} size='small'>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 2, pb: 4 }}>
        {/* Mã đặt phòng */}
        <Stack spacing={0.5} mb={3}>
          <Typography color='text.secondary' fontSize='0.875rem'>
            Mã đặt phòng:
          </Typography>
          <Typography fontWeight='bold' fontSize='1.1rem'>
            123456
          </Typography>
        </Stack>

        {/* Ô nhập ghi chú */}
        <Stack spacing={1} mb={3}>
          <Typography fontSize='0.875rem' color='text.secondary'>
            Nhập nội dung (không bắt buộc)
          </Typography>
          <TextField
            multiline
            rows={4}
            placeholder='Nhập ghi chú...'
            value={note}
            onChange={(e) => setNote(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position='end'
                  sx={{ alignSelf: "flex-end", mb: 1, mr: 1 }}>
                  <Typography variant='caption' color='text.disabled'>
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
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}>
          <Typography fontWeight='bold' mb={2} color='primary'>
            Thông tin đặt phòng
          </Typography>
          <Box sx={{}}>
            <Chip
              label='Chờ khách xác nhận'
              size='small'
              sx={{
                bgcolor: "#fff3e0",
                color: "#ef6c00",
                fontWeight: "medium",
                borderRadius: 2,
              }}
            />
          </Box>
        </Box>

        <Stack spacing={2}>
          <Stack direction='row' justifyContent='space-between'>
            <Typography color='text.secondary'>Loại đặt phòng:</Typography>
            <Typography fontWeight='medium'>Theo giờ</Typography>
          </Stack>

          <Stack direction='row' justifyContent='space-between'>
            <Typography color='text.secondary'>Loại phòng:</Typography>
            <Typography fontWeight='medium'>Vip123</Typography>
          </Stack>

          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'>
            <Typography color='text.secondary'>Thời gian:</Typography>
            <Stack direction='row' alignItems='center' spacing={1}>
              <AccessTimeIcon fontSize='small' sx={{ color: "#999" }} />
              <Typography fontWeight='medium'>
                09:00, 19/11/2025 - 11:00, 19/11/2025
              </Typography>
            </Stack>
          </Stack>

          {/* Trạng thái */}
        </Stack>
        <Divider sx={{ my: 3 }} />
        {/* Nút hành động */}
        <Stack direction='row' justifyContent='flex-end' spacing={2} mt={5}>
          <Button
            variant='outlined'
            sx={{
              borderRadius: 8,
              px: 4,
              textTransform: "none",
              color: "#666",
              borderColor: "#ddd",
            }}
            onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant='contained'
            sx={{
              borderRadius: 8,
              px: 5,
              bgcolor: "#8bc34a",
              color: "white",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(139,195,74,0.4)",
              "&:hover": { bgcolor: "#7cb342" },
              textTransform: "none",
            }}>
            Ghi chú
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
function ActionMenu({ setOpenCancel, setOpenAccepp }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant='outlined'
        size='small'
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
        }}>
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
        }}>
        <MenuItem
          onClick={() => setOpenAccepp(true)}
          sx={{ gap: 1.5, fontSize: 14 }}>
          <CheckCircleOutlineIcon fontSize='small' sx={{ color: "#666" }} />
          Khách nhận phòng
        </MenuItem>

        <MenuItem
          onClick={() => setOpenCancel(true)}
          sx={{ gap: 1.5, fontSize: 14, color: "#d32f2f" }}>
          <HighlightOffIcon fontSize='small' />
          Hủy đặt phòng
        </MenuItem>
      </Menu>
    </>
  );
}

import { RadioGroup, FormControlLabel, Radio } from "@mui/material";

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
