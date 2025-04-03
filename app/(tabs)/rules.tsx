import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native'
import React, { Component, useState, useEffect } from 'react'
import { MotiView, MotiText } from 'moti';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { addRule, getRules, Rule } from '@/database/rulesQueries';
import { useSQLiteContext } from 'expo-sqlite';
import { FlashList } from '@shopify/flash-list';


const rules = () => {
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
    <SafeAreaView>
      <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }}>
        <ThemedText type="title" style={styles.titleContainer}>{'规定'}</ThemedText>
        <ThemedView style={styles.stepContainer}>
          <FlashList
            renderItem={({ item }) => <ThemedText style={styles.content}>{'\n\u2022 ' + item.content}</ThemedText>}
            data={rules}
            estimatedItemSize={20}
          />
        </ThemedView>
      </MotiView>
    </SafeAreaView>

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
    height: '100%'
  },
  content: {
    fontSize: 18
  }
});

export default rules