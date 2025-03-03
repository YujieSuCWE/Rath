import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { MotiView, MotiText } from 'moti';

export class rules extends Component {
  render() {
    return (
      <View>
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{type: 'timing'}}>
          <Text>Hi There! </Text>
        </MotiView>
      </View>
    )
  }
}

export default rules