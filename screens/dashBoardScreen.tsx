import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { FAB, Portal } from 'react-native-paper';

type TabType = 'ALL' | 'PAID' | 'SIGNED';

export default function LayoutScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('ALL');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Invoice" />
        <Appbar.Action icon="magnify" onPress={() => console.log('Search')} />
      </Appbar.Header>

      <Appbar>
        <Appbar.Action
          icon="view-list"
          onPress={() => handleTabChange('ALL')}
          color={activeTab === 'ALL' ? '#fff' : '#000'}
        />
        <Appbar.Action
          icon="check"
          onPress={() => handleTabChange('PAID')}
          color={activeTab === 'PAID' ? '#fff' : '#000'}
        />
        <Appbar.Action
          icon="signature"
          onPress={() => handleTabChange('SIGNED')}
          color={activeTab === 'SIGNED' ? '#fff' : '#000'}
        />
      </Appbar>

      <View style={styles.body}>
        {/* Render different tabs based on activeTab state */}
        {activeTab === 'ALL' && <Text>Show all invoices</Text>}
        {activeTab === 'PAID' && <Text>Show all paid invoices</Text>}
        {activeTab === 'SIGNED' && <Text>Show all signed invoices</Text>}

        <Portal>
          <FAB style={styles.fab} icon="plus" onPress={() => console.log('Add Invoice')} />
        </Portal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
