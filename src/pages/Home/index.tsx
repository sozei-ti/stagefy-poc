import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { styles } from './styles';
import { useRootStackNavigation } from '../../app.routes';

const Home: React.FC = () => {
  const { navigate } = useRootStackNavigation();

  const [username, setUsername] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onTextChange = (value: string) => {
    setErrorMessage('');
    setUsername(value);
  };

  const handleJoinDefaultChatRoom = () => {
    if (username.length > 4) {
      navigate('ChatRoom', { username });
    } else {
      setErrorMessage('O seu username deve ter pelo menos 5 caracteres');
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Stagefy POC</Text>

      <TextInput
        style={styles.input}
        placeholder="Seu username"
        placeholderTextColor="darkgrey"
        onChangeText={onTextChange}
      />

      {errorMessage.length > 0 && (
        <Text style={styles.inputError}>{errorMessage}</Text>
      )}

      <TouchableOpacity
        onPress={handleJoinDefaultChatRoom}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
