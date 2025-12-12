import { NativeModules, NativeEventEmitter, EmitterSubscription } from 'react-native';

const { MainActivity } = NativeModules;
const nativeEvent = new NativeEventEmitter(MainActivity);

let storedData: any
//let storedFn: ((e: any) => void) | null = null;
let storedFn: any
export let currentListener: EmitterSubscription | null

// export const startListener = () => { currentListener = nativeEvent.addListener('LayoutInfo', newData => {
//   storedData = newData; storedFn && storedFn(newData)
// })}

export const startListener = () => {
  //if (!currentListener) {
  //if (!storedData) {
    currentListener = nativeEvent.addListener('LayoutInfo', newData => {
      console.log("EXECUTED AUTO")
      storedData = newData; storedFn && (storedFn(storedData, console.log("storedFn FROM 222222222222222222222")))
    })
  //}
}

export const addCallback = (cb: any) => {
  if (storedData) cb(storedData, console.log("storedFn FROM 11111111111111111111111"));
  storedFn = cb
}

export const stopListener = () => {
  currentListener?.remove();
  currentListener = null;
  storedFn = null
  storedData = null
  // storedData = {
  //   "window": {"width": 1, "height": 1},
  //   "hingeBounds": {"left": 1, "top": 1, "right": 1, "bottom": 1},
  //   "insets": {"left": 1, "top": 1, "right": 1, "bottom": 1},
  //   "maxVerticalInset": 1,
  //   "maxHorizontalInset": 1,
  //   "state": "portrait",
  //   "vmin": 1,
  //   "tallNav": "false"
  // }
}

export const stopStoredFn = () => { storedFn = null }

export const removeListener = () => { currentListener = null }