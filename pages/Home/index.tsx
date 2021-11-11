/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import RtcEngine, {
  DataStreamConfig,
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import {ChatInput} from '../components/Input';
import {requestCameraAndAudioPermission} from '../utils/permissions';
import {styles} from './styles';
export const Home: React.FC = () => {
  const [peerIds, setPeerIds] = useState([] as number[]);
  const [isJoinSuceed, setIsJoinSuceed] = useState(false);
  const [engine, setEngine] = useState({} as RtcEngine);
  const appId = 'e5c64fc6afda478996fc412a4b61aed5';
  const token =
    '006e5c64fc6afda478996fc412a4b61aed5IABY/m5mud609vVLc/gmW2zdrdYaHTMRJIXVh6jVyRJ4swx+f9gAAAAAEAACwxdSCnKOYQEAAQAKco5h';
  const channelName = 'test';

  const initializeAgora = async () => {
    const newEngine = await RtcEngine.create(appId);
    setEngine(newEngine);
    await newEngine.enableVideo();
    newEngine.addListener('UserJoined', (userId, elapsed) => {
      console.log('UserJoined', userId, elapsed);

      if (peerIds.indexOf(userId) === -1) {
        setPeerIds(state => [...state, userId]);
      }
    });

    newEngine.addListener('UserOffline', (userId, elapsed) => {
      console.log('UserOffline', userId, elapsed);

      setPeerIds(state => state.filter(item => item !== userId));
    });

    newEngine.addListener('JoinChannelSuccess', (channel, userId, elapsed) => {
      console.log('JoinChannelSuccess', channel, userId, elapsed);

      setIsJoinSuceed(true);
    });

    newEngine.addListener('StreamMessage', (userId, streamId, data) => {
      console.log('StreamMessage', userId, streamId, data);
      Alert.alert(
        `Receive from userId:${userId}`,
        `streamId ${streamId}${data}`,
        [
          {
            text: 'Ok',
            onPress: () => {},
          },
        ],
      );
    });
  };

  const handleStartCall = async () => {
    await engine.joinChannel(token, channelName, null, 0);
  };

  const handleEndCall = async () => {
    await engine.leaveChannel();
    setIsJoinSuceed(false);
    setPeerIds([]);
  };

  const renderRemoteVideos = () => {
    return (
      <ScrollView
        style={styles.remoteContainer}
        contentContainerStyle={{paddingHorizontal: 2.5}}
        horizontal={true}>
        {peerIds.map((value, index, array) => {
          return (
            <RtcRemoteView.SurfaceView
              style={styles.remote}
              uid={value}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          );
        })}
      </ScrollView>
    );
  };

  const onPressSend = async (message: string) => {
    const streamId = await engine.createDataStreamWithConfig(
      new DataStreamConfig(true, true),
    );

    await engine.sendStreamMessage(streamId!, message);
  };

  const renderVideos = () => {
    if (isJoinSuceed) {
      return (
        <View style={styles.fullView}>
          <RtcLocalView.SurfaceView
            style={styles.max}
            channelId={channelName}
            renderMode={VideoRenderMode.Hidden}
          />
          <ChatInput onButtonPress={onPressSend} />
          {renderRemoteVideos()}
        </View>
      );
    }

    return <></>;
  };

  useEffect(() => {
    requestCameraAndAudioPermission();
    initializeAgora();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.max}>
      <View style={styles.max}>
        <View style={styles.buttonHolder}>
          <TouchableOpacity onPress={handleStartCall} style={styles.button}>
            <Text style={styles.buttonText}> Start Call </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEndCall} style={styles.button}>
            <Text style={styles.buttonText}> End Call </Text>
          </TouchableOpacity>
        </View>
        {renderVideos()}
      </View>
    </View>
  );
};
