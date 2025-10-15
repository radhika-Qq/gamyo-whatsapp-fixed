import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const API_URL = 'http://localhost:3000';

export default function MessageComposer() {
  const [phone, setPhone] = useState('916300338763'); // Default to your allowed number
  const [message, setMessage] = useState('Hello from Gamyo.ai!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const res = await fetch(`${API_URL}/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send message');
      setResponse(data);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Send WhatsApp Message
      </Typography>
      <TextField
        label="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
        margin="normal"
        placeholder="e.g., 916300338763"
        disabled={loading}
      />
      <TextField
        label="Message (Note: Will send 'hello_world' template)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
        disabled={loading}
        helperText="Currently sends the 'hello_world' template message regardless of input"
      />
      <Button
        variant="contained"
        onClick={handleSend}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
        sx={{ mt: 2 }}
        fullWidth
      >
        {loading ? 'Sending...' : 'Send Message'}
      </Button>
      {response && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
          <Typography variant="body2" color="success.contrastText">
            Success! Message ID: {response.messages[0].id}
          </Typography>
        </Box>
      )}
      {error && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography variant="body2" color="error.contrastText">
            Error: {error}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

