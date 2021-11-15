import React, { useState } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import IoniconIcon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import giftImg from '../../assets/images/gift.png';
import { useStream } from '../../context/stream';

export const ChatActions: React.FC = () => {
  const {
    sendTextMessage,
    toggleMicrophone,
    isMicrophoneOpen,
    toggleBroadcaster,
    isBroadcaster,
  } = useStream();

  const [text, setText] = useState('');

  const handleSubmit = () => {
    sendTextMessage(text);

    setText('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        maxLength={200}
        placeholder="Enviar mensagem..."
        placeholderTextColor="#f5f5f5"
        onSubmitEditing={handleSubmit}
        returnKeyType="send"
        style={styles.input}
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <IoniconIcon name="send" color="#FFF" size={22} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={toggleMicrophone}>
        {isMicrophoneOpen ? (
          <FontAwesomeIcon name="microphone" color="#FFF" size={22} />
        ) : (
          <FontAwesomeIcon name="microphone-slash" color="#FFF" size={22} />
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={toggleBroadcaster}>
        {isBroadcaster ? (
          <MaterialCommunityIcon name="camera" color="#FFF" size={22} />
        ) : (
          <MaterialCommunityIcon name="camera-off" color="#FFF" size={22} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log('not implemented')}
      >
        <Image source={giftImg} style={styles.giftImage} />
      </TouchableOpacity>
    </View>
  );
};
