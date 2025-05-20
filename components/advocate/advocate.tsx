import { Image, StyleSheet, Text, View, TextInput, ScrollView } from 'react-native'
import React, { Component, useState, useEffect } from 'react'
import { MotiView, MotiText } from 'moti';
import Animated from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { addRule, getRules, Rule } from '@/database/rulesQueries';
import { useSQLiteContext } from 'expo-sqlite';
import { FlashList } from '@shopify/flash-list';
import TabButtons, { TabButtonType } from './TabButtons';
import New from './New';
import { Decision } from '@/database/decisionsQueries';

export enum CustomTab {
  newRule,
  newDecision
}

enum Titles {
  "新的主张",
  "编辑规定",
  "编辑决定"
}

type Props = {
  index: number;
  ruleItem?: Rule;
  decisionItem?: Decision;
};

const advocate = ({ index, ruleItem, decisionItem }: Props) => {
  const [selectedTab, setSelectedTab] = useState<CustomTab>(CustomTab.newRule);

  const buttons: TabButtonType[] = [{ title: "规定" }, { title: "决定" }];

  const db = useSQLiteContext();
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    getRules(db).then(setRules).catch(console.error)
  }, [db])

  if (index === 0) {
    return (
      <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontSize: 30 }}>{Titles[index]}</ThemedText>
        </ThemedView>
        <TabButtons
          buttons={buttons}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <ScrollView>
          <ThemedView style={styles.stepContainer}>
            <New selectedTab={selectedTab} />
          </ThemedView>
        </ScrollView >
      </MotiView>
    );
  } else if (index === 1) {
    return (
      <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontSize: 30 }}>{Titles[index]}</ThemedText>
        </ThemedView>
        <ScrollView>
          <ThemedView style={styles.stepContainer}>
            <New selectedTab={0} ruleItem={ruleItem} />
          </ThemedView>
        </ScrollView >
      </MotiView>
    );
  } else if (index === 2) {
    return (
      <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontSize: 30 }}>{Titles[index]}</ThemedText>
        </ThemedView>
        <ScrollView>
          <ThemedView style={styles.stepContainer}>
            <New selectedTab={1} decisionItem={decisionItem}/>
          </ThemedView>
        </ScrollView >
      </MotiView>
    );
  }
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