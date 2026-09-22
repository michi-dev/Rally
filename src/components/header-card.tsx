import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';

type HeaderCardProps = {
    logo: string;
    title: string;
    subtitle: string;
};

const HeaderCard = ({logo, title, subtitle}:HeaderCardProps) => {
  return (
    <View style={styles.container}>
        <Text style={styles.logo}>{logo}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
   )
}

const styles = StyleSheet.create ({
    container: {
        alignSelf: 'stretch',
        backgroundColor: '#17485A',
        marginHorizontal: -Spacing.four,
        paddingTop: 50,
        paddingLeft: 10,
    },
    logo: {
        color: '#FFFFFF',
        fontSize: 10,
        marginTop: 10,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 30,
        marginTop: 10,
        fontWeight: 'bold',
    },

    subtitle: {
        color: '#90c4d8',
        fontSize: 10,
        marginTop: 10,
        paddingBottom: 10,
    }
})

export default HeaderCard;
