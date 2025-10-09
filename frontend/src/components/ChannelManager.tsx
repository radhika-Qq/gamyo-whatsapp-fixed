import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Snackbar,
  Typography,
} from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function ChannelManager() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    if (!message) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/whatsapp/channel`, {
        message,
      });

      console.log('Channel update sent:', response.data);
      setSuccess(true);
      
      // Clear form
      setMessage('');
    } catch (err: any) {
      console.error('Failed to send channel update:', err);
      setError(err.response?.data?.message || 'Failed to send channel update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          Channel updates will be posted to your WhatsApp Channel and visible to all followers.
          Make sure you have configured your CHANNEL_ID in the backend .env file.
        </Typography>
      </Alert>

      <TextField
        label="Channel Update"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
        placeholder="Type your channel announcement here..."
        helperText={`${message.length} characters`}
        disabled={loading}
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        onClick={handleSend}
        disabled={loading || !message}
        startIcon={loading ? <CircularProgress size={20} /> : <AnnouncementIcon />}
        sx={{ mt: 2 }}
        fullWidth
      >
        {loading ? 'Posting...' : 'Post Channel Update'}
      </Button>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Channel update posted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}

