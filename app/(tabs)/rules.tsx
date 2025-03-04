import { Image, StyleSheet, Text, View } from 'react-native'
import React, { Component, useState, useEffect } from 'react'
import { MotiView, MotiText } from 'moti';
import Animated from 'react-native-reanimated';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import '@/database/rulesQueries';
import { addRule, getRules, Rule } from '@/database/rulesQueries';
import { useSQLiteContext } from 'expo-sqlite';


const rules = () => {
  const db = useSQLiteContext();
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    async function fetchRules() {
      try {
        const result = await getRules(db);
        setRules(result);
      } catch (error) {
        console.error("Error getting rules:", error);
      }
    }
    fetchRules();
  }, [db])

  function addingRules() {
    const category = "exampleCategory";
    const content = "exampleContent";

    addRule(db, category, content)
      .then(result => {
        console.log("Rules added successfully:", result);
      })
      .catch(error => {
        console.error("Error adding rules:", error);
      });
  }

  return (
    <Animated.ScrollView>
      <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">规定</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="title">内容</ThemedText>
          <ThemedView>
            {rules.map(item => (
              <ThemedText key={item.id}>{'\u2022'}{item.content}</ThemedText>
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
    paddingBottom: 10,
  },
  stepContainer: {
    gap: 8,
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

export default rules