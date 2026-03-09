import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Typography,
  Grid,
  Paper,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useBookingContext } from "../../App";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Province {
  code: number;
  name: string;
  codename: string;
}

interface District {
  code: number;
  name: string;
  codename: string;
}

interface Ward {
  code: number;
  name: string;
  codename: string;
}

interface LocationData {
  provinceCode: number | null;
  provinceName: string | null;
  districtCode: number | null;
  districtName: string | null;
  wardCode: number | null;
  wardName: string | null;
  address: string;
  center: { lat: number; lng: number };
}

// ─── API helpers ──────────────────────────────────────────────────────────────

const BASE = "https://provinces.open-api.vn/api";

async function fetchProvinces(): Promise<Province[]> {
  const res = await fetch(`${BASE}/p/`);
  return res.json();
}

async function fetchDistricts(provinceCode: number): Promise<District[]> {
  const res = await fetch(`${BASE}/p/${provinceCode}?depth=2`);
  const data = await res.json();
  return data.districts ?? [];
}

async function fetchWards(districtCode: number): Promise<Ward[]> {
  const res = await fetch(`${BASE}/d/${districtCode}?depth=2`);
  const data = await res.json();
  return data.wards ?? [];
}

/**
 * Geocode a place name using Google Maps Geocoding API.
 * Returns { lat, lng } or null.
 */
async function geocodePlace(
  placeName: string,
  apiKey: string
): Promise<{ lat: number; lng: number } | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    placeName + ", Việt Nam"
  )}&key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].geometry.location;
    }
  } catch (e) {
    console.error("Geocode error:", e);
  }
  return null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GOOGLE_MAPS_API_KEY = "AIzaSyASJk1hzLv6Xoj0fRsYnfuO6ptOXu0fZsc";
const DEFAULT_CENTER = { lat: 21.0285, lng: 105.8542 }; // Hà Nội
const containerStyle = { width: "100%", height: "100%" };

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "white",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#a0d468",
      borderWidth: 2,
    },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  onTempChange?: (data: LocationData) => void;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
  onFieldTouch?: (field: string) => void;
}

export default function HotelLocationInput({
  onTempChange,
  errors = {},
  touched = {},
  onFieldTouch,
}: Props) {
  // --- Address list states ---
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // --- Selected values ---
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [address, setAddress] = useState("");

  // --- Map states ---
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(null);

  // --- Search states ---
  const [searchInput, setSearchInput] = useState("");
  const [searchOptions, setSearchOptions] = useState<Province[]>([]);

  const context = useBookingContext();
  const dataRef = useRef<LocationData>({
    provinceCode: null,
    provinceName: null,
    districtCode: null,
    districtName: null,
    wardCode: null,
    wardName: null,
    address: "",
    center: DEFAULT_CENTER,
  });
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // ── Load provinces on mount ──────────────────────────────────────────────
  useEffect(() => {
    fetchProvinces()
      .then(setProvinces)
      .catch((e) => console.error("Error fetching provinces:", e))
      .finally(() => setLoadingProvinces(false));
  }, []);

  // ── Filter search options based on input ────────────────────────────────
  useEffect(() => {
    if (!searchInput.trim()) {
      setSearchOptions([]);
      return;
    }
    const q = searchInput.toLowerCase();
    setSearchOptions(
      provinces.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 8)
    );
  }, [searchInput, provinces]);

  // ── Sync data ref & call onTempChange ───────────────────────────────────
  useEffect(() => {
    const newData: LocationData = {
      provinceCode: selectedProvince?.code ?? null,
      provinceName: selectedProvince?.name ?? null,
      districtCode: selectedDistrict?.code ?? null,
      districtName: selectedDistrict?.name ?? null,
      wardCode: selectedWard?.code ?? null,
      wardName: selectedWard?.name ?? null,
      address,
      center,
    };
    dataRef.current = newData;
    onTempChange?.(newData);
  }, [selectedProvince, selectedDistrict, selectedWard, address, center]);

  // ── Restore from context on mount (after provinces loaded) ──────────────
  useEffect(() => {
    const saved = context?.state?.create_hotel as LocationData | undefined;
    if (!saved || provinces.length === 0) return;

    if (saved.provinceCode) {
      const prov = provinces.find((p) => p.code === saved.provinceCode);
      if (prov) {
        setSelectedProvince(prov);
        if (saved.districtCode) {
          fetchDistricts(prov.code).then((dists) => {
            setDistricts(dists);
            const dist = dists.find((d) => d.code === saved.districtCode);
            if (dist) {
              setSelectedDistrict(dist);
              if (saved.wardCode) {
                fetchWards(dist.code).then((ws) => {
                  setWards(ws);
                  const ward = ws.find((w) => w.code === saved.wardCode);
                  if (ward) setSelectedWard(ward);
                });
              }
            }
          });
        }
      }
    }
    if (saved.address) setAddress(saved.address);
    if (saved.center?.lat && saved.center?.lng) {
      setCenter(saved.center);
      setMarkerPos(saved.center);
    }
  }, [provinces]);

  // ── Save to context on unmount ───────────────────────────────────────────
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

  // ── When province changes → reset district/ward, geocode & pan map ──────
  useEffect(() => {
    setDistricts([]);
    setSelectedDistrict(null);
    setWards([]);
    setSelectedWard(null);

    if (!selectedProvince) return;

    // Geocode tỉnh để pan map
    geocodePlace(selectedProvince.name, GOOGLE_MAPS_API_KEY).then((pos) => {
      if (pos) {
        setCenter(pos);
        setMarkerPos(pos);
        mapRef.current?.panTo(pos);
        mapRef.current?.setZoom(11);
      }
    });

    // Load districts
    setLoadingDistricts(true);
    fetchDistricts(selectedProvince.code)
      .then(setDistricts)
      .catch(console.error)
      .finally(() => setLoadingDistricts(false));
  }, [selectedProvince]);

  // ── When district changes → reset ward, geocode & pan map ───────────────
  useEffect(() => {
    setWards([]);
    setSelectedWard(null);

    if (!selectedDistrict) return;

    // Geocode quận để pan map
    const fullName = `${selectedDistrict.name}, ${selectedProvince?.name}`;
    geocodePlace(fullName, GOOGLE_MAPS_API_KEY).then((pos) => {
      if (pos) {
        setCenter(pos);
        setMarkerPos(pos);
        mapRef.current?.panTo(pos);
        mapRef.current?.setZoom(13);
      }
    });

    // Load wards
    setLoadingWards(true);
    fetchWards(selectedDistrict.code)
      .then(setWards)
      .catch(console.error)
      .finally(() => setLoadingWards(false));
  }, [selectedDistrict]);

  // ── When ward changes → geocode & pan map ───────────────────────────────
  useEffect(() => {
    if (!selectedWard) return;
    const fullName = `${selectedWard.name}, ${selectedDistrict?.name}, ${selectedProvince?.name}`;
    geocodePlace(fullName, GOOGLE_MAPS_API_KEY).then((pos) => {
      if (pos) {
        setCenter(pos);
        setMarkerPos(pos);
        mapRef.current?.panTo(pos);
        mapRef.current?.setZoom(15);
      }
    });
  }, [selectedWard]);

  // ── Handle search selection ──────────────────────────────────────────────
  const handleSearchSelect = useCallback(
    (_: React.SyntheticEvent, value: Province | null) => {
      if (!value) return;
      setSelectedProvince(value);
      setSearchInput(value.name);
    },
    []
  );

  // ── Map click → update marker & center ──────────────────────────────────
  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(pos);
    setCenter(pos);
  }, []);

  function handleTouch(field: string) {
    onFieldTouch?.(field);
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: "white", borderRadius: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} color="text.primary" gutterBottom>
        Vị trí khách sạn trên bản đồ
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Giúp khách đặt phòng dễ dàng tìm đường tới khách sạn của bạn
      </Typography>

      {/* ── Ô tìm kiếm vị trí trên bản đồ ── */}
      <Autocomplete<Province>
        options={searchOptions}
        getOptionLabel={(option) => option.name}
        filterOptions={(x) => x} // filtering done manually above
        inputValue={searchInput}
        onInputChange={(_, val) => setSearchInput(val)}
        onChange={handleSearchSelect}
        loading={loadingProvinces}
        renderOption={(props, option) => (
          <li {...props} key={option.code}>
            <LocationOnIcon sx={{ mr: 1, color: "#a0d468" }} fontSize="small" />
            {option.name}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Tìm kiếm tỉnh/thành phố trên bản đồ..."
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {loadingProvinces ? <CircularProgress size={18} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{ mb: 3, ...inputSx }}
          />
        )}
        noOptionsText={
          searchInput.trim()
            ? "Không tìm thấy tỉnh/thành phố"
            : "Nhập từ khoá để tìm kiếm"
        }
      />

<Paper elevation={0} sx={{ p: 0, borderRadius: 3,mb:4 }}>
       

        <Grid container spacing={3}>
          {/* Địa chỉ chi tiết */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Địa chỉ khách sạn{" "}
              <span style={{ color: "red", fontSize: 16 }}>*</span>
            </Typography>
            <TextField
              fullWidth
              placeholder="Nhập số nhà, tên đường..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => handleTouch("address")}
              error={touched.address && !!errors.address}
              helperText={touched.address ? errors.address : ""}
              variant="outlined"
              sx={inputSx}
            />
          </Grid>

          {/* Tỉnh / Thành phố */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Tỉnh / Thành phố{" "}
              <span style={{ color: "red", fontSize: 16 }}>*</span>
            </Typography>
            <Autocomplete<Province>
              options={provinces}
              getOptionLabel={(o) => o.name}
              value={selectedProvince}
              loading={loadingProvinces}
              onChange={(_, v) => setSelectedProvince(v)}
              onBlur={() => handleTouch("provinceCode")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Chọn tỉnh/thành phố"
                  variant="outlined"
                  error={touched.provinceCode && !!errors.provinceCode}
                  helperText={touched.provinceCode && errors.provinceCode}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon
                          fontSize="small"
                          sx={{ color: selectedProvince ? "#a0d468" : "text.secondary" }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <>
                        {loadingProvinces ? <CircularProgress size={16} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={inputSx}
                />
              )}
              noOptionsText="Không tìm thấy"
            />
          </Grid>

          {/* Quận / Huyện */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Quận / Huyện   <span style={{ color: "red", fontSize: 16 }}>*</span>
            </Typography>
            <Autocomplete<District>
              options={districts}
              getOptionLabel={(o) => o.name}
              value={selectedDistrict}
              disabled={!selectedProvince}
              loading={loadingDistricts}
              onChange={(_, v) => setSelectedDistrict(v)}
              onBlur={() => handleTouch("districtCode")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={
                    !selectedProvince
                      ? "Chọn tỉnh/thành phố trước"
                      : "Chọn quận/huyện"
                  }
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          fontSize="small"
                          sx={{ color: "text.secondary" }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <>
                        {loadingDistricts ? <CircularProgress size={16} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={inputSx}
                />
              )}
              noOptionsText="Không tìm thấy"
            />
          </Grid>

          {/* Phường / Xã / Thị trấn */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Phường / Xã / Thị trấn   <span style={{ color: "red", fontSize: 16 }}>*</span>
            </Typography>
            <Autocomplete<Ward>
              options={wards}
              getOptionLabel={(o) => o.name}
              value={selectedWard}
              disabled={!selectedDistrict}
              loading={loadingWards}
              onChange={(_, v) => setSelectedWard(v)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={
                    !selectedDistrict
                      ? "Chọn quận/huyện trước"
                      : "Chọn phường/xã"
                  }
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon
                          fontSize="small"
                          sx={{ color: "text.secondary" }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <>
                        {loadingWards ? <CircularProgress size={16} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={inputSx}
                />
              )}
              noOptionsText="Không tìm thấy"
            />
          </Grid>
        </Grid>
      </Paper>
      {/* ── Bản đồ + Marker ── */}
      <Box
        sx={{
          height: { xs: 320, md: 420 },
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          position: "relative",
          bgcolor: "#f8f9fa",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          mb: 4,
        }}
      >
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onLoad={onMapLoad}
            onClick={onMapClick}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
              ],
            }}
          >
            {markerPos && (
              <Marker
                position={markerPos}
                animation={google.maps.Animation.DROP}
              />
            )}
          </GoogleMap>
        </LoadScript>

        {/* Hint */}
        {!markerPos && (
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              bgcolor: "rgba(0,0,0,0.55)",
              color: "white",
              px: 2,
              py: 0.75,
              borderRadius: 2,
              fontSize: 13,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            Nhấn vào bản đồ để đặt vị trí khách sạn
          </Box>
        )}
      </Box>

      {/* ── Thông tin đơn vị hành chính ── */}
     
    </Box>
  );
}