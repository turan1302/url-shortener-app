import { useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Switch,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import styles from './styles';
import AppUrl from '../../RestAPI/AppUrl';
import RestClient from '../../RestAPI/RestClient';
import * as NavigationService from '../../common/NavigationService';

const pad = (n) => String(n).padStart(2, '0');

const formatDate = (value) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

const isActiveStatus = (status) => Number(status) === 1;

const Stats = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const shortUrl = route.params?.shortUrl;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchStats = useCallback(
    async (isRefresh = false) => {
      if (!shortUrl) {
        setError('Short URL bulunamadı.');
        setLoading(false);
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      const result = await RestClient.getRequest(
        `${AppUrl.getLinkStats}/${shortUrl}`,
      );

      if (result?.status >= 200 && result?.status < 300 && result?.data) {
        setStats(result.data);
      } else {
        setStats(null);
        setError(result?.data?.message || 'İstatistikler yüklenemedi.');
      }

      setLoading(false);
      setRefreshing(false);
    },
    [shortUrl],
  );

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats]),
  );

  const changeStatus = async () => {
    if (!shortUrl || statusLoading) {
      return;
    }

    setStatusLoading(true);
    const result = await RestClient.postRequest(
      `${AppUrl.changeStatus}/${shortUrl}`,
    );

    if (result?.status >= 200 && result?.status < 300 && result?.data) {
      setStats(result.data);
    } else {
      Alert.alert(
        'Durum değiştirilemedi',
        result?.data?.message || 'Link durumu güncellenirken bir hata oluştu.',
      );
    }

    setStatusLoading(false);
  };

  const active = isActiveStatus(stats?.status);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          onPress={() => NavigationService.goBack()}
        >
          <Feather name="arrow-left" size={20} color="#C8F542" />
        </Pressable>
        <Text style={styles.topTitle}>STATS</Text>
        <View style={styles.backButtonSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchStats(true)}
            tintColor="#C8F542"
            colors={['#C8F542']}
          />
        }
      >
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator color="#C8F542" />
          </View>
        ) : error ? (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={() => fetchStats()}>
              <Text style={styles.retryText}>RETRY</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.kicker}>LINK DETAIL</Text>
            <Text style={styles.shortUrl}>{stats?.short_url}</Text>
            <Text style={styles.longUrl}>{stats?.url}</Text>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>VIEWS</Text>
              <Text style={styles.statValue}>{stats?.view ?? 0}</Text>
            </View>

            <View style={styles.statusCard}>
              <View style={styles.statusInfo}>
                <Text style={styles.statLabel}>STATUS</Text>
                <Text
                  style={[
                    styles.statusValue,
                    active ? styles.statusActive : styles.statusInactive,
                  ]}
                >
                  {active ? 'Active' : 'Inactive'}
                </Text>
              </View>

              {statusLoading ? (
                <ActivityIndicator color="#C8F542" />
              ) : (
                <Switch
                  value={active}
                  onValueChange={changeStatus}
                  trackColor={{ false: '#3A3A3A', true: 'rgba(200, 245, 66, 0.45)' }}
                  thumbColor={active ? '#C8F542' : '#9A9A9A'}
                  ios_backgroundColor="#3A3A3A"
                />
              )}
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ID</Text>
                <Text style={styles.infoValue}>{stats?.id ?? '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CREATED</Text>
                <Text style={styles.infoValue}>{formatDate(stats?.created_at)}</Text>
              </View>
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={styles.infoLabel}>UPDATED</Text>
                <Text style={styles.infoValue}>{formatDate(stats?.updated_at)}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Stats;
