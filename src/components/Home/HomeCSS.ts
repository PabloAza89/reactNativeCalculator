import { StyleSheet } from 'react-native';

export const s = StyleSheet.create({
  background: {
    backgroundColor: 'lightblue',
    position: 'relative',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  outline: {
    backgroundColor: 'darkblue'
  },
  contour: {
    backgroundColor: 'silver',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignContent: 'stretch',
    margin: 3
  },
  displayContainer: {
    backgroundColor: 'antiquewhite',
    borderColor: '#4d4db0',
    alignItems: 'flex-end',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  displayContainerPort: {
    width: '96%',
    marginLeft: '2%',
    marginTop: '2%'
  },
  displayContainerLand: {
    width: '98%',
    marginLeft: '1%',
    marginTop: '1%'
  },
  secondaryResult: {
    //backgroundColor: 'lightgreen', // DEV
    color: 'rgba(0, 0, 0, .54)',
    fontWeight: '500',
    textAlignVertical: 'center',
    includeFontPadding: false,
    height: '100%'
  },
  mainResult: {
    //backgroundColor: 'burlywood', // DEV
    color: 'rgba(0, 0, 0, .54)',
    fontWeight: '500',
    textAlignVertical: 'center',
    includeFontPadding: false,
    height: '100%'
  },
  parErr: {
    //backgroundColor: 'green', // DEV
    color: 'red',
    textAlignVertical: 'center',
    includeFontPadding: false,
    height: '100%'
  },
  questionContainer: {
    //backgroundColor: 'rgba(209, 46, 46, 0.4)', // DEV
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  question: {
    //backgroundColor: 'green', // DEV
    flexDirection: 'row',
    justifyContent: 'center',
    width: 42,
    height: 42,
    borderRadius: 21
  },
  tabletopContainer: { // TABLETOP // TABLETOP // TABLETOP //
    backgroundColor: 'black', // HINGE COLOR
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    //alignSelf: 'center'
    //alignItems: 'center'
    //overflow: 'hidden'
    //overflow: 'scroll'
    //overflow: 'visible'
  },
  upperScreenTabletop: {
    backgroundColor: 'lightblue', // DEV
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  lowerScreenTabletop: {
    //backgroundColor: '#adb4e6', // DEV // #adb4e6
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  landButtonsContainer: {
    //backgroundColor: 'yellow', // DEV
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: '1%',
    marginBottom: '1%',
    width: '99%',
    justifyContent:'space-around',
    alignContent: 'space-between'
  },
  bookContainer: { // BOOK // BOOK // BOOK // BOOK // BOOK //
    backgroundColor: 'black', // HINGE COLOR
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%'
  },
  eachSideBook: {
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalForegroundHome: { // MODAL // MODAL // MODAL //
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    zIndex: 1000000,
    width: '100%',
    height: '100%'
  },
  modalForegroundHomePressable: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
