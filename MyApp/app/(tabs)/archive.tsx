// app/(tabs)/archive.tsx

import React, { FC, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput, // Dùng cho thanh tìm kiếm
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams } from 'expo-router'; // Không cần thiết cho màn hình này
import CustomSwitchBar, { SwitchTabName } from '../components/CustomSwitchBar';
import FolderListItem from '../components/FolderListItem';
import { useRouter } from 'expo-router'; // ⬅️ THÊM DÒNG NÀY

interface ArchiveItem {
    id: string;
    title: string;
    subtitle: string;
    type: 'folder' | 'file';
    color: string; 
    isShared: boolean; // ✅ THUỘC TÍNH MỚI: true nếu là 'Tài liệu đã chia sẻ'
}

// Dữ liệu giả định (Cần thêm thuộc tính isShared)
const ARCHIVE_DATA_NEW: ArchiveItem[] = [
  // Tài liệu của tôi
  { id: '1', title: 'Tài liệu quan trọng', subtitle: '2.5 MB • 10/11/2025', type: 'file', color: '#000080', isShared: false },
  { id: '2', title: 'Dự án Mobile App (Private)', subtitle: '50 MB • 01/11/2025', type: 'folder', color: '#FFC107', isShared: false },
  
  // Tài liệu đã chia sẻ
  { id: '3', title: 'Ảnh cá nhân (Shared)', subtitle: '120 MB • 05/10/2025', type: 'folder', color: '#FFC107', isShared: true },
  { id: '4', title: 'Kế hoạch học tập (Shared)', subtitle: '1.2 MB • 28/10/2025', type: 'file', color: '#000080', isShared: true },
  { id: '5', title: 'Báo cáo tháng 12', subtitle: '3.8 MB • 15/11/2025', type: 'file', color: '#000080', isShared: false },
];
// Hàm xử lý khi nhấn vào Item
// const handleItemPress = (item: ArchiveItem) => { // ⬅️ Dùng kiểu ArchiveItem chính xác
//     Alert.alert('Xem chi tiết', `Bạn đã nhấn vào: ${item.title}`);
// };

// Hàm xử lý khi nhấn nút Menu (3 chấm)
const handleMenuPress = (item: ArchiveItem) => { // ⬅️ Dùng kiểu ArchiveItem chính xác
    Alert.alert('Tùy chọn', `Mở menu cho: ${item.title}`);
};




// --- Màn hình Archive Chính ---
export default function ArchiveScreen() {
  const router = useRouter(); // ⬅️ KHAI BÁO HOOK ROUTER
  // 1. Khai báo state để theo dõi tab nào đang active
  const [activeTab, setActiveTab] = useState<SwitchTabName>('Tài liệu của tôi');
  
  // Hàm xử lý chuyển đổi tab
  const handleTabChange = (tabName: SwitchTabName) => {
    setActiveTab(tabName);
    // Ở đây bạn sẽ thay đổi dữ liệu (data) được hiển thị
    console.log(`Chuyển sang tab: ${tabName}`);
  };
  
  
  const handleItemPress = (item: ArchiveItem) => { // ⬅️ Dùng kiểu ArchiveItem chính xác
    // Điều hướng đến màn hình chi tiết item, truyền ID và title qua URL
    router.push({
      pathname: "/details/[id]",
      params: { 
        id: item.id, 
        title: item.title,
        type: item.type 
      }
    });
    console.log(`Điều hướng đến item ID: ${item.id}`);
};




  
    const [searchText, setSearchText] = useState('');
  
  // ✅ LOGIC LỌC DỮ LIỆU MỚI: Lọc theo Search Text VÀ Ownership
  const filteredData = ARCHIVE_DATA_NEW
    .filter(item => 
      // Lọc theo search text
      item.title.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter(item => {
        // Lọc theo Tab (Sở hữu hay Chia sẻ)
        if (activeTab === 'Tài liệu của tôi') {
            return item.isShared === false;
        }
        if (activeTab === 'Tài liệu đã chia sẻ') {
            return item.isShared === true;
        }
        return true; 
    });



  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header tùy chỉnh */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lưu trữ</Text>
      </View>

    {/* 2. CHÈN CUSTOM SWITCH BAR VÀO ĐÂY */}
      <View style={styles.switchBarWrapper}>
        <CustomSwitchBar activeTab={activeTab} onTabChange={handleTabChange} />
      </View>


      {/* Thanh tìm kiếm (Search Bar) */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm file hoặc folder..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Feather name="x-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>



    



      {/* Danh sách File/Folder */}
      <FlatList
        data={filteredData} // ⬅️ SỬ DỤNG DỮ LIỆU ĐÃ LỌC
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <FolderListItem 
                item={item} // 
                onPress={handleItemPress} 
                onMenuPress={handleMenuPress} 
            />
        )}
        // 
        contentContainerStyle={styles.listContent}
        
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Không tìm thấy tài liệu nào trong "{activeTab}".</Text>
            <Text style={styles.emptySubText}>Kiểm tra lại từ khóa tìm kiếm hoặc tab.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// --- STYLING ---




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // Header Style
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Chỉ hiển thị tiêu đề
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    
  },

  // Search Bar Style
  searchBarContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0, // Xóa padding mặc định của TextInput
  },

  // List Style
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Đảm bảo không bị BottomNavBar che
  },

  // Item Style
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Để tên không bị đẩy ra ngoài
  },
  itemIcon: {
    marginRight: 15,
    minWidth: 24,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  itemDetails: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },

  // Empty State Style
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 15,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  switchBarWrapper: {
        paddingVertical: 15,
        alignItems: 'center',
        // Có thể thêm borderBottomWidth: 1 nếu muốn phân tách rõ ràng hơn
    },

});