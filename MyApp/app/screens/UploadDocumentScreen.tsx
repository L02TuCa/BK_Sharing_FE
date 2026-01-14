import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  SafeAreaView, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { uploadDocument } from '../services/documentService'; // Import hàm vừa viết
import { useNotification } from '../context/NotificationContext';

export default function UploadDocumentScreen() {
  const router = useRouter();
  const { addNotification } = useNotification();


  // State quản lý dữ liệu
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // Lấy UserId từ bộ nhớ (User đã đăng nhập)
  useEffect(() => {
    const getUser = async () => {
      const userJson = await AsyncStorage.getItem('userSession');
      if (userJson) {
        const user = JSON.parse(userJson);
        setUserId(user.userId);
      } else {
        Alert.alert("Lỗi", "Bạn chưa đăng nhập!");
        router.back();
      }
    };
    getUser();
  }, []);

  // 1. Hàm chọn file
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Cho phép mọi loại file (PDF, Doc, Image...)
        copyToCacheDirectory: true,
      });

      if (result.canceled === false) {
        // Lưu thông tin file đã chọn
        const asset = result.assets[0];
        setSelectedFile(asset);
      }
    } catch (err) {
      console.log('Lỗi chọn file:', err);
    }
  };

  // 2. Hàm xử lý Upload
  const handleUpload = async () => {
    if (!title || !description || !selectedFile || !userId) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tiêu đề, mô tả và chọn file.");
      return;
    }

    setLoading(true);

    try {
      await uploadDocument({
        fileUri: selectedFile.uri,
        fileName: selectedFile.name,
        fileType: selectedFile.mimeType,
        title: title,
        description: description,
        userId: userId
      });

      addNotification({
        title: 'Tải tài liệu thành công',
        detail: `Bạn đã tải lên tài liệu: "${title}"`,
        iconName: 'cloud-done-outline',
        iconColor: '#008000', // Màu xanh lá
      });

      Alert.alert("Thành công", "Tài liệu đã được tải lên!", [
        { text: "OK", onPress: () => router.back() } // Quay lại màn hình trước
      ]);

    } catch (error: any) {
      Alert.alert("Thất bại", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tải tài liệu lên</Text>
        <View style={{width: 24}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Nhập Tiêu đề */}
        <Text style={styles.label}>Tiêu đề tài liệu</Text>
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: Đề thi Toán GK1"
          value={title}
          onChangeText={setTitle}
        />

        {/* Nhập Mô tả */}
        <Text style={styles.label}>Mô tả chi tiết</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mô tả nội dung tài liệu..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        {/* Khu vực chọn File */}
        <Text style={styles.label}>File đính kèm</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={handlePickFile}>
          {selectedFile ? (
            <View style={styles.fileInfo}>
              <MaterialCommunityIcons name="file-check" size={30} color="#008000" />
              <Text style={styles.fileName}>{selectedFile.name}</Text>
              <Text style={styles.fileSize}>
                {(selectedFile.size / 1024).toFixed(1)} KB
              </Text>
              <Text style={{color: 'blue', marginTop: 5}}>Chọn file khác</Text>
            </View>
          ) : (
            <View style={{alignItems: 'center'}}>
              <Feather name="upload-cloud" size={40} color="#aaa" />
              <Text style={styles.uploadText}>Nhấn để chọn File (PDF, Word...)</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Nút Upload */}
        <TouchableOpacity 
          style={[styles.btnUpload, loading && styles.btnDisabled]} 
          onPress={handleUpload}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.btnText}>Tải lên ngay</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12,
    fontSize: 16, marginBottom: 20, backgroundColor: '#f9f9f9'
  },
  textArea: { height: 100 },
  uploadBox: {
    borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed', borderRadius: 12,
    padding: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 30,
    backgroundColor: '#fdfdfd'
  },
  uploadText: { color: '#888', marginTop: 10 },
  fileInfo: { alignItems: 'center' },
  fileName: { fontSize: 16, fontWeight: 'bold', marginTop: 5, textAlign: 'center' },
  fileSize: { color: '#666', fontSize: 12 },
  btnUpload: {
    backgroundColor: '#000080', padding: 15, borderRadius: 10, alignItems: 'center'
  },
  btnDisabled: { backgroundColor: '#a0a0a0' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});