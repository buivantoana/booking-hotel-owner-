import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import image_left from "../../images/Frame 1321317999.png";
import { Login } from "../../service/admin";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useBookingContext } from "../../App";

const LoginView = () => {
  return <RegistrationForm />;
};

export default LoginView;

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ← Thêm state toggle

  // Validation states
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

  const context = useBookingContext();
  const navigate = useNavigate();

  const isValidEmail = (value: string): boolean => {
    if (!value) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
  };

  const getEmailError = () => {
    if (!touchedEmail) return false;
    if (!email) return "Email không được để trống";
    if (!isValidEmail(email)) return "Email không đúng định dạng";
    return false;
  };

  const getPasswordError = () => {
    if (!touchedPassword) return false;
    if (!password) return "Mật khẩu không được để trống";
    return false;
  };

  const handleLogin = async () => {
    setTouchedEmail(true);
    setTouchedPassword(true);

    if (!email || !isValidEmail(email) || !password) {
      return;
    }

    setLoading(true);

    try {
      const result = await Login({
        email,
        password,
      });

      if (result?.access_token) {
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.partner));

        context.dispatch({
          type: "LOGIN",
          payload: {
            ...context.state,
            user: { ...result.partner },
          },
        });

        toast.success("Đăng nhập thành công");
        // navigate("/") // uncomment nếu muốn redirect sau login
      } else {
        toast.error("Đăng nhập thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email && isValidEmail(email) && password;

  return (
    <Container
      maxWidth="lg"
      sx={{ display: "flex", alignItems: "center", py: 5, minHeight: "100vh" }}
    >
      <Grid container sx={{ alignItems: "center", minHeight: "60vh" }}>
        {/* LEFT ILLUSTRATION */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "start",
          }}
        >
          <Box
            component="img"
            src={image_left}
            alt="Hotel illustration"
            sx={{
              width: "592px",
              height: "557px",
              maxWidth: "100%",
            }}
          />
        </Grid>

        {/* RIGHT FORM */}
        <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "end" }}>
          <Box
            sx={{
              px: { xs: 3, sm: 4, md: 0 },
              display: "flex",
              flexDirection: "column",
              width: { xs: "100%", sm: "400px", md: "486px" },
            }}
          >
            <Typography
              sx={{ fontSize: { xs: "28px", md: "32px" } }}
              fontWeight={700}
              mb={1}
            >
              Đăng nhập
            </Typography>

            <Box>
              {/* EMAIL */}
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Email
              </Typography>
              <TextField
                fullWidth
                placeholder="Nhập email của khách sạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouchedEmail(true)}
                error={!!getEmailError()}
                helperText={getEmailError() || " "}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    height: "60px",
                    backgroundColor: "#fff",
                    "&.Mui-focused fieldset": {
                      borderColor: "#98b720",
                      borderWidth: 1.5,
                    },
                  },
                }}
              />

              {/* PASSWORD với toggle */}
              <Typography fontSize={14} fontWeight={500} mb={0.5}>
                Mật khẩu
              </Typography>
              <TextField
                fullWidth
                placeholder="Nhập mật khẩu"
                type={showPassword ? "text" : "password"} // ← Toggle type
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouchedPassword(true)}
                error={!!getPasswordError()}
                helperText={getPasswordError() || " "}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    height: "60px",
                    backgroundColor: "#fff",
                    "&.Mui-focused fieldset": {
                      borderColor: "#98b720",
                      borderWidth: 1.5,
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()} // ngăn focus mất
                        edge="end"
                        sx={{ color: "#666" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormGroup>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Duy trì đăng nhập"
                />
              </FormGroup>

              <Button
                onClick={handleLogin}
                variant="contained"
                fullWidth
                disabled={loading || !isFormValid}
                sx={{
                  mb: 3,
                  py: 1.5,
                  borderRadius: "16px",
                  backgroundColor: isFormValid ? "#98b720" : "#e0e0e0",
                  color: isFormValid ? "#fff" : "#888",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "18px",
                  height: "56px",
                  "&:hover": {
                    backgroundColor: isFormValid ? "#98b720" : "#e0e0e0",
                  },
                  boxShadow: "none",
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ color: "#fff", mr: 1 }} />
                    Đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>

              <Typography sx={{ fontSize: "14px" }} color="text.secondary">
                <a
                  href="/register"
                  style={{
                    color: "#ff7a00",
                    fontWeight: 500,
                    textDecoration: "underline",
                  }}
                >
                  Đăng Ký trở thành đối tác Hotel Booking
                </a>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};