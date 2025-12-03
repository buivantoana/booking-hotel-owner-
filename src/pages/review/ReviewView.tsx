import { CheckCircle, Star } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import start from "../../images/star.svg";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
type Props = {};

const ReviewView = (props: Props) => {
  return (
    <Box sx={{ bgcolor: "#f9f9f9", p: { xs: 2, sm: 3, md: 4 } }}>
      <Review />
      {/* <ReviewCard /> */}
      <HotelReview />
    </Box>
  );
};

export default ReviewView;

const Review = () => {
  let reviews = [
    {
      id: "0wCyv2zNIl4K",
      hotel_id: "bW8lRnD4jVq1",
      booking_id: null,
      user_id: null,
      user_name: "David Brown",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      rate: 3,
      hashtags: [],
      comment: "Phòng cách âm chưa tốt nhưng tổng thể ổn.",
      created_at: "2025-12-03T04:22:37",
      owner_reply: null,
      owner_reply_at: null,
      attachments: [],
    },
    {
      id: "7Vlop3EOohec",
      hotel_id: "bW8lRnD4jVq1",
      booking_id: null,
      user_id: null,
      user_name: "Emma Smith",
      avatar: "https://randomuser.me/api/portraits/men/31.jpg",
      rate: 4,
      hashtags: [],
      comment: "Phòng cách âm chưa tốt nhưng tổng thể ổn.",
      created_at: "2025-12-03T04:22:37",
      owner_reply: null,
      owner_reply_at: null,
      attachments: [],
    },
    {
      id: "jkQk8ZVGUzgq",
      hotel_id: "bW8lRnD4jVq1",
      booking_id: null,
      user_id: null,
      user_name: "Emma Smith",
      avatar: "https://randomuser.me/api/portraits/men/31.jpg",
      rate: 3,
      hashtags: [],
      comment: "Bữa sáng ngon, view đẹp, rất hài lòng!",
      created_at: "2025-12-03T04:22:37",
      owner_reply: null,
      owner_reply_at: null,
      attachments: [],
    },
    {
      id: "ZBibS9MKBdvq",
      hotel_id: "bW8lRnD4jVq1",
      booking_id: null,
      user_id: null,
      user_name: "Daniel Chen",
      avatar: "https://randomuser.me/api/portraits/women/25.jpg",
      rate: 5,
      hashtags: [],
      comment: "Dịch vụ tốt nhưng phòng hơi nhỏ.",
      created_at: "2025-12-03T04:22:37",
      owner_reply: null,
      owner_reply_at: null,
      attachments: [],
    },
  ];
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        sx={{
          fontSize: 14,
          color: i < Math.floor(rating) ? "#98b720" : "#e0e0e0",
        }}
      />
    ));
  };
  const avgRate =
    reviews.reduce((acc, r) => acc + r.rate, 0) / (reviews.length || 1);
  const starCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rate === star).length
  );

  return (
    <Stack spacing={4}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}>
        <Typography variant='h6' fontWeight='bold'>
          Tổng quan Đánh giá
        </Typography>
      </Box>

      {/* TỔNG ĐIỂM */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, p: 4 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            py: 3,

            px: 0,
          }}>
          <Grid container alignItems='start'>
            {/* Tổng điểm */}
            <Grid item xs={12} md={6}>
              <Box display={"flex"} gap={4}>
                <Box
                  sx={{
                    bgcolor: "#98b720",
                    color: "white",
                    borderRadius: "12px",
                    px: 5,
                    py: 2.5,
                    fontSize: "2rem",
                    fontWeight: 700,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Typography variant='h2'>{avgRate.toFixed(1)}</Typography>
                </Box>
                <Box display={"flex"} flexDirection={"column"} gap={2}>
                  <Typography
                    fontWeight={600}
                    fontSize='1.7rem'
                    color='rgba(152, 183, 32, 1)'>
                    Xuất sắc
                  </Typography>
                  <Typography fontSize='1.1rem' color='rgba(43, 47, 56, 1)'>
                    Từ {reviews.length} đánh giá
                  </Typography>
                  <Typography fontSize='0.9rem' color='#999'>
                    Bởi người dùng trong Booking Hotel
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Biểu đồ rating */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                {[5, 4, 3, 2, 1].map((star, idx) => (
                  <Stack
                    key={star}
                    direction='row'
                    alignItems='center'
                    spacing={2}>
                    <Typography
                      width={40}
                      fontSize='0.9rem'
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                      color='#666'>
                      {star} <img src={start} alt='' />
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant='determinate'
                        value={starCounts[idx]}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "#98b720",
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                    <Typography
                      fontWeight={600}
                      fontSize='0.9rem'
                      color='#98b720'>
                      {starCounts[idx]}/100
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Card>
    </Stack>
  );
};

const ReviewCard = () => {
  let reviews = [
    {
      id: "0wCyv2zNIl4K",
      hotel_id: "bW8lRnD4jVq1",
      booking_id: null,
      user_id: null,
      user_name: "David Brown",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      rate: 3,
      hashtags: [],
      comment: "Phòng cách âm chưa tốt nhưng tổng thể ổn.",
      created_at: "2025-12-03T04:22:37",
      owner_reply: null,
      owner_reply_at: null,
      attachments: [],
    },
    {
      id: "7Vlop3EOohec",
      hotel_id: "bW8lRnD4jVq1",
      booking_id: null,
      user_id: null,
      user_name: "Emma Smith",
      avatar: "https://randomuser.me/api/portraits/men/31.jpg",
      rate: 4,
      hashtags: [],
      comment: "Phòng cách âm chưa tốt nhưng tổng thể ổn.",
      created_at: "2025-12-03T04:22:37",
      owner_reply: null,
      owner_reply_at: null,
      attachments: [],
    },
    {
      id: "jkQk8ZVGUzgq",
      hotel_id: "bW8lRnD4jVq1",
      booking_id: null,
      user_id: null,
      user_name: "Emma Smith",
      avatar: "https://randomuser.me/api/portraits/men/31.jpg",
      rate: 3,
      hashtags: [],
      comment: "Bữa sáng ngon, view đẹp, rất hài lòng!",
      created_at: "2025-12-03T04:22:37",
      owner_reply: null,
      owner_reply_at: null,
      attachments: [],
    },
    {
      id: "ZBibS9MKBdvq",
      hotel_id: "bW8lRnD4jVq1",
      booking_id: null,
      user_id: null,
      user_name: "Daniel Chen",
      avatar: "https://randomuser.me/api/portraits/women/25.jpg",
      rate: 5,
      hashtags: [],
      comment: "Dịch vụ tốt nhưng phòng hơi nhỏ.",
      created_at: "2025-12-03T04:22:37",
      owner_reply: null,
      owner_reply_at: null,
      attachments: [],
    },
  ];
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        sx={{
          fontSize: 14,
          color: i < Math.floor(rating) ? "#98b720" : "#e0e0e0",
        }}
      />
    ));
  };
  const avgRate =
    reviews.reduce((acc, r) => acc + r.rate, 0) / (reviews.length || 1);
  const starCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rate === star).length
  );

  return (
    <Stack mt={3} spacing={4}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}>
        <Typography variant='h6' fontWeight='bold'>
          Danh sách khách sạn
        </Typography>
      </Box>

      {/* TỔNG ĐIỂM */}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        gap={3}
        flexWrap={"wrap"}>
        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2, width: "28%" }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "16px",
              py: 0,
              px: 0,
            }}>
            <Grid alignItems='center' flexDirection={"column"}>
              {/* Tổng điểm */}
              <Grid item xs={12} md={12}>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}>
                  <Typography variant='h6' fontWeight={500}>
                    Khách sạn 123
                  </Typography>
                  <Typography
                    display={"flex"}
                    alignItems={"center"}
                    color='rgba(234, 106, 0, 1)'
                    fontSize={".8rem"}>
                    Xem chi tiết <NavigateNextIcon sx={{ fontSize: "18px" }} />
                  </Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"} gap={4}>
                  <Box
                    sx={{
                      color: "black",
                      borderRadius: "12px",
                      py: 2,
                      fontSize: "2rem",
                      fontWeight: 700,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Typography variant='h5'>{avgRate.toFixed(1)}</Typography>
                  </Box>
                  <Box display={"flex"} flexDirection={"column"}>
                    <Typography
                      fontWeight={600}
                      fontSize='1rem'
                      color='rgba(152, 183, 32, 1)'>
                      Xuất sắc
                    </Typography>
                    <Typography fontSize='.9rem' color='rgba(43, 47, 56, 1)'>
                      Từ {reviews.length} đánh giá
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Biểu đồ rating */}
              <Grid item xs={12} md={12}>
                <Stack width={"100%"} spacing={2}>
                  {[5, 4, 3, 2, 1].map((star, idx) => (
                    <Stack
                      key={star}
                      direction='row'
                      alignItems='center'
                      spacing={2}>
                      <Typography
                        width={40}
                        fontSize='0.9rem'
                        display={"flex"}
                        alignItems={"center"}
                        gap={1}
                        color='#666'>
                        {star} <img src={start} alt='' />
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant='determinate'
                          value={starCounts[idx]}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: "#e0e0e0",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: "#98b720",
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>
                      <Typography
                        fontWeight={600}
                        fontSize='0.9rem'
                        color='#98b720'>
                        {starCounts[idx]}/100
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Card>
        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2, width: "28%" }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "16px",
              py: 0,
              px: 0,
            }}>
            <Grid alignItems='center' flexDirection={"column"}>
              {/* Tổng điểm */}
              <Grid item xs={12} md={12}>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}>
                  <Typography variant='h6' fontWeight={500}>
                    Khách sạn 123
                  </Typography>
                  <Typography
                    display={"flex"}
                    alignItems={"center"}
                    color='rgba(234, 106, 0, 1)'
                    fontSize={".8rem"}>
                    Xem chi tiết <NavigateNextIcon sx={{ fontSize: "18px" }} />
                  </Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"} gap={4}>
                  <Box
                    sx={{
                      color: "black",
                      borderRadius: "12px",
                      py: 2,
                      fontSize: "2rem",
                      fontWeight: 700,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Typography variant='h5'>{avgRate.toFixed(1)}</Typography>
                  </Box>
                  <Box display={"flex"} flexDirection={"column"}>
                    <Typography
                      fontWeight={600}
                      fontSize='1rem'
                      color='rgba(152, 183, 32, 1)'>
                      Xuất sắc
                    </Typography>
                    <Typography fontSize='.9rem' color='rgba(43, 47, 56, 1)'>
                      Từ {reviews.length} đánh giá
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Biểu đồ rating */}
              <Grid item xs={12} md={12}>
                <Stack width={"100%"} spacing={2}>
                  {[5, 4, 3, 2, 1].map((star, idx) => (
                    <Stack
                      key={star}
                      direction='row'
                      alignItems='center'
                      spacing={2}>
                      <Typography
                        width={40}
                        fontSize='0.9rem'
                        display={"flex"}
                        alignItems={"center"}
                        gap={1}
                        color='#666'>
                        {star} <img src={start} alt='' />
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant='determinate'
                          value={starCounts[idx]}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: "#e0e0e0",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: "#98b720",
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>
                      <Typography
                        fontWeight={600}
                        fontSize='0.9rem'
                        color='#98b720'>
                        {starCounts[idx]}/100
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Card>
        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2, width: "28%" }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "16px",
              py: 0,
              px: 0,
            }}>
            <Grid alignItems='center' flexDirection={"column"}>
              {/* Tổng điểm */}
              <Grid item xs={12} md={12}>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}>
                  <Typography variant='h6' fontWeight={500}>
                    Khách sạn 123
                  </Typography>
                  <Typography
                    display={"flex"}
                    alignItems={"center"}
                    color='rgba(234, 106, 0, 1)'
                    fontSize={".8rem"}>
                    Xem chi tiết <NavigateNextIcon sx={{ fontSize: "18px" }} />
                  </Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"} gap={4}>
                  <Box
                    sx={{
                      color: "black",
                      borderRadius: "12px",
                      py: 2,
                      fontSize: "2rem",
                      fontWeight: 700,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Typography variant='h5'>{avgRate.toFixed(1)}</Typography>
                  </Box>
                  <Box display={"flex"} flexDirection={"column"}>
                    <Typography
                      fontWeight={600}
                      fontSize='1rem'
                      color='rgba(152, 183, 32, 1)'>
                      Xuất sắc
                    </Typography>
                    <Typography fontSize='.9rem' color='rgba(43, 47, 56, 1)'>
                      Từ {reviews.length} đánh giá
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Biểu đồ rating */}
              <Grid item xs={12} md={12}>
                <Stack width={"100%"} spacing={2}>
                  {[5, 4, 3, 2, 1].map((star, idx) => (
                    <Stack
                      key={star}
                      direction='row'
                      alignItems='center'
                      spacing={2}>
                      <Typography
                        width={40}
                        fontSize='0.9rem'
                        display={"flex"}
                        alignItems={"center"}
                        gap={1}
                        color='#666'>
                        {star} <img src={start} alt='' />
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant='determinate'
                          value={starCounts[idx]}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: "#e0e0e0",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: "#98b720",
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>
                      <Typography
                        fontWeight={600}
                        fontSize='0.9rem'
                        color='#98b720'>
                        {starCounts[idx]}/100
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Card>
        <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2, width: "28%" }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "16px",
              py: 0,
              px: 0,
            }}>
            <Grid alignItems='center' flexDirection={"column"}>
              {/* Tổng điểm */}
              <Grid item xs={12} md={12}>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}>
                  <Typography variant='h6' fontWeight={500}>
                    Khách sạn 123
                  </Typography>
                  <Typography
                    display={"flex"}
                    alignItems={"center"}
                    color='rgba(234, 106, 0, 1)'
                    fontSize={".8rem"}>
                    Xem chi tiết <NavigateNextIcon sx={{ fontSize: "18px" }} />
                  </Typography>
                </Box>
                <Box display={"flex"} alignItems={"center"} gap={4}>
                  <Box
                    sx={{
                      color: "black",
                      borderRadius: "12px",
                      py: 2,
                      fontSize: "2rem",
                      fontWeight: 700,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Typography variant='h5'>{avgRate.toFixed(1)}</Typography>
                  </Box>
                  <Box display={"flex"} flexDirection={"column"}>
                    <Typography
                      fontWeight={600}
                      fontSize='1rem'
                      color='rgba(152, 183, 32, 1)'>
                      Xuất sắc
                    </Typography>
                    <Typography fontSize='.9rem' color='rgba(43, 47, 56, 1)'>
                      Từ {reviews.length} đánh giá
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Biểu đồ rating */}
              <Grid item xs={12} md={12}>
                <Stack width={"100%"} spacing={2}>
                  {[5, 4, 3, 2, 1].map((star, idx) => (
                    <Stack
                      key={star}
                      direction='row'
                      alignItems='center'
                      spacing={2}>
                      <Typography
                        width={40}
                        fontSize='0.9rem'
                        display={"flex"}
                        alignItems={"center"}
                        gap={1}
                        color='#666'>
                        {star} <img src={start} alt='' />
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant='determinate'
                          value={starCounts[idx]}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: "#e0e0e0",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: "#98b720",
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>
                      <Typography
                        fontWeight={600}
                        fontSize='0.9rem'
                        color='#98b720'>
                        {starCounts[idx]}/100
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Card>
      </Box>
    </Stack>
  );
};

("use client");

import { useState } from "react";
import {
  StarBorder,
  AccessTime,
  Bed,
  KeyboardArrowDown,
} from "@mui/icons-material";
import {
  Avatar,
  Chip,
  Container,
  Divider,
  Tab,
  Tabs,
  styled,
} from "@mui/material";

// Styled components giống hệt thiết kế
const ReviewCardDetail = styled(Paper)(({ theme }) => ({
  borderRadius: 0,
  overflow: "hidden",
  boxShadow: 0,
}));

const ReviewContent = styled(Box)({
  borderRadius: "0 0 16px 16px",
  display: "flex",
});

const ReplyButton = styled(Button)({
  backgroundColor: "rgba(152, 183, 32, 1)",
  color: "white",
  borderRadius: 15,
  textTransform: "none",
  fontWeight: 600,
  fontSize: "15px",
  padding: "10px 32px",
  boxShadow: "0 2px 4px rgba(102,187,106,0.3)",
  "&:hover": {
    backgroundColor: "#57a05a",
  },
});

const EmptyCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  backgroundColor: "#f9f9f9",
  borderRadius: 16,
  color: "#999",
  fontSize: "15px",
}));

function HotelReview() {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const reviews = [
    {
      id: 1,
      bookingId: "1234567",
      name: "Thang Do",
      rating: 5,
      date: "21:22 12/11/2025",
      content: "Phòng đẹp",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
      ],
    },
    {
      id: 1,
      bookingId: "1234567",
      name: "Thang Do",
      rating: 5,
      date: "21:22 12/11/2025",
      content: "Phòng đẹp",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
      ],
    },
  ];

  const currentReviews = tab === 1 ? [] : tab === 2 ? [] : reviews;

  return (
    <Box>
      <Box
        my={3}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}>
        <Typography variant='h6' fontWeight='bold'>
          Danh sách đánh giá
        </Typography>
      </Box>
      <Card sx={{ borderRadius: 3, boxShadow: 3, p: 4 }}>
        {/* Tabs - giống hệt app */}

        {/* Sort button */}
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant='fullWidth'
            sx={{
              width: "50%",
              "& .MuiTabs-flexContainer": { gap: 1 },
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 500,

                borderRadius: 5,
                color: "#999",
              },
              "& .Mui-selected": {
                backgroundColor: "rgba(240, 241, 243, 1)",
                color: "rgba(43, 47, 56, 1) !important",
                fontWeight: 600,
              },
              "& .MuiTabs-indicator": { display: "none" },
            }}>
            <Tab
              sx={{ p: 0, borderRadius: "10px !important" }}
              label='Tất cả'
            />
            <Tab
              sx={{ p: 0, borderRadius: "10px !important" }}
              label='Chưa phản hồi'
            />
            <Tab
              sx={{ p: 0, borderRadius: "10px !important" }}
              label='Đã phản hồi'
            />
          </Tabs>
          <Button
            variant='outlined'
            size='small'
            endIcon={<KeyboardArrowDown />}
            sx={{
              borderRadius: 20,
              textTransform: "none",
              borderColor: "#ddd",
              color: "#666",
              fontSize: "14px",
            }}>
            Mới nhất
          </Button>
        </Box>

        {/* Review List */}
        {currentReviews.length === 0 ? (
          <EmptyCard elevation={0}>
            Người dùng không có nhận xét về phòng này
          </EmptyCard>
        ) : (
          currentReviews.map((review, index) => (
            <ReviewCardDetail
              sx={{
                padding: 0,
                py: 2,
                borderBottom:
                  index == currentReviews.length - 1
                    ? "none"
                    : "2px solid rgba(208, 211, 217, 1)",
              }}
              key={review.id}
              elevation={0}>
              {/* Header: Mã đặt phòng + chip */}
              <Box pb={2}>
                <Stack
                  direction='row'
                  alignItems='center'
                  spacing={2}
                  flexWrap='wrap'>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    fontSize='14px'>
                    Mã đặt phòng: {review.bookingId}
                  </Typography>
                  <Chip
                    icon={<AccessTime sx={{ fontSize: 16 }} />}
                    label='Theo giờ'
                    size='small'
                    sx={{
                      bgcolor: "#e8f5e9",
                      color: "#2e7d32",
                      fontSize: "13px",
                      height: 26,
                    }}
                  />
                  <Chip
                    icon={<Bed sx={{ fontSize: 16 }} />}
                    label='Phòng luxury'
                    size='small'
                    sx={{
                      bgcolor: "#fff3e0",
                      color: "#ef6c00",
                      fontSize: "13px",
                      height: 26,
                    }}
                  />
                </Stack>
              </Box>

              {/* Nội dung đánh giá */}

              <ReviewContent sx={{ justifyContent: "space-between" }}>
                <Box width={"26%"}>
                  <Stack direction='row' spacing={2}>
                    <Avatar
                      sx={{
                        bgcolor: "#ffb74d",
                        width: 44,
                        height: 44,
                        fontWeight: "bold",
                      }}>
                      {review.name[0]}
                    </Avatar>
                    <Stack direction='column' mb={0.5}>
                      <Typography fontWeight={600} fontSize='15px'>
                        {review.name}
                      </Typography>
                      <Box display='flex'>
                        {[...Array(5)].map((_, i) =>
                          i < review.rating ? (
                            <Star
                              key={i}
                              sx={{ color: "#ffb400", fontSize: 20 }}
                            />
                          ) : (
                            <StarBorder
                              key={i}
                              sx={{ color: "#e0e0e0", fontSize: 20 }}
                            />
                          )
                        )}
                      </Box>
                    </Stack>
                  </Stack>
                  <Typography
                    mt={1}
                    variant='body2'
                    color='text.secondary'
                    fontSize='13px'>
                    Đánh giá lúc {review.date}
                  </Typography>
                </Box>

                <Box width={"70%"}>
                  <Typography
                    variant='body1'
                    mt={2}
                    mb={2}
                    fontSize='15px'
                    sx={{
                      width: "100%",
                      p: 3,
                      background: "rgba(240, 241, 243, 1)",
                      borderRadius: 1,
                    }}
                    fontWeight={500}>
                    {review.content}
                  </Typography>

                  {/* Ảnh đánh giá */}
                  <Stack direction='row' spacing={1.5} mt={1}>
                    {review.images.map((img, i) => (
                      <Box
                        key={i}
                        component='img'
                        src={img}
                        alt='review'
                        sx={{
                          width: { xs: "48%", sm: 100 },
                          height: 100,
                          borderRadius: 1,
                          objectFit: "cover",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                    ))}
                  </Stack>

                  {/* Nút Trả lời */}
                  <Box textAlign='right' mt={2}>
                    <ReplyButton onClick={() => setOpen(true)}>
                      Trả lời
                    </ReplyButton>
                  </Box>
                </Box>
              </ReviewContent>
            </ReviewCardDetail>
          ))
        )}
      </Card>
      <ReviewDetailModal setOpen={setOpen} open={open} />
    </Box>
  );
}

import {
  Dialog,
  DialogContent,
  TextField,
  IconButton,
  Rating,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const StyledModal = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 24,
    maxWidth: 620,
    width: "95%",
    margin: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
}));

const ReplyButtonModal = styled(Button)({
  backgroundColor: "rgba(152, 183, 32, 1)",
  color: "white",
  borderRadius: 30,
  textTransform: "none",
  width: "100%",

  fontWeight: 600,
  fontSize: "16px",
  padding: "12px 40px",
  boxShadow: "none",
  marginTop: "20px",
  "&:hover": {
    backgroundColor: "rgba(152, 183, 32, 1)",
  },
});

function ReviewDetailModal({ open, setOpen }) {
  const [replyText, setReplyText] = useState("");

  return (
    <StyledModal open={open} onClose={() => setOpen(false)}>
      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        {/* Header xanh + điểm + nút đóng */}
        <Box
          sx={{
            p: 2,

            position: "relative",
          }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}>
            <Close />
          </IconButton>

          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'>
            <Typography variant='h6' fontWeight={600}>
              Chi tiết đánh giá
            </Typography>
          </Stack>
        </Box>

        {/* Thông tin đặt phòng */}
        <Box px={3} pt={3}>
          <Stack direction='row' alignItems='center' spacing={2} mb={2}>
            <Typography variant='body2' color='text.secondary'>
              Mã đặt phòng: 1234567
            </Typography>
            <Chip
              icon={<Bed sx={{ fontSize: 16 }} />}
              label='Phòng luxury'
              size='small'
              sx={{ bgcolor: "#fff3e0", color: "#ef6c00", fontSize: 13 }}
            />
          </Stack>

          {/* Chip Theo giờ + thời gian */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#f8fcf8",
              borderRadius: "12px",
              p: 1.5,
              border: "1px solid #98b720",
              textAlign: "center",
              mb: 2,
            }}>
            <Stack
              direction='row'
              spacing={0.5}
              alignItems='center'
              justifyContent='start'
              mb={1}>
              <CheckCircle sx={{ fontSize: 16, color: "#98b720" }} />
              <Typography fontSize='0.75rem' color='#98b720' fontWeight={600}>
                Theo giờ
              </Typography>
            </Stack>
            <Divider />
            <Grid container spacing={0.5} mt={1} fontSize='0.7rem'>
              <Grid item xs={4}>
                <Typography color='#888' fontSize='0.75rem'>
                  Nhận phòng
                </Typography>
                <Typography fontWeight={600} color='#333' fontSize='0.8rem'>
                  16:00, 3/12
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{ borderLeft: "1px solid #ddd", textAlign: "center" }}>
                <Typography color='#888' fontSize='0.75rem'>
                  Trả phòng
                </Typography>
                <Typography fontWeight={600} color='#333' fontSize='0.8rem'>
                  18:00, 3/12
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{ borderLeft: "1px solid #ddd", textAlign: "center" }}>
                <Typography color='#888' fontSize='0.75rem'>
                  Số giờ
                </Typography>
                <Typography fontWeight={600} color='#333' fontSize='0.8rem'>
                  02 giờ
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Người đánh giá */}
          <Stack direction='row' spacing={2} alignItems='flex-start'>
            <Avatar sx={{ bgcolor: "#ffb74d", width: 48, height: 48 }}>
              T
            </Avatar>
            <Box flex={1}>
              <Stack>
                <Typography fontWeight={600}>Thang Do</Typography>
                <Rating value={5} readOnly size='small' />
              </Stack>

              {/* Nội dung đánh giá */}
            </Box>
          </Stack>
          <Typography mt={2} variant='body2' color='text.secondary'>
            Đánh giá lúc 21:22 12/11/2025
          </Typography>

          <Typography
            variant='body1'
            mt={2}
            mb={2}
            fontSize='15px'
            sx={{
              width: "calc(100% - 40px)",
              p: "20px",
              background: "rgba(240, 241, 243, 1)",
              borderRadius: 1,
            }}
            fontWeight={500}>
            Phong dep
          </Typography>

          {/* Ô nhập trả lời */}

          <TextField
            multiline
            rows={4}
            placeholder='Trả lời cho đánh giá này...'
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            variant='outlined'
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,

                "& fieldset": { borderColor: "#e0e0e0" },
              },
            }}
          />

          {/* Nút gửi */}

          <ReplyButtonModal>Gửi trả lời</ReplyButtonModal>
        </Box>
      </DialogContent>
    </StyledModal>
  );
}
