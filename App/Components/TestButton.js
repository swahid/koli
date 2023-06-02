import React from "react";
import {  Button, StyleSheet } from 'react-native'
import { logger } from 'react-native-logs'

var log = logger.createLogger()

const TestButton = () => <Button testID="button" title="test button" onPress={() => log.debug('Test button clicked')} />

export default TestButton;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     marginHorizontal: 16,
//   },
//   title: {
//     height: '10px',
//     textAlign: 'center',
//     marginVertical: 8,
//   },
//   fixToText: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   separator: {
//     marginVertical: 8,
//     borderBottomColor: '#737373',
//     borderBottomWidth: StyleSheet.hairlineWidth,
//   },
// });
