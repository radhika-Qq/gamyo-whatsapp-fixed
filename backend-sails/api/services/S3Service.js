/**
 * S3Service.js
 *
 * Service for AWS S3 file storage
 */

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

module.exports = {

  /**
   * Initialize S3 client
   */
  _getS3Client() {
    const { accessKeyId, secretAccessKey, region } = sails.config.custom.aws;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('AWS credentials not configured');
    }

    return new AWS.S3({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region,
    });
  },

  /**
   * Upload file to S3
   */
  async uploadFile(fileBuffer, fileName, mimeType) {
    try {
      const s3 = this._getS3Client();
      const { s3Bucket } = sails.config.custom.aws;

      if (!s3Bucket) {
        throw new Error('AWS S3 bucket not configured');
      }

      // Generate unique filename
      const fileExtension = path.extname(fileName);
      const uniqueFileName = `${uuidv4()}${fileExtension}`;
      const key = `uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${uniqueFileName}`;

      const params = {
        Bucket: s3Bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
        ACL: 'public-read',
      };

      const result = await s3.upload(params).promise();

      sails.log.info(`File uploaded to S3: ${result.Location}`);

      return {
        success: true,
        url: result.Location,
        key: result.Key,
        bucket: result.Bucket,
      };
    } catch (error) {
      sails.log.error('S3Service.uploadFile error:', error);
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  },

  /**
   * Delete file from S3
   */
  async deleteFile(key) {
    try {
      const s3 = this._getS3Client();
      const { s3Bucket } = sails.config.custom.aws;

      if (!s3Bucket) {
        throw new Error('AWS S3 bucket not configured');
      }

      const params = {
        Bucket: s3Bucket,
        Key: key,
      };

      await s3.deleteObject(params).promise();

      sails.log.info(`File deleted from S3: ${key}`);

      return {
        success: true,
        message: 'File deleted successfully',
      };
    } catch (error) {
      sails.log.error('S3Service.deleteFile error:', error);
      throw new Error(`Failed to delete file from S3: ${error.message}`);
    }
  },

  /**
   * Get signed URL for private file access
   */
  async getSignedUrl(key, expiresIn = 3600) {
    try {
      const s3 = this._getS3Client();
      const { s3Bucket } = sails.config.custom.aws;

      if (!s3Bucket) {
        throw new Error('AWS S3 bucket not configured');
      }

      const params = {
        Bucket: s3Bucket,
        Key: key,
        Expires: expiresIn,
      };

      const url = await s3.getSignedUrlPromise('getObject', params);

      return {
        success: true,
        url: url,
        expiresIn: expiresIn,
      };
    } catch (error) {
      sails.log.error('S3Service.getSignedUrl error:', error);
      throw new Error(`Failed to get signed URL: ${error.message}`);
    }
  },

  /**
   * List files in a folder
   */
  async listFiles(prefix = 'uploads/') {
    try {
      const s3 = this._getS3Client();
      const { s3Bucket } = sails.config.custom.aws;

      if (!s3Bucket) {
        throw new Error('AWS S3 bucket not configured');
      }

      const params = {
        Bucket: s3Bucket,
        Prefix: prefix,
      };

      const result = await s3.listObjectsV2(params).promise();

      return {
        success: true,
        files: result.Contents,
        count: result.Contents.length,
      };
    } catch (error) {
      sails.log.error('S3Service.listFiles error:', error);
      throw new Error(`Failed to list files from S3: ${error.message}`);
    }
  },

};

