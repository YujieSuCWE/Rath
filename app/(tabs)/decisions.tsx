import { Image, StyleSheet, Text, View } from 'react-native'
import React, { Component, useState, useEffect } from 'react'
import { MotiView, MotiText } from 'moti';
import Animated from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import '@/database/decisionsQueries';
import { addDecision, getDecisions, Decision } from '@/database/decisionsQueries';
import { useSQLiteContext } from 'expo-sqlite';


const decisions = () => {
  const db = useSQLiteContext();
  const [decisions, setDecisions] = useState<Decision[]>([]);

  useEffect(() => {
    getDecisions(db).then(setDecisions).catch(console.error)
  }, [db])

  return (
    <Animated.ScrollView>
      <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{'\n\n'}决定</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedView>
            {decisions.map(item => (
              <ThemedText key={item.id}>{'\u2022'}{item.title}{'\n'}{item.content}{'\n'}</ThemedText>
            ))}
          </ThemedView>
        </ThemedView>
      </MotiView>
    </Animated.ScrollView>

  );

}


const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
  },
  stepContainer: {
    gap: 8,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

export default decisions