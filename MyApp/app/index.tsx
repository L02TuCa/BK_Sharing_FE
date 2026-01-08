// app/index.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  // Không cần logic kiểm tra ở đây nữa.
  // AuthContext (đã được bọc ở _layout) sẽ tự động kiểm tra
  // và đẩy người dùng đi nơi khác ngay lập tức.
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#000080" />
    </View>
  );
}