// app/(tabs)/notifications.tsx

import React, { FC } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NotificationItem from '../components/NotificationItem'; // Đảm bảo đúng đường dẫn

// --- DỮ LIỆU GIẢ ĐỊNH ---

interface Notification {
    id: string;
    iconName: keyof typeof Ionicons.glyphMap; 
    iconColor: string;
    title: string;
    detail: string;
    time: string;
    isRead: boolean;
}

const NOTIFICATION_DATA: Notification[] = [
  { 
    id: 'n1', 
    iconName: 'chatbox-ellipses-outline', 
    iconColor: '#FF6347', 
    title: 'Bình luận mới trên Giải tích', 
    detail: 'Bạn Khoa đã trả lời bình luận của bạn: "Tôi nghĩ bạn nên xem lại định lý 3.2"', 
    time: '30m ago', 
    isRead: false 
  },
  { 
    id: 'n2', 
    iconName: 'cloud-download-outline', 
    iconColor: '#000080', 
    title: 'Tài liệu Mobile dev app đã được tải lên', 
    detail: 'Giảng viên đã thêm một file mới: "Assignment 1 - React Native"', 
    time: '2h ago', 
    isRead: false 
  },
  { 
    id: 'n3', 
    iconName: 'people-outline', 
    iconColor: '#3CB371', 
    title: 'Thêm vào nhóm Cấu trúc dữ liệu', 
    detail: 'Bạn đã được thêm vào nhóm "Ôn thi cuối kỳ"', 
    time: '1 day ago', 
    isRead: true 
  },
  { 
    id: 'n4', 
    iconName: 'alert-circle-outline', 
    iconColor: '#FFD700', 
    title: 'Bộ nhớ sắp đầy', 
    detail: 'Bộ nhớ đám mây của bạn đã đạt 90% dung lượng. Vui lòng nâng cấp', 
    time: '1 day ago', 
    isRead: true 
  },
];

// --- COMPONENT CHÍNH ---

const NotificationScreen: FC = () => {
  
  const handleNotificationPress = (id: string) => {
    // Logic xử lý khi nhấn vào thông báo (ví dụ: đánh dấu đã đọc và điều hướng)
    Alert.alert('Mở Thông báo', `Thông báo ID: ${id}`);
    // Thực hiện logic đánh dấu đã đọc tại đây (sử dụng state hoặc Redux/Context)
  };
  
  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationItem notification={item} onPress={handleNotificationPress} />
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Header Tùy chỉnh (Vì bạn đã ẩn headerShown trong _layout.tsx) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        {/* Nút Clear All nếu cần, tạm thời ẩn */}
        {/* <TouchableOpacity>
            <Text style={styles.clearText}>Xóa tất cả</Text>
        </TouchableOpacity> */}
      </View>

      {/* Danh sách thông báo */}
      <FlatList
        data={NOTIFICATION_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không có thông báo nào.</Text>
            </View>
        }
      />
    </SafeAreaView>
  );
};

// --- STYLING ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Màu nền nhẹ
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  listContent: {
    paddingBottom: 20, // Khoảng trống cuối danh sách
  },
  emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50,
  },
  emptyText: {
      fontSize: 16,
      color: '#6c757d',
  }
});

export default NotificationScreen;