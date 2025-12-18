import React, { useState } from "react";
import {
  Box,
  Typography,
  Popover,
  List,
  ListItemButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Helper: parse tên khách sạn từ JSON đa ngôn ngữ
const parseHotelName = (nameStr: string): string => {
  try {
    const parsed = JSON.parse(nameStr);
    return parsed.vi || parsed.en || nameStr || "Không có tên";
  } catch {
    return nameStr || "Không có tên";
  }
};

interface Hotel {
  id: string;
  name: string;
}

interface HotelSelectProps {
  value?: string | null;
  onChange?: (hotelId: string | null) => void;
  hotelsData: Hotel[];
}

export default function HotelSelect({
  value = null,
  onChange,
  hotelsData,
}: HotelSelectProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const selectedHotel = hotelsData.find((h) => h.id === value);

  const open = Boolean(anchorEl);

  return (
    <>
      {/* TEXT + ICON */}
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Typography >
          {selectedHotel
            ? parseHotelName(selectedHotel.name)
            : "Chọn khách sạn"}
        </Typography>

        <KeyboardArrowDownIcon fontSize="small" />
      </Box>

      {/* POPOVER */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List sx={{ minWidth: 220, maxHeight: 300, overflow: "auto" }}>
          {hotelsData.map((hotel) => (
            <ListItemButton
              key={hotel.id}
              selected={hotel.id === value}
              onClick={() => {
                onChange?.(hotel.id);
                setAnchorEl(null);
              }}
            >
              {parseHotelName(hotel.name)}
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
}
