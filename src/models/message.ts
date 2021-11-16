export enum MessageType {
  TextMessage = 'Text message',
  AnimationMessage = 'Animation message',
}

export type MessageData = {
  id: string;
  type: MessageType;
  message: string;
  animation_link?: string;
  user: {
    name: string;
    avatar_url: string;
  };
};
