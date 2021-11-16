import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './styles';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';

import { useStream } from '../../context/stream';
import { useRootStackNavigation } from '../../app.routes';

export const RoomHeader: React.FC = () => {
  const { goBack } = useRootStackNavigation();

  const { endCall, toggleCamera } = useStream();

  const handleEndCall = () => {
    endCall();
    goBack();
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handleEndCall}>
        <AntDesignIcon name="closecircle" color="#FFF" size={25} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSwitch} onPress={toggleCamera}>
        <MaterialIconsIcon name="switch-camera" color="#FFF" size={25} />
      </TouchableOpacity>
    </>
  );
};
