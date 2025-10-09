import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export default function MessageComposer() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    if (!phone || !message) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/whatsapp/send`, {
        phone,
        message,
      });

      console.log('Message sent:', response.data);
      setSuccess(true);
      
      // Clear form
      setPhone('');
      setMessage('');
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <TextField
        label="Phone Number (with country code, e.g., 919876543210)"
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
        fullWidth
        margin="normal"
        placeholder="919876543210"
        helperText="Enter phone number without + or spaces"
        disabled={loading}
      />
      
      <TextField
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
        placeholder="Type your message here..."
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
        disabled={loading || !phone || !message}
        startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
        sx={{ mt: 2 }}
        fullWidth
      >
        {loading ? 'Sending...' : 'Send Message'}
      </Button>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Message sent successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}

