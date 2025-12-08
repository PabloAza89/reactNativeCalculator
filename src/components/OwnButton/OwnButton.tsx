import { ReactElement } from 'react';
import { TouchableHighlight } from 'react-native';
import { Text } from '../../utils/Text';
import { s } from './OwnButtonCSS';
//import { Ionicons } from '@expo/vector-icons';
//import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Adder } from '../../utils/Adder';
import { OwnButtonI, ComponentI } from '../../interfaces/interfaces';

//export function OwnButton({ scrollEnd, parErr, value, input, setInput, smaller, setParErr, setSecInput, vmin }: OwnButtonI): ReactElement {
const OwnButton = ({ value, size, margin, fontSize, small, state, handlePress }: any): ReactElement => {

  // <Ionicons name='backspace' size={ small ? fontSize * 10 : fontSize * 12 } color='rgba(0, 0, 0, .54)' /> :

  return (
    <TouchableHighlight
      underlayColor="#dddddd"
      activeOpacity={1}
      style={[ state === 'tabletop' ? s.ownButtonTabletop : s.ownButton, { width: size, marginLeft: margin } ]}
      onPress={() => handlePress(value)} // value = keyPressed = kP
      children={
        <Text
          style={[ s.text, { fontSize: small ? fontSize * 10 : fontSize * 12 } ]}
          children={
            value === "B" ?
            <Ionicons name='backspace' size={ small ? fontSize * 10 : fontSize * 12 } color='rgba(0, 0, 0, .54)' /> :
            value === "N" ?
            "-X" :
            value === "-" ?
            "–" :
            value
          }
        />
      }
    />
  );
}

export default OwnButton;