import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { colors, themeName, toggleTheme } = useTheme();
  const { t, lang, changeLanguage } = useLanguage();
  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const isNarrow = width < 700;

  const tabs = [
    { name: 'Catalog', label: t('catalog') },
    { name: 'Cart', label: t('cart') },
    { name: 'Profile', label: t('profile') },
  ];

  const goAccount = () => {
    if (user) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('Login');
    }
  };

  const toggleLang = () => {
    changeLanguage(lang === 'ru' ? 'en' : 'ru');
  };

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: colors.headerBg, borderBottomColor: colors.border },
      ]}
    >
      <View style={[styles.topRow, isNarrow && styles.topRowNarrow]}>
        <View style={styles.brand}>
          <Text style={[styles.logo, { color: colors.primary }]}>
            <Text style={{ color: colors.accent }}>HW</Text> Shop
          </Text>
          <Text style={[styles.slogan, { color: colors.textSecondary }]}>
            {t('shopSlogan')}
          </Text>
          {!isNarrow && (
            <Text style={[styles.about, { color: colors.textSecondary }]}>
              {t('shopAbout')}
            </Text>
          )}
        </View>

        <View style={styles.rightBlock}>
          <View style={styles.icons}>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                { backgroundColor: colors.card, borderColor: colors.border, marginRight: 8 },
              ]}
              onPress={toggleTheme}
            >
              <Ionicons
                name={themeName === 'light' ? 'moon' : 'sunny'}
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.iconBtn,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={toggleLang}
            >
              <Ionicons name="language" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.accountBtn, { backgroundColor: colors.primary, marginLeft: 10 }]}
            onPress={goAccount}
          >
            <Ionicons name="person" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.accountText}>
              {user ? user.name : t('goToLogin')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.tabs, { borderTopColor: colors.border }]}>
        {tabs.map((tab) => {
          const active = route.name === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              style={[
                styles.tab,
                active && {
                  borderBottomColor: colors.primary,
                  borderBottomWidth: 3,
                  backgroundColor: themeName === 'light' ? '#ffe8c2' : '#3a2e1c',
                },
              ]}
              onPress={() => navigation.navigate(tab.name)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: active ? colors.primary : colors.textSecondary },
                  active && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: 1,
    paddingTop: 8,
    zIndex: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  topRowNarrow: {
    flexWrap: 'wrap',
  },
  brand: {
    flex: 1,
    minWidth: 160,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  slogan: {
    fontSize: 14,
    marginTop: 2,
  },
  about: {
    fontSize: 12,
    marginTop: 4,
  },
  rightBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  icons: {
    flexDirection: 'row',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingHorizontal: 8,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginHorizontal: 4,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  tabText: {
    fontSize: 15,
  },
  tabTextActive: {
    fontWeight: '700',
  },
});
