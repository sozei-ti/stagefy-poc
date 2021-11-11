import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type ChatInputProps = {
  onButtonPress: (textValue: string) => void;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: '#FFF',
  },
  button: {
    padding: 20,
    backgroundColor: 'blue',
  },
  buttonText: {
    color: '#FFF',
  },
});

export const ChatInput: React.FC<ChatInputProps> = ({onButtonPress}) => {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={text} onChangeText={setText} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => onButtonPress(text)}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};
