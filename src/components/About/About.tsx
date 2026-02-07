import { ReactElement, useEffect, useCallback } from 'react';
import { View, Linking, Animated, Pressable } from 'react-native';
import { Text } from '../../utils/Text';
import { s } from './AboutCSS';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from '@d11/react-native-fast-image';
import { AboutI, ComponentI } from '../../interfaces/interfaces';
import CustomScrollView from '../CustomScrollView/CustomScrollView';
import CustomButton from '../CustomButton/CustomButton';
import { CommonActions, StackActions, useFocusEffect } from '@react-navigation/native';

//function About({ navigation: { navigate }, vmin }: AboutI): ReactElement {
const About = ({ navigation, width, height, ins, state, hingeBounds, maxVerticalInset, maxHorizontalInset, vmin, showModal, twoScreens, aboutUp, calcLeft, fadeAnim, updateShowModal,  switchSide, nextScreen, fadeIn, fadeOut }: AboutI): ReactElement => {

  let allRoutes = [{ name: 'Home' }, { name: 'About' }, { name: 'KnowMore' }]

  let routes = [
    { index: 2, routes: allRoutes },
    { index: 1, routes: allRoutes.slice(0, 2) },
    { index: 0, routes: allRoutes.slice(0, 1) }
  ]

  // useEffect(() => {
  //   console.log("navigationRef ABOUT ROUTES", navigation.getState().routes)
  // }, [navigation])

  useFocusEffect(
    useCallback(() => {
      //console.log('About screen is now visible!');
      console.log("navigationRef ABOUT ROUTES", navigation.getState().routes)

    }, [])
  );

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
      <Animated.View
        style={[ s.modalForegroundAbout, { backgroundColor: twoScreens ? 'transparent' : 'rgba(0, 0, 0, 0.4)', opacity: fadeAnim, pointerEvents: showModal ? 'auto' : 'none', paddingTop: ins.top, paddingBottom: ins.bottom } ]}
        children={
          <Pressable
            style={[ s.modalForegroundAboutPressable ]}
            onPress={() => updateShowModal(false)}
            children={
              <View style={s.modal}>
                <Text
                  numberOfLines={3}
                  style={s.upperModal}
                  children={'You are about to leave this App\nand access an external link\nDo you want to continue ?'}
                />
                <View style={s.lowerModal}>
                  <CustomButton
                    type={Ionicons.Button}
                    name={'close-circle'}
                    size={25}
                    color={'rgba(0, 0, 0, .7)'}
                    onPress={() => updateShowModal(false)}
                    children={ <Text style={s.buttonModal} children={'CANCEL'} /> }
                  />
                  <CustomButton
                    type={Ionicons.Button}
                    name={'checkmark-circle'}
                    size={25}
                    color={'rgba(0, 0, 0, .7)'}
                    onPress={() => { Linking.openURL('https://www.linkedin.com/in/juan-pablo-azambuyo'); updateShowModal(false) }}
                    margin={{ left: 12 }}
                    children={ <Text style={s.buttonModal} children={'CONTINUE'} /> }
                  />
                </View>
              </View>
            }
          />
        }
      />

      <LinearGradient // STATUS BAR
        colors={linearGradientColors}
        style={[ s.statusBarGradient, { height: ins.top } ]}
        start={{ x: 0, y: state === 'tabletop' ?  hingeBounds.top / parsedInsTop : height / parsedInsTop }}
        end={{ x: 1, y: 0 }}
      />

      <LinearGradient  // BACKGROUND
        colors={linearGradientColors}
        style={[ s.bodyGradient, { top: ins.top } ]}
        start={{ x: 0, y: 1 - topByHeight }}
        end={{ x: 1, y: topByHeight * -1 }}
      />

      <CustomScrollView
        persistentScrollbar={true}
        scrollbarPadding={{
          top: (state === 'tabletop' && !aboutUp) ? 0 : ins.top,
          right: ins.right,
          bottom: (state === 'tabletop' && aboutUp) ? 0 : ins.bottom,
        }}
        style={[s.cswStyle, { zIndex: 2 }]}
        contentContainerStyle={s.cswContentContainerStyle}
      >
        <View
          collapsable={false}
          style={{
              alignItems: 'center',
              marginTop: 'auto',
              marginBottom: 'auto',
              paddingTop: parsedMaxVerticalInset,
              paddingBottom: parsedMaxVerticalInset,
          }}
        >
          <Text
            style={[ s.title ]}
            children={'This App is developed by\nJuan Pablo Azambuyo'}
          />
          <View style={s.imageWrapper}>
            <FastImage
              style={{ width: vmin * 30, height: vmin * 30, borderRadius: (vmin * 30) / 2 /* 50% */ }}
              source={ require('../../images/profile.png') }
              resizeMode={FastImage.resizeMode.contain}
            />
            <CustomButton
              type={AntDesign}
              name={'linkedin-square'}
              size={40}
              color={'rgba(0, 0, 0, .7)'}
              onPress={() => updateShowModal(true)}
              style={{ position: 'absolute', top: ((vmin * 30) / 2) - 20, right: (((parsedWidth / 2) - ((vmin * 30) / 2)) / -2) - 20 }}
            />
          </View>

          {
            twoScreens ?
            <CustomButton
              type={MaterialCommunityIcons.Button}
              name={ state === 'tabletop' ? 'swap-vertical-bold' : 'swap-horizontal-bold' }
              size={30}
              color={'rgba(0, 0, 0, .7)'}
              onPress={() => switchSide()}
              margin={{ bottom: 24 }}
              children={ <Text style={[ s.textInButton, s.twoLines ]} children={'SWITCH\nSCREENS'} /> }
            /> :
            <CustomButton
              type={Ionicons.Button}
              name={'chevron-back-circle-sharp'}
              size={30}
              color={'rgba(0, 0, 0, .7)'}
              //onPress={() => navigate('Home')} // no
              //onPress={() => navigate('Home')} // no
              //onPress={() => navigation.goBack()} // testing
              onPress={() => navigation.dispatch(StackActions.pop())} // GO BACK
              //navigationRef.dispatch(CommonActions.reset(routes[1]))
              //onPress={() => navigate('Home', { lastRoute: 'About' })} // no
              //onPress={() => navigation.dispatch(CommonActions.reset(routes[2]))}

              margin={{ bottom: 24 }}
              children={ <Text style={[ s.textInButton, s.oneLine ]} children={'BACK'} /> }
            />
          }
          {
            twoScreens ?
            <CustomButton
              type={Ionicons.Button}
              name={ state === 'tabletop' ? 'calculator-sharp' : 'alert-circle' }
              size={30}
              color={'rgba(0, 0, 0, .7)'}
              onPress={() => nextScreen()}
              children={ <Text style={[ s.textInButton, s.oneLine ]} children={ state === 'tabletop' ? 'HOME' : 'HOW DOES IT WORK ?' } /> }
            /> :
            <CustomButton
              type={Ionicons.Button}
              name={'chevron-back-circle-sharp'}
              size={30}
              color={'rgba(0, 0, 0, .7)'}
              onPress={() => navigate('KnowMore')}
              iconStyle={s.buttonAndIconLower}
              children={ <Text style={[ s.textInButton, s.oneLine, { transform: [{ rotate: '180deg' }] } ]} children={'HOW DOES IT WORK ?'} /> }
            />
          }
        </View>
      </CustomScrollView>
    </View>
  );
}

export default About;