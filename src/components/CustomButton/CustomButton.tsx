import { forwardRef } from 'react';
import { ScrollView, View } from 'react-native';

const CustomButton = (props: any) => {
  return (
    <View
      {...props.style}
      style={[{
        marginLeft: props.margin?.left | 0,
        marginTop: props.margin?.top | 0,
        marginRight: props.margin?.right | 0,
        marginBottom: props.margin?.bottom | 0,
      }]}
    >
      <props.type
        name={props.name}
        size={props.size}
        color={props.color}
        onPress={props.onPress}
        style={props.iconStyle}
        children={props.children}
      />
    </View>
  )
};

export default CustomButton;

