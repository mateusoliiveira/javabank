import React, { memo, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGetHistoricQuery, HistoricTransaction } from '../src/api/accountsApi';
import { useTheme } from '../src/hooks/useTheme';
import { useTranslate } from '../src/hooks/useTranslate';
import { Text } from '../src/components/Text';
import { Card } from '../src/components/Card';
import { Header } from '../src/components/Header';
import { IconButton } from '../src/components/IconButton';
import { ArrowLeft, ArrowDownToLine, ArrowUpFromLine, FileText } from 'lucide-react-native';

const ITEM_HEIGHT = 84; 


const TransactionItem = memo(({ item, colors, t }: { item: HistoricTransaction, colors: any, t: any }) => {
  const isDeposit = item.type === 'DEPOSIT';
  const Icon = isDeposit ? ArrowDownToLine : ArrowUpFromLine;
  const amountColor = isDeposit ? '#10B981' : '#EF4444';
  const amountPrefix = isDeposit ? '+' : '-';
  
  const typeKey = `type${item.type}` as keyof typeof t;
  const typeText = t(typeKey as any) || item.type;

  const formattedDateTime = (() => {
    if (!item.createdAt) return '';
    try {
      const date = new Date(item.createdAt);
      if (isNaN(date.getTime())) return '';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month} às ${hours}:${minutes}`;
    } catch (e) {
      return '';
    }
  })();

  return (
    <Card style={styles.transactionCard}>
      <View style={styles.transactionRow}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconBg, { backgroundColor: isDeposit ? '#D1FAE5' : '#FEE2E2' }]}>
            <Icon size={20} color={amountColor} />
          </View>
          <View style={styles.detailsContainer}>
            <Text style={[styles.typeText, { color: colors.text }]}>{typeText}</Text>
            <Text style={[styles.idText, { color: colors.textMuted }]}>
              {formattedDateTime}
            </Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[styles.amountText, { color: amountColor }]}>
            {amountPrefix}R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </View>
    </Card>
  );
}, (prevProps, nextProps) => {
  
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.colors.background === nextProps.colors.background
  );
});

export default function StatementPage() {
  const { colors } = useTheme();
  const { t } = useTranslate();
  const router = useRouter();

  const { data: transactions, isLoading, error } = useGetHistoricQuery();

  const renderTransaction = useCallback(({ item }: { item: HistoricTransaction }) => (
    <TransactionItem item={item} colors={colors} t={t} />
  ), [colors, t]);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <Header 
        variant="auth-utility" 
        titleTx="statementTitle" 
        onBack={() => router.back()} 
      />

      <View style={styles.content}>
        <Text tx="statementSubtitle" style={[styles.subtitle, { color: colors.textMuted, marginTop: 12 }]} />

        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.centerBox}>
            <View style={[styles.errorBox, { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }]}>
              <Text style={{ color: '#DC2626', fontSize: 13, fontWeight: '500' }}>
                {t('apiStatusError')}
              </Text>
            </View>
          </View>
        ) : transactions && transactions.length > 0 ? (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTransaction}
            getItemLayout={getItemLayout}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={11}
            removeClippedSubviews={true}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconBg, { backgroundColor: colors.accent }]}>
              <FileText size={48} color={colors.primary} />
            </View>
            <Text tx="noTransactions" variant="bodySemibold" style={[styles.emptyText, { color: colors.text }]} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  titleText: {
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 40,
  },
  transactionCard: {
    marginBottom: 12,
    padding: 16,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsContainer: {
    justifyContent: 'center',
  },
  typeText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  idText: {
    fontSize: 12,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
  },
});
