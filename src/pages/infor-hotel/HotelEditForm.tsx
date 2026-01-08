import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Grid,
  Stack,
  Divider,
  Button,
  CircularProgress,
  Chip,
  Modal,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Avatar,
} from "@mui/material";
import HotelImageUpload from "./HotelImageUpload";
import { Add, ArrowBackIos, ArrowDropDown, Close, Search } from "@mui/icons-material";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getHotel, updateHotel } from "../../service/hotel";
import { toast } from "react-toastify";
import { facilities } from "../../utils/utils";
import vn from "../../images/vn.png";
import ja from "../../images/ja.png";
import ko from "../../images/ko.png";
import en from "../../images/en.png";

const LANGUAGES = [
  { code: "vi", label: "Tiếng Việt", flag: vn },
  { code: "en", label: "English", flag: en },
  { code: "ko", label: "Hàn Quốc", flag: ko },
  { code: "ja", label: "Nhật Bản", flag: ja },
];

export default function HotelEditFormExact({ setAction, setRoom,getHotelDetail }) {
  const [center, setCenter] = useState({ lat: 21.0285, lng: 105.8542 });
  const mapRef = useRef(null);
  const [hotel, setHotel] = useState(null); // dữ liệu hotel đã parse
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [selectedLang, setSelectedLang] = React.useState<string>('vi');

  const handleChange = (event) => {
    setSelectedLang(event.target.value as string);
    // Ở đây bạn có thể thêm logic thay đổi ngôn ngữ thực tế
    console.log('Language changed to:', event.target.value);
  };
  const containerStyle = { width: "100%", height: "50vh" };
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // State cho các field (controlled)
  const [formValues, setFormValues] = useState({
    name: {
      vi: "",
      ko: "",
      ja: "",
      en: ""
    },
    phone: "",
    address: "",
    description: {
      vi: "",
      ko: "",
      ja: "",
      en: ""
    },
    city: "hanoi",
    cooperation_type: "listing",
    rent_types: {
      daily: { from: "14:00", to: "12:00" },
      overnight: { from: "21:00", to: "08:00" },
    },
  });

  
  // Ref để lưu ảnh mới upload (được HotelImageUpload cập nhật)
  const newImagesRef = useRef({ images: [], verify_images: [] });

  useEffect(() => {
    if (searchParams.get("id")) {
      (async () => {
        try {
          const result = await getHotel(searchParams.get("id"));
          if (result?.id) {
            setHotel(result);

            // Parse các trường JSON string
            const parsedName = JSON.parse(result.name || '{"vi":""}') || "";
            const parsedAddress =
              JSON.parse(result.address || '{"vi":""}').vi || "";
            const parsedDesc =
              JSON.parse(result.description || '{"vi":""}') || "";
            const parsedRentTypes = result.rent_types
              ? JSON.parse(result.rent_types)
              : {};

              if (result && result.amenities) {
                try {
                  const parsed = JSON.parse(result.amenities as string);
                  if (Array.isArray(parsed)) {
                    setSelectedIds(parsed);
                  }
                } catch (e) {
                  console.warn("Không parse được facilities:", e);
                }
              }
            setFormValues({
              name: parsedName,
              phone: result.phone || "",
              address: parsedAddress,
              description: parsedDesc,
              city: result.city || "hanoi",
              cooperation_type: result.cooperation_type || "listing",
              rent_types: parsedRentTypes,
            });

            // Cập nhật center bản đồ
            setCenter({
              lat: result.latitude || 21.0285,
              lng: result.longitude || 105.8542,
            });
          }
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [searchParams]);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onIdle = () => {
    if (!mapRef.current) return;
    const newCenter = mapRef.current.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();

    if (
      Math.abs(center.lat - lat) < 0.000001 &&
      Math.abs(center.lng - lng) < 0.000001
    )
      return;

    setCenter({ lat, lng });
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!hotel) return;

    const formData = new FormData();

    // Các field text
    formData.append("name", JSON.stringify(formValues.name ));
    formData.append("address", JSON.stringify({ vi: formValues.address }));
    formData.append(
      "description",
      JSON.stringify(formValues.description)
    );
    formData.append("city", formValues.city);
    formData.append("phone", formValues.phone);
    formData.append("lat", center.lat);
    formData.append("lng", center.lng);
    formData.append("rent_types", JSON.stringify(formValues.rent_types));
    formData.append("amenities", JSON.stringify(selectedIds));
    // Chỉ append ảnh mới upload
    newImagesRef.current.images.forEach((file) => {
      formData.append("images", file);
    });
    newImagesRef.current.verify_images.forEach((file) => {
      formData.append("verify_images", file);
    });

    // Gửi request (ví dụ)
    try {
      const response = await updateHotel(searchParams.get("id"), formData);
      console.log("Update success", response);
      if (response?.hotel_id) {
        toast.success(response?.message);
        getHotelDetail()
        setAction("edit_detail");
       
      } else {
        toast.success(response?.message);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
  const memoizedHotelData = useMemo(() => hotel, [hotel?.id]);
  return (
    <Box>
      <Box display={"flex"}  mb={3} justifyContent={"space-between"} alignItems={"center"}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, }}>
        <ArrowBackIos
          sx={{
            fontSize: 20,
            color: "#666",
            cursor: "pointer",
            "&:hover": { color: "#333" },
          }}
          onClick={() => setAction("edit_detail")}
        />
        <Typography fontSize={22} fontWeight={700} color='#222'>
          Cập nhật thông tin
        </Typography>
      </Box>
      <FormControl sx={{ minWidth: 160 }}>
          <Select
            value={selectedLang}
            onChange={handleChange}
            displayEmpty
            IconComponent={ArrowDropDown}
            // Tùy chỉnh style để giống hệt ảnh
            sx={{
              bgcolor: 'white',
              borderRadius: '10px', // bo tròn mạnh
              height: 48,

              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9AC33C',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9AC33C',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9AC33C',
              },
              '& .MuiSelect-icon': {
                color: '#9AC33C', // màu xanh lá của mũi tên
              },
            }}
            // Render giá trị đang chọn giống hệt ảnh
            renderValue={(selected) => {
              if (!selected) return <span>Chọn ngôn ngữ</span>;

              const lang = LANGUAGES.find((item) => item.code === selected);
              if (!lang) return null;

              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    src={lang.flag}
                    alt={lang.label}
                    sx={{ width: 24, height: 24,borderRadius:"5px" }}
                    variant="square"
                  />
                  <Typography
                    sx={{
                      fontSize: '.9rem',
                      fontWeight: 500,
                      color: '#9AC33C', // màu xanh lá giống ảnh
                    }}
                  >
                    {lang.label}
                  </Typography>
                </Box>
              );
            }}
          >
            {LANGUAGES.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    src={lang.flag}
                    alt={lang.label}
                    sx={{ width: 24, height: 24,borderRadius:"5px" }}
                    variant="square"
                  />
                  <Typography>{lang.label}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "20px",
          border: "1px solid #eee",
          overflow: "hidden",
          bgcolor: "#fff",
        }}>
        <Box sx={{ p: { xs: 3, sm: 4, md: 3 } }}>
          <Grid container spacing={{ xs: 4, lg: 6 }}>
            {/* Cột trái */}
            <Grid item xs={12} lg={4}>
              <Typography variant='h6'>Thông tin khách sạn</Typography>
            </Grid>

            {/* Cột phải */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={3.5}>
                {/* Tên khách sạn */}
                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
                    color='#333'
                    mb={1.2}>
                    Tên khách sạn
                  </Typography>
                  <TextField
                    fullWidth
                    disabled
                    value={formValues.name[selectedLang]}
                    onChange={(e) =>
                      setFormValues({ ...formValues, name: e.target.value })
                    }
                    variant='outlined'
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 50,
                        borderRadius: "12px",
                        bgcolor: "#fafafa",
                        fontSize: 15,
                      },
                    }}
                  />
                </Box>

                {/* Điện thoại */}
                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
                    color='#333'
                    mb={1.2}>
                    Điện thoại
                  </Typography>
                  <TextField
                    fullWidth
                    value={formValues.phone}
                    onChange={(e) =>
                      setFormValues({ ...formValues, phone: e.target.value })
                    }
                    variant='outlined'
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 50,
                        borderRadius: "12px",
                        bgcolor: "#fafafa",
                        fontSize: 15,
                      },
                    }}
                  />
                </Box>

                {/* Tình trạng hợp tác */}
                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
                    color='#333'
                    mb={1.2}>
                    Tình trạng hợp tác
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                    disabled
                      value={formValues.cooperation_type}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          cooperation_type: e.target.value,
                        })
                      }
                      sx={{
                        height: 50,
                        borderRadius: "12px",
                        bgcolor: "#fafafa",
                        fontSize: 15,
                      }}>
                      <MenuItem value='listing'>Listing</MenuItem>
                      <MenuItem value='contract'>Contract</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Bản đồ */}
                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
                    color='#333'
                    mb={1.2}>
                    Vị trí
                  </Typography>
                  <Box
                    sx={{
                      height: 280,
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid #ddd",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}>
                    <LoadScript googleMapsApiKey='AIzaSyASJk1hzLv6Xoj0fRsYnfuO6ptOXu0fZsc'>
                      <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={14}
                        onLoad={onLoad}
                        onIdle={onIdle}
                        options={{
                          zoomControl: true,
                          streetViewControl: false,
                          mapTypeControl: false,
                          fullscreenControl: false,
                          styles: [
                            {
                              featureType: "poi",
                              elementType: "labels",
                              stylers: [{ visibility: "off" }],
                            },
                          ],
                        }}
                      />
                    </LoadScript>
                  </Box>
                </Box>

                {/* Địa chỉ */}
                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
                    color='#333'
                    mb={1.2}>
                    Địa chỉ
                  </Typography>
                  <TextField
                    fullWidth
                    disabled
                    value={formValues.address}
                    onChange={(e) =>
                      setFormValues({ ...formValues, address: e.target.value })
                    }
                    variant='outlined'
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 50,
                        borderRadius: "12px",
                        bgcolor: "#fafafa",
                        fontSize: 15,
                      },
                    }}
                  />
                </Box>

                {/* Quận + Thành phố (giả sử chỉ có city) */}
                <Grid container justifyContent={"space-between"}>
                  <Grid item xs={5.8}>
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      color='#333'
                      mb={1.2}>
                      Tỉnh/Thành phố
                    </Typography>
                    <TextField
                      fullWidth
                      disabled
                      value={
                        formValues.city === "hanoi" ? "Hà Nội" : formValues.city
                      }
                      disabled
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 50,
                          borderRadius: "12px",
                          bgcolor: "#fafafa",
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Mô tả */}
                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
                    color='#333'
                    mb={1}>
                    Mô tả khách sạn
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={formValues.description[selectedLang]}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        description:{...formValues.description,[selectedLang]:e.target.value} ,
                      })
                    }
                    placeholder='Nhập mô tả về khách sạn của bạn'
                    variant='outlined'
                    inputProps={{ maxLength: 3000 }}
                    helperText={`${formValues.description[selectedLang].length}/3000`}
                    FormHelperTextProps={{
                      sx: { textAlign: "right", marginRight: 2, color: "#999" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "#fafafa",
                        fontSize: 15,
                        "& textarea": { lineHeight: 1.6 },
                      },
                    }}
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />
          <Grid container spacing={{ xs: 4, lg: 6 }}>
            <Grid item xs={12} lg={4}>
              <Typography variant='h6'>Tiện ích khách sạn</Typography>
             
            </Grid>
            <Grid item xs={12} lg={8}>
            <FacilitySelector
           setSelectedIds={setSelectedIds}
            selectedIds={selectedIds}
          />
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />

          {/* Phần hình ảnh */}
          <Grid container spacing={{ xs: 4, lg: 6 }}>
            <Grid item xs={12} lg={4}>
              <Typography variant='h6'>Hình ảnh</Typography>
              <Typography color='#5D6679'>
                Thiết lập các thông tin cơ bản của phòng
              </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <HotelImageUpload
                hotelData={memoizedHotelData}
                onNewImagesChange={(newImages) => {
                  newImagesRef.current = newImages; // lưu ảnh mới để submit
                }}
              />
            </Grid>
          </Grid>

          <Box display={"flex"} justifyContent={"end"} gap={2} mt={4}>
            <Button
              sx={{
                background: "#F0F1F3",
                borderRadius: "30px",
                color: "black",
                padding: 1,
                px: 2,
              }}>
              Trở về
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                background: "#98B720",
                color: "white",
                borderRadius: "30px",
                padding: 1,
                px: 2,
              }}>
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ color: "#fff", mr: 1 }} />
                  Cập nhật...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
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
function FacilitySelector({ selectedIds = [], setSelectedIds }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFacilities = facilities.filter(
    (fac) =>
      fac.name.vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.name.en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Quan trọng: Khi toggle → cập nhật NGAY LẬP TỨC ra ngoài
  const handleToggle = (id: string) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];

    setSelectedIds(newIds);  // ← Cập nhật ngay vào formData → chip hiện ngay
  };

  const handleDelete = (id: string) => {
    const newIds = selectedIds.filter((x) => x !== id);
    setSelectedIds(newIds);
  };

  // Nút này giờ chỉ đóng modal thôi, không cần commit nữa
  const handleClose = () => {
    setOpen(false);
    setSearchTerm(""); // optional: reset search khi đóng
  };

  const selectedFacilities = facilities.filter((f) =>
    selectedIds.includes(f.id)
  );

  return (
    <Box mb={2}>
      <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
      <Button
  variant="outlined"
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
  }}
>
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
              label={fac.name.vi}
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
                        <img src={fac.icon} alt={fac.name.vi} width={28} height={28} />
                      </ListItemIcon>
                      <ListItemText primary={fac.name.vi} />
                      <Checkbox
                        edge='end'
                        checked={selectedIds.includes(fac.id)}  // ← dùng selectedIds từ props → luôn đúng
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
