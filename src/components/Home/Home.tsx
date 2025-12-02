import React, { ReactElement, useState, useRef, useEffect, MutableRefObject } from 'react';
import { ScrollView, StatusBar, View, Animated,
  useAnimatedValue, Pressable, TouchableHighlight } from 'react-native';
import { s } from './HomeCSS';
import About from '../About/About';
import OwnButton from '../OwnButton/OwnButton';
import KnowMore from '../KnowMore/KnowMore';
//import { /* createIconSetFromFontello, */ SimpleLineIcons } from '@expo/vector-icons';
//import { SimpleLineIcons } from '@react-native-vector-icons/simple-line-icons';
//import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { HomeI, counterI, goUpI, ComponentI } from '../../interfaces/interfaces';
import { Text } from '../../utils/Text';
import { portButtons, landButtons } from '../../utils/Buttons';
import { Adder } from '../../utils/Adder';

const Home = ({ navigation, input, secInput, width, height, ins, state, hingeBounds, 
  route, maxVerticalInset, maxHorizontalInset, vmin, showModal, fadeAnim, updateShowModal, update, fadeIn, fadeOut }: HomeI): ReactElement => {
//function Home({ navigation: { navigate }, vmin, port, input, secInput, setInput, setSecInput, state }: HomeI): ReactElement {

  // useEffect(() => {
  //   updateShowModal(false)
  //   // return () => {
  //   //   updateShowModal(false)
  //   // }
  // },[])
  //console.log("XXXXXXXXXXXX INPUT", typeof input)

  //const fadeAnim = useAnimatedValue(0);
  //let fadeAnim: any

  
  // useEffect(() => {
  //   console.log("ROUTE", route)
  // }, [route])
  // useEffect(() => {
  //   fadeAnim = useAnimatedValue(0);
  //   Animated.timing(fadeAnim, { toValue: 0, duration: 0, useNativeDriver: true }).start();
  // }, [])

  //console.log("XXXXXXXXXXXX height HOME", height)
  //console.log("XXXXXXXXXXXX hingeBounds", hingeBounds)
  //console.log("XXXXXXXXXXXX ins", ins)

  const { navigate } = navigation

  const [ showKnowMore, setShowKnowMore ] = useState(false)

  // useEffect(() => {
  //   const lastRoute = route.params?.lastRoute
  //   lastRoute === 'KnowMore' && setShowKnowMore(true)
  //   lastRoute === 'About' && setShowKnowMore(false)
  // }, [route])

  const [ parErr, setParErr ] = useState(false);

  useEffect(() => scrollEnd(), [input.current])

  const scrollRefUpper = useRef<ScrollView>(null);
  const scrollRefCenter = useRef<ScrollView>(null);

  const scrollEnd = () => {
    scrollRefUpper.current?.scrollToEnd({ animated: false })
    scrollRefCenter.current?.scrollToEnd({ animated: false })
  }

  console.log("AAAAAAAAAAAAAAAA SADDDDDDDDDDD")

  const lastButtonPort = { value: "=", parErr: parErr, size: '22.5%', margin: '2%' }
  const lastButtonLand = { value: "=", parErr: parErr, size: `${92/7}%`, margin: '1%' }

  const parsedHorizontalInset = maxHorizontalInset * 2
  const parsedVerticalInset = maxVerticalInset * 2

  const preParsedWidth = width - parsedHorizontalInset
  const preParsedHeight = height - parsedVerticalInset

  const parsedWidth = preParsedWidth > 950 ? 950 : preParsedWidth
  const parsedHeight = preParsedHeight > 900 ? 900 : preParsedHeight

  const [ calcLeft, setCalcLeft ] = useState(true)
  const [ aboutUp, setAboutUp ] = useState(true)
  const [ showCalc, setShowCalc ] = useState(true)

  const switchSide = () => state === 'tabletop' ? setAboutUp(!aboutUp) : setCalcLeft(!calcLeft)
  const nextScreen = () => state === 'tabletop' ? setShowCalc(true) : setShowKnowMore(!showKnowMore)

  // const fadeAnim = useAnimatedValue(0); // ORIGINAL
  // const fadeIn = () => Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  // const fadeOut = () => Animated.timing(fadeAnim, { toValue: 0, duration: 1000, useNativeDriver: true }).start();

  // const fadeIn = () => {}
  // const fadeOut = () => {}
  

  const [ OPCQH, setOPCQH ] = useState(0) // onePercentContainerQueryHeight

  const sharedProps = { width, height, state, ins, hingeBounds, maxVerticalInset, maxHorizontalInset, vmin, nextScreen, switchSide, navigation, aboutUp, fadeAnim, fadeIn, fadeOut }

  const AboutScreen = <About {...sharedProps} showModal={showModal} updateShowModal={updateShowModal} calcLeft={calcLeft} twoScreens />;
  const KnowMoreScreen = (currentHeight: any) => <KnowMore {...{...sharedProps, height: currentHeight}} twoScreens />

  /// -----------> BEGIN PRE-CALC & CALC (Adder) <----------- ///

  function handlePress(kP: string) { // keyPressed

    if (kP !== "=") setParErr(false) // ALWAYS RESET ERROR PARENTHESIS

    /// -----------> BEGIN STOPPERS <----------- ///

    const iC = input.current // inputCurrent

    if (kP === "C") { input.current = ""; secInput.current = ""; update({}); return } // CLEAR INPUT AND STOP

    const iCS: string[] = iC.replace(/ /g,'').split("") // inputCurrentSplitted

    if (kP === "B") { // Backspace
      if ([" x ", " / "," + "," - "].includes(iC.slice(-3))) input.current = iC.slice(0,-3) // if last input is an operator: "123 + "
      else if (iC.slice(-8) === "Infinity") input.current = iC.slice(0,-8) // if last input is Infinity: "Infinity" // TEST
      else input.current = iC.slice(0, -1) // else erase last character
      secInput.current = ""
      update({})
      return
    } // EDIT PREVIOUS INPUT AND STOP

    if (
      (iC.length === 0 && ["/", ".","+","-","X",")"].includes(kP)) || // STOP IF ATTEMPT ) FIRST
      (iC.length === iC.replace(/ /g,'').length && kP === "=") || // STOP IF INPUT IS "1e+38" or "1e+" or IF THERE IS NO OPERATION SIGN AND ATTEMPT = //
      (parErr === true && kP === "=") || // STOP IF PARENTHESIS ERROR IS DISPLAYED & ATTEMPT "="
      (kP === "=" && ["x", "/", "+", "-"].every(op => iCS.indexOf(op) === -1)) || // STOP IF "=" IS PRESSED & INPUT DONT HAVE x / + or -
      ([" x ", " / "," + "," - ","("].includes(iC.slice(-3)) &&
        ["X", "/","+","-",")","."].includes(kP)) || // STOP IF ATTEMPT + AND + (REPEATED OPERATORS)
      iC.slice(-1) === ")" && kP === "." || // STOP IF ATTEMPT ).
      (iC.slice(-1) === "." && isNaN(parseInt(kP))) || // STOP IF ATTEMPT .. or .( or .x
      (!isNaN(parseInt(iC[iC.length - 1])) && !isNaN(parseInt(iC[iC.length - 2])) &&
      iC[iC.length - 3] === "." && !isNaN(parseInt(iC[iC.length - 4])) &&
      (!isNaN(parseInt(kP)) || kP === ".")) || // STOP IF ATTEMPT 3.999 or 3.77. (floating point number > 2)
      (kP === "." && !isNaN(parseInt(iC[iC.length - 1])) && iC[iC.length - 2] === "." &&
        !isNaN(parseInt(iC[iC.length - 3]))) || // STOP IF ATTEMPT 3.9.
      (iC.slice(-1) === ")" && kP === "(") || // STOP IF ATTEMPT )(
      (iC.slice(-1) === ")" && (!isNaN(parseInt(kP)) || kP === "N")) || // STOP IF ATTEMPT )9 or )N
      (["(", "N"].includes(kP) && !isNaN(parseInt(iC.slice(-1)))) || // STOP IF ATTEMPT 9( or 9N
      (iC.slice(-1) === "N" && ["X", "/", "+", "-", ".", "(", ")", "N"].includes(kP)) || // N = negative value // STOP IF ATTEMPT N+
      (kP === "=" && ([" x ", " / ", " + ", " - "].includes(iC.slice(-3)) ||
        ["(", "N"].includes(iC.slice(-1)) || iC.length === 0)) || // STOP IF ATTEMPT N= or += or ""
      (iC.slice(-8) === "Infinity" && (["(", "N", "."].includes(kP) || !isNaN(parseInt(kP)))) // STOP IF ATTEMPT Infinity( or InfinityN or Infinity9 or Infinity.
    ) { scrollEnd(); return }

    if (
      kP === "=" && iCS.filter((e: string) => e === "(").length !== iCS.filter((e: string) => e === ")").length
    ) { setParErr(true); scrollEnd(); return } // STOP IF (((( AND )) AMOUNT ARE UNEQUAL

    if (iC.includes("Infinity") && kP === "=") { input.current = "Infinity"; secInput.current = input.current ; scrollEnd(); update({}); return } // STOP IF INPUT INCLUDES "INFINITY" & ATTEMPT "="

    /// -----------> END STOPPERS <----------- ///

    /// -----------> BEGIN CALC <----------- ///
    if (kP === "=") { Adder({ scrollEnd, input, /* setInput, setSecInput, */ secInput, setParErr }); update({}); return }
    /// -----------> END CALC <----------- ///

    /// -----------> BEGIN INPUT UPDATE <----------- ///

    if (kP === "X") { input.current = iC + " x "; secInput.current = "" } // set operator with spaces
    else if (kP === "/") { input.current = iC + " / "; secInput.current = "" } // set operator with spaces
    else if (kP === "+") { input.current = iC + " + "; secInput.current = "" } // set operator with spaces
    else if (kP === "-") { input.current = iC + " - "; secInput.current = "" } // set operator with spaces
    else { input.current = iC + kP; secInput.current = "" }
    update({})

    /// -----------> END INPUT UPDATE <----------- ///
  }

  /// -----------> END PRE-CALC & CALC (Adder) <----------- ///

  const PortButtons =
    portButtons.concat(lastButtonPort).map((e, i) =>
      <OwnButton
        key={i} value={e.value} size={e.size} margin={e.margin}
        fontSize={OPCQH/1.5} handlePress={handlePress} small={e.small}
      />
    );

  const LandButtons =
    landButtons.concat(lastButtonLand).map((e, i) =>
      <OwnButton
        key={i} value={e.value} size={e.size} margin={e.margin}
        fontSize={OPCQH} handlePress={handlePress} state={state}
      />
    );

  const ButtonAbout =
    <TouchableHighlight
      underlayColor="#8aaeba"
      activeOpacity={1}
      style={s.question}
      onPress={() => state === 'tabletop' ? setShowCalc(false) : navigate('About')}
      //children={ <SimpleLineIcons name='question' size={40} color='red' /> }
      //children={ <SimpleLineIcons name='question' size={40} color='rgba(0, 0, 0, .7)' /> }
      //children={ <Text style={{size: 20}}>ASD</Text> }
      //children="asd"
    >
      <SimpleLineIcons name='emotsmile' size={40} color='red' />
    </TouchableHighlight>

  const PortCalc =
    <View
      style={[ s.outline, { marginTop: ins.top, marginBottom: ins.bottom } ]}
      children={
        <View onLayout={e => setOPCQH(e.nativeEvent.layout.height / 100)} style={[ s.contour, { aspectRatio: 2/3, width: parsedWidth - 30, maxHeight: parsedHeight - 130 } ]}>
          <View style={[ s.displayContainer, s.displayContainerPort, { height: `${(28.4/3)*2}%`, paddingLeft: vmin * 1, paddingRight: vmin * 1 } ]}>
            <ScrollView
              overScrollMode="never"
              ref={scrollRefUpper}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ height: '30%' }}
              children={ <Text style={[ s.secondaryResult, { fontSize: OPCQH * 3 } ]} children={ secInput.current.replaceAll(/N/g,"-") } /> }
            />
            <ScrollView
              overScrollMode="never"
              ref={scrollRefCenter}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ height: '40%' }}
              children={ <Text style={[ s.mainResult, { fontSize: OPCQH * 6 } ]} children={ input.current.replaceAll(/N/g,"-") } /> }
            />
            <View
              style={{ height: '30%' }}
              children={ parErr && <Text style={[ s.parErr, { fontSize: OPCQH * 3 } ]} children={`CHECK PARENTHESIS`} /> }
            />
          </View>

          { PortButtons }

          <View
            style={[ s.questionContainer, { width: '100%', height: 42, bottom: -55 } ]}
            children={ state !== 'book' && ButtonAbout }
          />

        </View>
      }
    />;

  const LandCalcDisplay =
    <>
      <ScrollView
        overScrollMode="never"
        ref={scrollRefUpper}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ height: '30%' }}
        children={ <Text style={[ s.secondaryResult, { fontSize: OPCQH * 5.5 } ]} children={secInput.current.replaceAll(/N/g,"-")} /> }
      />
      <ScrollView
        overScrollMode="never"
        ref={scrollRefCenter}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ height: '40%' }}
        children={ <Text style={[ s.mainResult, { fontSize: OPCQH * 9, lineHeight: OPCQH * 9.2 } ]} children={ input.current.replaceAll(/N/g,"-") } /> }
      />
      <View
        style={{ height: '30%' }}
        children={ parErr && <Text style={[ s.parErr, { fontSize: OPCQH * 5.5 } ]} children={'CHECK PARENTHESIS'} /> }
      />
    </>;

  const LandCalc =
    <View style={[ s.outline, { marginBottom: ins.bottom, marginTop: ins.top, /* marginRight: 100, marginLeft: ins.left */ } ]}>
      <View onLayout={e => setOPCQH(e.nativeEvent.layout.height / 100)} style={[ s.contour, { margin: 3, aspectRatio: 7/4, width: parsedWidth - 130, maxHeight: parsedHeight - 30 } ]}>
        <View
          style={[ // `${(11.14/4)*7}%`
            s.displayContainer,
            { width: '98%', marginLeft: '1%', height: `${(((400 / 7) - (((92/7)*3)+5)) / 4) * 7}%`, marginTop: '1%', paddingLeft: vmin * 1, paddingRight: vmin * 1 }
          ]}
          children={ LandCalcDisplay }
        />

        { LandButtons }

        <View
          style={[ s.questionContainer, { width: 42, height: '100%', right: -55 } ]}
          children={ ButtonAbout }
        />

      </View>
    </View>;

  // ****** ↓↓↓ MODAL SCHEME ↓↓↓ ******
  // zIndex
  // 1000001 ———————————— modalForegroundAbout
  // 1000000 ———————————— modalForegroundHome
  // ...     ———————————— ...rest of the App

  const ModalForegroundHome =
    <Animated.View
      style={[ s.modalForegroundHome, { /* backgroundColor: 'orange', */opacity: fadeAnim, pointerEvents: showModal ? 'auto' : 'none' } ]}
      children={
        <Pressable
          style={[ s.modalForegroundHomePressable, { /* backgroundColor: 'yellow', */ paddingTop: ins.top, paddingBottom: ins.bottom } ]}
          onPress={() => {console.log('CLICKED Home');updateShowModal(false)}}
        />
      }
    />

  useEffect(() => showModal ? fadeIn() : fadeOut(), [showModal])

  let currIndex = useAnimatedValue(0);

  const [ c, sC ] = useState([[0, 0, 255], [255, 0, 255]]) // color, setColor

  let currentColor = currIndex.interpolate({
    inputRange: [0, 1],
    outputRange: [`rgb(${c[0][0]}, ${c[0][1]}, ${c[0][2]})`, `rgb(${c[1][0]}, ${c[1][1]}, ${c[1][2]})`]
  });

  //let qq = 'rgb(255, 255, 255)'

  const updateValues = (num: any) => {
    sC(curr => {
      let copy = [...curr[num]]
      let randomIndex = Math.floor(Math.random() * 3) // 0, 1 or 2
      curr[num][randomIndex] === 255 ? copy[randomIndex] = 0 : copy[randomIndex] = 255
      return num === 1 ? [copy, curr[1]] : [curr[0], copy]
    })
    nextColor(+Boolean(!num))
  }

  const nextColor = (toValue: number) =>
    Animated.timing(currIndex, { toValue: toValue, duration: 5100, useNativeDriver: true, isInteraction: false }).start(
      ({finished}) => finished && updateValues(toValue)
    );

  useEffect(() => {
    state === 'tabletop' && nextColor(1)
    return () => currIndex.stopAnimation()
  }, [state])

  // useEffect(() => {
  //   return () => {
  //     //updateShowModal(false)
  //     Animated.timing(fadeAnim, { toValue: 0, duration: 0, useNativeDriver: true }).start();
  //   }
  // },[])

  return (
    <View style={s.background}>
      {/* <StatusBar barStyle={'dark-content'} translucent={true} backgroundColor={'transparent'} /> */}
      {/* { ModalForegroundScreen } */}
      {
        state === 'flat' ?

        PortCalc :

        state === 'tabletop' ?

        <View style={s.tabletopContainer}>
          <View /* UPPER SIDE */
            style={[ s.upperScreenTabletop, { height: hingeBounds.top, width: hingeBounds.right /* paddingRight: ins.right */ } ]}
          >

            {
              showCalc &&
              <View
                style={s.outline}
                children={
                  <View
                    onLayout={e => setOPCQH((e.nativeEvent.layout.height * 4) / 100)}
                    style={[ s.contour, { aspectRatio: 7/1, width: parsedWidth - 100, maxHeight: parsedHeight - 40 } ]}
                  >
                    <View
                      style={[ s.displayContainer, s.displayContainerLand, { height: `${((100 / 7) - 2) * 7}%`, paddingLeft: vmin * 1, paddingRight: vmin * 1 } ]}
                      children={ LandCalcDisplay }
                    />
                    <View
                      style={[ s.questionContainer, { width: '100%', height: 42, bottom: -55 } ]}
                      children={ /* state !== 'book' && */ ButtonAbout }
                    />
                  </View>
                }
              />
            }

            {/* { ModalForegroundScreen } */}
            { ModalForegroundHome }
            { !showCalc && (aboutUp ? AboutScreen : (KnowMoreScreen(hingeBounds.top))) }

          </View>
          <Animated.View /* LOWER SIDE */
            style={[ s.lowerScreenTabletop, { top: hingeBounds.bottom - hingeBounds.top, height: height - hingeBounds.bottom, width: hingeBounds.right, backgroundColor: (state === 'tabletop' && showCalc) ? currentColor : 'white' } ]}
          >

            {
              showCalc &&
              <View
                style={[ s.outline, { marginBottom: ins.bottom } ]}
                children={
                  <View
                    style={[ s.contour, { aspectRatio: 7/3, width: parsedWidth - 100, maxHeight: parsedHeight - 40 } ]}
                    children={ <View style={s.landButtonsContainer} children={LandButtons} /> }
                  />
                }
              />
            }

            {/* { ModalForegroundScreen } */}
            { ModalForegroundHome }
            { !showCalc && ( aboutUp ? KnowMoreScreen(height - hingeBounds.bottom) : AboutScreen ) }

          </Animated.View>
        </View> :

        state === 'book' ?

        <View style={s.bookContainer} /* BOOK */>
          <View style={[ s.eachSideBook, { width: hingeBounds.left - ins.left } ]} /* LEFT SIDE */ >
            {/* { calcLeft && ModalForegroundScreen } */}
            { ModalForegroundHome }
            { calcLeft ? PortCalc : ( showKnowMore ? KnowMoreScreen(height) : AboutScreen ) }
          </View>
          <View style={[ s.eachSideBook, { left: hingeBounds.right - hingeBounds.left, width: width - hingeBounds.right - ins.right } ]} /* RIGHT SIDE */ >
            {/* { !calcLeft && ModalForegroundScreen } */}
            { ModalForegroundHome }
            { calcLeft ? ( showKnowMore ? KnowMoreScreen(height) : AboutScreen ) : PortCalc }
          </View>
        </View> :

        state === 'portrait' ?

        PortCalc :

        LandCalc

      }
    </View>
  );
}

export default Home;
