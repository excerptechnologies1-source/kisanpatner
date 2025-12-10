import { Tabs } from 'expo-router';
import React from 'react';


import { Colors } from '@/constants/theme';


export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
      
        headerShown: false,
       
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
         
        }}
      />
    </Tabs>
  );
}
