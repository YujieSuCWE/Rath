import { Image, StyleSheet, Platform, Pressable, TouchableOpacity } from 'react-native';
import React, { Component, useState, useEffect } from 'react'
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MotiView, MotiText } from 'moti';
import { addRule, getRules, Rule } from '@/database/rulesQueries';
import { addDecision, getDecisions, Decision } from '@/database/decisionsQueries';
import { addPersonWeight, getPersonWeights, personWeight } from '@/database/personWeightsQueries';
import { addGroupWeight, getGroupWeights, groupWeight } from '@/database/groupWeightsQueries';
import { addSocialWeight, getSocialWeights, socialWeight } from '@/database/socialWeightsQueries';
import { useSQLiteContext } from 'expo-sqlite';
import { router, Link } from 'expo-router';
import { blue } from 'react-native-reanimated/lib/typescript/Colors';

const HomeScreen = () => {
  const db = useSQLiteContext();
  const [personWeights, setPersonWeights] = useState<personWeight[]>([]);
  useEffect(() => {
    getPersonWeights(db).then(setPersonWeights).catch(console.error)
  }, [db])

  const [groupWeights, setGroupWeights] = useState<groupWeight[]>([]);
  useEffect(() => {
    getGroupWeights(db).then(setGroupWeights).catch(console.error)
  }, [db])

  const [socialWeights, setSocialWeights] = useState<socialWeight[]>([]);
  useEffect(() => {
    getSocialWeights(db).then(setSocialWeights).catch(console.error)
  }, [db])



  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">主张</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedView>
            <ThemedText type="subtitle">个人</ThemedText>
            <ThemedView>
              {personWeights.map(item => (
                <ThemedText key={item.id}>{'\u2022'}{item.name}{': '}{item.weight * 100}{'%'}</ThemedText>
              ))}
            </ThemedView>
          </ThemedView>
          <ThemedView>
            <ThemedText type="subtitle">家庭与社区</ThemedText>
            <ThemedView>
              {groupWeights.map(item => (
                <ThemedText key={item.id}>{'\u2022'}{item.name}{': '}{item.weight * 100}{'%'}</ThemedText>
              ))}
            </ThemedView>
          </ThemedView>
          <ThemedView>
            <ThemedText type="subtitle">人际</ThemedText>
            <ThemedView>
              {socialWeights.map(item => (
                <ThemedText key={item.id}>{'\u2022'}{item.name}{': '}{item.weight * 100}{'%'}</ThemedText>
              ))}
            </ThemedView>
          </ThemedView>
        </ThemedView>
        <Pressable onPress={() => {
          router.push(`/index_add`)
        }}>
          <ThemedText style={{ fontSize: 24, textAlign: 'center', color: 'blue' }}>{'+'}</ThemedText>
        </Pressable>
      </MotiView>
    </ParallaxScrollView>
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
    gap: 15,
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

export default HomeScreen;