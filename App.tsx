import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { groupByCity } from './utils/tour';

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
  const filteredTours =() =>{

  }

// Nhóm tour (Câu 2)
// const sections = useMemo(() => {
//   const grouped = groupByCity(filteredTours);
//   return grouped.filter(g => g.data.length > 0); // Câu 6: nhóm không còn tour thì không hiển thị
// }, [filteredTours]);

const sections = groupByCity(tours);

// Mục "Tour yêu thích" không bị ảnh hưởng bởi ô tìm kiếm (Câu 6)
const favoriteTours = useMemo(() => {
  return tours.filter(t => t.isFavorite);
}, [tours]);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View>
          <Text>Tour việt 23631301-Nguyễn Bảo Duy</Text>
          <TextInput placeholder='Tìm tour theo tên' value={searchQuery} />
          <View>
            
          {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={item => item.id}
            stickySectionHeadersEnabled={true}
            renderSectionHeader={({ section: { title, data } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title} · {data.length} tour</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <View><Text>{item.name}</Text>
              </View> // Tạm thời chỉ in tên, Câu 3 sẽ làm TourItem
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
  sectionHeader:{

  },
  sectionTitle:{

  },

});
