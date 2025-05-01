import { getSupabaseClient } from '@/lib/supabase';

const supabase = getSupabaseClient();

export interface StoredFile {
  url: string;
  fileName: string;
  uploadedAt: string;
  fileSize: number;
}

/**
 * Upload a file to the pitch-decks bucket
 */
export const uploadPitchDeck = async (file: File): Promise<string> => {
  try {
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('You must be logged in to upload files');
    }

    // Create a unique file name using timestamp and original name
    const timestamp = new Date().getTime();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Remove special characters
    // Create path following the policy structure: pdfs/user_id/filename
    const fileName = `pdfs/${session.user.id}/${timestamp}-${cleanFileName}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from('pitch-decks')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type // Explicitly set the content type
      });

    if (error) {
      console.error('Storage error:', error);
      throw new Error(error.message);
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('pitch-decks')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Get a list of all stored pitch decks for the current user
 */
export const listStoredPitchDecks = async (): Promise<StoredFile[]> => {
  try {
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('You must be logged in to view files');
    }

    // List files in the user's directory following policy structure
    const { data, error } = await supabase.storage
      .from('pitch-decks')
      .list(`pdfs/${session.user.id}/`);

    if (error) {
      throw error;
    }

    return data.map(file => ({
      url: supabase.storage.from('pitch-decks').getPublicUrl(`pdfs/${session.user.id}/${file.name}`).data.publicUrl,
      fileName: file.name,
      uploadedAt: file.created_at || new Date().toISOString(),
      fileSize: file.metadata?.size || 0
    }));
  } catch (error) {
    console.error('Error listing pitch decks:', error);
    throw error;
  }
};

/**
 * Delete a stored pitch deck
 */
export const deletePitchDeck = async (fileName: string): Promise<void> => {
  try {
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('You must be logged in to delete files');
    }

    // Ensure the file path follows policy structure
    if (!fileName.startsWith('pdfs/')) {
      fileName = `pdfs/${session.user.id}/${fileName}`;
    }

    const { error } = await supabase.storage
      .from('pitch-decks')
      .remove([fileName]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting pitch deck:', error);
    throw error;
  }
};

/**
 * Get a download URL for a stored pitch deck
 */
export const getPitchDeckDownloadUrl = async (fileName: string): Promise<string> => {
  try {
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('You must be logged in to download files');
    }

    // Ensure the file path follows policy structure
    if (!fileName.startsWith('pdfs/')) {
      fileName = `pdfs/${session.user.id}/${fileName}`;
    }

    const { data, error } = await supabase.storage
      .from('pitch-decks')
      .createSignedUrl(fileName, 3600); // URL valid for 1 hour

    if (error) {
      throw error;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
};

/**
 * Upload an analysis report to the analysis-report bucket
 */
export const uploadAnalysisReport = async (report: any, fileName: string): Promise<string> => {
  try {
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('You must be logged in to upload analysis reports');
    }

    // Create a unique file name using timestamp and original name
    const timestamp = new Date().getTime();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `reports/${session.user.id}/${timestamp}-${cleanFileName}.json`;

    // Convert report to Blob
    const reportBlob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });

    // Upload the file
    const { data, error } = await supabase.storage
      .from('analysis-report')
      .upload(filePath, reportBlob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'application/json'
      });

    if (error) {
      console.error('Storage error:', error);
      throw new Error(error.message);
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('analysis-report')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading analysis report:', error);
    throw error;
  }
};

/**
 * Get a list of all stored analysis reports for the current user
 */
export const listAnalysisReports = async (): Promise<StoredFile[]> => {
  try {
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('You must be logged in to view analysis reports');
    }

    // List files in the user's directory
    const { data, error } = await supabase.storage
      .from('analysis-report')
      .list(`reports/${session.user.id}/`);

    if (error) {
      throw error;
    }

    return data.map(file => ({
      url: supabase.storage.from('analysis-report').getPublicUrl(`reports/${session.user.id}/${file.name}`).data.publicUrl,
      fileName: file.name,
      uploadedAt: file.created_at || new Date().toISOString(),
      fileSize: file.metadata?.size || 0
    }));
  } catch (error) {
    console.error('Error listing analysis reports:', error);
    throw error;
  }
};

/**
 * Get the content of a specific analysis report
 */
export const getAnalysisReport = async (fileName: string): Promise<any> => {
  try {
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('You must be logged in to view analysis reports');
    }

    // List files in the user's directory to find the correct file
    const { data: files, error: listError } = await supabase.storage
      .from('analysis-report')
      .list(`reports/${session.user.id}/`);

    if (listError) {
      throw listError;
    }

    // Find the file that matches the base name (ignoring timestamp)
    const matchingFile = files.find(file => {
      // Remove timestamp and .json extension from stored file
      const storedBaseName = file.name.replace(/^\d+-/, '').replace('.json', '');
      return storedBaseName === fileName;
    });

    if (!matchingFile) {
      throw new Error('Analysis report not found');
    }

    // Download the file using the full path with timestamp
    const { data, error } = await supabase.storage
      .from('analysis-report')
      .download(`reports/${session.user.id}/${matchingFile.name}`);

    if (error) {
      throw error;
    }

    const text = await data.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error getting analysis report:', error);
    throw error;
  }
}; 