import React, { FC, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch, // Dùng cho tùy chọn bật/tắt
  Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Dùng để quay lại màn hình trước
import { useTheme } from '../context/ThemeContext';


// --- Component Tái Sử Dụng cho Tùy chọn Cài đặt (giống settings.tsx) ---

interface SettingOptionProps {
  iconName: keyof typeof Ionicons.glyphMap; 
  label: string;
  onPress: () => void;
  iconColor: string;
  // Nội dung bên phải, có thể là mũi tên, text, hoặc switch
  rightContent?: 'chevron' | 'switch'; 
  switchValue?: boolean;
  onSwitchToggle?: (value: boolean) => void;
  valueText?: string;
}

const SettingOption: FC<SettingOptionProps> = ({ 
    iconName, 
    label, 
    onPress, 
    iconColor,
    rightContent = 'chevron',
    switchValue = false,
    onSwitchToggle,
    valueText,
}) => {

  const renderRightContent = () => {
    if (rightContent === 'switch') {
      return (
        <Switch
          trackColor={{ false: "#b0b0b0ff", true: '#000080' }}
          thumbColor={switchValue ? "#fff" : "#f4f3f4"}
          ios_backgroundColor="#b3b3b3ff"
          onValueChange={onSwitchToggle}
          value={switchValue}
        />
      );
    }
    
    if (rightContent === 'chevron') {
        // Hiển thị giá trị Text nếu có
        if (valueText) {
            return (
                <View style={styles.valueRow}>
                    <Text style={styles.valueText}>{valueText}</Text>
                    <Feather name="chevron-right" size={24} color="#ccc" />
                </View>
            );
        }
        return <Feather name="chevron-right" size={24} color="#ccc" />;
    }

    return null; // Không hiển thị gì nếu không được định nghĩa
  };

  return (
    <TouchableOpacity 
      style={styles.optionContainer} 
      onPress={rightContent === 'switch' ? onSwitchToggle : onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionContent}>
        {/* Icon */}
        <Ionicons 
          name={iconName} 
          size={24} 
          color={iconColor}
          style={styles.optionIcon}
        />
        {/* Label */}
        <Text style={styles.optionLabel}>{label}</Text>
      </View>
      
      {/* Nội dung bên phải */}
      {renderRightContent()}
    </TouchableOpacity>
  );
};



// Định nghĩa màu sắc theo theme
const getThemeColors = (isDark: boolean) => ({
    background: isDark ? '#121212' : '#f8f9fa',
    cardBackground: isDark ? '#1E1E1E' : '#fff',
    text: isDark ? '#EAEAEA' : '#1A1A1A',
    headerBorder: isDark ? '#333333' : '#f0f0f0',
    sectionTitle: isDark ? '#BBBBBB' : '#666',
    iconColor: isDark ? '#fff' : '#000', // Màu chung cho icon header
});






// --- MÀN HÌNH CHÍNH: GeneralSettingsScreen ---

export default function GeneralSettingsScreen() {
    const router = useRouter();

    // State giả định cho Dark Mode
    const { isDarkMode, toggleTheme } = useTheme(); 
    // State giả định cho Tự động lưu
    const [isAutoSave, setIsAutoSave] = useState(true); 


    const handleLanguagePress = () => {
        Alert.alert('Ngôn ngữ', 'Chuyển đến màn hình chọn Ngôn ngữ.');
    };

    const handleThemeToggle = () => {
        toggleTheme();
        
    };

    const handleAutoSaveToggle = () => {
        setIsAutoSave(prev => !prev);
        // TODO: Thêm logic cập nhật tùy chọn Tự động lưu dữ liệu
    };
    
    const handleStoragePress = () => {
        Alert.alert('Quản lý bộ nhớ', 'Chuyển đến màn hình Chi tiết Bộ nhớ.');
    };


    const handleInforPress = () => {
        Alert.alert('Quản lý bộ nhớ', 'Chuyển đến màn hình Chi tiết Bộ nhớ.');
    };

    const handleReportPress = () => {
        Alert.alert('Quản lý bộ nhớ', 'Chuyển đến màn hình Chi tiết Bộ nhớ.');
    };


    const colors = getThemeColors(isDarkMode);


    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            
            {/* 1. Header (Cần thiết cho màn hình cài đặt nâng cao) */}
            <View style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.headerBorder }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="chevron-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cài đặt Chung</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.optionsList}>
                
                {/* --- NHÓM GIAO DIỆN & HIỂN THỊ --- */}
                <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>Hiển thị</Text>
                <SettingOption 
                    iconName="moon-outline"
                    label="Chế độ tối (Dark Mode)"
                    iconColor="#FFC300"
                    rightContent="switch"
                    switchValue={isDarkMode}
                    onSwitchToggle={handleThemeToggle}
                    onPress={() => {}} // Không cần onPress cho switch
                />
                <SettingOption 
                    iconName="language-outline"
                    label="Ngôn ngữ ứng dụng"
                    iconColor="#00A86B"
                    rightContent="chevron"
                    valueText="Tiếng Việt" // Giá trị hiện tại
                    onPress={handleLanguagePress}
                />
                
                {/* --- NHÓM LƯU TRỮ & DỮ LIỆU --- */}
                <Text style={styles.sectionTitle}>Dữ liệu và Bộ nhớ</Text>
                <SettingOption 
                    iconName="cloud-upload-outline"
                    label="Tự động đồng bộ/lưu"
                    iconColor="#4285F4"
                    rightContent="switch"
                    switchValue={isAutoSave}
                    onSwitchToggle={handleAutoSaveToggle}
                    onPress={() => {}}
                />
                <SettingOption 
                    iconName="trash-outline"
                    label="Quản lý bộ nhớ đệm"
                    iconColor="#FF6B6B"
                    rightContent="chevron"
                    onPress={handleStoragePress}
                />

                


                {/* --- Thông tin --- */}
                <Text style={styles.sectionTitle}>Thông tin</Text>
                <SettingOption 
                    iconName="information-circle-outline"
                    label="About us"
                    iconColor="#00ff40ff"
                    rightContent="chevron"
                    onPress={handleInforPress}
                />
                <SettingOption 
                    iconName="alert-circle-outline"
                    label="Report"
                    iconColor="#ff0000ff"
                    rightContent="chevron"
                    onPress={handleReportPress}
                />

            
            </ScrollView>
        </SafeAreaView>
    );
}

// --- STYLING ---

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa', // Màu nền nhẹ
    },

    // 1. Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },

    // 2. Options List
    optionsList: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 5,
        textTransform: 'uppercase',
    },

    // 3. Setting Option Style
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff', 
        borderRadius: 15,
        paddingVertical: 18,
        paddingHorizontal: 15,
        marginBottom: 10,
        minHeight: 60,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIcon: {
        marginRight: 15,
        minWidth: 24, 
    },
    optionLabel: {
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: '500',
    },

    // Dành cho tùy chọn có valueText
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    valueText: {
        fontSize: 16,
        color: '#999',
        marginRight: 10,
    }
});