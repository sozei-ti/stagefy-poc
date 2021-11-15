import React from 'react';
import { Image, View, Text } from 'react-native';
import { styles } from './styles';

type CardItemProps = {
  message: string;
  user: {
    name: string;
    avatar_url: string;
  };
};

export const CartItem: React.FC<CardItemProps> = ({ user, message }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};
