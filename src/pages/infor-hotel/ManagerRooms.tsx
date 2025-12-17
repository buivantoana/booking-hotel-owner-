import { ContentCopy, Edit, MoreVert, PauseCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

type Props = {
  onNext: (action: string, roomId?: string) => void;
  detailHotel: any; // dữ liệu hotel từ props
};
const formatPrice = (price: number | null | undefined): string => {
  if (!price || price === 0) return "-";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);
};
const ManagerRooms = ({ onNext, detailHotel, setRoom }: Props) => {
  // Parse room_types từ props
  const roomTypes = React.useMemo(() => {
    if (!detailHotel || !Array.isArray(detailHotel.room_types)) {
      return [];
    }

    return detailHotel.room_types.map((room: any) => ({
      ...room,
      parsedName: JSON.parse(room.name || '{"vi":""}')?.vi || "Không có tên",
      price_hourly_formatted: formatPrice(room.price_hourly),
      price_overnight_formatted: formatPrice(room.price_overnight),
      price_daily_formatted: formatPrice(room.price_daily),
    }));
  }, [detailHotel]);

  const handleRoomClick = (room) => {
    setRoom(room);
    onNext("detail");
  };

  const totalRooms = roomTypes.length;

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid #eee",
          padding: 3,
        }}>
        {/* Thống kê */}
        <Box sx={{ mb: 3 }}>
          <Stack direction='row' spacing={4} color='#555' fontSize={14}>
            <Box>
              Tất cả <strong>{totalRooms}</strong>
            </Box>
            <Box>
              Đang hoạt động <strong>{totalRooms}</strong>
            </Box>
            <Box>
              Ngừng kinh doanh <strong>0</strong>
            </Box>
            <Box>
              Bị từ chối <strong>0</strong>
            </Box>
            <Box>
              Ngừng hợp tác <strong>0</strong>
            </Box>
          </Stack>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                {[
                  "Tên loại phòng",
                  "Trang thái",
                  "SL phòng bán",
                  "Giá theo giờ",
                  "Giá qua đêm",
                  "Giá qua ngày",
                  "",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{ fontWeight: 600, color: "#555", fontSize: 14 }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {roomTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align='center' sx={{ py: 6 }}>
                    <Typography color='#999'>Chưa có loại phòng nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                roomTypes.map((room: any) => (
                  <TableRow key={room.id} hover>
                    {/* Tên loại phòng */}
                    <TableCell
                      onClick={() => handleRoomClick(room)}
                      sx={{
                        fontWeight: 500,
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                          color: "#98B720",
                        },
                      }}>
                      {room.parsedName}
                    </TableCell>

                    {/* Trang thái */}
                    <TableCell>
                      <Chip
                        label='Đang hoạt động'
                        size='small'
                        color='success'
                        variant='outlined'
                      />
                    </TableCell>

                    {/* SL phòng bán - chưa có dữ liệu thực tế */}
                    <TableCell>-</TableCell>

                    {/* Giá theo giờ */}
                    <TableCell>{room.price_hourly_formatted}</TableCell>

                    {/* Giá qua đêm */}
                    <TableCell>{room.price_overnight_formatted}</TableCell>

                    {/* Giá qua ngày */}
                    <TableCell>{room.price_daily_formatted}</TableCell>

                    {/* Thao tác */}
                    <TableCell align='right'>
                      <ActionMenu />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default ManagerRooms;

// Menu thao tác
function ActionMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant='outlined'
        size='small'
        endIcon={<MoreVert />}
        onClick={handleClick}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          borderColor: "#98B720",
          color: "#98B720",
          fontWeight: 500,
          minWidth: 110,
          "&:hover": {
            borderColor: "#98B720",
            bgcolor: "rgba(152, 183, 32, 0.04)",
          },
        }}>
        Thao tác
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            mt: 1,
          },
        }}>
        <MenuItem onClick={handleClose} sx={{ gap: 1.5, fontSize: 14 }}>
          <Edit fontSize='small' sx={{ color: "#666" }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ gap: 1.5, fontSize: 14 }}>
          <ContentCopy fontSize='small' sx={{ color: "#666" }} />
          Nhận bản
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          sx={{ gap: 1.5, fontSize: 14, color: "#d32f2f" }}>
          <PauseCircle fontSize='small' />
          Ngừng kinh doanh
        </MenuItem>
      </Menu>
    </>
  );
}
