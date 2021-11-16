import React, { createContext, useEffect, useState } from 'react';
import RtcEngine, {
  ChannelProfile,
  ClientRole,
  DataStreamConfig,
} from 'react-native-agora';
import { MessageData, MessageType } from '../models/message';
import { requestCameraAndAudioPermission } from '../pages/utils/permissions';

const AGORA_APP_ID = 'e5c64fc6afda478996fc412a4b61aed5';
const AGORA_TOKEN =
  '006e5c64fc6afda478996fc412a4b61aed5IAA4PW0w31eaRjYYi1Q72PL6yvUXRg3IT/tO8CvCHprdzjkNSM8AAAAAEAACwxdSnfmPYQEAAQCc+Y9h';
const AGORA_CHANNEL_NAME = 'POC Stagefy';

type StreamContextProps = {
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
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [peerIds, setPeerIds] = useState<number[]>([]);
  const [engine, setEngine] = useState<RtcEngine | undefined>(undefined);
  const [isMicrophoneOpen, setIsMicrophoneOpen] = useState(true);
  const [isBroadcaster, setIsBroadcaster] = useState(false);

  const initializeAgora = async () => {
    const newEngine = await RtcEngine.create(AGORA_APP_ID);
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
    });

    newEngine.addListener('StreamMessage', (userId, streamId, data) => {
      console.log('StreamMessage', userId, streamId, data);
      registerMessage(data);
    });
  };

  const toggleBroadcaster = async () => {
    console.log('isBroadcaster', isBroadcaster);

    if (engine) {
      if (isBroadcaster) {
        await engine.enableVideo();
      } else {
        await engine.disableVideo();
      }

      await engine.setClientRole(
        isBroadcaster ? ClientRole.Audience : ClientRole.Broadcaster,
      );

      setIsBroadcaster(state => !state);
    } else {
      console.log('toggleBroadcaster: Engine is empty');
    }
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
    if (engine) {
      const messageDate = createMessage(message);
      const streamId = await engine.createDataStreamWithConfig(
        new DataStreamConfig(true, true),
      );

      console.log('sendTextMessage streamId', streamId);

      await engine.sendStreamMessage(streamId!, messageDate);
    } else {
      console.log('sendTextMessage: Engine is empty');
    }
  };

  const endCall = async () => {
    if (engine) {
      await engine.leaveChannel();
    } else {
      console.log('endCall: Engine is empty');
    }

    setPeerIds([]);
  };

  const startCall = async () => {
    if (engine) {
      await engine.joinChannelWithUserAccount(
        AGORA_TOKEN,
        AGORA_CHANNEL_NAME,
        `${Math.floor(Math.random() * 100)}${Date.now()}`,
      );
    } else {
      console.log('startCall: Engine is empty');
    }
  };

  const toggleCamera = async () => {
    if (engine) {
      await engine.switchCamera();
    } else {
      console.log('toggleCamera: Engine is empty');
    }
  };

  const toggleMicrophone = async () => {
    if (engine) {
      await engine.enableLocalAudio(!isMicrophoneOpen);
      setIsMicrophoneOpen(state => !state);
    } else {
      console.log('toggleMicrophone: Engine is empty');
    }
  };

  useEffect(() => {
    requestCameraAndAudioPermission();
    initializeAgora();
    return () => {
      if (engine) {
        engine.destroy();
      } else {
        console.log('useEffect destroy: Engine is empty');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StreamContext.Provider
      value={{
        appId: AGORA_APP_ID,
        channelName: AGORA_CHANNEL_NAME,
        token: AGORA_TOKEN,
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
