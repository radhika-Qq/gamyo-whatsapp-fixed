import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Snackbar,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Typography,
  Chip,
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const TEMPLATES = [
  { value: 'diwali_offer', label: 'Diwali Offer' },
  { value: 'appointment_reminder', label: 'Appointment Reminder' },
  { value: 'product_launch', label: 'Product Launch' },
  { value: 'seasonal_sale', label: 'Seasonal Sale' },
];

export default function BroadcastComposer() {
  const [template, setTemplate] = useState('diwali_offer');
  const [contacts, setContacts] = useState('');
  const [optedIn, setOptedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<any>(null);

  const contactList = contacts
    .split('\n')
    .map(c => c.trim())
    .filter(Boolean);

  const handleSend = async () => {
    if (!optedIn) {
      setError('Please confirm that contacts have opted in to receive messages.');
      return;
    }

    if (contactList.length === 0) {
      setError('Please add at least one contact.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/whatsapp/broadcast`, {
        templateName: template,
        contacts: contactList,
      });

      console.log('Broadcast sent:', response.data);
      setResult(response.data);
      setSuccess(true);
      
      // Clear form
      setContacts('');
      setOptedIn(false);
    } catch (err: any) {
      console.error('Failed to send broadcast:', err);
      setError(err.response?.data?.message || 'Failed to send broadcast. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <TextField
        select
        label="Template"
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
        fullWidth
        margin="normal"
        disabled={loading}
      >
        {TEMPLATES.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Contacts (one per line)"
        value={contacts}
        onChange={(e) => setContacts(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={6}
        placeholder="919876543210&#10;918765432109&#10;917654321098"
        helperText={`${contactList.length} contact(s) entered`}
        disabled={loading}
      />

      {contactList.length > 0 && (
        <Box sx={{ mt: 1, mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Preview:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {contactList.slice(0, 5).map((contact, index) => (
              <Chip key={index} label={contact} size="small" />
            ))}
            {contactList.length > 5 && (
              <Chip label={`+${contactList.length - 5} more`} size="small" variant="outlined" />
            )}
          </Box>
        </Box>
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={optedIn}
            onChange={(e) => setOptedIn(e.target.checked)}
            disabled={loading}
          />
        }
        label={
          <Typography variant="body2">
            I confirm these contacts have <strong>opted in</strong> to receive WhatsApp messages
            and comply with WhatsApp's messaging policies.
          </Typography>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Broadcast Summary:</strong>
            <br />
            Total: {result.total} | Successful: {result.successful} | Failed: {result.failed}
          </Typography>
        </Alert>
      )}

      <Button
        variant="contained"
        onClick={handleSend}
        disabled={loading || !optedIn || contactList.length === 0}
        startIcon={loading ? <CircularProgress size={20} /> : <CampaignIcon />}
        sx={{ mt: 2 }}
        fullWidth
      >
        {loading ? 'Sending Broadcast...' : `Send Broadcast to ${contactList.length} Contact(s)`}
      </Button>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Broadcast completed! Check results above.
        </Alert>
      </Snackbar>
    </Box>
  );
}

