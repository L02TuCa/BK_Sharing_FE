import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RatingModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
    loading?: boolean;
    documentTitle?: string;
}

export default function RatingModal({ visible, onClose, onSubmit, loading, documentTitle }: RatingModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (rating > 0) {
            onSubmit(rating, comment);
            setRating(0);
            setComment('');
        }
    };

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Đánh giá tài liệu</Text>
                    {documentTitle && <Text style={styles.subTitle} numberOfLines={1}>{documentTitle}</Text>}
                    
                    {/* Hàng Sao */}
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                <Ionicons 
                                    name={star <= rating ? "star" : "star-outline"} 
                                    size={36} 
                                    color="#FFC107"
                                    style={{ marginHorizontal: 5 }}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.ratingText}>{rating > 0 ? `${rating}/5 Sao` : 'Chạm để đánh giá'}</Text>

                    <TextInput 
                        style={styles.input}
                        placeholder="Viết cảm nhận của bạn..."
                        multiline
                        numberOfLines={3}
                        value={comment}
                        onChangeText={setComment}
                    />

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
                            <Text style={styles.btnTextCancel}>Đóng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.btnSubmit, { opacity: rating === 0 ? 0.5 : 1 }]} 
                            onPress={handleSubmit}
                            disabled={rating === 0 || loading}
                        >
                            {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnTextSubmit}>Gửi</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    container: { backgroundColor: '#fff', borderRadius: 15, padding: 20, alignItems: 'center' },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    subTitle: { fontSize: 14, color: '#666', marginBottom: 20 },
    starsRow: { flexDirection: 'row', marginBottom: 10 },
    ratingText: { fontSize: 14, color: '#666', marginBottom: 15 },
    input: { 
        width: '100%', borderWidth: 1, borderColor: '#eee', borderRadius: 8, 
        padding: 10, height: 80, textAlignVertical: 'top', marginBottom: 20, backgroundColor: '#f9f9f9'
    },
    buttonRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
    btnCancel: { flex: 1, padding: 12, alignItems: 'center', marginRight: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
    btnSubmit: { flex: 1, padding: 12, alignItems: 'center', marginLeft: 10, backgroundColor: '#000080', borderRadius: 8 },
    btnTextCancel: { fontWeight: 'bold', color: '#666' },
    btnTextSubmit: { fontWeight: 'bold', color: '#fff' },
});