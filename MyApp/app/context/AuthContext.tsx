import React, { 
    createContext, 
    useState, 
    useContext, 
    useEffect, 
    FC,
    ReactNode
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

// 1. CẬP NHẬT INTERFACE UserData (Quan trọng)
// Phải khớp với dữ liệu bạn dùng trong AccountSettings
export interface UserData {
    userId: number;          // ID chính dùng trong app
    username: string;
    fullName: string;
    role: string;
    profilePicture?: string;
    email?: string;          // Thêm trường này
    isActive?: boolean;      // Thêm trường này
    id?: number;             // Thêm trường này (phòng trường hợp API trả về cả 'id')
    token?: string;          // Token xác thực
}

interface AuthContextType {
    user: UserData | null;
    isLoggedIn: boolean;
    hasOnboarded: boolean;
    isLoading: boolean;
    login: (userData: UserData) => Promise<void>;
    logout: () => Promise<void>;
    completeOnboarding: () => Promise<void>;
    resetOnboarding: () => Promise<void>;
    // 2. THÊM HÀM setUser VÀO CONTEXT
    setUser: (userData: UserData) => void;
}

const AUTH_STORAGE_KEY = 'userSession'; 
const ONBOARDING_STORAGE_KEY = 'user-has-onboarded';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUserState] = useState<UserData | null>(null); // Đổi tên state nội bộ để tránh trùng
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const router = useRouter();
    const segments = useSegments();

    // 1. Load dữ liệu khi mở App
    useEffect(() => {
        const loadState = async () => {
            try {
                const onboarded = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
                setHasOnboarded(onboarded === 'true');

                const userJson = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
                if (userJson) {
                    setUserState(JSON.parse(userJson));
                }
            } catch (e) {
                console.error("Lỗi load Auth:", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadState();
    }, []);

    // 2. LOGIC ĐIỀU HƯỚNG TỰ ĐỘNG (Giữ nguyên logic của bạn - rất tốt)
    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === 'auth';
        
        if (!hasOnboarded) {
            if (segments[1] !== 'onboarding') {
                router.replace('/auth/onboarding');
            }
        } else if (!user) {
            // Chưa login
            if (!inAuthGroup || segments[1] === 'onboarding') {
                router.replace('/auth/login');
            }
        } else if (user) {
            // Đã login
            if (inAuthGroup) {
                router.replace('/(tabs)/home');
            }
        }
    }, [user, hasOnboarded, isLoading, segments]);

    // 3. Các hành động

    const login = async (userData: UserData) => {
        setUserState(userData);
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    };

    const logout = async () => {
        setUserState(null);
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    };

    // 4. HÀM MỚI: setUser (Dùng để update profile mà ko cần login lại)
    const setUser = (userData: UserData) => {
        setUserState(userData);
        // Lưu ngay lập tức để đồng bộ
        AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData)).catch(err => 
            console.error("Lỗi lưu user update:", err)
        );
    };

    const completeOnboarding = async () => {
        setHasOnboarded(true);
        await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    };

    const resetOnboarding = async () => {
        setHasOnboarded(false);
        setUserState(null);
        await AsyncStorage.multiRemove([ONBOARDING_STORAGE_KEY, AUTH_STORAGE_KEY]);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            hasOnboarded,
            isLoading,
            login,
            logout,
            completeOnboarding,
            resetOnboarding,
            setUser // Export hàm này ra ngoài
        }}>
            {children}
        </AuthContext.Provider>
    );
};