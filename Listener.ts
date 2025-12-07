import { NativeModules, NativeEventEmitter, EmitterSubscription } from 'react-native';

const { MainActivity } = NativeModules;
const nativeEvent = new NativeEventEmitter(MainActivity);

// export let LayoutInfoListener = nativeEvent.addListener('LayoutInfo', e => {
//   console.log("EXEC LayoutInfo EVENT LISTENER")
//   console.log("EEEEEE", e)
//   updateData(e)
// });

export let removeListener: EmitterSubscription

export let startListener = () => {
  removeListener = nativeEvent.addListener('LayoutInfo', e => {
  console.log("EXEC LayoutInfo EVENT LISTENER")
  console.log("EEEEEE", e)
  updateData(e)
});

}

let storedData: any
let storedFn: any

let updateData = (e: any) => {
  storedData = e
  storedFn && storedFn(e) // OK
}


export let addListener = (cb: any) => {
  cb(storedData)
  storedFn = cb
}


