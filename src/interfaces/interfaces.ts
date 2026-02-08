import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { SetStateAction, Dispatch, MutableRefObject, RefObject } from 'react';
import { Animated, ViewProps, ViewStyle } from 'react-native';

export interface counterI {
  [index: string]: number
}

export interface dimI {
  screenHeight: number,
  screenWidth: number,
  windowHeight: number,
  windowWidth: number
}

export interface navigationI {
  navigation: NavigationProp<ParamListBase>
}

export interface HomeI extends navigationI {
  input: RefObject<string>,
  secInput: RefObject<string>,
  width: number,
  height: number,
  ins: Insets,
  state: string,
  hingeBounds: Insets,
  maxVerticalInset: number,
  maxHorizontalInset: number,
  vmin: number,
  showModal: boolean,
  fadeAnim: Animated.Value,
  updateShowModal: (arg0: boolean) => void,
  update: Dispatch<SetStateAction<object>>
  fadeIn: () => void,
  fadeOut: () => void,
}

export interface AboutI extends navigationI {
  width: number,
  height: number,
  ins: Insets,
  state: string,
  hingeBounds: Insets,
  maxVerticalInset: number,
  maxHorizontalInset: number,
  vmin: number,
  showModal: boolean, // aA?!??!
  twoScreens: boolean,
  aboutUp: boolean,
  calcLeft: boolean,
  fadeAnim: Animated.Value,
  updateShowModal: (arg0: boolean) => void,
  switchSide: () => void,
  nextScreen: () => void,
  fadeIn: () => void,
  fadeOut: () => void,
}

export interface KnowMoreI extends navigationI {
  //width: number,
  height: number,
  ins: Insets,
  state: string,
  twoScreens: boolean,
  aboutUp: boolean,
  switchSide: () => void,
  nextScreen: () => void,

  // fadeIn: () => void,
  // fadeOut: () => void,
  // opw: number,
  // port: boolean
}

interface Insets {
  left: number,
  top: number,
  right: number,
  bottom: number,
}

// export interface Props extends Animated.AnimatedProps<ViewProps> {
//   // Custom props
// }

type AnimatedI = Animated.WithAnimatedValue<ViewStyle>

interface innerRoutesI {
  name: string
}

interface routesI {
  index: number,
  routes: Array<innerRoutesI>
}

export interface ComponentI {
  navigation: NavigationProp<ParamListBase>
  vmin: number,
  width: number,
  height: number,
  showModal?: boolean,
  updateShowModal?: () => void,
  state: string,
  twoScreens: boolean,
  switchSide: () => void,
  nextScreen: () => void,
  aboutUp: boolean,
  ins: Insets,
  hingeBounds: Insets,
  calcLeft?: boolean,
  maxVerticalInset: number,
  maxHorizontalInset: number,
  fadeAnim: AnimatedI,
  fadeIn: () => void,
  fadeOut: () => void,
  input?: MutableRefObject<string>,
  secInput?: MutableRefObject<string>,
  routes?: Array<routesI>,
  update?: Dispatch<SetStateAction<object>>
  route?: NavigationProp<ParamListBase>,



}

export interface AdderI {
  input: string,
  scrollEnd(): void,
  setParErr: Dispatch<SetStateAction<boolean>>,
  setInput: Dispatch<SetStateAction<string>>,
  setSecInput: Dispatch<SetStateAction<string>>
}

export interface OwnButtonI extends AdderI {
  vmin: number,
  parErr: boolean | undefined,
  smaller: boolean | undefined,
  value: string
};

export interface goUpI {
  "0": boolean,
  "1": boolean,
  "2": boolean
}

export interface operationI {
  [key: string] : (a: string, b: string) => number,
}