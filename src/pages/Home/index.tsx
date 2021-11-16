import React from 'react';
import { View, TouchableOpacity, Image, FlatList } from 'react-native';
import { styles } from './styles';
import roomBackground from '../../assets/images/room.png';
import { useRootStackNavigation } from '../../app.routes';

const Home: React.FC = () => {
  const { navigate } = useRootStackNavigation();

  return (
    <View style={styles.max}>
      <View style={styles.max}>
        <View style={styles.buttonHolder}>
          <FlatList
            data={[1, 2, 3, 4, 5, 6]}
            numColumns={2}
            columnWrapperStyle={styles.flatList}
            keyExtractor={(item, index) => `${item}${index}`}
            renderItem={() => (
              <TouchableOpacity
                onPress={() => navigate('ChatRoom', { userName: 'Joao 123' })}
                style={styles.button}
              >
                <Image source={roomBackground} />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default Home;
