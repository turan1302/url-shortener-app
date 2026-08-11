import { StyleSheet } from 'react-native';

const colors = {
  bg: '#050505',
  panel: '#0F0F0F',
  border: 'rgba(255,255,255,0.1)',
  lime: '#C8F542',
  white: '#F5F5F5',
  mute: '#6B6B6B',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonSpacer: {
    width: 40,
  },
  topTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
  },
  pressed: {
    opacity: 0.7,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  centerBox: {
    marginTop: 80,
    alignItems: 'center',
  },
  errorText: {
    color: colors.mute,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.lime,
  },
  retryText: {
    color: colors.lime,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  kicker: {
    marginTop: 20,
    color: colors.mute,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.4,
    marginBottom: 12,
  },
  shortUrl: {
    color: colors.lime,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  longUrl: {
    color: colors.mute,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 28,
  },
  statCard: {
    borderWidth: 1,
    borderColor: 'rgba(200, 245, 66, 0.35)',
    backgroundColor: 'rgba(200, 245, 66, 0.06)',
    padding: 20,
    marginBottom: 16,
  },
  statLabel: {
    color: colors.mute,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  statValue: {
    color: colors.lime,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statusCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusValue: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  statusActive: {
    color: colors.lime,
  },
  statusInactive: {
    color: '#FF6B6B',
  },
  infoCard: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    color: colors.mute,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    paddingTop: 2,
  },
  infoValue: {
    flex: 1,
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
});
