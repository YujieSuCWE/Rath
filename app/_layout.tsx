import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import 'react-native-gesture-handler';

import { useColorScheme } from '@/hooks/useColorScheme';
import '../global.css';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const createDbIfNeeded = async (db: SQLiteDatabase) => {
    await db.withTransactionAsync(async () => {
      await db.execAsync(
          `CREATE TABLE IF NOT EXISTS rules (
              id INTEGER PRIMARY KEY NOT NULL,
              category TEXT NOT NULL,
              content TEXT NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );INSERT INTO rules (category, content) SELECT category, content FROM (
              SELECT '作息' AS category, '每天必须不晚于8点钟起床。' AS content
              UNION ALL
              SELECT '作息', '每天必须不晚于晚上11点钟睡觉。'
              UNION ALL
              SELECT '学习', '每天必须阅读至少半小时，以提升知识储备。'
              UNION ALL
              SELECT '学习', '必须在阅读的同时做笔记。'
              ) AS temp
              WHERE NOT EXISTS (SELECT 1 FROM rules);`);

      await db.execAsync(
          `CREATE TABLE IF NOT EXISTS decisions (
              id INTEGER PRIMARY KEY NOT NULL,
              title TEXT NOT NULL,
              content TEXT NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );INSERT INTO decisions (title, content) SELECT title, content FROM (
              SELECT '决定明天去晨跑锻炼。' AS title, '如题' AS content
              UNION ALL
              SELECT '决定报名高数网课。', '此决定有助于个人的成长，为后续在数学专业发展打基础。'
              ) AS temp
              WHERE NOT EXISTS (SELECT 1 FROM decisions);`);

      await db.execAsync(
          `CREATE TABLE IF NOT EXISTS personweights (
              id INTEGER PRIMARY KEY NOT NULL,
              name TEXT NOT NULL,
              weight FLOAT NOT NULL
          );
          INSERT INTO personweights (name, weight) SELECT name, weight FROM (
              SELECT '健康' AS name, 0.2 AS weight
              UNION ALL
              SELECT '符合规划', 0.25
              UNION ALL
              SELECT '经济承担', 0.2
              UNION ALL
              SELECT '时间管理', 0.2
              UNION ALL
              SELECT '精神满足', 0.15
              ) AS temp
              WHERE NOT EXISTS (SELECT 1 FROM personweights);`);

      await db.execAsync(
          `CREATE TABLE IF NOT EXISTS groupweights (
              id INTEGER PRIMARY KEY NOT NULL,
              name TEXT NOT NULL,
              weight FLOAT NOT NULL
          );
          INSERT INTO groupweights (name, weight) SELECT name, weight FROM (
              SELECT '关系和睦' AS name, 0.35 AS weight
              UNION ALL
              SELECT '经济支持', 0.3
              UNION ALL
              SELECT '共同目标', 0.25
              ) AS temp
              WHERE NOT EXISTS (SELECT 1 FROM groupweights);`);

      await db.execAsync(
          `CREATE TABLE IF NOT EXISTS socialweights (
              id INTEGER PRIMARY KEY NOT NULL,
              name TEXT NOT NULL,
              weight FLOAT NOT NULL
          );
          INSERT INTO socialweights (name, weight) SELECT name, weight FROM (
              SELECT '顺应个人规划' AS name, 0.4 AS weight
              UNION ALL
              SELECT '发展关系', 0.3
              UNION ALL
              SELECT '促进参与', 0.3
              ) AS temp
              WHERE NOT EXISTS (SELECT 1 FROM socialweights);`);
  });
  }
  return (
    <SQLiteProvider databaseName='database.db' onInit={createDbIfNeeded}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index_add" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SQLiteProvider>
  );
}
