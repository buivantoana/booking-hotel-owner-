import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Typography,
  Grid,
  Paper,
  InputAdornment,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import {
  GoogleMap,
  LoadScript,
} from "@react-google-maps/api";
import { useBookingContext } from "../../App";
import { getLocations } from "../../service/hotel";

// Định nghĩa type cho location từ API
interface Location {
  id: string;
  name: {
    en: string;
    vi: string;
  };
  total_hotels: number;
}

const wardsData: Record<string, string[]> = {
  "Đống Đa": ["Phường Phương Liên", "Phường Quốc Tử Giám", "Phường Trung Liệt"],
  "Ba Đình": ["Phường Ngọc Hà", "Phường Trúc Bạch"],
  "Hoàn Kiếm": ["Phường Hàng Buồm", "Phường Hàng Đào"],
  "Quận 1": ["Phường Bến Nghé", "Phường Nguyễn Thái Bình", "Phường Đa Kao"],
  "Quận 3": ["Phường 6", "Phường 7", "Phường 8"],
};

export default function HotelLocationInput({
  onTempChange,
  errors = {},
  touched = {},
  onFieldTouch,
}) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // selectedProvince giờ là object đầy đủ { id, name: { vi } }
  const [selectedProvince, setSelectedProvince] = useState<Location | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [center, setCenter] = useState({ lat: 21.0285, lng: 105.8542 });

  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);

  const context = useBookingContext();
  const dataRef = useRef({});
  const mapRef = useRef(null);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Gọi API lấy danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const result = await getLocations();
        // Giả sử API trả về { locations: [...] }
        if (result?.locations && Array.isArray(result.locations)) {
          setLocations(result.locations);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  // Cập nhật dữ liệu tạm mỗi khi có thay đổi
  useEffect(() => {
    const newData = {
      provinceId: selectedProvince?.id || null,
      provinceName: selectedProvince?.name.vi || null,
      selectedDistrict,
      selectedWard,
      address,
      center,
    };
    dataRef.current = newData;
    onTempChange?.(newData);
  }, [selectedProvince, selectedDistrict, selectedWard, address, center]);

  // Khôi phục dữ liệu từ context khi mount
  useEffect(() => {
    const saved = context?.state?.create_hotel;
    if (!saved) return;

    // Khôi phục tỉnh/thành
    if (saved.provinceId && locations.length > 0) {
      const foundProvince = locations.find(loc => loc.id === saved.provinceId);
      if (foundProvince) {
        setSelectedProvince(foundProvince);

        // Nếu có district (giả lập) → load tương ứng
        if (saved.selectedDistrict) {
          setTimeout(() => {
            setSelectedDistrict(saved.selectedDistrict);
            const newWards = wardsData[saved.selectedDistrict] || [];
            setWards(newWards);
            if (saved.selectedWard && newWards.includes(saved.selectedWard)) {
              setSelectedWard(saved.selectedWard);
            }
          }, 0);
        }
      }
    }

    if (saved.address) setAddress(saved.address);
    if (saved.center?.lat && saved.center?.lng) setCenter(saved.center);
  }, [locations, context?.state?.create_hotel]);

  // Lưu vào context khi unmount
  useEffect(() => {
    return () => {
      context.dispatch({
        type: "UPDATE_CREATE_HOTEL",
        payload: {
          ...context.state,
          create_hotel: { ...dataRef.current },
        },
      });
    };
  }, []);

  const onIdle = () => {
    if (!mapRef.current) return;
    const newCenter = mapRef.current.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();

    if (
      Math.abs(center.lat - lat) < 0.000001 &&
      Math.abs(center.lng - lng) < 0.000001
    ) {
      return;
    }
    setCenter({ lat, lng });
  };

  // Khi chọn tỉnh → reset quận/phường (vì hiện tại chưa có API quận)
  useEffect(() => {
    setDistricts([]);
    setSelectedDistrict(null);
    setWards([]);
    setSelectedWard(null);
  }, [selectedProvince]);

  // Khi chọn quận → load phường (giả lập)
  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      setSelectedWard(null);
      return;
    }
    const loadedWards = wardsData[selectedDistrict] || [];
    setWards(loadedWards);
    if (selectedWard && !loadedWards.includes(selectedWard)) {
      setSelectedWard(null);
    }
  }, [selectedDistrict]);

  const containerStyle = { width: "100%", height: "100%" };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: "white", borderRadius: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} color="text.primary" gutterBottom>
        Vị trí khách sạn trên bản đồ
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Giúp khách đặt phòng dễ dàng tìm đường tới khách sạn của bạn
      </Typography>

      {/* Chọn Tỉnh/Thành phố từ API */}
      <Autocomplete
        options={locations}
        getOptionLabel={(option) => option.name.vi}
        value={selectedProvince}
        loading={loadingLocations}
        onBlur={() => handleTouch("provinceId")}
        onChange={(_, newValue) => {
          setSelectedProvince(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Tìm kiếm tỉnh/thành phố..."
            variant="outlined"
            fullWidth
            error={touched.provinceId && !!errors.provinceId}
            helperText={touched.provinceId && errors.provinceId}
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                fontSize: "1.1rem",
                bgcolor: "white",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#a0d468",
                  borderWidth: 2,
                },
              },
            }}
          />
        )}
        noOptionsText={loadingLocations ? "Đang tải..." : "Không tìm thấy tỉnh/thành phố"}
      />

      {/* Form chi tiết khi đã chọn tỉnh */}
      {selectedProvince && (
        <Paper elevation={0} sx={{ padding: 0, borderRadius: 3, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Địa chỉ chi tiết */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Địa chỉ khách sạn
              </Typography>
              <TextField
                fullWidth
                placeholder="Nhập số nhà, tên đường..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={() => handleTouch("address")}
                error={touched.address && !!errors.address}
                helperText={touched.address ? errors.address : " "}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                  },
                }}
              />
            </Grid>

            {/* Thành phố/Tỉnh (hiển thị đã chọn) */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Thành Phố/Tỉnh
              </Typography>
              <TextField
                value={selectedProvince.name.vi}
                disabled
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#f7faf5",
                  },
                }}
              />
            </Grid>

            {/* Quận/Huyện - tạm thời để trống hoặc thêm API sau */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Quận/Huyện
              </Typography>
              <Autocomplete
                options={districts}
                value={selectedDistrict}
                onChange={(_, v) => setSelectedDistrict(v)}
                onBlur={() => handleTouch("selectedDistrict")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Chọn Quận/Huyện (sắp có)"
                    disabled
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Phường/Xã */}
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Phường/Xã/Thị trấn
              </Typography>
              <Autocomplete
                options={wards}
                value={selectedWard}
                onChange={(_, v) => setSelectedWard(v)}
                disabled
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Chọn Phường/Xã"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon fontSize="small" sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Bản đồ */}
      <Box
        sx={{
          height: { xs: 320, md: 480 },
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          position: "relative",
          bgcolor: "#f8f9fa",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <LoadScript googleMapsApiKey="AIzaSyASJk1hzLv6Xoj0fRsYnfuO6ptOXu0fZsc">
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
              styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }],
            }}
          />
        </LoadScript>
      </Box>
    </Box>
  );

  function handleTouch(field: string) {
    onFieldTouch?.(field);
  }
}