import { Image, StyleSheet, Platform, Pressable, View, Text } from 'react-native';
import React, { Component, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MotiView, MotiText, SafeAreaView } from 'moti';
// import { addRule, getRules, Rule } from '@/database/rulesQueries';
// import { addDecision, getDecisions, Decision } from '@/database/decisionsQueries';
import { getPersonWeights, personWeight } from '@/database/personWeightsQueries';
import { getGroupWeights, groupWeight } from '@/database/groupWeightsQueries';
import { getSocialWeights, socialWeight } from '@/database/socialWeightsQueries';
import { useSQLiteContext } from 'expo-sqlite';
import { BottomSheetView, BottomSheetModal } from '@gorhom/bottom-sheet';
import Advocate from '@/components/advocate/advocate';

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

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setIsOpen(true);
  }, []);
  const [canPanDownClose, setCanPanDownClose] = useState(false);
  const snapPoints = ["20%", "60%", "90%"];


  return (
    <SafeAreaView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }}>
      <MotiView
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ type: 'timing' }}
        style={styles.overlay}
      />

      <ThemedText type="title" style={styles.titleContainer}>{'主张'}</ThemedText>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">{'\n个人'}</ThemedText>
        <ThemedView>
          {personWeights.map(item => (
            <ThemedText key={item.id}>{'\u2022'}{item.name}{': '}{item.weight * 100}{'%'}</ThemedText>
          ))}
        </ThemedView>
        <ThemedText type="subtitle">{'\n家庭与社区'}</ThemedText>
        <ThemedView>
          {groupWeights.map(item => (
            <ThemedText key={item.id}>{'\u2022'}{item.name}{': '}{item.weight * 100}{'%'}</ThemedText>
          ))}
        </ThemedView>
        <ThemedText type="subtitle">{'\n人际'}</ThemedText>
        <ThemedView>
          {socialWeights.map(item => (
            <ThemedText key={item.id}>{'\u2022'}{item.name}{': '}{item.weight * 100}{'%'}</ThemedText>
          ))}
        </ThemedView>
        <Pressable onPress={handlePresentModalPress} style={{
          position: 'absolute',
          left: '95%',
          top: '73%',
          height: 30
        }}>
          <Text style={{ fontSize: 48, color: 'green', lineHeight: 42 }}>{'+'}</Text>
        </Pressable>
      </ThemedView>
      <BottomSheetModal
        index={1}
        ref={bottomSheetModalRef}
        enableDynamicSizing={false}
        snapPoints={snapPoints}
        onChange={(index: number) => {
          handleSheetChanges(index);
          setIsOpen(index !== -1);
          setCanPanDownClose(index === 0);
        }}
        enablePanDownToClose={canPanDownClose}
        onAnimate={(fromIndex, toIndex) => {
          if (toIndex === -1) {
            setIsOpen(false);
          }
        }}
      >
        <BottomSheetView style={styles.container}>
          <Advocate />
        </BottomSheetView>
      </BottomSheetModal>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  stepContainer: {
    gap: 8,
    paddingLeft: 20,
    paddingRight: 20,
    height: '100%'
  },
  container: {
    paddingHorizontal: 10,
  },
});

export default HomeScreen;