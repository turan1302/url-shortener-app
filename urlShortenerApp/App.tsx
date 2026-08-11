import React, { useEffect } from 'react'
import Routes from "./src/routes/index";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ImmersiveMode from "react-native-immersive-mode";

const App = () => {

  useEffect(() => {
    ImmersiveMode.setBarMode("FullSticky");
    ImmersiveMode.setBarTranslucent(true);
  }, []);



  return (
    <SafeAreaProvider>
      <Routes />
    </SafeAreaProvider>
  )
}

export default App;