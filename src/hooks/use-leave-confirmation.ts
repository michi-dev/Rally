import { useNavigation } from 'expo-router';
import { useEffect, type RefObject } from 'react';
import { Alert, Platform } from 'react-native';

const DISCARD_TITLE = 'Match verwerfen?';
const DISCARD_MESSAGE = 'Der aktuelle Spielstand wird nicht gespeichert.';

/** Alert.alert gibt es im Browser nicht, dort übernimmt window.confirm. */
function confirmDiscard(onDiscard: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${DISCARD_TITLE} ${DISCARD_MESSAGE}`)) onDiscard();
    return;
  }
  Alert.alert(DISCARD_TITLE, DISCARD_MESSAGE, [
    { text: 'Weiterspielen', style: 'cancel' },
    { text: 'Verwerfen', style: 'destructive', onPress: onDiscard },
  ]);
}

/**
 * Fragt nach, bevor ein Screen mit ungespeichertem Inhalt verlassen wird.
 * `hasUnsavedRef` ist ein Ref, damit z.B. nach dem Speichern sofort ohne Rückfrage
 * navigiert werden kann, ohne auf den nächsten Render zu warten.
 */
export function useLeaveConfirmation(hasUnsavedRef: RefObject<boolean>) {
  const navigation = useNavigation();

  // Abbrechen-Button, Zurück-Geste (iOS) und Zurück-Taste (Android).
  useEffect(
    () =>
      navigation.addListener('beforeRemove', (event) => {
        if (!hasUnsavedRef.current) return;
        event.preventDefault();
        confirmDiscard(() => {
          hasUnsavedRef.current = false;
          navigation.dispatch(event.data.action);
        });
      }),
    [navigation, hasUnsavedRef],
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Neuladen oder Tab schliessen: Der Browser zeigt seine eigene Rückfrage.
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (hasUnsavedRef.current) event.preventDefault();
    }

    // Browser-Zurück/-Vorwärts: Expo Router setzt dabei den Navigationszustand direkt neu,
    // ohne `beforeRemove` auszulösen. Die Navigation API meldet solche Sprünge aber vorher
    // per `navigate`-Event, das sich abbrechen lässt. Auch "Abbrechen" landet hier, dann
    // hat `beforeRemove` aber schon nachgefragt und `hasUnsavedRef` ist bereits false.
    // Browser ohne Navigation API fragen beim Browser-Zurück nicht nach.
    function handleNavigate(event: NavigateEvent) {
      if (event.navigationType !== 'traverse' || !event.cancelable) return;
      if (!hasUnsavedRef.current) return;
      if (window.confirm(`${DISCARD_TITLE} ${DISCARD_MESSAGE}`)) {
        hasUnsavedRef.current = false;
      } else {
        event.preventDefault();
      }
    }

    const browserNavigation = window.navigation;
    window.addEventListener('beforeunload', handleBeforeUnload);
    browserNavigation?.addEventListener('navigate', handleNavigate);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      browserNavigation?.removeEventListener('navigate', handleNavigate);
    };
  }, [hasUnsavedRef]);
}
