import React, { FC } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

// ✅ ĐỊNH NGHĨA TÊN TAB MỚI
export type SwitchTabName = 'Tài liệu của tôi' | 'Tài liệu đã chia sẻ';

interface CustomSwitchBarProps {
  // Tab đang được chọn (Active)
  activeTab: SwitchTabName; 
  // Hàm xử lý khi nhấn vào tab
  onTabChange: (tabName: SwitchTabName) => void;
}

const CustomSwitchBar: FC<CustomSwitchBarProps> = ({ activeTab, onTabChange }) => {
  
  // Mảng chứa tất cả các tên tab
  const tabNames: SwitchTabName[] = ['Tài liệu của tôi', 'Tài liệu đã chia sẻ'];

  // Hàm render một nút tab
  const renderTabButton = (tabName: SwitchTabName) => {
    const isActive = activeTab === tabName;
    
    return (
      <TouchableOpacity
        key={tabName}
        style={[
          styles.tabButton,
          isActive && styles.activeTabButton
        ]}
        onPress={() => onTabChange(tabName)}
      >
        <Text style={[
          styles.tabText,
          isActive && styles.activeTabText
        ]}>
          {tabName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Render 2 tab mới */}
      {tabNames.map(renderTabButton)} 
    </View>
  );
};
// --- STYLING ---

const PRIMARY_COLOR = '#000080'; // Màu xanh đậm
const INACTIVE_COLOR = '#fff';   // Màu trắng (nền)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: INACTIVE_COLOR,
    borderRadius: 15, // Bo góc cho toàn bộ thanh bar
    borderWidth: 1.5,
    borderColor: '#eee', // Viền mỏng bên ngoài
    overflow: 'hidden', // Quan trọng để bo góc nội dung
    width: '90%', // Chiếm 90% chiều rộng của container cha
    alignSelf: 'center', // Căn giữa
    height: 40,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    // Không cần borderRightWidth cho tab cuối
  },
  activeTabButton: {
    backgroundColor: PRIMARY_COLOR, // Nền màu xanh khi active
    borderRadius: 13, // Bo góc nhỏ hơn một chút để nằm trong container
    margin: 1, // Tạo khoảng cách để hiển thị viền trắng mỏng giữa hai tab
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_COLOR, // Màu text xanh khi inactive
  },
  activeTabText: {
    color: '#fff', // Màu text trắng khi active
  },
});

export default CustomSwitchBar;