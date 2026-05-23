import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { store, RootState } from '../src/store';
import { useTransferMutation } from '../src/api/accountsApi';
import { updateAccount } from '../src/store/authSlice';

import { useTheme } from '../src/hooks/useTheme';
import { useTranslate } from '../src/hooks/useTranslate';
import { Text } from '../src/components/Text';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { IconButton } from '../src/components/IconButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../src/components/Header';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useLocation } from '../src/hooks/useLocation';

export default function TransferPage() {
  const { location } = useLocation();
  const { colors } = useTheme();
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [transferTrigger] = useTransferMutation();

  const [receiptAccountNumber, setReceiptAccountNumber] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!receiptAccountNumber.trim() || !amountStr.trim()) {
      setError(t('requiredFieldsError'));
      return;
    }

    const amount = parseFloat(amountStr.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      setError(t('invalidAmountError'));
      return;
    }

    if (currentUser?.account && amount > currentUser.account.balance) {
      setError(t('insufficientFundsError'));
      return;
    }

    setError(null);
    setLoading(true);

    try {
      let payloadTransfer: {
        amount: number;
        receiptAccountNumber: string;
        latitudeDevice?: String;
        longitudeDevice?: String;
      } = {
        amount,
        receiptAccountNumber: receiptAccountNumber.trim(),
      };

      if (
        currentUser?.settings
          ?.find((setting) => 
            setting.key === 'ANTIFRAUD_ENABLED' && 
          setting.value === 'true'
      )) {
        console.log("Location",location)
        if (!location?.coords?.latitude || !location?.coords?.longitude) {
          setError(t('locationRequiredError'));
          setLoading(false);
          return;
        }
        payloadTransfer = {
          ...payloadTransfer,
          latitudeDevice: String(location.coords.latitude),
          longitudeDevice: String(location.coords.longitude),
        };
      }

      const response = await transferTrigger(payloadTransfer).unwrap();

      if (response.account) {
        dispatch(updateAccount(response.account));
        
      }

      setSuccess(true);
      setReceiptAccountNumber('');
      setAmountStr('');
    } catch (err: any) {
      console.error('Transfer failed:', err);
      const backendError = err?.data?.message;
      if (backendError) {
        setError(t(backendError as any));
      } else {
        setError(err?.message || t('apiStatusError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <Header 
        variant="auth-utility" 
        titleTx="transferTitle" 
        onBack={() => router.back()} 
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          <Card style={styles.cardMargin}>
            {success ? (
              <View style={styles.successContainer}>
                <View style={[styles.successIconBg, { backgroundColor: colors.accent }]}>
                  <Send size={32} color={colors.primary} />
                </View>
                <Text tx="transferSuccess" variant="bodySemibold" style={[styles.successText, { color: colors.text }]} />
                <Button
                  tx="btnMakeNewTransfer"
                  onPress={() => {
                    setSuccess(false);
                  }}
                  style={styles.homeBtn}
                />
              </View>
            ) : (
              <View>
                <Text tx="transferSubtitle" style={[styles.subtitle, { color: colors.textMuted }]} />

                {error && (
                  <View style={[styles.errorBox, { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}>
                    <Text style={{ color: '#DC2626', fontSize: 13, fontWeight: '500' }}>{error}</Text>
                  </View>
                )}

                <Input
                  labelTx="recipientAccountLabel"
                  placeholder={t('recipientAccountLabel')}
                  value={receiptAccountNumber}
                  onChangeText={setReceiptAccountNumber}
                  keyboardType="numeric"
                />

                <View style={{ height: 16 }} />

                <Input
                  labelTx="amountLabel"
                  placeholder={t('amountLabel')}
                  value={amountStr}
                  onChangeText={setAmountStr}
                  keyboardType="numeric"
                />

                <View style={{ height: 24 }} />

                <Button
                  tx="btnSubmitTransfer"
                  icon={loading ? undefined : Send}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading && <ActivityIndicator size="small" color="#ffffff" />}
                </Button>
              </View>
            )}
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  
  titleText: {
    fontWeight: '700',
  },
  cardMargin: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  errorBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  homeBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
  },
});
