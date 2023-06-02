import { StyleSheet } from 'react-native';
import colors from '../../../../Themes/Colors';
import metrics from '../../../../Themes/Metrics';

export default StyleSheet.create({
    cellContainer: {
        flex: 1,
        marginBottom: metrics.dimen_8,
        backgroundColor: colors.white,
      },
      postedOnText: {
        fontFamily: metrics.Lato_Regular,
        fontSize: metrics.text_small,
        color: '#7A818A',
      },
      boldText: {
        fontFamily: metrics.Lato_Bold,
        fontSize: metrics.text_normal,
        color: 'rgba(61, 64, 70, 1)',
      },
});