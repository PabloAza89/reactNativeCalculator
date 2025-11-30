import { forwardRef } from 'react';
import { ScrollView } from 'react-native';

const CustomScrollView = forwardRef((props: any, ref: any) => {
  return (
    <ScrollView
      {...props}
      ref={ref}
      scrollbarPadding={{
        left: props.scrollbarPadding?.left | 0,
        top: props.scrollbarPadding?.top | 0,
        right: props.scrollbarPadding?.right | 0,
        bottom: props.scrollbarPadding?.bottom | 0,
      }}
    />
  )
});

export default CustomScrollView;