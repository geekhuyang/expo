import { UnavailabilityError } from '@unimodules/core';
import ExpoSplashScreen from './ExpoSplashScreen';
export { default as AppLoading } from './AppLoading';
export * from './AppLoading';

/**
 * Makes the native splash screen stay visible until `SplashScreen.hideAsync()` is called.
 *
 * @example
 * ```typescript
 * class App extends React.Component {
 *   async componentDidMount() {
 *     await SplashScreen.preventAutoHideAsync();
 *   }
 *   ...
 * }
 * ```
 */
export async function preventAutoHideAsync() {
  if (!ExpoSplashScreen.preventAutoHideAsync) {
    throw new UnavailabilityError('expo-splash-screen', 'preventAutoHideAsync');
  }
  return await ExpoSplashScreen.preventAutoHideAsync();
}

export async function hideAsync() {
  if (!ExpoSplashScreen.hideAsync) {
    throw new UnavailabilityError('expo-splash-screen', 'hideAsync');
  }
  return await ExpoSplashScreen.hideAsync();
}
