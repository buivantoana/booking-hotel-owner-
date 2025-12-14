"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Stack,
  Chip,
  Avatar,
  Popper,
  Paper,
  ClickAwayListener,
  Button,
  Tabs,
  Tab,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  Tooltip,
} from "recharts";
import {
  LocalizationProvider,
  DateCalendar,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import start from "../../images/star.svg";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/vi";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale("vi");

// Icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NightShelterIcon from "@mui/icons-material/NightShelter";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Star } from "@mui/icons-material";
const CARD_CONFIG = [
  {
    key: "hourly",
    title: "Đặt phòng theo giờ",
    icon: AccessTimeIcon,
    color: "#FF6B6B",
  },
  {
    key: "overnight",
    title: "Đặt phòng qua đêm",
    icon: NightShelterIcon,
    color: "#4DABF7",
  },
  {
    key: "daily",
    title: "Đặt phòng theo ngày",
    icon: FlightTakeoffIcon,
    color: "#FFC048",
  },
];
// Styled Components
const CompareBar = styled(Box)({
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  padding: "4px 12px",
  fontSize: "0.8rem",
  color: "#666",
});

const WeekPickerButton = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 12px",
  border: "1px solid #e0e0e0",
  borderRadius: 8,
  backgroundColor: "#fff",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: 500,
  minWidth: 170,
  "&:hover": { borderColor: "#999" },
}));

// Custom Day - Theo tuần
function WeekDay(
  props: PickersDayProps<Dayjs> & { selectedDate?: Dayjs | null }
) {
  const { selectedDate, day, outsideCurrentMonth, ...other } = props;
  if (!selectedDate || outsideCurrentMonth)
    return (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
      />
    );

  const start = selectedDate.startOf("week");
  const end = selectedDate.endOf("week");
  const isInWeek =
    day.isSameOrAfter(start, "day") && day.isSameOrBefore(end, "day");
  const isSelected = day.isSame(selectedDate, "day");

  return (
    <PickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      sx={{
        ...(isInWeek && {
          backgroundColor: "#E8F5E8",
          color: "#2E7D32",
          fontWeight: 600,
          borderRadius: 0,
          "&:first-of-type": {
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          },
          "&:last-of-type": {
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
          },
        }),
        ...(isSelected && {
          backgroundColor: "#4CAF50 !important",
          color: "white !important",
          fontWeight: "bold",
        }),
      }}
    />
  );
}

// Custom Day - Theo tháng
function MonthDay(
  props: PickersDayProps<Dayjs> & { selectedDate?: Dayjs | null }
) {
  const { selectedDate, day, outsideCurrentMonth, ...other } = props;
  if (!selectedDate || outsideCurrentMonth)
    return (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
      />
    );

  const isInMonth = day.isSame(selectedDate, "month");
  const isSelected = day.isSame(selectedDate, "day");

  return (
    <PickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      sx={{
        ...(isInMonth && {
          backgroundColor: "#E8F5E8",
          color: "#2E7D32",
          fontWeight: 600,
          borderRadius: "50%",
        }),
        ...(isSelected && {
          backgroundColor: "#4CAF50 !important",
          color: "white !important",
          fontWeight: "bold",
        }),
      }}
    />
  );
}

// Week & Month Picker - SIÊU ĐẸP
type ViewMode = "week" | "month";

const WeekMonthPicker: React.FC<{
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
}> = ({ value, onChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mode, setMode] = useState<ViewMode>("week");

  const open = Boolean(anchorEl);

  const handleClick = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDateChange = (newDate: Dayjs | null) => {
    onChange(newDate);
    handleClose();
  };

  const formatDisplay = () => {
    if (!value) return mode === "week" ? "Tuần này" : "Tháng này";
    if (mode === "week") {
      const start = value.startOf("week").format("DD/MM");
      const end = value.endOf("week").format("DD/MM/YYYY");
      return `${start} - ${end}`;
    } else {
      return value.format("MM/YYYY");
    }
  };

  return (
    <>
      <WeekPickerButton onClick={handleClick}>
        <CalendarTodayIcon sx={{ fontSize: 16, color: "#666" }} />
        <Box component='span'>{formatDisplay()}</Box>
        <KeyboardArrowDownIcon
          sx={{ fontSize: 18, ml: "auto", color: "#666" }}
        />
      </WeekPickerButton>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement='bottom-start'
        sx={{ zIndex: 9999 }}>
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            elevation={12}
            sx={{ mt: 1, borderRadius: 3, overflow: "hidden", width: 340 }}>
            <Tabs
              value={mode}
              onChange={(_, v) => setMode(v)}
              centered
              sx={{ bgcolor: "#f5f5f5" }}>
              <Tab
                label='Theo tuần'
                value='week'
                sx={{ fontWeight: 600, minWidth: 100 }}
              />
              <Tab
                label='Theo tháng'
                value='month'
                sx={{ fontWeight: 600, minWidth: 100 }}
              />
            </Tabs>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='vi'>
              {mode === "week" ? (
                <DateCalendar
                  value={value}
                  onChange={handleDateChange}
                  disableFuture
                  showDaysOutsideCurrentMonth
                  fixedWeekNumber={6}
                  slots={{ day: WeekDay }}
                  slotProps={{ day: { selectedDate: value } as any }}
                  sx={{ "& .MuiPickersDay-root": { borderRadius: 0 } }}
                />
              ) : (
                <DateCalendar
                  value={value}
                  onChange={handleDateChange}
                  views={["year", "month", "day"]}
                  disableFuture
                  slots={{ day: MonthDay }}
                  slotProps={{ day: { selectedDate: value } as any }}
                />
              )}
            </LocalizationProvider>

            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #e0e0e0",
                bgcolor: "#fafafa",
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
              }}>
              <Button onClick={handleClose} sx={{ color: "#666" }}>
                Hủy
              </Button>
              <Button
                onClick={handleClose}
                variant='contained'
                sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#43a047" } }}>
                Đồng ý
              </Button>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

// Custom Dot
const CustomDot = (props: any) => {
  const { cx, cy } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill='#3B82F6'
      stroke='#fff'
      strokeWidth={3}
    />
  );
};

// Dữ liệu
const visitData = [
  { day: "Thứ 2", prev: 3, current: 4 },
  { day: "Thứ 3", prev: 5, current: 6 },
  { day: "Thứ 4", prev: 7, current: 9 },
  { day: "Thứ 5", prev: 4, current: 5 },
  { day: "Thứ 6", prev: 6, current: 7 },
  { day: "Thứ 7", prev: 8, current: 10 },
  { day: "Chủ nhật", prev: 2, current: 2 },
];

const viewData = [
  { day: "Thứ 2", prev: 220, current: 240 },
  { day: "Thứ 3", prev: 180, current: 220 },
  { day: "Thứ 4", prev: 280, current: 320 },
  { day: "Thứ 5", prev: 240, current: 260 },
  { day: "Thứ 6", prev: 280, current: 300 },
  { day: "Thứ 7", prev: 350, current: 380 },
  { day: "Chủ nhật", prev: 150, current: 180 },
];

const revenueCompareData = [
  { day: "Thứ 2", prev: 250000, current: 320000 },
  { day: "Thứ 3", prev: 280000, current: 350000 },
  { day: "Thứ 4", prev: 300000, current: 380000 },
  { day: "Thứ 5", prev: 220000, current: 290000 },
  { day: "Thứ 6", prev: 400000, current: 720000 },
  { day: "Thứ 7", prev: 450000, current: 800000 },
  { day: "Chủ nhật", prev: 180000, current: 220000 },
];

const revenueStackData = [
  { day: "Thứ 2", prepaid: 180000, onsite: 140000 },
  { day: "Thứ 3", prepaid: 200000, onsite: 150000 },
  { day: "Thứ 4", prepaid: 220000, onsite: 160000 },
  { day: "Thứ 5", prepaid: 180000, onsite: 110000 },
  { day: "Thứ 6", prepaid: 500000, onsite: 220000 },
  { day: "Thứ 7", prepaid: 600000, onsite: 200000 },
  { day: "Chủ nhật", prepaid: 150000, onsite: 70000 },
];

const formatCurrency = (value: number) =>
  value >= 1000000
    ? `${(value / 1000000).toFixed(0)}tr`
    : `${(value / 1000).toFixed(0)}k`;

// Performance Chart
const PerformanceChart = ({
  title,
  value,
  change,
  subtitle,
  data,
  markedDate,
}: any) => {
  const isVisit = title.includes("ghé thăm");
  const [selectedPeriod, setSelectedPeriod] = useState<Dayjs | null>(dayjs());

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%" }}>
      <CardContent sx={{ pb: 4 }}>
        <Typography variant='h6' fontWeight='bold' gutterBottom>
          {title}
        </Typography>

        <Stack direction='row' alignItems='center' gap={2} mb={1}>
          <Typography
            variant='h3'
            fontWeight='bold'
            sx={{ fontSize: "2.5rem" }}>
            {value}
          </Typography>
          <Chip
            label={change}
            size='small'
            sx={{
              bgcolor: "#E6F4EA",
              color: "#1A9739",
              fontWeight: "bold",
              height: 32,
            }}
          />
        </Stack>

        <Typography variant='body2' color='text.secondary' mb={3}>
          {subtitle}
        </Typography>

        <Stack direction='row' alignItems='center' gap={2} mb={3}>
          <WeekMonthPicker
            value={selectedPeriod}
            onChange={setSelectedPeriod}
          />
          <CompareBar>So sánh với kỳ trước</CompareBar>
        </Stack>

        <Box sx={{ height: 280, position: "relative" }}>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={data}
              margin={{ top: 40, right: 30, bottom: 30, left: 40 }}>
              <CartesianGrid
                stroke='#f0f0f0'
                vertical={false}
                strokeDasharray='5 5'
              />
              <XAxis
                dataKey='day'
                tick={{ fontSize: 12, fill: "#888" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#888" }}
                axisLine={false}
                tickLine={false}
                ticks={
                  isVisit
                    ? [0, 2, 4, 6, 8, 10]
                    : [0, 50, 100, 150, 200, 250, 300, 350, 400]
                }
                domain={isVisit ? [0, 10] : [0, 400]}
              />
              <Line
                type='monotone'
                dataKey='prev'
                stroke='#BDC3C7'
                strokeWidth={2}
                strokeDasharray='7 7'
                dot={false}
              />
              <Line
                type='monotone'
                dataKey='current'
                stroke='#3B82F6'
                strokeWidth={3.5}
                dot={<CustomDot />}
                activeDot={{ r: 7 }}
              />
              <ReferenceLine x='Thứ 4' stroke='#ddd' strokeWidth={1.5} />

              <foreignObject x='42%' y='50' width='140' height='60'>
                <Box
                  sx={{
                    bgcolor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    px: 1.8,
                    py: 1,
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: 13,
                  }}>
                  <Typography variant='subtitle2' fontWeight='bold'>
                    {markedDate}
                  </Typography>
                  <Typography
                    variant='caption'
                    color='#3B82F6'
                    fontWeight='medium'>
                    {markedDate}
                  </Typography>
                </Box>
              </foreignObject>
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Stack direction='row' justifyContent='center' spacing={4} mt={3}>
          <Stack direction='row' alignItems='center' gap={1.5}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "#3B82F6",
              }}
            />
            <Typography variant='body2' color='#666' fontWeight={500}>
              Kỳ này
            </Typography>
          </Stack>
          <Stack direction='row' alignItems='center' gap={1.5}>
            <Box
              sx={{ width: 20, height: 2, bgcolor: "#BDC3C7", borderRadius: 1 }}
            />
            <Typography variant='body2' color='#666' fontWeight={500}>
              Kỳ trước
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Doanh thu
const RevenueCompareChart = () => (
  <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
    <CardContent>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='flex-start'
        mb={2}>
        <Box>
          <Typography variant='h6' fontWeight='bold'>
            Doanh thu hàng tuần
          </Typography>
          <Stack direction='row' alignItems='center' gap={2} mt={1}>
            <Typography variant='h4' fontWeight='bold'>
              5.000.000đ
            </Typography>
            <Chip
              label='26% so với tuần trước'
              sx={{ bgcolor: "#E6F4EA", color: "#1A9739", fontWeight: "bold" }}
            />
          </Stack>
          <Typography variant='body2' color='text.secondary' mt={1}>
            doanh thu đang tăng – bạn hãy thêm những ưu đãi để hút khách hơn nữa
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ height: 300, mt: 4 }}>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={revenueCompareData}
            margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#f0f0f0'
              vertical={false}
            />
            <XAxis
              dataKey='day'
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()}đ`}
            />
            <Bar
              dataKey='prev'
              fill='#BBDEFB'
              radius={[8, 8, 0, 0]}
              barSize={24}
            />
            <Bar
              dataKey='current'
              fill='#2196F3'
              radius={[8, 8, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Stack direction='row' justifyContent='center' spacing={4} mt={2}>
        <Stack direction='row' alignItems='center' gap={1.5}>
          <Box
            sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: "#BBDEFB" }}
          />
          <Typography variant='body2' color='text.secondary'>
            Tuần trước
          </Typography>
        </Stack>
        <Stack direction='row' alignItems='center' gap={1.5}>
          <Box
            sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: "#2196F3" }}
          />
          <Typography variant='body2' color='text.secondary'>
            Tuần này
          </Typography>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

const RevenuePaymentChart = ({
  setDateRangeRevenueMethod,
  dateRangeRevenueMethod,
}) => (
  <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
    <CardContent>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='flex-start'
        mb={2}>
        <Box>
          <Typography variant='h6' fontWeight='bold'>
            Khách hàng thanh toán
          </Typography>
          <Typography variant='h4' fontWeight='bold' mt={1}>
            5.000.000đ
          </Typography>
        </Box>
        <SimpleDatePopup
          value={dateRangeRevenueMethod}
          onChange={setDateRangeRevenueMethod}
        />
      </Stack>

      <Box sx={{ height: 300, mt: 4 }}>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={revenueStackData}
            margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#f0f0f0'
              vertical={false}
            />
            <XAxis
              dataKey='day'
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()}đ`}
            />
            <Bar dataKey='prepaid' stackId='a' fill='#FFB300' />
            <Bar
              dataKey='onsite'
              stackId='a'
              fill='#42A5F5'
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Stack direction='row' justifyContent='center' spacing={4} mt={2}>
        <Stack direction='row' alignItems='center' gap={1.5}>
          <Box
            sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: "#FFB300" }}
          />
          <Typography variant='body2' color='text.secondary'>
            Trả trước
          </Typography>
        </Stack>
        <Stack direction='row' alignItems='center' gap={1.5}>
          <Box
            sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: "#42A5F5" }}
          />
          <Typography variant='body2' color='text.secondary'>
            Trả tại khách sạn
          </Typography>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

// Main Component
export default function HomeView({
  setDateRange,
  dateRange,
  dataGeneral,
  setDateRangeRevenueMethod,
  dateRangeRevenueMethod,
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const BOOKING_ITEMS = [
    {
      key: "total",
      label: "Tổng số đơn",
      color: "#495057",
    },
    {
      key: "pending_hotel",
      label: "Chờ khách sạn xác nhận",
      color: "#FAB005",
    },
    {
      key: "pending_checkin",
      label: "Chờ nhận phòng",
      color: "#4DABF7",
    },
    {
      key: "checked_in",
      label: "Đang ở",
      color: "#51CF66",
    },
    {
      key: "completed",
      label: "Hoàn tất",
      color: "#ADB5BD",
    },
  ];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const bookingItems = [
    { label: "Chờ nhận phòng", value: 1, color: "#FF6B6B" },
    { label: "Đã nhận phòng", value: 0, color: "#4DABF7" },
    { label: "Chờ Hotel Booking xử lý", value: 0, color: "#FFC048" },
    { label: "Hoàn thành", value: 1, color: "#1A9739" },
  ];

  return (
    <Box sx={{ bgcolor: "#f9f9f9", p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <NotificationPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent='space-between'
        alignItems='center'
        mb={5}
        gap={2}>
        <Box>
          <Typography variant='h5' fontWeight='bold'>
            Trang chủ
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Khách sạn 123
          </Typography>
        </Box>
        <Stack direction='row' gap={2} alignItems='center'>
          <Chip
            label='Xem tất cả đặt phòng'
            sx={{
              bgcolor: "#C8E6C9",
              color: "#2E7D32",
              fontWeight: "bold",
              borderRadius: 20,
            }}
          />
          <Avatar onClick={handleClick} sx={{}}>
            <NotificationsNoneIcon />
          </Avatar>
        </Stack>
      </Stack>

      {/* Tổng quan đặt phòng */}
      <Box display={"flex"} justifyContent={"space-between"}>
        <Box>
          <Typography variant='h6' fontWeight='bold' mb={1}>
            Tổng quan đặt phòng
          </Typography>
          <Typography variant='body2' color='text.secondary' mb={4}>
            Tổng quan đặt phòng khách sạn của bạn trong hôm nay
          </Typography>
        </Box>
        <SimpleDateSearchBar value={dateRange} onChange={setDateRange} />
      </Box>

      <Grid container spacing={3} mb={6}>
        {CARD_CONFIG.map((card) => {
          const cardData = dataGeneral[card.key as keyof typeof dataGeneral];

          return (
            <Grid item xs={12} md={4} key={card.key}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    mb={3}>
                    <Avatar
                      sx={{
                        bgcolor: card.color,
                        width: 56,
                        height: 56,
                      }}>
                      <card.icon sx={{ fontSize: 32, color: "white" }} />
                    </Avatar>

                    <Typography variant='h6' fontWeight='bold'>
                      {card.title}
                    </Typography>
                  </Stack>

                  {BOOKING_ITEMS.map((item) => (
                    <Stack
                      key={item.key}
                      direction='row'
                      justifyContent='space-between'
                      alignItems='center'
                      py={0.8}>
                      <Stack direction='row' alignItems='center' gap={1.5}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: item.color,
                          }}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          {item.label}
                        </Typography>
                      </Stack>

                      <Typography fontWeight='bold' fontSize='1rem'>
                        {cardData?.[item.key as keyof typeof cardData] ?? 0}
                      </Typography>
                    </Stack>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Hiệu suất */}
      <Typography variant='h6' fontWeight='bold' mb={4}>
        Hiệu suất khách sạn
      </Typography>

      <Grid container spacing={3} mb={8}>
        <Grid item xs={12} md={6}>
          <PerformanceChart
            title='Khách ghé thăm'
            value='86'
            change='26% so với tuần trước'
            subtitle='Khách ghé thăm tăng – bạn hãy thêm những ưu đãi để hút khách hơn nữa'
            data={visitData}
            markedDate='04/11/2025'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PerformanceChart
            title='Lượt xem'
            value='260'
            change='26% so với tuần trước'
            subtitle='Khách ít quan tâm – bạn hãy thử chiến dịch truyền thông để kéo lại sự chú ý'
            data={viewData}
            markedDate='28/10/2025'
          />
        </Grid>
      </Grid>

      {/* Doanh thu */}
      <Typography variant='h6' fontWeight='bold' mb={4}>
        Doanh thu
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RevenueCompareChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <RevenuePaymentChart
            setDateRangeRevenueMethod={setDateRangeRevenueMethod}
            dateRangeRevenueMethod={dateRangeRevenueMethod}
          />
        </Grid>
      </Grid>
      <Review />
    </Box>
  );
}

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
    <Stack mt={5} spacing={4}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}>
        <Typography variant='h6' fontWeight='bold'>
          Tổng quan Đánh giá
        </Typography>

        <Button
          variant='outlined'
          sx={{
            borderColor: "#98b720",
            color: "#98b720",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            mt: 3,
            px: 2,
            py: 1,
            alignSelf: "flex-start",
            "&:hover": { borderColor: "#7a9a1a", bgcolor: "#f0f8f0" },
          }}>
          Show All Reviews
        </Button>
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
          <Grid container alignItems='center'>
            {/* Tổng điểm */}
            <Grid item xs={12} md={6}>
              <Box display={"flex"} gap={2}>
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
                <Box>
                  <Typography
                    fontWeight={600}
                    fontSize='1.4rem'
                    color='rgba(152, 183, 32, 1)'>
                    Xuất sắc
                  </Typography>
                  <Typography fontSize='0.85rem' color='rgba(43, 47, 56, 1)'>
                    Từ {reviews.length} đánh giá
                  </Typography>
                  <Typography fontSize='0.8rem' color='#999'>
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

        {/* DANH SÁCH REVIEW */}
        <Grid mt={5} container justifyContent={"space-between"}>
          {reviews.slice(0, 3).map((review) => {
            return (
              <Grid item xs={12} md={3.8} key={review.id}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    p: 2.5,
                    border: "1px solid #eee",
                    bgcolor: "white",
                  }}>
                  <Stack spacing={1.5}>
                    <Stack
                      direction='row'
                      spacing={1.5}
                      justifyContent={"space-between"}
                      alignItems='center'>
                      <img
                        src={review?.avatar}
                        width={40}
                        height={40}
                        style={{ borderRadius: "50%" }}
                        alt=''
                      />
                      <Box
                        display={"flex"}
                        width={"90%"}
                        justifyContent={"space-between"}>
                        <Box>
                          <Typography
                            fontWeight={600}
                            fontSize='0.95rem'
                            color='#333'>
                            {review.user_name}
                          </Typography>
                          <Stack direction='row' spacing={0.5}>
                            {renderStars(review.rate)}
                          </Stack>
                        </Box>

                        <Box display={"flex"} alignItems={"start"} gap={1}>
                          <Typography fontSize='0.75rem' color='#999'>
                            {review.created_at}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>

                    <Typography
                      fontSize='0.9rem'
                      color='#666'
                      lineHeight={1.6}
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",

                        WebkitBoxOrient: "vertical",
                      }}>
                      {review.comment}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Card>
    </Stack>
  );
};

import { Popover, Divider, Badge } from "@mui/material";
import {
  Notifications,
  AccessTime,
  Hotel,
  CheckCircle,
  Cancel,
  Receipt,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SimpleDateSearchBar from "../../components/SimpleDateSearchBar";
import SimpleDateSelect from "../../components/SimpleDateSelect";
import SimpleDatePopup from "../../components/SimpleDateSelect";

const StyledPopover = styled(Popover)(({ theme }) => ({
  "& .MuiPopover-paper": {
    width: "100%",
    maxWidth: 420,
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
      margin: 8,
      borderRadius: 20,
    },
  },
}));

const NotificationItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: "#fff",
  "&:hover": {
    backgroundColor: "#f9f9f9",
  },
  cursor: "pointer",
}));

const TimeText = styled(Typography)({
  fontSize: "12px",
  color: "#999",
  marginTop: 8,
});

function NotificationPopover({ handleClick, anchorEl, setAnchorEl }) {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Fake data giống hệt ảnh bạn gửi
  const bookingNotifications = [
    {
      type: "success",
      title: "Bạn có đặt phòng theo giờ",
      hotel: "Khách sạn 123",
      roomType: "Vip 123",
      time: "Từ 14:00 đến 16:00, 11/24/2025",
      timeAgo: "1 phút trước",
    },
    {
      type: "cancel",
      title: "Khách đã hủy phòng theo giờ",
      hotel: "Khách sạn 123",
      roomType: "Vip 123",
      time: "Từ 14:00 đến 16:00, 11/24/2025",
      timeAgo: "1 phút trước",
    },
    {
      type: "success",
      title: "Bạn có đặt phòng theo giờ",
      hotel: "Khách sạn 123",
      roomType: "Vip 123",
      time: "Từ 14:00 đến 16:00, 11/24/2025",
      timeAgo: "1 phút trước",
    },
  ];

  const paymentNotifications = [
    {
      type: "pending",
      title: "Thanh toán đối soát tháng 11, 2025 đã được Hotel Booking xử lý:",
      hotel: "Khách sạn 123",
      amount: "1.000.000đ",
      rooms: 2,
      timeAgo: "1 phút trước",
    },
    {
      type: "completed",
      title: "Hotel Booking đã gửi đối soát tháng 11, 2025:",
      hotel: "Khách sạn 123",
      amount: "1.000.000đ",
      rooms: 2,
      timeAgo: "1 phút trước",
    },
    {
      type: "rejected",
      title: "Đối soát tháng 11,2025 đang được Hotel Booking xử lý:",
      hotel: "Khách sạn 123",
      amount: "1.000.000đ",
      rooms: 2,
      timeAgo: "1 phút trước",
    },
  ];

  return (
    <>
      {/* Nút mở popover (thường là icon chuông) */}

      <StyledPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}>
        <Box>
          {/* Header */}
          <Box
            px={3}
            py={2}
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            borderBottom='1px solid #eee'>
            <Typography variant='h6' fontWeight={700}>
              Thông báo
            </Typography>
            <Button
              onClick={() => navigate("/notificate")}
              size='small'
              sx={{ textTransform: "none", fontSize: "14px" }}>
              Xem tất cả
            </Button>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant='fullWidth'
            sx={{
              borderBottom: "1px solid #eee",
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "14.5px",
                fontWeight: 600,
              },
              "& .Mui-selected": {
                color: "#4caf50",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#4caf50",
                height: 3,
              },
            }}>
            <Tab label='Đặt phòng' />
            <Tab label='Đối soát và thanh toán' />
          </Tabs>

          {/* Nội dung tab */}
          <Box maxHeight='70vh' sx={{ overflowY: "auto" }}>
            {tab === 0
              ? // Tab Đặt phòng
                bookingNotifications.map((notif, i) => (
                  <NotificationItem key={i}>
                    <Stack direction='row' spacing={2} alignItems='flex-start'>
                      <Badge
                        badgeContent=' '
                        color='error'
                        variant='dot'
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        sx={{
                          "& .MuiBadge-badge": {
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                          },
                        }}>
                        <Avatar
                          sx={{
                            bgcolor:
                              notif.type === "success"
                                ? "#e8f5e9"
                                : notif.type === "cancel"
                                ? "#ffebee"
                                : "#fff3e0",
                            width: 44,
                            height: 44,
                          }}>
                          {notif.type === "success" ? (
                            <CheckCircle sx={{ color: "#4caf50" }} />
                          ) : notif.type === "cancel" ? (
                            <Cancel sx={{ color: "#e53935" }} />
                          ) : (
                            <Hotel sx={{ color: "#fb8c00" }} />
                          )}
                        </Avatar>
                      </Badge>

                      <Box flex={1}>
                        <Typography fontWeight={600} fontSize='15px' mb={0.5}>
                          {notif.title}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          • Khách sạn: {notif.hotel}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          • Loại phòng: {notif.roomType}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          • Thời gian: {notif.time}
                        </Typography>
                        <TimeText>{notif.timeAgo}</TimeText>
                      </Box>
                    </Stack>
                    {i < bookingNotifications.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </NotificationItem>
                ))
              : // Tab Đối soát và thanh toán
                paymentNotifications.map((notif, i) => (
                  <NotificationItem key={i}>
                    <Stack direction='row' spacing={2} alignItems='flex-start'>
                      <Badge
                        badgeContent=' '
                        color='error'
                        variant='dot'
                        invisible={notif.type === "completed"}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                        <Avatar
                          sx={{
                            bgcolor:
                              notif.type === "pending"
                                ? "#fff3e0"
                                : notif.type === "completed"
                                ? "#e8f5e9"
                                : "#fff8e1",
                            width: 44,
                            height: 44,
                          }}>
                          <Receipt
                            sx={{
                              color:
                                notif.type === "pending"
                                  ? "#fb8c00"
                                  : notif.type === "completed"
                                  ? "#4caf50"
                                  : "#ef6c00",
                            }}
                          />
                        </Avatar>
                      </Badge>

                      <Box flex={1}>
                        <Typography fontWeight={600} fontSize='15px' mb={0.5}>
                          {notif.title}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          • Khách sạn: {notif.hotel}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          • Tổng cộng nợ: {notif.amount}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          • Số lượng đặt phòng: {notif.rooms}
                        </Typography>
                        <TimeText>{notif.timeAgo}</TimeText>
                      </Box>
                    </Stack>
                    {i < paymentNotifications.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </NotificationItem>
                ))}
          </Box>
        </Box>
      </StyledPopover>
    </>
  );
}
