import { forwardRef } from 'react';
import { requireNativeComponent, View } from 'react-native';

const CustomScrollView = requireNativeComponent('CustomScrollView')

const CustomScrollViewComponent = forwardRef((props: any, ref: any) => {
  return (
    <CustomScrollView
      {...props}
      ref={ref}
      scrollbarPadding={{
        left: props.scrollbarPadding?.left ?? 0,
        top: props.scrollbarPadding?.top ?? 0,
        right: props.scrollbarPadding?.right ?? 0,
        bottom: props.scrollbarPadding?.bottom ?? 0,
      }}
    >
      <View collapsable={false} style={{ ...props.contentContainerStyle }}>
        { props.children }
      </View>
    </CustomScrollView>
  )
})

export default CustomScrollViewComponent;