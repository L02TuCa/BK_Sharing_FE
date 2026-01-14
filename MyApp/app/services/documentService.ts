// app/services/documentService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native'; 
import { ENDPOINTS } from './apiConfig';

// Interface cho tham số đầu vào
interface UploadParams {
  fileUri: string;
  fileName: string;
  fileType: string; // ví dụ: application/pdf, image/jpeg
  title: string;
  description: string;
  userId: number | string; // ID người dùng
}

// Định nghĩa kiểu dữ liệu cho Document trả về 
export interface DocumentItem {
  documentId: number;
  title: string;
  description: string;
  fileType: string;
  filePath: string;
  fileSize: number;
  uploadedByUsername: string;
  createdAt: string;
  averageRating: number | null;
  totalRatings: number | null;
  // ... các trường khác có thể null
}





export const uploadDocument = async ({ 
  fileUri, fileName, fileType, title, description, userId 
}: UploadParams) => {
  try {
    const formData = new FormData();

    // 1. Append các trường văn bản
    formData.append('title', title);
    formData.append('description', description);
    formData.append('userId', String(userId));

    // 2. XỬ LÝ URI & TYPE (Quan trọng nhất)
    // Android đôi khi cần 'file://' ở đầu, đôi khi không, nhưng FormData yêu cầu uri chuẩn.
    // mimeType bắt buộc phải có. Nếu null, ta set mặc định.
    const fileToUpload = {
      uri: Platform.OS === 'android' ? fileUri : fileUri.replace('file://', ''),
      name: fileName || `upload_${Date.now()}`,
      type: fileType || 'application/octet-stream', // Fallback an toàn
    };

    console.log('--- BẮT ĐẦU UPLOAD ---');
    console.log('File Info:', fileToUpload);

    // append vào FormData (ép kiểu as any để tránh lỗi TypeScript)
    formData.append('file', fileToUpload as any);

    // 3. Gọi API
    const response = await fetch(ENDPOINTS.DOCUMENTS, {
      method: 'POST',
      body: formData,
      headers: {
        // TUYỆT ĐỐI KHÔNG thêm 'Content-Type': 'multipart/form-data'
        // Hãy để fetch tự động sinh ra boundary
        'Accept': 'application/json',
      },
    });

    // 4. Đọc response dưới dạng TEXT trước (để tránh crash nếu server trả về HTML lỗi)
    const responseText = await response.text();
    console.log('Server Response Raw:', responseText);

    // 5. Parse JSON
    let result;
    try {
        result = JSON.parse(responseText);
    } catch (e) {
        throw new Error(`Server trả về dữ liệu không phải JSON: ${responseText.substring(0, 100)}...`);
    }

    if (!response.ok || (result && !result.success)) {
      throw new Error(result.message || 'Upload thất bại từ phía Server');
    }

    return result.data;

  } catch (error: any) {
    console.error('Chi tiết lỗi Upload:', error);
    // Ném lỗi ra ngoài để UI hiển thị Alert
    throw error;
  }
};



export const searchDocuments = async (keyword: string = ''): Promise<DocumentItem[]> => {
  try {
    // Tạo URL với query parameter
    // Nếu keyword rỗng, API sẽ trả về tất cả (theo mô tả của bạn)
    const url = `${ENDPOINTS.SEARCH_DOCUMENTS}?keyword=${encodeURIComponent(keyword)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        // Nếu API yêu cầu token xác thực, bạn cần thêm Authorization header ở đây
      },
    });

    const result = await response.json();

    console.log("Dữ liệu Search trả về:", JSON.stringify(result, null, 2));

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Lỗi khi tìm kiếm tài liệu');
    }

    return result.data; // Trả về mảng tài liệu
  } catch (error) {
    console.error('Search Error:', error);
    throw error;
  }
};