import { StyleSheet } from 'react-native';

export const s = StyleSheet.create({
  background: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  linearGradient: {
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  customScrollView: {
    //backgroundColor: 'red', // DEV
    width: '100%', // THIS
    height: '100%', // THIS
    //flexGrow: 1,
    //height: '100%',
    //flex: 1,
    //height: '100%', // NEW
    backgroundColor: 'red',
    
  },
  scrollViewInner: {
    //flex: 1,
    //display: 'flex',
    //flexDirection: 'column',
    //backgroundColor: 'red', // DEV
    //flexGrow: 1, //THIS
    //height: '100%',
    //width: '100%', //THIS
    //justifyContent: 'center', //THIS
    //alignContent: 'center', //no
    // alignContent: 'space-around', //no
    //alignContent: 'space-between', //no
    //alignSelf: 'center', //no
    //justifyContent: 'center',
    //alignItems: 'center', //THIS
    //alignSelf: 'center', // ???
    //width: 400
  },
  title: {
    //backgroundColor: 'green', // DEV
    fontWeight: '500',
    fontSize: 24,
    textAlign: 'center',
    //color: 'red'
    color: 'rgba(0, 0, 0, .54)',
    marginBottom: 24, // THIS
  },
  imageWrapper: {
    display: 'flex',
    position: 'relative',
    //backgroundColor: 'lightcoral', // DEV
    //marginTop: 24, // THIS
    //marginBottom: 24, // THIS
    //paddingTop: 20,
    marginBottom: 24, // THIS
  },
  iconStyle: {
    position: 'absolute'
  },
  modalForegroundAbout: {
    //backgroundColor: 'yellow', // DEV
    //backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
  textInButtonUpper: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 15,
    //marginLeft: -6,
    //marginRight: 2,
    //height: 30,
    textAlign: 'center',
    //textAlignVertical: 'center',
    //includeFontPadding: false
    //paddingBottom: 40,
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
  textInButtonLower: {
    color: 'white',
    //color: 'red',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 15,
    //marginRight: 4,
    //marginLeft: -4,
    transform: [{ rotate: '180deg' }],
    textAlign: 'center',
    textAlignVertical: 'center',
    //includeFontPadding: false,
    //justifyContent: 'flex-start',
    //alignItems: 'baseline'
    //alignItems: 'flex-start'
    //textAlign: 'center',
    //margin: 4,
    //height: 30,
    //marginBottom: 50
  },
  space12: {
    width: 12,
    height: 12,
  },
  space24: {
    width: 24,
    height: 24,
  },
  cswStyle: {
    width: '100%',
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
