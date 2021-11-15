import React from 'react';
import { View, FlatList } from 'react-native';
import { useStream } from '../../context/stream';
import { CartItem } from '../CardItem';
import { ChatActions } from '../ChatActions';
import { styles } from './styles';

export const Chat: React.FC = () => {
  const { messages } = useStream();

  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        <FlatList
          data={messages}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <CartItem message={item.message} user={item.user} />
          )}
        />
      </View>
      <ChatActions />
    </View>
  );
};
