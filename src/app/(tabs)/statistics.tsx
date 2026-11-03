import HeaderCard from '@/components/header-card';
import { Screen } from '@/components/screen';
import { Text } from 'react-native';

//header Konfiguration
export default function NewMatchScreen() {
  return (
    <Screen>
      <HeaderCard
        logo="Rally"
        title="Statistik"
        subtitle="Übersicht der Matches"
      />
      <Text>Form comes here</Text> 
    </Screen>
  );
}