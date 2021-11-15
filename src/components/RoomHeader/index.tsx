import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './styles';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';

import { useStream } from '../../context/stream';

export const RoomHeader: React.FC = () => {
  const { endCall, toggleCamera } = useStream();

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={endCall}>
        <AntDesignIcon name="closecircle" color="#FFF" size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSwitch} onPress={toggleCamera}>
        <MaterialIconsIcon name="switch-camera" color="#FFF" size={20} />
      </TouchableOpacity>
    </>
  );
};
