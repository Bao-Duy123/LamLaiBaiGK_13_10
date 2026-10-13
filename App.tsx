import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, RefreshControl, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { groupByCity } from './utils/tour';
import TourItem from './components/TourItem';
// import axios from 'axios';

const API =  "https://6ac490a854a61668c5f5c48c.mockapi.io/tours";

type Tour= {
  id: string;
  name: string;
  city: string;
  days: number;
  price: number;
  seats: number;
  departure: string;
  image: string;
  isFavorite: boolean;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const [tours, setTours] = useState<Tour[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const fetchTours = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setTours(data);
    } catch (error) {
      console.log("loi")
    } finally {
      setLoading(false);
      // setRefreshing(false);
    }
  }
  useEffect(()=>{
    fetchTours();
  })
  // Lọc dữ liệu bằng useMemo
  const filteredTours = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return tours;
    return tours.filter(t => t.name.toLowerCase().includes(query));
  }, [tours, searchQuery]);
//Nhóm tour (Câu 2)
const sections = useMemo(() => {
  const grouped = groupByCity(filteredTours);
  return grouped.filter(g => g.data.length > 0); // Câu 6: nhóm không còn tour thì không hiển thị
}, [filteredTours]);


// Mục "Tour yêu thích" không bị ảnh hưởng bởi ô tìm kiếm (Câu 6)
const favoriteTours = useMemo(() => {
  return tours.filter(t => t.isFavorite);
}, [tours]);

// const handleToggleFavorite = async (id: string, next: boolean) => {
//   const originalTours = [...tours]; // Lưu trạng thái cũ
  
//   // Cập nhật lạc quan
//   setTours(prev => prev.map(t => t.id === id ? { ...t, isFavorite: next } : t));

//   try {
//     // Gọi PUT bằng axios
//     await axios.put(`${API}/${id}`, {
//       isFavorite: next
//     });
//     // Axios tự động parse JSON và tự động throw error nếu API trả về mã lỗi (như 404, 500)
//   } catch (error) {
//     setTours(originalTours); // Hoàn tác
//     Alert.alert('Lỗi', 'Cập nhật thất bại.');
//     console.log('Lỗi', 'Cập nhật thất bại.');
//   }
// };
const handleToggleFavorite = async (id: string, next: boolean) => {
  const originalTours = [...tours]; // Lưu trạng thái cũ
  
  // Cập nhật lạc quan
  setTours(prev => prev.map(t => t.id === id ? { ...t, isFavorite: next } : t));

  try {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFavorite: next })
    });
    if (!res.ok) throw new Error('Update failed');
  } catch (error) {
    setTours(originalTours); // Hoàn tác
    Alert.alert('Lỗi', 'Cập nhật thất bại.');
  }
};


const [refreshing, setRefreshing] = useState(false);
  
  // Viết lại hàm fetch để tái sử dụng

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTours();
  }, [fetchTours]);

  return (
    <SafeAreaProvider>
      <SafeAreaView  style={styles.list}>
        <View  style={styles.list}>
          <Text>Tour việt 23631301-Nguyễn Bảo Duy</Text>
          <TextInput placeholder='Tìm tour theo tên' value={searchQuery} />

          <View style={styles.list}>  
          {loading ? (
          <ActivityIndicator size="large" color="#0000ff"  />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={item => item.id}
            stickySectionHeadersEnabled={true}
            ListEmptyComponent={<Text style={{textAlign: 'center'}}>Không tìm thấy tour phù hợp</Text>}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderSectionHeader={({ section: { title, data } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title} · {data.length} tour</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View>
                  <TourItem tour={item} compact={item.isFavorite} onPress={() => {}} onToggleFavorite={handleToggleFavorite} />
              {/* <Text>{item.name}</Text> */}
              </View>
            )}
          />
        )}
          </View>
        </View>


      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input:{
    // backgroundColor : "#fff"
    borderWidth: 1
  },
  sectionHeader: { backgroundColor: '#bbdefb', padding: 8, paddingHorizontal: 15 },
  sectionTitle: { fontWeight: 'bold', color: '#0d47a1' },
  list:{
    flex: 1
  }

});
