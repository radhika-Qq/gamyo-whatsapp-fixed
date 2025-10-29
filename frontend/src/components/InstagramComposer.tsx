import React, { useState } from 'react';
import axios from 'axios';

const InstagramComposer: React.FC = () => {
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [creationId, setCreationId] = useState('');
  const [publishedMediaId, setPublishedMediaId] = useState('');
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = 'http://localhost:3000';

  const handleCreateContainer = async () => {
    if (!mediaUrl) {
      setError('Please provide a media URL');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_BASE_URL}/instagram/upload`, {
        mediaUrl,
        caption,
      });

      setCreationId(response.data.creationId);
      setSuccess(`Media container created successfully! ID: ${response.data.creationId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create media container');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!creationId) {
      setError('Please create a media container first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_BASE_URL}/instagram/publish`, {
        creationId,
      });

      setPublishedMediaId(response.data.mediaId);
      setSuccess(`Post published successfully to Instagram! Media ID: ${response.data.mediaId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  const handleGetInsights = async () => {
    if (!publishedMediaId) {
      setError('Please publish a post first to get insights');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/instagram/insights/${publishedMediaId}`);
      setInsights(response.data.insights);
      setSuccess('Insights fetched successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch insights');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMediaUrl('');
    setCaption('');
    setCreationId('');
    setPublishedMediaId('');
    setInsights(null);
    setError('');
    setSuccess('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📸 Instagram Post Composer</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Create and publish posts to your Instagram Business account
      </p>

      {/* Media URL Input */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Media URL *
        </label>
        <input
          type="text"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
          }}
          disabled={loading}
        />
        <small style={{ color: '#666' }}>
          Publicly accessible image or video URL
        </small>
      </div>

      {/* Caption Input */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Caption
        </label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write your Instagram caption..."
          rows={4}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            resize: 'vertical',
          }}
          disabled={loading}
        />
      </div>

      {/* Step 1: Create Container */}
      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={handleCreateContainer}
          disabled={loading || !mediaUrl}
          style={{
            padding: '12px 24px',
            backgroundColor: creationId ? '#4CAF50' : '#E1306C',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !mediaUrl ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: loading || !mediaUrl ? 0.6 : 1,
            marginRight: '10px',
          }}
        >
          {loading ? '⏳ Processing...' : creationId ? '✓ Container Created' : '1️⃣ Create Container'}
        </button>

        {/* Step 2: Publish */}
        <button
          onClick={handlePublish}
          disabled={loading || !creationId || !!publishedMediaId}
          style={{
            padding: '12px 24px',
            backgroundColor: publishedMediaId ? '#4CAF50' : '#405DE6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !creationId || publishedMediaId ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: loading || !creationId || publishedMediaId ? 0.6 : 1,
            marginRight: '10px',
          }}
        >
          {publishedMediaId ? '✓ Published' : '2️⃣ Publish Post'}
        </button>

        {/* Step 3: Get Insights */}
        <button
          onClick={handleGetInsights}
          disabled={loading || !publishedMediaId}
          style={{
            padding: '12px 24px',
            backgroundColor: '#833AB4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !publishedMediaId ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: loading || !publishedMediaId ? 0.6 : 1,
            marginRight: '10px',
          }}
        >
          📊 Get Insights
        </button>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#757575',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: loading ? 0.6 : 1,
          }}
        >
          🔄 Reset
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: '15px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '4px',
            marginBottom: '15px',
            border: '1px solid #ef5350',
          }}
        >
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div
          style={{
            padding: '15px',
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            borderRadius: '4px',
            marginBottom: '15px',
            border: '1px solid #66bb6a',
          }}
        >
          <strong>✅ Success:</strong> {success}
        </div>
      )}

      {/* Creation ID Display */}
      {creationId && (
        <div
          style={{
            padding: '15px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            marginBottom: '15px',
            border: '1px solid #ddd',
          }}
        >
          <strong>📦 Container ID:</strong> <code>{creationId}</code>
        </div>
      )}

      {/* Published Media ID Display */}
      {publishedMediaId && (
        <div
          style={{
            padding: '15px',
            backgroundColor: '#e3f2fd',
            borderRadius: '4px',
            marginBottom: '15px',
            border: '1px solid #90caf9',
          }}
        >
          <strong>🎉 Published Media ID:</strong> <code>{publishedMediaId}</code>
        </div>
      )}

      {/* Insights Display */}
      {insights && (
        <div
          style={{
            padding: '15px',
            backgroundColor: '#f3e5f5',
            borderRadius: '4px',
            marginBottom: '15px',
            border: '1px solid #ce93d8',
          }}
        >
          <strong>📊 Insights:</strong>
          <pre style={{ marginTop: '10px', overflowX: 'auto' }}>
            {JSON.stringify(insights, null, 2)}
          </pre>
        </div>
      )}

      {/* Instructions */}
      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#fff9c4',
          borderRadius: '4px',
          border: '1px solid #fff176',
        }}
      >
        <h3>ℹ️ How to Use:</h3>
        <ol style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>Enter a publicly accessible image or video URL</li>
          <li>Add an optional caption for your post</li>
          <li>Click <strong>"Create Container"</strong> to prepare the media</li>
          <li>Click <strong>"Publish Post"</strong> to post to Instagram</li>
          <li>Click <strong>"Get Insights"</strong> to view performance metrics</li>
        </ol>
        <p style={{ marginTop: '10px', color: '#666' }}>
          <strong>Note:</strong> Make sure your Instagram account is a Business or Creator account 
          and is connected to a Facebook Page.
        </p>
      </div>

      {/* Configuration Info */}
      <div
        style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: '#e0f7fa',
          borderRadius: '4px',
          border: '1px solid #80deea',
        }}
      >
        <h3>🔧 Environment Setup:</h3>
        <p style={{ marginBottom: '10px' }}>
          Add these variables to <code>backend/.env</code>:
        </p>
        <pre style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }}>
{`INSTAGRAM_API_URL=https://graph.facebook.com/v21.0
INSTAGRAM_USER_ID=your_instagram_business_user_id
INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token`}
        </pre>
      </div>
    </div>
  );
};

export default InstagramComposer;

