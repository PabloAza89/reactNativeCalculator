import { ReactElement } from 'react';
import { TouchableHighlight } from 'react-native';
import { Text } from '../../utils/Text';
import { s } from './OwnButtonCSS';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { /* OwnButtonI, ComponentI */ } from '../../interfaces/interfaces';

//export function OwnButton({ scrollEnd, parErr, value, input, setInput, smaller, setParErr, setSecInput, vmin }: OwnButtonI): ReactElement {
const OwnButton = ({ button, size, margin, fontSize, small, state, handlePress }: any): ReactElement => {

  return (
    <TouchableHighlight
      underlayColor="#dddddd"
      activeOpacity={1}
      style={[ state === 'tabletop' ? s.ownButtonTabletop : s.ownButton, { width: size, marginLeft: margin } ]}
      onPress={() => handlePress(button)} // button => kP = keyPressed
      children={
        <Text
          style={[ s.text, { fontSize: small ? fontSize * 10 : fontSize * 12 } ]}
          children={
            button === "B" ?
            <Ionicons name='backspace' size={ small ? fontSize * 10 : fontSize * 12 } color='rgba(0, 0, 0, .54)' /> :
            button === "N" ?
            "-X" :
            button === "-" ?
            "–" :
            button
          }
        />
      }
    />
  );
}

export default OwnButton;