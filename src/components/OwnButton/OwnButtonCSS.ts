import { StyleSheet } from 'react-native';

export const s = StyleSheet.create({
  text: {
    textAlign: 'center',
    includeFontPadding: false,
    color: 'rgba(0, 0, 0, .54)'
  },
  ownButton: {
    //backgroundColor: '#ababab', // ORI
    backgroundColor: '#ababab',
    borderColor: '#4d4db0',
    borderWidth: 1,
    justifyContent: 'center',
    textAlign: 'center',
    aspectRatio: 1,
    height: 0
  },
  ownButtonTabletop: {
    backgroundColor: '#ababab',
    borderColor: '#4d4db0',
    borderWidth: 1,
    justifyContent: 'center',
    textAlign: 'center',
    width: `${92/7}%`,
    height: `${(100 - (((3 / 7) + 1) * 4)) / 3}%`
  }
});