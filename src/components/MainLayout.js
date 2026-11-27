import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import FloatingCartButton from './FloatingCartButton';

export default function MainLayout({ children, scroll = true }) {
  return (
    <View style={styles.root}>
      <Header />

      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {children}
          <Footer />
        </ScrollView>
      ) : (
        <View style={styles.flex}>
          <View style={[styles.flex, styles.content]}>{children}</View>
          <Footer />
        </View>
      )}

      <FloatingCartButton />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingBottom: 80,
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
  },
});
