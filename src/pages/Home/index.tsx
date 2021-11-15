import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, FlatList } from 'react-native';
import { styles } from './styles';
import roomBackground from '../../assets/images/room.png';
import { Room } from '../Room';
import { useStream } from '../../context/stream';

export const Home: React.FC = () => {
  const [redirectToRoom, setRedirectToRoom] = useState(false);
  const { isJoinSucceed } = useStream();

  useEffect(() => {
    if (!isJoinSucceed) {
      setRedirectToRoom(false);
    }
  }, [isJoinSucceed]);

  if (redirectToRoom) {
    return <Room />;
  }
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
                onPress={() => setRedirectToRoom(true)}
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
