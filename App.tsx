import React, { ReactElement, useEffect, useState, useRef } from "react";
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BootSplash from "react-native-bootsplash";
import { Image, AppState, Animated, useAnimatedValue, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from '@d11/react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { /* dimI, */ navigationI } from './src/interfaces/interfaces';
import { startListener, currentListener, addCallback, stopListener } from './layoutListener';

const Stack = createNativeStackNavigator();

type StackAnimationTypes = 'none' | 'slide_from_right'

startListener()

const NavigatorMapper = (animation: StackAnimationTypes, screens: ReactElement[]) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: animation,
        statusBarStyle: 'dark'
      }}
      children={screens}
    />
  )
}

const App = (): ReactElement => {

  StatusBar.setBackgroundColor('transparent')

  let tallNav = useRef<boolean>(false) // tallNavigationBar

  const [ layout, setLayout ] = useState({
    "window": {"width": 0, "height": 0},
    "hingeBounds": {"left": 0, "top": 0, "right": 0, "bottom": 0},
    "insets": {"left": 0, "top": 0, "right": 0, "bottom": 0},
    "maxVerticalInset": 0,
    "maxHorizontalInset": 0,
    "state": "portrait",
    "vmin": 0,
    "tallNav": "false" // tallNavigationBar
  });

  const navigationRef = useNavigationContainerRef();

  const [ animation, setAnimation ] = useState<StackAnimationTypes>('none'); // NO INITIAL SCREEN ANIMATION

  let routes = [{ name: 'Home' }, { name: 'About' }, { name: 'KnowMore' }]

  const retrieveInitialState = (route: string) => {
    const idx = routes.findIndex((i: any) => i.name === route)
    return { index: idx, routes: routes.slice(0, idx+1) }
  };

  const input = useRef(""); // MAIN DISPLAY (CENTER)
  const secInput = useRef(""); // SECONDARY DISPLAY (UPPER)
  const [ _, update ] = useState({}); // DUMMY USESTATE FOR DISPLAY UPDATE

  // API: Home:      Overview:                        StatusBar:
  // 36   background active                           active
  // 34   background active                           active
  // 31   background active                           active
  // 30   background background                       active
  // 29   background background                       active
  // 28   background background                       active
  // 26   background background                       active
  // 23   active     background (1st) / active (next) active
  useEffect(() => {
    const blur = AppState.addEventListener('blur', () => { // ON APP BLUR
      console.log("APP COMP APP BLURRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
      saveData("savedInput", input.current.toString())
      saveData("savedSecInput", secInput.current.toString())
      saveData("savedDate", Date.now().toString())
      saveData("savedTallNav", tallNav.current.toString())
      let array = navigationRef.getState().routes // INSIDE ANY COMPONENT: navigation.getState().routes
      saveData("savedRoute", array[array.length - 1].name) // SAVE LAST ROUTE ON APP BLUR
      updateShowModal(false)
      console.log("SAVED ROUTE xxxxxxxxxxxx", array[array.length - 1].name)
      console.log("SAVED TALLBAR xxxxxxxxxx", tallNav.current)
    })

    return () => blur.remove()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const saveData = async (key: string, value: string) => {
    try { await AsyncStorage.setItem(key, value) }
    catch(e) { } // eslint-disable-line @typescript-eslint/no-unused-vars
  };

  const readData = async (key: string) => {
    try { return await AsyncStorage.getItem(key) }
    catch(e) { } // eslint-disable-line @typescript-eslint/no-unused-vars
  };

  FastImage.preload([{ uri: Image.resolveAssetSource(require('./src/images/profile.png')).uri }])

  const [ showModal, setShowModal ] = useState(false);
  const updateShowModal = (bool: boolean) => setShowModal(bool)

  const fadeAnim: Animated.Value = useAnimatedValue(0); // ORIGINAL
  const fadeIn = () => Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  const fadeOut = () => Animated.timing(fadeAnim, { toValue: 0, duration: 1000, useNativeDriver: true }).start();

  const width = layout.window.width
  const height = layout.window.height
  const state = layout.state
  const ins = layout.insets
  const hingeBounds = layout.hingeBounds
  const maxVerticalInset = layout.maxVerticalInset
  const maxHorizontalInset = layout.maxHorizontalInset
  const vmin = layout.vmin

  const sharedProps = { width, height, state, ins, hingeBounds, maxVerticalInset, maxHorizontalInset, vmin, fadeAnim, fadeIn, fadeOut }

  const dynamicImport = (nav: navigationI, module: string) => {
    switch (module) {
      case "Home":
        const Home = require('./src/components/Home/Home').default
        return (
          <Home
            {...nav} {...sharedProps} input={input} secInput={secInput}
            showModal={showModal} updateShowModal={updateShowModal}
            update={update}
          />
        )
      case "About":
        const About = require('./src/components/About/About').default
        return (
          <About
            {...nav} {...sharedProps} showModal={showModal}
            updateShowModal={updateShowModal} twoScreens={false}
          />
        )
      case "KnowMore":
        const KnowMore = require('./src/components/KnowMore/KnowMore').default
        return <KnowMore {...nav} {...sharedProps} />
    }
  }


  let stackScreens: ReactElement[] = [ "Home", "About", "KnowMore" ].map((e: string) => {
    return (
      <Stack.Screen
        name={e}
        key={e}
        options={{ contentStyle: { backgroundColor: "rgb(255, 255, 255)" } }} // DEFAULT APP BACKGROUND COLOR
        children={(nav) => dynamicImport(nav, e)}
      />
    )
  })

  let initialState = { // SET NAVIGATOR INITIAL STATE TO AVOID "UNDEFINED" ON "APP BLUR SAVE LAST ROUTE" (WITHOUT NAVIGATE ANY SCREEN)
    type: 'stack',
    key: 'stack-1',
    routeNames: ['Home', 'About', 'KnowMore'],
    routes: [{ name: 'Home' }],
    index: 0,
    stale: false,
  };

  const runOnceAvailable = useRef(true)

  const runOnce = async () => {
    console.log("EXEC RUN ONCE")
    const resInput = await readData("savedInput") // RESPONSE INPUT
    const resSecInput = await readData("savedSecInput") // RESPONSE INPUT
    const resDate = await readData("savedDate") // RESPONSE DATE
    const resTallNav = await readData("savedTallNav") // RESPONSE HEIGHT
    const resRoute = await readData("savedRoute") // RESPONSE ROUTE
    typeof resInput === "string" && (input.current = resInput)
    typeof resSecInput === "string" && (secInput.current = resSecInput)

    console.log("RESTORED ROUTE: ", resRoute)

    try {
      await Promise.all([
        AntDesign.loadFont(),
        Entypo.loadFont(),
        FontAwesome5.getStyledIconSet('brand').loadFont(),
        FontAwesome5.getStyledIconSet('light').loadFont(),
        FontAwesome5.getStyledIconSet('regular').loadFont(),
        FontAwesome5.getStyledIconSet('solid').loadFont(),
        Ionicons.loadFont(),
        MaterialCommunityIcons.loadFont(),
        MaterialIcons.loadFont(),
        SimpleLineIcons.loadFont(),
      ])
    } catch (error) { console.log("VV FONT LOAD ERROR", error) }

    async function navigationBarToGestureOrViceVersa() {
      if (typeof resDate === "string" && typeof resTallNav === "string" && typeof resRoute === "string") {
        if (Date.now() - parseInt(resDate, 10) < 60000 && resTallNav !== tallNav.current.toString()) navigationRef.reset(retrieveInitialState(resRoute))
        // else "WINDOWS HAS NOT CHANGED."
      }
    }
    navigationBarToGestureOrViceVersa()
    .then(() => {
      setTimeout(() => { // ONLY FIRST TIME & WHEN DEVICE WINDOW DIMENSIONS CHANGE
        setAnimation('slide_from_right') // SLIDE SCREEN ANIMATION
        BootSplash.hide()
        console.log("runOnceAvailable.current", runOnceAvailable.current)
        runOnceAvailable.current = false
      }, 200) // AVOID ICON BLINKING
    })
  }

  const callback = (e: any) => {
    console.log("UPDATE INFO FROM NATIVE SIDE XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX :")
    console.log("TALLNAV: ", e.tallNav)
    //console.log(e)
    setLayout(e)
    tallNav.current = e.tallNav
    if (runOnceAvailable.current) runOnce()
  }

  useEffect(() => {
    if (!currentListener) startListener()
    addCallback(callback)
    return () => stopListener()
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      initialState={initialState}
      children={ NavigatorMapper(animation, stackScreens) }
    />
  );
}

export default App;