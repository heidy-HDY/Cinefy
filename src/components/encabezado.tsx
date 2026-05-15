import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EncabezadoEstrenos = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={24} color="#000000ff" />
      <Ionicons name="time-outline" size={24} color="#333" />
      <Ionicons name="film-outline" size={24} color="#333" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
});

export default EncabezadoEstrenos;


