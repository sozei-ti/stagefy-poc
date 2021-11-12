import React, {useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora';
import {Chat} from '../../components/Chat';
import {RoomHeader} from '../../components/RoomHeader';
import {useStream} from '../../context/stream';
import {styles} from './styles';

export const Room: React.FC = () => {
  const {channelName, peerIds, startCall} = useStream();

  useEffect(() => {
    startCall();
  }, [startCall]);

  return (
    <View style={styles.fullView}>
      <RtcLocalView.SurfaceView
        style={styles.frame}
        channelId={channelName}
        renderMode={VideoRenderMode.Hidden}
      />
      <Chat />
      <ScrollView style={styles.remoteContainer} horizontal={true}>
        {peerIds.map(value => {
          return (
            <RtcRemoteView.SurfaceView
              key={`${channelName}${value}`}
              style={styles.remote}
              uid={value}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          );
        })}
      </ScrollView>
      <RoomHeader />
    </View>
  );
};
