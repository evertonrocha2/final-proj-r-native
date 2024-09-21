import { useState, useEffect } from 'react';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useTheme = () => {
  const router = useRouter();
  const { colorScheme: globalColorScheme } = useGlobalSearchParams();
  const [localColorScheme, setLocalColorScheme] = useState(globalColorScheme || 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedScheme = await AsyncStorage.getItem('theme');
        if (savedScheme) {
          setLocalColorScheme(savedScheme);
        }
      } catch (error) {
        console.error('Erro ao carregar o tema do armazenamento', error);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    if (globalColorScheme && globalColorScheme !== localColorScheme) {
      setLocalColorScheme(globalColorScheme);
    }
  }, [globalColorScheme]);

  const toggleTheme = async () => {
    const newScheme = localColorScheme === 'light' ? 'dark' : 'light';
    setLocalColorScheme(newScheme);
    router.setParams({ colorScheme: newScheme });

    try {
      await AsyncStorage.setItem('theme', newScheme);
    } catch (error) {
      console.error('Erro ao salvar o tema no armazenamento', error);
    }
  };

  return { toggleTheme, colorScheme: localColorScheme };
};
