import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { SetStateAction, Dispatch, RefObject } from 'react';
import { Animated } from 'react-native';

interface Insets {
  left: number,
  top: number,
  right: number,
  bottom: number,
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
  showModal: boolean,
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
  height: number,
  ins: Insets,
  state: string,
  twoScreens: boolean,
  aboutUp: boolean,
  switchSide: () => void,
  nextScreen: () => void,
}

export interface AdderI {
  scrollEnd(): void,
  input: RefObject<string>,
  secInput: RefObject<string>,
  setParErr: Dispatch<SetStateAction<boolean>>
}

export interface OwnButtonI {
  button: string,
  size: string,
  margin: string,
  fontSize: number,
  small?: boolean,
  state?: string,
  handlePress: (x: string) => void
};

export interface operationI {
  [key: string] : (a: string, b: string) => number
}

export interface buttonsI {
  button: string,
  size: string,
  margin: string,
  small?: boolean,
}