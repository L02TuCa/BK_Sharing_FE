import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView, 
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Đảm bảo đường dẫn import đúng file service bạn vừa tạo
import { registerUser } from '../services/authService'; 

const RegisterScreen = () => {
  const router = useRouter(); 
  
  // 1. Khai báo State để lưu dữ liệu
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleHasAccountPress = () => {
    router.replace('/'); // Hoặc '/login' tùy route của bạn
  };

  // 2. Hàm xử lý Đăng ký
  const handleRegister = async () => {
    // Validate cơ bản
    if (!fullName || !username || !email || !password || !confirmPassword) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);

    try {
      // Chuẩn bị dữ liệu gửi lên Server
      const payload = {
        fullName: fullName,
        username: username,
        email: email,
        password: password,
        // Các trường mặc định API yêu cầu
        role: "STUDENT",
        isActive: true,
        profilePicture: "https://ui-avatars.com/api/?name=" + fullName // Tạo ảnh đại diện tạm theo tên
      };

      // Gọi API
      const response = await registerUser(payload);

      if (response.success) {
        Alert.alert(
          "Thành công", 
          "Tài khoản đã được tạo! Vui lòng đăng nhập.",
          [{ text: "OK", onPress: () => router.replace('/') }]
        );
      }

    } catch (error: any) {
      Alert.alert("Đăng ký thất bại", error.message || "Lỗi kết nối Server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* KeyboardAvoidingView giúp bàn phím không che mất input */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          
          {/* Tiêu đề */}
          <View style={styles.header}>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>Tạo tài khoản và tham gia cộng đồng cùng chúng tôi!</Text>
          </View>

          {/* Form Đăng ký */}
          <View style={styles.form}>
            {/* THÊM: Full Name */}
            <TextInput
              style={styles.input}
              placeholder="Họ và tên (Full Name)"
              placeholderTextColor="#a0a0a0"
              value={fullName}
              onChangeText={setFullName}
            />

            {/* THÊM: Username */}
            <TextInput
              style={styles.input}
              placeholder="Tên đăng nhập (Username)"
              placeholderTextColor="#a0a0a0"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={[styles.input, styles.inputEmail]} // Giữ style cũ của bạn
              placeholder="Email"
              placeholderTextColor="#a0a0a0"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              placeholderTextColor="#a0a0a0"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu"
              placeholderTextColor="#a0a0a0"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Nút Đăng ký */}
          <View style={{ alignItems: 'center' }}> 
            <TouchableOpacity 
              style={[styles.registerButton, loading && styles.disabledButton]} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                 <ActivityIndicator color="#fff" />
              ) : (
                 <Text style={styles.registerButtonText}>Đăng ký</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Khu vực Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleHasAccountPress}>
              <Text style={styles.hasAccountText}>Bạn đã có tài khoản?</Text>
            </TouchableOpacity>
            
            <View style={{marginBottom: 15}}>
                <Text style={styles.continueWithText}>Or continue with</Text>
            </View>

            <TouchableOpacity style={styles.socialIcon}>
              <Feather name="user" size={30} color="#000" />
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Styling ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20, // Giảm top chút vì có ScrollView
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 30,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000080',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
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
    width: '100%', // Sửa thành 100% để căn đều đẹp hơn trong padding cha
  },
  inputEmail: {
    backgroundColor: '#fff', 
    borderWidth: 1.5,
    borderColor: '#000080',
  },
  registerButton: {
    backgroundColor: '#000080',
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000080',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#a0a0a0', // Màu xám khi đang loading
    elevation: 0,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  hasAccountText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
    textDecorationLine: 'underline', // Thêm gạch chân cho dễ nhận biết là link
  },
  continueWithText: {
    fontSize: 14,
    color: '#000080',
  },
  socialIcon: {
    padding: 10,
    borderRadius: 20, 
    backgroundColor: '#f0f0f0', 
  },
});

export default RegisterScreen;