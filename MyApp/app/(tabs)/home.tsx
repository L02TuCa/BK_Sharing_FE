import React, { FC } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  Alert,
  Platform, // <-- 1. Nhớ import thêm Platform
  StatusBar // <-- 2. Import StatusBar nếu muốn lấy chiều cao chuẩn
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 

// 1. IMPORT AUTH CONTEXT
import { useAuth } from '../context/AuthContext'; 

import RecentItem from '../components/RecentItem'; 
import BkLogo from '../components/BkLogo';

// --- DỮ LIỆU GIẢ ĐỊNH ---
interface RecentData {
  id: string;
  title: string;
  subtitle: string;
  rating: number;
  time: string;
  color: string;
}

const RECENT_DATA: RecentData[] = [
  { id: '1', title: 'Giải tích', subtitle: 'Đại cương', rating: 4.5, time: '2 days ago', color: '#B3C3FF' },
  { id: '2', title: 'Mobile dev app', subtitle: 'Chuyên ngành', rating: 4.0, time: '3 days ago', color: '#A0D2FF' },
  { id: '3', title: 'Cơ sở dữ liệu', subtitle: 'Kỹ thuật', rating: 4.8, time: '1 day ago', color: '#C0FFEE' },
];

const HomeScreen: FC = () => {
    // 2. LẤY THÔNG TIN USER TỪ CONTEXT
    const { user } = useAuth();
    const router = useRouter();

    const handleViewItem = (item: RecentData) => {
        Alert.alert('Xem ngay', `Bạn đã chọn tài liệu: ${item.title}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 1. Header Bar */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    {/* Avatar: Dùng ảnh từ user hoặc tạo ảnh mặc định theo tên */}
                    <Image
                        source={{ 
                            uri: user?.profilePicture || 
                                 `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=random` 
                        }} 
                        style={styles.avatar}
                    />
                    
                    {/* Hiển thị tên User */}
                    <View>
                        <Text style={{ fontSize: 12, color: '#666' }}>Xin chào,</Text>
                        <Text style={styles.greetingText}>
                            {user?.fullName || user?.username || "Sinh viên"}
                        </Text>
                    </View>
                </View>
                
                {/* Search Icon */}
                <TouchableOpacity onPress={() => router.push('/screens/SearchScreen')}>
                    <Feather name="search" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* 2. Logo/Biểu tượng Chính */}
            <View style={styles.logoContainer}>
                <BkLogo 
                    width={300} 
                    height={200}
                    color="#000080"
                />
            </View>

            {/* 3. Recents Header */}
            <View style={styles.recentsHeader}>
                <Text style={styles.recentsTitle}>Gần đây</Text>
                <TouchableOpacity onPress={() => Alert.alert('View All', 'Mở trang danh sách tất cả')}>
                    <Text style={styles.viewAllText}>Xem tất cả</Text>
                </TouchableOpacity>
            </View>

            {/* 4. Recents List */}
            <FlatList
                data={RECENT_DATA}
                renderItem={({ item }) => (
                    <RecentItem 
                        item={item}
                        onViewPress={handleViewItem}
                        // Đảm bảo RecentItem nhận đúng prop này
                        // Nếu RecentItem của bạn dùng props khác (ví dụ: name, date...), hãy sửa lại ở đây cho khớp
                        // Ví dụ: name={item.title} date={item.time} ...
                    />
                )}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentsListContainer}
            />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 75,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#eee', // Màu nền dự phòng khi chưa load ảnh
  },
  greetingText: {
    fontSize: 16, // Giảm nhẹ size để vừa vặn hơn nếu tên dài
    fontWeight: 'bold',
    color: '#000080',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  recentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  recentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  viewAllText: {
    color: '#000080',
    fontSize: 14,
  },
  recentsListContainer: {
    paddingHorizontal: 15,
  },
});

export default HomeScreen;