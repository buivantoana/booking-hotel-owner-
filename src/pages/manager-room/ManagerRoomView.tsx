import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  useMediaQuery,
  Card,
  Checkbox,
  TextField,
  Stack,
  Chip,
  Paper,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  FormControlLabel,
  DialogContent,
  Dialog,
  useTheme,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import LockIcon from "@mui/icons-material/Lock";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle,
  CalendarToday,
  AccessTime,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker, MobileTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import SimpleDateSearchBar from "../../components/SimpleDateSearchBar";
import HotelSelect from "../../components/HotelSelect";
import { updateInventoryRooms } from "../../service/hotel";
import { toast } from "react-toastify";

dayjs.locale("vi");

const parseVi = (value?: string) => {
  if (!value) return "";

  try {
    const parsed = JSON.parse(value);
    return parsed?.vi || value;
  } catch (e) {
    return value; // không phải JSON
  }
};

export default function ManagerRoomView({
  setActive,
  active,
  setDateRange,
  dateRange,
  loading,
  data,
  hotels,
  idHotel,
  setIdHotel,
  setData,
  rentType,
  getData,
}) {
  const isMobile = useMediaQuery("(max-width:600px)");

  const [openQuickBlock, setOpenQuickBlock] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [action, setAction] = useState("manager");
  const [currentEditSlot, setCurrentEditSlot] = useState(null);
  const tabs = [
    { key: "hourly", label: "Theo giờ" },
    { key: "overnight", label: "Qua đêm" },
    { key: "daily", label: "Theo ngày" },
  ];

  const handleOpenQuickBlock = (slotData) => {
    setCurrentEditSlot(slotData);
    setOpenQuickBlock(true);
  };

  return (
    <>
      {action == "create" && (
        <CreateRoom idHotel={idHotel} setAction={setAction} />
      )}
      {action == "lock" && <LockRoomSetup setAction={setAction} />}
      {action == "manager" && (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'>
            {/* Left section */}
            <Box display='flex' flexDirection='column' gap={0.5}>
              <Typography variant='h5' fontWeight='bold'>
                Danh sách loại phòng
              </Typography>

              <Box display='flex' alignItems='center' gap={1}>
                <HotelSelect
                  value={idHotel}
                  hotelsData={hotels}
                  onChange={(id) => {
                    setIdHotel(id);
                    console.log("ID khách sạn được chọn:", id);
                  }}
                />

                <Box
                  display='flex'
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    getData();
                  }}
                  alignItems='center'
                  gap={0.5}
                  ml={2}>
                  <RefreshIcon sx={{ fontSize: 18, color: "#7CB518" }} />
                  <Typography fontSize={13} color='#7CB518' fontWeight={500}>
                    Nhấn cập nhật dữ liệu
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Right section */}
            <Box display='flex' alignItems='center' gap={2}>
              {/* <Box
                display='flex'
                alignItems='center'
                onClick={() => setAction("lock")}
                gap={0.5}
                sx={{ cursor: "pointer" }}>
                <LockIcon sx={{ fontSize: 18, color: "#7CB518" }} />
                <Typography fontSize={14} color='#7CB518' fontWeight={500}>
                  Khóa phòng
                </Typography>
              </Box> */}

              {/* <Box
                display='flex'
                alignItems='center'
                gap={0.5}
                onClick={() => setAction("create")}
                sx={{ cursor: "pointer" }}>
                <AddCircleOutlineIcon sx={{ fontSize: 20, color: "#7CB518" }} />
                <Typography fontSize={14} color='#7CB518' fontWeight={500}>
                  Tạo thêm loại phòng
                </Typography>
              </Box> */}
            </Box>
          </Box>
          <Card sx={{ mt: 4,padding:{xs:0,md:3} }}>
            <Box
              display={'flex'}
              flexDirection={{xs:"column",md:"row"}}
              alignItems='center'
              gap={{xs:2,md:0}}
              justifyContent='space-between'
              py={2}
              px={isMobile ? 1 : 2}
              sx={{ background: "#fff" }}>
              {/* Tabs */}
              <Box display='flex' alignItems='center' gap={3}>
                {tabs
                  .filter((item) => rentType.includes(item.key))
                  .map((t) => (
                    <Box
                      key={t.key}
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        setData([]);
                        setActive(t.key);
                      }}>
                      <Typography
                        fontSize={17}
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
              <SimpleDateSearchBar value={dateRange} onChange={setDateRange} />
            </Box>
            <Box py={3}>
              {active == "hourly" && data?.room_types?.length > 0 && (
                <>
                  {data?.room_types?.map((item) => {
                    return (
                      <RoomScheduleTableHourly
                        handleOpenQuickBlock={handleOpenQuickBlock}
                        handleOpenEdit={() => setOpenEdit(true)}
                        data={{
                          ...item,
                          end_time: data.end_time,
                          start_time: data.start_time,
                          hotel_id: data?.hotel_id,
                        }}
                      />
                    );
                  })}
                </>
              )}
              {active == "daily" && data?.room_types?.length > 0 && (
                <>
                  {data?.room_types?.map((item) => {
                    return (
                      <RoomScheduleTableDaily
                        handleOpenQuickBlock={handleOpenQuickBlock}
                        handleOpenEdit={() => setOpenEdit(true)}
                        data={{
                          ...item,
                          end_time: data.end_time,
                          start_time: data.start_time,
                          hotel_id: data?.hotel_id,
                        }}
                      />
                    );
                  })}
                </>
              )}
              {active == "overnight" && data?.room_types?.length > 0 && (
                <>
                  {data?.room_types?.map((item) => {
                    return (
                      <RoomScheduleTableOvernight
                        handleOpenQuickBlock={handleOpenQuickBlock}
                        handleOpenEdit={() => setOpenEdit(true)}
                        data={{
                          ...item,
                          end_time: data.end_time,
                          start_time: data.start_time,
                          hotel_id: data?.hotel_id,
                        }}
                      />
                    );
                  })}
                </>
              )}
            </Box>
          </Card>
          <QuickBlockDialog
            openQuickBlock={openQuickBlock}
            onClose={() => setOpenQuickBlock(false)}
            currentSlot={currentEditSlot}
            idHotel={idHotel}
            onSuccess={getData}
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
function QuickBlockDialog({
  openQuickBlock,
  onClose,
  currentSlot,
  idHotel,
  onSuccess,
}) {
  const [blockType, setBlockType] = useState("hourly");
  const isMobile = useMediaQuery("(max-width:600px)");
  const [dateRange, setDateRange] = useState({
    checkIn: dayjs(),
    checkOut: dayjs().add(1, "day"),
  });
  const [startTime, setStartTime] = useState(dayjs().hour(15).minute(0));
  const [endTime, setEndTime] = useState(dayjs().hour(16).minute(0));
  const [availableRooms, setAvailableRooms] = useState(0);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  console.log("AAAAA currentSlot", currentSlot);
  // Đồng bộ dữ liệu khi currentSlot thay đổi (mỗi lần mở dialog với slot mới)
  useEffect(() => {
    if (!currentSlot || !openQuickBlock) {
      // Reset về mặc định nếu không có slot hoặc dialog đóng
      setBlockType("hourly");
      setDateRange({
        checkIn: dayjs(),
        checkOut: dayjs().add(1, "day"),
      });
      setStartTime(dayjs().hour(15).minute(0));
      setEndTime(dayjs().hour(16).minute(0));
      setAvailableRooms(0);
      setReason("");
      setNote("");
      return;
    }

    // Fill dữ liệu từ currentSlot
    setBlockType(currentSlot.rent_type || "hourly");
    setAvailableRooms(currentSlot.available_rooms ?? 0);
    setReason(currentSlot.reason || "");
    setNote(currentSlot.note || "");

    const startDayjs = dayjs(currentSlot.start_time);
    const endDayjs = dayjs(currentSlot.end_time);

    // Set ngày
    setDateRange({
      checkIn: startDayjs,
      checkOut: endDayjs,
    });

    // Nếu là hourly → set giờ chính xác
    if (currentSlot.rent_type === "hourly") {
      setStartTime(startDayjs);
      setEndTime(endDayjs);
    } else {
      // Daily / Overnight → set giờ mặc định (không dùng đến nhưng giữ cho an toàn)
      setStartTime(dayjs().hour(0).minute(0));
      setEndTime(dayjs().hour(23).minute(59));
    }
  }, [currentSlot, openQuickBlock]);

  const isHourly = blockType === "hourly"; // Dựa trên blockType hiện tại (người dùng có thể đổi)

  const getRentLabel = (type: string) => {
    switch (type) {
      case "hourly":
        return "Theo giờ";
      case "overnight":
        return "Qua đêm";
      case "daily":
        return "Theo ngày";
      default:
        return "";
    }
  };

  const handleSubmit = async () => {
    if (!currentSlot?.room_type_id) {
      alert("Thiếu thông tin loại phòng!");
      return;
    }

    let startISO = dateRange.checkIn.format("YYYY-MM-DD");
    let endISO = dateRange.checkOut.format("YYYY-MM-DD");

    if (isHourly) {
      startISO += `T${startTime.format("HH:mm")}:00+07:00`;
      endISO += `T${endTime.format("HH:mm")}:00+07:00`;
    } else {
      startISO += "T00:00:00+07:00";
      endISO += "T23:59:59+07:00";
    }

    const body = {
      room_type_id: currentSlot.room_type_id,
      rent_type: blockType,
      start_time: startISO,
      end_time: endISO,
      available_rooms: availableRooms >= 0 ? availableRooms : 0,
      reason: reason || undefined,
      note: note || undefined,
    };

    console.log("Gửi API:", body); // Debug

    try {
      const result = await updateInventoryRooms(idHotel, body);
      if (result?.status == "created") {
        toast.success("Khóa phòng thành công");
        onSuccess();
        onClose();
      } else {
        toast.error("Khóa phòng thất bại");
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi kết nối mạng!");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='vi'>
      <Dialog
        open={openQuickBlock}
        maxWidth='sm'
        fullWidth
        fullScreen={window.innerWidth < 600}
        onClose={onClose}>
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
            Khóa nhanh / Cập nhật số phòng
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 12, top: 12 }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ bgcolor: "#fff", p: isMobile?1:3 }}>
          <Stack spacing={3.5}>
            {/* Loại đặt phòng */}
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'>
              <Typography fontSize={15} color='#888' fontWeight={500}>
                Loại đặt phòng
              </Typography>
              <FormControl sx={{ width: "60%" }}>
                <Select
                  value={blockType}
                  onChange={(e) => setBlockType(e.target.value as string)}
                  size='small'
                  sx={{ borderRadius: "32px", height: 40 }}>
                  <MenuItem value='hourly'>Theo giờ</MenuItem>
                  <MenuItem value='overnight'>Qua đêm</MenuItem>
                  <MenuItem value='daily'>Theo ngày</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Khoảng thời gian */}
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'>
              <Typography fontSize={15} color='#888' fontWeight={500}>
                Khoảng thời gian
              </Typography>
              <SimpleDateSearchBar value={dateRange} onChange={setDateRange} />
            </Box>

            {/* Khung giờ - CHỈ HIỆN khi blockType là hourly */}
            {isHourly && (
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'>
                <Typography fontSize={15} color='#888' fontWeight={500}>
                  Khung giờ
                </Typography>
                <Stack
                  direction='row'
                  alignItems='center'
                  width={isMobile?"70%":'60%'}
                  spacing={2}>
                  <MobileTimePicker
                    value={startTime}
                    onChange={setStartTime}
                    ampm={false}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          "& .MuiInputBase-root": { borderRadius: "32px" },
                        },
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
                    onChange={setEndTime}
                    ampm={false}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          "& .MuiInputBase-root": { borderRadius: "32px" },
                        },
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
            )}

            {/* Số phòng còn lại */}
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'>
              <Typography fontSize={15} color='#888' fontWeight={500}>
                Số phòng còn lại
              </Typography>
              <TextField
                value={availableRooms}
                onChange={(e) =>
                  setAvailableRooms(parseInt(e.target.value) || 0)
                }
                type='number'
                inputProps={{ min: 0 }}
                size='small'
                sx={{ width: 100 }}
              />
            </Box>

            {/* Lý do */}
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'>
              <Typography fontSize={15} color='#888' fontWeight={500}>
                Lý do
              </Typography>
              <FormControl sx={{ width: "60%" }}>
                <Select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  displayEmpty
                  size='small'
                  sx={{ borderRadius: "32px", height: 40 }}>
                  <MenuItem value=''>
                    <em>Chọn lý do</em>
                  </MenuItem>
                  <MenuItem value='staff_shortage'>Thiếu nhân viên</MenuItem>
                  <MenuItem value='maintenance'>Bảo trì</MenuItem>
                  <MenuItem value='cleaning'>Dọn dẹp</MenuItem>
                  <MenuItem value='other'>Khác</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Ghi chú */}
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'>
              <Typography fontSize={15} color='#888' fontWeight={500}>
                Ghi chú
              </Typography>
              <TextField
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder='Ghi chú thêm...'
                size='small'
                sx={{ width: "60%" }}
              />
            </Box>

            {/* Preview */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "#f5f8e9",
                border: "1px solid #c8e6c9",
                borderRadius: "12px",
              }}>
              <Stack direction='row' alignItems='flex-start' gap={1.5}>
                <CheckCircle sx={{ fontSize: 18, color: "#66bb6a", mt: 0.3 }} />
                <Box>
                  <Typography fontSize={13} color='#33691e' lineHeight={1.5}>
                    Cập nhật tồn kho: <strong>{availableRooms} phòng</strong>{" "}
                    còn lại cho đặt phòng{" "}
                    <strong>{getRentLabel(blockType)}</strong>
                  </Typography>
                  {isHourly && (
                    <Typography
                      fontSize={13}
                      color='#1b5e20'
                      mt={1}
                      fontWeight={500}>
                      {startTime?.format("HH:mm")} - {endTime?.format("HH:mm")} từ{" "}
                      {dateRange?.checkIn?.format("DD/MM/YYYY")} đến{" "}
                      {dateRange?.checkOut?.format("DD/MM/YYYY")}
                    </Typography>
                  )}
                  {!isHourly && (
                    <Typography
                      fontSize={13}
                      color='#1b5e20'
                      mt={1}
                      fontWeight={500}>
                      Toàn ngày từ {dateRange?.checkIn?.format("DD/MM/YYYY")} đến{" "}
                      {dateRange?.checkOut?.format("DD/MM/YYYY")}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Paper>

            {/* Nút */}
            <Stack direction='row' spacing={2} mt={2}>
              <Button
                variant='outlined'
                onClick={onClose}
                fullWidth
                sx={{ borderRadius: "50px", py:isMobile?1: 1.5 }}>
                Hủy
              </Button>
              <Button
                variant='contained'
                onClick={handleSubmit}
                fullWidth
                sx={{ borderRadius: "50px", bgcolor: "#98B720", py:isMobile?1: 1.5 }}>
                Xác nhận cập nhật
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
}
// Nhóm slot theo ngày + giữ nguyên thứ tự giờ
const groupSlotsByDate = (slots: Slot[]) => {
  const groups: { [key: string]: Slot[] } = {};

  slots?.forEach((slot) => {
    const dateKey = slot.from.split("T")[0]; // "2025-12-08"
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(slot);
  });

  return Object.entries(groups)
    .map(([date, slots]) => {
      const dateObj = new Date(date);
      return {
        date,
        dayOfMonth: format(dateObj, "d"),
        dayName: format(dateObj, "EEEE", { locale: vi })
          .replace("Chủ nhật", "CN")
          .replace("Thứ ", "thứ ")
          .toLowerCase(),
        slots: slots.sort((a, b) => a.hour.localeCompare(b.hour)), // đảm bảo giờ tăng dần
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
};

function RoomScheduleTableHourly({
  handleOpenQuickBlock,
  handleOpenEdit,
  data,
}: RoomScheduleTableHourlyProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // md ~ 900px
  const navigate = useNavigate();

  const dayGroups = groupSlotsByDate(data?.slots);

  const [editedValues, setEditedValues] = useState<{ [key: number]: number }>({});

  // Desktop version - giữ nguyên như cũ
  const renderDesktop = () => {
    const totalSlots = data?.slots?.length || 0;
    const columnWidth = `${100 / totalSlots}%`;

    return (
      <Box p={2} bgcolor="#fff">
        <Box
          sx={{
            overflowX: "auto",
            overflowY: "hidden",
            "&::-webkit-scrollbar": { height: 10 },
            "&::-webkit-scrollbar-thumb": { background: "#aaa", borderRadius: 5 },
            border: "1px solid #ccc",
          }}
        >
          <Box minWidth="fit-content">
            {/* HEADER */}
            <Box display="flex">
              {/* Cột trái cố định */}
              <Box
                width="280px"
                flexShrink={0}
                bgcolor="white"
                position="sticky"
                left={0}
                zIndex={10}
                borderRight="2px solid #ddd"
                borderBottom="2px solid #ddd"
              />

              {/* Header phải */}
              <Box flex={1}>
                <Box
                  textAlign="start"
                  py={1.5}
                  px={2}
                  borderBottom="1px solid #eee"
                  bgcolor="#f9f9f9"
                >
                  <Typography fontWeight={600} fontSize={16}>
                    {format(new Date(data?.start_time), "MMMM yyyy", { locale: vi })}
                  </Typography>
                </Box>

                {/* Ngày */}
                <Box borderBottom="1px solid #ddd" bgcolor="white">
                  <Box display="flex">
                    {dayGroups?.map((g) => {
                      const w = (g?.slots?.length / totalSlots) * 100;
                      return (
                        <Box
                          key={g.date}
                          width={`${w}%`}
                          minWidth={`${g.slots.length * 80}px`}
                          display="flex"
                          justifyContent="start"
                          py={2}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: "#98b720",
                              color: "white",
                              fontWeight: 600,
                              minWidth: "140px",
                              height: "40px",
                              fontSize: "15px",
                              borderRadius: "20px",
                              boxShadow: "0 4px 15px rgba(152,183,32,0.4)",
                              "&:hover": { bgcolor: "#80a61a" },
                            }}
                          >
                            {g.dayOfMonth} {g.dayName}
                          </Button>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                {/* Giờ */}
                <Box display="flex" borderBottom="2px solid #ddd" bgcolor="#f5f5f5">
                  {data?.slots?.map((s, i) => (
                    <Box
                      key={i}
                      width={columnWidth}
                      minWidth="150px"
                      py={2}
                      textAlign="center"
                      borderRight="1px solid #eee"
                    >
                      <Typography fontWeight={600} fontSize={15}>
                        {s.hour}
                      </Typography>
                      <Typography fontSize={11} color="#888">
                        {format(new Date(s.from), "dd/MM")}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Rows */}
            {[
              { label: parseVi(data?.name), isName: true },
              {
                label: "Tình trạng phòng",
                action: "Khóa nhanh",
                onClick: () => handleOpenQuickBlock({ room_type_id: data?.room_type_id }),
                isStatus: true,
              },
              { label: "Số phòng đặt", isBooked: true },
              {
                label: "Số phòng còn lại",
                onClick: handleOpenEdit,
                isRemaining: true,
              },
            ].map((row, idx) => (
              <Box key={idx} display="flex">
                <Box
                  width="280px"
                  flexShrink={0}
                  bgcolor={idx === 0 ? "white" : "#fafafa"}
                  position="sticky"
                  left={0}
                  zIndex={10}
                  borderRight="2px solid #ddd"
                  borderBottom="1px solid #ddd"
                >
                  <Box px={3} py={2} display="flex" justifyContent="space-between" alignItems="center">
                    {row.isName ? (
                      <>
                        <Typography fontWeight={700} fontSize={18} display="flex" alignItems="center" gap={1}>
                          {row.label} <KeyboardArrowUpIcon />
                        </Typography>
                        <Typography
                          onClick={() =>
                            navigate(`/info-hotel?hotel_id=${data?.hotel_id}&room_id=${data?.room_type_id}`)
                          }
                          color="#98b720"
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          sx={{ cursor: "pointer" }}
                        >
                          Xem <LaunchIcon fontSize="small" />
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography fontWeight={500}>{row.label}</Typography>
                        {row.action && (
                          <Typography
                            onClick={row.onClick}
                            sx={{ cursor: "pointer", color: "#98b720", fontWeight: 600 }}
                          >
                            {row.action}
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                </Box>

                <Box flex={1} display="flex">
                  {data?.slots?.map((slot, i) => (
                    <Box
                      key={i}
                      width={columnWidth}
                      minWidth="150px"
                      borderRight="1px solid #eee"
                      borderBottom="1px solid #eee"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      py={1}
                    >
                      {row.isStatus && (
                        <Box
                          px={2}
                          py={1}
                          borderRadius="50px"
                          fontSize={13}
                          fontWeight={500}
                          bgcolor={slot.remaining_rooms > 0 ? "#eaf5ed" : "#ffebee"}
                          color={slot.remaining_rooms > 0 ? "#089408" : "#d32f2f"}
                        >
                          {slot.remaining_rooms > 0 ? "Còn phòng" : "Hết phòng"}
                        </Box>
                      )}
                      {row.isBooked && (
                        <Typography fontWeight={600} color="#333">
                          {slot.booked_rooms}
                        </Typography>
                      )}
                      {row.isRemaining && (
                        <TextField
                          value={editedValues[i] ?? slot.remaining_rooms}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditedValues((prev) => ({
                              ...prev,
                              [i]: val === "" ? undefined : parseInt(val, 10),
                            }));
                          }}
                          onBlur={(e) => {
                            const newVal = parseInt(e.target.value, 10);
                            if (!isNaN(newVal) && newVal !== slot.remaining_rooms) {
                              handleOpenQuickBlock({
                                room_type_id: data.room_type_id,
                                rent_type: "hourly",
                                start_time: slot.from,
                                end_time: slot.to || slot.from,
                                available_rooms: newVal,
                                reason: "staff_shortage",
                                note: "Thiếu nhân viên dọn phòng",
                              });
                            }
                          }}
                          type="number"
                          size="small"
                          inputProps={{ min: 0, style: { textAlign: "center", fontWeight: 600 } }}
                          sx={{ width: 60 }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}

            {/* Giá */}
            {[
              {
                label: "Giá phòng/2h đầu",
                value: `${data?.price_hourly?.toLocaleString("vi-VN")}đ`,
                bg: "#fff3e9",
                color: "#e65e00",
              },
              {
                label: "Giá 1 giờ thêm",
                value: `${data?.price_hourly_increment?.toLocaleString("vi-VN")}đ`,
                bg: "#eef1ff",
                color: "#4e6aff",
              },
            ].map((p) => (
              <Box key={p.label} display="flex">
                <Box
                  width="280px"
                  flexShrink={0}
                  bgcolor="#f8f9fa"
                  position="sticky"
                  borderBottom="1px solid #ddd"
                  left={0}
                  zIndex={10}
                  borderRight="2px solid #ddd"
                >
                  <Box px={3} py={2}>
                    <Typography fontWeight={500}>{p.label}</Typography>
                  </Box>
                </Box>
                <Box flex={1} display="flex" alignItems="center" pl={4}>
                  <Box
                    bgcolor={p.bg}
                    color={p.color}
                    px={4}
                    py={1.5}
                    borderRadius="50px"
                    fontWeight={600}
                    fontSize={15}
                  >
                    {p.value}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  // Mobile version - dạng card theo ngày
  const renderMobile = () => {
    return (
      <Box p={2} bgcolor="#fff">
        {/* Tháng */}
        <Box
          textAlign="center"
          py={2}
          bgcolor="#f9f9f9"
          borderRadius="12px"
          mb={3}
        >
          <Typography variant="h6" fontWeight={700}>
            {format(new Date(data?.start_time), "MMMM yyyy", { locale: vi })}
          </Typography>
        </Box>

        {dayGroups?.map((group) => (
          <Box
            key={group.date}
            bgcolor="white"
            borderRadius="12px"
            boxShadow="0 2px 12px rgba(0,0,0,0.08)"
            mb={3}
            overflow="hidden"
          >
            {/* Header ngày */}
            <Box bgcolor="#98b720" color="white" py={2} px={3}>
              <Typography variant="h6" fontWeight={700}>
                {group.dayOfMonth} {group.dayName}
              </Typography>
            </Box>

            <Divider />

            {/* Slots theo giờ */}
            {group.slots?.map((slot, i) => (
              <Box key={i} p={2} borderBottom="1px solid #eee">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                  <Typography fontWeight={600} fontSize={16}>
                    {slot.hour} • {format(new Date(slot.from), "dd/MM")}
                  </Typography>

                  {/* Tình trạng phòng */}
                  <Box
                    px={2}
                    py={0.8}
                    borderRadius="50px"
                    fontSize={13}
                    fontWeight={600}
                    bgcolor={slot.remaining_rooms > 0 ? "#eaf5ed" : "#ffebee"}
                    color={slot.remaining_rooms > 0 ? "#089408" : "#d32f2f"}
                  >
                    {slot.remaining_rooms > 0 ? "Còn phòng" : "Hết phòng"}
                  </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1.5}>
                  <Typography color="text.secondary">Số phòng đặt:</Typography>
                  <Typography fontWeight={600}>{slot.booked_rooms}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography color="text.secondary">Còn lại:</Typography>
                  <TextField
                    value={editedValues[i] ?? slot.remaining_rooms}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditedValues((prev) => ({
                        ...prev,
                        [i]: val === "" ? undefined : parseInt(val, 10),
                      }));
                    }}
                    onBlur={(e) => {
                      const newVal = parseInt(e.target.value, 10);
                      if (!isNaN(newVal) && newVal !== slot.remaining_rooms) {
                        handleOpenQuickBlock({
                          room_type_id: data.room_type_id,
                          rent_type: "hourly",
                          start_time: slot.from,
                          end_time: slot.to || slot.from,
                          available_rooms: newVal,
                          reason: "staff_shortage",
                          note: "Thiếu nhân viên dọn phòng",
                        });
                      }
                    }}
                    type="number"
                    size="small"
                    inputProps={{ min: 0, style: { textAlign: "center" } }}
                    sx={{ width: 80 }}
                  />
                </Box>

                {/* Nút Khóa nhanh */}
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  size="small"
                  onClick={() =>
                    handleOpenQuickBlock({ room_type_id: data?.room_type_id })
                  }
                >
                  Khóa nhanh khung giờ này
                </Button>
              </Box>
            ))}

            {/* Thông tin phòng */}
            <Box p={3} bgcolor="#fafafa">
              <Typography fontWeight={700} mb={1}>
                {parseVi(data?.name)}
              </Typography>

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Giá phòng/2h đầu:</Typography>
                <Typography fontWeight={600} color="#e65e00">
                  {data?.price_hourly?.toLocaleString("vi-VN")}đ
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography>Giá 1 giờ thêm:</Typography>
                <Typography fontWeight={600} color="#4e6aff">
                  {data?.price_hourly_increment?.toLocaleString("vi-VN")}đ
                </Typography>
              </Box>
            </Box>

            {/* Action */}
            <Box p={2} display="flex" gap={2}>
              <Button
                variant="outlined"
                color="success"
                fullWidth
                onClick={handleOpenEdit}
              >
                Chỉnh sửa
              </Button>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() =>
                  navigate(`/info-hotel?hotel_id=${data?.hotel_id}&room_id=${data?.room_type_id}`)
                }
              >
                Xem chi tiết
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  return isMobile ? renderMobile() : renderDesktop();
}

function RoomScheduleTableDaily({
  handleOpenQuickBlock,
  handleOpenEdit,
  data,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // ~900px
  const navigate = useNavigate();

  const dailySlots = data?.slots || [];
  const [editedValues, setEditedValues] = useState<{ [key: number]: number }>({});

  // Desktop version - giữ nguyên như cũ
  const renderDesktop = () => {
    const totalDays = dailySlots?.length || 0;
    const columnWidth = `${100 / totalDays}%`;

    return (
      <Box p={2} bgcolor="#fff">
        <Box
          sx={{
            overflowX: "auto",
            overflowY: "hidden",
            "&::-webkit-scrollbar": { height: 10 },
            "&::-webkit-scrollbar-thumb": { background: "#aaa", borderRadius: 5 },
            border: "1px solid #ccc",
          }}
        >
          <Box minWidth="fit-content">
            {/* HEADER */}
            <Box display="flex">
              <Box
                width="280px"
                flexShrink={0}
                bgcolor="white"
                position="sticky"
                left={0}
                zIndex={10}
                borderRight="2px solid #ddd"
                borderBottom="2px solid #ddd"
              />

              <Box flex={1}>
                <Box
                  textAlign="start"
                  py={1.5}
                  px={2}
                  borderBottom="1px solid #eee"
                  bgcolor="#f9f9f9"
                >
                  <Typography fontWeight={600} fontSize={16}>
                    {format(new Date(data.start_time), "MMMM yyyy", { locale: vi })}
                  </Typography>
                </Box>

                <Box display="flex" borderBottom="2px solid #ddd" bgcolor="white">
                  {dailySlots?.map((slot) => {
                    const dateObj = new Date(slot.date);
                    const dayNum = format(dateObj, "dd");
                    const dayName = format(dateObj, "EEEE", { locale: vi })
                      .replace("Chủ nhật", "CN")
                      .replace("Thứ ", "thứ ")
                      .toLowerCase();

                    return (
                      <Box
                        key={slot.date}
                        width={columnWidth}
                        minWidth="150px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        py={2}
                        borderRight="1px solid #eee"
                      >
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#98b720",
                            color: "white",
                            fontWeight: 600,
                            minWidth: "140px",
                            height: "40px",
                            fontSize: "15px",
                            borderRadius: "20px",
                            boxShadow: "0 4px 15px rgba(152,183,32,0.4)",
                            "&:hover": { bgcolor: "#80a61a" },
                          }}
                        >
                          {dayNum} {dayName}
                        </Button>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            {/* Rows */}
            {[
              { label: parseVi(data?.name), isName: true },
              {
                label: "Tình trạng phòng",
                action: "Khóa nhanh",
                onClick: () => handleOpenQuickBlock({ room_type_id: data?.room_type_id, rent_type: "daily" }),
                isStatus: true,
              },
              { label: "Số phòng đặt", isBooked: true },
              {
                label: "Số phòng còn lại",
                onClick: handleOpenEdit,
                isRemaining: true,
              },
            ].map((row, idx) => (
              <Box key={idx} display="flex" borderBottom="1px solid #eee">
                <Box
                  width="280px"
                  flexShrink={0}
                  bgcolor={idx === 0 ? "white" : "#fafafa"}
                  position="sticky"
                  left={0}
                  zIndex={10}
                  borderRight="2px solid #ddd"
                  borderBottom="1px solid #ddd"
                >
                  <Box px={3} py={2} display="flex" justifyContent="space-between" alignItems="center">
                    {row.isName ? (
                      <>
                        <Typography fontWeight={700} fontSize={18} display="flex" alignItems="center" gap={1}>
                          {row.label} <KeyboardArrowUpIcon />
                        </Typography>
                        <Typography
                          onClick={() =>
                            navigate(`/info-hotel?hotel_id=${data?.hotel_id}&room_id=${data?.room_type_id}`)
                          }
                          color="#98b720"
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          sx={{ cursor: "pointer" }}
                        >
                          Xem <LaunchIcon fontSize="small" />
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography fontWeight={500}>{row.label}</Typography>
                        {row.action && (
                          <Typography
                            onClick={row.onClick}
                            sx={{ cursor: "pointer", color: "#98b720", fontWeight: 600 }}
                          >
                            {row.action}
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                </Box>

                <Box flex={1} display="flex">
                  {dailySlots?.map((slot, i) => (
                    <Box
                      key={i}
                      width={columnWidth}
                      minWidth="150px"
                      borderRight="1px solid #eee"
                      borderBottom="1px solid #eee"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      py={2}
                    >
                      {row.isStatus && (
                        <Box
                          px={2}
                          py={1}
                          borderRadius="50px"
                          fontSize={13}
                          fontWeight={500}
                          bgcolor={slot.remaining_rooms > 0 ? "#eaf5ed" : "#ffebee"}
                          color={slot.remaining_rooms > 0 ? "#089408" : "#d32f2f"}
                        >
                          {slot.remaining_rooms > 0 ? "Còn phòng" : "Hết phòng"}
                        </Box>
                      )}
                      {row.isBooked && (
                        <Typography fontWeight={600} color="#333">
                          {slot.booked_rooms}
                        </Typography>
                      )}
                      {row.isRemaining && (
                        <TextField
                          value={editedValues[i] ?? slot.remaining_rooms}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditedValues((prev) => ({
                              ...prev,
                              [i]: val === "" ? undefined : parseInt(val, 10),
                            }));
                          }}
                          onBlur={(e) => {
                            const newVal = parseInt(e.target.value, 10);
                            if (!isNaN(newVal) && newVal !== slot.remaining_rooms) {
                              handleOpenQuickBlock({
                                room_type_id: data.room_type_id,
                                rent_type: "daily",
                                start_time: slot.from,
                                end_time: slot.to || slot.from,
                                available_rooms: newVal,
                                reason: "staff_shortage",
                                note: "Thiếu nhân viên dọn phòng",
                              });
                            }
                          }}
                          type="number"
                          size="small"
                          inputProps={{ min: 0, style: { textAlign: "center", fontWeight: 600 } }}
                          sx={{ width: 60 }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}

            {/* Giá */}
            {[
              {
                label: "Giá phòng/đêm",
                value: `${data?.price_daily?.toLocaleString("vi-VN")}đ`,
                bg: "#fff3e9",
                color: "#e65e00",
              },
            ].map((p) => (
              <Box key={p.label} display="flex">
                <Box
                  width="280px"
                  flexShrink={0}
                  bgcolor="#f8f9fa"
                  position="sticky"
                  left={0}
                  zIndex={10}
                  borderRight="2px solid #ddd"
                  borderBottom="1px solid #ddd"
                >
                  <Box px={3} py={2}>
                    <Typography fontWeight={500}>{p.label}</Typography>
                  </Box>
                </Box>
                <Box flex={1} display="flex" alignItems="center" pl={4}>
                  <Box
                    bgcolor={p.bg}
                    color={p.color}
                    px={4}
                    py={1.5}
                    borderRadius="50px"
                    fontWeight={600}
                    fontSize={15}
                  >
                    {p.value}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  // Mobile version - card theo ngày
  const renderMobile = () => {
    return (
      <Box p={2} bgcolor="#fff">
        {/* Tháng */}
        <Box
          textAlign="center"
          py={2}
          bgcolor="#f9f9f9"
          borderRadius="12px"
          mb={3}
        >
          <Typography variant="h6" fontWeight={700}>
            {format(new Date(data.start_time), "MMMM yyyy", { locale: vi })}
          </Typography>
        </Box>

        {dailySlots?.map((slot, index) => {
          const dateObj = new Date(slot.date);
          const dayNum = format(dateObj, "dd");
          const dayName = format(dateObj, "EEEE", { locale: vi })
            .replace("Chủ nhật", "CN")
            .replace("Thứ ", "thứ ")
            .toLowerCase();

          return (
            <Box
              key={slot.date}
              bgcolor="white"
              borderRadius="12px"
              boxShadow="0 2px 12px rgba(0,0,0,0.08)"
              mb={3}
              overflow="hidden"
            >
              {/* Header ngày */}
              <Box bgcolor="#98b720" color="white" py={2} px={3}>
                <Typography variant="h6" fontWeight={700}>
                  {dayNum} {dayName}
                </Typography>
              </Box>

              <Divider />

              {/* Thông tin */}
              <Box p={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography fontWeight={600} fontSize={16}>
                    Tình trạng phòng
                  </Typography>
                  <Box
                    px={2}
                    py={0.8}
                    borderRadius="50px"
                    fontSize={13}
                    fontWeight={600}
                    bgcolor={slot.remaining_rooms > 0 ? "#eaf5ed" : "#ffebee"}
                    color={slot.remaining_rooms > 0 ? "#089408" : "#d32f2f"}
                  >
                    {slot.remaining_rooms > 0 ? "Còn phòng" : "Hết phòng"}
                  </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1.5}>
                  <Typography color="text.secondary">Số phòng đặt:</Typography>
                  <Typography fontWeight={600}>{slot.booked_rooms}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography color="text.secondary">Còn lại:</Typography>
                  <TextField
                    value={editedValues[index] ?? slot.remaining_rooms}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditedValues((prev) => ({
                        ...prev,
                        [index]: val === "" ? undefined : parseInt(val, 10),
                      }));
                    }}
                    onBlur={(e) => {
                      const newVal = parseInt(e.target.value, 10);
                      if (!isNaN(newVal) && newVal !== slot.remaining_rooms) {
                        handleOpenQuickBlock({
                          room_type_id: data.room_type_id,
                          rent_type: "daily",
                          start_time: slot.from,
                          end_time: slot.to || slot.from,
                          available_rooms: newVal,
                          reason: "staff_shortage",
                          note: "Thiếu nhân viên dọn phòng",
                        });
                      }
                    }}
                    type="number"
                    size="small"
                    inputProps={{ min: 0, style: { textAlign: "center" } }}
                    sx={{ width: 80 }}
                  />
                </Box>

                {/* Nút Khóa nhanh */}
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  size="small"
                  onClick={() =>
                    handleOpenQuickBlock({ room_type_id: data?.room_type_id, rent_type: "daily" })
                  }
                >
                  Khóa nhanh ngày này
                </Button>
              </Box>

              {/* Thông tin phòng */}
              <Box p={3} bgcolor="#fafafa">
                <Typography fontWeight={700} mb={1}>
                  {parseVi(data?.name)}
                </Typography>

                <Box display="flex" justifyContent="space-between">
                  <Typography>Giá phòng/đêm:</Typography>
                  <Typography fontWeight={600} color="#e65e00">
                    {data?.price_daily?.toLocaleString("vi-VN")}đ
                  </Typography>
                </Box>
              </Box>

              {/* Action */}
              <Box p={2} display="flex" gap={2}>
                <Button
                  variant="outlined"
                  color="success"
                  fullWidth
                  onClick={handleOpenEdit}
                >
                  Chỉnh sửa
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() =>
                    navigate(`/info-hotel?hotel_id=${data?.hotel_id}&room_id=${data?.room_type_id}`)
                  }
                >
                  Xem chi tiết
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  return isMobile ? renderMobile() : renderDesktop();
}

function RoomScheduleTableOvernight({
  handleOpenQuickBlock,
  handleOpenEdit,
  data,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const overnightSlots = data?.slots || [];
  const [editedValues, setEditedValues] = useState<{ [key: number]: number }>({});

  // Desktop version - giữ nguyên như cũ
  const renderDesktop = () => {
    const totalDays = overnightSlots?.length || 0;
    const columnWidth = `${100 / totalDays}%`;

    return (
      <Box p={2} bgcolor="#fff">
        <Box
          sx={{
            overflowX: "auto",
            overflowY: "hidden",
            "&::-webkit-scrollbar": { height: 10 },
            "&::-webkit-scrollbar-thumb": { background: "#aaa", borderRadius: 5 },
            border: "1px solid #ccc",
          }}
        >
          <Box minWidth="fit-content">
            {/* HEADER */}
            <Box display="flex">
              <Box
                width="280px"
                flexShrink={0}
                bgcolor="white"
                position="sticky"
                left={0}
                zIndex={10}
                borderRight="2px solid #ddd"
                borderBottom="2px solid #ddd"
              />

              <Box flex={1}>
                <Box
                  textAlign="start"
                  py={1.5}
                  px={2}
                  borderBottom="1px solid #eee"
                  bgcolor="#f9f9f9"
                >
                  <Typography fontWeight={600} fontSize={16}>
                    {format(new Date(data.start_time), "MMMM yyyy", { locale: vi })}
                  </Typography>
                </Box>

                <Box display="flex" borderBottom="2px solid #ddd" bgcolor="white">
                  {overnightSlots?.map((slot) => {
                    const dateObj = slot?.date ? new Date(slot.date) : null;
                    const dayNum = dateObj ? format(dateObj, "dd") : "";
                    const dayName = dateObj
                      ? format(dateObj, "EEEE", { locale: vi })
                          .replace("Chủ nhật", "CN")
                          .replace("Thứ ", "thứ ")
                          .toLowerCase()
                      : "";

                    return (
                      <Box
                        key={slot.date}
                        width={columnWidth}
                        minWidth="150px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        py={2}
                        borderRight="1px solid #eee"
                      >
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#98b720",
                            color: "white",
                            fontWeight: 600,
                            minWidth: "140px",
                            height: "40px",
                            fontSize: "15px",
                            borderRadius: "20px",
                            boxShadow: "0 4px 15px rgba(152,183,32,0.4)",
                            "&:hover": { bgcolor: "#80a61a" },
                          }}
                        >
                          {dayNum} {dayName}
                        </Button>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            {/* Rows */}
            {[
              { label: parseVi(data?.name), isName: true },
              {
                label: "Tình trạng phòng",
                action: "Khóa nhanh",
                onClick: () => handleOpenQuickBlock({ room_type_id: data?.room_type_id, rent_type: "overnight" }),
                isStatus: true,
              },
              { label: "Số phòng đặt", isBooked: true },
              {
                label: "Số phòng còn lại",
                onClick: handleOpenEdit,
                isRemaining: true,
              },
            ].map((row, idx) => (
              <Box key={idx} display="flex" borderBottom="1px solid #eee">
                <Box
                  width="280px"
                  flexShrink={0}
                  bgcolor={idx === 0 ? "white" : "#fafafa"}
                  position="sticky"
                  left={0}
                  zIndex={10}
                  borderRight="2px solid #ddd"
                  borderBottom="1px solid #ddd"
                >
                  <Box px={3} py={2} display="flex" justifyContent="space-between" alignItems="center">
                    {row.isName ? (
                      <>
                        <Typography fontWeight={700} fontSize={18} display="flex" alignItems="center" gap={1}>
                          {row.label} <KeyboardArrowUpIcon />
                        </Typography>
                        <Typography
                          onClick={() =>
                            navigate(`/info-hotel?hotel_id=${data?.hotel_id}&room_id=${data?.room_type_id}`)
                          }
                          color="#98b720"
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          sx={{ cursor: "pointer" }}
                        >
                          Xem <LaunchIcon fontSize="small" />
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography fontWeight={500}>{row.label}</Typography>
                        {row.action && (
                          <Typography
                            onClick={row.onClick}
                            sx={{ cursor: "pointer", color: "#98b720", fontWeight: 600 }}
                          >
                            {row.action}
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                </Box>

                <Box flex={1} display="flex">
                  {overnightSlots?.map((slot, i) => (
                    <Box
                      key={i}
                      width={columnWidth}
                      minWidth="150px"
                      borderRight="1px solid #eee"
                      borderBottom="1px solid #eee"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      py={2}
                    >
                      {row.isStatus && (
                        <Box
                          px={2}
                          py={1}
                          borderRadius="50px"
                          fontSize={13}
                          fontWeight={500}
                          bgcolor={slot.remaining_rooms > 0 ? "#eaf5ed" : "#ffebee"}
                          color={slot.remaining_rooms > 0 ? "#089408" : "#d32f2f"}
                        >
                          {slot.remaining_rooms > 0 ? "Còn phòng" : "Hết phòng"}
                        </Box>
                      )}
                      {row.isBooked && (
                        <Typography fontWeight={600} color="#333">
                          {slot.booked_rooms}
                        </Typography>
                      )}
                      {row.isRemaining && (
                        <TextField
                          value={editedValues[i] ?? slot.remaining_rooms}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditedValues((prev) => ({
                              ...prev,
                              [i]: val === "" ? undefined : parseInt(val, 10),
                            }));
                          }}
                          onBlur={(e) => {
                            const newVal = parseInt(e.target.value, 10);
                            if (!isNaN(newVal) && newVal !== slot.remaining_rooms) {
                              handleOpenQuickBlock({
                                room_type_id: data.room_type_id,
                                rent_type: "overnight",
                                start_time: slot.from,
                                end_time: slot.to || slot.from,
                                available_rooms: newVal,
                                reason: "staff_shortage",
                                note: "Thiếu nhân viên dọn phòng",
                              });
                            }
                          }}
                          type="number"
                          size="small"
                          inputProps={{ min: 0, style: { textAlign: "center", fontWeight: 600 } }}
                          sx={{ width: 60 }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}

            {/* Giá */}
            {[
              {
                label: "Giá phòng/đêm",
                value: `${data?.price_overnight?.toLocaleString("vi-VN")}đ`,
                bg: "#fff3e9",
                color: "#e65e00",
              },
            ].map((p) => (
              <Box key={p.label} display="flex">
                <Box
                  width="280px"
                  flexShrink={0}
                  bgcolor="#f8f9fa"
                  position="sticky"
                  left={0}
                  zIndex={10}
                  borderRight="2px solid #ddd"
                  borderBottom="1px solid #ddd"
                >
                  <Box px={3} py={2}>
                    <Typography fontWeight={500}>{p.label}</Typography>
                  </Box>
                </Box>
                <Box flex={1} display="flex" alignItems="center" pl={4}>
                  <Box
                    bgcolor={p.bg}
                    color={p.color}
                    px={4}
                    py={1.5}
                    borderRadius="50px"
                    fontWeight={600}
                    fontSize={15}
                  >
                    {p.value}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  // Mobile version - card theo ngày
  const renderMobile = () => {
    return (
      <Box p={2} bgcolor="#fff">
        {/* Tháng */}
        <Box
          textAlign="center"
          py={2}
          bgcolor="#f9f9f9"
          borderRadius="12px"
          mb={3}
        >
          <Typography variant="h6" fontWeight={700}>
            {format(new Date(data.start_time), "MMMM yyyy", { locale: vi })}
          </Typography>
        </Box>

        {overnightSlots?.map((slot, index) => {
          const dateObj = slot?.date ? new Date(slot.date) : null;
          const dayNum = dateObj ? format(dateObj, "dd") : "";
          const dayName = dateObj
            ? format(dateObj, "EEEE", { locale: vi })
                .replace("Chủ nhật", "CN")
                .replace("Thứ ", "thứ ")
                .toLowerCase()
            : "";

          return (
            <Box
              key={slot.date}
              bgcolor="white"
              borderRadius="12px"
              boxShadow="0 2px 12px rgba(0,0,0,0.08)"
              mb={3}
              overflow="hidden"
            >
              {/* Header ngày */}
              <Box bgcolor="#98b720" color="white" py={2} px={3}>
                <Typography variant="h6" fontWeight={700}>
                  {dayNum} {dayName}
                </Typography>
              </Box>

              <Divider />

              {/* Thông tin */}
              <Box p={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography fontWeight={600} fontSize={16}>
                    Tình trạng phòng
                  </Typography>
                  <Box
                    px={2}
                    py={0.8}
                    borderRadius="50px"
                    fontSize={13}
                    fontWeight={600}
                    bgcolor={slot.remaining_rooms > 0 ? "#eaf5ed" : "#ffebee"}
                    color={slot.remaining_rooms > 0 ? "#089408" : "#d32f2f"}
                  >
                    {slot.remaining_rooms > 0 ? "Còn phòng" : "Hết phòng"}
                  </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1.5}>
                  <Typography color="text.secondary">Số phòng đặt:</Typography>
                  <Typography fontWeight={600}>{slot.booked_rooms}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography color="text.secondary">Còn lại:</Typography>
                  <TextField
                    value={editedValues[index] ?? slot.remaining_rooms}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditedValues((prev) => ({
                        ...prev,
                        [index]: val === "" ? undefined : parseInt(val, 10),
                      }));
                    }}
                    onBlur={(e) => {
                      const newVal = parseInt(e.target.value, 10);
                      if (!isNaN(newVal) && newVal !== slot.remaining_rooms) {
                        handleOpenQuickBlock({
                          room_type_id: data.room_type_id,
                          rent_type: "overnight",
                          start_time: slot.from,
                          end_time: slot.to || slot.from,
                          available_rooms: newVal,
                          reason: "staff_shortage",
                          note: "Thiếu nhân viên dọn phòng",
                        });
                      }
                    }}
                    type="number"
                    size="small"
                    inputProps={{ min: 0, style: { textAlign: "center" } }}
                    sx={{ width: 80 }}
                  />
                </Box>

                {/* Nút Khóa nhanh */}
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  size="small"
                  onClick={() =>
                    handleOpenQuickBlock({ room_type_id: data?.room_type_id, rent_type: "overnight" })
                  }
                >
                  Khóa nhanh ngày này
                </Button>
              </Box>

              {/* Thông tin phòng */}
              <Box p={3} bgcolor="#fafafa">
                <Typography fontWeight={700} mb={1}>
                  {parseVi(data?.name)}
                </Typography>

                <Box display="flex" justifyContent="space-between">
                  <Typography>Giá phòng/đêm:</Typography>
                  <Typography fontWeight={600} color="#e65e00">
                    {data?.price_overnight?.toLocaleString("vi-VN")}đ
                  </Typography>
                </Box>
              </Box>

              {/* Action */}
              <Box p={2} display="flex" gap={2}>
                <Button
                  variant="outlined"
                  color="success"
                  fullWidth
                  onClick={handleOpenEdit}
                >
                  Chỉnh sửa
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() =>
                    navigate(`/info-hotel?hotel_id=${data?.hotel_id}&room_id=${data?.room_type_id}`)
                  }
                >
                  Xem chi tiết
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  return isMobile ? renderMobile() : renderDesktop();
}

const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function EditOperationDialog({ openEdit, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
              <Box width={isMobile?"100%":"48%"}>
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
                    -
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
              <Box width={isMobile?"100%":"48%"}>
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
                    -
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
