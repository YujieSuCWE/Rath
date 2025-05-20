import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { Component, useState, useEffect, useCallback, useRef } from 'react'
import { MotiView, MotiText, SafeAreaView } from 'moti';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getDecisions, addDecision, Decision } from '@/database/decisionsQueries';
import { useSQLiteContext } from 'expo-sqlite';
import { FlashList } from '@shopify/flash-list';
import { eventBus } from '@/components/advocate/eventBus';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import Advocate from '@/components/advocate/advocate';

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

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const snapPoints = ["20%", "60%", "90%"];

  const [currentDecision, setCurrentDecision] = useState<Decision | undefined>();

  return (
    <SafeAreaView>
      <MotiView
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ type: 'timing' }}
        style={styles.overlay}
      />
      <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }}>
        <ThemedText type="title" style={styles.titleContainer}>{'决定'}</ThemedText>
        <ScrollView style={styles.stepContainer}>
          <ThemedView style={{ margin: 5 }}></ThemedView>
          <FlashList
            renderItem={({ item }) => {
              return (
                <Pressable
                  onLongPress={
                    () => {
                      handlePresentModalPress();
                      setCurrentDecision(item);
                    }
                  }
                >
                  {({ pressed }) => {
                    return (
                      <View style={{
                        backgroundColor: pressed ? '#e0e0e0' : 'transparent',
                        borderRadius: 8,
                        padding: 10,
                        margin: 0,
                      }}>
                        <ThemedText style={styles.contentTitle}>{'\u2022 ' + item.title}</ThemedText>
                        <ThemedText style={styles.content}>{item.content}</ThemedText>
                      </View>
                    )
                  }}
                </Pressable>
              )
            }
            }
            data={decisions}
            estimatedItemSize={20}
          />
          <View style={{ marginBottom: 200 }}></View>
        </ScrollView>
      </MotiView>
      <BottomSheetModal
        index={1}
        ref={bottomSheetModalRef}
        enableDynamicSizing={false}
        snapPoints={snapPoints}
        onChange={(index: number) => {
          handleSheetChanges(index);
          setIsOpen(index !== -1);
        }}
        enablePanDownToClose={true}
        onAnimate={(fromIndex, toIndex) => {
          if (toIndex === -1) {
            setIsOpen(false);
          }
        }}
      >
        <BottomSheetView style={styles.container}>
          <Advocate index={2} decisionItem={currentDecision} />
          <ThemedView></ThemedView>
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
  },
  container: {
    paddingHorizontal: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
});

export default decisions