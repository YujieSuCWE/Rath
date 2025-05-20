import { StyleSheet, Text, View, FlatList, SafeAreaView, ScrollView, Pressable } from 'react-native'
import React, { Component, useState, useEffect, useRef, useCallback } from 'react'
import { MotiView, MotiText } from 'moti';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { addRule, getRules, Rule } from '@/database/rulesQueries';
import { useSQLiteContext } from 'expo-sqlite';
import { FlashList } from '@shopify/flash-list';
import { eventBus } from '@/components/advocate/eventBus';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import Advocate from '@/components/advocate/advocate';

const rules = () => {
  const db = useSQLiteContext();
  const [rules, setRules] = useState<Rule[]>([]);

  getRules(db).then(setRules).catch(console.error);

  useEffect(() => {
    const load = async () => {
      try {
        const rows = await getRules(db);
        setRules(rows);
      } catch (err) {
        console.error(err);
      }
    };
    load();

    const handleDbChange = () => {
      load();
    };
    eventBus.on('dbRulesChange', handleDbChange);
    return () => {
      eventBus.off('dbRulesChange', handleDbChange);
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

  const [currentRule, setCurrentRule] = useState<Rule | undefined>();

  return (
    <SafeAreaView>
      <MotiView
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ type: 'timing' }}
        style={styles.overlay}
      />
      <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }}>
        <ThemedText type="title" style={styles.titleContainer}>{'规定'}</ThemedText>
        <ScrollView style={styles.stepContainer}>
          <ThemedView style={{ margin: 5 }}></ThemedView>
          <FlashList
            renderItem={({ item }) => {
              return (
                <Pressable
                  onLongPress={
                    () => {
                      handlePresentModalPress();
                      setCurrentRule(item);
                    }
                  }
                >
                  {({ pressed }) => {
                    return (
                      <ThemedText style={{
                        fontSize: 18,
                        backgroundColor: pressed ? '#e0e0e0' : 'transparent',
                        borderRadius: 8,
                        padding: 10,
                        margin: 0,
                      }}>{'\u2022 ' + item.content}</ThemedText>
                    )
                  }}

                </Pressable>
              )
            }
            }
            data={rules}
            estimatedItemSize={52}
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
          <Advocate index={1} ruleItem={currentRule} />
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
    marginBottom: 8,
    height: '100%',
    backgroundColor: 'white',
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

export default rules