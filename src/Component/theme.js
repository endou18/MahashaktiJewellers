import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      primary: '#2D3748',
      secondary: '#1A202C',
      accent: '#63B3ED',
    },
    gray: {
      900: '#171923',
      800: '#1A202C',
    },
  },
});

export default theme;
