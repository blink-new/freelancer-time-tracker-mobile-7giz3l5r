import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Clock, FolderOpen, BarChart3, Settings } from 'lucide-react-native';

// Import screens
import TimerScreen from './src/screens/TimerScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import providers
import { TimerProvider } from './src/context/TimerContext';
import { ProjectProvider } from './src/context/ProjectContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <TimerProvider>
      <ProjectProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let IconComponent;

                if (route.name === 'Timer') {
                  IconComponent = Clock;
                } else if (route.name === 'Projects') {
                  IconComponent = FolderOpen;
                } else if (route.name === 'Reports') {
                  IconComponent = BarChart3;
                } else if (route.name === 'Settings') {
                  IconComponent = Settings;
                }

                return <IconComponent size={size} color={color} />;
              },
              tabBarActiveTintColor: '#2563EB',
              tabBarInactiveTintColor: '#64748B',
              tabBarStyle: {
                backgroundColor: '#FFFFFF',
                borderTopColor: '#E2E8F0',
                paddingTop: 8,
                paddingBottom: 8,
                height: 80,
              },
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '500',
                marginTop: 4,
              },
              headerStyle: {
                backgroundColor: '#F8FAFC',
                borderBottomColor: '#E2E8F0',
              },
              headerTitleStyle: {
                fontSize: 18,
                fontWeight: '600',
                color: '#1E293B',
              },
            })}
          >
            <Tab.Screen 
              name="Timer" 
              component={TimerScreen}
              options={{ title: 'Time Tracker' }}
            />
            <Tab.Screen 
              name="Projects" 
              component={ProjectsScreen}
              options={{ title: 'Projects' }}
            />
            <Tab.Screen 
              name="Reports" 
              component={ReportsScreen}
              options={{ title: 'Reports' }}
            />
            <Tab.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ProjectProvider>
    </TimerProvider>
  );
}