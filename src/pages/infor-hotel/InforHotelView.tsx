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
import { useEffect, useState } from "react";
import remove from "../../images/delete.png";
import success from "../../images/Frame.png";
import HotelDetail from "./HotelDetail";
import HotelEditForm from "./HotelEditForm";
import RoomDetail from "./RoomDetail";
import { getHotel, toggleHotels } from "../../service/hotel";
import { useNavigate, useSearchParams } from "react-router-dom";

// Component menu thao tác
function ActionMenu({ setAction, setDeleteDialogOpen, setIdHotel, hotel }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
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
          onClick={() => {
            setAction("edit_form");
            navigate(`/info-hotel?id=${hotel.id}`);
          }}
          sx={{ gap: 1.5, fontSize: 14 }}>
          <EditIcon fontSize='small' sx={{ color: "#666" }} />
          Chỉnh sửa
        </MenuItem>
        {/* <MenuItem onClick={handleClose} sx={{ gap: 1.5, fontSize: 14 }}>
          <ContentCopyIcon fontSize='small' sx={{ color: "#666" }} />
          Nhân bản
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            setIdHotel(hotel);
            setDeleteDialogOpen(true);
          }}
          sx={{
            gap: 1.5,
            fontSize: 14,
            color: hotel?.status == "active" ? "#d32f2f" : "unset",
          }}>
          <PauseCircleIcon fontSize='small' />
          {hotel?.status == "paused"
            ? "Tiếp tục kinh doanh"
            : "Ngừng kinh doanh"}
        </MenuItem>
      </Menu>
    </>
  );
}

export default function InforHotelView({ hotels, getDataHotels }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [action, setAction] = useState("manager");
  const [idHotel, setIdHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const total = hotels.length;
  const navigate = useNavigate();
  const active = hotels.filter((h) => h.status === "active").length;
  const inactive = total - active;
  const [detailHotel, setDetailHotel] = useState({});
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("id")|| searchParams.get("hotel_id")) {
      getHotelDetail();
    }
    if(searchParams.get("hotel_id")){
      setAction("edit_detail");
    }
  }, [searchParams]);
  const getHotelDetail = async () => {
    try {
      let result = await getHotel(searchParams.get("id")|| searchParams.get("hotel_id"));
      if (result?.id) {
        setDetailHotel(result);
        if (room?.id||searchParams.get("room_id")) {
          setRoom(result?.room_types.find((item) => item.id == (room?.id||searchParams.get("room_id"))));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: "100vh" }}>
      {action == "detail" && (
        <RoomDetail
          getHotelDetail={getHotelDetail}
          detailHotel={detailHotel}
          room={room}
          onNext={setAction}
        />
      )}
      {action == "edit_form" && (
        <HotelEditForm setAction={setAction} setRoom={setRoom} />
      )}
      {action == "edit_detail" && (
        <HotelDetail
          detailHotel={detailHotel}
          getHotelDetail={getHotelDetail}
          setRoom={setRoom}
          setAction={setAction}
        />
      )}
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
            <Typography variant='h5' fontWeight='bold'>
              Thông tin khách sạn
            </Typography>

            <Button
              variant='contained'
              onClick={() => {
                navigate("/create-hotel");
              }}
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
                  Tất cả <strong>{total}</strong>
                </Box>
                <Box>
                  Dạng hoạt động <strong>{active}</strong>
                </Box>
                <Box>
                  Ngừng kinh doanh <strong>{inactive}</strong>
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
                  {hotels?.map((hotel, index) => (
                    <TableRow hover key={hotel.id}>
                      <TableCell>{index + 1}</TableCell>

                      <TableCell
                        onClick={() => {
                          navigate(`/info-hotel?id=${hotel.id}`);
                          setAction("edit_detail");
                        }}
                        sx={{ fontWeight: 500, cursor: "pointer" }}>
                        {parseLang(hotel.name)}
                      </TableCell>

                      <TableCell>
                        {renderCooperationChip(hotel.cooperation_type)}
                      </TableCell>

                      <TableCell>{renderStatusChip(hotel.status)}</TableCell>

                      <TableCell sx={{ maxWidth: 280 }}>
                        {parseLang(hotel.address)}
                      </TableCell>

                      <TableCell>{hotel.commission_rate}%</TableCell>

                      <TableCell>
                        {hotel.cooperation_type === "listing"
                          ? "Online"
                          : "Cả hai"}
                      </TableCell>

                      <TableCell>
                        <ActionMenu
                          hotel={hotel}
                          setIdHotel={setIdHotel}
                          setAction={setAction}
                          setDeleteDialogOpen={setDeleteDialogOpen}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
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
                  <img
                    src={idHotel?.status == "paused" ? success : remove}
                    alt=''
                  />
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
                {idHotel?.status == "paused"
                  ? "Xác nhận mở lại kinh doanh"
                  : "Cảnh báo"}
              </Typography>
              <Typography fontSize='14px' color='#666'>
                {idHotel?.status == "paused"
                  ? "Hãy đảm bảo cập nhật đầu đủ thông tin, giá và tình trạng sãn sàng trước khi mở lại hoạt động kinh doanh để tránh sai sót trong quá trình đặt phòng."
                  : " Khách sẽ không nhìn thấy khách sạn này sau khi bạn ngừng kinh doanh khách sạn. Bạn có thể mở kinh doanh lại loại phòng trong tương lai."}
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
                onClick={async () => {
                  try {
                    let result = await toggleHotels(idHotel?.id);
                    if (result?.hotel_id) {
                      getDataHotels();
                      setDeleteDialogOpen(false);
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
                variant='contained'
                sx={{
                  borderRadius: "24px",
                  textTransform: "none",
                  bgcolor: "#98b720",
                  "&:hover": { bgcolor: "#8ab020" },
                  width: "100%",
                }}>
                {idHotel?.status == "paused"
                  ? "Gửi duyệt"
                  : "Xác nhận ngừng kinh doanh"}
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

const parseLang = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj.vi || obj.en || "";
  } catch {
    return "";
  }
};
const renderStatusChip = (status) => {
  const map = {
    active: {
      label: "Đang hoạt động",
      sx: { bgcolor: "#98B720", color: "white" },
    },
    paused: {
      label: "Tạm dừng",
      sx: { bgcolor: "#FFB020", color: "white" },
    },
    pending: {
      label: "Chờ duyệt",
      sx: { bgcolor: "#1976D2", color: "white" },
    },
    terminated: {
      label: "Đã kết thúc",
      sx: { bgcolor: "#D32F2F", color: "white" },
    },
  };

  const config = map[status];

  return (
    <Chip
      label={config?.label || "Không xác định"}
      size='small'
      sx={config?.sx || { bgcolor: "#9E9E9E", color: "white" }}
    />
  );
};

const renderCooperationChip = (type) => {
  if (type === "listing") {
    return (
      <Chip
        label='Listing'
        size='small'
        sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}
      />
    );
  }
  return <Chip label={type} size='small' />;
};
