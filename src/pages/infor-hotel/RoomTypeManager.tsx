// src/components/hotel/create/RoomTypeManager.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  Autocomplete,
  InputAdornment,
  Divider,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import BedIcon from "@mui/icons-material/Bed";
import CompassCalibrationIcon from "@mui/icons-material/CompassCalibration";
import CheckIcon from "@mui/icons-material/Check";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useBookingContext } from "../../App"; // Điều chỉnh đường dẫn nếu cần
import { KeyboardArrowLeft } from "@mui/icons-material";
import { createRoomHotel, updateRoom } from "../../service/hotel";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { direction, facilities, type_bed } from "../../utils/utils";

interface Pricing {
  hourly: {
    enabled: boolean;
    firstHours: string;
    extraHour: string;
    maxHours: string;
  };
  overnight: {
    enabled: boolean;
    price: string;
  };
  daily: {
    enabled: boolean;
    price: string;
  };
}

interface RoomType {
  id: string;
  name: string;
  quantity: string;
  area: string;
  bedType: string;
  direction: string;
  description: string;
  images: File[];
  imagePreviews: string[];
  pricing: Pricing;
}

interface RoomFromAPI {
  id?: string;
  name?: string;
  description?: string;
  price_hourly?: number | string;
  price_hourly_increment?: number | string;
  price_overnight?: number | string;
  price_daily?: number | string;
  bed_type?: string;
  area_m2?: number | string;
  number?: string; // số lượng phòng bán
  direction?: string;
  images?: string; // JSON string của mảng URL
  // các trường khác nếu cần...
}

interface RoomTypeManagerProps {
  room?: RoomFromAPI | null;
}

export default function RoomTypeManager({
  room,
  setAction,
  getHotelDetail,
  isCreate,
  idHotel,
}: RoomTypeManagerProps) {
  const dataRef = useRef<{ roomTypes: RoomType[]; activeTab: number }>({
    roomTypes: [],
    activeTab: 0,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  // Helper parse JSON đa ngôn ngữ
  const parseVi = (field?: string) => {
    if (!field) return "";
    try {
      const parsed = JSON.parse(field);
      return parsed.vi || "";
    } catch {
      return field;
    }
  };

  useEffect(() => {
    if (room && room.amenities) {
      try {
        const parsed = JSON.parse(room.amenities as string);
        if (Array.isArray(parsed)) {
          setSelectedIds(parsed);
        }
      } catch (e) {
        console.warn("Không parse được facilities:", e);
      }
    }
  }, [room]);
  const getInitialData = (): { roomTypes: RoomType[]; activeTab: number } => {
    // Nếu có prop room → chế độ edit
    if (room) {
      const imagesArr = room.images
        ? (() => {
            try {
              return JSON.parse(room.images);
            } catch {
              return [];
            }
          })()
        : [];

      return {
        roomTypes: [
          {
            id: room.id || Date.now().toString(),
            name: parseVi(room.name),
            quantity: room.number || "1",
            area: room.area_m2?.toString() || "",
            bedType: (() => {
              if (!room.bed_type) return [];
              try {
                return JSON.parse(room.bed_type as string);
              } catch {
                return [];
              }
            })(),
            direction: (() => {
              if (!room.direction) return [];
              try {
                return JSON.parse(room.direction as string);
              } catch {
                return [];
              }
            })(),
            description: parseVi(room.description),
            images: [],
            imagePreviews: imagesArr,
            pricing: {
              hourly: {
                enabled: !!room.price_hourly,
                firstHours: room.price_hourly?.toString() || "",
                extraHour: room.price_hourly_increment?.toString() || "",
                maxHours: "12",
              },
              overnight: {
                enabled: !!room.price_overnight,
                price: room.price_overnight?.toString() || "",
              },
              daily: {
                enabled: !!room.price_daily,
                price: room.price_daily?.toString() || "",
              },
            },
          },
        ],
        activeTab: 0,
      };
    }

    // Mặc định tạo mới
    return {
      roomTypes: [
        {
          id: Date.now().toString(),
          name: "",
          quantity: "",
          area: "",
          bedType: "",
          direction: "",
          description: "",
          images: [],
          imagePreviews: [],
          pricing: {
            hourly: {
              enabled: true,
              firstHours: "",
              extraHour: "",
              maxHours: "12",
            },
            overnight: { enabled: true, price: "" },
            daily: { enabled: true, price: "" },
          },
        },
      ],
      activeTab: 0,
    };
  };

  const [roomTypes, setRoomTypes] = useState<RoomType[]>(
    getInitialData().roomTypes
  );
  const [activeTab, setActiveTab] = useState<number>(
    getInitialData().activeTab
  );

  const current = roomTypes[activeTab];

  // Cập nhật dataRef khi thay đổi
  useEffect(() => {
    const newData = { roomTypes, activeTab };
    dataRef.current = newData;
    // Nếu cần thông báo cho parent (nếu có onTempChange)
    // onTempChange?.(newData);
  }, [roomTypes, activeTab]);

  // Lưu vào context khi unmount

  const handleTouch = (field: string) => {
    // onFieldTouch?.(`room_${activeTab}_${field}`);
  };

  // Cập nhật field
  const updateRoomField = <K extends keyof RoomType>(
    field: K,
    value: RoomType[K]
  ) => {
    setRoomTypes((prev) =>
      prev.map((room, i) =>
        i === activeTab ? { ...room, [field]: value } : room
      )
    );
  };

  const updatePricing = (newPricing: Pricing) => {
    updateRoomField("pricing", newPricing);
  };

  const handleSubmitRoomType = async () => {
    const toViJson = (value: string): string =>
      JSON.stringify({ vi: (value || "").trim() });

    const buildFormData = (room) => {
      const formData = new FormData();

      formData.append("name", toViJson(room.name));
      formData.append("description", toViJson(room.description || ""));
      formData.append("amenities", JSON.stringify(selectedIds));
      formData.append("currency", "VND");
      formData.append("number", room.quantity || "1");
      formData.append("area_m2", room.area || "");
      formData.append("max_guests", "2");

      formData.append("bed_type", JSON.stringify(room.bedType)); // mảng id
      formData.append("direction", JSON.stringify(room.direction));

      if (room.pricing.hourly.enabled) {
        if (room.pricing.hourly.firstHours) {
          formData.append("price_hourly", room.pricing.hourly.firstHours);
        }
        if (room.pricing.hourly.extraHour) {
          formData.append(
            "price_hourly_increment",
            room.pricing.hourly.extraHour
          );
        }
      }

      if (room.pricing.overnight.enabled && room.pricing.overnight.price) {
        formData.append("price_overnight", room.pricing.overnight.price);
      }

      if (room.pricing.daily.enabled && room.pricing.daily.price) {
        formData.append("price_daily", room.pricing.daily.price);
      }

      if (room.images?.length) {
        room.images.forEach((file: File) => {
          if (file instanceof File) {
            formData.append("images", file);
          }
        });
      }

      return formData;
    };

    try {
      const room = roomTypes[0];
      const formData = buildFormData(room);
      let result;
      if (isCreate) {
        result = await createRoomHotel(idHotel, formData);
      } else {
        formData.append("id", room.id);

        result = await updateRoom(searchParams.get("id"), room.id, formData);
      }

      if (result?.room_type_id) {
        toast.success(result?.message);
        getHotelDetail();
      } else {
        toast.error(result?.message || "Update room type failed");
      }
    } catch (error) {
      console.error(error);
      // toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <KeyboardArrowLeft
          onClick={() => {
            if (isCreate) {
              const params = new URLSearchParams(searchParams);
              params.set("manager_room", "true"); // thêm params mới
              params.delete("room_id");
              setSearchParams(params);
              setAction("edit_detail");
            } else {
              setAction("detail");
            }
          }}
          sx={{ fontSize: 30, mr: 1, cursor: "pointer" }}
        />
        <Box>
          <Typography variant='h5' fontWeight={600}>
            {isCreate ? "Tạo loại phòng" : "Chỉnh sửa loại phòng"}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant='contained'
          onClick={handleSubmitRoomType}
          sx={{
            background: "#82B440",
            borderRadius: 3,
            textTransform: "none",
            px: 3,
            "&:hover": { background: "#6fa336" },
          }}>
          {isCreate ? "Duyệt" : "Cập nhật"}
        </Button>
      </Box>
      <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "white", borderRadius: 3 }}>
        {/* Tabs loại phòng */}

        {/* Các phần UI còn lại giữ nguyên */}
        <Box sx={{ py: 2 }}>
          <Box display='flex' justifyContent='space-between' gap={4}>
            <Box width={{ xs: "100%", md: "30%" }}>
              <Typography variant='h6' fontWeight={600} gutterBottom>
                Thông tin phòng
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Thiết lập các thông tin cơ bản của phòng
              </Typography>
            </Box>

            <Box width={{ xs: "100%", md: "65%" }}>
              <Grid container spacing={3}>
                {/* Các field giống file gốc, chỉ thay current?.xxx */}
                <Grid item xs={12}>
                  <Typography
                    variant='subtitle2'
                    color='text.secondary'
                    gutterBottom>
                    Tên loại phòng
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder='Nhập tên loại phòng'
                    value={current?.name || ""}
                    onChange={(e) => {
                      updateRoomField("name", e.target.value);
                      handleTouch("name");
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 50,
                        borderRadius: 2,
                        "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    variant='subtitle2'
                    color='text.secondary'
                    gutterBottom>
                    Số lượng phòng bán
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder='Nhập số phòng'
                    value={current?.quantity || ""}
                    onChange={(e) => {
                      updateRoomField("quantity", e.target.value);
                      handleTouch("quantity");
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 50,
                        borderRadius: 2,
                        "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    variant='subtitle2'
                    color='text.secondary'
                    gutterBottom>
                    Diện tích phòng (m²)
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder='Nhập diện tích phòng'
                    value={current?.area || ""}
                    onChange={(e) => {
                      updateRoomField("area", e.target.value);
                      handleTouch("area");
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>m²</InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 50,
                        borderRadius: 2,
                        "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant='subtitle2'
                    color='text.secondary'
                    gutterBottom>
                    Loại giường
                  </Typography>
                  <Autocomplete
                    multiple
                    options={type_bed}
                    getOptionLabel={(option) => option.label}
                    value={type_bed.filter((opt) =>
                      current?.bedType.includes(opt.id)
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(_, newValue) => {
                      updateRoomField(
                        "bedType",
                        newValue.map((v) => v.id)
                      );
                      handleTouch("bedType");
                    }}
                    disableClearable // ← quan trọng: ngăn xóa hết và tránh hiển thị dòng trống
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => (
                        <Chip
                          label={option.label}
                          size='small'
                          {...getTagProps({ index })}
                          key={index}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={
                          current?.bedType.length === 0
                            ? "Chọn loại giường"
                            : ""
                        } // chỉ hiện placeholder khi chưa chọn
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position='start'>
                                <BedIcon sx={{ color: "#999" }} />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: "auto",
                            minHeight: 50,
                            borderRadius: 1.5,
                            "&.Mui-focused fieldset": {
                              borderColor: "#a0d468",
                            },
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        <BedIcon sx={{ mr: 2, color: "#999", fontSize: 20 }} />
                        {option.label}
                      </li>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant='subtitle2'
                    color='text.secondary'
                    gutterBottom>
                    Hướng phòng
                  </Typography>
                  <Autocomplete
                    multiple
                    options={direction}
                    getOptionLabel={(option) => option.label}
                    value={
                      direction.filter((opt) =>
                        current?.direction.includes(opt.id)
                      ) || []
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(_, newValue) => {
                      updateRoomField(
                        "direction",
                        newValue.map((v) => v.id)
                      );
                      handleTouch("direction");
                    }}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => (
                        <Chip
                          label={option.label}
                          size='small'
                          {...getTagProps({ index })}
                          key={index}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder='Chọn hướng phòng'
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <>
                              <InputAdornment position='start'>
                                <CompassCalibrationIcon
                                  sx={{ color: "#999" }}
                                />
                              </InputAdornment>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: "auto",
                            minHeight: 50,
                            borderRadius: 1.5,
                            "&.Mui-focused fieldset": {
                              borderColor: "#a0d468",
                            },
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <CompassCalibrationIcon
                          sx={{ mr: 2, color: "#999", fontSize: 20 }}
                        />
                        {option.label}
                      </li>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant='subtitle2'
                    color='text.secondary'
                    gutterBottom>
                    Mô tả phòng (Không bắt buộc)
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    fontSize='0.875rem'
                    sx={{ mb: 1 }}>
                    Một đoạn giới thiệu ngắn gọn về loại phòng
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder='Nhập mô tả về loại phòng...'
                    value={current?.description || ""}
                    onChange={(e) => {
                      updateRoomField("description", e.target.value);
                      handleTouch("description");
                    }}
                    inputProps={{ maxLength: 3000 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                      },
                    }}
                  />
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ float: "right", mt: 0.5 }}>
                    {(current?.description || "").length}/3000
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Upload ảnh */}
        <RoomImagesUpload
          setSelectedIds={setSelectedIds}
          selectedIds={selectedIds}
          previews={current?.imagePreviews || []}
          files={current?.images || []}
          onChange={(previews, files) => {
            setRoomTypes((prev) =>
              prev.map((r, i) =>
                i === activeTab
                  ? { ...r, imagePreviews: previews, images: files }
                  : r
              )
            );
          }}
        />

        <Divider sx={{ my: 4 }} />
        <RoomPricingSection
          pricing={current?.pricing}
          onChange={updatePricing}
        />
      </Box>
    </>
  );
}

function RoomImagesUpload({
  previews,
  files,
  onChange,
  setSelectedIds,
  selectedIds,
}: {
  previews: string[];
  files: File[];
  onChange: (p: string[], f: File[]) => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(selected).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 3 * 1024 * 1024) {
        alert(`Ảnh "${file.name}" vượt quá 3MB!`);
        return;
      }
      if (files.length + newFiles.length >= 3) {
        alert("Chỉ được tải lên tối đa 3 ảnh!");
        return;
      }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (newFiles.length > 0) {
      onChange([...previews, ...newPreviews], [...files, ...newFiles]);
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    onChange(
      previews.filter((_, i) => i !== index),
      files.filter((_, i) => i !== index)
    );
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box display='flex' justifyContent='space-between' gap={4}>
        <Box width={{ xs: "100%", md: "30%" }}>
          <Typography variant='h6' fontWeight={600} gutterBottom>
            Tiện ích và hình ảnh
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ mb: 3, fontSize: "0.875rem" }}>
            Thiết lập các thông tin cơ bản của phòng
          </Typography>
        </Box>
        <Box width={{ xs: "100%", md: "65%" }}>
          <FacilitySelector
            setSelectedIds={setSelectedIds}
            selectedIds={selectedIds}
          />

          <Typography
            variant='body1'
            sx={{ fontSize: "0.875rem", fontWeight: "bold" }}>
            Thêm ảnh phòng
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ mb: 3, fontSize: "0.875rem" }}>
            Tải lên ít nhất 3 ảnh phòng (phòng ngủ, phòng tắm, view). Tối đa
            3MB/ảnh.
          </Typography>

          <Grid container spacing={2}>
            {previews.map((src, i) => (
              <Grid item contaminant key={i}>
                <Box sx={{ position: "relative", width: 160, height: 160 }}>
                  <img
                    src={src}
                    alt={`preview ${i}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 12,
                      border: "1px solid #eee",
                    }}
                  />
                  <IconButton
                    size='small'
                    onClick={() => removeImage(i)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "white",
                    }}>
                    <CloseIcon fontSize='small' />
                  </IconButton>
                </Box>
              </Grid>
            ))}

            {previews.length < 3 && (
              <Grid item>
                <Button
                  variant='outlined'
                  component='label'
                  sx={{
                    width: 160,
                    height: 160,
                    border: "2px dashed #ccc",
                    borderRadius: 3,
                    bgcolor: "#fafafa",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    color: "#999",
                    textTransform: "none",
                  }}>
                  <PhotoCamera sx={{ fontSize: 40, color: "#ddd" }} />
                  <Typography variant='body2'>Thêm ảnh</Typography>
                  <input
                    type='file'
                    hidden
                    multiple
                    accept='image/jpeg,image/png,image/jpg'
                    onChange={handleFileChange}
                  />
                </Button>
              </Grid>
            )}
          </Grid>

          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ mt: 2, display: "block" }}>
            Đã tải lên {previews.length}/3 ảnh
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// Component Giá phòng (giữ nguyên)
function RoomPricingSection({
  pricing,
  onChange,
}: {
  pricing?: Pricing;
  onChange: (p: Pricing) => void;
}) {
  if (!pricing) return null;

  const toggle = (key: keyof Pricing) => {
    onChange({
      ...pricing,
      [key]: { ...pricing[key], enabled: !pricing[key].enabled },
    });
  };

  const update = (key: keyof Pricing, field: string, value: any) => {
    onChange({
      ...pricing,
      [key]: { ...pricing[key], [field]: value },
    });
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box display='flex' justifyContent='space-between' gap={4}>
        <Box width={{ xs: "100%", md: "30%" }}>
          <Typography variant='h6' fontWeight={600} gutterBottom>
            Giá phòng
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Thiết lập giá theo loại đặt phòng
          </Typography>
        </Box>

        <Box width={{ xs: "100%", md: "65%" }}>
          {/* Giá theo giờ */}
          <Paper variant='outlined' sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              mb={2}>
              <Typography fontWeight={600}>Giá phòng theo giờ</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!pricing.hourly.enabled}
                    onChange={() => toggle("hourly")}
                    size='small'
                  />
                }
                label='Không kinh doanh'
              />
            </Box>

            {pricing.hourly.enabled && (
              <>
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      gutterBottom>
                      Số giờ đầu
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder='Nhập số tiền'
                      type='number'
                      value={pricing.hourly.firstHours}
                      onChange={(e) =>
                        update("hourly", "firstHours", e.target.value)
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            đồng/2 giờ
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 50,
                          borderRadius: 2,
                          "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      gutterBottom>
                      Giờ thêm
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder='Nhập số tiền'
                      type='number'
                      value={pricing.hourly.extraHour}
                      onChange={(e) =>
                        update("hourly", "extraHour", e.target.value)
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            đồng/1 giờ
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: 50,
                          borderRadius: 2,
                          "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Số giờ tối đa
                </Typography>
                <Select
                  fullWidth
                  value={pricing.hourly.maxHours}
                  onChange={(e) => update("hourly", "maxHours", e.target.value)}
                  displayEmpty
                  sx={{
                    height: 50,
                    borderRadius: 2,
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#a0d468",
                    },
                  }}>
                  <MenuItem value='' disabled>
                    Chọn số giờ tối đa
                  </MenuItem>
                  {[6, 8, 10, 12, 18, 24].map((h) => (
                    <MenuItem key={h} value={h}>
                      {h} giờ
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          </Paper>

          {/* Qua đêm */}
          <Paper variant='outlined' sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              mb={2}>
              <Typography fontWeight={600}>Giá phòng qua đêm</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!pricing.overnight.enabled}
                    onChange={() => toggle("overnight")}
                    size='small'
                  />
                }
                label='Không kinh doanh'
              />
            </Box>
            {pricing.overnight.enabled && (
              <TextField
                fullWidth
                placeholder='Nhập số tiền'
                type='number'
                value={pricing.overnight.price}
                onChange={(e) => update("overnight", "price", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>đồng/đêm</InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 50,
                    borderRadius: 2,
                    "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                  },
                }}
              />
            )}
          </Paper>

          {/* Theo ngày */}
          <Paper variant='outlined' sx={{ p: 3, borderRadius: 3 }}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              mb={2}>
              <Typography fontWeight={600}>Giá phòng theo ngày</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!pricing.daily.enabled}
                    onChange={() => toggle("daily")}
                    size='small'
                  />
                }
                label='Không kinh doanh'
              />
            </Box>
            {pricing.daily.enabled && (
              <TextField
                fullWidth
                placeholder='Nhập số tiền'
                type='number'
                value={pricing.daily.price}
                onChange={(e) => update("daily", "price", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>đồng/ngày</InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 50,
                    borderRadius: 2,
                    "&.Mui-focused fieldset": { borderColor: "#a0d468" },
                  },
                }}
              />
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

import {
  Modal,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  maxHeight: "80vh",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 3,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

function FacilitySelector({ selectedIds, setSelectedIds }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFacilities = facilities.filter(
    (fac) =>
      fac.name.vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.name.en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const handleSubmit = () => {
    console.log("Selected facility IDs:", selectedIds);
    // Ở đây bạn có thể truyền selectedIds lên parent component hoặc API
    setOpen(false);
  };

  const selectedFacilities = facilities.filter((f) =>
    selectedIds.includes(f.id)
  );

  return (
    <Box mb={2}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}>
        <Typography
          variant='body1'
          sx={{ fontSize: "0.875rem", fontWeight: "bold" }}>
          Thêm tiện ích
        </Typography>
        <TextField
          placeholder='Chọn tiện ích'
          value={selectedFacilities.map((f) => f.name.vi).join(", ") || ""}
          onClick={() => setOpen(true)}
          InputProps={{
            readOnly: true,
            startAdornment:
              selectedFacilities.length > 0 ? (
                <InputAdornment position='start'>
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ) : null,
            endAdornment:
              selectedFacilities.length > 0 ? null : (
                <InputAdornment position='end'>
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: "40px",
              "&.Mui-focused fieldset": { borderColor: "#a0d468" },
            },
            cursor: "pointer",
          }}
        />

        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={modalStyle}>
            <Typography variant='h6' mb={2}>
              Chọn tiện ích
            </Typography>

            <TextField
              fullWidth
              placeholder='Tìm kiếm tiện ích'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <Box sx={{ flex: 1, overflow: "auto" }}>
              <List disablePadding>
                {filteredFacilities.map((fac, index) => (
                  <React.Fragment key={fac.id}>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleToggle(fac.id)}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <img
                            src={fac.icon}
                            alt={fac.name.vi}
                            width={28}
                            height={28}
                          />
                        </ListItemIcon>
                        <ListItemText primary={fac.name.vi} />
                        <Checkbox
                          edge='end'
                          checked={selectedIds.includes(fac.id)}
                        />
                      </ListItemButton>
                    </ListItem>
                    {index < filteredFacilities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>

            <Button
              variant='contained'
              fullWidth
              onClick={handleSubmit}
              sx={{
                mt: 3,
                bgcolor: "#7CB518",
                "&:hover": { bgcolor: "#7CB518" },
                borderRadius: 8,
                py: 1.5,
              }}>
              Chọn tiếp tục
            </Button>
          </Box>
        </Modal>
      </Box>
      {/* Hiển thị các chip đã chọn bên dưới input */}
      {selectedFacilities.length > 0 && (
        <Stack direction='row' flexWrap='wrap' gap={1} mt={2}>
          {selectedFacilities.map((fac) => (
            <Chip
              key={fac.id}
              label={fac.name.vi}
              onDelete={() => handleDelete(fac.id)}
              deleteIcon={<CloseIcon />}
              sx={{
                bgcolor: "#7CB518",
                color: "white",
                "& .MuiChip-deleteIcon": { color: "red" },
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
