import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { products } from '../data/products';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import MainLayout from '../components/MainLayout';

export default function CatalogScreen() {
  const { colors, themeName } = useTheme();
  const { t, lang } = useLanguage();
  const { addToCart, decreaseQty, getQty } = useCart();
  const { showSnackbar } = useUI();
  const { width } = useWindowDimensions();

  let columns = 3;
  if (width < 600) columns = 1;
  else if (width < 800) columns = 2;

  const handleAdd = (item) => {
    addToCart(item);
    showSnackbar(t('addedToCart'));
  };

  const handlePlus = (item) => {
    addToCart(item);
    showSnackbar(t('addedToCart'));
  };

  const handleMinus = (item) => {
    decreaseQty(item.id);
  };

  const gap = 12;
  const sidePad = 16;
  const maxContent = 1100;
  const contentWidth = Math.min(width, maxContent);
  const available = contentWidth - sidePad * 2;
  const cardWidth =
    columns === 1
      ? available
      : (available - gap * (columns - 1)) / columns;

  return (
    <MainLayout>
      <View style={styles.page}>
        <Text style={[styles.title, { color: colors.text }]}>{t('catalog')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('shopAbout')}
        </Text>

        <View style={styles.grid}>
          {products.map((item, index) => {
            const qty = getQty(item.id);
            const inCart = qty > 0;
            const isLastInRow = (index + 1) % columns === 0;

            return (
              <View
                key={item.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: inCart ? colors.accent : colors.border,
                    width: cardWidth,
                    borderWidth: inCart ? 2 : 1,
                    marginRight: isLastInRow ? 0 : gap,
                    marginBottom: gap,
                  },
                ]}
              >
                <View
                  style={[
                    styles.imageBox,
                    { backgroundColor: themeName === 'light' ? '#fff0cc' : '#3a2e1c' },
                  ]}
                >
                  <Image source={item.image} style={styles.image} resizeMode="cover" />
                </View>

                <Text style={[styles.name, { color: colors.text }]}>
                  {item.name[lang]}
                </Text>
                <Text
                  style={[styles.desc, { color: colors.textSecondary }]}
                  numberOfLines={2}
                >
                  {item.description[lang]}
                </Text>
                <Text style={[styles.price, { color: colors.primary }]}>
                  {item.price.toLocaleString()} {t('rub')}
                </Text>

                {inCart ? (
                  <View style={styles.qtyBlock}>
                    <Text style={[styles.inCartLabel, { color: colors.accent }]}>
                      {t('inCart')}
                    </Text>
                    <View style={styles.qtyRow}>
                      <TouchableOpacity
                        style={[styles.qtyBtn, { backgroundColor: colors.primary }]}
                        onPress={() => handleMinus(item)}
                      >
                        <Ionicons name="remove" size={20} color="#fff" />
                      </TouchableOpacity>

                      <Text style={[styles.qtyValue, { color: colors.text }]}>
                        {qty}
                      </Text>

                      <TouchableOpacity
                        style={[
                          styles.qtyBtn,
                          { backgroundColor: colors.accent, marginLeft: 14 },
                        ]}
                        onPress={() => handlePlus(item)}
                      >
                        <Ionicons name="add" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: colors.primary }]}
                    onPress={() => handleAdd(item)}
                  >
                    <Ionicons name="cart" size={18} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.btnText}>{t('addToCart')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  card: {
    borderRadius: 12,
    padding: 14,
  },
  imageBox: {
    height: 140,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
  },
  desc: {
    fontSize: 13,
    marginTop: 4,
    minHeight: 36,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 10,
  },
  btn: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  qtyBlock: {
    alignItems: 'center',
  },
  inCartLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
    marginLeft: 14,
  },
});
