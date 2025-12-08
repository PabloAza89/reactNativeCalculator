import { Text as TextReactNative } from 'react-native';

export const Text = (props: any) => <TextReactNative {...props} style={[ props.style, { fontFamily: 'sans-serif-medium'/* , fontSize: 10 */ } ]} />