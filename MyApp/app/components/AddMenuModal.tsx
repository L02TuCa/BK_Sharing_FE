// app/components/AddMenuModal.tsx

import React, { FC } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback 
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; // <--- 1. Import Router

// Định nghĩa kiểu dữ liệu cho một tùy chọn
interface AddOption {
  iconName: keyof typeof Ionicons.glyphMap | keyof typeof Feather.glyphMap;
  label: string;
  isFeather: boolean;
  action: 'file' | 'folder' | 'capture'; 
}

// Dữ liệu giả định
const OPTIONS: AddOption[] = [
  { iconName: 'document-outline', label: 'Thêm file mới', isFeather: false, action: 'file' },
  { iconName: 'folder-outline', label: 'Thêm thư mục mới', isFeather: false, action: 'folder' },
  { iconName: 'camera-outline', label: 'Chụp/Quét tài liệu', isFeather: false, action: 'capture' },
];

interface AddMenuModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectAction: (action: 'file' | 'folder' | 'capture') => void;
}

const AddMenuModal: FC<AddMenuModalProps> = ({ isVisible, onClose, onSelectAction }) => {
  const router = useRouter(); // <--- 2. Khởi tạo router

  // --- 3. Hàm xử lý logic khi chọn ---
  const handleOptionPress = (action: 'file' | 'folder' | 'capture') => {
    // Luôn đóng modal trước khi thực hiện hành động
    onClose();

    if (action === 'file') {
      // Chuyển hướng đến màn hình Upload
      // Đảm bảo đường dẫn này khớp với tên file bạn đã tạo ở bước trước
      router.push('/screens/UploadDocumentScreen'); 
    } else {
      // Các hành động khác (Folder/Capture) trả về cho Parent xử lý (nếu cần)
      onSelectAction(action);
    }
  };

  const renderOption = (option: AddOption) => {
    const IconComponent = option.isFeather ? Feather : Ionicons;

    return (
      <TouchableOpacity 
        key={option.label}
        style={styles.optionButton}
        // Gọi hàm xử lý mới thay vì gọi trực tiếp onSelectAction
        onPress={() => handleOptionPress(option.action)} 
        activeOpacity={0.7}
      >
        <View style={styles.iconWrapper}>
          <IconComponent name={option.iconName as any} size={24} color="#000080" />
        </View>
        <Text style={styles.optionLabel}>{option.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              
              <Text style={styles.menuTitle}>Tạo mới</Text>

              <View style={styles.optionsList}>
                {OPTIONS.map(renderOption)}
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// --- STYLING (Giữ nguyên như cũ) ---
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionsList: {},
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f8f8ff',
    paddingHorizontal: 15,
  },
  iconWrapper: {
    marginRight: 15,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

export default AddMenuModal;