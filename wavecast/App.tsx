import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import * as Haptics from "expo-haptics";

export default function App() {
  return (
    <View style={styles.container}>
      <Text onPress={()=>{Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); console.log("hello")}}>how are you?</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
