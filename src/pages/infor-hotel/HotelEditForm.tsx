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
} from "@mui/material";

export default function HotelEditFormExact() {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "20px",
        border: "1px solid #eee",
        overflow: "hidden",
        maxWidth: 1000,
        mx: "auto",
        bgcolor: "#fff",
      }}>
      <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
        <Grid container spacing={{ xs: 4, lg: 6 }}>
          {/* ==================== CỘT TRÁI ==================== */}
          <Grid item xs={12} lg={6}>
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
                  <img
                    src='https://maps.googleapis.com/maps/api/staticmap?center=Nam+Từ+Liêm,Hà+Nội&zoom=15&size=640x280&markers=color:red%7CNam+Từ+Liêm,Hà+Nội&key=YOUR_KEY'
                    alt='Bản đồ'
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
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
              <Grid container spacing={2}>
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
          </Grid>

          {/* ==================== CỘT PHẢI ==================== */}
          <Grid item xs={12} lg={6}>
            <Stack spacing={4}>
              {/* Mô tả phòng */}
              <Box>
                <Typography fontSize={15} fontWeight={600} color='#333' mb={1}>
                  Mô tả phòng
                </Typography>
                <Typography
                  fontSize={13}
                  color='#888'
                  mb={1.5}
                  lineHeight={1.5}>
                  Một đoạn giới thiệu ngắn gọn về loại phòng, hiển thị tại trang
                  chi tiết loại phòng
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
                <Typography fontSize={15} fontWeight={600} color='#333' mb={1}>
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
      </Box>
    </Paper>
  );
}
