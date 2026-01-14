import { Stack } from "expo-router";
import { ThemeProvider } from './context/ThemeContext'; 
import { AuthProvider, useAuth } from './context/AuthContext'; 
import { NotificationProvider } from './context/NotificationContext';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

// Component con để kiểm tra loading
function RootLayoutContent() {
  const { isLoading } = useAuth();

  // 1. Nếu đang tải (Load Storage), hiện màn hình chờ trắng hoặc xoay vòng
  // Điều này ngăn chặn App hiển thị sai màn hình trước khi biết user là ai
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  // 2. Khi tải xong, hiển thị Stack điều hướng
  // AuthContext bên trong sẽ tự động điều hướng (replace) nếu cần
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="details/[id]" />
      <Stack.Screen name="index" /> 
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider> 
          <RootLayoutContent />
        </ThemeProvider>
      </NotificationProvider>
      
    </AuthProvider>
  );
}