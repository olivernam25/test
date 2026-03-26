import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Container,
  Card,
  CardContent,
  Switch,
  Chip,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Lightbulb as LightbulbIcon,
  Circle as CircleIcon,
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// =============================================
// HÀM TẠO DỮ LIỆU MẪU
// Tạo mảng 20 điểm dữ liệu giả để vẽ biểu đồ
// =============================================
function taoduLieuMau() {
  const mangDuLieu = [];
  for (let i = 0; i < 20; i++) {
    mangDuLieu.push({
      time: i * 5 + 's',
      lux: Math.floor(Math.random() * 900 + 300), // số ngẫu nhiên từ 300 đến 1200
    });
  }
  return mangDuLieu;
}

// =============================================
// CÁC CẤU HÌNH THEME (MÀU SẮC)
// Mỗi theme có: chế độ sáng/tối, màu chính, màu nền
// =============================================
const danhSachTheme = {
  'Classic Light': { mode: 'light', mauChinh: '#1976d2', mauNen: '#f8f9fc' },
  'Deep Night':    { mode: 'dark',  mauChinh: '#90caf9', mauNen: '#0f0f1a' },
  'Cyberpunk':     { mode: 'dark',  mauChinh: '#ff00ff', mauNen: '#1a0033' },
  'Nature':        { mode: 'dark',  mauChinh: '#81c784', mauNen: '#0d1f17' },
  'Ocean':         { mode: 'dark',  mauChinh: '#4fc3f7', mauNen: '#001d3d' },
};

// =============================================
// COMPONENT: DASHBOARD
// Hiển thị giá trị lux, biểu đồ, trạng thái hệ thống
// =============================================
function Dashboard() {
  // Biến state: dữ liệu biểu đồ, giá trị lux, trạng thái bật/tắt
  const [duLieu, setDuLieu] = useState(taoduLieuMau());
  const [luxHienTai, setLuxHienTai] = useState(1240);
  const [dangBat, setDangBat] = useState(true);

  // Tạo timer cập nhật dữ liệu mỗi 3 giây khi sensor đang bật
  useEffect(() => {
    if (!dangBat) return; // nếu tắt thì không làm gì

    const timer = setInterval(function () {
      // Tạo giá trị lux mới ngẫu nhiên từ 200 đến 1700
      const luxMoi = Math.floor(Math.random() * 1300 + 200);
      setLuxHienTai(luxMoi);

      // Cập nhật mảng dữ liệu: xóa điểm đầu tiên, thêm điểm mới vào cuối
      setDuLieu(function (duLieuCu) {
        const thoiGianCuoi = parseInt(duLieuCu[duLieuCu.length - 1].time);
        const diemMoi = { time: thoiGianCuoi + 5 + 's', lux: luxMoi };
        return [...duLieuCu.slice(1), diemMoi];
      });
    }, 3000);

    // Dọn dẹp timer khi component bị xóa khỏi màn hình
    return function () {
      clearInterval(timer);
    };
  }, [dangBat]); // chạy lại useEffect mỗi khi dangBat thay đổi

  return (
    <Box sx={{ width: '100%' }}>

      {/* Tiêu đề trang */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: -1 }}>
          Real-time Dashboard
        </Typography>
        <Chip
          icon={<AutoAwesomeIcon />}
          label="Auto-Theme Active"
          color="primary"
          sx={{ borderRadius: 2, fontWeight: 'bold', px: 1 }}
        />
      </Box>

      {/* Hàng card trên: lux + mini chart, system status, hardware control */}
      <Grid container spacing={3} sx={{ mb: 4 }}>

        {/* Card 1: Giá trị Lux + mini chart */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ borderRadius: 5, boxShadow: '0 20px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 4 }}>

              {/* Phần hiển thị số lux */}
              <Box sx={{ position: 'relative', mr: 5, minWidth: 280 }}>
                {/* Hiệu ứng sáng phía sau số lux */}
                <Box sx={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 140, height: 140, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(25,118,210,0.15) 0%, rgba(25,118,210,0) 70%)',
                  animation: dangBat ? 'pulse 2s infinite' : 'none',
                  opacity: dangBat ? 1 : 0,
                }} />

                <Typography variant="h1" fontWeight="900" color="primary.main"
                  sx={{ position: 'relative', fontSize: '4.5rem', whiteSpace: 'nowrap' }}>
                  {dangBat ? luxHienTai : 'N/A'}{' '}
                  <Typography component="span" variant="h4" sx={{ opacity: 0.5 }}>Lux</Typography>
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {dangBat ? 'SENSOR ACTIVE' : 'SENSOR STANDBY'}
                </Typography>
              </Box>

              {/* Mini chart bên phải số lux */}
              <Box sx={{ flexGrow: 1, height: 120 }}>
                <AnimatePresence>
                  {dangBat && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={duLieu}>
                          <Area type="monotone" dataKey="lux"
                            stroke="#1976d2" fill="rgba(25,118,210,0.08)" strokeWidth={4} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>

            </CardContent>
          </Card>
        </Grid>

        {/* Card 2: System Status */}
        <Grid size={{ xs: 12, md: 6, lg: 2.5 }}>
          <Card sx={{ borderRadius: 5, height: '100%', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', p: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', minWidth: 220 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
              System Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <CircleIcon sx={{
                color: dangBat ? '#4caf50' : '#f44336',
                mr: 1.5, fontSize: 32,
                filter: dangBat ? 'drop-shadow(0 0 8px rgba(76,175,80,0.4))' : 'none',
                transition: 'color 0.3s ease',
              }} />
              <Typography variant="h4" fontWeight="900" sx={{ minWidth: 140 }}>
                {dangBat ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Card 3: Hardware Control */}
        <Grid size={{ xs: 12, md: 6, lg: 2.5 }}>
          <Card sx={{ borderRadius: 5, height: '100%', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', p: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', minWidth: 220 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
              Hardware Control
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="h4" fontWeight="900" sx={{ minWidth: 80 }}>
                {dangBat ? 'ON' : 'OFF'}
              </Typography>
              <Switch
                checked={dangBat}
                onChange={function (e) { setDangBat(e.target.checked); }}
                color="primary"
                sx={{ transform: 'scale(1.2)' }}
              />
            </Box>
          </Card>
        </Grid>

      </Grid>

      {/* Biểu đồ lịch sử lux lớn */}
      <Card sx={{ borderRadius: 5, p: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.05)', minHeight: 550 }}>
        <Typography variant="h6" fontWeight="800" sx={{ mb: 3 }}>
          Luminosity History (Real-time)
        </Typography>

        <Box sx={{ height: 450, position: 'relative' }}>
          <AnimatePresence mode="wait">

            {/* Khi sensor BẬT: hiển thị biểu đồ */}
            {dangBat ? (
              <motion.div key="chart"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ width: '100%', height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={duLieu}>
                    <defs>
                      <linearGradient id="mauNen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#1976d2" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={false} />
                    <YAxis axisLine={false} tickLine={false}
                      tick={{ fontSize: 12, fontWeight: 600 }} unit=" lx" />
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="lux"
                      stroke="#1976d2" fill="url(#mauNen)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            ) : (
              /* Khi sensor TẮT: hiển thị thông báo offline */
              <motion.div key="offline"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ width: '100%', height: '100%', display: 'flex',
                  flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.02)', borderRadius: 16 }}>
                <LightbulbIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.2 }} />
                <Typography variant="h5" fontWeight="800" color="text.disabled">Sensor Offline</Typography>
                <Typography variant="body2" color="text.disabled">Turn on the sensor to view live data</Typography>
              </motion.div>
            )}

          </AnimatePresence>
        </Box>
      </Card>

      {/* CSS animation cho hiệu ứng pulse */}
      <style>{`
        @keyframes pulse {
          0%   { transform: translate(-50%, -50%) scale(0.9); opacity: 0.4; }
          50%  { transform: translate(-50%, -50%) scale(1.1); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.4; }
        }
      `}</style>

    </Box>
  );
}

// =============================================
// COMPONENT: SETTINGS
// Cho phép chọn theme giao diện
// props: themeHienTai (string), khiDoiTheme (function)
// =============================================
function Settings(props) {
  const themeHienTai = props.themeHienTai;
  const khiDoiTheme  = props.khiDoiTheme;

  // Danh sách các theme để hiển thị
  const cacTheme = [
    { ten: 'Classic Light', mau: '#ffffff',  moTa: 'Clean and professional' },
    { ten: 'Deep Night',    mau: '#1a1a2e',  moTa: 'Easy on the eyes' },
    { ten: 'Cyberpunk',     mau: '#2d005d',  moTa: 'High contrast neon' },
    { ten: 'Nature',        mau: '#1b4332',  moTa: 'Calm forest vibes' },
    { ten: 'Ocean',         mau: '#0077b6',  moTa: 'Deep blue serenity' },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="900" sx={{ mb: 1, letterSpacing: -1 }}>
        Appearance
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        Customize your dashboard experience
      </Typography>

      <Grid container spacing={4}>
        {cacTheme.map(function (theme, viTri) {
          const dangChon = themeHienTai === theme.ten;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={viTri}>
              <Card
                onClick={function () { khiDoiTheme(theme.ten); }}
                sx={{
                  borderRadius: 5,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: dangChon ? '3px solid #1976d2' : '1px solid rgba(0,0,0,0.05)',
                  transform: dangChon ? 'scale(1.02)' : 'none',
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
                }}
              >
                {/* Ô màu preview */}
                <Box sx={{ height: 160, bgcolor: theme.mau, position: 'relative' }}>
                  {dangChon && (
                    <Box sx={{ position: 'absolute', top: 12, right: 12,
                      bgcolor: 'primary.main', borderRadius: '50%', p: 0.5, display: 'flex' }}>
                      <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" fontWeight="800">{theme.ten}</Typography>
                  <Typography variant="caption" color="text.secondary">{theme.moTa}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

// =============================================
// COMPONENT CHÍNH: APP
// Quản lý sidebar, chuyển trang, và chọn theme
// =============================================
const RONG_SIDEBAR = 280;

export default function App() {
  const [tabHienTai, setTabHienTai] = useState('dashboard');
  const [tenTheme,   setTenTheme]   = useState('Classic Light');

  // Tạo object theme MUI từ cấu hình đã chọn
  const cauHinhTheme = danhSachTheme[tenTheme];
  const theme = createTheme({
    palette: {
      mode: cauHinhTheme.mode,
      primary: { main: cauHinhTheme.mauChinh },
      background: {
        default: cauHinhTheme.mauNen,
        paper: cauHinhTheme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#ffffff',
      },
    },
    typography: { fontFamily: '"Inter", sans-serif' },
    shape: { borderRadius: 20 },
  });

  // Danh sách các mục điều hướng trên sidebar
  const cacMucNav = [
    { id: 'dashboard', nhan: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'settings',  nhan: 'Settings',  icon: <SettingsIcon /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CssBaseline />

        {/* ---- SIDEBAR TRÁI ---- */}
        <Drawer
          variant="permanent"
          sx={{
            width: RONG_SIDEBAR,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: RONG_SIDEBAR,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              px: 2,
            },
          }}
        >
          {/* Logo LightSense */}
          <Toolbar sx={{ my: 4, px: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 2, display: 'flex' }}>
                <LightbulbIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography variant="h5" fontWeight="900" color="text.primary" sx={{ letterSpacing: -1 }}>
                LightSense
              </Typography>
            </Box>
          </Toolbar>

          <Divider sx={{ mb: 4, opacity: 0.5 }} />

          {/* Danh sách nút điều hướng */}
          <List sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
            {cacMucNav.map(function (muc) {
              const dangChon = tabHienTai === muc.id;
              return (
                <ListItem key={muc.id} disablePadding>
                  <ListItemButton
                    selected={dangChon}
                    onClick={function () { setTabHienTai(muc.id); }}
                    sx={{
                      borderRadius: 3, py: 1.5, px: 2, transition: 'all 0.2s', mb: 1,
                      '&.Mui-selected': {
                        bgcolor: 'primary.main', color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                        '& .MuiListItemIcon-root': { color: 'white' },
                      },
                      '&:hover': { bgcolor: 'rgba(25,118,210,0.08)' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: dangChon ? 'white' : 'text.secondary' }}>
                      {muc.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={muc.nhan}
                      primaryTypographyProps={{ fontWeight: 700, fontSize: '0.95rem' }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Drawer>

        {/* ---- NỘI DUNG CHÍNH ---- */}
        <Box component="main" sx={{ flexGrow: 1, p: 4, width: `calc(100% - ${RONG_SIDEBAR}px)` }}>
          <Container maxWidth={false} disableGutters>
            <AnimatePresence mode="wait">
              <motion.div
                key={tabHienTai}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Hiển thị Dashboard hoặc Settings tùy tab đang chọn */}
                {tabHienTai === 'dashboard' ? (
                  <Dashboard />
                ) : (
                  <Settings
                    themeHienTai={tenTheme}
                    khiDoiTheme={setTenTheme}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </Container>
        </Box>

      </Box>
    </ThemeProvider>
  );
}
