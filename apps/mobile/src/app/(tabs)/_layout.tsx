import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true, tabBarActiveTintColor: '#6366F1', tabBarStyle: { backgroundColor: '#fff' } }}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarLabel: 'Home' }} />
      <Tabs.Screen name="employees" options={{ title: 'Employees' }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tasks' }} />
      <Tabs.Screen name="inventory" options={{ title: 'Inventory' }} />
      <Tabs.Screen name="more" options={{ title: 'More' }} />
    </Tabs>
  );
}
