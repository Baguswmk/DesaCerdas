import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const STORAGE_CONFIG = {
  buckets: {
    BANTU_DESA: 'bantu-desa',
    IMAGES: 'images',
    DOCUMENTS: 'documents'
  },
  folders: {
    KEGIATAN: 'kegiatan',
    BUKTI_TRANSFER: 'bukti-transfer',
    GALERI: 'galeri',
    QRIS: 'qris',
    PROFILE: 'profile'
  }
};


export const initializeStorage = async () => {
  try {
    for (const bucketName of Object.values(STORAGE_CONFIG.buckets)) {
      const { data: bucket, error: checkError } = await supabase.storage
        .getBucket(bucketName);
      
      if (checkError && checkError.message.includes('Bucket not found')) {
        const { data, error: createError } = await supabase.storage
          .createBucket(bucketName, {
            public: true,
            allowedMimeTypes: [
              'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
              'application/pdf'
            ],
            fileSizeLimit: 5242880 
          });
        
        if (createError) {
          console.error(`❌ Failed to create bucket ${bucketName}:`, createError.message);
        } else {
          console.log(`✅ Created storage bucket: ${bucketName}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Storage initialization error:', error.message);
  }
};


export const uploadFile = async (fileBuffer, originalName, bucket = STORAGE_CONFIG.buckets.BANTU_DESA, folder = '') => {
  try {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('File buffer is empty or invalid');
    }

    const uniqueId = crypto.randomUUID();
    const timestamp = Date.now();
    const extension = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, extension);
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '-');
    const filename = `${timestamp}-${uniqueId}-${sanitizedBaseName}${extension}`;
    
    const filePath = folder ? `${folder}/${filename}` : filename;
    
    const contentType = getContentType(extension);
    if (!contentType) {
      throw new Error(`Unsupported file type: ${extension}`);
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: false,
        cacheControl: '3600' 
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      data: {
        path: data.path,
        filename: filename,
        publicUrl: publicUrl,
        fullPath: filePath,
        bucket: bucket,
        size: fileBuffer.length,
        contentType: contentType
      }
    };
  } catch (error) {
    console.error('Upload file error:', error);
    return { 
      success: false, 
      error: error.message,
      code: 'UPLOAD_FAILED'
    };
  }
};


export const uploadMultipleFiles = async (files, bucket = STORAGE_CONFIG.buckets.BANTU_DESA, folder = '') => {
  const results = [];
  const errors = [];
  let successCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      console.log(`📤 Uploading file ${i + 1}/${files.length}: ${file.originalname}`);
      
      const result = await uploadFile(file.buffer, file.originalname, bucket, folder);
      
      if (result.success) {
        results.push({
          ...result.data,
          originalName: file.originalname,
          index: i
        });
        successCount++;
      } else {
        errors.push({
          filename: file.originalname,
          error: result.error,
          index: i
        });
      }
    } catch (error) {
      errors.push({
        filename: file.originalname,
        error: error.message,
        index: i
      });
    }
  }

  return {
    success: errors.length === 0,
    data: results,
    errors: errors.length > 0 ? errors : undefined,
    stats: {
      total: files.length,
      success: successCount,
      failed: errors.length
    }
  };
};


export const deleteFile = async (filePath, bucket = STORAGE_CONFIG.buckets.BANTU_DESA) => {
  try {
    if (!filePath) {
      throw new Error('File path is required');
    }

    const { data: file, error: checkError } = await supabase.storage
      .from(bucket)
      .list(path.dirname(filePath), {
        search: path.basename(filePath)
      });

    if (checkError) {
      throw new Error(`Failed to check file existence: ${checkError.message}`);
    }

    if (!file || file.length === 0) {
      return { success: false, error: 'File not found' };
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Delete file error:', error);
    return { success: false, error: error.message };
  }
};


export const getFileInfo = async (filePath, bucket = STORAGE_CONFIG.buckets.BANTU_DESA) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path.dirname(filePath), {
        search: path.basename(filePath)
      });

    if (error) {
      throw new Error(error.message);
    }

    const file = data.find(f => f.name === path.basename(filePath));
    if (!file) {
      throw new Error('File not found');
    }

    return {
      success: true,
      data: {
        name: file.name,
        size: file.metadata?.size || 0,
        lastModified: file.updated_at,
        contentType: file.metadata?.mimetype,
        path: filePath
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const getContentType = (extension) => {
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    
    '.txt': 'text/plain',
    '.json': 'application/json',
    '.csv': 'text/csv'
  };
  
  return types[extension.toLowerCase()] || null;
};


export const validateFileType = (mimetype, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']) => {
  if (!mimetype) return false;
  return allowedTypes.includes(mimetype.toLowerCase());
};

export const validateFileSize = (size, maxSize = 5 * 1024 * 1024) => {
  return size > 0 && size <= maxSize;
};


export const extractFilePathFromUrl = (publicUrl) => {
  try {
    if (!publicUrl || typeof publicUrl !== 'string') {
      return null;
    }

    const url = new URL(publicUrl);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    if (pathSegments.length >= 5 && pathSegments[0] === 'storage') {
      return pathSegments.slice(4).join('/');
    }
    
    return null;
  } catch (error) {
    console.error('Extract file path error:', error);
    return null;
  }
};


export const generateSignedUrl = async (filePath, bucket = STORAGE_CONFIG.buckets.BANTU_DESA, expiresIn = 3600) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data: { signedUrl: data.signedUrl } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export { STORAGE_CONFIG };
export default supabase;