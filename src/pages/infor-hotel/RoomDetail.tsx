import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Chip,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RoomTypeManager from "../create_hotel/RoomTypeManager";
import { Close, ContentCopy, Edit, PauseCircle } from "@mui/icons-material";
import remove from "../../images/delete.png";
import confirm from "../../images/Frame.png";

export default function RoomDetail({ onNext }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(true);
  const [action, setAction] = useState("detail");
  return (
    <Box sx={{ p: 2, minHeight: "100vh" }}>
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
            Khách sẽ không thể đặt phòng này sau khi bạn ngừng kinh doanh loại
            phòng. Bạn có thể mở kinh doanh lại loại phòng trong tương lai.
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
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
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
              <img src={confirm} alt='' />
            </Box>
            <IconButton
              onClick={() => setConfirmDialogOpen(false)}
              sx={{ position: "absolute", top: -40, left: -30 }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", px: 4, pb: 3 }}>
          <Typography fontWeight={600} fontSize='20px' mb={1}>
            Xác nhận mở lại kinh doanh
          </Typography>
          <Typography fontSize='14px' color='#666'>
            Hãy đảm bảo cập nhật đầu đủ thông tin, giá và tình trạng sãn sàng
            trước khi mở lại hoạt động kinh doanh để tránh sai sót trong quá
            trình đặt phòng.
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
            Gửi duyệt
          </Button>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
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
      {action == "detail" && (
        <>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <KeyboardArrowLeftIcon
              onClick={() => onNext("edit_detail")}
              sx={{ fontSize: 30, mr: 1, cursor: "pointer" }}
            />
            <Box>
              <Typography variant='h5' fontWeight={600}>
                Vip 123
              </Typography>
              <Typography color='gray'>Khách sạn 123</Typography>
            </Box>

            <Chip
              label='Đang hoạt động'
              icon={<CheckCircleIcon />}
              sx={{
                ml: 2,
                background: "#E8F5E9",
                color: "#2E7D32",
                height: 32,
                fontWeight: 600,
              }}
            />

            <Box sx={{ flexGrow: 1 }} />

            <ActionMenu
              setDeleteDialogOpen={setDeleteDialogOpen}
              setConfirmDialogOpen={setConfirmDialogOpen}
            />

            <Button
              variant='contained'
              onClick={() => setAction("edit")}
              sx={{
                background: "#82B440",
                borderRadius: 3,
                textTransform: "none",
                px: 3,
                "&:hover": { background: "#6fa336" },
              }}>
              Chỉnh sửa
            </Button>
          </Box>

          {/* Container White */}
          <Box
            sx={{
              background: "white",
              p: 4,
              borderRadius: 4,
              boxShadow: "0 2px 7px rgba(0,0,0,0.05)",
            }}>
            {/* Thông tin phòng */}
            <Typography fontWeight={700} mb={2}>
              Thông tin phòng
            </Typography>

            <Grid container spacing={2} mb={4}>
              {[
                { label: "Số lượng phòng bán", value: "10" },
                { label: "Diện tích", value: "25m2" },
                { label: "Loại giường", value: "1 giường đơn" },
                { label: "Hướng phòng", value: "Hướng thành phố" },
              ].map((item, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Box
                    sx={{
                      border: "1px solid #EBEBEB",
                      borderRadius: 3,
                      p: 2.5,
                      height: "100%",
                    }}>
                    <Typography color='gray' fontSize={14} mb={1}>
                      {item.label}
                    </Typography>
                    <Typography fontWeight={700}>{item.value}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Tiện ích phòng */}
            <Typography fontWeight={700} mt={8} mb={2}>
              Tiện ích phòng
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
              <Chip
                label='Bảo quản hành lý'
                clickable
                sx={{
                  background: "#E8F5E9",
                  color: "#2E7D32",
                  borderRadius: 3,
                  px: 2,
                  fontWeight: 600,
                }}
              />
              <Chip
                label='Thang máy'
                clickable
                sx={{
                  background: "#E8F5E9",
                  color: "#2E7D32",
                  borderRadius: 3,
                  px: 2,
                  fontWeight: 600,
                }}
              />
            </Box>

            {/* Hình ảnh */}
            <Typography fontWeight={700} mb={2}>
              Hình ảnh khách sạn
            </Typography>

            <Grid container spacing={2} mb={4}>
              {[1, 2, 3].map((i) => (
                <Grid item xs={12} sm={4} key={i}>
                  <Box
                    component='img'
                    src='https://i.imgur.com/4ZQZ4ZQ.jpeg'
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 3,
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Giá phòng */}
            <Typography fontWeight={700} mb={2}>
              Giá phòng
            </Typography>

            <Grid container spacing={2}>
              {/* Theo giờ */}
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #DCEFD8",
                  }}>
                  <CardContent>
                    <Box
                      sx={{
                        background: "#E8F5E9",
                        p: 1.5,
                        borderRadius: 2,
                        mb: 2,
                        fontWeight: 700,
                        color: "#2E7D32",
                        display: "inline-block",
                      }}>
                      Theo giờ
                    </Box>
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Box>
                        <Typography fontWeight={600}>Giá 2 giờ đầu</Typography>
                        <Typography color='#82B440' fontWeight={700} mb={1}>
                          160.000đ
                        </Typography>
                      </Box>
                      <Box>
                        <Typography fontWeight={600}>Giá giờ thêm</Typography>
                        <Typography color='#82B440' fontWeight={700} mb={1}>
                          100.000đ
                        </Typography>
                      </Box>
                    </Box>

                    <Typography fontSize={13} mt={1}>
                      ✓ Cho phép khách đặt tối đa thêm 4 giờ với mỗi đặt phòng
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Qua đêm */}
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, border: "1px solid #D4E4FB" }}>
                  <CardContent>
                    <Box
                      sx={{
                        background: "#E3F2FD",
                        p: 1.5,
                        borderRadius: 2,
                        mb: 2,
                        fontWeight: 700,
                        color: "#1976D2",
                        display: "inline-block",
                      }}>
                      Qua đêm
                    </Box>

                    <Typography fontWeight={600}>Giá 1 đêm</Typography>
                    <Typography color='#1565C0' fontWeight={700}>
                      500.000đ
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Theo ngày */}
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, border: "1px solid #FFF3C4" }}>
                  <CardContent>
                    <Box
                      sx={{
                        background: "#FFFDE7",
                        p: 1.5,
                        borderRadius: 2,
                        mb: 2,
                        fontWeight: 700,
                        color: "#DAA200",
                        display: "inline-block",
                      }}>
                      Theo ngày
                    </Box>

                    <Typography fontWeight={600}>Giá 1 ngày</Typography>
                    <Typography color='#DAA200' fontWeight={700}>
                      750.000đ
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      {action == "edit" && (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <KeyboardArrowLeftIcon
              onClick={() => setAction("detail")}
              sx={{ fontSize: 30, mr: 1, cursor: "pointer" }}
            />
            <Box>
              <Typography variant='h5' fontWeight={600}>
                Chỉnh sửa phòng
              </Typography>
              <Typography color='gray'>Khách sạn 123</Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant='contained'
              sx={{
                background: "#82B440",
                borderRadius: 3,
                textTransform: "none",
                px: 3,
                "&:hover": { background: "#6fa336" },
              }}>
              Duyệt phòng
            </Button>
          </Box>
          <RoomTypeManager />
        </Box>
      )}
    </Box>
  );
}

function ActionMenu({ setConfirmDialogOpen }) {
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
        endIcon={<MoreVertIcon />}
        onClick={handleClick}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          borderColor: "rgba(152, 183, 32, 1)",
          color: "rgba(152, 183, 32, 1)",
          fontWeight: 500,
          mr: 1,

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
