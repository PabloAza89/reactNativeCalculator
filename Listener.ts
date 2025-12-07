import { useEffect, useState } from "react";
import { NativeModules, NativeEventEmitter } from 'react-native';

const { MainActivity } = NativeModules;
//export const nativeEvent = new NativeEventEmitter(MainActivity);

let storedData: any
let storedFn: any

export let newData = (e: any) => {
  storedData = e
  //fn(storedData)
  //storedFn()
  //fn(12)
  //addCallback(e)
  //sharedValue && sharedValue(e)
  //console.log("RRRRRRRRRRRRR", typeof sharedValue)
  //updater(storedData)
  //savedFunction(e) // OK
  savedFunction && savedFunction(e) // OK
}

export let sharedValue: any

let savedFunction: any

let updater = (e:any) => {
  //console.log(e)
  e(storedData)
}

//export let addCallback: any
export let addCallback = (fn: any) => {
  //storedFn = fn
  //return fn(storedData)
  //console.log("FNNNNNNNNNNN", fn)
  // if (!savedFunction) fn(storedData)
  // savedFunction = fn
  // if (!savedFunction) {fn(storedData); console.log("HERE 1")}
  // savedFunction = fn; console.log("HERE 2")

  fn(storedData)
  savedFunction = fn
  
  //return storedData
  //updater(fn) 
}



export let callbackMain2 = () => {
  return storedData
}

export const Listener = () => {

  //const [ val, newVal ] = useState(null)

  // useEffect(() => {

  //   let LayoutInfoListener = nativeEvent.addListener('LayoutInfo', e => {
  //     console.log("EXEC LayoutInfo EVENT LISTENER")
  //     //aaa = e
  //     //setBB(e)
  //     //updater(e)
  //     newVal(val)
  //     console.log("val val val", e)
  //   });

  //   return () => {
  //     console.log("REMOVED LayoutInfo EVENT LISTENER")
  //     LayoutInfoListener.remove();
  //   }
  // }, [])

  //return val
}


//export nativeEvent