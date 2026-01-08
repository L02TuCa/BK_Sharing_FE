import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView, // Giúp bàn phím không che input
  Platform
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import thư viện lưu trữ

import { useAuth } from '../context/AuthContext'; // ✅ Import Hook
// Import hàm gọi API
import { loginUser } from '../services/authService'; 
// import { useAuth } from '../context/AuthContext'; // Tạm thời ẩn nếu chưa config Context xong

const LoginScreen = () => {
  const router = useRouter(); 
  const { login } = useAuth(); 

  const [account, setAccount] = useState(''); // Đây là email hoặc username
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // --- HÀM XỬ LÝ ĐĂNG NHẬP ---
  const handleLogin = async () => {
    if (!account.trim() || !password.trim()) {
      Alert.alert('Lỗi đăng nhập', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Gọi API lấy dữ liệu
      const userData = await loginUser(account, password);

      // 2. Báo cho Context biết là đã login
      // Hàm này sẽ tự lưu Storage và Context sẽ tự redirect sang Home
      await login(userData); 
      
      Alert.alert("Thành công", `Chào mừng ${userData.fullName}!`);
      // KHÔNG CẦN GỌI router.replace('/home') NỮA
      // Context sẽ tự làm việc đó nhờ useEffect

    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error);
      Alert.alert('Đăng nhập thất bại', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoAccountPress = () => {
    // Chuyển sang màn hình đăng ký
    // Đảm bảo đường dẫn này đúng với file RegisterScreen của bạn
    router.push('/auth/signup'); 
  };

  const handleGuestLogin = () => {
      Alert.alert('Chế độ Guest', 'Chức năng đang phát triển.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* KeyboardAvoidingView giúp đẩy giao diện lên khi bàn phím hiện ra */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{flex: 1}}
      >
        <View style={styles.contentContainer}> 
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Đăng nhập</Text>
            <Text style={styles.subtitle}>Chào mừng bạn trở lại !</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Input Tài khoản */}
            <TextInput
              style={[styles.input, styles.inputAccount]}
              placeholder="Email hoặc Username"
              placeholderTextColor="#a0a0a0"
              value={account}
              onChangeText={setAccount}
              autoCapitalize="none"
            />

            {/* Input Mật khẩu */}
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInputInner} // Style riêng cho input bên trong
                placeholder="Mật khẩu"
                placeholderTextColor="#a0a0a0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity 
                  style={styles.passwordToggle} 
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                  <Ionicons 
                      name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                      size={24} 
                      color="#999" 
                  />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          {/* Nút Đăng nhập */}
          <View style={{ alignItems: 'center' }}> 
            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleNoAccountPress}>
              <Text style={styles.noAccountText}>Bạn chưa có tài khoản ?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin}>
              <Text style={styles.guestButtonText}>GUEST</Text>
            </TouchableOpacity>

            <View style={{marginBottom: 15}}>
                 <Text style={styles.continueWithText}>Or continue with</Text>
            </View>

            <TouchableOpacity style={styles.socialIcon}>
              <Feather name="user" size={30} color="#000" />
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Styling ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  contentContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000080',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#000',
  },
  form: {
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f5f7ff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#f5f7ff',
    width: '95%', // Thống nhất chiều rộng
  },
  inputAccount: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#000080',
    marginBottom: 15,
  },
  // Style cho Container chứa Input Password + Icon Mắt
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f5f7ff', 
    borderWidth: 1,
    borderColor: '#f5f7ff',
    width: '95%', // Thống nhất chiều rộng
  },
  // Style cho TextInput nằm bên trong
  passwordInputInner: {
    flex: 1, // Chiếm hết khoảng trống còn lại trừ icon
    height: '100%',
    fontSize: 16,
    color: '#000',
  },
  passwordToggle: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    width: '90%',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#000080',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#000080',
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000080',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    width: '95%',
  },
  loginButtonDisabled: {
    backgroundColor: '#a0a0a0', // Màu xám khi loading
    elevation: 0,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
  },
  noAccountText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
  },
  guestButton: {
    backgroundColor: '#f5f5f5',
    height: 50,
    width: '50%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  guestButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueWithText: {
    fontSize: 14,
    color: '#000080',
    marginBottom: 15,
  },
  socialIcon: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
});

export default LoginScreen;