import React, { createContext, useState, useContext, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from './ThemeContext';

export const UIContext = createContext();

export function UIProvider({ children }) {
  const { colors } = useTheme();
  const [snack, setSnack] = useState(null);
  const [modal, setModal] = useState(null);
  const snackAnim = useRef(new Animated.Value(100)).current;
  const timerRef = useRef(null);

  const hideSnackbar = useCallback(() => {
    Animated.timing(snackAnim, {
      toValue: 100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSnack(null));
  }, [snackAnim]);

  const showSnackbar = useCallback(
    (message) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setSnack(message);
      snackAnim.setValue(100);
      Animated.timing(snackAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();

      timerRef.current = setTimeout(() => {
        hideSnackbar();
      }, 2800);
    },
    [hideSnackbar, snackAnim]
  );

  const showModal = useCallback((config) => {
    setModal(config);
  }, []);

  const hideModal = useCallback(() => {
    setModal(null);
  }, []);

  return (
    <UIContext.Provider value={{ showSnackbar, showModal, hideModal }}>
      <View style={styles.root}>
        {children}

        {snack ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.snack,
              {
                backgroundColor: colors.accent,
                transform: [{ translateY: snackAnim }],
              },
            ]}
          >
            <Text style={styles.snackText}>{snack}</Text>
          </Animated.View>
        ) : null}

        <Modal
          visible={!!modal}
          transparent
          animationType="fade"
          onRequestClose={hideModal}
        >
          <View style={styles.overlay}>
            <View
              style={[
                styles.modalBox,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              {modal?.title ? (
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {modal.title}
                </Text>
              ) : null}

              {typeof modal?.message === 'string' ? (
                <Text style={[styles.modalMsg, { color: colors.textSecondary }]}>
                  {modal.message}
                </Text>
              ) : (
                modal?.message
              )}

              <View style={styles.modalActions}>
                {(modal?.buttons || [{ text: 'OK', onPress: hideModal }]).map(
                  (btn, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.modalBtn,
                        {
                          backgroundColor:
                            btn.primary === false
                              ? colors.inputBg
                              : colors.primary,
                          marginBottom: i < (modal?.buttons || []).length - 1 ? 8 : 0,
                        },
                      ]}
                      onPress={() => {
                        hideModal();
                        if (btn.onPress) btn.onPress();
                      }}
                    >
                      <Text
                        style={{
                          color: btn.primary === false ? colors.text : '#fff',
                          fontWeight: '600',
                        }}
                      >
                        {btn.text}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  snack: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 28,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  snackText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 14,
    borderWidth: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalMsg: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  modalActions: {
    marginTop: 16,
  },
  modalBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
