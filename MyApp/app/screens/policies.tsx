// app/screens/policies.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function PoliciesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chính sách & Điều khoản</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>1. Chính sách Quyền riêng tư</Text>
        <Text style={styles.body}>Thông tin của bạn được bảo mật tuyệt đối và chỉ được sử dụng để cải thiện trải nghiệm người dùng...</Text>

        <Text style={styles.title}>2. Điều khoản Sử dụng</Text>
        <Text style={styles.body}>Bạn đồng ý không sử dụng ứng dụng này cho bất kỳ mục đích bất hợp pháp nào...</Text>
        
        <Text style={styles.footer}>© 2025 [Tên Ứng dụng của bạn]. Tất cả quyền được bảo lưu.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 5, color: '#000080' },
  body: { fontSize: 16, lineHeight: 24, color: '#333', marginBottom: 10 },
  footer: { fontSize: 14, color: '#999', marginTop: 30, textAlign: 'center' },
});