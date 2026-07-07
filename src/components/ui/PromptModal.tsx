import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, TouchableWithoutFeedback, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { useTheme } from '../../hooks/use-theme';
import { Spacing, BorderRadius, Shadows } from '../../theme';

export interface PromptModalProps {
  isVisible: boolean;
  title: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({
  isVisible,
  title,
  message,
  defaultValue = '',
  placeholder,
  keyboardType = 'default',
  onConfirm,
  onCancel,
}) => {
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState(defaultValue);

  // Reset input when modal opens
  useEffect(() => {
    if (isVisible) {
      setInputValue(defaultValue);
    }
  }, [isVisible, defaultValue]);

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); onCancel(); }}>
        <View style={[styles.backdrop, { backgroundColor: colors.overlay }]} />
      </TouchableWithoutFeedback>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.keyboardView}
        pointerEvents="box-none"
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.surfaceHighlight }]}>
          <Text variant="headline" style={styles.title}>{title}</Text>
          
          {message && (
            <Text variant="body" color={colors.textSecondary} style={styles.message}>
              {message}
            </Text>
          )}

          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: colors.background, 
                color: colors.textPrimary,
                borderColor: colors.border
              }
            ]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            keyboardType={keyboardType}
            autoFocus
          />

          <View style={styles.actions}>
            <Button 
              variant="secondary" 
              label="Cancel" 
              onPress={onCancel}
              style={styles.button}
            />
            <Button 
              variant="primary" 
              label="Save" 
              onPress={() => onConfirm(inputValue)}
              style={styles.button}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.lg,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  message: {
    marginBottom: Spacing.lg,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    marginBottom: Spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
  },
});
