/** @jsxImportSource react */
import React, { useState, useEffect, useMemo } from 'react';
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
  IconButton,
  Chip,
  PaletteMode,
  Divider
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { 
  Dashboard as DashboardIcon, 
  Settings as SettingsIcon, 
  Lightbulb as LightbulbIcon,
  Circle as CircleIcon,
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

// --- PHẦN 1: DỮ LIỆU MẪU (MOCK DATA) ---
const generateData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: `${i * 5}s`,
    lux: Math.floor(Math.random() * (1200 - 300) + 300),
  }));
};

// --- PHẦN 2: CÁC THÀNH PHẦN GIAO DIỆN (COMPONENTS) ---

const Dashboard = () => {
  const [data, setData] = useState(generateData());
  const [luxValue, setLuxValue] = useState(1240);
  const [isOn, setIsOn] = useState(true);

  useEffect(() => {
    if (!isOn) return;
    const interval = setInterval(() => {
      const newValue = Math.floor(Math.random() * (1500 - 200) + 200);
      setLuxValue(newValue);
      setData(prev => {
        const lastTime = parseInt(prev[prev.length - 1].time);
        const nextTime = `${lastTime + 5}s`;
        return [...prev.slice(1), { time: nextTime, lux: newValue }];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isOn]);

  return (
    <Box sx={{ width: '100%' }}>
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

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ borderRadius: 5, overflow: 'visible', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
              <Box sx={{ position: 'relative', mr: 5, minWidth: 280 }}>
                <Box sx={{ 
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: 140, height: 140, borderRadius: '50%', 
                  background: 'radial-gradient(circle, rgba(25, 118, 210, 0.15) 0%, rgba(25, 118, 210, 0) 70%)',
                  animation: isOn ? 'pulse 2s infinite' : 'none',
                  opacity: isOn ? 1 : 0
                }} />
                <Typography variant="h1" fontWeight="900" color="primary.main" sx={{ position: 'relative', fontSize: '4.5rem', whiteSpace: 'nowrap' }}>
                  {isOn ? luxValue : 'N/A'} <Typography component="span" variant="h4" sx={{ opacity: 0.5 }}>Lux</Typography>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {isOn ? 'SENSOR ACTIVE' : 'SENSOR STANDBY'}
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1, height: 120 }}>
                <AnimatePresence>
                  {isOn && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                          <Area type="monotone" dataKey="lux" stroke="#1976d2" fill="rgba(25, 118, 210, 0.08)" strokeWidth={4} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 2.5 }}>
          <Card sx={{ borderRadius: 5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', minWidth: 220 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>System Status</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <CircleIcon sx={{ 
                color: isOn ? '#4caf50' : '#f44336', 
                mr: 1.5, 
                fontSize: 32, 
                filter: isOn ? 'drop-shadow(0 0 8px rgba(76, 175, 80, 0.4))' : 'none',
                transition: 'color 0.3s ease'
              }} />
              <Typography variant="h4" fontWeight="900" sx={{ minWidth: 140 }}>
                {isOn ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 2.5 }}>
          <Card sx={{ borderRadius: 5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', minWidth: 220 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>Hardware Control</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="h4" fontWeight="900" sx={{ minWidth: 80 }}>
                {isOn ? 'ON' : 'OFF'}
              </Typography>
              <Switch checked={isOn} onChange={(e) => setIsOn(e.target.checked)} color="primary" sx={{ transform: 'scale(1.2)' }} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 5, p: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)', minHeight: 550 }}>
        <Typography variant="h6" fontWeight="800" sx={{ mb: 3 }}>Luminosity History (Real-time)</Typography>
        <Box sx={{ height: 450, position: 'relative' }}>
          <AnimatePresence mode="wait">
            {isOn ? (
              <motion.div
                key="chart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ width: '100%', height: '100%' }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorLux" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={false} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} unit=" lx" />
                    <Tooltip 
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="lux" stroke="#1976d2" fill="url(#colorLux)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            ) : (
              <motion.div
                key="offline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.02)',
                  borderRadius: 20
                }}
              >
                <LightbulbIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.2 }} />
                <Typography variant="h5" fontWeight="800" color="text.disabled">Sensor Offline</Typography>
                <Typography variant="body2" color="text.disabled">Turn on the sensor to view live data</Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Card>

      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.4; }
        }
      `}</style>
    </Box>
  );
};

const Settings = ({ currentTheme, onThemeChange }: { currentTheme: string, onThemeChange: (name: string) => void }) => {
  const themes = [
    { name: 'Classic Light', color: '#ffffff', desc: 'Clean and professional' },
    { name: 'Deep Night', color: '#1a1a2e', desc: 'Easy on the eyes' },
    { name: 'Cyberpunk', color: '#2d005d', desc: 'High contrast neon' },
    { name: 'Nature', color: '#1b4332', desc: 'Calm forest vibes' },
    { name: 'Ocean', color: '#0077b6', desc: 'Deep blue serenity' },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="900" sx={{ mb: 1, letterSpacing: -1 }}>Appearance</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>Customize your dashboard experience</Typography>
      
      <Grid container spacing={4}>
        {themes.map((theme, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={index}>
            <Card 
              onClick={() => onThemeChange(theme.name)}
              sx={{ 
                borderRadius: 5, 
                cursor: 'pointer', 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: currentTheme === theme.name ? '3px solid #1976d2' : '1px solid rgba(0,0,0,0.05)',
                transform: currentTheme === theme.name ? 'scale(1.02)' : 'none',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }
              }}
            >
              <Box sx={{ height: 160, bgcolor: theme.color, position: 'relative' }}>
                {currentTheme === theme.name && (
                  <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'primary.main', borderRadius: '50%', p: 0.5, display: 'flex' }}>
                    <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                )}
              </Box>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" fontWeight="800">{theme.name}</Typography>
                <Typography variant="caption" color="text.secondary">{theme.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// --- PHẦN 3: ỨNG DỤNG CHÍNH (MAIN APP) ---

const drawerWidth = 280;

const THEME_CONFIGS: Record<string, any> = {
  'Classic Light': { mode: 'light', primary: '#1976d2', background: '#f8f9fc' },
  'Deep Night': { mode: 'dark', primary: '#90caf9', background: '#0f0f1a' },
  'Cyberpunk': { mode: 'dark', primary: '#ff00ff', background: '#1a0033' },
  'Nature': { mode: 'dark', primary: '#81c784', background: '#0d1f17' },
  'Ocean': { mode: 'dark', primary: '#4fc3f7', background: '#001d3d' },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [themeName, setThemeName] = useState('Classic Light');

  const theme = useMemo(() => {
    const config = THEME_CONFIGS[themeName];
    return createTheme({
      palette: {
        mode: config.mode as PaletteMode,
        primary: { main: config.primary },
        background: { 
          default: config.background,
          paper: config.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#ffffff'
        },
      },
      typography: { fontFamily: '"Inter", sans-serif' },
      shape: { borderRadius: 20 },
    });
  }, [themeName]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CssBaseline />
        
        {/* Sidebar bên trái - Cố định và chuyên nghiệp */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box', 
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              px: 2
            },
          }}
        >
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

          <List sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton 
                  selected={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                  sx={{ 
                    borderRadius: 3,
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.2s',
                    mb: 1,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                      '& .MuiListItemIcon-root': { color: 'white' }
                    },
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.08)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: activeTab === item.id ? 'white' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ fontWeight: 700, fontSize: '0.95rem' }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Nội dung chính - Chiếm trọn không gian còn lại */}
        <Box component="main" sx={{ flexGrow: 1, p: 4, width: `calc(100% - ${drawerWidth}px)` }}>
          <Container maxWidth={false} disableGutters>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'dashboard' ? (
                  <Dashboard />
                ) : (
                  <Settings currentTheme={themeName} onThemeChange={setThemeName} />
                )}
              </motion.div>
            </AnimatePresence>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
