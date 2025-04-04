import { Image, StyleSheet, Text, View } from 'react-native'
import React, { Component, useState, useEffect } from 'react'
import { MotiView, MotiText } from 'moti';
import Animated from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { addRule, getRules, Rule } from '@/database/rulesQueries';
import { useSQLiteContext } from 'expo-sqlite';
import { FlashList } from '@shopify/flash-list';
import TabButtons, { TabButtonType } from './TabButtons';

export enum CustomTab {
  newRule,
  newDecision
}

const advocate = () => {
  const [selectedTab, setSelectedTab] = useState<CustomTab>(CustomTab.newRule);

  const buttons: TabButtonType[] = [{ title: "规则" }, { title: "决定" }];

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
      <TabButtons
        buttons={buttons}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
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
    marginBottom: 10,
    fontSize: 30,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});

export default advocate