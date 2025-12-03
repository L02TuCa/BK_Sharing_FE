import React, { FC } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons'; 

// Định nghĩa kiểu dữ liệu cho một item Recents (Nếu dùng TypeScript)
interface RecentItemProps {
  item: {
    id: string;
    title: string;
    subtitle: string;
    rating: number;
    time: string;
    color: string; // Có thể dùng để thay đổi màu nền nếu muốn
  };
  onViewPress: (item: any) => void; // Thêm hàm xử lý khi nhấn nút Xem ngay
}

const RecentItem: FC<RecentItemProps> = ({ item, onViewPress }) => (
  <View style={styles.recentItem}>
    <View style={styles.recentHeader}>
      {/* Icon Thư mục/Folder */}
      <FontAwesome5 name="folder-open" size={24} color="#6495ED" />
      
      {/* Container Đánh giá */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{item.rating}</Text>
        <Ionicons name="star" size={14} color="#FFD700" style={styles.starIcon} />
      </View>
    </View>
    
    {/* Tiêu đề */}
    <Text style={styles.recentTitle}>{item.title}</Text>

    {/* Chi tiết phụ (Subtitle và Time) */}
    <View style={styles.recentSubtitleRow}>
      <Text style={styles.recentSubtitle}>{item.subtitle}</Text>
      <Text style={styles.recentTime}> • {item.time}</Text>
    </View>

    {/* Khu vực Nút hành động */}
    <View style={styles.recentActions}>
      <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => onViewPress(item)} // Gắn hàm xử lý sự kiện
      >
        <Text style={styles.viewButtonText}>Xem ngay</Text>
      </TouchableOpacity>
      {/* Icon Bookmark */}
      <Feather name="bookmark" size={18} color="#6495ED" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  recentItem: {
    width: 200, // Chiều rộng cố định
    height: 230,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'space-between',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 3,
  },
  starIcon: {
      marginLeft: 2,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  recentSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  recentSubtitle: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  recentTime: {
      fontSize: 12,
      color: '#888',
  },
  recentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#95B3FF', // Màu xanh nhạt cho nút Xem ngay
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#000080',
    fontWeight: '600',
  },
});

export default RecentItem;