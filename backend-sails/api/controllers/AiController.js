/**
 * AiController
 *
 * AI-powered content generation controller
 */

module.exports = {

  /**
   * Generate caption for post
   */
  generateCaption: async function (req, res) {
    try {
      const { prompt, tone, language } = req.body;

      if (!prompt) {
        return res.badRequest({
          error: 'Prompt is required',
        });
      }

      const result = await AiService.generateCaption(
        prompt,
        tone || 'professional',
        language || 'en'
      );

      return res.json(result);
    } catch (error) {
      sails.log.error('AiController.generateCaption error:', error);
      return res.serverError({
        error: 'Failed to generate caption',
        details: error.message,
      });
    }
  },

  /**
   * Generate hashtags for content
   */
  generateHashtags: async function (req, res) {
    try {
      const { content, count } = req.body;

      if (!content) {
        return res.badRequest({
          error: 'Content is required',
        });
      }

      const result = await AiService.generateHashtags(content, count || 5);

      return res.json(result);
    } catch (error) {
      sails.log.error('AiController.generateHashtags error:', error);
      return res.serverError({
        error: 'Failed to generate hashtags',
        details: error.message,
      });
    }
  },

  /**
   * Generate image using AI
   */
  generateImage: async function (req, res) {
    try {
      const { prompt, size } = req.body;

      if (!prompt) {
        return res.badRequest({
          error: 'Prompt is required',
        });
      }

      const result = await AiService.generateImage(prompt, size || '1024x1024');

      return res.json(result);
    } catch (error) {
      sails.log.error('AiController.generateImage error:', error);
      return res.serverError({
        error: 'Failed to generate image',
        details: error.message,
      });
    }
  },

  /**
   * Translate text
   */
  translate: async function (req, res) {
    try {
      const { text, targetLanguage, sourceLanguage } = req.body;

      if (!text || !targetLanguage) {
        return res.badRequest({
          error: 'Text and targetLanguage are required',
        });
      }

      const result = await AiService.translate(
        text,
        targetLanguage,
        sourceLanguage || 'en'
      );

      return res.json(result);
    } catch (error) {
      sails.log.error('AiController.translate error:', error);
      return res.serverError({
        error: 'Failed to translate text',
        details: error.message,
      });
    }
  },

};

