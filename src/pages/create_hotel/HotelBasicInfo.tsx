import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  useMediaQuery,
  Radio,
  FormControlLabel,
  RadioGroup,
  Card,
  MenuItem,
  FormControl,
  Select,
  OutlinedInput,
  InputAdornment,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Divider,
  Button,
  Modal,
  InputAdornment as MuiInputAdornment,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useBookingContext } from "../../App";
import { Add, Close, Search } from "@mui/icons-material";
import { facilities } from "../../utils/utils";

const businessTypes = ["Tình yêu", "Du lịch", "Homestay", "Camping"];

export default function HotelBasicInfo({
  setDataCreateHotel,
  selectedLang,
  dataCreateHotel,
  onTempChange,
  errors = {},
  touched = {},
  onFieldBlur,
  attribute,
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  /** ===============================
   * STATE TOÀN BỘ FORM
   =================================*/
  const [formData, setFormData] = useState({
    hotelName: {
      vi: "",
      ko: "",
      ja: "",
      en: "",
    },
    phone: "",
    description: {
      vi: "",
      ko: "",
      ja: "",
      en: "",
    },
    businessType: "Tình yêu",

    // Theo giờ
    hourlyStart: "",
    hourlyEnd: "",

    // Qua đêm
    overnightStart: "",
    overnightEnd: "",

    // Theo ngày
    dailyStart: "",
    dailyEnd: "",
    selectedIds: [],
  });
  const context = useBookingContext();
  useEffect(() => {
    if (context?.state?.create_hotel?.hotelName) {
      setFormData(context?.state?.create_hotel);
    }
  }, [context]);
  /** Cập nhật field */
  const updateField = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      onTempChange?.(newData); // ← báo ngay cho CreateHotelView
      return newData;
    });
  };

  const latestValue = useRef();

  useEffect(() => {
    latestValue.current = formData;
  }, [formData]);

  useEffect(() => {
    return () => {
      context.dispatch({
        type: "UPDATE_CREATE_HOTEL",
        payload: {
          ...context.state,
          create_hotel: { ...latestValue.current },
        },
      });

      console.log("unmount value:", latestValue.current); // ✔ lấy đúng giá trị mới nhất
    };
  }, []);
  console.log("formData", formData);
  /** HOURS OPTIONS */
  const HOURS = [
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
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
    "00:00",
    "01:00",
    "02:00",
    "03:00",
  ];

  /** ===============================
   * COMPONENT RENDER CARD TIME
   =================================*/
  const renderTimeCard = (title, fields) => (
    <Card
      sx={{
        p: 2.5,
        borderRadius: 2,
        width: "100%",
        border: "1px solid #E5E7EB",
      }}>
      <Typography
        fontWeight={600}
        color='#555'
        textAlign='center'
        mb={2}
        fontSize={15}>
        {title}
      </Typography>

      <Box display='flex' flexDirection='column' gap={2}>
        {fields.map((item, i) => (
          <Box key={i}>
            <Typography fontSize={14} color='#444' mb={0.5}>
              {item.label}
            </Typography>

            {/* START TIME */}
            <Box
              display='flex'
              flexDirection={isMobile ? "column" : "row"}
              gap={2}
              alignItems='center'>
              <FormControl size='small' fullWidth>
                <Select
                  value={item.startValue}
                  onChange={(e) => item.onStartChange(e.target.value)}
                  displayEmpty
                  input={
                    <OutlinedInput
                      startAdornment={
                        <InputAdornment position='start'>
                          <AccessTimeIcon
                            sx={{ fontSize: 20, color: "#98b720" }}
                          />
                        </InputAdornment>
                      }
                      sx={{
                        height: 40,
                        borderRadius: "12px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ddd",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#98b720",
                          borderWidth: 2,
                        },
                      }}
                    />
                  }>
                  <MenuItem disabled value=''>
                    {item.startPlaceholder}
                  </MenuItem>

                  {HOURS.map((h) => (
                    <MenuItem key={h} value={h}>
                      {h}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography width={"20%"} fontSize={14} color='#555'>
                ngày {item.startDay}
              </Typography>
            </Box>

            {/* END TIME */}
            <Box
              display='flex'
              flexDirection={isMobile ? "column" : "row"}
              gap={2}
              mt={1.5}
              alignItems='center'>
              <FormControl size='small' fullWidth>
                <Select
                  value={item.endValue}
                  onChange={(e) => item.onEndChange(e.target.value)}
                  displayEmpty
                  input={
                    <OutlinedInput
                      startAdornment={
                        <InputAdornment position='start'>
                          <AccessTimeIcon
                            sx={{ fontSize: 20, color: "#98b720" }}
                          />
                        </InputAdornment>
                      }
                      sx={{
                        height: 40,
                        borderRadius: "12px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ddd",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#98b720",
                          borderWidth: 2,
                        },
                      }}
                    />
                  }>
                  <MenuItem disabled value=''>
                    {item.endPlaceholder}
                  </MenuItem>

                  {HOURS.map((h) => (
                    <MenuItem key={h} value={h}>
                      {h}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography width={"20%"} fontSize={14} color='#555'>
                ngày {item.endDay}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );

  /** ===============================
   * RENDER PAGE
   =================================*/
  return (
    <Box p={4} bgcolor={"white"} borderRadius={"15px"}>
      {/* Row: Tên + SĐT */}
      <Box
        display='flex'
        flexDirection={isMobile ? "column" : "row"}
        gap={3}
        mb={3}>
        <Box flex={1}>
          <Typography fontSize={14} fontWeight={600} mb={0.8}>
            Tên khách sạn
          </Typography>
          <TextField
            fullWidth
            placeholder='Nhập tên khách sạn'
            error={touched.hotelName && !!errors.hotelName}
            helperText={touched.hotelName ? errors.hotelName : " "}
            value={formData.hotelName?.[selectedLang] || ""}
            onChange={(e) =>
              updateField("hotelName", {
                ...formData.hotelName,
                [selectedLang]: e.target.value,
              })
            }
            onBlur={() => onFieldBlur?.("hotelName")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                height: "50px",
                "&.Mui-focused fieldset": {
                  borderColor: "#98b720",
                  borderWidth: 1.5,
                },
              },
            }}
          />
        </Box>

        <Box flex={1}>
          <Typography fontSize={14} fontWeight={600} mb={0.8}>
            Số điện thoại
          </Typography>
          <TextField
            fullWidth
            error={touched.phone && !!errors.phone}
            helperText={touched.phone ? errors.phone : " "}
            value={formData.phone || ""}
            onChange={(e) => updateField("phone", e.target.value)}
            onBlur={() => onFieldBlur?.("phone")}
            placeholder='Nhập số điện thoại'
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                height: "50px",
                "&.Mui-focused fieldset": {
                  borderColor: "#98b720",
                  borderWidth: 1.5,
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* Mô tả */}
      <Box mb={4}>
        <Typography fontSize={14} fontWeight={600} mb={0.8}>
          Mô tả (không bắt buộc)
        </Typography>
        <Typography fontSize={12} mb={0.8}>
          Viết một đoạn giới thiệu ngắn gọn về khách sạn của bạn. Mô tả sẽ được
          hiển thị tại trang chủ của khách sạn trên Hotel Booking.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={formData.description?.[selectedLang] || ""}
          onChange={(e) =>
            updateField("description", {
              ...formData.description,
              [selectedLang]: e.target.value,
            })
          }
          placeholder='Nhập mô tả'
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "16px",
              "&.Mui-focused fieldset": {
                borderColor: "#98b720",
                borderWidth: 1.5,
              },
            },
          }}
        />
      </Box>

      {/* Loại hình kinh doanh */}
      <Box mb={4}>
        <Typography fontSize={14} fontWeight={600} mb={1.5}>
          Loại hình kinh doanh
        </Typography>

        <RadioGroup
          row
          value={formData.businessType}
          onChange={(e) => updateField("businessType", e.target.value)}>
          {businessTypes.map((type) => (
            <FormControlLabel
              key={type}
              value={type}
              control={<Radio sx={{ color: "#8BC34A !important" }} />}
              label={type}
              sx={{ mr: 4 }}
            />
          ))}
        </RadioGroup>
      </Box>
      <Box mb={4}>
        <Typography fontSize={14} fontWeight={600} mb={1.5}>
          Tiện ích khách sạn
        </Typography>

        <FacilitySelector
          onChange={(newIds) => updateField("selectedIds", newIds)}
          selectedIds={formData.selectedIds}
          attribute={attribute}
          selectedLang={selectedLang}
        />
      </Box>

      {/* Thời gian kinh doanh */}
      <Box mb={2}>
        <Typography fontSize={14} fontWeight={600} mb={2}>
          Thời gian kinh doanh
        </Typography>

        <Box display='flex' flexDirection={isMobile ? "column" : "row"} gap={3}>
          {/* Theo giờ */}
          {renderTimeCard("Theo giờ", [
            {
              label: "Bắt đầu",
              startPlaceholder: "Chọn giờ",
              endPlaceholder: "Chọn giờ",
              startDay: "T",
              endDay: "T",
              startValue: formData.hourlyStart,
              endValue: formData.hourlyEnd,
              onStartChange: (v) => updateField("hourlyStart", v),
              onEndChange: (v) => updateField("hourlyEnd", v),
            },
          ])}

          {/* Qua đêm */}
          {renderTimeCard("Qua đêm", [
            {
              label: "Bắt đầu",
              startPlaceholder: "Chọn giờ",
              endPlaceholder: "Chọn giờ",
              startDay: "T",
              endDay: "T+1",
              startValue: formData.overnightStart,
              endValue: formData.overnightEnd,
              onStartChange: (v) => updateField("overnightStart", v),
              onEndChange: (v) => updateField("overnightEnd", v),
            },
          ])}

          {/* Theo ngày */}
          {renderTimeCard("Theo ngày", [
            {
              label: "Bắt đầu",
              startPlaceholder: "Chọn giờ",
              endPlaceholder: "Chọn giờ",
              startDay: "T",
              endDay: "T+1",
              startValue: formData.dailyStart,
              endValue: formData.dailyEnd,
              onStartChange: (v) => updateField("dailyStart", v),
              onEndChange: (v) => updateField("dailyEnd", v),
            },
          ])}
        </Box>
      </Box>
    </Box>
  );
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  maxHeight: "80vh",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 3,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};
function FacilitySelector({ selectedIds = [], onChange, attribute,selectedLang }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFacilities = attribute?.amenities.filter(
    (fac) =>
      fac.name.vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.name.en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Quan trọng: Khi toggle → cập nhật NGAY LẬP TỨC ra ngoài
  const handleToggle = (id: string) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];

    onChange(newIds); // ← Cập nhật ngay vào formData → chip hiện ngay
  };

  const handleDelete = (id: string) => {
    const newIds = selectedIds.filter((x) => x !== id);
    onChange(newIds);
  };

  // Nút này giờ chỉ đóng modal thôi, không cần commit nữa
  const handleClose = () => {
    setOpen(false);
    setSearchTerm(""); // optional: reset search khi đóng
  };

  const selectedFacilities = attribute?.amenities.filter((f) =>
    selectedIds.includes(f.id)
  );

  return (
    <Box mb={2}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}>
        <Button
          variant='outlined'
          onClick={() => setOpen(true)}
          startIcon={<Add />}
          sx={{
            height: "40px",
            borderRadius: 2,
            borderColor: "#ddd",
            color: "#555",
            textTransform: "none",
            fontSize: "0.875rem",
            fontWeight: 500,
            justifyContent: "flex-start",
            px: 2,
            "&:hover": {
              borderColor: "#98b720",
              bgcolor: "rgba(152, 183, 32, 0.04)",
            },
            "& .MuiButton-startIcon": {
              color: "#98b720",
            },
          }}>
          {selectedFacilities.length > 0
            ? `${selectedFacilities.length} tiện ích đã chọn`
            : "Thêm tiện ích"}
        </Button>
      </Box>

      {/* Chips hiển thị bên ngoài – sẽ cập nhật ngay khi chọn */}
      {selectedFacilities.length > 0 && (
        <Stack direction='row' flexWrap='wrap' gap={1} mt={2}>
          {selectedFacilities.map((fac) => (
            <Chip
              key={fac.id}
              label={fac.name[selectedLang]}
              onDelete={() => handleDelete(fac.id)}
              deleteIcon={<Close />}
              sx={{
                bgcolor: "#7CB518",
                color: "white",
                "& .MuiChip-deleteIcon": { color: "white", opacity: 0.7 },
              }}
            />
          ))}
        </Stack>
      )}

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            mb={2}>
            <Typography variant='h6'>Chọn tiện ích</Typography>
            <Button onClick={handleClose} sx={{ minWidth: "auto", p: 0 }}>
              <Close />
            </Button>
          </Box>

          <TextField
            fullWidth
            placeholder='Tìm kiếm tiện ích'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ flex: 1, overflow: "auto" }}>
            <List disablePadding>
              {filteredFacilities.map((fac, index) => (
                <React.Fragment key={fac.id}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleToggle(fac.id)}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <img
                          src={fac.icon}
                          alt={fac.name.vi}
                          width={28}
                          height={28}
                        />
                      </ListItemIcon>
                      <ListItemText primary={fac.name[selectedLang]} />
                      <Checkbox
                        edge='end'
                        checked={selectedIds.includes(fac.id)} // ← dùng selectedIds từ props → luôn đúng
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < filteredFacilities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>

          <Button
            variant='contained'
            fullWidth
            onClick={handleClose}
            sx={{
              mt: 3,
              bgcolor: "#7CB518",
              "&:hover": { bgcolor: "#7CB518" },
              borderRadius: 8,
              py: 1.5,
            }}>
            Đóng
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
