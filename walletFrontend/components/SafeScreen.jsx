import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '@/constants/colors';

const SafeScreen = ({children}) => {
    const insets = useSafeAreaInsets();
  return (
    <View style = {{padding:insets.top , flex:1 ,paddingRight:insets.right , paddingLeft:insets.left, backgroundColor: COLORS.background}}>
      {children}
    </View>
  )
}

export default SafeScreen