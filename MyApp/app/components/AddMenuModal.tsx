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

// Định nghĩa kiểu dữ liệu cho một tùy chọn
interface AddOption {
  iconName: keyof typeof Ionicons.glyphMap | keyof typeof Feather.glyphMap;
  label: string;
  isFeather: boolean; // Để xác định icon thuộc thư viện nào
  action: 'file' | 'folder' | 'capture'; // Loại hành động
}

// Dữ liệu giả định cho các tùy chọn
const OPTIONS: AddOption[] = [
  { iconName: 'document-outline', label: 'Thêm file mới', isFeather: false, action: 'file' },
  { iconName: 'folder-outline', label: 'Thêm thư mục mới', isFeather: false, action: 'folder' },
  { iconName: 'camera-outline', label: 'Chụp/Quét tài liệu', isFeather: false, action: 'capture' },
];

// Định nghĩa Props cho Modal
interface AddMenuModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectAction: (action: 'file' | 'folder' | 'capture') => void;
}

const AddMenuModal: FC<AddMenuModalProps> = ({ isVisible, onClose, onSelectAction }) => {
  
  // Hàm render từng nút tùy chọn

  const renderOption = (option: AddOption) => {
    // Chọn thư viện Icon dựa trên prop 'isFeather'
    const IconComponent = option.isFeather ? Feather : Ionicons;

    return (
      <TouchableOpacity 
        key={option.label}
        style={styles.optionButton}
        onPress={() => onSelectAction(option.action)}
        activeOpacity={0.7}
      >
        <View style={styles.iconWrapper}>
          <IconComponent name={option.iconName as any} size={24} color="#000080" />
        </View>
        <Text style={styles.optionLabel}>{option.label}</Text>
      </TouchableOpacity> // ✅ Đảm bảo chỉ có </TouchableOpacity> ở đây, không có </View>
    );
  };
  return (
    <Modal
      animationType="fade" // Hiệu ứng mờ nền
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      {/* Nền mờ, nhấn vào đóng modal */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Menu chính, ngăn không cho sự kiện nhấn lan ra nền */}
          <TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              
              {/* Tiêu đề */}
              <Text style={styles.menuTitle}>Tạo mới</Text>

              {/* Danh sách các tùy chọn */}
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

// --- STYLING ---

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end', // Đẩy nội dung xuống dưới cùng
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Hiệu ứng nền mờ
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40, // Khoảng trống dưới cùng
    // Shadow cho menu (tùy chọn)
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
  optionsList: {
    // Không cần style đặc biệt, các nút tự xếp chồng
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f8f8ff', // Màu nền nhẹ cho nút
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