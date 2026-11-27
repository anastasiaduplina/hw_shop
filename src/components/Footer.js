import React from 'react';
import { View, Text, Linking, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  const isNarrow = width < 700;

  const openLink = (url) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={[styles.wrap, { backgroundColor: colors.headerBg, borderTopColor: colors.border }]}>
      <View style={[styles.row, isNarrow && styles.col]}>
        <View style={[styles.block, !isNarrow && styles.blockSide]}>
          <Text style={[styles.title, { color: colors.primary }]}>{t('shopTitle')}</Text>
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>{t('shopAbout')}</Text>
        </View>

        <View style={[styles.block, !isNarrow && styles.blockSide]}>
          <Text style={[styles.title, { color: colors.text }]}>{t('contacts')}</Text>
          <View style={styles.contactRow}>
            <Ionicons name="call" size={16} color={colors.primary} style={styles.contactIcon} />
            <Text style={{ color: colors.textSecondary }}>
              {t('phone')}: {t('phoneValue')}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => openLink('mailto:info@hwshop.ru')}
          >
            <Ionicons name="mail" size={16} color={colors.primary} style={styles.contactIcon} />
            <Text style={{ color: colors.primary }}>
              {t('email')}: {t('emailValue')}
            </Text>
          </TouchableOpacity>
          <View style={styles.contactRow}>
            <Ionicons name="location" size={16} color={colors.primary} style={styles.contactIcon} />
            <Text style={{ color: colors.textSecondary, flex: 1 }}>
              {t('address')}: {t('addressValue')}
            </Text>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={[styles.title, { color: colors.text }]}>{t('socials')}</Text>
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() => openLink('https://vk.com')}
          >
            <Ionicons name="logo-vk" size={20} color={colors.primary} />
            <Text style={[styles.link, { color: colors.primary }]}>{t('vk')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() => openLink('https://t.me')}
          >
            <Ionicons name="logo-telegram" size={20} color={colors.primary} />
            <Text style={[styles.link, { color: colors.primary }]}>{t('telegram')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.rights, { color: colors.textSecondary, borderTopColor: colors.border }]}>
        {t('rights')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    flexDirection: 'column',
  },
  block: {
    flex: 1,
    minWidth: 160,
    marginBottom: 12,
  },
  blockSide: {
    marginRight: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  contactIcon: {
    marginRight: 6,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  link: {
    marginLeft: 8,
    fontSize: 14,
  },
  rights: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    fontSize: 12,
    textAlign: 'center',
  },
});
