// app/components/NotificationItem.tsx

import React, { FC } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Định nghĩa kiểu dữ liệu cho một thông báo
interface Notification {
    id: string;
    iconName: keyof typeof Ionicons.glyphMap; // Tên icon từ Ionicons
    iconColor: string;
    title: string;
    detail: string;
    time: string;
    isRead: boolean;
}

interface NotificationItemProps {
    notification: Notification;
    onPress: (id: string) => void;
}

const NotificationItem: FC<NotificationItemProps> = ({ notification, onPress }) => {
    return (
        <TouchableOpacity 
            style={styles.container} 
            onPress={() => onPress(notification.id)}
            activeOpacity={0.8}
        >
            <View style={styles.iconWrapper}>
                <Ionicons 
                    name={notification.iconName} 
                    size={24} 
                    color={notification.iconColor} 
                />
            </View>

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={1}>{notification.title}</Text>
                    <Text style={styles.timeText}>{notification.time}</Text>
                </View>
                <Text style={styles.detailText} numberOfLines={2}>{notification.detail}</Text>
            </View>

            {/* Chấm tròn thể hiện thông báo chưa đọc */}
            {!notification.isRead && (
                <View style={styles.unreadDot} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e6f0ff', // Màu nền nhẹ cho icon
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    content: {
        flex: 1,
        marginRight: 10,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
        flexShrink: 1, // Cho phép tiêu đề co lại
        marginRight: 10,
    },
    timeText: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '500',
    },
    detailText: {
        fontSize: 14,
        color: '#4A4A4A',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#000080', // Màu xanh đậm
        marginLeft: 10,
    },
});

export default NotificationItem;