// import React, { FC, ReactNode } from 'react';
// import { StyleSheet, View, TouchableOpacity } from 'react-native'; // Không dùng Text, tránh gây lỗi nếu không cần
// import { Feather } from '@expo/vector-icons'; 

// import {
//     UploadCloudIcon,
//     NotiIcon,
//     FolderIcon,
//     SettingsGearIcon
// } from './Icons'; 

// const PRIMARY_COLOR = '#000080'; // Màu xanh đậm
// const INACTIVE_COLOR = 'rgba(26,26,26,0.4)'; // Màu xám mờ

// // Thêm 'Home' vào kiểu dữ liệu
// export type BottomTabNames = 'Home' | 'Folder' | 'Cloud' | 'Notifications' | 'Settings'; 

// // Kiểu dữ liệu cho Props
// interface BottomNavBarProps {
//   activeTab?: BottomTabNames; 
//   onAddPress: () => void;
//   onTabPress: (tabName: BottomTabNames) => void;
// }

// // ✅ COMPONENT MỚI: Bọc Icon và Đường gạch
// interface TabIconWrapperProps {
//     isActive: boolean;
//     children: ReactNode; // Icon được truyền vào
// }

// const TabIconWrapper: FC<TabIconWrapperProps> = ({ isActive, children }) => (
//     <View style={styles.tabIconWrapper}>
//         {/* Đường gạch màu xanh (Indicator) */}
//         <View style={[
//             styles.activeIndicator,
//             // Ẩn/Hiện đường gạch bằng opacity
//             isActive ? styles.activeIndicatorVisible : styles.activeIndicatorHidden
//         ]} />
//         {children}
//     </View>
// );

// const BottomNavBar: FC<BottomNavBarProps> = ({ activeTab, onAddPress, onTabPress }) => {
//   return (
//     <View style={styles.navBar}>
        
//         {/* Tab 1: Home */}
//         <TouchableOpacity onPress={() => onTabPress('Home')} style={styles.tabButton}>
//             <TabIconWrapper isActive={activeTab === 'Home'}>
//                 <Feather 
//                     name="home" 
//                     size={30} 
//                     // ✅ Dùng logic màu động
//                     color={activeTab === 'Home' ? PRIMARY_COLOR : INACTIVE_COLOR} 
//                 />
//             </TabIconWrapper>
//         </TouchableOpacity>

//         {/* Tab 2: Folder (Archive/File) */}
//         <TouchableOpacity onPress={() => onTabPress('Folder')} style={styles.tabButton}>
//             <TabIconWrapper isActive={activeTab === 'Folder'}>
//                 <FolderIcon 
//                     size={30} 
//                     color={activeTab === 'Folder' ? PRIMARY_COLOR : INACTIVE_COLOR}
//                 />
//             </TabIconWrapper>
//         </TouchableOpacity>
        
//         {/* Nút Cộng (+) */}
//         <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
//             <Feather name="plus" size={30} color="#fff" />
//         </TouchableOpacity>

//         {/* Tab 3: Notifications */}
//         <TouchableOpacity onPress={() => onTabPress('Notifications')} style={styles.tabButton}>
//             <TabIconWrapper isActive={activeTab === 'Notifications'}>
//                 <NotiIcon 
//                     size={30} 
//                     color={activeTab === 'Notifications' ? PRIMARY_COLOR : INACTIVE_COLOR}
//                 />
//             </TabIconWrapper>
//         </TouchableOpacity>

//         {/* Tab 4: Settings */}
//         <TouchableOpacity onPress={() => onTabPress('Settings')} style={styles.tabButton}>
//             <TabIconWrapper isActive={activeTab === 'Settings'}>
//                 <SettingsGearIcon 
//                     size={30} 
//                     color={activeTab === 'Settings' ? PRIMARY_COLOR : INACTIVE_COLOR}
//                 />
//             </TabIconWrapper>
//         </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   navBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     height: 65,
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     elevation: 5,
//   },
  
//   // ✅ STYLES MỚI CHO TAB ICON VÀ INDICATOR
//   tabButton: {
//       flex: 1, 
//       alignItems: 'center',
//       justifyContent: 'center',
//       height: '100%', 
//   },
//   tabIconWrapper: {
//       alignItems: 'center',
//       justifyContent: 'center',
//       position: 'relative', 
//       height: '100%',
//       width: '100%',
//   },
//   activeIndicator: {
//       position: 'absolute',
//       top: 0, // Đặt ở trên cùng
//       width: 40, 
//       height: 3, 
//       backgroundColor: PRIMARY_COLOR,
//       borderRadius: 1.5,
//   },
//   activeIndicatorVisible: {
//       opacity: 1, 
//   },
//   activeIndicatorHidden: {
//       opacity: 0, 
//   },

//   addButton: {
//     width: 55,
//     height: 55,
//     borderRadius: 27.5,
//     backgroundColor: PRIMARY_COLOR,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20, 
//     shadowColor: PRIMARY_COLOR,
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 8,
//   },
// });

// export default BottomNavBar;