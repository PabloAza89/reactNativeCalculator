import { StyleSheet } from 'react-native';

export const s = StyleSheet.create({
  background: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  title: {
    //backgroundColor: 'green', // DEV
    fontWeight: '500',
    fontSize: 24,
    textAlign: 'center',
    //color: 'red'
    color: 'rgba(0, 0, 0, .54)',
    marginBottom: 24
  },
  imageWrapper: {
    display: 'flex',
    position: 'relative',
    //backgroundColor: 'lightcoral', // DEV
    marginBottom: 24, // THIS
  },
  modalForegroundAbout: {
    //backgroundColor: 'yellow', // DEV
    display: 'flex',
    position: 'absolute',
    zIndex: 1000001,
    width: '100%',
    height: '100%',
  },
  modalForegroundAboutPressable: {
    //backgroundColor: 'red', // DEV
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    display: 'flex',
    position: 'relative',
    opacity: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10
  },
  upperModal: {
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    textAlign: 'center',
    includeFontPadding: false,
    fontWeight: "500",
    color: 'rgba(0, 0, 0, .54)'
  },
  lowerModal: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonModal: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 15,
    marginLeft: -6,
    marginRight: 2,
    height: 25,
    width: 70,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  textInButton: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    justifyContent: 'center',
  },
  oneLine: {
    lineHeight: 30,
    height: 32,
  },
  twoLines: {
    lineHeight: 16,
    height: 32,
  },
  customScrollView: {
    width: '100%',
    height: '100%',
  },
  cswContentContainerStyle: {
    //backgroundColor: 'red', // DEV
    flexGrow: 1,
    alignItems: 'center',
  },
  buttonAndIconLower: {
    transform: [{ rotate: '180deg' }],
  },
  statusBarGradient: {
    zIndex: 3,
    position: 'absolute',
    width: '100%',
    top: 0,
    opacity: 0.7
  },
  bodyGradient: {
    zIndex: 1,
    height: '100%',
    position: 'absolute',
    width: '100%',
    opacity: 0.7
  }
});
