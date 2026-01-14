// app/services/authService.ts

// 1. Định nghĩa URL API của bạn
import { ENDPOINTS } from './apiConfig';
import { Platform } from 'react-native';
// 2. Định nghĩa kiểu dữ liệu cho form đăng ký
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: string;          // Mặc định là STUDENT
  profilePicture?: string; // Có thể để string rỗng hoặc URL mặc định
  isActive?: boolean;     // API của bạn yêu cầu true
}

interface UpdateInfoParams {
  userId: number | string;
  fullName: string;
  email: string;
  // Các trường bắt buộc phải gửi kèm để không bị null
  username: string;
  role: string;
  isActive: boolean;
}


interface ChangePasswordParams {
  userId: number | string;
  newPassword: string;
}


export const changeUserPassword = async ({ userId, newPassword }: ChangePasswordParams) => {
  try {
    const url = ENDPOINTS.UPDATE_USER_INFO(userId); // API: /api/v1/users/{id}
    
    // Body chỉ chứa password mới
    const bodyPayload = {
        password: newPassword
    };

    const response = await fetch(url, {
      method: 'PUT', // (Hoặc PATCH tùy backend, nhưng endpoint này thường là PUT)
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });

    // Xử lý kết quả
    // Lưu ý: Nếu server trả về null hoặc text không phải JSON thì cần handle cẩn thận
    // Ở đây giả định trả về JSON như cũ
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Đổi mật khẩu thất bại');
    }

    return result;
  } catch (error) {
    throw error;
  }
};


// 3. Hàm gọi API
export const registerUser = async (payload: RegisterPayload) => {
  try {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Kiểm tra logic dựa trên response bạn cung cấp
    // Nếu status không phải 200 hoặc 201, hoặc success = false thì ném lỗi
    if (!response.ok || (data.success === false)) {
      throw new Error(data.message || 'Đăng ký thất bại');
    }

    return data; // Trả về cục data: { success: true, message: "...", data: {...} }
  } catch (error: any) {
    console.error('Register API Error:', error);
    throw error; // Ném lỗi ra để màn hình hiển thị Alert
  }
};



export const loginUser = async (emailOrUsername: string, password: string) => {
  try {
    console.log('Đang đăng nhập...');

    const response = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // API yêu cầu key là "email" và "password"
      body: JSON.stringify({
        email: emailOrUsername, 
        password: password
      }),
    });

    const resJson = await response.json();

    console.log('Kết quả Login:', resJson);

    // Kiểm tra thành công dựa trên response mẫu bạn đưa
    if (!response.ok || resJson.success === false) {
      // Backend có thể trả về message lỗi cụ thể (ví dụ: "Sai mật khẩu")
      throw new Error(resJson.message || 'Đăng nhập thất bại.');
    }

    // Trả về thông tin User (nằm trong resJson.data)
    return resJson.data; 

  } catch (error: any) {
    console.error('Lỗi Login Service:', error);
    throw error;
  }
};


export const updateBasicInfo = async (params: UpdateInfoParams) => {
  try {
    const url = ENDPOINTS.UPDATE_USER_INFO(params.userId);
    
    // Body đúng chuẩn JSON yêu cầu
    const bodyPayload = {
        username: params.username,
        email: params.email,
        fullName: params.fullName,
        role: params.role,
        isActive: params.isActive
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(bodyPayload),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Cập nhật thông tin thất bại');
    }

    return result.data; // Trả về object User đầy đủ
  } catch (error) {
    throw error;
  }
};




export const uploadUserAvatar = async (userId: number | string, avatarUri: string) => {
  try {
    const url = ENDPOINTS.UPLOAD_AVATAR(userId);
    const formData = new FormData();

    // Xử lý file
    const fileName = avatarUri.split('/').pop() || 'avatar.jpg';
    const fileType = fileName.split('.').pop() === 'png' ? 'image/png' : 'image/jpeg';

    const fileToUpload = {
        uri: Platform.OS === 'android' ? avatarUri : avatarUri.replace('file://', ''),
        name: fileName,
        type: fileType,
    };

    // 'file' là key thường dùng, nếu API của bạn yêu cầu key khác (vd 'image', 'avatar') hãy sửa ở đây
    // Dựa vào ngữ cảnh trước đó bạn dùng 'avatar' hoặc 'file'. 
    // Nếu API Spring Boot thường là 'file'. Hãy thử 'file' trước.
    formData.append('file', fileToUpload as any); 

    const response = await fetch(url, {
      method: 'POST', // Thường upload ảnh là POST
      body: formData,
      headers: {
        'Accept': 'application/json',
        // Không set Content-Type
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Upload ảnh thất bại');
    }

    return result.imageUrl; // Trả về link ảnh string
  } catch (error) {
    throw error;
  }
};