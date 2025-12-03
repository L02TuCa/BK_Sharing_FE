import React, { FC } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  Alert, // Dùng để hiển thị thông báo khi nhấn nút
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Dùng cho các chức năng điều hướng sau này

// ⬇️ IMPORT CÁC COMPONENT TÁI SỬ DỤNG ⬇️
import RecentItem from '../components/RecentItem'; 
// import BottomNavBar from '../components/BottomNavBar';
import BkLogo from '../components/BkLogo';



// --- DỮ LIỆU GIẢ ĐỊNH ---
// Định nghĩa kiểu dữ liệu (Nếu dùng TypeScript)
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

// --- LOGIC MÀN HÌNH ---

const HomeScreen: FC = () => {
    // const router = useRouter(); // Khai báo nếu cần điều hướng

    // Xử lý sự kiện khi nhấn nút "Xem ngay" trên RecentItem
    const handleViewItem = (item: RecentData) => {
        Alert.alert('Xem ngay', `Bạn đã chọn tài liệu: ${item.title}`);
        // Thêm logic điều hướng sang trang chi tiết tài liệu ở đây
    };

    // Xử lý sự kiện khi nhấn các tab trên thanh Navigation Bar
    const handleTabPress = (tabName: string) => {
        Alert.alert('Chuyển Tab', `Bạn đã chuyển đến tab: ${tabName}`);
        // Thêm logic điều hướng Tab Bar (ví dụ: router.replace('/tabs/archive'))
    };

    // Xử lý sự kiện khi nhấn nút Cộng (+)
    const handleAddPress = () => {
        Alert.alert('Thêm mới', 'Mở màn hình tạo tài liệu/tài khoản mới.');
        // Thêm logic mở modal hoặc chuyển trang tạo mới
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 1. Header Bar */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                {/* Avatar/Image */}
                <Image
                    source={{ uri: 'https://picsum.photos/50' }} // Thay bằng đường dẫn ảnh thật
                    style={styles.avatar}
                />
                <Text style={styles.greetingText}>Hii, Yasuo !!</Text>
                </View>
                
                {/* Search Icon */}
                <TouchableOpacity>
                <Feather name="search" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* 2. Logo/Biểu tượng Chính */}
            <View style={styles.logoContainer}>
                <BkLogo 
                    width={400} // Đặt kích thước theo ý muốn
                    height={300}
                    color="#000080" // Có thể thay đổi màu sắc động
                />
            </View>

            {/* 3. Recents Header */}
            <View style={styles.recentsHeader}>
                <Text style={styles.recentsTitle}>Recents</Text>
                <TouchableOpacity onPress={() => Alert.alert('View All', 'Mở trang danh sách tất cả')}>
                    <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
            </View>

            {/* 4. Recents List (Horizontal FlatList) */}
            <FlatList
                data={RECENT_DATA}
                renderItem={({ item }) => (
                    <RecentItem 
                        item={item} 
                        onViewPress={handleViewItem} // Gắn hàm xử lý sự kiện
                    />
                )}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentsListContainer}
            />

            {/* 5. Navigation Bar (Bottom Tab Bar) */}
            {/* ⬇️ SỬ DỤNG COMPONENT ĐÃ TÁCH ⬇️ */}
            {/* <BottomNavBar
                onAddPress={handleAddPress}
                onTabPress={handleTabPress}
            /> */}

        </SafeAreaView>
    );
};

// --- STYLING (Chỉ giữ lại styles liên quan đến bố cục chung của màn hình) ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 75, // Thêm padding để không bị thanh Nav che khuất nội dung cuối
  },
  
  // 1. Header Bar
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
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '500',
  },
  
  // 2. Logo/Biểu tượng Chính
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200, 
    position: 'relative',
  },
  logoText: {
    fontSize: 100,
    fontWeight: '900',
    color: '#000080',
    position: 'absolute',
    top: 50,
    left: 10,
  },
  logoTextDot: {
    fontSize: 30,
    color: '#000080',
    position: 'absolute',
    top: 140,
    left: 110,
  },
  
  // 3. Recents Header
  recentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  recentsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  viewAllText: {
    color: '#000080',
    fontSize: 14,
  },

  // 4. Recents List Container
  recentsListContainer: {
    paddingHorizontal: 15,
    
  },
  // Lưu ý: Styles cho RecentItem đã được di chuyển sang file riêng.
});

export default HomeScreen;