// utils/supabaseStorage.js
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import path from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Upload single file to Supabase Storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalName - Original file name
 * @param {string} bucket - Supabase storage bucket name
 * @param {string} folder - Folder path in bucket (optional)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const uploadFile = async (fileBuffer, originalName, bucket = 'bantu-desa', folder = '') => {
  try {
    // Generate unique filename
    const uniqueId = crypto.randomUUID();
    const timestamp = Date.now();
    const extension = path.extname(originalName);
    const filename = `${timestamp}-${uniqueId}${extension}`;
    
    // Create full path
    const filePath = folder ? `${folder}/${filename}` : filename;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: getContentType(extension),
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      data: {
        path: data.path,
        filename: filename,
        publicUrl: publicUrl,
        fullPath: filePath
      }
    };
  } catch (error) {
    console.error('Upload file error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload multiple files to Supabase Storage
 * @param {Array} files - Array of file objects with buffer and originalname
 * @param {string} bucket - Supabase storage bucket name
 * @param {string} folder - Folder path in bucket (optional)
 * @returns {Promise<{success: boolean, data?: Array, errors?: Array}>}
 */
export const uploadMultipleFiles = async (files, bucket = 'bantu-desa', folder = '') => {
  const results = [];
  const errors = [];

  for (const file of files) {
    const result = await uploadFile(file.buffer, file.originalname, bucket, folder);
    
    if (result.success) {
      results.push({
        ...result.data,
        originalName: file.originalname,
        size: file.size
      });
    } else {
      errors.push({
        filename: file.originalname,
        error: result.error
      });
    }
  }

  return {
    success: errors.length === 0,
    data: results,
    errors: errors.length > 0 ? errors : undefined
  };
};

/**
 * Delete file from Supabase Storage
 * @param {string} filePath - File path in storage
 * @param {string} bucket - Supabase storage bucket name
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteFile = async (filePath, bucket = 'bantu-desa') => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete file error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get file content type based on extension
 * @param {string} extension - File extension
 * @returns {string} - MIME type
 */
const getContentType = (extension) => {
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  
  return types[extension.toLowerCase()] || 'application/octet-stream';
};

/**
 * Validate file type
 * @param {string} mimetype - File MIME type
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {boolean}
 */
export const validateFileType = (mimetype, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']) => {
  return allowedTypes.includes(mimetype);
};

/**
 * Validate file size
 * @param {number} size - File size in bytes
 * @param {number} maxSize - Maximum allowed size in bytes (default 5MB)
 * @returns {boolean}
 */
export const validateFileSize = (size, maxSize = 5 * 1024 * 1024) => {
  return size <= maxSize;
};

/**
 * Extract file path from Supabase public URL
 * @param {string} publicUrl - Supabase public URL
 * @returns {string} - File path
 */
export const extractFilePathFromUrl = (publicUrl) => {
  try {
    const url = new URL(publicUrl);
    const pathSegments = url.pathname.split('/');
    // Remove '/storage/v1/object/public/bucket-name/' from path
    return pathSegments.slice(5).join('/');
  } catch (error) {
    console.error('Extract file path error:', error);
    return null;
  }
};

export default supabase;