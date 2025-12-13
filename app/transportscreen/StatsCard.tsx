import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Package, Truck, CheckCircle, IndianRupee } from 'lucide-react-native';

interface StatsCardsProps {
  newOrders: number;
  ongoingDeliveries: number;
  completedDeliveries: number;
  earnings: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  newOrders,
  ongoingDeliveries,
  completedDeliveries,
  earnings
}) => {
  const stats = [
    {
      title: 'New Orders',
      value: newOrders,
      icon: <Package size={24} color="#3498db" />,
      color: '#e3f2fd'
    },
    {
      title: 'Ongoing Deliveries',
      value: ongoingDeliveries,
      icon: <Truck size={24} color="#f39c12" />,
      color: '#fff8e1'
    },
    {
      title: 'Completed Deliveries',
      value: completedDeliveries,
      icon: <CheckCircle size={24} color="#27ae60" />,
      color: '#e8f5e9'
    },
    {
      title: 'Earnings',
      value: `₹${earnings}`,
      icon: <IndianRupee size={24} color="#9b59b6" />,
      color: '#f3e5f5'
    }
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
    >
      {stats.map((stat, index) => (
        <View
          key={index}
          style={[styles.statCard, { backgroundColor: stat.color }]}
        >
          <View style={styles.iconContainer}>
            {stat.icon}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.statValue}>
              {stat.value}
            </Text>
            <Text style={styles.statTitle}>
              {stat.title}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginVertical: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 15,
  },
  statCard: {
    width: 200,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  statTitle: {
    marginTop: 5,
    color: '#666',
    fontSize: 14,
  },
});

export default StatsCards;