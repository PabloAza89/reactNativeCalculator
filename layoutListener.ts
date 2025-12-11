import { NativeModules, NativeEventEmitter, EmitterSubscription } from 'react-native';

const { MainActivity } = NativeModules;
const nativeEvent = new NativeEventEmitter(MainActivity);

export let currentListener: EmitterSubscription | null

export const startListener = () => { currentListener = nativeEvent.addListener('LayoutInfo', e => updateData(e)) }

let storedData: any
let storedFn: any

let updateData = (e: any) => { storedData = e; storedFn && storedFn(e) }

export const addCallback = (cb: any) => { cb(storedData); storedFn = cb }

export const stopListener = () => { currentListener?.remove(); currentListener = null }

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