// app/(tabs)/_layout.tsx

// import React from 'react';
// import { Tabs } from 'expo-router';
// import BottomNavBar, { BottomTabNames } from '../components/BottomNavBar'; 



// export default function TabLayout() {

//     const mapRouteToTab = (routeName: string): BottomTabNames => {
//         switch (routeName) {
//             case 'home': return 'Folder'; 
//             case 'cloud': return 'Cloud';
//             case 'notifications': return 'Notifications';
//             case 'settings': return 'Settings';
//             default: return 'Folder';
//         }
//     };



//   return (
//     <Tabs 
//         // 1. SỬ DỤNG CUSTOM TAB BAR 
//         tabBar={(props) => { 
//                 const { state, navigation } = props;

//                 // 1.1. Logic xử lý khi nhấn vào các tab khác
//                 const handleTabPress = (tabName: BottomTabNames) => { // ✅ Ép kiểu tabName
//                     // Tìm route tương ứng với tab name
//                     const routeName = state.routes.find((route: any) => mapRouteToTab(route.name) === tabName)?.name;
//                     if (routeName) {
//                         navigation.navigate(routeName as any); // ✅ Ép kiểu cho TypeScript
//                     }
//                 };

//                 // 1.2. Logic xử lý khi nhấn nút Plus (+)
//                 const handleAddPress = () => {
//                     console.log('Add Button Pressed'); // Thay bằng logic thêm file/folder của bạn
//                 };


//                 return (
//                     <BottomNavBar 
//                         // 2. TRUYỀN CÁC PROPS BẮT BUỘC
//                         onAddPress={handleAddPress}
//                         onTabPress={handleTabPress}

//                         // 3. TRUYỀN PROPS activeTab
//                         activeTab={mapRouteToTab(state.routes[state.index].name)} 
//                     />
//                 );
//             }}

//         // 2. CẤU HÌNH CÁC TÙY CHỌN CHUNG (Tùy chọn)
//         screenOptions={{
//             // Ẩn Header mặc định (bạn tự định nghĩa header trong từng màn hình)
//             headerShown: false, 
//         }}
//     >
//       {/* CÁC TUYẾN ĐƯỜNG TAB */}
//       <Tabs.Screen 
//         name="home" // Tên file: home.tsx
//         options={{
//           title: 'Home',
//         }}
//       />

//       {/* Thêm các Tab khác (Nếu bạn muốn có 5 Tab như trong BottomNavBar) */}
//       {/* Ví dụ: Tab Cloud (Tạo app/tabs/cloud.tsx) */}
//       <Tabs.Screen 
//         name="cloud"
//         options={{
//             title: 'Cloud',
//             // Ẩn Tab này khỏi Tab Bar mặc định, vì BottomNavBar đã tự xử lý
//             tabBarButton: () => null, 
//         }}
//       />

//       <Tabs.Screen 
//         name="notifications" // Tên file: notifications.tsx
//         options={{
//             title: 'Thông báo',
//             tabBarButton: () => null, 
//         }}
//       />

//       <Tabs.Screen 
//         name="settings" // Tên file: settings.tsx
//         options={{
//           title: 'Cài đặt',
//         }}
//       />
//     </Tabs>
//   );
// }



// -----------------------------------------------------------------------------------





// app/(tabs)/_layout.tsx (ĐÃ SỬA)

import React, { useState } from 'react'; // ✅ Import useState
import { Tabs } from 'expo-router';
import { Alert } from 'react-native'; // Để dùng Alert trong handleSelectAction
import BottomNavBar, { BottomTabNames } from '../components/BottomNavBar';
// ✅ Import Modal
import AddMenuModal from '../components/AddMenuModal';


export default function TabLayout() {
    // 1. Quản lý trạng thái Modal
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 2. Hàm ánh xạ Route sang Tab Name (giữ nguyên)
    const mapRouteToTab = (routeName: string): BottomTabNames => {
        switch (routeName) {
            case 'home': return 'Home';
            case 'archive': return 'Archive';
            case 'notifications': return 'Notifications';
            case 'settings': return 'Settings';
            default: return 'Home';
        }
    };

    // 3. Hàm xử lý hành động từ Modal
    const handleSelectAction = (action: 'file' | 'folder' | 'capture') => {
        setIsModalVisible(false); // Đóng modal
        switch (action) {
            case 'file':
                Alert.alert('Tạo File', 'Mở giao diện chọn file.');
                break;
            case 'folder':
                Alert.alert('Tạo Thư mục', 'Mở giao diện nhập tên thư mục.');
                break;
            case 'capture':
                Alert.alert('Chụp/Quét', 'Mở camera.');
                break;
        }
    };


    return (
        <>
            <Tabs
                tabBar={(props) => {
                    const { state, navigation } = props;
                    const handleTabPress = (tabName: BottomTabNames) => {
                        const routeName = state.routes.find((route: any) => mapRouteToTab(route.name) === tabName)?.name;
                        if (routeName) {
                            navigation.navigate(routeName as any);
                        }
                    };
                    const handleAddPress = () => {
                        setIsModalVisible(true);
                    };
                    return (
                        <BottomNavBar
                            onAddPress={handleAddPress}
                            onTabPress={handleTabPress}
                            activeTab={mapRouteToTab(state.routes[state.index].name)}
                        />
                    );
                }}
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tabs.Screen name="home" options={{ title: 'Home' }} />
                <Tabs.Screen name="archive" options={{ title: 'Archive', tabBarButton: () => null }} />
                <Tabs.Screen name="notifications" options={{ title: 'Thông báo', tabBarButton: () => null }} />
                <Tabs.Screen name="settings" options={{ title: 'Cài đặt' }} />
                <Tabs.Screen name="test" options={{ title: 'Test' }} />
            </Tabs>
            <AddMenuModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSelectAction={handleSelectAction}
            />
        </>
    );
}