import React, { useState } from "react";
import { Box, Typography, IconButton, Grid, Button, useMediaQuery } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import add from "../../images/gallery-add.png"
export default function HotelImageUpload() {
  const isMobile = useMediaQuery("(max-width:600px)");

  const [outsideImages, setOutsideImages] = useState([]);
  const [hotelImages, setHotelImages] = useState([]);

  const handleUpload = (event, setter) => {
    const files = Array.from(event.target.files);
    const newImgs = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setter((prev) => [...prev, ...newImgs]);
  };

  const handleDelete = (index, setter, list) => {
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
      <input type="file" hidden multiple onChange={onSelect} />
      <img src={add} alt="" />
    </label>
  );

  const ImagePreview = ({ img, index, list, setter }) => (
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
        onClick={() => handleDelete(index, setter, list)}
        sx={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.5)", color: "white" }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  const Section = ({ title, desc, images, setter }) => (
    <Box sx={{ mb: 4 }}>
      <Typography fontWeight={600} mb={1}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {desc}
      </Typography>

      <Grid container spacing={2}>
        {images.map((img, i) => (
          <Grid item key={i}>
            <ImagePreview img={img} index={i} list={images} setter={setter} />
          </Grid>
        ))}

        <Grid item>
          <UploadBox onSelect={(e) => handleUpload(e, setter)} />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 4,
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
      />

      <Section
        title="Ảnh khách sạn"
        desc="Tải lên ít nhất 5 ảnh chụp từ nhiều góc độ khác nhau (sảnh, hành lang, khu vực chung, phòng, v.v.). Các ảnh này sẽ được hiển thị trên Hotel Booking."
        images={hotelImages}
        setter={setHotelImages}
      />
    </Box>
  );
}
