import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import Home from './pages/Home';
import ChatRoom from './pages/ChatRoom';

export type RootStackPagesList = {
  Home: undefined;
  ChatRoom: {
    username: string;
  };
};

export const useRootStackNavigation: () => NativeStackNavigationProp<
  RootStackPagesList,
  keyof RootStackPagesList
> = () => {
  return useNavigation<NativeStackNavigationProp<RootStackPagesList>>();
};

const defaultRootStackScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

const {
  Navigator: RootStackNavigator,
  Screen: RootStackScreen,
  Group: RootStackGroup,
} = createNativeStackNavigator<RootStackPagesList>();

const AppNavigationContainer: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStackNavigator screenOptions={defaultRootStackScreenOptions}>
        <RootStackGroup>
          <RootStackScreen name="Home" component={Home} />
          <RootStackScreen name="ChatRoom" component={ChatRoom} />
        </RootStackGroup>
      </RootStackNavigator>
    </NavigationContainer>
  );
};

export default AppNavigationContainer;
