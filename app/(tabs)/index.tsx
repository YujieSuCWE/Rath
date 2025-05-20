import { Image, StyleSheet, Platform, Pressable, View, Text, Dimensions } from 'react-native';
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
import { eventBus } from '@/components/advocate/eventBus';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';

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

  useEffect(() => {
    const handleEvent = () => {
      bottomSheetModalRef.current?.dismiss();
    };
    eventBus.on('changeSheet', handleEvent);
    return () => {
      eventBus.off('changeSheet', handleEvent);
    };
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setIsOpen(true);
  }, []);
  const [canPanDownClose, setCanPanDownClose] = useState(false);
  const snapPoints = ["20%", "60%", "90%"];

  const [personPressed, setPersonPress] = useState(false);
  const [groupPressed, setGroupPress] = useState(false);
  const [socialPressed, setSocialPress] = useState(false);
  const [buttonPressed, setButtonPress] = useState(false);

  return (
    <SafeAreaView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }}>
      <MotiView
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ type: 'timing' }}
        style={styles.overlay}
      />

      <ThemedText type="title" style={styles.titleContainer}>{'主张'}</ThemedText>
      <ThemedView style={styles.stepContainer}>
        <Pressable
          onPressIn={() => setPersonPress(true)}
          onPressOut={() => setPersonPress(false)}
        >
          <ThemedText type="subtitle">{'\n个人'}</ThemedText>
          <ThemedView
            style={{
              backgroundColor: personPressed ? '#e0e0e0' : 'transparent',
              borderRadius: 8,
              padding: 8,
            }}>
            {personWeights.map(item => (
              <ThemedText key={item.id}>{'\u2022'}{item.name}{': '}{item.weight * 100}{'%'}</ThemedText>
            ))}
          </ThemedView>
        </Pressable>

        <Pressable
          onPressIn={() => setGroupPress(true)}
          onPressOut={() => setGroupPress(false)}
        >
          <ThemedText type="subtitle">{'\n家庭与社区'}</ThemedText>
          <ThemedView
            style={{
              backgroundColor: groupPressed ? '#e0e0e0' : 'transparent',
              borderRadius: 8,
              padding: 8,
            }}>
            {groupWeights.map(item => (
              <ThemedText key={item.id}>{'\u2022'}{item.name}{': '}{item.weight * 100}{'%'}</ThemedText>
            ))}
          </ThemedView>
        </Pressable>

        <Pressable
          onPressIn={() => setSocialPress(true)}
          onPressOut={() => setSocialPress(false)}
        >
          <ThemedText type="subtitle">{'\n人际'}</ThemedText>
          <ThemedView style={{
            backgroundColor: socialPressed ? '#e0e0e0' : 'transparent',
            borderRadius: 8,
            padding: 8,
          }}>
            {socialWeights.map(item => (
              <ThemedText key={item.id}>{'\u2022'}{item.name}{': '}{item.weight * 100}{'%'}</ThemedText>
            ))}
          </ThemedView>
        </Pressable>

        <Pressable
          onPress={handlePresentModalPress}
          onPressIn={() => setButtonPress(true)}
          onPressOut={() => setButtonPress(false)}
          style={{
            position: 'absolute',
            left: Dimensions.get('window').width / 2 - 30,
            top: '70%',
            width: 60,
            height: 60,
            backgroundColor: buttonPressed ? '#e6aa02' : '#fcba03',
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}>
          <Text style={{
            fontSize: 45,
            color: buttonPressed ? '#e6e6e6' : 'white',
            fontWeight: 'bold',
            lineHeight: 48,
          }}>{'+'}</Text>
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
          <Advocate index={0} />
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