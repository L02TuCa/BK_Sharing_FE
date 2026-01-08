import React, { FC, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import CustomSwitchBar, { SwitchTabName } from '../components/CustomSwitchBar';
import FolderListItem from '../components/FolderListItem';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

// --- 1. CẬP NHẬT INTERFACE THEO JSON MỚI ---
interface BackendDocument {
  documentId: number;       // Sửa từ document_id
  title: string;
  description: string;
  fileType: string;         // Sửa từ file_type
  filePath: string;         // Sửa từ file_path (đây là link file)
  fileSize: number;         // Sửa từ file_size
  uploadedById: number;
  uploadedByUsername: string;
  createdAt: string;        // Sửa từ created_at
  versions: any;
  versionCount: any;
}

// --- 2. DATA CHO UI (Giữ nguyên) ---
interface ArchiveItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'folder' | 'file';
  color: string;
  isShared: boolean;
  fileUrl: string; // ✅ Thêm trường này để truyền sang màn hình chi tiết
}

// --- Helper Functions ---
const formatFileSize = (size: number) => {
  if (!size) return '0 MB';
  if (size >= 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + ' MB';
  if (size >= 1024) return (size / 1024).toFixed(2) + ' KB';
  return size + ' Bytes';
};

const getFileColor = (fileType: string) => {
  const type = fileType ? fileType.toLowerCase() : '';
  if (type.includes('pdf')) return '#F44336'; 
  if (type.includes('doc') || type.includes('word')) return '#2196F3'; 
  if (type.includes('xls') || type.includes('excel')) return '#4CAF50'; 
  if (type.includes('ppt')) return '#FF9800'; 
  return '#000080'; 
};

export default function ArchiveScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Lấy user từ context

  const [activeTab, setActiveTab] = useState<SwitchTabName>('Tài liệu của tôi');
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<ArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
        fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    // Giả sử user.id trong context chính là userId cần truyền
    if (!user || !user.userId) return; 

    try {
      setIsLoading(true);
      
      // ✅ CẬP NHẬT ENDPOINT: /api/v1/documents/user/{userId}
      const url = `https://bk-sharing-app.fly.dev/api/v1/documents/user/${user.userId}`;
      console.log("Fetching URL:", url);

      const response = await fetch(url);
      const result = await response.json();

      // ✅ CẬP NHẬT CÁCH LẤY DATA: Dữ liệu nằm trong result.data
      if (result.success && Array.isArray(result.data)) {
          const documents: BackendDocument[] = result.data;

          // ✅ CẬP NHẬT MAPPING
          const mappedData: ArchiveItem[] = documents.map((doc) => ({
            id: doc.documentId.toString(),
            title: doc.title || 'Không có tiêu đề',
            // Format ngày: 2026-01-08T12:29... -> 08/01/2026
            subtitle: `${formatFileSize(doc.fileSize)} • ${new Date(doc.createdAt).toLocaleDateString('vi-VN')}`,
            type: 'file', 
            color: getFileColor(doc.fileType),
            isShared: false, 
            fileUrl: doc.filePath // Lưu link file để dùng khi bấm vào
          }));

          setData(mappedData);
      } else {
          // Xử lý trường hợp không có data hoặc lỗi logic backend
          console.warn("API trả về thành công nhưng không có data:", result);
          setData([]);
      }

    } catch (error) {
      console.error('Lỗi fetch documents:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách tài liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tabName: SwitchTabName) => {
    setActiveTab(tabName);
  };

  // ✅ CẬP NHẬT HÀM NHẤN VÀO ITEM
  const handleItemPress = (item: ArchiveItem) => {
    // Truyền thêm fileUrl sang màn hình chi tiết để hiển thị PDF
    router.push({
      pathname: "/details/[id]",
      params: { 
        id: item.id, 
        title: item.title,
        type: item.type,
        url: item.fileUrl // Truyền link file (Supabase URL)
      }
    });
  };

  const handleMenuPress = (item: ArchiveItem) => {
    Alert.alert('Tùy chọn', `Mở menu cho: ${item.title}`);
  };

  const filteredData = data
    .filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()))
    .filter(item => {
        if (activeTab === 'Tài liệu của tôi') return item.isShared === false;
        if (activeTab === 'Tài liệu đã chia sẻ') return item.isShared === true;
        return true; 
    });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lưu trữ</Text>
      </View>

      <View style={styles.switchBarWrapper}>
        <CustomSwitchBar activeTab={activeTab} onTabChange={handleTabChange} />
      </View>

      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm file..."
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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000080" />
          <Text style={{marginTop: 10, color: '#666'}}>Đang tải tài liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
              <FolderListItem 
                  item={item} 
                  onPress={handleItemPress} 
                  onMenuPress={handleMenuPress} 
              />
          )}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={fetchDocuments}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>Không tìm thấy tài liệu nào.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
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
    padding: 0,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 15,
  },
  switchBarWrapper: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});