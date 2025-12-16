// ProfileForm.jsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const ProfileView = () => {
  // State cho các field
  const [formData, setFormData] = React.useState({
    fullName: 'Thangdv',
    phone: '0123456789',
    email: 'ABC@gmail.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State hiển thị/ẩn mật khẩu
  const [showPassword, setShowPassword] = React.useState({
    current: false,
    new: false,
    confirm: false,
  });

  // State thông báo
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success'); // success | error

  // Handle thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle hiển thị mật khẩu
  const handleClickShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation cơ bản
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setSnackbarSeverity('error');
        setSnackbarMessage('Mật khẩu mới và xác nhận không khớp!');
        setOpenSnackbar(true);
        return;
      }
      if (formData.newPassword.length < 6) {
        setSnackbarSeverity('error');
        setSnackbarMessage('Mật khẩu mới phải ít nhất 6 ký tự!');
        setOpenSnackbar(true);
        return;
      }
      if (!formData.currentPassword) {
        setSnackbarSeverity('error');
        setSnackbarMessage('Vui lòng nhập mật khẩu hiện tại để thay đổi mật khẩu!');
        setOpenSnackbar(true);
        return;
      }
    }

    // Giả lập gọi API thành công (thay bằng fetch/axios thực tế)
    console.log('Đang cập nhật hồ sơ:', formData);

    // Thành công
    setSnackbarSeverity('success');
    setSnackbarMessage('Cập nhật hồ sơ thành công!');
    setOpenSnackbar(true);

    // Nếu bạn muốn reset mật khẩu sau khi cập nhật thành công
    setFormData((prev) => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  // Đóng snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          p: { xs: 3, sm: 5 },
          mx: 'auto',
        }}
      >
        

        <Grid container spacing={3}>
          {/* User ID - disabled */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
              User ID
            </Typography>
            <TextField
              fullWidth
              value="ABC@gmail.com"
              disabled
              variant="outlined"
              sx={{
               
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  height: "45px",
                  backgroundColor: "#fff",
                  "&.Mui-focused fieldset": {
                    borderColor: "#98b720",
                    borderWidth: 1.5,
                  },
                },
              }}
            />
          </Grid>

          {/* Tên của bạn */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
              Tên của bạn
            </Typography>
            <TextField
              fullWidth
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              variant="outlined"
              sx={{
               
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  height: "45px",
                  backgroundColor: "#fff",
                  "&.Mui-focused fieldset": {
                    borderColor: "#98b720",
                    borderWidth: 1.5,
                  },
                },
              }}
              required
            />
          </Grid>

          {/* Số điện thoại */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
              Số điện thoại
            </Typography>
            <TextField
              fullWidth
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
              sx={{
                
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  height: "45px",
                  backgroundColor: "#fff",
                  "&.Mui-focused fieldset": {
                    borderColor: "#98b720",
                    borderWidth: 1.5,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Box component="img" src="https://flagcdn.com/w20/vn.png" alt="VN" sx={{ width: 20 }} />
                      +84
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
              Email
            </Typography>
            <TextField
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              sx={{
              
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  height: "45px",
                  backgroundColor: "#fff",
                  "&.Mui-focused fieldset": {
                    borderColor: "#98b720",
                    borderWidth: 1.5,
                  },
                },
              }}
              type="email"
            />
          </Grid>

          {/* Mật khẩu hiện hành */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
              Mật khẩu hiện hành
            </Typography>
            <TextField
              fullWidth
              name="currentPassword"
              type={showPassword.current ? 'text' : 'password'}
              placeholder="Mật khẩu hiện hành"
              value={formData.currentPassword}
              onChange={handleChange}
              variant="outlined"
              sx={{
            
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  height: "45px",
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
                      onClick={() => handleClickShowPassword('current')}
                      edge="end"
                    >
                      {showPassword.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Mật khẩu mới */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
              Mật khẩu mới
            </Typography>
            <TextField
              fullWidth
              name="newPassword"
              type={showPassword.new ? 'text' : 'password'}
              placeholder="Mật khẩu mới"
              value={formData.newPassword}
              onChange={handleChange}
              variant="outlined"
              sx={{
              
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  height: "45px",
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
                      onClick={() => handleClickShowPassword('new')}
                      edge="end"
                    >
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Xác nhận mật khẩu mới */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
              Xác nhận mật khẩu mới
            </Typography>
            <TextField
              fullWidth
              name="confirmPassword"
              type={showPassword.confirm ? 'text' : 'password'}
              placeholder="Xác nhận mật khẩu mới"
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="outlined"
              sx={{
                
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  height: "45px",
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
                      onClick={() => handleClickShowPassword('confirm')}
                      edge="end"
                    >
                      {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Nút Cập nhật */}
          <Grid item xs={12}>
            <Button
             
              
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#98b720',
                mt: 2,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: '60px',
                textTransform: 'none',
                textAlign:"right",
                '&:hover': { bgcolor: '#43A047' },
              }}
            >
              Cập nhật
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar thông báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfileView;