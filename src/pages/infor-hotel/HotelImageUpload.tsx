import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import add from "../../images/gallery-add.png";

function HotelImageUpload({
  hotelData,
  onNewImagesChange,
  isPadding = true,
}) {
  const isMobile = useMediaQuery("(max-width:600px)");

  const [newHotelImages, setNewHotelImages] = useState([]);
  const [newVerifyImages, setNewVerifyImages] = useState([]);

  const [existingHotelImages, setExistingHotelImages] = useState([]);
  const [existingVerifyImages, setExistingVerifyImages] = useState([]);

  // Parse ảnh cũ từ server
  useEffect(() => {
    if (hotelData) {
      try {
        const hotelUrls = hotelData.images ? JSON.parse(hotelData.images) : [];
        setExistingHotelImages(
          hotelUrls.map((url, index) => ({ url, id: `exist-hotel-${index}`, isExisting: true }))
        );
      } catch (e) {
        setExistingHotelImages([]);
      }

      try {
        const verifyUrls = hotelData.verify_images ? JSON.parse(hotelData.verify_images) : [];
        setExistingVerifyImages(
          verifyUrls.map((url, index) => ({ url, id: `exist-verify-${index}`, isExisting: true }))
        );
      } catch (e) {
        setExistingVerifyImages([]);
      }
    }
  }, [hotelData]);

  // Báo ảnh mới cho parent
  useEffect(() => {
    onNewImagesChange?.({
      images: newHotelImages.map((img) => img.file),
      verify_images: newVerifyImages.map((img) => img.file),
    });
  }, [newHotelImages, newVerifyImages, onNewImagesChange]);

  // Dọn dẹp object URL khi component unmount hoặc ảnh bị xóa
  useEffect(() => {
    return () => {
      [...newHotelImages, ...newVerifyImages].forEach((img) => {
        URL.revokeObjectURL(img.url);
      });
    };
  }, [newHotelImages, newVerifyImages]);

  const handleUpload = (event, setter) => {
    const files = Array.from(event.target.files);
    const newImgs = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: `new-${Math.random().toString(36).substr(2, 9)}`, // key ổn định
    }));
    setter((prev) => [...prev, ...newImgs]);
    event.target.value = ""; // reset input để có thể upload lại cùng file
  };

  const handleDelete = (id, setter, allImgs) => {
    const imgToDelete = allImgs.find(img => img.id === id);
    if (imgToDelete && !imgToDelete.isExisting) {
      URL.revokeObjectURL(imgToDelete.url);
    }
    setter((prev) => prev.filter((img) => img.id !== id));
  };

  // Memo các component con để tối ưu
  const UploadBox = React.useMemo(() => {
    return function UploadBoxInner({ onSelect }) {
      return (
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
          }}>
          <input type="file" hidden multiple accept="image/*" onChange={onSelect} />
          <img src={add} alt="add" style={{ width: 40, height: 40 }} />
        </label>
      );
    };
  }, []);

  const ImagePreview = React.useMemo(() => {
    return function ImagePreviewInner({ img, onDelete }) {
      return (
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            bgcolor: "#f5f5f5",
          }}>
          <img
            src={img.url}
            alt="preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {onDelete && (
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                background: "rgba(0,0,0,0.6)",
                color: "white",
                "&:hover": { background: "rgba(0,0,0,0.8)" },
              }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      );
    };
  }, []);

  const Section = React.useCallback(({ title, desc, existing = [], newImgs = [], setNewImgs }) => {
    const allImages = [...existing, ...newImgs];

    return (
      <Box sx={{ mb: 5 }}>
        <Typography fontWeight={600} mb={1}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>{desc}</Typography>

        <Grid container spacing={2}>
          {allImages.map((img) => (
            <Grid item key={img.id}>
              <ImagePreview
                img={img}
                onDelete={
                  img.isExisting
                    ? null
                    : () => handleDelete(img.id, setNewImgs, newImgs)
                }
              />
            </Grid>
          ))}

          <Grid item>
            <UploadBox onSelect={(e) => handleUpload(e, setNewImgs)} />
          </Grid>
        </Grid>
      </Box>
    );
  }, []);

  return (
    <Box
      sx={{
        p: isPadding ? 0 : isMobile ? 2 : 4,
        background: "white",
        borderRadius: 2,
      }}>
      <Section
        title="Ảnh chụp biển hiệu khách sạn từ bên ngoài"
        desc="Tải lên ít nhất 1 ảnh rõ nét về mặt tiền hoặc biển hiệu khách sạn. Ảnh này chỉ dùng để kiểm duyệt, không hiển thị trên Hotel Booking."
        existing={existingVerifyImages}
        newImgs={newVerifyImages}
        setNewImgs={setNewVerifyImages}
      />

      <Section
        title="Ảnh khách sạn"
        desc="Tải lên ít nhất 5 ảnh chụp từ nhiều góc độ khác nhau (sảnh, hành lang, khu vực chung, phòng, v.v.). Các ảnh này sẽ được hiển thị trên Hotel Booking."
        existing={existingHotelImages}
        newImgs={newHotelImages}
        setNewImgs={setNewHotelImages}
      />
    </Box>
  );
}

export default React.memo(HotelImageUpload);