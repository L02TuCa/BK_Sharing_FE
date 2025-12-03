// import React, { FC } from 'react';
// import { StyleSheet, View, TouchableOpacity } from 'react-native';
// import { Feather } from '@expo/vector-icons'; 

// import {
//     UploadCloudIcon,
//     NotiIcon,
//     FolderIcon,
//     SettingsGearIcon
// } from './Icons';


// const PRIMARY_COLOR = '#000080'; // Màu xanh đậm cho nút cộng
// const INACTIVE_COLOR = 'rgba(26,26,26,0.4)'; // Màu xám mờ cho icon không hoạt động
// export type BottomTabNames = 'Home' | 'Archive' | 'Notifications' | 'Settings';

// // Kiểu dữ liệu cho Props
// interface BottomNavBarProps {
//   // Thêm một prop để xác định tab đang hoạt động (active tab) nếu cần
//   activeTab?: BottomTabNames;
//   onAddPress: () => void; // Hàm xử lý khi nhấn nút Plus (+)
//   onTabPress: (tabName: BottomTabNames) => void; // Hàm xử lý khi nhấn các tab khác
// }

// const BottomNavBar: FC<BottomNavBarProps> = ({ activeTab, onAddPress, onTabPress }) => {
//   return (
//     <View style={styles.navBar}>
        
//         {/* Tab 1: Home */}
//         <TouchableOpacity onPress={() => onTabPress('Home')}>
//             <Feather name="home" size={24} 
            
//             color={activeTab === 'Home' ? PRIMARY_COLOR : INACTIVE_COLOR}
//             />
//         </TouchableOpacity>
        
//         {/* Tab 2: Archive (Upload) */}
//         <TouchableOpacity onPress={() => onTabPress('Archive')}>
//             <Feather name="archive" 
//                 size={24} 
//                 color={activeTab === 'Archive' ? PRIMARY_COLOR : INACTIVE_COLOR}
//             />
//         </TouchableOpacity>
        
//         {/* Nút Cộng (+) chính giữa */}
//         <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
//           <Feather name="plus" size={30} color="#fff" />
//           {/* LƯU Ý: Nếu muốn dùng SVG cho nút +, bạn cũng phải tạo SVG component cho dấu + */}
//         </TouchableOpacity>

//         {/* Tab 3: Notifications */}
//         <TouchableOpacity onPress={() => onTabPress('Notifications')}>
//             <Feather name="bell" size={24} color={activeTab === 'Notifications' ? PRIMARY_COLOR : INACTIVE_COLOR}/>
//         </TouchableOpacity>

//         {/* Tab 4: Settings */}
//         <TouchableOpacity onPress={() => onTabPress('Settings')}>
//             <SettingsGearIcon 
//                 size={25} 
//                 color={activeTab === 'Settings' ? PRIMARY_COLOR : INACTIVE_COLOR}
//             />
//         </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   navBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     height: 70, // Tăng nhẹ chiều cao
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//     paddingHorizontal: 10,
//     // Đặt cố định ở dưới cùng
//     position: 'absolute', 
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   addButton: {
//     backgroundColor: '#000080', // Màu xanh đậm
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: -40, // Đẩy nút lên trên để nổi bật
//     shadowColor: '#000080',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 10,
//   },
// });

// export default BottomNavBar;










import React, { FC, ReactNode } from 'react'; // ✅ Thêm ReactNode
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'; // ✅ Thêm Text
import { Feather } from '@expo/vector-icons'; 
// import {
//     UploadCloudIcon,
//     NotiIcon,
//     FolderIcon,
//     SettingsGearIcon
// } from './Icons'; // Đảm bảo các Icon này nhận props 'color'

const PRIMARY_COLOR = '#000080';
const INACTIVE_COLOR = 'rgba(26,26,26,0.4)';

export type BottomTabNames = 'Home' | 'Archive' | 'Notifications' | 'Settings'; 

interface BottomNavBarProps {
  activeTab?: BottomTabNames; 
  onAddPress: () => void;
  onTabPress: (tabName: BottomTabNames) => void;
}

// ✅ COMPONENT MỚI: Bọc Icon và Đường gạch
interface TabIconWrapperProps {
    isActive: boolean;
    children: ReactNode; // Icon được truyền vào
}

const TabIconWrapper: FC<TabIconWrapperProps> = ({ isActive, children }) => (
    <View style={styles.tabIconWrapper}>
        <View style={[
            styles.activeIndicator,
            isActive ? styles.activeIndicatorVisible : styles.activeIndicatorHidden
        ]} />
        <Text>{children}</Text>
    </View>
);

const BottomNavBar: FC<BottomNavBarProps> = ({ activeTab, onAddPress, onTabPress }) => {
  return ( false ? <></> :
    <View style={styles.navBar}>
        <TouchableOpacity onPress={() => onTabPress('Home')} style={styles.tabButton}>
            <TabIconWrapper isActive={activeTab === 'Home'}>
                <Feather 
                    name="home" 
                    size={24} 
                    color={activeTab === 'Home' ? PRIMARY_COLOR : INACTIVE_COLOR} 
                />
            </TabIconWrapper>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onTabPress('Archive')} style={styles.tabButton}>
            <TabIconWrapper isActive={activeTab === 'Archive'}>
                <Feather
                    name='archive' 
                    size={24} 
                    color={activeTab === 'Archive' ? PRIMARY_COLOR : INACTIVE_COLOR}
                />
            </TabIconWrapper>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
            <Feather name="plus" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onTabPress('Notifications')} style={styles.tabButton}>
            <TabIconWrapper isActive={activeTab === 'Notifications'}>
                <Feather
                    name='bell' 
                    size={24} 
                    color={activeTab === 'Notifications' ? PRIMARY_COLOR : INACTIVE_COLOR}
                />
            </TabIconWrapper>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onTabPress('Settings')} style={styles.tabButton}> 
            <TabIconWrapper isActive={activeTab === 'Settings'}>
                <Feather
                    name='settings' 
                    size={24} 
                    color={activeTab === 'Settings' ? PRIMARY_COLOR : INACTIVE_COLOR}
                />
            </TabIconWrapper>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 65,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  
  // ✅ STYLES MỚI CHO TAB ICON VÀ INDICATOR
  tabButton: {
      flex: 1, // Đảm bảo các tab có cùng chiều rộng
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%', // Chiếm hết chiều cao của navBar
  },
  tabIconWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative', // Để activeIndicator có thể định vị tương đối
      height: '100%',
      width: '100%',
  },
  activeIndicator: {
      position: 'absolute',
      top: 0, // Nằm ở trên cùng của wrapper
      width: 40, // Chiều rộng của gạch
      height: 3, // Độ dày của gạch
      backgroundColor: PRIMARY_COLOR,
      borderRadius: 1.5,
  },
  activeIndicatorVisible: {
      opacity: 1, // Hiển thị
  },
  activeIndicatorHidden: {
      opacity: 0, // Ẩn
  },

  addButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Nổi lên trên một chút
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});

export default BottomNavBar;