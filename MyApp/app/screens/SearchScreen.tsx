// app/screens/SearchScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity,
  ActivityIndicator, SafeAreaView, Platform, Alert // <-- Thêm Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { searchDocuments, DocumentItem } from '../services/documentService';
import { useHistory } from '../context/HistoryContext';
// --- THÊM IMPORT MỚI ---
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openFileWithOS } from '../utils/fileHelper';
// Tên key dùng để lưu trong AsyncStorage (cần khớp với trang Archive sau này)
const ARCHIVE_STORAGE_KEY = 'my_saved_documents';

export default function SearchScreen() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State để hiển thị loading khi đang tải file về
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const { addToHistory } = useHistory();

  // ... (Giữ nguyên các hàm fetchResults và useEffect cũ) ...
  const fetchResults = async (query: string) => {
    setLoading(true);
    try {
      const results = await searchDocuments(query);
      setData(results);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchResults(keyword);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [keyword]);

  // --- HÀM XỬ LÝ MỚI: TẢI, LƯU VÀ MỞ ---
  const handleDownloadAndOpen = async (item: DocumentItem) => {
    if (downloadingId) return; // Tránh bấm nhiều lần
    setDownloadingId(item.documentId);

    try {
      // 1. Định nghĩa đường dẫn lưu file
      // Lấy đuôi file (pdf, docx...) hoặc mặc định là pdf
      const extension = item.filePath.split('.').pop() || 'pdf';
      const fileName = `${item.title.replace(/\s+/g, '_')}_${item.documentId}.${extension}`;
      const localUri = `${FileSystem.documentDirectory}${fileName}`;

      // 2. Tải file về
      const downloadRes = await FileSystem.downloadAsync(item.filePath, localUri);
      
      if (downloadRes.status !== 200) {
        throw new Error('Tải file thất bại');
      }

      // 3. Lưu thông tin vào Archive (AsyncStorage)
      // Lấy danh sách cũ
      const existingJson = await AsyncStorage.getItem(ARCHIVE_STORAGE_KEY);
      let savedDocs = existingJson ? JSON.parse(existingJson) : [];

      // Kiểm tra xem đã lưu chưa để tránh trùng lặp
      const isExist = savedDocs.some((doc: any) => doc.documentId === item.documentId);
      
      if (!isExist) {
        // Tạo object lưu trữ (bao gồm đường dẫn localUri mới tải)
        const newDoc = {
          ...item,
          localUri: downloadRes.uri, // Quan trọng: Lưu đường dẫn nội bộ
          savedAt: new Date().toISOString()
        };
        savedDocs.unshift(newDoc); // Thêm vào đầu danh sách
        await AsyncStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(savedDocs));
        // Alert.alert("Đã lưu", "Tài liệu đã được thêm vào mục 'Tài liệu của tôi'");
      }

      addToHistory({
        id: item.documentId.toString(),
        title: item.title,
        subtitle: item.fileType,
        rating: item.averageRating || 0,
        color: '#B3C3FF', // Hoặc hàm getFileColor(item.fileType)
        fileUri: downloadRes.uri // Lưu đường dẫn file để mở lại
     });

      // 4.Mở file bằng OS Default
      await openFileWithOS(downloadRes.uri);

    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Lỗi', 'Không thể tải tài liệu này.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Render từng item kết quả
  const renderItem = ({ item }: { item: DocumentItem }) => {
    const isDownloading = downloadingId === item.documentId;

    // Xử lý hiển thị điểm số: Nếu null thì hiện "N/A" hoặc "--"
    const ratingDisplay = item.averageRating 
        ? item.averageRating.toFixed(1) // Làm tròn 1 chữ số thập phân (VD: 4.5)
        : '--';

    return (
      <TouchableOpacity 
        style={styles.itemContainer}
        onPress={() => handleDownloadAndOpen(item)} // Hàm tải & mở file bạn đã viết
        disabled={isDownloading}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="file-document-outline" size={32} color="#000080" />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.itemDesc} numberOfLines={1}>{item.description}</Text>
          
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>{item.fileType}</Text>
            <Text style={styles.metaText}>•</Text>
            <Text style={styles.metaText}>{item.uploadedByUsername}</Text>
            
            {/* --- PHẦN THÊM MỚI: RATING --- */}
            <Text style={styles.metaText}>•</Text>
            <View style={styles.ratingWrapper}>
                <Feather 
                    name="star" 
                    size={12} 
                    color={item.averageRating ? "#FFC107" : "#BDC3C7"} // Vàng nếu có điểm, Xám nếu null
                    style={{ marginRight: 3 }}
                />
                <Text style={[styles.metaText, { color: item.averageRating ? '#333' : '#999' }]}>
                    {ratingDisplay}
                </Text>
                {/* (Tùy chọn) Hiển thị số lượt đánh giá */}
                {/* <Text style={{ fontSize: 10, color: '#999', marginLeft: 2 }}>
                    ({item.totalRatings || 0})
                </Text> */}
            </View>
            {/* ----------------------------- */}

          </View>
        </View>

        {isDownloading ? (
          <ActivityIndicator size="small" color="#000080" />
        ) : (
          <Feather name="download-cloud" size={20} color="#666" />
        )}
      </TouchableOpacity>
    );
  };

  // ... (Phần return JSX giữ nguyên, chỉ thay đổi logic bên trên)
  return (
    <SafeAreaView style={styles.container}>
      {/* ... (Header code giữ nguyên) ... */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchBox}>
             {/* ... */}
            <TextInput
                style={styles.input}
                placeholder="Tìm kiếm tài liệu..."
                value={keyword}
                onChangeText={setKeyword}
                autoFocus={true} 
            />
            {/* ... */}
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000080" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.documentId.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (Giữ nguyên styles cũ)
  container: { flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? 30 : 0 },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: 10,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  backBtn: { padding: 10 },
  searchBox: {
    flex: 1, flexDirection: 'row', backgroundColor: '#f2f2f2',
    borderRadius: 8, paddingHorizontal: 10, alignItems: 'center',
    height: 40, marginRight: 10,
  },
  input: { flex: 1, fontSize: 16, color: '#333' },
  center: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  listContent: { padding: 15 },
  itemContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 15, borderRadius: 12, marginBottom: 10,
    borderWidth: 1, borderColor: '#f0f0f0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  iconContainer: { marginRight: 15 },
  infoContainer: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  itemDesc: { fontSize: 14, color: '#666', marginBottom: 6 },
  metaContainer: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, color: '#999', marginRight: 5 },

  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

});