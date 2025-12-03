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
import { useColorScheme } from 'react-native'; // Để lấy theme hệ thống ban đầu

// --- 1. Định nghĩa Kiểu dữ liệu ---
type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

// --- 2. Khởi tạo Context ---
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// --- 3. Custom Hook để sử dụng Theme Context ---
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// --- 4. Component Provider Chính ---

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
    // Lấy theme mặc định của hệ thống
    const colorScheme = useColorScheme(); 
    // State theme: Khởi tạo với 'light' hoặc theme hệ thống
    const [theme, setTheme] = useState<Theme>(colorScheme === 'dark' ? 'dark' : 'light'); 
    
    // Khóa lưu trữ trong AsyncStorage
    const THEME_STORAGE_KEY = 'user-app-theme';

    // useEffect: Tải theme đã lưu từ bộ nhớ cục bộ
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (storedTheme) {
                    setTheme(storedTheme as Theme);
                } else {
                    // Nếu chưa có theme nào được lưu, dùng theme hệ thống (colorScheme)
                    setTheme(colorScheme === 'dark' ? 'dark' : 'light');
                }
            } catch (e) {
                console.error("Failed to load theme from storage", e);
            }
        };

        loadTheme();
    }, [colorScheme]);

    // Hàm chuyển đổi theme
    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        try {
            // Lưu theme mới vào bộ nhớ cục bộ
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (e) {
            console.error("Failed to save theme to storage", e);
        }
    };

    const isDarkMode = theme === 'dark';

    const value = useMemo(() => ({
        theme,
        isDarkMode,
        toggleTheme,
    }), [theme, isDarkMode]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};