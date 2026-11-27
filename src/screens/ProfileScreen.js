import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../context/UIContext';
import MainLayout from '../components/MainLayout';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { showSnackbar } = useUI();

  const handleLogout = async () => {
    await logout();
    showSnackbar(t('logoutSuccess'));
  };

  return (
    <MainLayout>
      <View style={styles.page}>
        <Text style={[styles.title, { color: colors.text }]}>{t('profile')}</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {user ? (
            <View>
              <Text style={[styles.welcome, { color: colors.text }]}>
                {t('welcome')}, {user.name}!
              </Text>
              <Text style={{ color: colors.textSecondary, marginBottom: 12 }}>
                {user.email}
              </Text>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: colors.danger }]}
                onPress={handleLogout}
              >
                <Text style={styles.btnText}>{t('logout')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={[styles.welcome, { color: colors.text }]}>
                {t('notLoggedIn')}
              </Text>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.btnText}>{t('goToLogin')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  welcome: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  btn: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
