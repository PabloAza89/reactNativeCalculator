import { ReactElement, useState, useEffect, useRef } from 'react';
import {
  View, StatusBar, ScrollView, Pressable, InteractionManager, ActivityIndicator,
  NativeSyntheticEvent, NativeScrollEvent, Animated, useAnimatedValue,
  UIManager, findNodeHandle, Platform, Dimensions
} from 'react-native';
import { s } from './KnowMoreCSS';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from '../../utils/Text';
import { scrollBarSize, iconColor } from '../../utils/constants';
import { counterI, KnowMoreI, goUpI, ComponentI } from '../../interfaces/interfaces';
import CustomScrollView from '../CustomScrollView/CustomScrollView';
import CustomButton from '../CustomButton/CustomButton';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

//function KnowMore({ navigation: { navigate }, opw, port }: KnowMoreI): ReactElement {
const KnowMore = ({ navigation, /* opw, */ height, ins, state, twoScreens, aboutUp, switchSide, nextScreen,   }: KnowMoreI): ReactElement => {

  //const { height: screenHeight } = Dimensions.get('window');
  //console.log("screenHeight", screenHeight)
  // console.log("XXXXXXXXXXXX height KNOWMORE", height)
  // console.log("XXXXXXXXXXXX ins", ins)


  const { navigate } = navigation;

  useEffect(() => {
    (navigation.getState().routes.at(-1)?.name === 'KnowMore' && (state === 'tabletop' || state === 'book')) && navigate('Home', { lastRoute: 'KnowMore' })
  }, [state])

  const goUp = () => UIManager.dispatchViewManagerCommand(viewId, 0)

  let lazyLoad = [
    <View key={0} style={s.eachItem}>
      <Text style={s.leftItem} children={'-X'} />
      <Text style={s.rightItem} children={'Negative number. Press it before your number.'} />
    </View>,
    <View key={1} style={s.eachItem}>
      <Text style={s.leftItem} children={'( )'}/>
      <View>
        <Text style={s.rightItem} children={'Chain any amount of parenthesis and calculator will parse the result, following the next rules:'} />
        <View style={s.eachItemInner}>
          <Text style={s.leftItemInner} children={'•'} />
          <Text style={s.rightItemInner} children={'Innermost parentheses calc will be done.'} />
        </View>
        <View style={s.eachItemInner}>
          <Text style={s.leftItemInner} children={'•'} />
          <Text style={s.rightItemInner} children={`Inside that parentheses, or if not present, will do the next, from left to right, in this order: All 'x', then all '/', then all '+' and finally all '-'.`} />
        </View>
      </View>
      <Text style={s.rightItem} children={'Then will quit that parenthesis, if exists, and do the same as above.'} />
    </View>,
    <View key={2} style={s.eachItem}>
      <Text style={[ s.leftItem, s.sn ]} children={'1e+12'} />
      <View>
        <Text style={s.rightItem} children={'If the integer side, in the result, is more than 12 digits (e.g.: 1000000000001.23 + 1.23), it will be converted to scientific notation.\nResults in scientific notation are parsed as follows:'} />
        <View style={s.eachItemInner}>
          <Text style={s.leftItemInner} children={'•'} />
          <Text style={s.rightItemInner} children={'If exponent have 1 digits, decimal part are 8 places.'} />
        </View>
        <View style={s.eachItemInner}>
          <Text style={s.leftItemInner} children={'•'} />
          <Text style={s.rightItemInner} children={'If exponent have 2 digits, decimal part are 7 places. And so..'} />
        </View>
        <View style={s.eachItemInner}>
          <Text style={s.leftItemInner} children={'•'} />
          <Text style={s.rightItemInner} children={'If decimal part have trailing zeros, they will be removed.'} />
        </View>
      </View>
    </View>,
    <View key={3} style={s.eachItem}>
      <FontAwesome5
        name='infinity'
        size={30}
        color={iconColor}
        style={s.leftItem}
      />
      <Text style={s.rightItem} children={'Numbers largers than 1.797693e+307 (positive or negative) are treated as Infinity. After that, every calc will output Infinity, or -Infinity, as applicable.'} />
    </View>,
    <View key={4} style={s.eachItem}>
      <Entypo
        name='new'
        size={30}
        color={iconColor}
        style={s.leftItem}
      />
      <Text style={s.rightItem} children={'All new input characters are placed to the right.'} />
    </View>,
    <View key={5} style={s.eachItem}>
      <Ionicons
        name='backspace'
        size={40}
        color={iconColor}
        style={s.leftItem}
      />
      <Text style={s.rightItem} children={'Erase the last character.'} />
    </View>,
    <View key={6} style={s.eachItem}>
      <Text style={s.leftItem} children={'C'} />
      <Text style={s.rightItem} children={'Delete the entire input.'} />
    </View>,
    <View key={7} style={s.eachItem}>
      <Text style={[ s.leftItem, s.dot ]} children={'.'} />
      <Text style={s.rightItem} children={'Decimal numbers can have up to two digits maximum. But decimal results can be more than 2 digits long !'} />
    </View>,
    <View key={8} style={s.eachItem}>
      <Text style={s.leftItem} children={'='} />
      <Text style={s.rightItem} children={`If there is no calc to do ('x', '/', '+' or '-') '=' will not work.\nIf calc is valid, result will be shown and, in a smaller upper place, the current calc will be shown.\nIf result or current calc is larger than screen, you can scroll to see entire result/calc.`} />
    </View>,
    <View key={9} style={[ s.eachItem, { marginBottom: 10 } ]}>
      <MaterialIcons
        name='phonelink-erase'
        size={30}
        color={iconColor}
        style={s.leftItem}
      />
      <Text style={s.rightItem} children={'This App does not have access to your device.'} />
    </View>
  ]

  const [ loaded, setLoaded ] = useState(false)

  // useEffect(() => {
  //   const interactionPromise = InteractionManager.runAfterInteractions(() =>  setLoaded(true));
  //   return () => interactionPromise.cancel();
  // }, []);

  useEffect(() => { setTimeout(() => setLoaded(true), 0) }, []); // Former: InteractionManager.runAfterInteractions()

  const [ showButton, setShowButton ] = useState(false)

  /// BEGIN BACKGROUND ANIMATION ///

  const parsedInsTop = ins.top === 0 ? 1 : ins.top // PREVENT NaN WHEN RENDER (on native side)
  const parsedHeight = height === 0 ? 1 : height // PREVENT NaN WHEN RENDER (on native side)
  const topByHeight = ins.top / parsedHeight
  //console.log("parsedHeight", parsedHeight)
  //console.log("topByHeight", topByHeight)

  let currIndex = useAnimatedValue(0);

  const [ c, sC ] = useState([[0, 0, 255], [255, 0, 255]]) // color, setColor

  let currentColor = currIndex.interpolate({
    inputRange: [0, 1],
    outputRange: [`rgb(${c[0][0]}, ${c[0][1]}, ${c[0][2]})`, `rgb(${c[1][0]}, ${c[1][1]}, ${c[1][2]})`]
  });

  const linearGradientColors = [ 'rgba(0, 0, 0, 0)', 'rgb(255, 255, 255)' ]

  //console.log(`Android: ${Platform.Version}, ins.bottom: ${ins.bottom}`)

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
    nextColor(1)
    return () => currIndex.stopAnimation()
  }, [])

  /// END BACKGROUND ANIMATION ///

  /// BEGIN CUSTOMSCROLLVIEW ///

  const scrollRef = useRef<ScrollView>(null);

  const [ viewId, setViewId ] = useState<number | null>(0)

  useEffect(() => setViewId(findNodeHandle(scrollRef.current)), [])

  const scrollHandler = (val: number) => {
    val > 100 ? setShowButton(true) : setShowButton(false);
    val < 0 && UIManager.dispatchViewManagerCommand(viewId, 0);
  }

  /// END CUSTOMSCROLLVIEW ///

  // ****** ↓↓↓ BACKGROUND ANIMATION SCHEME ↓↓↓ ******
  // zIndex
  //   5     ——             UP BUTTON
  //   4                 —— GRADIENT + OPACITY (StatusBar)
  //   3     —————————————— SCROLLVIEW
  //   2     ————————————   GRADIENT + OPACITY
  //   1     —————————————— ANIMATED COLORS + GRADIENT

  // console.log("ins.left", ins.left)
  // console.log("ins.top", ins.top)
  // console.log("ins.right", ins.right)
  // console.log("ins.bottom", ins.bottom)

  return (// testing paddingBottom: ins.bottom
    <View style={[s.mainContainer, { /* flex: 1 */ }]}>

      {
        !(state === 'tabletop' && aboutUp) && // STATUS BAR
        <LinearGradient
          colors={linearGradientColors}
          style={[ s.linearGradient, { zIndex: 4, height: ins.top } ]}
          //start={[ 0, state === 'tabletop' ?  hingeBounds.top / parsedInsTop : height / parsedInsTop ]}
          //start={[ 0, height / parsedInsTop ]}
          start={{ x: 0, y: height / parsedInsTop }}
          //end={[ 1, 0 ]}
          end={{ x: 1, y: 0 }}
        />
      }

      <LinearGradient
        colors={linearGradientColors} // BODY
        style={[ s.linearGradient, { zIndex: 2 },  (state === 'tabletop' && aboutUp) ? { height: 0, top: 0 } : { height: height - (ins.top*1), top: ins.top } ]}
        //start={[ 0, 1 - topByHeight ]}
        start={{ x: 0, y: 1 - topByHeight }}
        //end={[ 1, topByHeight * -1 ]}
        end={{ x: 1, y: topByHeight * -1 }}
      />

      <AnimatedLinearGradient
        colors={linearGradientColors} // ENTIRE WINDOW
        style={[ s.animatedLinearGradient, { backgroundColor: currentColor } ]}
        //start={[ 0, 1 ]} // [ XfromLeft, YfromTop ]
        start={{ x: 0, y: 1 }}
        //end={[ 1, 0 ]}   // [ XfromLeft, YfromTop ]
        end={{ x: 1, y: 0 }}
      />

      <CustomScrollView
        //ref={scrollRef}
        //onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => scrollHandler(e.nativeEvent.contentOffset.y)}
        persistentScrollbar={true}
        scrollbarPadding={{
          //top: (state === 'tabletop' && aboutUp) ? 0 : ins.top * 1,
          top: 24,
          right: ins.right,
          //bottom: (state === 'tabletop' && !aboutUp) ? 0 : ins.bottom * 1,
          bottom: 24,
        }}
        contentContainerStyle={{
          paddingLeft: ins.left,
          //paddingTop: ins.top * 1, // HERE
          //paddingTop: ins.top === 0 || (state === 'tabletop' && aboutUp) ? 24 : ins.top * 1, // HERE
          //paddingTop: 100, // HERE
          paddingRight: ins.right,
          paddingBottom: (state === 'tabletop' && !aboutUp) ? 0 : ins.bottom * 1,
          //paddingBottom: 24,
        }}
        style={[ s.customScrollView, {}]}
      >
        <View collapsable={false} style={[ s.background, { width: '100%', paddingTop: 24, paddingBottom: 24, } ]}>
            <View style={[ s.buttonContainer, { marginTop: ins.top === 0 || (state === 'tabletop' && aboutUp) ? 0 : 7 } ]}>

              {
                twoScreens ?
                <CustomButton
                  type={MaterialCommunityIcons.Button}
                  name={ state === 'tabletop' ? 'swap-vertical-bold' : 'swap-horizontal-bold' }
                  size={30}
                  color={iconColor}
                  onPress={() => switchSide()}
                  margin={{ right: 12 }}
                  children={ <Text style={[ s.textInButton, s.twoLines ]} children={'SWITCH\nSCREENS'} /> }
                /> :
                <CustomButton
                  type={Ionicons.Button}
                  name={'chevron-back-circle-sharp'}
                  size={30}
                  color={iconColor}
                  onPress={() => navigate('About')}
                  margin={{ right: 12 }}
                  children={ <Text style={[ s.textInButton, s.oneLine ]} children={'BACK'} /> }
                />
              }

              {/* <View style={s.space} /> */}

              {
                twoScreens && state === 'tabletop' ?
                <CustomButton
                  type={Ionicons.Button}
                  name={'calculator-sharp'}
                  size={30}
                  color={iconColor}
                  onPress={() => nextScreen()}
                  margin={{ left: 12 }}
                  //style={{ height: 30, backgroundColor: 'red' }}
                  children={ <Text style={[ s.textInButton, s.oneLine ]} children={'HOME'} /> }
                /> :
                twoScreens ?
                <CustomButton
                  type={SimpleLineIcons.Button}
                  name={'question'}
                  size={25}
                  color={iconColor}
                  onPress={() => nextScreen()}
                  margin={{ left: 12 }}
                  children={ <Text style={[ s.textInButton, s.oneLine ]} children={'ABOUT'} /> }
                /> :
                <CustomButton
                  type={Ionicons.Button}
                  name={'home'}
                  size={30}
                  color={iconColor}
                  onPress={() => navigate('Home')}
                  margin={{ left: 12 }}
                  children={ <Text style={[ s.textInButton, s.oneLine ]} children={'HOME'} /> }
                />
              }

            </View>

            <Text style={s.centerText} children={'Welcome to my very first\nAndroid App: A Classic Calculator !'} />
            <Text style={s.leftText} children={'Below I will give you some tips if you have any doubt:'} />

            { loaded ? lazyLoad.map(e => e) : <ActivityIndicator size="large" color="#2196F3" /> }

          </View>
      </CustomScrollView>

      {
        showButton &&
        <Pressable
          style={[ s.floatButton, {
            bottom: (state === 'tabletop' && !aboutUp) ? 7 : ins.bottom + 7,
            right: ins.right + 11 // 7+4(scrollBarWidth)
          } ]}
          onPress={goUp}
          children={ <Text style={s.floatButtonText} children={'UP'} /> }
        />
      }
    </View>
  );
}

export default KnowMore;