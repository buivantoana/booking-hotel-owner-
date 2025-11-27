import React from "react";
import {
  Box,
  TextField,
  Typography,
  useMediaQuery,
  Radio,
  FormControlLabel,
  RadioGroup,
  Card,
} from "@mui/material";

const businessTypes = ["Tình yêu", "Du lịch", "Homestay", "Camping"];

export default function HotelBasicInfo() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const renderTimeCard = (title, fields) => (
    <Card
      sx={{
        p: 2.5,
        borderRadius: 2,
        width: "100%",
        border: "1px solid #E5E7EB",
        
      }}
    >
      <Typography
        fontWeight={600}
        color="#555"
        textAlign="center"
        mb={2}
        fontSize={15}
      >
        {title}
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {fields.map((item, i) => (
          <Box key={i}>
            <Typography fontSize={14} color="#444" mb={0.5}>
              {item.label}
            </Typography>

            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              gap={2}
              alignItems="center"
            >
              <TextField
                
                size="small"
                placeholder={item.startPlaceholder}
              />
              <Typography fontSize={14} color="#555">
                ngày {item.startDay}
              </Typography>
            </Box>

            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              gap={2}
              mt={1.5}
              alignItems="center"
            >
              <TextField
                
                size="small"
                placeholder={item.endPlaceholder}
              />
              <Typography fontSize={14} color="#555">
                ngày {item.endDay}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );

  return (
    <Box p={4} bgcolor={"white"} borderRadius={"15px"} width="100%">
      {/* Row: Tên KS + SĐT */}
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        gap={3}
        mb={3}
      >
        <Box flex={1}>
          <Typography fontSize={14} fontWeight={600} mb={0.8}>
            Tên khách sạn
          </Typography>
          <TextField fullWidth placeholder="Nhập tên khách sạn của bạn" sx={{"& .MuiOutlinedInput-root": {
                    borderRadius: "16px", 
                    height: "50px",
                    backgroundColor: "#fff",
                    "&.Mui-focused fieldset": {
                      borderColor: "#98b720",
                      borderWidth: 1.5,
                    },
                  }}} />
        </Box>

        <Box flex={1}>
          <Typography fontSize={14} fontWeight={600} mb={0.8}>
            Số điện thoại đặt phòng
          </Typography>
          <TextField fullWidth placeholder="Nhập số điện thoại đặt phòng" sx={{"& .MuiOutlinedInput-root": {
                    borderRadius: "16px", 
                    height: "50px",
                    backgroundColor: "#fff",
                    "&.Mui-focused fieldset": {
                      borderColor: "#98b720",
                      borderWidth: 1.5,
                    },
                  }}} />
        </Box>
      </Box>

      {/* Mô tả */}
      <Box mb={4}>
        <Typography fontSize={14} fontWeight={600} mb={0.8}>
          Mô tả (không bắt buộc)
        </Typography>
        <Typography fontSize={12} color="#5D6679"  mb={1}>
        Viết một đoạn giới thiệu ngắn gọn về khách sạn của bạn. Mô tả sẽ được hiển thị tại trang chủ của khách sạn trên Hotel Booking.
        </Typography>
        <TextField
          fullWidth
          placeholder="Nhập mô tả về khách sạn của bạn"
          multiline
          rows={4}
          sx={{"& .MuiOutlinedInput-root": {
            borderRadius: "16px", 
           
            backgroundColor: "#fff",
            "&.Mui-focused fieldset": {
              borderColor: "#98b720",
              borderWidth: 1.5,
            },
          }}}
        />
        <Typography fontSize={12} textAlign="right" mt={0.5} color="#999">
          0/3000
        </Typography>
      </Box>

      {/* Loại hình kinh doanh */}
      <Box mb={4}>
        <Typography fontSize={14} fontWeight={600} mb={1.5}>
          Loại hình kinh doanh
        </Typography>

        <RadioGroup row defaultValue="Tình yêu">
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

      {/* Thời gian kinh doanh */}
      <Box mb={2}>
        <Typography fontSize={14} fontWeight={600} mb={2}>
          Thời gian kinh doanh
        </Typography>

        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          gap={3}
        >
          {/* Theo giờ */}
          {renderTimeCard("Theo giờ", [
            {
              label: "Bắt đầu",
              startPlaceholder: "08:00",
              startDay: "T",
              endPlaceholder: "21:00",
              endDay: "T",
            },
          ])}

          {/* Qua đêm */}
          {renderTimeCard("Qua đêm", [
            {
              label: "Bắt đầu",
              startPlaceholder: "21:00",
              startDay: "T",
              endPlaceholder: "08:00",
              endDay: "T+1",
            },
          ])}

          {/* Theo ngày */}
          {renderTimeCard("Theo ngày", [
            {
              label: "Bắt đầu",
              startPlaceholder: "14:00",
              startDay: "T",
              endPlaceholder: "12:00",
              endDay: "T+1",
            },
          ])}
        </Box>
      </Box>
    </Box>
  );
}
