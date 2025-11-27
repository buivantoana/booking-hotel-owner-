import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  Link,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Images
import image_left from "../../images/Frame 1321317999.png";
import vn from "../../images/VN - Vietnam.png";
import google from "../../images/Social media logo.png";
import apple from "../../images/Group.png";
import { sendOtp, userUpdate, verifyOtp } from "../../service/admin";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useBookingContext } from "../../App";

// ──────────────────────────────────────────────────────────────
// 1. Registration Form Component
// ──────────────────────────────────────────────────────────────
interface RegistrationFormProps {
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  birthDate: string;
  setBirthDate: (v: string) => void;
  onNext: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  phoneNumber,
  setPhoneNumber,
  name,
  setName,
  birthDate,
  setBirthDate,
  onNext,
}) => {
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (phoneNumber && name && birthDate) {
      try {
        let result = await sendOtp({
          "platform": "ios",
          "type": "phone",
          "value": "0" + phoneNumber
        })
        if (result.success) {
          onNext()
        }

      } catch (error) {
        console.log(error)
      }
      setLoading(false);

    };
  };
  const isValidPhone = (phoneNumber) => {
    return /^[1-9][0-9]{8,9}$/.test(phoneNumber);
  };
  const isDisabled = !phoneNumber || !name || !birthDate || !isValidPhone(phoneNumber) || loading;
  return (
    <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", py: 8 }}>
      <Grid container sx={{ alignItems: "center", minHeight: "60vh" }}>
        {/* LEFT */}
        <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "flex" }, justifyContent: "center", alignItems: "center" }}>
          <Box component="img" src={image_left} alt="Hotel illustration" sx={{ width: "592px", height: "557px", maxWidth: "100%" }} />
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} display={"flex"} justifyContent={"end"} md={6}>
          <Box sx={{ width: { xs: "100%", sm: "400px", md: "486px" } }}>
            <Typography sx={{ fontSize: { xs: "28px", md: "32px" }, fontWeight: 700, mb: 1 }}>
            Đăng ký đối tác Hotel Booking
            </Typography>
            <Typography sx={{ fontSize: "16px", mb: 4 }} color="text.secondary">
            Đăng ký để trở thành đối tác với Hotel Booking với những ưu đã độc quyền dành cho đối tác.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              {/* Phone */}
              <Typography fontSize={14} fontWeight={500} mb={0.5}>Số điện thoại</Typography>
              <TextField
                fullWidth
                placeholder="Nhập số điện thoại"
                variant="outlined"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                onBlur={() => setTouched(true)}   // chỉ validate khi blur
                error={touched && !isValidPhone(phoneNumber)}
                helperText={
                  touched && !isValidPhone(phoneNumber)
                    ? "Số điện thoại không hợp lệ, vui lòng nhập lại."
                    : ""
                }
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    height: "60px",
                    backgroundColor: "#fff",
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#98b720",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#98b720",
                      borderWidth: 1.5,
                    },
                  },
                  "& input": {
                    py: 1.5,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src={vn}
                        alt="vn"
                        style={{
                          width: 28,
                          height: 20,
                          borderRadius: 4,
                          objectFit: "cover",
                          marginRight: 8,
                        }}
                      />
                      <Typography sx={{ fontSize: 14, marginRight: 1 }}>+84</Typography>
                    </InputAdornment>
                  ),
                  endAdornment:
                    touched && !isValidPhone(phoneNumber) ? (
                      <InputAdornment position="end">
                        <Box
                          sx={{
                            cursor: "pointer",
                            fontSize: 22,
                            color: "#999",
                          }}
                          onClick={() => {
                            setPhoneNumber("");
                            setTouched(false); // reset error khi xóa
                          }}
                        >
                          ✕
                        </Box>
                      </InputAdornment>
                    ) : null,
                }}
              />

              {/* Name */}
              <Typography fontSize={14} fontWeight={500} mb={0.5}>Tên của bạn</Typography>
              <TextField
                fullWidth
                placeholder="Nhập tên của bạn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  mb: 3, "& .MuiOutlinedInput-root": {
                    borderRadius: "16px", height: "60px", backgroundColor: "#fff", "&.Mui-focused fieldset": {
                      borderColor: "#98b720",
                      borderWidth: 1.5,
                    },
                  }
                }}
              />

              {/* Birth date */}
              <Typography fontSize={14} fontWeight={500} mb={0.5}>Email</Typography>
              <TextField
                fullWidth
                placeholder="Nhập email của khách sạn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  mb: 3, "& .MuiOutlinedInput-root": {
                    borderRadius: "16px", height: "60px", backgroundColor: "#fff", "&.Mui-focused fieldset": {
                      borderColor: "#98b720",
                      borderWidth: 1.5,
                    },
                  }
                }}
              />

              {/* Agreement + Button + Social + Login link giữ nguyên như cũ */}
              {/* (đoạn này quá dài nên mình giữ nguyên copy từ code gốc của bạn) */}
              <Typography sx={{ fontSize: "14px", mb: 3 }} color="text.secondary">
                Bằng việc đăng kí tài khoản, tôi đồng ý với{" "}
                <Link href="#" sx={{ color: "#9AC700", fontWeight: 500, textDecoration: "underline" }}>
                  điều khoản và chính sách bảo mật
                </Link>{" "}
                của Hotel Booking
              </Typography>

              <Button
                type="submit"
                fullWidth
                disabled={isDisabled}
                sx={{
                  mb: 3,
                  py: 1.5,
                  borderRadius: "16px",
                  backgroundColor: isDisabled ? "#e0e0e0" : "#98b720",
                  color: isDisabled ? "#888" : "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "18px",
                  height: "56px",
                  position: "relative",
                  "&:hover": { backgroundColor: isDisabled ? "#e0e0e0" : "#98b720" },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ color: "#fff", mr: 1 }} />
                    Đang gửi mã...
                  </>
                ) : (
                  "Đăng ký"
                )}
              </Button>

              <Typography sx={{ fontSize: "14px", mb: 3 }} color="text.secondary">
              Bạn đã có tài khoản? {" "}
                <Link href="#" sx={{ color: "#EA6A00", fontWeight: 500, textDecoration: "underline" }}>
                Đăng nhập ngay
                </Link>{" "}
               
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};


const RegisterView = () => {
  const [currentStep, setCurrentStep] = useState("success");
  const [pin, setPin] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [otp, setOtp] = useState("");
  const [dataUser, setDataUser] = useState(null);
  const [timer, setTimer] = useState(55);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const navigate = useNavigate()
  // Timer
  useEffect(() => {
    if (timer > 0 && currentStep === "otp") {
      const id = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(id);
    } else if (timer === 0) {
      setIsResendEnabled(true);
    }
  }, [timer, currentStep]);

  const formatPhoneNumber = (phone: string) => phone.replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3");

  const goToOtp = () => {
    setCurrentStep("otp");
    setTimer(55);
    setIsResendEnabled(false);
  };

  const goToPin = (user) => {
    setDataUser(user)
    setCurrentStep("pin")
  };
  const goBack = () => setCurrentStep("register");

  const handleResend = () => {
    setTimer(55);
    setIsResendEnabled(false);
    setOtp("");
  };

  return (
    <>
      {currentStep === "register" && (
        <RegistrationForm
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          name={name}
          setName={setName}
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          onNext={goToOtp}
        />
      )}

{currentStep === "success" && (
        <RegisterSuccess
          
        />
      )}

     
    </>
  );
};

export default RegisterView;




import {
 
  Stack,

  Paper,
  
  useMediaQuery,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import success from "../../images/Frame 1321317962.png";

const RegisterSuccess = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        bgcolor: "#f9f9f9",
       
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}>
      <Container maxWidth='sm'>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "24px",
            bgcolor: "white",
            p: { xs: 3, sm: 4 },
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}>
          <Stack spacing={3} alignItems='center'>
            {/* ICON CHECK XANH */}
            <Box>
              <img src={success} alt='' />
            </Box>

            {/* TIÊU ĐỀ */}
            <Typography
              fontWeight={700}
              fontSize={{ xs: "1.25rem", sm: "1.5rem" }}
              color='rgba(152, 183, 32, 1)'>
             Đăng ký thành công
            </Typography>

            {/* MÔ TẢ */}
            <Typography fontSize='0.9rem' color='#666' lineHeight={1.5}>
            Chúng tôi đã gửi mật khẩu về địa chỉ email <strong>thangdv@gmail.com</strong>  mà bạn đã đăng ký. Bạn có thể truy cập hòm thư để lấy thông tin đăng nhập.


             
              
            </Typography>
            <Typography fontSize='0.9rem' color='#666' lineHeight={1.5}>
            Tiếp theo, vui lòng tạo khách sạn của bạn để bắt đầu kinh doanh cùng Hotel booking trong thời gian sớm nhất.


             
              
            </Typography>
           

            {/* THÔNG TIN CHI TIẾT */}
           
            {/* NÚT HÀNH ĐỘNG */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              width='100%'
              mt={2}>
             
              <Button
              onClick={()=>{
                
              }}
                fullWidth
                variant='contained'
                sx={{
                  bgcolor: "#98b720",
                  color: "white",
                  borderRadius: "50px",
                  fontWeight: 600,
                  textTransform: "none",
                  py: 1.5,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 12px rgba(152, 183, 32, 0.3)",
                  "&:hover": {
                    bgcolor: "#7a9a1a",
                  },
                }}>
                Tạo khách sạn ngay
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

