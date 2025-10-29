/**
 * AiService.js
 *
 * Service for communicating with FastAPI AI microservice
 * Handles AI content generation, translation, and image creation
 */

const axios = require('axios');

module.exports = {

  /**
   * Generate caption/post content using AI
   */
  async generateCaption(prompt, tone = 'professional', language = 'en') {
    try {
      const { url, apiKey } = sails.config.custom.aiService;

      if (!url) {
        throw new Error('AI service URL not configured');
      }

      sails.log.info(`Generating AI caption with prompt: ${prompt.substring(0, 50)}...`);

      const response = await axios.post(
        `${url}/api/ai/generate-caption`,
        {
          prompt: prompt,
          tone: tone,
          language: language,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey || '',
          },
        }
      );

      return {
        success: true,
        caption: response.data.caption,
        data: response.data,
      };
    } catch (error) {
      sails.log.error('AiService.generateCaption error:', error.response?.data || error.message);
      throw new Error(`Failed to generate caption: ${error.response?.data?.detail || error.message}`);
    }
  },

  /**
   * Generate hashtags for post content
   */
  async generateHashtags(content, count = 5) {
    try {
      const { url, apiKey } = sails.config.custom.aiService;

      if (!url) {
        throw new Error('AI service URL not configured');
      }

      sails.log.info('Generating AI hashtags');

      const response = await axios.post(
        `${url}/api/ai/generate-hashtags`,
        {
          content: content,
          count: count,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey || '',
          },
        }
      );

      return {
        success: true,
        hashtags: response.data.hashtags,
        data: response.data,
      };
    } catch (error) {
      sails.log.error('AiService.generateHashtags error:', error.response?.data || error.message);
      throw new Error(`Failed to generate hashtags: ${error.response?.data?.detail || error.message}`);
    }
  },

  /**
   * Generate image using DALL-E or similar
   */
  async generateImage(prompt, size = '1024x1024') {
    try {
      const { url, apiKey } = sails.config.custom.aiService;

      if (!url) {
        throw new Error('AI service URL not configured');
      }

      sails.log.info(`Generating AI image with prompt: ${prompt.substring(0, 50)}...`);

      const response = await axios.post(
        `${url}/api/ai/generate-image`,
        {
          prompt: prompt,
          size: size,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey || '',
          },
          timeout: 60000, // 60 second timeout for image generation
        }
      );

      return {
        success: true,
        imageUrl: response.data.image_url,
        data: response.data,
      };
    } catch (error) {
      sails.log.error('AiService.generateImage error:', error.response?.data || error.message);
      throw new Error(`Failed to generate image: ${error.response?.data?.detail || error.message}`);
    }
  },

  /**
   * Translate text to target language
   */
  async translate(text, targetLanguage = 'hi', sourceLanguage = 'en') {
    try {
      const { url, apiKey } = sails.config.custom.aiService;

      if (!url) {
        throw new Error('AI service URL not configured');
      }

      sails.log.info(`Translating text from ${sourceLanguage} to ${targetLanguage}`);

      const response = await axios.post(
        `${url}/api/ai/translate`,
        {
          text: text,
          target_language: targetLanguage,
          source_language: sourceLanguage,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey || '',
          },
        }
      );

      return {
        success: true,
        translatedText: response.data.translated_text,
        data: response.data,
      };
    } catch (error) {
      sails.log.error('AiService.translate error:', error.response?.data || error.message);
      throw new Error(`Failed to translate text: ${error.response?.data?.detail || error.message}`);
    }
  },

  /**
   * Enhance post content with AI suggestions
   */
  async enhanceContent(content, improvements = ['grammar', 'engagement']) {
    try {
      const { url, apiKey } = sails.config.custom.aiService;

      if (!url) {
        throw new Error('AI service URL not configured');
      }

      sails.log.info('Enhancing content with AI');

      const response = await axios.post(
        `${url}/api/ai/enhance-content`,
        {
          content: content,
          improvements: improvements,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey || '',
          },
        }
      );

      return {
        success: true,
        enhancedContent: response.data.enhanced_content,
        suggestions: response.data.suggestions,
        data: response.data,
      };
    } catch (error) {
      sails.log.error('AiService.enhanceContent error:', error.response?.data || error.message);
      throw new Error(`Failed to enhance content: ${error.response?.data?.detail || error.message}`);
    }
  },

};

