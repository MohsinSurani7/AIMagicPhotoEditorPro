/**
 * Main App Component
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from './stores/useAppStore';
import ErrorBoundary from './components/templates/ErrorBoundary';
import ModelDownloadScreen from './components/organisms/ModelDownloadScreen';
import HomeScreen from './components/organisms/HomeScreen';
import CameraView from './components/organisms/CameraView';
import EditorScreen from './components/organisms/EditorScreen';
import { THEME } from './constants';

const Stack = createStackNavigator();

const App: React.FC = () => {
  const { isModelsDownloaded } = useAppStore();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: THEME.colors.background },
              }}
            >
              {!isModelsDownloaded ? (
                <Stack.Screen
                  name="ModelDownload"
                  component={ModelDownloadScreen}
                />
              ) : (
                <>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Camera" component={CameraView} />
                  <Stack.Screen name="Editor" component={EditorScreen} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
