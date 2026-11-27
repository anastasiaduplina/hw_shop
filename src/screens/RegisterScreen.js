import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../context/UIContext';
import MainLayout from '../components/MainLayout';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { showSnackbar, showModal } = useUI();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      showModal({
        title: t('register'),
        message: t('fillFields'),
        buttons: [{ text: t('close') }],
      });
      return;
    }

    const result = await register(name.trim(), email.trim(), password);
    if (!result.ok) {
      showModal({
        title: t('register'),
        message: t(result.error),
        buttons: [{ text: t('close') }],
      });
      return;
    }

    showSnackbar(t('registerSuccess'));
    navigation.navigate('Login');
  };

  return (
    <MainLayout>
      <View style={styles.page}>
        <View
          style={[
            styles.form,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>{t('register')}</Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder={t('name')}
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder={t('email')}
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder={t('password')}
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary }]}
            onPress={handleRegister}
          >
            <Text style={styles.btnText}>{t('registerBtn')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.link, { color: colors.primary }]}>
              {t('haveAccount')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 16,
    alignItems: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    marginTop: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  btn: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
  },
});
