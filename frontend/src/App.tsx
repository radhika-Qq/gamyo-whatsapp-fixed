import React, { useState } from 'react';
import {
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MessageIcon from '@mui/icons-material/Message';
import CampaignIcon from '@mui/icons-material/Campaign';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import MessageComposer from './components/MessageComposer';
import BroadcastComposer from './components/BroadcastComposer';
import ChannelManager from './components/ChannelManager';

const theme = createTheme({
  palette: {
    primary: {
      main: '#25D366', // WhatsApp green
    },
    secondary: {
      main: '#128C7E',
    },
  },
});

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <WhatsAppIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Gamyo WhatsApp Business API
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            WhatsApp Business Messaging
          </Typography>
          
          <Paper sx={{ mt: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab 
                icon={<MessageIcon />} 
                label="1:1 Messaging" 
                iconPosition="start"
              />
              <Tab 
                icon={<CampaignIcon />} 
                label="Broadcast Messaging" 
                iconPosition="start"
              />
              <Tab 
                icon={<AnnouncementIcon />} 
                label="Channel Messaging" 
                iconPosition="start"
              />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && <MessageComposer />}
              {activeTab === 1 && <BroadcastComposer />}
              {activeTab === 2 && <ChannelManager />}
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

