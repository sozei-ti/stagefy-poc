import React, { createContext, useEffect, useState } from 'react';
import RtcEngine, {
  ChannelProfile,
  ClientRole,
  DataStreamConfig,
  RtcEngineContext,
} from 'react-native-agora';
import { MessageData, MessageType } from '../models/message';
import { randomId } from '../pages/utils/generateRandomId';
import { requestCameraAndAudioPermission } from '../pages/utils/permissions';

const AGORA_APP_ID = 'e5c64fc6afda478996fc412a4b61aed5';
const AGORA_TOKEN =
  '006e5c64fc6afda478996fc412a4b61aed5IAAItNZ3Z0+ma8qizS7dYYKch1OqiVHJ4rpfu5Yq6+vMxoXP3sMAAAAAEAAxeNCcy16WYQEAAQDLXpZh';
const AGORA_CHANNEL_NAME = 'POC_Stagefy';

type StreamContextProps = {
  streamEngine: RtcEngine | undefined;
  appId: string;
  token: string;
  channelName: string;
  startCall: (username: string) => void;
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
  const [streamEngine, setStreamEngine] = useState<RtcEngine | undefined>(
    undefined,
  );
  const [isMicrophoneOpen, setIsMicrophoneOpen] = useState(true);
  const [isBroadcaster, setIsBroadcaster] = useState(false);
  const [username, setUsername] = useState('');

  const startCall = async (newUsername: string) => {
    try {
      const newEngine = await RtcEngine.createWithContext(
        new RtcEngineContext(AGORA_APP_ID),
      );
      await newEngine.enableVideo();
      await newEngine.enableAudio();
      await newEngine.setChannelProfile(ChannelProfile.LiveBroadcasting);
      await newEngine.setClientRole(ClientRole.Broadcaster);
      await newEngine.setCameraAutoFocusFaceModeEnabled(true);

      await newEngine.joinChannelWithUserAccount(
        AGORA_TOKEN,
        AGORA_CHANNEL_NAME,
        randomId(),
      );

      setStreamEngine(newEngine);
      setUsername(newUsername);
    } catch (error) {
      console.log('StreamContext - startCall() error:', error);
    }
  };

  const setupListeners = (newEngine: RtcEngine) => {
    newEngine.addListener('UserJoined', (userId, elapsed) => {
      console.log('UserJoined', userId, elapsed);
      setMessages(state => [...state]);
      setPeerIds(state => {
        if (state.find(item => item === userId)) {
          return state;
        } else {
          return [...state, userId];
        }
      });
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
      const parsedMessage = JSON.parse(data) as MessageData;
      if (messages.find(message => message.id === parsedMessage.id)) {
        console.log('StreamMessage', 'already  exists');
        return;
      } else {
        console.log('StreamMessage', 'new registed');
        setMessages(state => [...state, parsedMessage]);
      }
    });
  };

  const toggleBroadcaster = async () => {
    console.log('isBroadcaster', isBroadcaster);

    if (streamEngine) {
      try {
        if (isBroadcaster) {
          await streamEngine.enableVideo();
        } else {
          await streamEngine.disableVideo();
        }

        await streamEngine.setClientRole(
          isBroadcaster ? ClientRole.Audience : ClientRole.Broadcaster,
        );

        setIsBroadcaster(state => !state);
      } catch (error) {
        console.log('StreamContext - toggleBroadcaster() error:', error);
      }
    } else {
      console.log('toggleBroadcaster: Engine is empty');
    }
  };

  const createMessage = (message: string): string => {
    const newMessage: MessageData = {
      id: randomId(),
      message,
      type: MessageType.TextMessage,
      user: {
        name: username,
        avatar_url:
          'http://ibaseminario.com.br/novo/wp-content/uploads/2013/09/default-avatar.png',
      },
    };

    setMessages(state => [...state, newMessage]);
    return JSON.stringify(newMessage);
  };

  const sendTextMessage = async (message: string) => {
    if (streamEngine) {
      const messageDate = createMessage(message);

      try {
        const streamId = await streamEngine.createDataStreamWithConfig(
          new DataStreamConfig(true, true),
        );

        console.log('sendTextMessage streamId', streamId);

        await streamEngine.sendStreamMessage(streamId!, messageDate);
      } catch (error) {
        console.log('StreamContext - sendTextMessage() error:', error);
      }
    } else {
      console.log('sendTextMessage: Engine is empty');
    }
  };

  const endCall = async () => {
    if (streamEngine) {
      try {
        console.log('streamEngine before leave:', streamEngine);
        await streamEngine.leaveChannel();
        console.log('streamEngine beforeDestroy', streamEngine);
        await streamEngine.destroy();
        console.log('streamEngine afterDestroy', streamEngine);
        setStreamEngine(undefined);
      } catch (error) {
        console.log('StreamContext - endCall() error:', error);
      }
    } else {
      console.log('endCall: Engine is empty');
    }

    setPeerIds([]);
    setMessages([]);
    setUsername('');
  };

  const toggleCamera = async () => {
    if (streamEngine) {
      try {
        await streamEngine.switchCamera();
      } catch (error) {
        console.log('StreamContext - toggleCamera() error:', error);
      }
    } else {
      console.log('toggleCamera: Engine is empty');
    }
  };

  const toggleMicrophone = async () => {
    if (streamEngine) {
      try {
        await streamEngine.enableLocalAudio(!isMicrophoneOpen);
        setIsMicrophoneOpen(state => !state);
      } catch (error) {
        console.log('StreamContext - toggleMicrophone() error:', error);
      }
    } else {
      console.log('toggleMicrophone: Engine is empty');
    }
  };

  useEffect(() => {
    requestCameraAndAudioPermission();
  }, []);

  useEffect(() => {
    if (streamEngine) {
      setupListeners(streamEngine);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamEngine]);

  return (
    <StreamContext.Provider
      value={{
        streamEngine,
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
