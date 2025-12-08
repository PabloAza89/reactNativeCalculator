declare module 'react-native-vector-icons/FontAwesome5' {

  import { ComponentType } from 'react'

  interface FontAwesome5Static {
    getStyledIconSet(style: 'regular' | 'light' | 'solid' | 'brand'): {
      loadFont: () => Promise<boolean>
    }
  }

  const FontAwesome5: ComponentType<any> & FontAwesome5Static

  export default FontAwesome5
}