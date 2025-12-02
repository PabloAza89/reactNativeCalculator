import { ReactElement, useEffect } from 'react';
import { View, Linking, Animated, Pressable } from 'react-native';
import { Text } from '../../utils/Text';
import { s } from './AboutCSS';
//import { Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
//import { LinearGradient } from 'expo-linear-gradient';
//import FastImage from 'react-native-fast-image';
import { AboutI, ComponentI } from '../../interfaces/interfaces';
import CustomScrollView from '../CustomScrollView/CustomScrollView';
import CustomButton from '../CustomButton/CustomButton';

//function About({ navigation: { navigate }, vmin }: AboutI): ReactElement {
const About = ({ navigation, width, height, ins, state, hingeBounds, maxVerticalInset, maxHorizontalInset, vmin, showModal, twoScreens, aboutUp, calcLeft, fadeAnim, updateShowModal,  switchSide, nextScreen, fadeIn, fadeOut }: AboutI): ReactElement => {

  const { navigate } = navigation

  useEffect(() => {
    (navigation.getState().routes.at(-1)?.name === 'About' && (state === 'tabletop' || state === 'book')) && navigate('Home', { lastRoute: 'About' })
  }, [state])

  useEffect(() => showModal ? fadeIn() : fadeOut(), [showModal])

  const parsedInsTop = ins.top === 0 ? 1 : ins.top // PREVENT NaN WHEN RENDER (on native side)
  const parsedMaxHorizontalInset = maxHorizontalInset * 2
  const parsedMaxVerticalInset = maxVerticalInset > 24 ? maxVerticalInset : 24
  const parsedWidth =
    state === 'book' && calcLeft ? width - hingeBounds.right - ins.right - parsedMaxHorizontalInset :
    state === 'book' && !calcLeft ? hingeBounds.left - ins.left - parsedMaxHorizontalInset :
    width - parsedMaxHorizontalInset

  const parsedHeight = height === 0 ? 1 : height // PREVENT NaN WHEN RENDER (on native side)
  const topByHeight = ins.top / parsedHeight

  const linearGradientColors = [ 'rgb(18, 56, 117)', 'yellow' ]

  useEffect(() => { return () => updateShowModal(false) }, []); // ON LEAVE COMPONENT

  // ****** ↓↓↓ BACKGROUND SCHEME ↓↓↓ ******
  // zIndex
  //   3                 —— GRADIENT + OPACITY (StatusBar)
  //   2     —————————————— SCROLLVIEW
  //   1     ————————————   GRADIENT + OPACITY

  return (
    <View style={s.background}>
      <Text style={{size:20}}>asd</Text>
    </View>
  );
}

export default About;