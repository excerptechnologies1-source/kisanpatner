import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import React, { JSX, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const SLIDER_HEIGHT = height > 600 ? 180 : 140;

// Define types for category
interface Category {
  _id: string;
  categoryName: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  img?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PromoSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  bgColor: string;
  accent: string;
  backgroundImage?: string;
}

// Image mapping database for categories without images - ALL WORKING URLs
const categoryImageDatabase: Record<string, string> = {
  'vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'fruits': 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'flowers': 'https://images.unsplash.com/photo-1566385101042-1a0f0c126c96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'grains': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'spices': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'medicinal': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'onion': 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'carrot': 'https://images.unsplash.com/photo-1582515073490-39981397c445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'cabbage': 'https://images.unsplash.com/photo-1563021257-4c26884f4ee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'pepper': 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'cucumber': 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'dairy': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'pulses': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'cereals': 'https://images.unsplash.com/photo-1586985289688-cacf016f6b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'herbs': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'nuts': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'seeds': 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  'default': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
};

// Fallback categories with working image URLs
const fallbackCategories = [
  {
    id: "1",
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    title: "Vegetables",
    link: "/(traderscreen)/Allcrops",
  },
  {
    id: "2",
    img: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    title: "Fruits",
    link: "/(traderscreen)/Allcrops",
  },
  {
    id: "3",
    img: "https://images.unsplash.com/photo-1566385101042-1a0f0c126c96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    title: "Flowers",
    link: "/(traderscreen)/Allcrops",
  },
  {
    id: "4",
    img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    title: "Grains",
    link: "/(traderscreen)/Allcrops",
  },
  {
    id: "5",
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    title: "Spices",
    link: "/(traderscreen)/Allcrops",
  },
  {
    id: "6",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    title: "Medicinal Plants",
    link: "/(traderscreen)/Allcrops",
  },
];

// Promo slides with WORKING background images
const promoSlides: PromoSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Fresh Organic Vegetables',
    subtitle: 'Up to 40% Off',
    bgColor: 'rgba(232, 245, 233, 0.85)',
    accent: '#2E7D32',
    backgroundImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Premium Fresh Fruits',
    subtitle: 'Buy 2 Get 1 Free',
    bgColor: 'rgba(255, 243, 224, 0.85)',
    accent: '#E65100',
    backgroundImage: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Organic Groceries',
    subtitle: 'Free Delivery on Orders',
    bgColor: 'rgba(243, 229, 245, 0.85)',
    accent: '#6A1B9A',
    backgroundImage: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1505253866-3bc1a5c6ed29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Farm Fresh Produce',
    subtitle: 'Direct from Farmers',
    bgColor: 'rgba(232, 245, 233, 0.85)',
    accent: '#4CAF50',
    backgroundImage: 'https://images.unsplash.com/photo-1505253866-3bc1a5c6ed29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Fresh Spices & Herbs',
    subtitle: 'Limited Time Offer',
    bgColor: 'rgba(255, 243, 224, 0.85)',
    accent: '#FF9800',
    backgroundImage: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

// Category icons with enhanced design
const categoryIcons = [
  { id: '1', name: 'Vegetables', icon: '🥬', color: '#4CAF50', bgColor: '#E8F5E9' },
  { id: '2', name: 'Fruits', icon: '🍎', color: '#FF9800', bgColor: '#FFF3E0' },
  { id: '3', name: 'Dairy', icon: '🥛', color: '#2196F3', bgColor: '#E3F2FD' },
  { id: '4', name: 'Grains', icon: '🌾', color: '#795548', bgColor: '#EFEBE9' },
  { id: '5', name: 'Spices', icon: '🌶️', color: '#F44336', bgColor: '#FFEBEE' },
  { id: '6', name: 'Herbs', icon: '🌱', color: '#4CAF50', bgColor: '#E8F5E9' },
  { id: '7', name: 'Organic', icon: '🌿', color: '#2E7D32', bgColor: '#E8F5E9' },
  { id: '8', name: 'Nuts', icon: '🥜', color: '#795548', bgColor: '#EFEBE9' },
];

// Enhanced static slider with ALL WORKING images
const staticSlider = [
  {
    id: "1",
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Fresh Farm Vegetables",
    des: "Direct from organic farms to your table",
    link: "/(traderscreen)/Allcrops"
  },
  {
    id: "2",
    img: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Seasonal Fruits Collection",
    des: "Sweet and juicy fruits at peak ripeness",
    link: "/(traderscreen)/Allcrops"
  },
  {
    id: "3",
    img: "https://images.unsplash.com/photo-1505253866-3bc1a5c6ed29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Premium Quality Produce",
    des: "Carefully selected for maximum freshness",
    link: "/(traderscreen)/Allcrops"
  },
  {
    id: "4",
    img: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Organic Groceries",
    des: "Healthy and sustainable food options",
    link: "/(traderscreen)/Allcrops"
  },
  {
    id: "5",
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Fresh Spices & Herbs",
    des: "Aromatic spices and fresh herbs",
    link: "/(traderscreen)/Allcrops"
  },
  {
    id: "6",
    img: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    title: "Farm Fresh Dairy",
    des: "Fresh dairy products from local farms",
    link: "/(traderscreen)/Allcrops"
  },
];

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [activePromoSlide, setActivePromoSlide] = useState(0);
  const [location, setLocation] = useState<string>('Getting location...');
  const [isLocationRequested, setIsLocationRequested] = useState(false);

  type ActionItem = {
    title: string;
    icon: JSX.Element;
    link: string;
    color: string;
    bgColor: string;
  };

  // Only 3 Quick Actions buttons
  const quickActions: ActionItem[] = [
    {
      link: "/(traderscreen)/PostRequirement",
      title: "Post Requirement",
      icon: <FontAwesome6 name="file-lines" size={26} color="#FFFFFF" />,
      color: "#FFFFFF",
      bgColor: "#4CAF50"
    },
    {
      link: "/(traderscreen)/Allcrops",
      title: "All Crops",
      icon: <Entypo name="crop" size={26} color="#FFFFFF" />,
      color: "#FFFFFF",
      bgColor: "#2196F3"
    },
    {
      link: "/(traderscreen)/TraderOrderHistory",
      title: "My Orders",
      icon: <MaterialCommunityIcons name="truck-delivery" size={26} color="#FFFFFF" />,
      color: "#FFFFFF",
      bgColor: "#FF9800"
    },
  ];

  /**
   * Get location from device GPS or browser geolocation API
   */
  const getCurrentLocation = async (): Promise<{latitude: number, longitude: number} | null> => {
    try {
      // For React Native / Expo
      if (Platform.OS !== 'web') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          console.log('Location permission denied');
          return null;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          // timeout: 10000
        });

        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        };
      } 
      // For Web
      else {
        return new Promise((resolve) => {
          if (!navigator.geolocation) {
            console.log('Geolocation is not supported by this browser');
            resolve(null);
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            (error) => {
              console.log('Error getting location:', error.message);
              resolve(null);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  /**
   * Reverse geocode coordinates to get city/state name using OpenStreetMap
   */
  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }
      
      const data = await response.json();
      
      if (data.address) {
        // Try to get city, town, village, or state
        const city = data.address.city || data.address.town || data.address.village || data.address.county;
        const state = data.address.state || data.address.region;
        
        if (city && state) {
          return `${city}, ${state}`;
        } else if (city) {
          return city;
        } else if (state) {
          return state;
        } else if (data.address.country) {
          return data.address.country;
        }
      }
      
      return 'Location found';
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return 'Unknown location';
    }
  };

  /**
   * Get location using IP address as fallback
   */
  const getLocationByIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      
      if (!response.ok) {
        throw new Error('IP location failed');
      }
      
      const data = await response.json();
      
      if (data.city && data.region) {
        return `${data.city}, ${data.region}`;
      } else if (data.city) {
        return data.city;
      } else if (data.country_name) {
        return data.country_name;
      }
      
      return 'Unknown location';
    } catch (error) {
      console.error('IP location error:', error);
      return 'Unknown location';
    }
  };

  /**
   * Main function to get user location
   */
  const fetchUserLocation = async () => {
    try {
      setIsLocationRequested(true);
      setLocation('Detecting location...');

      // 1. First try GPS location
      const coordinates = await getCurrentLocation();
      
      if (coordinates) {
        // Reverse geocode to get address
        const locationName = await reverseGeocode(coordinates.latitude, coordinates.longitude);
        setLocation(locationName);
        await AsyncStorage.setItem('userLocation', locationName);
        console.log('GPS Location found:', locationName);
        return;
      }

      // 2. If GPS fails, try IP-based location
      console.log('GPS failed, trying IP-based location...');
      const ipLocation = await getLocationByIP();
      setLocation(ipLocation);
      await AsyncStorage.setItem('userLocation', ipLocation);
      console.log('IP Location found:', ipLocation);

    } catch (error) {
      console.error('Error fetching location:', error);
      
      // 3. Load saved location or use default
      try {
        const savedLocation = await AsyncStorage.getItem('userLocation');
        if (savedLocation) {
          setLocation(savedLocation);
          console.log('Using saved location:', savedLocation);
        } else {
          // 4. Use Bangalore as ultimate fallback
          const defaultLocation = 'Bangalore, Karnataka';
          setLocation(defaultLocation);
          await AsyncStorage.setItem('userLocation', defaultLocation);
          console.log('Using default location:', defaultLocation);
        }
      } catch (storageError) {
        console.error('Storage error:', storageError);
        setLocation('Bangalore, Karnataka');
      }
    }
  };

  /**
   * Get image URL based on category name - IMPROVED
   */
  const getImageForCategory = (categoryName: string): string => {
    if (!categoryName) {
      return categoryImageDatabase['default'];
    }

    const lowerName = categoryName.toLowerCase().trim();

    // Direct match
    if (categoryImageDatabase[lowerName]) {
      return categoryImageDatabase[lowerName];
    }

    // Common variations
    const variations: Record<string, string> = {
      'veg': 'vegetables',
      'vegetable': 'vegetables',
      'fruit': 'fruits',
      'flower': 'flowers',
      'grain': 'grains',
      'spice': 'spices',
      'med': 'medicinal',
      'plant': 'medicinal',
      'dairy product': 'dairy',
      'pulse': 'pulses',
      'cereal': 'cereals',
      'herb': 'herbs',
      'nut': 'nuts',
      'seed': 'seeds',
      'tomatoes': 'tomato',
      'potatoes': 'potato',
      'onions': 'onion',
      'carrots': 'carrot',
      'spinaches': 'spinach',
      'cabbages': 'cabbage',
      'peppers': 'pepper',
      'cucumbers': 'cucumber',
    };

    // Check variations
    if (variations[lowerName]) {
      return categoryImageDatabase[variations[lowerName]] || categoryImageDatabase['default'];
    }

    // Partial match
    for (const [key, value] of Object.entries(categoryImageDatabase)) {
      if (lowerName.includes(key) || key.includes(lowerName)) {
        return value;
      }
    }

    // Default
    return categoryImageDatabase['default'];
  };

  /**
   * Fetch categories from API with timeout handling
   */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      setUseFallback(false);

      console.log('🔍 Starting category fetch...');

      const traderId = await AsyncStorage.getItem('traderId');
      const endpoints = [
        'https://kisan.etpl.ai/category/all',
        'https://kisan.etpl.ai/category',
        'https://kisan.etpl.ai/api/categories',
      ];

      let response = null;
      let result = null;
      let successEndpoint = '';

      // Create a timeout promise
      const timeoutPromise = (timeout: number) => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error(`Request timeout after ${timeout}ms`)), timeout);
        });
      };

      for (const endpoint of endpoints) {
        try {
          console.log(`🌐 Trying endpoint: ${endpoint}`);
          
          // Create fetch promise with AbortController for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          
          response = await Promise.race([
            fetch(endpoint, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                ...(traderId && { 'Authorization': `Bearer ${traderId}` })
              },
              signal: controller.signal
            }),
            timeoutPromise(10000) as Promise<Response>
          ]);

          clearTimeout(timeoutId);

          if (response && response.ok) {
            result = await response.json();
            successEndpoint = endpoint;
            console.log(`✅ Success with endpoint: ${endpoint}`);
            break;
          } else if (response) {
            console.log(`❌ Failed with status: ${response.status}`);
          }
        } catch (err: any) {
          console.log(`❌ Error with endpoint ${endpoint}:`, err.message);
          if (err.name === 'AbortError') {
            console.log(`⏰ Timeout for endpoint: ${endpoint}`);
          }
          continue;
        }
      }

      if (!response || !response.ok) {
        console.log('⚠️ All endpoints failed or timeout, using fallback');
        setCategories(fallbackCategories);
        setUseFallback(true);
        setLoading(false);
        return;
      }

      // Extract categories from response
      let categoriesData = [];

      if (result?.data && Array.isArray(result.data)) {
        categoriesData = result.data;
      } else if (result?.categories && Array.isArray(result.categories)) {
        categoriesData = result.categories;
      } else if (Array.isArray(result)) {
        categoriesData = result;
      } else {
        console.log('⚠️ Unexpected response format, using fallback');
        setCategories(fallbackCategories);
        setUseFallback(true);
        setLoading(false);
        return;
      }

      console.log(`📋 Found ${categoriesData.length} categories from API`);

      if (Array.isArray(categoriesData) && categoriesData.length > 0) {
        const mappedCategories = categoriesData.map((cat: any, index: number) => {
          const categoryName = cat.categoryName || cat.name || cat.title || `Category ${index + 1}`;
          const categoryId = cat._id || cat.id || `cat-${index}`;
          const imageUrl = getImageForCategory(categoryName);

          console.log(`📸 ${categoryName} -> ${imageUrl}`);

          return {
            id: categoryId,
            img: imageUrl,
            title: categoryName,
            link: "/(traderscreen)/Allcrops",
            description: cat.description || '',
            status: cat.status || 'active'
          };
        });

        console.log('✅ Successfully mapped all categories with images');
        setCategories(mappedCategories);
      } else {
        console.log('⚠️ No categories found, using fallback');
        setCategories(fallbackCategories);
        setUseFallback(true);
      }
    } catch (err: any) {
      console.error('❌ Error:', err.message);
      setError(err.message || 'Failed to load categories');
      setCategories(fallbackCategories);
      setUseFallback(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle category press - FIXED navigation
   */
  const handleCategoryPress = (categoryTitle: string) => {
    router.push({
      pathname: "/(traderscreen)/Allcrops",
      params: {
        selectedCategory: categoryTitle,
        filterType: 'category'
      }
    });
  };

  /**
   * Handle Browse Categories button press - FIXED navigation
   */
  const handleBrowseCategories = () => {
    router.push("/(traderscreen)/Allcrops");
  };

  /**
   * Handle Buy Now button press in promo slider - FIXED navigation
   */
  const handlePromoBuyNow = () => {
    router.push("/(traderscreen)/Allcrops");
  };

  /**
   * Handle slider item press - FIXED navigation
   */
  const handleSliderItemPress = () => {
    router.push("/(traderscreen)/Allcrops");
  };

  /**
   * Handle category icon tab press - FIXED navigation
   */
  const handleCategoryTabPress = (categoryName: string) => {
    router.push({
      pathname: "/(traderscreen)/Allcrops",
      params: {
        selectedCategory: categoryName,
        filterType: 'category'
      }
    });
  };

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = () => {
    setRefreshing(true);
    fetchCategories();
    fetchUserLocation();
  };

  /**
   * Handle change location button press
   */
  const handleChangeLocation = () => {
    Alert.alert(
      'Change Location',
      'Do you want to update your current location?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: fetchUserLocation,
        },
      ]
    );
  };

  /**
   * Render promo slide with background image - FIXED Buy Now button
   */
  const renderPromoSlide = () => {
    const currentSlide = promoSlides[activePromoSlide];
    
    return (
      <View className="mx-4 my-4 rounded-3xl overflow-hidden shadow-lg" style={{ height: SLIDER_HEIGHT }}>
        {/* Background Image with fallback */}
        <Image 
          source={{ uri: currentSlide.backgroundImage || currentSlide.image }}
          className="absolute w-full h-full"
          resizeMode="cover"
          blurRadius={1}
          defaultSource={{ uri: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }}
          onError={() => console.log('Error loading promo background image')}
        />
        
        {/* Overlay with color */}
        <View 
          className="p-5 flex-row items-center h-full"
          style={{ backgroundColor: currentSlide.bgColor }}
        >
          <View className="flex-1 mr-4">
            <View className="bg-white px-3 py-1 rounded-full mb-3 self-start">
              <Text className="text-xs font-medium" style={{ color: currentSlide.accent }}>
                🎉 {currentSlide.subtitle}
              </Text>
            </View>
            <Text className="text-lg font-medium text-gray-800 mb-3">{currentSlide.title}</Text>
            <TouchableOpacity 
              className="px-5 py-2 rounded-full self-start shadow-md"
              style={{ backgroundColor: currentSlide.accent }}
              onPress={handlePromoBuyNow}
              activeOpacity={0.8}
            >
              <Text className="text-white text-sm font-medium">Shop Now →</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: currentSlide.image }}
            className="w-20 h-20 rounded-2xl border-2 border-white"
            resizeMode="cover"
            defaultSource={{ uri: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }}
            onError={() => console.log('Error loading promo image')}
          />
        </View>
      </View>
    );
  };

  /**
   * Render enhanced category tab - FIXED navigation
   */
  const renderCategoryTab = ({ item, index }: { item: any, index: number }) => {
    const isActive = activeCategory === index;
    
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => {
          setActiveCategory(index);
          handleCategoryTabPress(item.name);
        }}
        className={`flex-col items-center mr-4 px-4 py-3 rounded-2xl ${
          isActive 
            ? 'bg-white shadow-lg border border-gray-200' 
            : 'bg-gray-50'
        }`}
        style={{ 
          minWidth: 80,
          elevation: isActive ? 3 : 0,
          shadowColor: isActive ? '#000' : 'transparent',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isActive ? 0.1 : 0,
          shadowRadius: isActive ? 4 : 0,
        }}
        activeOpacity={0.7}
      >
        <View 
          className="w-12 h-12 rounded-full items-center justify-center mb-2"
          style={{ backgroundColor: item.bgColor }}
        >
          <Text className="text-2xl">{item.icon}</Text>
        </View>
        <Text 
          className={`text-xs font-medium text-center ${isActive ? 'text-gray-800' : 'text-gray-600'}`}
          numberOfLines={2}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * Render category item - FIXED to show all images
   */
  const renderCategoryItem = ({ item, onPress }: { item: any, onPress: () => void }) => {
    return (
      <TouchableOpacity
        className="mb-4 rounded-2xl overflow-hidden shadow-md bg-white border border-gray-100"
        style={{ width: CARD_WIDTH }}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View className="h-32 bg-gray-100">
          <Image
            source={{ uri: item.img || getImageForCategory(item.title) }}
            className="w-full h-full"
            resizeMode="cover"
            defaultSource={{ uri: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' }}
            onError={(e) => {
              console.log('Error loading category image:', item.title, e.nativeEvent.error);
              // Try fallback
              const fallbackImg = getImageForCategory(item.title);
              if (fallbackImg !== item.img) {
                item.img = fallbackImg;
              }
            }}
          />
        </View>
        <View className="p-3">
          <Text className="text-sm font-medium text-gray-800 mb-1" numberOfLines={1}>
            {item.title}
          </Text>
          <Text className="text-xs text-gray-500" numberOfLines={2}>
            {item.description || 'Fresh produce available'}
          </Text>
          <TouchableOpacity 
            className="mt-2 self-start"
            onPress={onPress}
          >
            <Text className="text-green-600 text-xs font-medium">Browse →</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Render slider item - FIXED to show all images
   */
  const renderSliderItem = ({ item, onPress }: { item: any, onPress: () => void }) => {
    return (
      <TouchableOpacity
        className="mr-4 rounded-2xl overflow-hidden shadow-lg bg-white"
        style={{ width: width > 600 ? 300 : 260, height: 180 }}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.img }}
          className="w-full h-full"
          resizeMode="cover"
          defaultSource={{ uri: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }}
          onError={() => console.log('Error loading slider image:', item.id)}
        />
        <View className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
          <Text className="text-white font-medium text-base mb-1">{item.title}</Text>
          <Text className="text-white/90 text-xs mb-2">{item.des}</Text>
          <TouchableOpacity 
            className="bg-green-500 px-4 py-2 rounded-full self-start"
            onPress={onPress}
          >
            <Text className="text-white text-xs font-medium">Buy Now →</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Auto-rotate promo slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromoSlide((prev) => (prev + 1) % promoSlides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Fetch categories and request location on mount
  useEffect(() => {
    fetchCategories();
    fetchUserLocation();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with location and change location button */}
      <View className="px-4 py-3 border-b border-gray-100">
  <View className="flex-row justify-between items-center">
    
    {/* LEFT: Location */}
    <View className="flex-row items-center flex-1">
      <View className="bg-green-500 w-10 h-10 rounded-full items-center justify-center mr-3">
        <Entypo name="location-pin" size={20} color="white" />
      </View>

      <View className="flex-1">
        <Text
          className="text-sm font-medium text-gray-800"
          numberOfLines={1}
        >
          {location}
        </Text>

        <TouchableOpacity onPress={handleChangeLocation}>
          <Text className="text-green-600 text-xs mt-1">
            Change location
          </Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* RIGHT: Cart + Notification */}
    <View className="flex-row items-center space-x-3">

      {/* 🛒 Cart Button */}
      <TouchableOpacity
        className="relative"
        onPress={() => router.push("/(traderscreen)/TraderOrder")} 
        // OR Cart page → "/(traderscreen)/Cart"
      >
        <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
          <Ionicons name="cart-outline" size={20} color="#666" />
        </View>

        {/* Cart Count (optional) */}
        <View className="absolute -top-1 -right-1 bg-green-500 w-5 h-5 rounded-full items-center justify-center">
          <Text className="text-white text-xs font-medium">2</Text>
        </View>
      </TouchableOpacity>

      {/* 🔔 Notification Button */}
      <TouchableOpacity
        className="relative"
        onPress={() =>
          router.push("/(traderscreen)/TraderNotifications")
        }
      >
        <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
          <Ionicons
            name="notifications-outline"
            size={20}
            color="#666"
          />
        </View>

        <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
          <Text className="text-white text-xs font-medium">3</Text>
        </View>
      </TouchableOpacity>

    </View>
  </View>
</View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4CAF50"]}
            tintColor="#4CAF50"
          />
        }
      >
        {/* Promo Slider with Background Images */}
        <View className="mb-4">
          {renderPromoSlide()}
          
          {/* Pagination Dots */}
          <View className="flex-row justify-center space-x-1 mb-4">
            {promoSlides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActivePromoSlide(index)}
                className={`rounded-full ${
                  activePromoSlide === index 
                    ? 'bg-green-500 w-6' 
                    : 'bg-gray-300 w-2'
                } h-2`}
              />
            ))}
          </View>
        </View>

        {/* Enhanced Category Tabs with better design - FIXED navigation */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-medium text-gray-800">Browse Categories</Text>
            <TouchableOpacity onPress={handleBrowseCategories}>
              <Text className="text-green-600 text-sm font-medium">View All →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categoryIcons}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            renderItem={renderCategoryTab}
            snapToInterval={96}
            decelerationRate="fast"
          />
        </View>

        {/* Enhanced Quick Actions with only 3 buttons */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-medium text-gray-800 mb-4">Quick Actions</Text>
          <View className="flex-row justify-between">
            {quickActions.map((item, i) => (
              <TouchableOpacity
                key={i}
                className="w-28 h-32 rounded-xl items-center justify-center shadow-lg"
                style={{ backgroundColor: item.bgColor }}
                activeOpacity={0.8}
                onPress={() => router.push(item.link as any)}
              >
                <View className="mb-3 p-4 rounded-full bg-white/20">
                  {item.icon}
                </View>
                <Text className="text-center text-sm font-medium text-white mt-1" numberOfLines={2}>
                  {item.title}
                </Text>
                <View className="absolute bottom-3 right-3">
                  <Entypo name="chevron-right" size={14} color="white" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Products Slider - Based on Location - FIXED navigation */}
        <View className="mb-6">
          <View className="px-4 mb-4 flex-row justify-between items-center">
            <Text className="text-lg font-medium text-gray-800">
              Featured Products {location !== 'Getting location...' && location !== 'Location unavailable' && location.includes(',') ? `in ${location.split(',')[0]}` : ''}
            </Text>
            <TouchableOpacity onPress={handleBrowseCategories}>
              <Text className="text-green-600 text-sm font-medium">View All →</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={staticSlider}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => renderSliderItem({
              item,
              onPress: handleSliderItemPress
            })}
            snapToInterval={width > 600 ? 300 : 276}
            decelerationRate="fast"
            getItemLayout={(data, index) => ({
              length: width > 600 ? 300 : 276,
              offset: (width > 600 ? 300 : 276) * index,
              index,
            })}
          />
        </View>

        {/* Enhanced Categories Section */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-medium text-gray-800">Explore Categories</Text>
            <TouchableOpacity onPress={handleBrowseCategories}>
              <Text className="text-green-600 text-sm font-medium">View All →</Text>
            </TouchableOpacity>
          </View>

          {useFallback && (
            <View className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Text className="text-blue-800 text-sm font-medium">
                ℹ️ Using local database for images
              </Text>
            </View>
          )}

          {loading && !refreshing && (
            <View className="py-10">
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text className="text-center text-gray-500 mt-2">Loading categories...</Text>
            </View>
          )}

          {error && !loading && (
            <View className="py-10 items-center">
              <Text className="text-red-500 text-center mb-2 font-medium">Error</Text>
              <Text className="text-red-400 text-xs text-center mb-4">{error}</Text>
              <TouchableOpacity
                onPress={fetchCategories}
                className="bg-green-500 px-6 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Enhanced Categories List - FIXED to show all images */}
        {(!loading || useFallback) && (
          <>
            <FlatList
              data={categories.length > 0 ? categories : fallbackCategories}
              numColumns={2}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderCategoryItem({
                item,
                onPress: () => handleCategoryPress(item.title)
              })}
              scrollEnabled={false}
              columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 16 }}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              ListEmptyComponent={
                <View className="py-10 items-center">
                  <Text className="text-gray-500">No categories available</Text>
                </View>
              }
            />

            <View className="flex-row p-3 justify-center items-center mb-8">
              <TouchableOpacity
                onPress={handleBrowseCategories}
                className="bg-green-500 p-3 px-8 rounded-full shadow-lg flex-row items-center"
                activeOpacity={0.8}
              >
                <Entypo name="crop" size={20} color="white" />
                <Text className="text-white font-medium ml-2">Browse All Categories</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;