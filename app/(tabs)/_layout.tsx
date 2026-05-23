import { Tabs } from 'expo-router';
import { House, BookOpen, ChartLineUp, GraduationCap, Egg } from 'phosphor-react-native';
import { useTheme } from '../../hooks/useTheme';

export default function TabLayout() {
  const { tokens } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tokens.bg.elevated,
          borderTopColor: tokens.border.subtle,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: tokens.accent.bronze,
        tabBarInactiveTintColor: tokens.fg.muted,
        tabBarLabelStyle: {
          fontFamily: 'Inter',
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <House color={color} size={24} weight={focused ? 'regular' : 'light'} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalogo"
        options={{
          title: 'Catálogo',
          tabBarIcon: ({ color, focused }) => (
            <BookOpen color={color} size={24} weight={focused ? 'regular' : 'light'} />
          ),
        }}
      />
      <Tabs.Screen
        name="progresso"
        options={{
          title: 'Progresso',
          tabBarIcon: ({ color, focused }) => (
            <ChartLineUp color={color} size={24} weight={focused ? 'regular' : 'light'} />
          ),
        }}
      />
      <Tabs.Screen
        name="ciencia"
        options={{
          title: 'Ciência',
          tabBarIcon: ({ color, focused }) => (
            <GraduationCap color={color} size={24} weight={focused ? 'regular' : 'light'} />
          ),
        }}
      />
      <Tabs.Screen
        name="nutricao"
        options={{
          title: 'Nutrição',
          tabBarIcon: ({ color, focused }) => (
            <Egg color={color} size={24} weight={focused ? 'regular' : 'light'} />
          ),
        }}
      />
    </Tabs>
  );
}
