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

// Định nghĩa kiểu dữ liệu User (tùy chỉnh theo API của bạn)
interface UserData {
    userId: number;
    username: string;
    fullName: string;
    role: string;
    profilePicture?: string;
    // ... các trường khác
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
}

const AUTH_STORAGE_KEY = 'userSession'; // Khớp với key bạn dùng bên Login cũ
const ONBOARDING_STORAGE_KEY = 'user-has-onboarded';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const router = useRouter();
    const segments = useSegments(); // Lấy thông tin màn hình hiện tại

    // 1. Load dữ liệu khi mở App
    useEffect(() => {
        const loadState = async () => {
            try {
                // Check Onboarding
                const onboarded = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
                setHasOnboarded(onboarded === 'true');

                // Check Login
                const userJson = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
                if (userJson) {
                    setUser(JSON.parse(userJson));
                }
            } catch (e) {
                console.error("Lỗi load Auth:", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadState();
    }, []);

    // 2. LOGIC ĐIỀU HƯỚNG TỰ ĐỘNG (NAVIGATION GUARD)
    useEffect(() => {
        if (isLoading) return; // Chưa load xong thì chưa làm gì

        const inAuthGroup = segments[0] === 'auth'; // Đang ở màn hình Login/Signup/Onboarding
        const inTabsGroup = segments[0] === '(tabs)'; // Đang ở Home/Settings...

        if (!hasOnboarded) {
            // Chưa xem Onboarding -> Luôn đẩy về Onboarding
            if (segments[1] !== 'onboarding') {
                router.replace('/auth/onboarding');
            }
        } else if (!user) {
            // Đã xem Onboarding nhưng Chưa đăng nhập
            // 1. Nếu đang cố vào Home (inAuthGroup = false) -> Đá về Login
            // 2. HOẶC Nếu đang bị kẹt ở trang Onboarding (dù đã xem xong) -> Đá về Login
            if (!inAuthGroup || segments[1] === 'onboarding') {
                router.replace('/auth/login');
            }
        } else if (user) {
            // Đã đăng nhập
            // Nếu người dùng đang ở trang Login/Onboarding -> Đẩy vào Home
            if (inAuthGroup) {
                router.replace('/(tabs)/home');
            }
        }
    }, [user, hasOnboarded, isLoading, segments]);

    // 3. Các hành động
    const login = async (userData: UserData) => {
        setUser(userData); // Cập nhật State -> useEffect ở trên sẽ tự chuyển trang
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    };

    const logout = async () => {
        setUser(null); // Set null -> useEffect ở trên sẽ tự chuyển về Login
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    };

    const completeOnboarding = async () => {
        setHasOnboarded(true);
        await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
        // Sau khi set true, useEffect sẽ kiểm tra user -> nếu null -> tự chuyển về login
    };

    const resetOnboarding = async () => {
        setHasOnboarded(false);
        setUser(null); // Reset luôn user để an toàn
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
            resetOnboarding
        }}>
            {children}
        </AuthContext.Provider>
    );
};