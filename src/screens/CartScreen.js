import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import MainLayout from '../components/MainLayout';

export default function CartScreen({ navigation }) {
  const { colors } = useTheme();
  const { t, lang } = useLanguage();
  const { items, addToCart, decreaseQty, clearCart, total } = useCart();
  const { user } = useAuth();
  const { showModal } = useUI();

  const handleCheckout = () => {
    if (items.length === 0) {
      showModal({
        title: t('cart'),
        message: t('emptyCart'),
        buttons: [{ text: t('close') }],
      });
      return;
    }

    if (!user) {
      showModal({
        title: t('needAuthTitle'),
        message: t('needAuth'),
        buttons: [
          { text: t('close'), primary: false },
          {
            text: t('goToLogin'),
            onPress: () => navigation.navigate('Login'),
          },
        ],
      });
      return;
    }

    const orderList = items
      .map(
        (item) =>
          item.name[lang] +
          ' × ' +
          item.qty +
          ' — ' +
          (item.price * item.qty).toLocaleString() +
          ' ' +
          t('rub')
      )
      .join('\n');

    const orderTotal = total;

    showModal({
      title: t('orderSuccessTitle'),
      message: (
        <View>
          <Text style={{ color: colors.accent, fontWeight: '700', marginBottom: 10 }}>
            {t('orderSuccess')}
          </Text>
          <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 6 }}>
            {t('yourOrder')}:
          </Text>
          <Text style={{ color: colors.textSecondary, lineHeight: 22 }}>
            {orderList}
          </Text>
          <Text
            style={{
              color: colors.text,
              fontWeight: '700',
              marginTop: 12,
              fontSize: 16,
            }}
          >
            {t('total')}: {orderTotal.toLocaleString()} {t('rub')}
          </Text>
        </View>
      ),
      buttons: [{ text: t('close') }],
    });

    clearCart();
  };

  return (
    <MainLayout>
      <View style={styles.page}>
        <Text style={[styles.title, { color: colors.text }]}>{t('cart')}</Text>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={48} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, fontSize: 16, marginTop: 12 }}>
              {t('emptyCart')}
            </Text>
            <TouchableOpacity
              style={[styles.backBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Catalog')}
            >
              <Text style={styles.backText}>{t('catalog')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {items.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.card,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Image source={item.image} style={styles.image} resizeMode="cover" />
                <View style={styles.info}>
                  <Text style={[styles.name, { color: colors.text }]}>
                    {item.name[lang]}
                  </Text>
                  <Text style={[styles.price, { color: colors.primary }]}>
                    {(item.price * item.qty).toLocaleString()} {t('rub')}
                  </Text>
                </View>

                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={[styles.qtyBtn, { backgroundColor: colors.primary }]}
                    onPress={() => decreaseQty(item.id)}
                  >
                    <Ionicons name="remove" size={18} color="#fff" />
                  </TouchableOpacity>

                  <Text style={[styles.qtyValue, { color: colors.text }]}>
                    {item.qty}
                  </Text>

                  <TouchableOpacity
                    style={[styles.qtyBtn, { backgroundColor: colors.accent }]}
                    onPress={() => addToCart(item)}
                  >
                    <Ionicons name="add" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View
              style={[
                styles.summary,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.total, { color: colors.text }]}>
                {t('total')}: {total.toLocaleString()} {t('rub')}
              </Text>
              <TouchableOpacity
                style={[styles.checkoutBtn, { backgroundColor: colors.success }]}
                onPress={handleCheckout}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.checkoutText}>{t('checkout')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 16,
    minHeight: 300,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  backBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize: 17,
    fontWeight: '700',
    minWidth: 22,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  summary: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  checkoutBtn: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
