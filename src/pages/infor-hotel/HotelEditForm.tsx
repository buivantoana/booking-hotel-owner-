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
} from "@mui/material";
import HotelImageUpload from "../create_hotel/HotelImageUpload";
import { ArrowBackIos } from "@mui/icons-material";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";

export default function HotelEditFormExact({ setAction }) {
  const [center, setCenter] = useState({
    lat: 21.0285,
    lng: 105.8542,
  });
  const mapRef = useRef(null);

  const containerStyle = {
    width: "100%",
    height: "50vh",
  };

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  const onIdle = () => {
    if (!mapRef.current) return;

    const newCenter = mapRef.current.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();

    // kiểm tra nếu giống nhau thì không update
    if (
      Math.abs(center.lat - lat) < 0.000001 &&
      Math.abs(center.lng - lng) < 0.000001
    ) {
      return;
    }

    setCenter({ lat, lng });
  };
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <ArrowBackIos
          sx={{
            fontSize: 20,
            color: "#666",
            cursor: "pointer",
            "&:hover": { color: "#333" },
          }}
          onClick={() => setAction("edit_detail")}
        />

        <Box>
          <Typography
            fontSize={22}
            fontWeight={700}
            color='#222'
            sx={{ lineHeight: 1.2 }}>
            Cập nhật thông tin
          </Typography>
        </Box>

        {/* Badge trạng thái */}
      </Box>
      <Paper
        elevation={0}
        sx={{
          borderRadius: "20px",
          border: "1px solid #eee",
          overflow: "hidden",

          mx: "auto",
          bgcolor: "#fff",
        }}>
        <Box sx={{ p: { xs: 3, sm: 4, md: 3 } }}>
          <Grid container spacing={{ xs: 4, lg: 6 }}>
            {/* ==================== CỘT TRÁI ==================== */}
            <Grid item xs={12} lg={4}>
              <Typography variant='h6'>Thông tin khách sạn</Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <Stack spacing={3.5}>
                {/* Tên khách sạn */}
                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
                    color='#333'
                    mb={1.2}
                    sx={{ letterSpacing: "-0.2px" }}>
                    Tên khách sạn
                  </Typography>
                  <TextField
                    fullWidth
                    defaultValue='Khách sạn 123'
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
                    defaultValue='0123456789'
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
                      defaultValue='Listing'
                      displayEmpty
                      sx={{
                        height: 50,
                        borderRadius: "12px",
                        bgcolor: "#fafafa",
                        fontSize: 15,
                      }}>
                      <MenuItem value='Listing'>Listing</MenuItem>
                      <MenuItem value='Contract'>Contract</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Vị trí - Bản đồ */}
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
                        }}></GoogleMap>
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
                    defaultValue='Nam Từ Liêm, Hà Nội, Việt Nam'
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

                {/* Quận + Tỉnh/Thành phố */}
                <Grid container justifyContent={"space-between"}>
                  <Grid item xs={5.8}>
                    <Typography
                      fontSize={15}
                      fontWeight={600}
                      color='#333'
                      mb={1.2}>
                      Quận
                    </Typography>
                    <TextField
                      fullWidth
                      defaultValue='Nam Từ Liêm'
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 50,
                          borderRadius: "12px",
                          bgcolor: "#fafafa",
                        },
                      }}
                    />
                  </Grid>
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
                      defaultValue='T.P Hà Nội'
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
              </Stack>
              <Stack mt={2} spacing={1}>
                {/* Mô tả phòng */}
                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
                    color='#333'
                    mb={1}>
                    Mô tả phòng
                  </Typography>
                  <Typography
                    fontSize={13}
                    color='#888'
                    mb={1.5}
                    lineHeight={1.5}>
                    Một đoạn giới thiệu ngắn gọn về loại phòng, hiển thị tại
                    trang chi tiết loại phòng
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder='Nhập mô tả về khách sạn của bạn'
                    variant='outlined'
                    inputProps={{ maxLength: 3000 }}
                    helperText='0/3000'
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

                {/* Chính sách phòng */}
                <Box>
                  <Typography
                    fontSize={15}
                    fontWeight={600}
                    color='#333'
                    mb={1}>
                    Chính sách phòng
                  </Typography>
                  <Typography
                    fontSize={13}
                    color='#888'
                    mb={1.5}
                    lineHeight={1.5}>
                    Chính sách khách sạn về loại phòng phòng
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder='Nhập chính sách phòng của bạn'
                    variant='outlined'
                    inputProps={{ maxLength: 3000 }}
                    helperText='0/3000'
                    FormHelperTextProps={{
                      sx: { textAlign: "right", marginRight: 2, color: "#999" },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "#fafafa",
                        fontSize: 15,
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
              <Typography variant='h6'>Hình ảnh</Typography>
              <Typography color='#5D6679'>
                Thiết lập các thông tin cơ bản của phòng
              </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <HotelImageUpload isPadding={true} />
            </Grid>
          </Grid>
          <Box display={"flex"} justifyContent={"end"} gap={2}>
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
              sx={{
                background: "#98B720",
                color: "white",
                borderRadius: "30px",
                padding: 1,
                px: 2,
              }}>
              Cập nhật
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
