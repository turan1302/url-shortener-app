import { View, Text, StatusBar } from 'react-native';
import { useEffect } from 'react';
import styles from './styles';
import * as NavigationService from '../../common/NavigationService';

const Splash = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      NavigationService.reset();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <View style={styles.grid}>
        <View style={styles.gridLineH1} />
        <View style={styles.gridLineH2} />
        <View style={styles.gridLineV1} />
        <View style={styles.gridLineV2} />
      </View>

      <View style={styles.cornerTL} />
      <View style={styles.cornerBR} />

      <View style={styles.content}>
        <Text style={styles.code}>u/r/l</Text>

        <View style={styles.markWrap}>
          <View style={styles.ring} />
          <View style={styles.ringInner} />
          <View style={styles.slash} />
        </View>

        <Text style={styles.brand}>SHORT</Text>
        <Text style={styles.brandSoft}>URL</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>v1.0 · READY</Text>
        </View>
      </View>

      <Text style={styles.footer}>url shortener</Text>
    </View>
  );
};

export default Splash;
