// app/services/authService.ts

// 1. Định nghĩa URL API của bạn
import { ENDPOINTS } from './apiConfig';

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