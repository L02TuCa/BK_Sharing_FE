import { Stack, Redirect } from "expo-router";
import { ThemeProvider } from './context/ThemeContext'; 
// Đảm bảo import useAuth và AuthProvider từ đúng file AuthContext của bạn
import { AuthProvider, useAuth } from './context/AuthContext'; 
import React from 'react';

// --- Component BỌC Logic Điều hướng ---
function RootLayoutContent() {
  // Lấy trạng thái từ AuthContext
  const { isLoggedIn, isLoading, hasOnboarded } = useAuth();

  // 1. Hiển thị màn hình chờ trong khi tải trạng thái ban đầu
  if (isLoading) {
    return null; // Hoặc hiển thị <SplashScreen />
  }

  // 2. Kiểm tra Onboarding 
  if (!hasOnboarded) {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />
            {/* ✅ FIX: Dùng Object Path để tránh lỗi TypeScript 2322 */}
            <Redirect href={{ pathname: '/onboarding' }} /> 
        </Stack>
    );
  }

  // 3. Kiểm tra Đăng nhập (Logic chính cho Đăng xuất)
  if (!isLoggedIn) {
    // Nếu KHÔNG đăng nhập, CHỈ cho phép truy cập các màn hình Auth
    return (
      <Stack screenOptions={{ headerShown: false }}>
        {/* Màn hình đăng nhập/đăng ký */}
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" /> 
        {/* ✅ FIX: Dùng Object Path để tránh lỗi TypeScript 2322 */}
        {/* Khi isLoggedIn = false, nó sẽ chuyển hướng về /login */}
        <Redirect href={{ pathname: '/login' }} /> 
      </Stack>
    );
  }

  // 4. Đã Đăng nhập (isLoggedIn = true) & Đã Onboarded
  // Cho phép truy cập hệ thống Tabs và các màn hình khác
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Hiển thị Tabs (Đường dẫn chính) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* ⚠️ QUAN TRỌNG: Vẫn khai báo các route auth/onboarding để đảm bảo chúng không bị lỗi không tìm thấy */}
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </Stack>
  );
}


// --- Root Layout Chính ---
export default function RootLayout() {
  return (
    // Bọc toàn bộ ứng dụng bằng AuthProvider để RootLayoutContent có thể sử dụng useAuth
    <AuthProvider>
      <ThemeProvider> 
        <RootLayoutContent /> {/* Gọi component có logic điều hướng */}
      </ThemeProvider>
    </AuthProvider>
  );
}