import { NativeModules, NativeEventEmitter, EmitterSubscription } from 'react-native';

const { MainActivity } = NativeModules;
const nativeEvent = new NativeEventEmitter(MainActivity);

export let stopListener: EmitterSubscription

export const startListener = () => { stopListener = nativeEvent.addListener('LayoutInfo', e => updateData(e)) }

let storedData: any
let storedFn: any

let updateData = (e: any) => { storedData = e; storedFn && storedFn(e) }

export let addListener = (cb: any) => { cb(storedData); storedFn = cb }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import { NativeModules, NativeEventEmitter, EmitterSubscription } from 'react-native';

// //const { MainActivity } = NativeModules;
// //const nativeEvent = new NativeEventEmitter(MainActivity);

// export let stopListener: any

// export let startListener: any

// let storedData: any
// let storedFn: any

// let updateData: any

// export let addListener: any