import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../src/store';
import { useTheme } from '../src/hooks/useTheme';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { Text } from '../src/components/Text';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { useRouter } from 'expo-router';
import { Header } from '../src/components/Header';
import * as Clipboard from 'expo-clipboard';
import {
  User,
  SquaresExclude,
  LogIn,
  UserPlus,
  ArrowLeftRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText,
  Settings,
  Copy,
  Check,
} from 'lucide-react-native';

export default function IndexPage() {
  const { colors } = useTheme();

  
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const router = useRouter();

  const [copied, setCopied] = useState(false);

  const handleCopyAccount = async () => {
    if (currentUser?.account?.accountNumber) {
      await Clipboard.setStringAsync(currentUser.account.accountNumber);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    }
  };

  return (
    <ScreenContainer scrollable contentContainerStyle={[styles.scrollContent, !isAuthenticated && { flexGrow: 1 }]}>
      
      <Header />

      
      {!isAuthenticated ? (
        <View style={styles.centeredCardWrapper}>
          <Card style={styles.cardMargin}>
            <View style={styles.guestContent}>
              <SquaresExclude size={48} color={colors.primary} style={styles.guestIcon} />
              <Text tx="guestWelcome" variant="h2" style={styles.guestTitle} />
              <Text tx="guestSubtitle" variant="muted" style={styles.guestSubtitle} />
              
              <View style={styles.guestActions}>
                <Button
                  tx="loginButton"
                  icon={LogIn}
                  onPress={() => router.push('/login')}
                  style={styles.guestActionBtn}
                />
                <Button
                  tx="dontHaveAccount"
                  variant="outline"
                  icon={UserPlus}
                  onPress={() => router.push('/register')}
                  style={[styles.guestActionBtn, { marginTop: 12 }]}
                />
              </View>
            </View>
          </Card>
        </View>
      ) : (
        <Card style={styles.cardMargin}>
          <View style={styles.row}>
            <User size={36} color={colors.primary} style={styles.avatarIcon} />
            <View style={styles.flex}>
              <Text
                tx="dashboardGreeting"
                txValues={{ name: currentUser?.name || 'User' }}
                variant="h2"
              />
            </View>
          </View>

          {currentUser?.account && (
            <View style={{ borderTopWidth: 1, borderTopColor: colors.border, marginTop: 16, paddingTop: 16 }}>
              <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
                <View>
                  <Text
                    tx="accountNumberLabel"
                    style={{ color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.5 }}
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleCopyAccount}
                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: '600', letterSpacing: 0.5, color: colors.text, marginRight: 6 }}>
                      {currentUser.account.accountNumber}
                    </Text>
                    {copied ? (
                      <Check size={14} color={colors.success} />
                    ) : (
                      <Copy size={14} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text
                    tx="availableBalanceLabel"
                    style={{ color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.5 }}
                  />
                  <Text style={{ fontSize: 18, fontWeight: '700', color: colors.primary, marginTop: 4 }}>
                    R$ {currentUser.account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Card>
      )}

      {isAuthenticated && (
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push('/transfer')}
            >
              <View style={[styles.iconBg, { backgroundColor: colors.accent }]}>
                <ArrowLeftRight size={24} color={colors.primary} />
              </View>
              <Text tx="actionTransfer" variant="bodySemibold" style={[styles.gridItemText, { color: colors.text }]} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push('/deposit')}
            >
              <View style={[styles.iconBg, { backgroundColor: colors.accent }]}>
                <ArrowDownToLine size={24} color={colors.primary} />
              </View>
              <Text tx="actionDeposit" variant="bodySemibold" style={[styles.gridItemText, { color: colors.text }]} />
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push('/withdraw')}
            >
              <View style={[styles.iconBg, { backgroundColor: colors.accent }]}>
                <ArrowUpFromLine size={24} color={colors.primary} />
              </View>
              <Text tx="actionWithdraw" variant="bodySemibold" style={[styles.gridItemText, { color: colors.text }]} />
            </TouchableOpacity>
 
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push('/statement')}
            >
              <View style={[styles.iconBg, { backgroundColor: colors.accent }]}>
                <FileText size={24} color={colors.primary} />
              </View>
              <Text tx="actionStatement" variant="bodySemibold" style={[styles.gridItemText, { color: colors.text }]} />
            </TouchableOpacity>
          </View>

          <View style={styles.gridRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push('/settings')}
            >
              <View style={[styles.iconBg, { backgroundColor: colors.accent }]}>
                <Settings size={24} color={colors.primary} />
              </View>
              <Text tx="settingsTitle" variant="bodySemibold" style={[styles.gridItemText, { color: colors.text }]} />
            </TouchableOpacity>

            <View
              style={[
                styles.gridItem,
                {
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                  shadowColor: 'transparent',
                  elevation: 0,
                },
              ]}
            />
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 12,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  squaresExcludeIcon: {
    marginRight: 8,
  },
  themeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 0,
  },
  langHeaderBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutBtn: {
    marginLeft: 8,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  cardMargin: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  avatarIcon: {
    marginRight: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterText: {
    fontSize: 32,
    fontWeight: '800',
  },
  counterBtnGroup: {
    flexDirection: 'row',
  },
  counterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 0,
  },
  permissionInfoBox: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#A1A1AA',
    marginBottom: 12,
  },
  adminPanel: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  adminIcon: {
    marginRight: 12,
  },
  refreshBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 0,
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  loaderText: {
    marginLeft: 8,
  },
  apiCaption: {
    marginBottom: 8,
  },
  userItem: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
  userMetaRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: 11,
  },
  guestContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  guestIcon: {
    marginBottom: 16,
  },
  guestTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  guestSubtitle: {
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  guestActions: {
    width: '100%',
  },
  guestActionBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
  },
  centeredCardWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  gridContainer: {
    marginTop: 8,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    flex: 0.48,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridItemText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
