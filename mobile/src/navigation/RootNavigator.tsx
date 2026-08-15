import React, { createContext, useContext, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants';
import { getAuthToken } from '../store/asyncStorage';

import WelcomeScreen from '../screens/WelcomeScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatHistoryScreen from '../screens/ChatHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  Chat: { conversationId?: string } | undefined;
  ChatHistory: undefined;
  Settings: undefined;
};

export type ChatScreenNavigationProp = NavigationProp<AppTabParamList>;

const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

type AuthState = {
  isAuthenticated: boolean | null;
  setAuthenticated: (value: boolean) => void;
};

const AuthContext = createContext<AuthState | null>(null);

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside RootNavigator');
  }
  return context;
};

const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: COLORS.background },
    }}
  >
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: {
        backgroundColor: COLORS.background,
        borderTopColor: COLORS.border,
        paddingBottom: 8,
      },
    }}
  >
    <Tab.Screen
      name="Chat"
      component={ChatScreen}
      options={{
        title: 'Chat',
        tabBarLabel: 'Chat',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>💬</Text>,
      }}
    />
    <Tab.Screen
      name="ChatHistory"
      component={ChatHistoryScreen}
      options={{
        title: 'History',
        tabBarLabel: 'History',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text>,
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        title: 'Settings',
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙️</Text>,
      }}
    />
  </Tab.Navigator>
);

export const RootNavigator: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    getAuthToken()
      .then((token) => setIsAuthenticated(Boolean(token)))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated: setIsAuthenticated,
      }}
    >
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: COLORS.background },
          }}
        >
          {isAuthenticated ? (
            <RootStack.Screen name="App" component={AppNavigator} />
          ) : (
            <RootStack.Screen name="Auth" component={AuthNavigator} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
