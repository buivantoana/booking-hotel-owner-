import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  ContentCopy as ContentCopyIcon,
  PauseCircleOutline as PauseCircleIcon,
  Close,
} from "@mui/icons-material";
import { useState } from "react";
import remove from "../../images/delete.png";
import HotelDetail from "./HotelDetail";
import HotelEditForm from "./HotelEditForm";
import RoomDetail from "./RoomDetail";

// Component menu thao tác
function ActionMenu({ setAction, setDeleteDialogOpen }) {
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
        endIcon={<MoreVertIcon />}
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
        <MenuItem
          onClick={() => setAction("edit_form")}
          sx={{ gap: 1.5, fontSize: 14 }}>
          <EditIcon fontSize='small' sx={{ color: "#666" }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ gap: 1.5, fontSize: 14 }}>
          <ContentCopyIcon fontSize='small' sx={{ color: "#666" }} />
          Nhận bản
        </MenuItem>
        <MenuItem
          onClick={() => setDeleteDialogOpen(true)}
          sx={{ gap: 1.5, fontSize: 14, color: "#d32f2f" }}>
          <PauseCircleIcon fontSize='small' />
          Ngừng kinh doanh
        </MenuItem>
      </Menu>
    </>
  );
}

export default function InforHotelView() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [action, setAction] = useState("manager");
  return (
    <Box sx={{ p: 3, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      {action == "detail" && <RoomDetail onNext={setAction} />}
      {action == "edit_form" && <HotelEditForm setAction={setAction} />}
      {action == "edit_detail" && <HotelDetail setAction={setAction} />}
      {action == "manager" && (
        <>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}>
            <Typography variant='h5' fontWeight={600} color='#333'>
              Thông tin khách sạn
            </Typography>

            <Button
              variant='contained'
              startIcon={<AddIcon />}
              sx={{
                bgcolor: "#98B720",
                borderRadius: "50px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1.2,
                boxShadow: "0 4px 15px rgba(102,187,106,0.4)",
                "&:hover": { bgcolor: "#4caf50" },
              }}>
              Tạo thêm khách sạn
            </Button>
          </Box>

          {/* Stats */}

          {/* Table */}
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
                      "#",
                      "Tên khách sạn",
                      "Tình trạng",
                      "Trạng thái",
                      "Địa chỉ",
                      "Hoa hồng",
                      "PT thanh toán",
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
                    <TableCell>1</TableCell>
                    <TableCell
                      onClick={() => setAction("edit_detail")}
                      fontWeight={500}>
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
                      <Chip
                        label='Đang hoạt động'
                        size='small'
                        color='success'
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 280 }}>
                      110 Đ. Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội
                    </TableCell>
                    <TableCell>16%</TableCell>
                    <TableCell>Cả hai</TableCell>
                    <TableCell>
                      <ActionMenu
                        setAction={setAction}
                        setDeleteDialogOpen={setDeleteDialogOpen}
                      />{" "}
                      {/* ← Đây chính là popup menu 3 mục */}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            maxWidth='xs'
            fullWidth
            PaperProps={{ sx: { borderRadius: "16px" } }}>
            <DialogTitle sx={{ textAlign: "center", pt: 4, pb: 1 }}>
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "#ffebee",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}>
                  <img src={remove} alt='' />
                </Box>
                <IconButton
                  onClick={() => setDeleteDialogOpen(false)}
                  sx={{ position: "absolute", top: -40, left: -30 }}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ textAlign: "center", px: 4, pb: 3 }}>
              <Typography fontWeight={600} fontSize='20px' mb={1}>
                Cảnh báo
              </Typography>
              <Typography fontSize='14px' color='#666'>
                Khách sẽ không nhìn thấy khách sạn này sau khi bạn ngừng kinh
                doanh khách sạn. Bạn có thể mở kinh doanh lại loại phòng trong
                tương lai.
              </Typography>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: "center",
                pb: 4,
                gap: 2,
                flexDirection: "column",
              }}>
              <Button
                onClick={() => {}}
                variant='contained'
                sx={{
                  borderRadius: "24px",
                  textTransform: "none",
                  bgcolor: "#98b720",
                  "&:hover": { bgcolor: "#8ab020" },
                  width: "100%",
                }}>
                Xác nhận ngừng kinh doanh
              </Button>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                variant='outlined'
                sx={{
                  borderRadius: "24px",
                  textTransform: "none",
                  borderColor: "#ddd",
                  color: "#666",
                  width: "100%",
                }}>
                Hủy bỏ
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}
