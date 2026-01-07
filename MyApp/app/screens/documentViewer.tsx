// app/screens/documentViewer.tsx

import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Alert, Platform, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

// ⬇️ QUAN TRỌNG: Sửa dòng import này để tương thích với Expo SDK 54 ⬇️
import * as FileSystem from 'expo-file-system/legacy'; 
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';

// Interface dữ liệu
interface DocumentItem {
  id: string; name: string; type: 'pdf' | 'word' | 'image' | 'video' | 'excel'; size: string; date: string; url: string;
}

export default function DocumentViewerScreen() {
  const router = useRouter();
  const { title } = useLocalSearchParams(); 
  const displayTitle = Array.isArray(title) ? title[0] : title || 'Danh sách tài liệu';
  
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [openingFileId, setOpeningFileId] = useState<string | null>(null);

  useEffect(() => {
    // Mock Data
    setDocuments([
      { 
        id: '1', 
        name: 'sample.pdf', 
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 
        type: 'pdf', 
        size: '15 KB', 
        date: '2024-01-10' 
      },
      { 
        id: '4', 
        name: 'sample_image.jpg', 
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80', 
        type: 'image', 
        size: '1.2 MB', 
        date: '2024-01-15' 
      },
      // Lưu ý: File Word/Excel cần link Direct Download chuẩn thì mới mở được
      // Nếu không có link Word online, bạn có thể test tạm bằng PDF/Image trước
    ]);
  }, []);

  const handleOpenDocument = async (doc: DocumentItem) => {
    setOpeningFileId(doc.id);
    try {
      // 1. Xác định đường dẫn lưu file trên điện thoại
      // Lưu vào documentDirectory để dùng lâu dài, hoặc cacheDirectory nếu muốn tự xóa sau này
      const folder = FileSystem.documentDirectory; 
      if (!folder) throw new Error('Không tìm thấy thư mục lưu trữ');

      // Tạo tên file an toàn (tránh ký tự đặc biệt)
      const fileName = doc.name.replace(/[^a-zA-Z0-9.\-_]/g, '_'); 
      const fileUri = folder + fileName;

      // 2. Kiểm tra xem file đã tải chưa
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      
      if (!fileInfo.exists) {
        // CHƯA CÓ -> Tải từ URL về
        console.log('Đang tải file từ:', doc.url);
        const downloadRes = await FileSystem.downloadAsync(doc.url, fileUri);
        
        if (downloadRes.status !== 200) {
          Alert.alert('Lỗi', 'Không tải được file từ server.');
          return;
        }
      } else {
        console.log('File đã có sẵn, mở ngay.');
      }

      // 3. Mở file (Logic cũ của bạn, đã chuẩn)
      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(fileUri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1,
          type: getMimeType(doc.type), 
        });
      } else {
        // iOS
        await Sharing.shareAsync(fileUri, { 
            UTI: getUTI(doc.type), 
            mimeType: getMimeType(doc.type) 
        });
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể mở file này.');
    } finally {
      setOpeningFileId(null);
    }
  };

  const getMimeType = (type: string) => {
    const map: any = { pdf: 'application/pdf', word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', image: 'image/jpeg' };
    return map[type] || '*/*';
  };
  const getUTI = (type: string) => (type === 'pdf' ? 'com.adobe.pdf' : (type === 'image' ? 'public.image' : undefined));

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <MaterialCommunityIcons name="file-pdf-box" size={40} color="#F40F02" />;
      case 'word': return <MaterialCommunityIcons name="file-word-box" size={40} color="#2B579A" />;
      case 'excel': return <MaterialCommunityIcons name="file-excel-box" size={40} color="#1D6F42" />;
      case 'image': return <MaterialCommunityIcons name="file-image" size={40} color="#008000" />;
      default: return <MaterialCommunityIcons name="file-document-outline" size={40} color="#888" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{displayTitle}</Text>
      </View>
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer} onPress={() => handleOpenDocument(item)} disabled={openingFileId === item.id}>
            <View style={styles.iconBox}>{getFileIcon(item.type)}</View>
            <View style={styles.infoBox}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>{item.size} • {item.date}</Text>
            </View>
            {openingFileId === item.id ? <ActivityIndicator color="#000080" /> : <Feather name="external-link" size={20} color="#ccc" />}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  backButton: { padding: 5, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  listContent: { padding: 15 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 } },
  iconBox: { marginRight: 15 },
  infoBox: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  itemMeta: { fontSize: 12, color: '#888' }
});