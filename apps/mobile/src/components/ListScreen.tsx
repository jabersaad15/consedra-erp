import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput } from 'react-native';

interface Props<T> {
  data: T[] | undefined;
  isLoading: boolean;
  renderItem: (item: T) => React.ReactElement;
  keyExtractor: (item: T) => string;
  title: string;
  searchable?: boolean;
}

export function ListScreen<T>({ data, isLoading, renderItem, keyExtractor, title }: Props<T>) {
  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#6366F1" /></View>;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={data || []}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => renderItem(item)}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<Text style={styles.empty}>No data</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: '#0F172A', marginBottom: 16 },
  empty: { textAlign: 'center', color: '#94A3B8', marginTop: 40 },
});
