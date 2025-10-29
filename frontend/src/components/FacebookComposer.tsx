import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import ScheduleIcon from '@mui/icons-material/Schedule';

const API_URL = 'http://localhost:3000';

export default function FacebookComposer() {
  const [message, setMessage] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [caption, setCaption] = useState('');
  const [mediaId, setMediaId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [uploadResponse, setUploadResponse] = useState<any>(null);

  const handleUploadMedia = async () => {
    if (!mediaUrl) {
      setError('Please provide a media URL');
      return;
    }

    setUploadLoading(true);
    setError(null);
    setUploadResponse(null);
    
    try {
      const res = await fetch(`${API_URL}/facebook/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mediaUrl, 
          caption,
          mediaType 
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload media');
      
      setUploadResponse(data);
      setMediaId(data.mediaId);
      setError(null);
    } catch (err: any) {
      console.error('Failed to upload media:', err);
      setError(err.message || 'Failed to upload media. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handlePublishPost = async () => {
    if (!message) {
      setError('Please provide post message');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const postData: any = { message };
      
      if (mediaId) {
        postData.mediaId = mediaId;
      }

      if (scheduledDate) {
        const timestamp = Math.floor(new Date(scheduledDate).getTime() / 1000);
        const now = Math.floor(Date.now() / 1000);
        const tenMinutes = 10 * 60;
        const seventyFiveDays = 75 * 24 * 60 * 60;

        if (timestamp <= now + tenMinutes) {
          throw new Error('Scheduled time must be at least 10 minutes from now');
        }
        if (timestamp >= now + seventyFiveDays) {
          throw new Error('Scheduled time cannot be more than 75 days from now');
        }

        postData.scheduledTime = timestamp;
      }

      const res = await fetch(`${API_URL}/facebook/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish post');
      
      setResponse(data);
      // Reset form on success
      setMessage('');
      setMediaUrl('');
      setCaption('');
      setMediaId('');
      setScheduledDate('');
      setUploadResponse(null);
    } catch (err: any) {
      console.error('Failed to publish post:', err);
      setError(err.message || 'Failed to publish post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <FacebookIcon sx={{ color: '#1877F2' }} />
        <Typography variant="h6">
          Publish to Facebook Page
        </Typography>
      </Stack>

      {/* Media Upload Section */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Step 1: Upload Media (Optional)
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Media Type</InputLabel>
          <Select
            value={mediaType}
            label="Media Type"
            onChange={(e) => setMediaType(e.target.value as 'photo' | 'video')}
            disabled={uploadLoading}
          >
            <MenuItem value="photo">Photo (Image)</MenuItem>
            <MenuItem value="video">Video</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Media URL"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="https://example.com/image.jpg"
          disabled={uploadLoading}
          helperText={
            mediaType === 'photo' 
              ? 'Provide a direct URL to an image (JPG, PNG, GIF)' 
              : 'Provide a direct URL to a video (MP4, MOV)'
          }
        />

        <TextField
          label="Caption (Optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Add a caption for your media..."
          disabled={uploadLoading}
          multiline
          rows={2}
        />

        <Button
          variant="outlined"
          onClick={handleUploadMedia}
          disabled={uploadLoading || !mediaUrl}
          startIcon={uploadLoading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          sx={{ mt: 1 }}
        >
          {uploadLoading ? 'Uploading...' : `Upload ${mediaType === 'photo' ? 'Photo' : 'Video'}`}
        </Button>

        {uploadResponse && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              Media uploaded successfully! 🎉
            </Typography>
            <Typography variant="caption">
              Media ID: {uploadResponse.mediaId}
            </Typography>
          </Alert>
        )}
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {/* Post Content Section */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Step 2: Compose Your Post
        </Typography>

        <TextField
          label="Post Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={6}
          disabled={loading}
          placeholder="What's happening? Share with your Facebook audience..."
          helperText={`${message.length} characters`}
        />

        {mediaId && (
          <Box sx={{ mt: 2 }}>
            <Chip 
              label={`Media attached: ${mediaType === 'photo' ? '📷 Photo' : '🎬 Video'}`} 
              color="primary" 
              size="small" 
            />
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
          <ScheduleIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Schedule Post (Optional)
        </Typography>
        
        <TextField
          label="Scheduled Date & Time"
          type="datetime-local"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          fullWidth
          margin="normal"
          disabled={loading}
          InputLabelProps={{
            shrink: true,
          }}
          helperText="Leave empty to publish immediately. Must be 10 min - 75 days from now."
        />

        <Button
          variant="contained"
          onClick={handlePublishPost}
          disabled={loading || !message}
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          sx={{ 
            mt: 2, 
            bgcolor: '#1877F2',
            '&:hover': {
              bgcolor: '#166FE5',
            }
          }}
          fullWidth
          size="large"
        >
          {loading 
            ? 'Publishing...' 
            : scheduledDate 
              ? 'Schedule Post' 
              : 'Publish to Facebook'}
        </Button>
      </Paper>

      {/* Success Response */}
      {response && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            {response.message || 'Post published successfully!'} 🎉
          </Typography>
          <Typography variant="caption">
            Post ID: {response.postId}
          </Typography>
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      )}

      {/* Help Text */}
      <Paper elevation={0} sx={{ mt: 3, p: 2, bgcolor: '#E7F3FF' }}>
        <Typography variant="caption" color="text.secondary">
          <strong>Note:</strong> Make sure you've configured your Facebook API credentials in the backend .env file 
          (FACEBOOK_PAGE_ID and FACEBOOK_ACCESS_TOKEN). See FACEBOOK_INTEGRATION.md for setup instructions.
        </Typography>
      </Paper>
    </Box>
  );
}

