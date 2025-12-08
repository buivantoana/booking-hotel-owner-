import { Box, Typography, Button, Chip } from "@mui/material";
import { ArrowBackIos, Edit as EditIcon } from "@mui/icons-material";

export default function HotelDetail() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Phần header trên cùng */}
      <Box
        sx={{
          px: 4,
          py: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #eee",
        }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ArrowBackIos
            sx={{
              fontSize: 20,
              color: "#666",
              cursor: "pointer",
              "&:hover": { color: "#333" },
            }}
            onClick={() => window.history.back()}
          />

          <Box>
            <Typography
              fontSize={22}
              fontWeight={700}
              color='#222'
              sx={{ lineHeight: 1.2 }}>
              Khách sạn 123
            </Typography>
          </Box>

          {/* Badge trạng thái */}
          <Chip
            label='Đang hoạt động'
            size='small'
            sx={{
              bgcolor: "#e8f5e9",
              color: "#2e7d32",
              fontWeight: 600,
              fontSize: 13,
              height: 28,
              borderRadius: "16px",
            }}
          />
        </Box>
        <Box />
      </Box>

      {/* Thanh tab + nút chỉnh sửa */}

      <HotelInfoDetail />
    </Box>
  );
}

import { Grid, Paper, Avatar, Stack, Divider } from "@mui/material";
import { LocationOn, Star, Edit } from "@mui/icons-material";
import image from "../../images/Rectangle 29975.png";
function HotelInfoDetail() {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid #eee",
        bgcolor: "#fff",
        p: { xs: 2, sm: 3, md: 4 },
      }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}>
        {/* Tab điều hướng */}
        <Box sx={{ display: "flex", gap: 4 }}>
          <Typography
            fontSize={16}
            fontWeight={600}
            color='#4caf50'
            sx={{
              borderBottom: "3px solid #66bb6a",
              pb: 1.5,
              cursor: "pointer",
            }}>
            Thông tin chung
          </Typography>
          <Typography
            fontSize={16}
            fontWeight={500}
            color='#999'
            sx={{ cursor: "pointer" }}>
            Loại phòng
          </Typography>
        </Box>

        {/* Nút Chỉnh sửa */}
        <Button
          variant='contained'
          startIcon={<EditIcon />}
          sx={{
            bgcolor: "#66bb6a",
            color: "white",
            fontWeight: 600,
            fontSize: 15,
            px: 4,
            py: 1.4,
            borderRadius: "50px",
            textTransform: "none",
            boxShadow: "0 4px 16px rgba(102,187,106,0.4)",
            "&:hover": {
              bgcolor: "#4caf50",
              boxShadow: "0 6px 20px rgba(76,175,80,0.5)",
            },
          }}>
          Chỉnh sửa
        </Button>
      </Box>
      <Grid container spacing={{ xs: 3, md: 4 }}>
        {/* Cột 1: Hình ảnh khách sạn */}
        <Grid item xs={12} md={4}>
          <Typography fontSize={16} fontWeight={600} color='#333' mb={2}>
            Hình ảnh khách sạn
          </Typography>

          {/* Ảnh chính */}
          <Box
            sx={{
              borderRadius: "16px",
              overflow: "hidden",
              mb: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
            <img
              src={image} // thay bằng ảnh thật của bạn
              alt='Phòng khách sạn'
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </Box>

          {/* 3 ảnh nhỏ bên dưới */}
          <Stack direction='row' spacing={1}>
            {[1, 2, 3].map((i) => (
              <Box
                key={i}
                sx={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  flex: 1,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}>
                <img
                  src={image}
                  alt={`Ảnh ${i}`}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* Cột 2: Thông tin chính */}
        <Grid item xs={12} md={4}>
          <Typography fontSize={16} fontWeight={600} color='#333' mb={2}>
            Tên khách sạn/ Mã
          </Typography>
          <Typography fontSize={18} fontWeight={700} color='#222' mb={3}>
            Khách sạn 123 (ABC_123456)
          </Typography>

          <Stack spacing={2.5}>
            <Box>
              <Typography fontSize={14} color='black' fontWeight={600}>
                Email
              </Typography>
              <Typography fontSize={15} color='#333'>
                ABC@gmail.com
              </Typography>
            </Box>

            <Box>
              <Typography fontSize={14} color='black' fontWeight={600}>
                Số điện thoại
              </Typography>
              <Typography fontSize={15} color='#333'>
                0123456789
              </Typography>
            </Box>

            <Box>
              <Typography fontSize={14} color='black' fontWeight={600}>
                Theo giờ/ Qua đêm/ Theo ngày
              </Typography>
              <Typography fontSize={15} color='#333'>
                08:00 ~ 22:00 / 22:00 ~ 08:00 / 14:00 ~ 12:00
              </Typography>
            </Box>

            <Box>
              <Typography fontSize={14} color='black' fontWeight={600}>
                Nhận thông báo đặt phòng
              </Typography>
              <Typography fontSize={15} color='#333'>
                Tin nhắn/ Email/ Ứng dụng Hotel Booking
              </Typography>
            </Box>

            <Box>
              <Typography fontSize={14} color='black' fontWeight={600}>
                Phương thức thanh toán
              </Typography>
              <Typography fontSize={15} color='#333'>
                Trả trước/ Trả tại khách sạn
              </Typography>
            </Box>

            <Box>
              <Typography fontSize={14} color='black' fontWeight={600}>
                Tỉnh thành/ Quận
              </Typography>
              <Typography fontSize={15} color='#333'>
                Nam Từ Liêm/ TP.Hà Nội
              </Typography>
            </Box>

            <Box>
              <Typography fontSize={14} color='black' fontWeight={600}>
                Địa chỉ
              </Typography>
              <Typography fontSize={15} color='#333'>
                Nam Từ Liêm, Việt Nam
              </Typography>
            </Box>
          </Stack>
        </Grid>

        {/* Cột 3: Thông tin phụ + đánh giá */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Box>
              <Typography fontSize={14} color='black' fontWeight={600}>
                Mô tả
              </Typography>
              <Typography fontSize={15} color='#333'>
                Có
              </Typography>
            </Box>

            <Box>
              <Typography fontSize={14} color='black' fontWeight={600}>
                Chính sách khách sạn
              </Typography>
              <Typography fontSize={15} color='#333'>
                Không
              </Typography>
            </Box>

            <Box>
              <Typography fontSize={14} color='black' fontWeight={600}>
                Tổng bình luận
              </Typography>
              <Typography fontSize={15} color='#333' fontWeight={600}>
                100 lượt bình luận
              </Typography>
            </Box>

            <Box>
              <Typography fontSize={14} color='black' fontWeight={600}>
                Đánh giá
              </Typography>
              <Stack direction='row' alignItems='center' spacing={1}>
                <Star sx={{ color: "#ffb400" }} />
                <Typography fontSize={18} fontWeight={700} color='#333'>
                  5 sao
                </Typography>
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography fontSize={14} color='black' fontWeight={600}>
                Tình trạng hợp tác
              </Typography>
              <Chip
                label='Listing'
                size='small'
                sx={{
                  bgcolor: "#f3e5f5",
                  color: "#7b1fa2",
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box>
              <Typography fontSize={14} color='black' fontWeight={600}>
                Loại khách sạn
              </Typography>
              <Typography fontSize={15} color='#333'>
                Du lịch
              </Typography>
            </Box>

            <Box>
              <Typography fontSize={14} color='black' fontWeight={600}>
                Có phòng
              </Typography>
              <Typography fontSize={15} color='#333'>
                Có
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
      <Divider sx={{ my: 4 }} />
      <RoomTypeCard />
    </Paper>
  );
}

function RoomTypeCard() {
  return (
    <Grid container spacing={{ xs: 3, md: 4 }}>
      {/* Cột 1: Hình ảnh khách sạn */}
      <Grid item xs={12} md={4}>
        {/* Ảnh chính */}
        <Box
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            mb: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}>
          <img
            src={image} // thay bằng ảnh thật của bạn
            alt='Phòng khách sạn'
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </Box>

        {/* 3 ảnh nhỏ bên dưới */}
        <Stack direction='row' spacing={1}>
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                flex: 1,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}>
              <img
                src={image}
                alt={`Ảnh ${i}`}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </Box>
          ))}
        </Stack>
      </Grid>

      {/* Cột 2: Thông tin chính */}
      <Grid item xs={12} md={4}>
        <Stack spacing={2.5}>
          <Box>
            <Typography fontSize={14} color='black' fontWeight={600}>
              Loại phòng
            </Typography>
            <Typography fontSize={15} color='#333'>
              Vip 206
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={14} color='black' fontWeight={600}>
              Giá 2 giờ đầu
            </Typography>
            <Typography fontSize={15} color='#333'>
              0123456789
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={14} color='black' fontWeight={600}>
              Giá thêm giờ
            </Typography>
            <Typography fontSize={15} color='#333'>
              08:00 ~ 22:00 / 22:00 ~ 08:00 / 14:00 ~ 12:00
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={14} color='black' fontWeight={600}>
              Giá qua đêm
            </Typography>
            <Typography fontSize={15} color='#333'>
              Tin nhắn/ Email/ Ứng dụng Hotel Booking
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={14} color='black' fontWeight={600}>
              Giá qua ngày
            </Typography>
            <Typography fontSize={15} color='#333'>
              Trả trước/ Trả tại khách sạn
            </Typography>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
}
