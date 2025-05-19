import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component, useState, useEffect } from 'react'
import { MotiView, MotiText, SafeAreaView } from 'moti';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getDecisions, addDecision, Decision } from '@/database/decisionsQueries';
import { useSQLiteContext } from 'expo-sqlite';
import { FlashList } from '@shopify/flash-list';
import { eventBus } from '@/components/advocate/eventBus';


const decisions = () => {
  const db = useSQLiteContext();
  const [decisions, setDecisions] = useState<Decision[]>([]);

  getDecisions(db).then(setDecisions).catch(console.error)

  useEffect(() => {
      const handleDbChange = () => {
        getDecisions(db).then(setDecisions).catch(console.error);
      };
      eventBus.on('dbDecisionsChange', handleDbChange);
      return () => {
        eventBus.off('dbDecisionsChange', handleDbChange);
      };
    }, [db]);

  return (
    <SafeAreaView>
      <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }}>
        <ThemedText type="title" style={styles.titleContainer}>{'决定'}</ThemedText>
        <ScrollView style={styles.stepContainer}>
          <FlashList
            renderItem={({ item }) =>
              <View>
                <ThemedText style={styles.contentTitle}>{'\n\u2022 ' + item.title}</ThemedText>
                <ThemedText style={styles.content}>{item.content}</ThemedText>
              </View>
            }
            data={decisions}
            estimatedItemSize={20}
          />
          <View style={{ marginBottom: 200 }}></View>
        </ScrollView>
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
    marginBottom: 80,
    height: '100%',
    backgroundColor: 'white',
  },
  contentTitle: {
    fontSize: 18
  },
  content: {
    fontSize: 16,
    paddingLeft: 20,
  }
});

export default decisions