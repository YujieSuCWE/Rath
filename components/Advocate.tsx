import { Image, StyleSheet, Text, View } from 'react-native'
import React, { Component, useState, useEffect } from 'react'
import { MotiView, MotiText } from 'moti';
import Animated from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { addRule, getRules, Rule } from '@/database/rulesQueries';
import { useSQLiteContext } from 'expo-sqlite';
import { FlashList } from '@shopify/flash-list';


const advocate = () => {
  const db = useSQLiteContext();
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    getRules(db).then(setRules).catch(console.error)
  }, [db])

  function addingRules(category: string, content: string) {
    addRule(db, category, content)
      .then(result => {
        console.log("A Rule is added successfully:", result);
      }).catch(console.error);
  }

  return (
    // <Animated.ScrollView>
    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontSize: 30 }}>{'新的主张'}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>

      </ThemedView>
    </MotiView>
    /* </Animated.ScrollView> */

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
    marginBottom: 8,
  },
});

export default advocate