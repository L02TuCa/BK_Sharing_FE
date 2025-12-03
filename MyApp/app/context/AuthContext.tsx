import React, { 
    createContext, 
    useState, 
    useContext, 
    useEffect, 
    useMemo,
    FC,
    ReactNode
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router'; // Dùng để ẩn Header của Auth Screens

// --- 1. Định nghĩa Kiểu dữ liệu và Khóa lưu trữ ---
interface AuthContextType {
    isLoggedIn: boolean;
    hasOnboarded: boolean; //  Trạng thái đã xem Onboarding
    login: (account: string, pass: string) => Promise<boolean>;
    logout: () => Promise<void>;
    completeOnboarding: () => Promise<void>; // Hàm đánh dấu hoàn thành
    isLoading: boolean; // Dùng để biết Context đã tải xong trạng thái chưa
    resetOnboarding: () => Promise<void>;
}

const AUTH_STORAGE_KEY = 'user-logged-in-status';
const ONBOARDING_STORAGE_KEY = 'user-has-onboarded';

// LOGIC GIẢ LẬP XÁC THỰC API (THAY THẾ BẰNG API THẬT SAU NÀY)
const mockApiLogin = async (account: string, pass: string): Promise<{ success: boolean; token?: string }> => {
    // Giả lập độ trễ mạng 1 giây
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    // Ví dụ: Kiểm tra với một tài khoản cố định
    const validAccount = 'thonqp@hcmut.edu.vn';
    const validPassword = '123456'; 

    if ((account === validAccount || account === 'user') && pass === validPassword) {
        // Đăng nhập thành công (Trong thực tế, token sẽ được trả về từ server)
        return { success: true, token: 'mock-user-token-123' };
    }
    
    // Đăng nhập thất bại
    return { success: false };
};

// --- 2. Khởi tạo Context ---
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 3. Custom Hook để sử dụng Auth Context ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// --- 4. Component Provider Chính ---
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    // Trạng thái mặc định: chưa đăng nhập
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    // Trạng thái tải: ban đầu là true (đang tải trạng thái từ AsyncStorage)
    const [isLoading, setIsLoading] = useState(true); 
    const [hasOnboarded, setHasOnboarded] = useState(false);

    // useEffect: Tải trạng thái đăng nhập từ bộ nhớ cục bộ
    useEffect(() => {
        const loadAuthStatus = async () => {
            try {
                const storedStatus = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
                // Chuyển chuỗi ('true'/'false') thành boolean
                if (storedStatus !== null) {
                    setIsLoggedIn(storedStatus === 'true');
                }

                const onboardedStatus = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
                if (onboardedStatus !== null) {
                    setHasOnboarded(onboardedStatus === 'true');
                }
            } catch (e) {
                console.error("Failed to load auth status", e);
            } finally {
                setIsLoading(false); // Hoàn tất tải
            }
        };

        loadAuthStatus();
    }, []);

    // Hàm Đăng nhập 
    const login = async (account: string, pass: string): Promise<boolean> => {
        // 1. Gọi logic xác thực (API)
        const result = await mockApiLogin(account, pass);

        if (result.success) {
            // 2. Nếu thành công: Cập nhật trạng thái và lưu vào bộ nhớ cục bộ
            // (Thực tế nên lưu token vào SecureStore/Keychain)
            // await AsyncStorage.setItem('userToken', result.token!); // Lưu token nếu cần
            
            setIsLoggedIn(true);
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, 'true');
            return true; // Đăng nhập thành công
        }

        // 3. Nếu thất bại: Không làm gì cả và trả về false
        return false; 
    };

    // Hàm Đăng xuất
    const logout = async () => {
        setIsLoggedIn(false);
        // Xóa hoặc đặt lại trạng thái đăng nhập
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, 'false'); 
    };

    //  Đánh dấu đã xem Onboarding
    const completeOnboarding = async () => {
        setHasOnboarded(true);
        await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    };

    const resetOnboarding = async () => {
        try {
            await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY); // Xóa khóa
            setHasOnboarded(false); // Cập nhật state
            console.log("Onboarding reset thành công!");
        } catch (e) {
            console.error("Failed to reset onboarding", e);
        }
    };

    const value = useMemo(() => ({
        isLoggedIn,
        hasOnboarded,
        login,
        logout,
        completeOnboarding,
        resetOnboarding,
        isLoading,
    }), [isLoggedIn,hasOnboarded, isLoading]);

    // Trong khi đang tải, có thể trả về null hoặc màn hình SplashScreen
    if (isLoading) {
        return null; // Có thể thay bằng <SplashScreen />
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};