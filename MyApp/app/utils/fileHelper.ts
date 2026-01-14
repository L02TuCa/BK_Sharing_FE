// app/utils/fileHelper.ts

import * as FileSystem from 'expo-file-system/legacy'; // Dùng legacy để tương thích SDK 54 như đã sửa
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';

// Hàm phụ trợ để lấy MIME type dựa trên đuôi file
const getMimeType = (fileUri: string): string => {
  const extension = fileUri.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf': return 'application/pdf';
    case 'doc': return 'application/msword';
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xls': return 'application/vnd.ms-excel';
    case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'ppt': return 'application/vnd.ms-powerpoint';
    case 'pptx': return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'txt': return 'text/plain';
    default: return '*/*'; // Mặc định cho mọi loại file
  }
};

// Hàm chính để mở file bằng ứng dụng mặc định của hệ điều hành
export const openFileWithOS = async (fileUri: string) => {
  try {
    // Kiểm tra xem file có tồn tại không trước khi mở
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
        Alert.alert('Lỗi', 'File không tồn tại trên thiết bị.');
        return;
    }

    if (Platform.OS === 'android') {
      // Android cần Content URI thay vì File URI
      const cUri = await FileSystem.getContentUriAsync(fileUri);
      
      const mimeType = getMimeType(fileUri);

      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: cUri,
        flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
        type: mimeType,
      });
    } else {
      // iOS dùng Sharing module để mở preview
      await Sharing.shareAsync(fileUri, {
          UTI: 'public.item' // Uniform Type Identifier cho iOS
      });
    }
  } catch (e) {
    console.error("Không thể mở file:", e);
    Alert.alert(
      'Không thể mở file', 
      'Thiết bị của bạn có thể chưa cài ứng dụng hỗ trợ định dạng này (VD: PDF Viewer, Word, ...).'
    );
  }
};