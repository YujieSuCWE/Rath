import { Button, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { MotiText, MotiView } from 'moti'

export type TabButtonType = {
    title: string,
}

type TabButtonsProps = {
    buttons: TabButtonType[],
    selectedTab: number,
    setSelectedTab: (index: number) => void
}

const TabButtons = ({ buttons, selectedTab, setSelectedTab }: TabButtonsProps) => {
    return (
        <View
            style={{
                backgroundColor: '#fcba03',
                borderRadius: 14,
                justifyContent: 'center',
                width: '60%',
                height: 40,
                alignSelf: 'center', 
                marginBottom: 15
            }}>
            <MotiView
                from={{ marginHorizontal: '2%' }}
                animate={{ marginHorizontal: selectedTab === 0 ? '2%' : '53%' }}
                transition={{ type: 'spring', duration: 1000 }}
                style={{
                    position: 'absolute',
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    marginHorizontal: '2%',
                    height: '75%',
                    width: '45%', 
                }}>
            </MotiView>
            <View style={{ flexDirection: 'row' }}>
                {buttons.map((button, index) => {
                    const color = selectedTab === index ? '#fcba03' : '#fff';
                    return (
                        <Pressable
                            key={index}
                            style={{ flex: 1 }}
                            onPress={() => { setSelectedTab(index) }}
                        >
                            <Text
                                style={{
                                    color: color,
                                    alignSelf: 'center',
                                    fontWeight: 'bold',
                                    fontSize: 18
                                }}>{button.title}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    )
}

export default TabButtons

const styles = StyleSheet.create({})