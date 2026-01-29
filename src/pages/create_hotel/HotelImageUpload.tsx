import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, IconButton, Grid, useMediaQuery, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import add from "../../images/gallery-add.png";
import { useBookingContext } from "../../App";
import { HelpOutlineOutlined } from "@mui/icons-material";
import { toast } from "react-toastify"; // Đảm bảo đã import toast

export default function HotelImageUpload({
  onTempChange,
  errors = {},
  touched = {},
  onFieldTouch,
  isPadding,
}) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const context = useBookingContext();

  const [outsideImages, setOutsideImages] = useState([]);
  const [hotelImages, setHotelImages] = useState([]);

  const dataRef = useRef({
    outsideImages: [],
    hotelImages: [],
  });

  useEffect(() => {
    if (context?.state?.create_hotel?.outsideImages) {
      setOutsideImages(context.state.create_hotel.outsideImages);
    }
    if (context?.state?.create_hotel?.hotelImages) {
      setHotelImages(context.state.create_hotel.hotelImages);
    }
  }, [context?.state?.create_hotel]);

  useEffect(() => {
    const newData = { outsideImages, hotelImages };
    dataRef.current = newData;
    onTempChange?.(newData);
  }, [outsideImages, hotelImages]);

  const markTouched = (field) => {
    onFieldTouch?.(field);
  };

  useEffect(() => {
    return () => {
      context.dispatch({
        type: "UPDATE_CREATE_HOTEL",
        payload: {
          ...context.state,
          create_hotel: { ...dataRef.current },
        },
      });
    };
  }, []);

  // ─── VALIDATE & UPLOAD ─────────────────────────────────────────────
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png"]; // JPG, PNG

  const handleUpload = (event, setter, field) => {
    markTouched(field);
    const files = Array.from(event.target.files || []);

    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      // Kiểm tra định dạng
      if (!ALLOWED_TYPES.includes(file.type)) {
        invalidFiles.push(file);
        return;
      }

      // Kiểm tra dung lượng
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(file);
        return;
      }

      validFiles.push({ file, url: URL.createObjectURL(file) });
    });

    // Nếu có file không hợp lệ → toast warning
    if (invalidFiles.length > 0) {
      toast.warning(
        `Có ${invalidFiles.length} ảnh không hợp lệ: chỉ chấp nhận JPG/PNG và không quá 3MB.`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }

    // Chỉ thêm ảnh hợp lệ vào state
    if (validFiles.length > 0) {
      setter((prev) => [...prev, ...validFiles]);
    }
  };

  const handleDelete = (index, setter, list, field) => {
    markTouched(field);
    const updated = [...list];
    updated.splice(index, 1);
    setter(updated);
  };

  const UploadBox = ({ onSelect }) => (
    <label
      style={{
        border: "2px dashed #ccc",
        borderRadius: 12,
        width: 120,
        height: 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <input type="file" hidden multiple accept="image/jpeg,image/png" onChange={onSelect} />
      <img src={add} alt="" />
    </label>
  );

  const ImagePreview = ({ img, index, list, setter, field }) => (
    <Box
      sx={{
        width: 120,
        height: 120,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        src={img.url}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        alt="preview"
      />
      <IconButton
        size="small"
        onClick={() => handleDelete(index, setter, list, field)}
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          background: "rgba(0,0,0,0.5)",
          color: "white",
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  const Section = ({ title, desc, images, setter, field }) => (
    <Box sx={{ mb: 4 }}>
      <Typography fontWeight={600} display="flex" alignItems="center" gap={1} mb={1}>
        {title}
        <Tooltip
          title="Định dạng JPG, PNG và không quá 3MB"
          placement="right"
          enterDelay={100}
          leaveDelay={200}
          sx={{
            "& .MuiTooltip-tooltip": {
              bgcolor: "#2d2d2d",
              color: "#ffffff",
              fontSize: "14px",
              padding: "10px 14px",
              borderRadius: "6px",
              maxWidth: 280,
            },
            "& .MuiTooltip-arrow": { color: "#2d2d2d" },
          }}
        >
          <HelpOutlineOutlined
            sx={{
              fontSize: 18,
              color: "#98b720",
              cursor: "help",
              "&:hover": { color: "#7a9a1a" },
            }}
          />
        </Tooltip>
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        {desc}
      </Typography>

      <Grid container spacing={2}>
        {images.map((img, i) => (
          <Grid item key={i}>
            <ImagePreview img={img} index={i} list={images} setter={setter} field={field} />
          </Grid>
        ))}

        <Grid item>
          <UploadBox onSelect={(e) => handleUpload(e, setter, field)} />
        </Grid>
      </Grid>

      {(touched[field] || touched.submitAttempt) && errors[field] && (
        <Typography color="error" fontSize={13} mt={1}>
          {errors[field]}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        p: isPadding ? 0 : isMobile ? 2 : 4,
        mx: "auto",
        background: "white",
        borderRadius: 2,
      }}
    >
      <Section
        title="Ảnh chụp biển hiệu khách sạn từ bên ngoài"
        desc="Tải lên ít nhất 1 ảnh rõ nét về mặt tiền hoặc biển hiệu khách sạn. Ảnh này chỉ dùng để kiểm duyệt, không hiển thị trên Hotel Booking."
        images={outsideImages}
        setter={setOutsideImages}
        field="outsideImages"
      />

      <Section
        title="Ảnh khách sạn"
        desc="Tải lên ít nhất 5 ảnh chụp từ nhiều góc độ khác nhau (sảnh, hành lang, khu vực chung, phòng, v.v.). Các ảnh này sẽ được hiển thị trên Hotel Booking."
        images={hotelImages}
        setter={setHotelImages}
        field="hotelImages"
      />
    </Box>
  );
}