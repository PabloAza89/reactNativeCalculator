import { forwardRef } from 'react';
import { ScrollView, requireNativeComponent, View } from 'react-native';

const CustomScrollView = requireNativeComponent('RCScrollView')

// const CustomScrollViewComponent = forwardRef((props: any, ref: any) => {
//   return (
//     <CustomScrollView
//       {...props}
//       ref={ref}
//       scrollbarPadding={{
//         left: props.scrollbarPadding?.left | 0,
//         top: props.scrollbarPadding?.top | 0,
//         right: props.scrollbarPadding?.right | 0,
//         bottom: props.scrollbarPadding?.bottom | 0,
//       }}
//     />
//   )
// });

// const CustomScrollViewComponent = (props: any) => {
//   return <CustomScrollView
//     {...props}
//   />
// }

const CustomScrollViewComponent = (props: any) => {
  return <CustomScrollView
    {...props}
    scrollbarPadding={{
      left: props.scrollbarPadding?.left | 0,
      top: props.scrollbarPadding?.top | 0,
      right: props.scrollbarPadding?.right | 0,
      bottom: props.scrollbarPadding?.bottom | 0,
    }}
  />
}

export default CustomScrollViewComponent;