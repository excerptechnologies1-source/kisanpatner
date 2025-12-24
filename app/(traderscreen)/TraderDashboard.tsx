import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import renderSliderItem from './renderSliderItem';
import renderCategoryItem from './renderCategoryItem';


const slider = [
    {
      id: "1",
      img: "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
      title: "Fresh Tomatoes Arrived",
      des: "Premium Quality Tomatoes available now.",
    },
    {
      id: "2",
      img: "https://thumbs.dreamstime.com/b/vegetables-group-white-background-vector-illustration-48246562.jpg",
      title: "Fresh Vegetables Arrived",
      des: "Premium Quality vegetables available now.",
    },
    {
      id: "3",
      img: "https://happyharvestfarms.com/blog/wp-content/uploads/2024/01/Vegetables-3.jpg",
      title: "Fresh Vegetables Arrived",
      des: "Premium Quality vegetables available now.",
    },
  ];

   const Category=[
    {
      id: "1",
      img: "https://cdn.firstcry.com/education/2022/11/08143105/Green-Vegetables-Names-in-English-for-Kids.jpg",
      title: "Tomatoes",
    },
    {
      id: "2",
      img: "https://images.squarespace-cdn.com/content/v1/578753d7d482e9c3a909de40/1475214227717-ZZC578EFLPPMNHNRTKQH/444B0502.jpg?format=2500w",
      title: "Tomatoes",
    },
    {
      id: "3",
      img: "https://hips.hearstapps.com/hmg-prod/images/fresh-vegetables-in-basket-on-wooden-background-royalty-free-image-1676394780.jpg?crop=1xw:0.84415xh;0,0.108xh",
      title: "Tomatoes",
    },
    {
      id: "4",
      img: "https://cdn.britannica.com/63/186963-138-AEE87658/vegetables.jpg?w=800&h=450&c=crop",
      title: "Tomatoes",
    },
    {
      id: "5",
      img: "https://5.imimg.com/data5/ANDROID/Default/2024/11/469480228/YS/EE/TL/63667197/product-jpeg-500x500.jpg",
      title: "Tomatoes",
    },
    {
      id: "6",
      img: "https://media.post.rvohealth.io/wp-content/uploads/sites/3/2025/05/healthful-vegetables-GettyImages-1251268295-Facebook.jpg",
      title: "Tomatoes",
    },
    {
      id: "7",
      img: "https://agricultureguruji.com/wp-content/uploads/2021/05/best-vegetable-grow-in-greenhouse-scaled.jpeg",
      title: "Tomatoes",
    },
    {
      id: "8",
      img: "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
      title: "Tomatoes",
    },
  ]


const TraderDashboard = () => {
  const navigation = useNavigation();

  const CategoryIcon = ({ label }: { label: string }) => {
    return (
      <View style={styles.categoryIcon}>
        <MaterialCommunityIcons name="leaf" size={32} color="#2E7D42" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
    
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Action Buttons Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => (navigation.navigate as any)('traders/PostRequirement')}
          >
            <View style={styles.actionIcon}>
              <Feather name="plus" size={18} color="#4CAF50" />
            </View>
            <Text style={styles.actionText}>Post Requirements</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="sprout" size={18} color="#4CAF50" />
            </View>
            <Text style={styles.actionText}>All Crops</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="format-list-bulleted" size={18} color="#4CAF50" />
            </View>
            <Text style={styles.actionText}>My Orders</Text>
          </TouchableOpacity>
        </View>

        {/* SLIDER SECTION */}
        <View >
          <View className="px-4 mb-3">
            <Text className="text-lg font-semibold text-gray-700">Featured Products</Text>
          </View>
          
          <FlatList
            data={slider}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={renderSliderItem}
            snapToInterval={272} 
            decelerationRate="fast"
          />
        </View>
         {/* Add more sections as needed */}
        <View className="px-6 mt-8">
          <Text className="text-lg font-semibold text-gray-700 mb-4">
           Explore Category
          </Text>
          {/* Add your recently viewed items here */}
        </View>
  <FlatList
  data={Category}
  numColumns={2}
  keyExtractor={(item) => item.id}
  renderItem={renderCategoryItem}
  scrollEnabled={false}  // because ScrollView already scrolls
  columnWrapperStyle={{ justifyContent: "space-between" }}
  contentContainerStyle={{ paddingHorizontal: 16 }}
/>

        {/* Spacer for bottom navigation */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navIcon} onPress={() => {}}>
          <Feather name="home" size={22} color="#4CAF50" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.floatingAdd}
          onPress={() => (navigation.navigate as any)('traders/PostRequirement')}
        >
          <Feather name="plus" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navIcon} onPress={() => {}}>
          <Feather name="refresh-cw" size={22} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  banner: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  bannerContent: {
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  categoriesHeader: {
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6F5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  spacer: {
    height: 80,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navIcon: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingAdd: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: -28,
  },
});

export default TraderDashboard;