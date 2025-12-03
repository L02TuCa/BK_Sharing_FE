import React, { FC } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// ⬇️ IMPORT CÁC COMPONENT TÁI SỬ DỤNG ⬇️
// Nếu bạn đã tạo SettingOption trong một file riêng (ví dụ: components/SettingOption.tsx), hãy import nó.
// Nếu chưa, tôi sẽ định nghĩa lại nó ở đây để đảm bảo code hoạt động.

// --- Component Tái Sử Dụng cho Tùy chọn Cài đặt (Giả định) ---
// Bạn nên tạo file riêng cho SettingOption để tái sử dụng dễ hơn
interface SettingOptionProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  iconColor: string; // Màu sắc riêng cho từng icon
  rightContent?: 'chevron' | 'switch'; // 'chevron' (mũi tên) hoặc 'switch' (công tắc)
  valueText?: string; // Giá trị hiện tại (ví dụ: 'Tiếng Việt')
}

const SettingOption: FC<SettingOptionProps> = ({ 
    iconName, 
    label, 
    onPress, 
    iconColor, 
    rightContent = 'chevron',
    valueText,
}) => {
    // Chỉ render mũi tên hoặc giá trị hiện tại (không có switch trong màn hình này)
    const renderRightContent = () => {
        if (rightContent === 'chevron') {
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
        return null; // Không hỗ trợ switch cho màn hình này
    };

    return (
        <TouchableOpacity 
            style={styles.optionContainer} 
            onPress={onPress}
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
// --- HẾT: Component SettingOption ---


export default function AccountSettingsScreen() {
    const router = useRouter();

    // Dữ liệu giả định
    const userName = "Nguyễn Duy Thông";
    const userEmail = "thonqp@hcmut.edu.vn";

    // --- CÁC HÀM XỬ LÝ (Tạm thời là Alert) ---

    const handleProfilePress = () => {
        Alert.alert("Chỉnh sửa Hồ sơ", "Chuyển đến màn hình cập nhật tên, avatar.");
    };

    const handleChangePasswordPress = () => {
        Alert.alert("Đổi Mật khẩu", "Chuyển đến màn hình đổi mật khẩu.");
    };

    const handleBiometricsPress = () => {
        Alert.alert("Bảo mật", "Bật/Tắt Touch ID/Face ID.");
    };

    const handleDeleteAccountPress = () => {
        Alert.alert(
            "Xóa Tài khoản", 
            "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", style: "destructive", onPress: () => console.log('Account Deleted') }
            ]
        );
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            
            {/* --- HEADER --- */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="chevron-left" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tài khoản và Bảo mật</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.optionsList}>
                
                {/* --- 1. PHẦN TÀI KHOẢN HIỆN TẠI --- */}
                <Text style={styles.sectionTitle}>Tài khoản</Text>
                <SettingOption 
                    iconName="person-circle-outline"
                    label="Hồ sơ của tôi"
                    iconColor="#007AFF" // Màu xanh dương
                    rightContent="chevron"
                    valueText={userName} // Tên người dùng hiện tại
                    onPress={handleProfilePress}
                />
                <SettingOption 
                    iconName="mail-outline"
                    label="Email"
                    iconColor="#4CD964" // Màu xanh lá
                    rightContent="chevron"
                    valueText={userEmail} // Email hiện tại
                    onPress={() => Alert.alert('Email', 'Chuyển đến màn hình cập nhật Email.')}
                />

                {/* --- 2. PHẦN BẢO MẬT --- */}
                <Text style={styles.sectionTitle}>Bảo mật</Text>
                <SettingOption 
                    iconName="lock-closed-outline"
                    label="Đổi mật khẩu"
                    iconColor="#FF9500" // Màu cam
                    rightContent="chevron"
                    onPress={handleChangePasswordPress}
                />
                <SettingOption 
                    iconName="finger-print-outline"
                    label="Touch ID/Face ID"
                    iconColor="#AF52DE" // Màu tím
                    rightContent="chevron" // Có thể đổi thành switch nếu bạn đã có component Switch
                    onPress={handleBiometricsPress}
                />
                
                {/* --- 3. KHU VỰC NGUY HIỂM --- */}
                <Text style={styles.sectionTitle}>Khu vực nguy hiểm</Text>
                <SettingOption 
                    iconName="trash-outline"
                    label="Xóa tài khoản"
                    iconColor="#FF3B30" // Màu đỏ
                    rightContent="chevron"
                    onPress={handleDeleteAccountPress}
                />
                
            </ScrollView>
        </SafeAreaView>
    );
}

// --- STYLING ---

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff', // Giả định nền trắng
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    optionsList: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 15,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    // Setting Option Styles
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa',
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
    },
    optionLabel: {
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    // Right Content Styles
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    valueText: {
        fontSize: 15,
        color: '#999',
        marginRight: 5,
    }
});

// Bạn cần đảm bảo các styles này phù hợp với styles trong generalSettings.tsx để có giao diện đồng nhất.