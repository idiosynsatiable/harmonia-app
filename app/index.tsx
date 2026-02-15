import { Redirect } from "expo-router";

/**
 * Root index - redirects to explore tab as default entry
 * This ensures the app always boots into the premium Explore experience
 */
export default function Index() {
  return <Redirect href="/(tabs)/explore" />;
}
