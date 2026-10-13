import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Tour, formatDate, getSeatLabel } from '../utils/tour';

export interface TourItemProps {
  tour: Tour;
  compact?: boolean; 
  onPress: (tour: Tour) => void;
  onToggleFavorite: (id: string, next: boolean) => void;
}

const TourItem = ({ tour, compact = false, onPress, onToggleFavorite }:TourItemProps) => {
    const isTrue = compact ==true;
  const handlePress = () => {
    Alert.alert(
      "Thông tin Tour",
      `Tên: ${tour.name}\nKhởi hành: ${formatDate(tour.departure)}\nThời gian: ${tour.days} ngày\nGiá: ${tour.price.toLocaleString('vi-VN')} ₫`
    );
    onPress(tour);
  };

  const isWarning = tour.seats <= 3;

  return (
    <TouchableOpacity 
      style={[styles.container, compact ? styles.compactContainer : styles.fullContainer]} 
      onPress={handlePress}
    >
      <Image source={{ uri: tour.image }} style={compact ? styles.compactImage : styles.fullImage} />
      <View style={compact ? styles.compactInfo : styles.fullInfo}>
        <Text style={styles.name} numberOfLines={compact ? 1 : 2}>{tour.name}</Text>
        {!compact && (
          <>
             {/* Render city, details, seats giống Câu 3 */}
          </>
        )}
        <Text style={styles.price}>{tour.price.toLocaleString('vi-VN')} ₫</Text>
      </View>
      <TouchableOpacity
        testID="fav-btn"
        style={[styles.favBtn, compact && styles.compactFavBtn]}
        onPress={(e) => { e.stopPropagation(); onToggleFavorite(tour.id, !tour.isFavorite); }}
      >
        <Text style={styles.favIcon}>{tour.isFavorite ? '♥' : '♡'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 10, elevation: 2 },
  image: { width: 90, height: 90, borderRadius: 8, marginRight: 10 },
  info: { flex: 1 },
  name: { fontWeight: 'bold', fontSize: 14 },
  city: { color: '#666', fontSize: 12 },
  details: { color: '#555', fontSize: 12, marginVertical: 2 },
  seats: { fontSize: 12, color: '#2e7d32', fontWeight: '500' },
  seatsWarning: { color: 'red' },
  price: { fontWeight: 'bold', color: '#e53935' },
  favBtn: { padding: 8 },
  favIcon: { fontSize: 20, color: 'red' },
  compactContainer: { flexDirection: 'column', width: 160, marginRight: 10 },
  fullContainer: { flexDirection: 'row' },
  compactImage: { width: '100%', aspectRatio: 4/3 },
  fullImage: { width: 90, height: 90 },
  compactInfo: { padding: 8 },
  fullInfo: { flex: 1 },
  compactFavBtn: { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 15 }
});

export default React.memo(TourItem);