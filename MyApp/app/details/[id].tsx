// app/details/[id].tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ItemDetailScreen() {
  const router = useRouter();
  // Lấy params (id, title, type) từ URL
  const { id, title, type } = useLocalSearchParams(); 

  // Nếu không có title, sử dụng tên mặc định
  const itemTitle = Array.isArray(title) ? title[0] : title || 'Item Chi Tiết';
  const itemType = Array.isArray(type) ? type[0] : type || 'unknown';

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header tùy chỉnh */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{itemTitle}</Text>
      </View>

      {/* Nội dung */}
      <View style={styles.content}>
        <Text style={styles.detailText}>ID: {id}</Text>
        <Text style={styles.detailText}>Loại: {itemType}</Text>
        <Text style={styles.description}>
          Đây là màn hình chi tiết cho {itemType} "{itemTitle}". 
          Tại đây bạn sẽ hiển thị danh sách các file bên trong folder (nếu là folder), 
          hoặc nội dung file (nếu là file).
        </Text>
      </View>
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
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    padding: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginTop: 20,
    lineHeight: 20,
    color: '#555',
  }
});