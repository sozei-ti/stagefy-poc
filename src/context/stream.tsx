import React, { createContext, useEffect, useState } from 'react';
import RtcEngine, {
  ChannelProfile,
  ClientRole,
  DataStreamConfig,
} from 'react-native-agora';
import { MessageData, MessageType } from '../pages/models/message';
import { requestCameraAndAudioPermission } from '../pages/utils/permissions';

type StreamContextProps = {
  isJoinSucceed: boolean;
  appId: string;
  token: string;
  channelName: string;
  startCall: () => void;
  endCall: () => void;
  messages: MessageData[];
  peerIds: number[];
  toggleCamera: () => void;
  sendTextMessage: (message: string) => void;
  toggleMicrophone: () => void;
  isMicrophoneOpen: boolean;
  toggleBroadcaster: () => void;
  isBroadcaster: boolean;
};

export const StreamContext = createContext<StreamContextProps>(
  {} as StreamContextProps,
);

export const StreamProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState([] as MessageData[]);
  const [peerIds, setPeerIds] = useState([] as number[]);
  const [engine, setEngine] = useState({} as RtcEngine);
  const [isJoinSucceed, setIsJoinSucceed] = useState(false);
  const [isMicrophoneOpen, setIsMicrophoneOpen] = useState(true);
  const [isBroadcaster, setIsBroadcaster] = useState(false);

  const appId = 'e5c64fc6afda478996fc412a4b61aed5';
  const token =
    '006e5c64fc6afda478996fc412a4b61aed5IAA4PW0w31eaRjYYi1Q72PL6yvUXRg3IT/tO8CvCHprdzjkNSM8AAAAAEAACwxdSnfmPYQEAAQCc+Y9h';
  const channelName = 'testeAgora';

  const initializeAgora = async () => {
    const newEngine = await RtcEngine.create(appId);
    setEngine(newEngine);
    await newEngine.enableVideo();
    await newEngine.enableAudio();
    await newEngine.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await newEngine.setClientRole(ClientRole.Broadcaster);
    await newEngine.setCameraAutoFocusFaceModeEnabled(true);
    await setupListeners(newEngine);
  };

  const setupListeners = async (newEngine: RtcEngine) => {
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

      setIsJoinSucceed(true);
    });

    newEngine.addListener('StreamMessage', (userId, streamId, data) => {
      console.log('StreamMessage', userId, streamId, data);
      registerMessage(data);
    });
  };

  const toggleBroadcaster = async () => {
    console.log('isBroadcaster', isBroadcaster);

    if (isBroadcaster) {
      await engine.enableVideo();
    } else {
      await engine.disableVideo();
    }

    await engine.setClientRole(
      isBroadcaster ? ClientRole.Audience : ClientRole.Broadcaster,
    );

    setIsBroadcaster(state => !state);
  };

  const registerMessage = (message: string) => {
    const messageData = JSON.parse(message) as MessageData;

    setMessages(state => [...state, messageData]);
  };

  const createMessage = (message: string): string => {
    const newMessage: MessageData = {
      id: `${Math.floor(Math.random() * 100)}${Date.now()}`,
      message: message,
      type: MessageType.TextMessage,
      user: {
        name: 'Teste',
        avatar_url:
          'http://ibaseminario.com.br/novo/wp-content/uploads/2013/09/default-avatar.png',
      },
    };

    setMessages(state => [...state, newMessage]);
    return JSON.stringify(newMessage);
  };

  const sendTextMessage = async (message: string) => {
    const messageDate = createMessage(message);
    const streamId = await engine.createDataStreamWithConfig(
      new DataStreamConfig(true, true),
    );

    console.log(streamId);

    await engine.sendStreamMessage(streamId!, messageDate);
  };

  const endCall = async () => {
    await engine.leaveChannel();
    setIsJoinSucceed(false);
    setPeerIds([]);
  };

  const startCall = async () => {
    await engine.joinChannelWithUserAccount(
      token,
      channelName,
      `${Math.floor(Math.random() * 100)}${Date.now()}`,
    );
  };

  const toggleCamera = async () => {
    await engine.switchCamera();
  };

  const toggleMicrophone = async () => {
    await engine.enableLocalAudio(!isMicrophoneOpen);

    setIsMicrophoneOpen(state => !state);
  };

  useEffect(() => {
    requestCameraAndAudioPermission();
    initializeAgora();
    return () => {
      engine.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StreamContext.Provider
      value={{
        appId,
        channelName,
        isJoinSucceed,
        token,
        startCall,
        endCall,
        toggleCamera,
        messages,
        peerIds,
        sendTextMessage,
        isMicrophoneOpen,
        toggleMicrophone,
        toggleBroadcaster,
        isBroadcaster,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

export function useStream(): StreamContextProps {
  const context = React.useContext(StreamContext);

  if (!context) {
    throw new Error('useStream must be used within an StreamProvider');
  }

  return context;
}
