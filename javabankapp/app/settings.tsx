import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../src/store';
import { updateSettings, UserSetting } from '../src/store/authSlice';
import { useUpdateSettingsMutation } from '../src/api/usersApi';
import { useTheme } from '../src/hooks/useTheme';
import { useTranslate } from '../src/hooks/useTranslate';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { Header } from '../src/components/Header';
import { Text } from '../src/components/Text';
import { Card } from '../src/components/Card';
import { Input } from '../src/components/Input';
import { Select, SelectOption } from '../src/components/Select';
import { Button } from '../src/components/Button';
import { useRouter } from 'expo-router';
import { LeafletMap } from '../src/components/LeafletMap';
import { useLocation } from '../src/hooks/useLocation';
import {
  Globe,
  Palette,
  EyeOff,
  Shield,
  MapPin,
  Bell,
  DollarSign,
  Save,
  CheckCircle2,
  XCircle,
  Search,
  Crosshair,
  Map,
} from 'lucide-react-native';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslate();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const dbSettings = currentUser?.settings || [];

  
  const [updateSettingsTrigger, { isLoading }] = useUpdateSettingsMutation();

  
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  
  const { location, errorMsg, getCurrentLocation } = useLocation();
  const [addressSearch, setAddressSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const handleSearchAddress = async () => {
    if (!addressSearch.trim()) return;
    setSearchLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressSearch)}`, {
        headers: { 'User-Agent': 'JavaBankApp/1.0' }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        handleValueChange('ANTIFRAUD_LATITUDE', lat);
        handleValueChange('ANTIFRAUD_LONGITUDE', lon);
      } else {
        setError('Address not found.');
      }
    } catch (err) {
      setError('Error fetching address.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCaptureLocation = async () => {
    setLocLoading(true);
    setError(null);
    const loc = await getCurrentLocation();
    if (loc) {
      handleValueChange('ANTIFRAUD_LATITUDE', loc.coords.latitude.toString());
      handleValueChange('ANTIFRAUD_LONGITUDE', loc.coords.longitude.toString());
    } else if (errorMsg) {
      setError(errorMsg);
    }
    setLocLoading(false);
  };

  
  useEffect(() => {
    if (dbSettings.length > 0) {
      const values: Record<string, string> = {};
      dbSettings.forEach((s) => {
        values[s.key] = s.value ?? '';
      });
      setFormValues(values);
    }
  }, [currentUser]);

  const handleValueChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    if (success) setSuccess(null);
    if (error) setError(null);
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    
    const updatedSettingsPayload: UserSetting[] = dbSettings.map((s) => ({
      id: s.id,
      key: s.key,
      value: formValues[s.key] ?? s.value ?? '',
    }));

    try {
      
      const response = await updateSettingsTrigger({
        bankUserSetting: updatedSettingsPayload,
      }).unwrap();

      
      dispatch(updateSettings(response.bankUserSetting));

      setSuccess(t('settingsSaveSuccess'));
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      const errMsg = err?.data?.message || err?.message || t('settingsSaveError');
      setError(errMsg);
    }
  };

  
  const languageOptions: SelectOption<string>[] = [
    { labelTx: 'optionPt', value: 'pt', icon: Globe },
    { labelTx: 'optionEn', value: 'en', icon: Globe },
  ];

  const themeOptions: SelectOption<string>[] = [
    { labelTx: 'optionLight', value: 'light', icon: Palette },
    { labelTx: 'optionDark', value: 'dark', icon: Palette },
    { labelTx: 'optionSystem', value: 'system', icon: Palette },
  ];

  const booleanOptions: SelectOption<string>[] = [
    { labelTx: 'optionEnabled', value: 'true', icon: CheckCircle2 },
    { labelTx: 'optionDisabled', value: 'false', icon: XCircle },
  ];

  
  const getValue = (key: string, fallback: string = ''): string => {
    return formValues[key] !== undefined ? formValues[key] : fallback;
  };

  return (
    <ScreenContainer style={{ backgroundColor: colors.background }}>
      
      <Header variant="auth-utility" titleTx="settingsTitle" onBack={() => router.back()} />

      <ScrollView
        scrollEnabled={scrollEnabled}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {success && (
          <View style={[styles.feedbackBox, { backgroundColor: colors.accent, borderColor: colors.primary }]}>
            <CheckCircle2 size={20} color={colors.primary} style={styles.feedbackIcon} />
            <Text style={[styles.feedbackText, { color: colors.text }]}>{success}</Text>
          </View>
        )}

        {error && (
          <View style={[styles.feedbackBox, { backgroundColor: colors.accent, borderColor: colors.error }]}>
            <XCircle size={20} color={colors.error} style={styles.feedbackIcon} />
            <Text style={[styles.feedbackText, { color: colors.error }]}>{error}</Text>
          </View>
        )}

        {dbSettings.length === 0 ? (
          <Card style={styles.cardContainer}>
            <View style={styles.loaderCenter}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: 12, color: colors.textMuted }}>Carregando configurações...</Text>
            </View>
          </Card>
        ) : (
          <>
            
            <Card style={styles.cardContainer}>
              <Text tx="settingsGeneralPreferences" variant="h2" style={styles.sectionHeader} />
              <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
                Ajuste o idioma do aplicativo, tema visual e privacidade de saldo.
              </Text>

              <Select
                labelTx="settingsLanguageLabel"
                options={languageOptions}
                selectedValue={getValue('LANGUAGE', 'pt')}
                onValueChange={(val) => handleValueChange('LANGUAGE', val)}
              />

              <Select
                labelTx="settingsThemeLabel"
                options={themeOptions}
                selectedValue={getValue('THEME', 'system')}
                onValueChange={(val) => handleValueChange('THEME', val)}
              />

              <Select
                labelTx="settingsHideBalanceLabel"
                options={booleanOptions}
                selectedValue={getValue('BALANCE_HIDE', 'false')}
                onValueChange={(val) => handleValueChange('BALANCE_HIDE', val)}
              />
            </Card>

            
            <Card style={styles.cardContainer}>
              <Text tx="settingsSecurityAntifraud" variant="h2" style={styles.sectionHeader} />
              <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
                Ative e configure parâmetros geográficos para proteção da sua conta.
              </Text>

              <Select
                labelTx="settingsAntifraudEnabledLabel"
                options={booleanOptions}
                selectedValue={getValue('ANTIFRAUD_ENABLED', 'false')}
                onValueChange={(val) => handleValueChange('ANTIFRAUD_ENABLED', val)}
              />

              <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Input
                    labelTx="settingsSearchAddressPlaceholder"
                    placeholder="Av. Paulista, 1000..."
                    value={addressSearch}
                    onChangeText={setAddressSearch}
                    icon={Search}
                  />
                </View>
                <Button
                  tx="settingsSearchAddressBtn"
                  onPress={handleSearchAddress}
                  loading={searchLoading}
                  style={{ height: 50, marginBottom: 16 }}
                />
              </View>

              <View
                onTouchStart={() => setScrollEnabled(false)}
                onTouchEnd={() => setScrollEnabled(true)}
                onTouchCancel={() => setScrollEnabled(true)}
              >
                <LeafletMap
                  latitude={getValue('ANTIFRAUD_LATITUDE')}
                  longitude={getValue('ANTIFRAUD_LONGITUDE')}
                  radius={getValue('ANTIFRAUD_RADIUS')}
                  onLocationSelect={(lat, lng) => {
                    handleValueChange('ANTIFRAUD_LATITUDE', lat);
                    handleValueChange('ANTIFRAUD_LONGITUDE', lng);
                  }}
                />
              </View>

              <Button
                tx="settingsCaptureLocationBtn"
                icon={Crosshair}
                onPress={handleCaptureLocation}
                loading={locLoading}
                variant="outline"
                style={{ marginBottom: 16 }}
              />

              <Input
                labelTx="settingsAntifraudRadiusLabel"
                placeholder="e.g. 5"
                value={getValue('ANTIFRAUD_RADIUS')}
                onChangeText={(val) => handleValueChange('ANTIFRAUD_RADIUS', val)}
                icon={Map}
                keyboardType="numeric"
              />
            </Card>

            
            <Card style={styles.cardContainer}>
              <Text tx="transferTitle" variant="h2" style={styles.sectionHeader} />
              <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
                Defina limites máximos permitidos por operação financeira.
              </Text>

              <Input
                labelTx="settingsTransferMaxLabel"
                placeholder="e.g. 150.00"
                value={getValue('TRANSFER_MAX')}
                onChangeText={(val) => handleValueChange('TRANSFER_MAX', val)}
                icon={DollarSign}
                keyboardType="numeric"
              />

              <Input
                labelTx="settingsTransferMaxDailyLabel"
                placeholder="e.g. 500.00"
                value={getValue('TRANSFER_MAX_DAILY')}
                onChangeText={(val) => handleValueChange('TRANSFER_MAX_DAILY', val)}
                icon={DollarSign}
                keyboardType="numeric"
              />
            </Card>

            
            <Card style={styles.cardContainer}>
              <Text tx="settingsNotificationsPushLabel" variant="h2" style={styles.sectionHeader} />
              <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
                Controle o recebimento de alertas de movimentações no celular.
              </Text>

              <Select
                labelTx="settingsNotificationsPushLabel"
                options={booleanOptions}
                selectedValue={getValue('NOTIFICATIONS_PUSH', 'true')}
                onValueChange={(val) => handleValueChange('NOTIFICATIONS_PUSH', val)}
              />
            </Card>

            
            <Button
              tx="settingsSaveBtn"
              icon={Save}
              onPress={handleSave}
              loading={isLoading}
              style={styles.saveBtn}
            />
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  cardContainer: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    marginBottom: 4,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 18,
  },
  saveBtn: {
    marginTop: 8,
    height: 52,
    borderRadius: 12,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  feedbackIcon: {
    marginRight: 12,
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  loaderCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
});
