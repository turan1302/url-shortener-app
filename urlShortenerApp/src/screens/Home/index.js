import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import Feather from 'react-native-vector-icons/Feather';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from './styles';
import AppUrl from '../../RestAPI/AppUrl';
import RestClient from '../../RestAPI/RestClient';
import * as NavigationService from '../../common/NavigationService';

const RESULT_VISIBLE_MS = 30000;

const createLinkSchema = Yup.object().shape({
  url: Yup.string()
    .trim()
    .required('URL zorunlu')
    .url('Geçerli bir URL girin'),
});

const Home = () => {
  const insets = useSafeAreaInsets();
  const copyResetRef = useRef(null);
  const createdShortUrlTimerRef = useRef(null);
  const createdShortUrlIntervalRef = useRef(null);
  const resultProgress = useRef(new Animated.Value(1)).current;
  const resultAnimationRef = useRef(null);
  const [createdShortUrl, setCreatedShortUrl] = useState('');
  const [resultSecondsLeft, setResultSecondsLeft] = useState(0);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);

  const clearCreatedShortUrlTimers = () => {
    if (createdShortUrlTimerRef.current) {
      clearTimeout(createdShortUrlTimerRef.current);
      createdShortUrlTimerRef.current = null;
    }
    if (createdShortUrlIntervalRef.current) {
      clearInterval(createdShortUrlIntervalRef.current);
      createdShortUrlIntervalRef.current = null;
    }
    if (resultAnimationRef.current) {
      resultAnimationRef.current.stop();
      resultAnimationRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearCreatedShortUrlTimers();
      if (copyResetRef.current) {
        clearTimeout(copyResetRef.current);
      }
    };
  }, []);

  const showCreatedShortUrl = (value) => {
    clearCreatedShortUrlTimers();

    const totalSeconds = RESULT_VISIBLE_MS / 1000;
    setCreatedShortUrl(value);
    setResultSecondsLeft(totalSeconds);
    resultProgress.setValue(1);

    resultAnimationRef.current = Animated.timing(resultProgress, {
      toValue: 0,
      duration: RESULT_VISIBLE_MS,
      useNativeDriver: false,
    });
    resultAnimationRef.current.start(({ finished }) => {
      if (finished) {
        setCreatedShortUrl('');
        setResultSecondsLeft(0);
      }
    });

    const startedAt = Date.now();
    createdShortUrlIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const left = Math.max(0, Math.ceil((RESULT_VISIBLE_MS - elapsed) / 1000));
      setResultSecondsLeft(left);
      if (left <= 0 && createdShortUrlIntervalRef.current) {
        clearInterval(createdShortUrlIntervalRef.current);
        createdShortUrlIntervalRef.current = null;
      }
    }, 250);

    createdShortUrlTimerRef.current = setTimeout(() => {
      setCreatedShortUrl('');
      setResultSecondsLeft(0);
      clearCreatedShortUrlTimers();
    }, RESULT_VISIBLE_MS);
  };

  const fetchLinks = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    const result = await RestClient.getRequest(AppUrl.shortenUrl);

    if (result?.status >= 200 && result?.status < 300 && Array.isArray(result.data)) {
      setLinks(result.data);
    } else {
      setLinks([]);
      setError(result?.data?.message || 'Linkler yüklenemedi.');
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLinks();
    }, [fetchLinks]),
  );

  const closeActions = () => setSelectedLink(null);

  const copyText = (key, value) => {
    if (!value) {
      return;
    }

    Clipboard.setString(value);
    setCopiedKey(key);

    if (copyResetRef.current) {
      clearTimeout(copyResetRef.current);
    }
    copyResetRef.current = setTimeout(() => {
      setCopiedKey('');
    }, 1500);
  };

  const removeLink = async (item) => {
    if (!item?.short_url || removingId) {
      return;
    }

    setRemovingId(item.id);
    const result = await RestClient.postRequest(
      `${AppUrl.removeUrl}/${item.short_url}`,
    );

    if (result?.status >= 200 && result?.status < 300) {
      setLinks((prev) => prev.filter((link) => link.id !== item.id));
      closeActions();
    } else {
      Alert.alert(
        'Silinemedi',
        result?.data?.message || 'Link silinirken bir hata oluştu.',
      );
    }

    setRemovingId(null);
  };

  const confirmRemove = (item) => {
    Alert.alert(
      'Linki sil',
      `"${item.short_url}" bağlantısını silmek istiyor musun?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => removeLink(item),
        },
      ],
    );
  };

  const openDetails = (item) => {
    closeActions();
    NavigationService.navigate('Stats', {
      shortUrl: item.short_url,
      id: item.id,
    });
  };

  const onCreateLink = async (values, { resetForm, setSubmitting }) => {
    const result = await RestClient.postRequest(AppUrl.createLink, {
      url: values.url.trim(),
    });

    if (result?.status >= 200 && result?.status < 300 && result?.data) {
      const created = result.data;
      const displayShort =
        created.short_url
          ? `${AppUrl.baseURL}/${created.short_url}`
          : '';

      showCreatedShortUrl(displayShort);
      setLinks((prev) => {
        const withoutDup = prev.filter((link) => link.id !== created.id);
        return [created, ...withoutDup];
      });
      resetForm();
    } else {
      Alert.alert(
        'Oluşturulamadı',
        result?.data?.message || 'Link kısaltılırken bir hata oluştu.',
      );
    }

    setSubmitting(false);
  };

  const selectedCopyValue = selectedLink
    ? `${AppUrl.baseURL}/${selectedLink.short_url}`
    : '';

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <StatusBar barStyle="light-content" backgroundColor="#050505" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchLinks(true)}
              tintColor="#C8F542"
              colors={['#C8F542']}
            />
          }
        >
          <View style={styles.header}>
            <Text style={styles.kicker}>u / r / l</Text>
            <Text style={styles.title}>SHORT</Text>
            <Text style={styles.subtitle}>Paste a long link. Get a short one.</Text>
          </View>

          <Formik
            initialValues={{ url: '' }}
            validationSchema={createLinkSchema}
            onSubmit={onCreateLink}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
              isValid,
              dirty,
            }) => (
              <View style={styles.form}>
                <Text style={styles.label}>LONG URL</Text>
                <View
                  style={[
                    styles.inputWrap,
                    touched.url && errors.url ? styles.inputWrapError : null,
                  ]}
                >
                  <Feather
                    name="globe"
                    size={18}
                    color="#6B6B6B"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={values.url}
                    onChangeText={handleChange('url')}
                    onBlur={handleBlur('url')}
                    placeholder="https://example.com/very/long/path"
                    placeholderTextColor="#4A4A4A"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                    editable={!isSubmitting}
                  />
                </View>
                {touched.url && errors.url ? (
                  <Text style={styles.fieldError}>{errors.url}</Text>
                ) : null}

                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    (!dirty || !isValid || isSubmitting) && styles.buttonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!dirty || !isValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#050505" />
                  ) : (
                    <>
                      <Text style={styles.buttonText}>SHORTEN</Text>
                      <Feather name="arrow-right" size={18} color="#050505" />
                    </>
                  )}
                </Pressable>
              </View>
            )}
          </Formik>

          {createdShortUrl ? (
            <Pressable
              style={({ pressed }) => [styles.result, pressed && styles.cardPressed]}
              onPress={() => copyText('result', createdShortUrl)}
            >
              <View style={styles.resultHeader}>
                <Text style={styles.resultLabel}>
                  {copiedKey === 'result' ? 'COPIED' : 'SHORT LINK'}
                </Text>
                <Text style={styles.resultCountdown}>{resultSecondsLeft}s</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultUrl} numberOfLines={1}>
                  {createdShortUrl}
                </Text>
                <View style={styles.resultIcon}>
                  <Feather
                    name={copiedKey === 'result' ? 'check' : 'copy'}
                    size={16}
                    color="#C8F542"
                  />
                </View>
              </View>
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: resultProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            </Pressable>
          ) : null}

          <View style={styles.listHeader}>
            <Text style={styles.label}>YOUR LINKS</Text>
            <Text style={styles.listCount}>{links.length}</Text>
          </View>

          {loading ? (
            <View style={styles.empty}>
              <ActivityIndicator color="#C8F542" />
            </View>
          ) : error ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={() => fetchLinks()}>
                <Text style={styles.retryText}>RETRY</Text>
              </Pressable>
            </View>
          ) : links.length === 0 ? (
            <View style={styles.empty}>
              <View style={styles.emptyMark}>
                <View style={styles.emptySlash} />
              </View>
              <Text style={styles.emptyText}>Your shortened links will show up here.</Text>
            </View>
          ) : (
            links.map((item) => {
              const isRemoving = removingId === item.id;

              return (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.linkCard,
                    (pressed || isRemoving) && styles.cardPressed,
                  ]}
                  onPress={() => setSelectedLink(item)}
                  disabled={isRemoving}
                >
                  <View style={styles.linkTop}>
                    <Text style={styles.linkShort} numberOfLines={1}>
                      {item.short_url}
                    </Text>
                    <View style={styles.viewBadge}>
                      {isRemoving ? (
                        <ActivityIndicator size="small" color="#C8F542" />
                      ) : (
                        <>
                          <Feather name="eye" size={12} color="#C8F542" />
                          <Text style={styles.viewText}>{item.view ?? 0}</Text>
                        </>
                      )}
                    </View>
                  </View>
                  <Text style={styles.linkLong} numberOfLines={1}>
                    {item.url}
                  </Text>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={!!selectedLink}
        transparent
        animationType="fade"
        onRequestClose={closeActions}
      >
        <Pressable style={styles.modalOverlay} onPress={closeActions}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle} numberOfLines={1}>
              {selectedLink?.short_url}
            </Text>
            <Text style={styles.modalSubtitle} numberOfLines={2}>
              {selectedLink?.url}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.modalAction,
                pressed && styles.cardPressed,
              ]}
              onPress={() => openDetails(selectedLink)}
            >
              <Feather name="bar-chart-2" size={18} color="#C8F542" />
              <Text style={styles.modalActionText}>Detay</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.modalAction,
                pressed && styles.cardPressed,
              ]}
              onPress={() => {
                copyText(`link-${selectedLink.id}`, selectedCopyValue);
                closeActions();
              }}
            >
              <Feather name="copy" size={18} color="#C8F542" />
              <Text style={styles.modalActionText}>Kopyala</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.modalAction,
                styles.modalActionDanger,
                pressed && styles.cardPressed,
              ]}
              onPress={() => confirmRemove(selectedLink)}
              disabled={removingId === selectedLink?.id}
            >
              {removingId === selectedLink?.id ? (
                <ActivityIndicator size="small" color="#FF6B6B" />
              ) : (
                <Feather name="trash-2" size={18} color="#FF6B6B" />
              )}
              <Text style={[styles.modalActionText, styles.modalActionTextDanger]}>
                Sil
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.modalCancel,
                pressed && styles.cardPressed,
              ]}
              onPress={closeActions}
            >
              <Text style={styles.modalCancelText}>Vazgeç</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Home;
