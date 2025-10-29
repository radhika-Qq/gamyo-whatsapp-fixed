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
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import MessageIcon from '@mui/icons-material/Message';
import CampaignIcon from '@mui/icons-material/Campaign';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import MessageComposer from './components/MessageComposer';
import BroadcastComposer from './components/BroadcastComposer';
import ChannelManager from './components/ChannelManager';
import LinkedInComposer from './components/LinkedInComposer';
import FacebookComposer from './components/FacebookComposer';
import InstagramComposer from './components/InstagramComposer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0A66C2', // LinkedIn blue
    },
    secondary: {
      main: '#25D366', // WhatsApp green
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
            <WhatsAppIcon sx={{ mr: 1 }} />
            <LinkedInIcon sx={{ mr: 1 }} />
            <FacebookIcon sx={{ mr: 1 }} />
            <InstagramIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Gamyo Multi-Platform Integration
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Social Media & Messaging Platform
          </Typography>
          
          <Paper sx={{ mt: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab 
                icon={<LinkedInIcon />} 
                label="LinkedIn" 
                iconPosition="start"
              />
              <Tab 
                icon={<FacebookIcon />} 
                label="Facebook" 
                iconPosition="start"
              />
              <Tab 
                icon={<InstagramIcon />} 
                label="Instagram" 
                iconPosition="start"
              />
              <Tab 
                icon={<MessageIcon />} 
                label="WhatsApp 1:1" 
                iconPosition="start"
              />
              <Tab 
                icon={<CampaignIcon />} 
                label="WhatsApp Broadcast" 
                iconPosition="start"
              />
              <Tab 
                icon={<AnnouncementIcon />} 
                label="WhatsApp Channel" 
                iconPosition="start"
              />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && <LinkedInComposer />}
              {activeTab === 1 && <FacebookComposer />}
              {activeTab === 2 && <InstagramComposer />}
              {activeTab === 3 && <MessageComposer />}
              {activeTab === 4 && <BroadcastComposer />}
              {activeTab === 5 && <ChannelManager />}
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

