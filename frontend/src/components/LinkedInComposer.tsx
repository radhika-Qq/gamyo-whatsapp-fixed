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
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';

const API_URL = 'http://localhost:3000';

export default function LinkedInComposer() {
  const [text, setText] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaAssetUrn, setMediaAssetUrn] = useState('');
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
      const res = await fetch(`${API_URL}/linkedin/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload media');
      
      setUploadResponse(data);
      setMediaAssetUrn(data.assetUrn);
      setError(null);
    } catch (err: any) {
      console.error('Failed to upload media:', err);
      setError(err.message || 'Failed to upload media. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handlePublishPost = async () => {
    if (!text) {
      setError('Please provide post text');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const res = await fetch(`${API_URL}/linkedin/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          media: mediaAssetUrn || undefined 
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish post');
      
      setResponse(data);
      // Reset form on success
      setText('');
      setMediaUrl('');
      setMediaAssetUrn('');
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
        <LinkedInIcon color="primary" />
        <Typography variant="h6">
          Publish to LinkedIn
        </Typography>
      </Stack>

      {/* Media Upload Section */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Step 1: Upload Media (Optional)
        </Typography>
        <TextField
          label="Media URL"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          fullWidth
          margin="normal"
          placeholder="https://example.com/image.jpg"
          disabled={uploadLoading}
          helperText="Provide a direct URL to an image (JPG/PNG)"
        />
        <Button
          variant="outlined"
          onClick={handleUploadMedia}
          disabled={uploadLoading || !mediaUrl}
          startIcon={uploadLoading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          sx={{ mt: 1 }}
        >
          {uploadLoading ? 'Uploading...' : 'Upload Media'}
        </Button>
        {uploadResponse && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Media uploaded successfully! Asset URN: {uploadResponse.assetUrn}
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
          label="Post Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={6}
          disabled={loading}
          placeholder="What's on your mind? Share your insights with your LinkedIn network..."
          helperText={`${text.length} characters`}
        />
        <Button
          variant="contained"
          onClick={handlePublishPost}
          disabled={loading || !text}
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          sx={{ mt: 2 }}
          fullWidth
          size="large"
        >
          {loading ? 'Publishing...' : 'Publish to LinkedIn'}
        </Button>
      </Paper>

      {/* Success Response */}
      {response && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            Post published successfully! 🎉
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
      <Paper elevation={0} sx={{ mt: 3, p: 2, bgcolor: 'info.light' }}>
        <Typography variant="caption" color="info.contrastText">
          <strong>Note:</strong> Make sure you've configured your LinkedIn API credentials in the backend .env file 
          (LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORGANIZATION_URN).
        </Typography>
      </Paper>
    </Box>
  );
}

