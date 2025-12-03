import React, { FC } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons'; 

// Định nghĩa kiểu dữ liệu cho Item
interface FolderItemProps {
  // Dữ liệu của item
  item: {
    id: string;
    title: string;
    subtitle: string;
    type: 'folder' | 'file'; // Xác định loại để chọn icon
    color: string; // Màu sắc nổi bật của icon (Vàng cho folder, Xanh cho file,...)
  };
  onPress: (item: any) => void; // Xử lý khi nhấn vào item
  onMenuPress: (item: any) => void; // Xử lý khi nhấn nút 3 chấm (Menu)
}

const FolderListItem: FC<FolderItemProps> = ({ item, onPress, onMenuPress }) => {
  
  // Chọn icon dựa trên loại item
  const iconName = item.type === 'folder' ? 'folder' : 'document-text';
  const iconColor = item.color;
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(item)} // Gọi hàm onPress với dữ liệu item
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        
        {/* Icon Folder/File */}
        <Ionicons 
          name={iconName as any} 
          size={24} 
          color={iconColor} 
          style={styles.itemIcon}
        />

        {/* Tiêu đề và Phụ đề */}
        <View style={styles.textGroup}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>
      </View>

      {/* Nút Menu (3 chấm dọc) */}
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => onMenuPress(item)} // Gọi hàm onMenuPress
      >
        <Feather name="more-vertical" size={20} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// --- STYLING ---
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    
    // Shadow nhẹ cho hiệu ứng nổi bật (tùy chọn)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Chiếm hết không gian còn lại
  },
  itemIcon: {
    marginRight: 15,
    minWidth: 24, // Đảm bảo icon có kích thước cố định
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  menuButton: {
    paddingLeft: 10, // Tạo không gian chạm dễ hơn
  },
});

export default FolderListItem;