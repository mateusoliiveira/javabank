import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Text } from './Text';
import { ChevronDown, Check, LucideIcon } from 'lucide-react-native';
import { TranslationKeys } from '../services/seeder.service';

export interface SelectOption<T> {
  label?: string;
  labelTx?: keyof TranslationKeys;
  value: T;
  icon?: LucideIcon;
}

export interface SelectProps<T> {
  labelTx?: keyof TranslationKeys;
  txValues?: Record<string, string | number>;
  label?: string;
  options: SelectOption<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  containerStyle?: ViewStyle;
}

export const Select = <T extends string | number>({
  labelTx,
  txValues,
  label,
  options,
  selectedValue,
  onValueChange,
  containerStyle,
}: SelectProps<T>) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleSelect = (value: T) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {(label || labelTx) && (
        <Text tx={labelTx} txValues={txValues} variant="bodySemibold" style={styles.label}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.selector,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.selectorContent}>
          {selectedOption?.icon && (
            <selectedOption.icon
              size={18}
              color={colors.primary}
              style={styles.optionIcon}
            />
          )}
          <Text tx={selectedOption?.labelTx} style={styles.selectorText}>{selectedOption?.label || ''}</Text>
        </View>
        <ChevronDown size={20} color={colors.textMuted} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.dragIndicator,
                    { backgroundColor: colors.border },
                  ]}
                />

                {(label || labelTx) && (
                  <Text
                    tx={labelTx}
                    txValues={txValues}
                    variant="h2"
                    style={[styles.modalTitle, { color: colors.text }]}
                  >
                    {label}
                  </Text>
                )}

                <FlatList
                  data={options}
                  keyExtractor={(item) => String(item.value)}
                  renderItem={({ item }) => {
                    const isSelected = item.value === selectedValue;
                    return (
                      <TouchableOpacity
                        style={[
                          styles.optionItem,
                          {
                            borderBottomColor: colors.border,
                            backgroundColor: isSelected ? colors.accent : 'transparent',
                          },
                        ]}
                        onPress={() => handleSelect(item.value)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.optionItemContent}>
                          {item.icon && (
                            <item.icon
                              size={20}
                              color={isSelected ? colors.primary : colors.textMuted}
                              style={styles.optionIcon}
                            />
                          )}
                          <Text
                            tx={item.labelTx}
                            style={[
                              styles.optionText,
                              {
                                color: isSelected ? colors.primary : colors.text,
                                fontWeight: isSelected ? '600' : '400',
                              },
                            ]}
                          >
                            {item.label}
                          </Text>
                        </View>
                        {isSelected && (
                          <Check size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                  contentContainerStyle={styles.listContent}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
  },
  selector: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 8,
  },
  selectorText: {
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 16,
    maxHeight: '60%',
  },
  dragIndicator: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 32,
  },
  optionItem: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderRadius: 8,
    marginVertical: 2,
  },
  optionItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
});
