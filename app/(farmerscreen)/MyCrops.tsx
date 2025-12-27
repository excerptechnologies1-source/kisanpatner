import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
} from 'react-native';
import TrackingPage from './TrackingPage';

interface Crop {
  _id: string;
  farmingType: string;
  seedType: string;
  sowingDate: string;
}

interface Props {
  onBack: () => void;
  onAddNew: () => void;
  crops?: Crop[];
  fetchCrops?: () => void;
  onReupload: (crop: Crop) => void;
}

const MyCrops: React.FC<Props> = ({
  onBack,
  onAddNew,
  crops = [],
  fetchCrops,
  onReupload,
}) => {
  const [activeTab, setActiveTab] = useState<'for-sale' | 'tracking' | 'history'>('tracking');
  const [farmerId, setFarmerId] = useState<string>('');

  useEffect(() => {
    if (fetchCrops) fetchCrops();
    (async () => {
      try {
        const id = await AsyncStorage.getItem('farmerId');
        if (id) setFarmerId(id);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const renderTabButton = (tab: 'for-sale' | 'tracking' | 'history', label: string) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      style={[
        styles.tabButton,
        activeTab === tab && styles.tabButtonActive,
      ]}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderCropItem = ({ item }: { item: Crop }) => (
    <View style={styles.cropCard}>
      <View style={styles.cropHeader}>
        <View style={styles.cropInfo}>
          <Text style={styles.cropName}>
            {item.farmingType} - {item.seedType}
          </Text>
          <Text style={styles.cropDate}>
            {new Date(item.sowingDate).toDateString()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onReupload(item)}
          style={styles.reuploadButton}
        >
          <Text style={styles.reuploadText}>📸 Re-upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Crops</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {renderTabButton('for-sale', 'For Sale')}
        {renderTabButton('tracking', 'Tracking')}
        {renderTabButton('history', 'History')}
      </ScrollView>

      <ScrollView style={styles.content}>
        {activeTab === 'tracking' && (
          <View style={styles.trackingContent}>
            {/* {farmerId !== '' && (
              <TrackingPage name={'Guntur Chilli Tracking (Regular – Naati)'} farmerId={farmerId} />
            )} */}

            {crops && crops.length > 0 && (
              <FlatList
                scrollEnabled={false}
                data={crops}
                renderItem={renderCropItem}
                keyExtractor={(item) => item._id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.cropsList}
              />
            )}
          </View>
        )}

        {activeTab === 'for-sale' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No items for sale yet.</Text>
          </View>
        )}

        {activeTab === 'history' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>History is empty.</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={onAddNew}
        style={styles.fab}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  backText: {
    fontSize: 20,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    backgroundColor: 'white',
    marginRight: 8,
  },
  tabButtonActive: {
    borderColor: '#1ca723',
    borderWidth: 2,
    backgroundColor: '#e8f5e9',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#1ca723',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  trackingContent: {
    gap: 12,
  },
  cropsList: {
    paddingVertical: 10,
  },
  separator: {
    height: 8,
  },
  cropCard: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  cropDate: {
    fontSize: 12,
    color: '#666',
  },
  reuploadButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#2196f3',
    marginLeft: 8,
  },
  reuploadText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  emptyState: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1ca723',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1ca723',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 9,
    elevation: 12,
  },
  fabText: {
    fontSize: 28,
    color: 'white',
    fontWeight: '600',
  },
});

export default MyCrops;