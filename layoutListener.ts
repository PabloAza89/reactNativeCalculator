import { NativeModules, NativeEventEmitter, EmitterSubscription } from 'react-native';

const { MainActivity } = NativeModules;
const nativeEvent = new NativeEventEmitter(MainActivity);

let storedData: any
let storedFn: ((e: any) => void) | null = null;
export let currentListener: EmitterSubscription | null

export const startListener = () => { currentListener = nativeEvent.addListener('LayoutInfo', newData => {
  storedData = newData; storedFn && storedFn(newData)
})}

export const addCallback = (cb: any) => { cb(storedData); storedFn = cb }

export const stopListener = () => { currentListener?.remove(); currentListener = null; storedFn = null }