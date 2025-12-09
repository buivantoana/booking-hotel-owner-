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
} from "@mui/material";
import React, { useState } from "react";
import RoomDetail from "./RoomDetail";

type Props = {};

const ManagerRooms = ({ onNext }) => {
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
        <Box sx={{ mb: 3 }}>
          <Stack direction='row' spacing={4} color='#555' fontSize={14}>
            <Box>
              Tất cả <strong>100</strong>
            </Box>
            <Box>
              Dạng hoạt động <strong>90</strong>
            </Box>
            <Box>
              Ngừng kinh doanh <strong>10</strong>
            </Box>
            <Box>
              Bị từ chối <strong>10</strong>
            </Box>
            <Box>
              Ngừng hợp tác <strong>10</strong>
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
              {/* Dòng có menu thao tác (giống hệt ảnh) */}
              <TableRow hover>
                <TableCell onClick={() => onNext("detail")} fontWeight={500}>
                  Khách sạn 123
                </TableCell>
                <TableCell>
                  <Chip
                    label='Contract'
                    size='small'
                    sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}
                  />
                </TableCell>
                <TableCell>
                  <Chip label='Đang hoạt động' size='small' color='success' />
                </TableCell>
                <TableCell sx={{ maxWidth: 280 }}>
                  110 Đ. Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội
                </TableCell>
                <TableCell>16%</TableCell>
                <TableCell>Cả hai</TableCell>
                <TableCell>
                  <ActionMenu /> {/* ← Đây chính là popup menu 3 mục */}
                </TableCell>
              </TableRow>

              {/* Các dòng khác (giữ nguyên) */}

              {/* Thêm các dòng khác nếu cần... */}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default ManagerRooms;

function ActionMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
          borderColor: "rgba(152, 183, 32, 1)",
          color: "rgba(152, 183, 32, 1)",
          fontWeight: 500,
          minWidth: 110,
          "&:hover": { borderColor: "#bbb" },
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
