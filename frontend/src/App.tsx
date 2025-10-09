import React from 'react';
import {
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <WhatsAppIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Gamyo WhatsApp Business API Prototype
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              WhatsApp Integration Demo
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Test 1:1 messaging, broadcasts, and channel updates using WhatsApp Business API
            </Typography>
          </Box>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              1:1 Messaging
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Send individual messages to WhatsApp users
            </Typography>
            <MessageComposer />
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Broadcast Messages
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Send bulk messages to multiple contacts (requires opt-in)
            </Typography>
            <BroadcastComposer />
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Channel Updates
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Post updates to your WhatsApp Channel
            </Typography>
            <ChannelManager />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

