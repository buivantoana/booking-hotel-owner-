'use client';

import React from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Pagination,
    Stack,
    useMediaQuery,
    Theme,
    Divider,
} from '@mui/material';
import { CheckCircle, Search as SearchIcon } from '@mui/icons-material';

interface HotelRow {
    id: number;
    name: string;
    address: string;
    month: string;
    status: 'Chưa đối soát' | 'Hoàn thành' | 'Chờ thanh toán';
    rooms: number;
    total: number;
    dueDate: string;
}

const data: HotelRow[] = [
    { id: 1, name: 'Khách sạn 123', address: '110 Đ. Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội', month: 'Tháng 11.2025', status: 'Chưa đối soát', rooms: 3, total: 5000000, dueDate: '31/12/2025' },
    { id: 2, name: 'Khách sạn 123', address: '110 Đ. Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội', month: 'Tháng 11.2025', status: 'Hoàn thành', rooms: 3, total: 5000000, dueDate: '31/12/2025' },
    { id: 3, name: 'Khách sạn 123', address: '110 Đ. Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội', month: 'Tháng 11.2025', status: 'Chưa đối soát', rooms: 3, total: -3600000, dueDate: '31/12/2025' },
    { id: 4, name: 'Khách sạn 123', address: '110 Đ. Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội', month: 'Tháng 11.2025', status: 'Chờ thanh toán', rooms: 3, total: 5000000, dueDate: '31/12/2025' },
    { id: 5, name: 'Khách sạn 123', address: '110 Đ. Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội', month: 'Tháng 11.2025', status: 'Hoàn thành', rooms: 3, total: 5000000, dueDate: '31/12/2025' },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Chưa đối soát': return { bg: '#FFF0F0', color: '#E53935' };
        case 'Hoàn thành': return { bg: '#E8F5E9', color: '#98B720' };
        case 'Chờ thanh toán': return { bg: '#FFF3E0', color: '#EF6C00' };
        default: return { bg: '#F5F5F5', color: '#424242' };
    }
};

const formatCurrency = (amount: number) => {
    const abs = Math.abs(amount).toLocaleString('vi-VN');
    return amount < 0 ? `- ${abs}đ` : `${abs}đ`;
};

export default function ReconciliationView({ hotels,
    idHotel,
    setIdHotel,}) {
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));

    return (
        <>
            <HotelDetailFinal hotels={hotels}
            isMobile={isMobile}
    idHotel={idHotel}
    setIdHotel={setIdHotel} />
            {false && <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h5" fontWeight="600" color="#1a1a1a">
                        Quản lý đối soát
                    </Typography>
                    <Typography variant="body2" color="#e53935" sx={{ fontSize: '0.875rem' }}>
                        <span style={{ color: "#33AE3F" }}> (+) Hotel Booking sẽ thanh toán cho KS</span> <br />
                        (-) KS cần thanh toán cho Hotel Booking
                    </Typography>
                </Box>

                {/* Search & Filter */}
                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="600" mb={2}>
                        Danh sách khách sạn
                    </Typography>

                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        alignItems={{ md: 'center' }}
                        mb={3}
                    >
                        <TextField
                            placeholder="Tên khách sạn"
                            size="small"
                            sx={{ width: { xs: '100%', md: 300 } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <Select defaultValue="" displayEmpty>
                                <MenuItem value="" disabled>Chọn kỳ đối soát</MenuItem>
                                <MenuItem value="11-2025">Tháng 11.2025</MenuItem>
                            </Select>
                        </FormControl>

                        <Box sx={{ display: 'flex', gap: 1, ml: { md: 'auto' } }}>
                            <Button variant="contained" color="success" sx={{ borderRadius: 2, textTransform: 'none', background: "#98B720", color: "white" }}>
                                Tìm kiếm
                            </Button>
                            <Button variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', color: "#48505E", background: "#F0F1F3", border: "none" }}>
                                Xóa tìm kiếm
                            </Button>
                        </Box>
                    </Stack>

                    {/* Tabs */}
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {['Tất cả', 'Chưa đối soát', 'Chờ thanh toán', 'Hoàn thành'].map((tab) => (
                            <Button
                                key={tab}
                                variant={tab === 'Tất cả' ? 'contained' : 'outlined'}
                                size="small"
                                sx={{
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    bgcolor: tab === 'Tất cả' ? '#1976d2' : 'transparent',
                                    '&:hover': { bgcolor: tab === 'Tất cả' ? '#1565c0' : '#f5f5f5' },
                                }}
                            >
                                {tab}
                            </Button>
                        ))}
                    </Stack>
                    <TableContainer sx={{ maxHeight: 'calc(100vh - 380px)', mt: 4 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                    <TableCell sx={{ fontWeight: 600, color: '#424242' }}>#</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#424242' }}>Tên khách sạn</TableCell>
                                    {!isMobile && <TableCell sx={{ fontWeight: 600, color: '#424242' }}>Địa điểm</TableCell>}
                                    <TableCell sx={{ fontWeight: 600, color: '#424242' }}>Kỳ đối soát</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#424242' }}>Trạng thái</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600, color: '#424242' }}>Số loại phòng</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, color: '#424242' }}>Tổng công nợ</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600, color: '#424242' }}>Hạn đối soát</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row) => {
                                    const statusStyle = getStatusColor(row.status);
                                    return (
                                        <TableRow key={row.id} hover>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>
                                                <Typography fontWeight="500">{row.name}</Typography>
                                                {isMobile && (
                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                        {row.address}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            {!isMobile && <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {row.address}
                                                </Typography>
                                            </TableCell>}
                                            <TableCell>{row.month}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.status}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: statusStyle.bg,
                                                        color: statusStyle.color,
                                                        fontWeight: 500,
                                                        height: 26,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">{row.rooms}</TableCell>
                                            <TableCell align="right" sx={{ color: row.total < 0 ? '#e53935' : 'inherit', fontWeight: 500 }}>
                                                {formatCurrency(row.total)}
                                            </TableCell>
                                            <TableCell align="center">{row.dueDate}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'center' }}>
                        <Pagination count={10} page={1} color="primary" />
                    </Box>
                </Paper>

                {/* Table */}

            </Box>}
        </>
    );
}





import {

    IconButton,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,

    Download as DownloadIcon,
} from '@mui/icons-material';



function HotelDetailFinal({ hotels,isMobile,
    idHotel,
    setIdHotel}) {
    return (
        <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh' }}>
            {/* Header – giống 100% */}


            <Box sx={{  p: { xs: 2, sm: 3, md: 4 } }}>
            <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'>
            {/* Left section */}
            <Box display='flex' flexDirection='column' gap={0.5}>
              <Typography variant='h5' fontWeight='bold'>
              Quản lý đối soát
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

               
              </Box>
            </Box>

            
           
          </Box>




                {/* Bảng chi tiết */}
                <Paper sx={{ mt: 3, borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                    <Box
                        sx={{
                            bgcolor: '#98B7200D',
                            border: '1px solid #98B720',
                            borderRadius: 4,
                            p: { xs: 2.5, sm: 3 },

                            mx: 'auto',
                            fontFamily: 'Roboto, sans-serif',
                            mb: 2
                        }}
                    >
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={{ xs: 2, md: 4 }}
                            alignItems={{ md: 'flex-start' }}
                            justifyContent="space-between"
                        >
                            {/* Cột trái: Các dòng công nợ */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                {/* Dòng 1 */}
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                                    <Typography variant="body1" color="#424242">
                                        Công nợ phát sinh trong tháng
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600} color="#98B720">
                                        5.000.000đ
                                    </Typography>
                                </Stack>
                                <Divider sx={{ my: 2 }} />
                                {/* Dòng 2 */}
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                                    <Typography variant="body1" color="#424242">
                                        Công nợ khấu trừ
                                    </Typography>
                                    <Typography variant="h6" fontWeight={600} color="#E53935">
                                        -16.000đ
                                    </Typography>
                                </Stack>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ height: 1, bgcolor: '#E0E0E0', my: 2 }} />

                                {/* Tổng công nợ */}
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                                    <Typography variant="h6" fontWeight={700} color="#98B720">
                                        Tổng công nợ
                                    </Typography>
                                    <Typography variant="h5" fontWeight={700} color="#98B720">
                                        4.984.000đ
                                    </Typography>
                                </Stack>


                                {/* Ghi chú + - */}
                                <Typography variant="caption" color="#E53935" sx={{ lineHeight: 1.5, fontSize: '0.8125rem' }}>
                                    (+) Hotel Booking sẽ thanh toán cho KS<br />
                                    (-) KS cần thanh toán cho Hotel Booking
                                </Typography>
                            </Box>

                            {/* Cột giữa: Thông tin phụ */}
                            <Box sx={{ textAlign: { xs: 'left', md: 'left' }, flexShrink: 0 }}>
                                <Typography variant="body2" color="#616161" gutterBottom>
                                    Thời gian ghi nhận đặt phòng
                                </Typography>
                                <Typography variant="body1" fontWeight={500} color="#424242">
                                    01/11/2025 - 30/11/2025
                                </Typography>

                                <Typography variant="body2" color="#616161" mt={2} gutterBottom>
                                    Số lượng đặt phòng
                                </Typography>
                                <Typography variant="h6" fontWeight={600} color="#1976D2">
                                    10
                                </Typography>
                            </Box>

                            {/* Cột phải: Nút + ghi chú */}
                            <Box sx={{ textAlign: { xs: 'left', md: 'right' }, flexShrink: 0 }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#98B720',
                                        color: 'white',
                                        borderRadius: 10,
                                        px: 5,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        boxShadow: 'none',
                                        mb: 2,
                                        '&:hover': {
                                            bgcolor: '#388E3C',
                                            boxShadow: 'none',
                                        },
                                    }}
                                >
                                    Hoàn tất đối soát
                                </Button>

                                <Typography
                                    variant="body2"
                                    color="#616161"
                                    sx={{
                                        fontSize: '0.875rem',
                                        lineHeight: 1.5,
                                        maxWidth: 340,
                                    }}
                                >
                                    Vui lòng hoàn tất đối soát trước <strong>14:30, 31/12/2025</strong> để nhận thanh toán đúng hạn vào ngày làm việc kế tiếp
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <TextField
                            placeholder="Tìm theo mã đặt phòng"
                            size="small"
                            sx={{ width: { xs: '100%', sm: 340 } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#9e9e9e' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <TableContainer>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                                    {['#', 'Mã đặt phòng', 'Loại phòng', 'Thời gian', 'Tiền phòng', 'Tổng thanh toán', 'Phí hoa hồng', 'Công nợ'].map((h, i, arr) => (
                                        <TableCell
                                            key={h}
                                            align={i === arr.length - 1 ? 'right' : 'left'}
                                            sx={{ fontWeight: 600, color: '#424242', fontSize: '0.875rem' }}
                                        >
                                            {h}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[1, 2, 3, 4, 5].map((i) => {
                                    const isNegative = i === 2;
                                    return (
                                        <TableRow key={i} hover>
                                            <TableCell>{i}</TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>123456</TableCell>
                                            <TableCell>Vip23 - Theo giờ</TableCell>
                                            <TableCell sx={{ color: '#616161', fontSize: '0.875rem', lineHeight: 1.4 }}>
                                                21/10/2025, 09:00<br />21/10/2025, 12:00
                                            </TableCell>
                                            <TableCell>160.000đ</TableCell>
                                            <TableCell>160.000đ</TableCell>
                                            <TableCell sx={{ color: '#616161' }}>16.000đ</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600, color: isNegative ? '#E53935' : '#98B720' }}>
                                                {isNegative ? '-16.000đ' : '144.000đ'}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'center' }}>
                        <Pagination count={10} page={1} shape="rounded" />
                    </Box>
                </Paper>
            </Box>
            <ConfirmCompleteModal />
        </Box>
    );
}


import {
    Dialog,
    DialogContent,
    DialogActions,

} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

function ConfirmCompleteModal({ open = false, onClose = () => { } }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
                    mx: { xs: 2, sm: 0 },
                },
            }}
        >
            {/* Header */}
            <Box sx={{ px: 4, pt: 4, pb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={700} color="#111">
                        Xác nhận hoàn tất đối soát
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </Box>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={4} mb={5}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                        sx={{
                            width: 30,
                            height: 30,
                            bgcolor: '#98B720',
                            color: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            fontWeight: 700,
                        }}
                    >
                        1
                    </Box>
                    <Typography fontWeight={600} fontSize={"12px"} color="#98B720">
                        Xác nhận thông tin tài khoản thanh toán
                    </Typography>
                </Stack>

                <Box sx={{ width: 40, height: 1, borderTop: '2px dashed #BDBDBD' }} />

                <Stack direction="row" alignItems="center" spacing={2}>

                    <Box
                        sx={{
                            width: 30,
                            height: 30,
                            bgcolor: '#EEEEEE',
                            color: '#9E9E9E',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            fontSize: '1rem',
                        }}
                    >
                        2
                    </Box>
                    <Typography fontWeight={600} fontSize={"12px"} color="#9E9E9E">
                        Xác nhận hoàn tất
                    </Typography>
                </Stack>
            </Stack>
            <DialogContent sx={{ px: 4, pb: 3 }}>

            <Typography variant="body1" color="#424242" lineHeight={1.7} mb={4}>
        Bằng việc <strong>xác nhận đối soát ngay</strong>, Hotel Booking và khách sạn thống nhất nội dung đối soát. 
        Sau khi đối soát hoàn tất, các bên sẽ thực hiện nghĩa vụ thanh toán như trong hợp đồng được ký kết.
      </Typography>

      {/* Tiêu đề yêu cầu */}
      <Typography variant="body1" color="#424242" fontWeight={600} mb={3}>
        Vui lòng đánh dấu xác nhận các mục bên dưới để hoàn tất:
      </Typography>

      {/* 2 mục tick xanh */}
      <Stack spacing={2.5} mb={5}>
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          <CheckCircle sx={{ color: '#98B720', fontSize: 28, flexShrink: 0, mt: 0.3 }} />
          <Typography variant="body1" color="#424242" lineHeight={1.7}>
            Bảng đối soát hiện tại <strong>đúng và đủ</strong> các đặt phòng trong kỳ đối soát.
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="flex-start" spacing={2}>
          <CheckCircle sx={{ color: '#98B720', fontSize: 28, flexShrink: 0, mt: 0.3 }} />
          <Typography variant="body1" color="#424242" lineHeight={1.7}>
            Số tiền công nợ <strong>là đúng</strong> theo số tiền trong kỳ đối soát
          </Typography>
        </Stack>
      </Stack>

      {/* Dòng cảnh báo đỏ – giống hệt ảnh */}
      <Typography
        variant="body2"
        color="#E53935"
        fontWeight={500}
        lineHeight={1.7}
        sx={{
          bgcolor: '#FFEBEE',
          padding: '14px 20px',
          borderRadius: 2,
          borderLeft: '4px solid #E53935',
        }}
      >
        Lưu ý: Nếu bạn thấy <strong>đối tượng</strong> thông tin tài khoản thanh toán, bạn cần chờ Hotel Booking xử lý yêu cầu và cập nhật thông tin trên hệ thống.
      </Typography>
            </DialogContent>
            {false && <DialogContent sx={{ px: 4, pb: 3 }}>

            <PaymentQRInfo/>
            </DialogContent>}
           {false&& <DialogContent sx={{ px: 4, pb: 3 }}>
                <Typography variant="h6" fontWeight={600} color="#111" mb={4}>
                    Thông tin tài khoản thanh toán
                </Typography>

                <Stack spacing={3.5}>
                    {/* Số tài khoản */}
                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                        <Typography variant="body2" color="#424242" fontWeight={500} mb={1}>
                            Số tài khoản
                        </Typography>
                        <TextField
                            fullWidth
                            value="0123456789"
                            disabled
                            variant="outlined"
                            sx={{
                                width: "60%",
                                '& .MuiOutlinedInput-root': {
                                    height: 50,
                                    bgcolor: '#FAFAFA',
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    '& fieldset': { borderColor: '#E0E0E0' },
                                    '&.Mui-disabled fieldset': { borderColor: '#E0E0E0' },
                                    '&.Mui-disabled': { bgcolor: '#FAFAFA' },
                                },
                            }}
                        />
                    </Box>

                    {/* Người thụ hưởng */}
                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                        <Typography variant="body2" color="#424242" fontWeight={500} mb={1}>
                            Người thụ hưởng
                        </Typography>
                        <TextField
                            fullWidth
                            value="Nguyễn Văn A"
                            disabled
                            variant="outlined"
                            sx={{
                                width: "60%",
                                '& .MuiOutlinedInput-root': {
                                    height: 50,
                                    bgcolor: '#FAFAFA',
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    '& fieldset': { borderColor: '#E0E0E0' },
                                },
                            }}
                        />
                    </Box>

                    {/* Tên ngân hàng - SELECT thật 100% giống ảnh */}
                    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                        <Typography variant="body2" color="#424242" fontWeight={500} mb={1}>
                            Tên ngân hàng
                        </Typography>
                        <FormControl sx={{ width: "60%" }}>
                            <Select


                                displayEmpty

                                sx={{
                                    height: 50,
                                    bgcolor: '#FAFAFA',
                                    borderRadius: 2,
                                    fontWeight: 500,
                                    fontSize: '1rem',

                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#BDBDBD' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976D2' },
                                    '& .MuiSelect-icon': { color: '#666', fontSize: '28px' },
                                }}
                            >
                                <MenuItem value="techcombank">
                                    Techcombank - Ngân hàng Thương mại Cổ phần Kỹ thương Việt Nam
                                </MenuItem>
                                <MenuItem value="vietcombank">Vietcombank</MenuItem>
                                <MenuItem value="bidv">BIDV</MenuItem>
                                <MenuItem value="mb">MB Bank</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Stack>

                <Divider sx={{ mt: 5, borderColor: '#EEEEEE' }} />

            </DialogContent>}
            {false && <DialogContent sx={{ px: 4, pb: 3 }}>
                {/* Step 1 - 2 */}


                {/* Tiêu đề + nút Chỉnh sửa */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="body1" color="#424242" fontWeight={500}>
                        Thông tin tài khoản thanh toán
                    </Typography>
                    <Button variant="text" sx={{ color: '#1976D2', textTransform: 'none', fontWeight: 500 }}>
                        Chỉnh sửa
                    </Button>
                </Stack>

                {/* Card thông tin tài khoản – giống hệt ảnh */}
                <Box
                    sx={{


                        borderRadius: 3,

                        textAlign: 'left',
                    }}
                >
                    <Stack spacing={2.5}>
                        {/* Số tài khoản */}
                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="#616161" fontWeight={500}>
                                Số tài khoản
                            </Typography>
                            <Typography fontWeight={700} color="#111">
                                0123456789
                            </Typography>
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        {/* Người thụ hưởng */}
                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="#616161" fontWeight={500}>
                                Người thụ hưởng
                            </Typography>
                            <Typography fontWeight={600}>
                                Nguyễn Văn A
                            </Typography>
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        {/* Tên ngân hàng */}
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Typography color="#616161" fontWeight={500}>
                                Tên ngân hàng
                            </Typography>
                            <Typography fontWeight={600} sx={{ maxWidth: 220, textAlign: 'right' }}>
                                Techcombank – Ngân hàng Thương mại Cổ phần Kỹ thương Việt Nam
                            </Typography>
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                    </Stack>
                </Box>
            </DialogContent>}

            {/* Nút hành động */}
            <DialogActions sx={{ px: 4, pb: 4, pt: 2, justifyContent: 'end', gap: 2 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                        minWidth: 120,
                        borderRadius: 10,
                        py: 1.4,
                        textTransform: 'none',
                        borderColor: '#BDBDBD',
                        color: '#424242',
                        fontWeight: 600,
                    }}
                >
                    Hủy
                </Button>

                <Button
                    variant="contained"
                    sx={{
                        minWidth: 140,
                        bgcolor: '#98B720',
                        borderRadius: 10,
                        py: 1.4,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#388E3C', boxShadow: 'none' },
                    }}
                >
                    Tiếp tục
                </Button>
            </DialogActions>
        </Dialog>
    );
}


import { QRCodeCanvas } from 'qrcode.react';// npm install qrcode.react
import HotelSelect from '../../components/HotelSelect';

function PaymentQRInfo() {
    const qrData = "0123456789|Nguyễn Văn A|Techcombank";

    return (
        <Box
            sx={{
               
                mx: 'auto',
                
             
                textAlign: 'center',
                fontFamily: 'Roboto, sans-serif',
            }}
        >
            {/* QR Code */}
            <Box >
            <QRCodeCanvas
          value={qrData}
          size={220}
          level="M"
          includeMargin={true}
        />
            </Box>

            {/* Tiêu đề */}
            <Typography variant="h6" textAlign={"left"} fontWeight={600} color="#111" mb={2}>
                Thông tin tài khoản thanh toán
            </Typography>

            {/* Thông tin chi tiết */}
            <Stack spacing={3}>
                {/* Số tài khoản */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography color="#616161" fontWeight={500}>
                        Số tài khoản
                    </Typography>
                    <Typography fontWeight={700} color="#111" fontSize="1.1rem">
                        0123456789
                    </Typography>
                </Stack>
                <Divider sx={{ borderColor: '#EEEEEE' }} />

                {/* Người thụ hưởng */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography color="#616161" fontWeight={500}>
                        Người thụ hưởng
                    </Typography>
                    <Typography fontWeight={600} color="#111">
                        Nguyễn Văn A
                    </Typography>
                </Stack>
                <Divider sx={{ borderColor: '#EEEEEE' }} />

                {/* Tên ngân hàng */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography color="#616161" fontWeight={500}>
                        Tên ngân hàng
                    </Typography>
                    <Typography
                        fontWeight={600}
                        color="#111"
                        textAlign="right"
                        sx={{ maxWidth: '60%' }}
                    >
                        Techcombank - Ngân hàng Thương mại Cổ phần Kỹ thương Việt Nam
                    </Typography>
                </Stack>
                <Divider sx={{ borderColor: '#EEEEEE' }} />

                {/* Nội dung thanh toán */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography color="#616161" fontWeight={500}>
                        Nội dung thanh toán
                    </Typography>
                    <Typography
                        fontWeight={600}
                        color="#1976D2"
                        textAlign="right"
                        sx={{ maxWidth: '60%', lineHeight: 1.4 }}
                    >
                        Tên khách sạn - Email - Số điện thoại
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
}