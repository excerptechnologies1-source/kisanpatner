// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Alert,
//   ActivityIndicator,
//   StatusBar,
//   Dimensions,
//   Animated,
//   Modal,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard, LogOut, User } from 'lucide-react-native';
// import { router, useFocusEffect } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';


// interface CartItem {
//   _id?: string;
//   productId: string;
//   productName: string;
//   seedId?: string;
//   seedName: string;
//   seedPrice: number;
//   quantity: number;
//   image?: string;
//   addedAt: Date;
// }

// interface CartData {
//   _id?: string;
//   items: CartItem[];
//   subtotal: number;
//   gst: number;
//   shipping: number;
//   total: number;
// }

// interface User {
//   _id: string;
//   personalInfo: {
//     name: string;
//     mobileNo: string;
//     address?: string;
//     villageGramaPanchayat?: string;
//     pincode?: string;
//     state?: string;
//     district?: string;
//   };
//   role: string;
//   farmerId?: string;
// }

// const { width } = Dimensions.get('window');

// const CropcareCart: React.FC = () => {
//   const [cart, setCart] = useState<CartData>({
//     items: [],
//     subtotal: 0,
//     gst: 0,
//     shipping: 0,
//     total: 0
//   });
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState({
//     cart: false,
//     payment: false,
//     auth: true
//   });
//   const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
//   const [notificationAnim] = useState(new Animated.Value(0));
//   const [showLoginModal, setShowLoginModal] = useState(false);

//   const CART_API_URL = 'https://kisan.etpl.ai/api/cropcare';

//   useFocusEffect(
//     React.useCallback(() => {
//       checkAuthStatus();
//     }, [])
//   );

//   useEffect(() => {
//     if (user) {
//       fetchUserCart();
//     } else {
//       // Reset cart when user is not authenticated
//       setCart({
//         items: [],
//         subtotal: 0,
//         gst: 0,
//         shipping: 0,
//         total: 0
//       });
//     }
//   }, [user]);

//   useEffect(() => {
//     if (notification) {
//       Animated.timing(notificationAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();

//       const timer = setTimeout(() => {
//         hideNotification();
//       }, 3000);

//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   const hideNotification = () => {
//     Animated.timing(notificationAnim, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setNotification(null);
//     });
//   };

//   const checkAuthStatus = async () => {
//     setLoading(prev => ({ ...prev, auth: true }));
//     try {
//       // Check all required authentication items
//       const [userData, role, userId, farmerId] = await Promise.all([
//         AsyncStorage.getItem('userData'),
//         AsyncStorage.getItem('userRole'),
//         AsyncStorage.getItem('userId'),
//         AsyncStorage.getItem('farmerId'),
//       ]);

//       console.log('Cart Auth check:', { userData, role, userId, farmerId });

//       if (userData && role && userId) {
//         try {
//           const parsedUserData = JSON.parse(userData);
//           const phone = await AsyncStorage.getItem('phone');
          
//           const userObj: User = {
//             _id: userId,
//             role: role,
//             personalInfo: {
//               name: parsedUserData.personalInfo?.name || parsedUserData.name || 'User',
//               mobileNo: parsedUserData.personalInfo?.mobileNo || parsedUserData.mobileNo || phone || '',
//               address: parsedUserData.personalInfo?.address,
//               villageGramaPanchayat: parsedUserData.personalInfo?.villageGramaPanchayat,
//               pincode: parsedUserData.personalInfo?.pincode,
//               state: parsedUserData.personalInfo?.state,
//               district: parsedUserData.personalInfo?.district
//             }
//           };

//           // Add farmerId if available
//           if (farmerId) {
//             userObj.farmerId = farmerId;
//           }

//           setUser(userObj);
//           setShowLoginModal(false);
//           console.log('Cart User authenticated:', userObj);
//         } catch (error) {
//           console.error('Error parsing user data:', error);
//           setUser(null);
//           setShowLoginModal(true);
//         }
//       } else {
//         console.log('Cart User not authenticated');
//         setUser(null);
//         setShowLoginModal(true);
//       }
//     } catch (error) {
//       console.error('Error checking auth status:', error);
//       setUser(null);
//       setShowLoginModal(true);
//     } finally {
//       setLoading(prev => ({ ...prev, auth: false }));
//     }
//   };

//   const handleLogin = () => {
//     setShowLoginModal(false);
//     router.push('/(auth)/Login?role=farmer');
//   };

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.clear();
//       setUser(null);
//       setCart({
//         items: [],
//         subtotal: 0,
//         gst: 0,
//         shipping: 0,
//         total: 0
//       });
//       setShowLoginModal(true);
//       showNotification('success', 'You have been logged out successfully');
//     } catch (err) {
//       console.error('Logout error:', err);
//       showNotification('error', 'Failed to logout');
//     }
//   };

//   const fetchUserCart = async () => {
//     if (!user) return;

//     setLoading(prev => ({ ...prev, cart: true }));
//     try {
//       // Use farmerId if available, otherwise use userId
//       const idToUse = user.farmerId || user._id;
//       console.log('Fetching cart for ID:', idToUse);
      
//       const response = await fetch(`${CART_API_URL}/cart/${idToUse}`);
//       const data = await response.json();

//       console.log('Cart API response:', data);

//       if (data.success && data.data) {
//         setCart(data.data);
//       } else {
//         setCart({
//           items: [],
//           subtotal: 0,
//           gst: 0,
//           shipping: 0,
//           total: 0
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//       showNotification('error', 'Failed to load cart');
//       setCart({
//         items: [],
//         subtotal: 0,
//         gst: 0,
//         shipping: 0,
//         total: 0
//       });
//     } finally {
//       setLoading(prev => ({ ...prev, cart: false }));
//     }
//   };

//   const updateQuantity = async (itemId: string, newQuantity: number) => {
//     if (!user) {
//       setShowLoginModal(true);
//       return;
//     }

//     if (newQuantity < 1) {
//       removeItem(itemId);
//       return;
//     }

//     setLoading(prev => ({ ...prev, cart: true }));
//     try {
//       const idToUse = user.farmerId || user._id;
//       const response = await fetch(`${CART_API_URL}/cart/update/${itemId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId: idToUse,
//           quantity: newQuantity
//         })
//       });

//       const data = await response.json();
//       if (data.success) {
//         setCart(data.data);
//         showNotification('success', 'Quantity updated');
//       } else {
//         showNotification('error', data.message || 'Failed to update quantity');
//       }
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       showNotification('error', 'Failed to update quantity');
//     } finally {
//       setLoading(prev => ({ ...prev, cart: false }));
//     }
//   };

//   const removeItem = async (itemId: string) => {
//     if (!user) {
//       setShowLoginModal(true);
//       return;
//     }

//     setLoading(prev => ({ ...prev, cart: true }));
//     try {
//       const idToUse = user.farmerId || user._id;
//       const response = await fetch(`${CART_API_URL}/cart/remove/${itemId}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ userId: idToUse })
//       });

//       const data = await response.json();
//       if (data.success) {
//         setCart(data.data);
//         showNotification('success', 'Item removed from cart');
//       } else {
//         showNotification('error', data.message || 'Failed to remove item');
//       }
//     } catch (error) {
//       console.error('Error removing item:', error);
//       showNotification('error', 'Failed to remove item');
//     } finally {
//       setLoading(prev => ({ ...prev, cart: false }));
//     }
//   };

//   const clearCart = async () => {
//     if (!user) {
//       setShowLoginModal(true);
//       return;
//     }

//     Alert.alert(
//       'Clear Cart',
//       'Are you sure you want to clear your cart?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Clear',
//           style: 'destructive',
//           onPress: async () => {
//             setLoading(prev => ({ ...prev, cart: true }));
//             try {
//               const idToUse = user.farmerId || user._id;
//               const response = await fetch(`${CART_API_URL}/cart/clear/${idToUse}`, {
//                 method: 'DELETE',
//               });

//               const data = await response.json();
//               if (data.success) {
//                 setCart({
//                   items: [],
//                   subtotal: 0,
//                   gst: 0,
//                   shipping: 0,
//                   total: 0
//                 });
//                 showNotification('success', 'Cart cleared');
//               } else {
//                 showNotification('error', data.message || 'Failed to clear cart');
//               }
//             } catch (error) {
//               console.error('Error clearing cart:', error);
//               showNotification('error', 'Failed to clear cart');
//             } finally {
//               setLoading(prev => ({ ...prev, cart: false }));
//             }
//           }
//         }
//       ]
//     );
//   };

//   const initiatePayment = () => {
//     if (!user) {
//       setShowLoginModal(true);
//       return;
//     }

//     if (cart.items.length === 0) {
//       showNotification('error', 'Your cart is empty');
//       return;
//     }

//     // Navigate to checkout page
//     router.push('/farmerscreen/cropcarecheckout');
//   };

//   const showNotification = (type: 'success' | 'error', message: string) => {
//     setNotification({ type, message });
//   };

//   if (loading.auth) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#2c5f2d" />
//         <Text className="mt-3 text-base text-gray-600 font-medium">Checking authentication...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       <StatusBar backgroundColor="#2c5f2d" barStyle="light-content" />

//       {/* Notification Component */}
//       {notification && (
//         <Animated.View
//           className="absolute top-16 right-4 p-4 rounded-lg z-[1001] max-w-[calc(100vw-32px)] shadow-lg shadow-black/15"
//           style={[
//             {
//               backgroundColor: notification.type === 'success' ? '#28a745' : '#ff4d4f',
//               transform: [{
//                 translateX: notificationAnim.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [width, 0]
//                 })
//               }],
//               opacity: notificationAnim,
//             }
//           ]}
//         >
//           <Text className="text-white font-bold text-sm">{notification.message}</Text>
//         </Animated.View>
//       )}

//       {/* Header Section */}
//       <View className="bg-green-800 pt-3 pb-4 px-4 shadow-md shadow-black/10">
//         <View className="flex-row items-center justify-between">
//           <TouchableOpacity
//             onPress={() => router.push("/farmerscreen/cropcare")}
//             className="p-2 rounded-lg bg-white/10"
//           >
//             <ArrowLeft size={24} color="white" />
//           </TouchableOpacity>
//           <View className="items-center mx-3 flex-1">
//             <Text className="text-xl font-bold text-white mb-1">🛒 Crop Care Cart</Text>
//             {user ? (
//               <View className="flex-row items-center gap-2">
//                 <Text className="text-sm text-gray-200">{user.personalInfo.name}</Text>
//                 <View className="bg-white/20 px-2.5 py-0.5 rounded-full">
//                   <Text className="text-white text-xs font-semibold">{user.role}</Text>
//                 </View>
//                 <TouchableOpacity 
//                   onPress={handleLogout} 
//                   className="flex-row items-center bg-white/15 px-2 py-1 rounded-lg gap-1"
//                 >
//                   <LogOut size={12} color="white" />
//                   <Text className="text-white text-xs font-semibold">Logout</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity 
//                 className="flex-row items-center bg-white/15 px-3 py-1.5 rounded-lg gap-1.5"
//                 onPress={() => setShowLoginModal(true)}
//               >
//                 <User size={14} color="white" />
//                 <Text className="text-white text-xs font-semibold">Tap to Login</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//           <View className="w-10" />
//         </View>
//       </View>

//       <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
//         <View className="p-5">
//           {/* Show Login Prompt when not authenticated */}
//           {!user ? (
//             <View className="items-center justify-center py-12 px-5 mt-10">
//               <View className="w-32 h-32 rounded-full bg-green-50 justify-center items-center mb-6">
//                 <Text className="text-6xl text-green-800">🔒</Text>
//               </View>
//               <Text className="text-2xl font-bold text-gray-800 mb-3 text-center">Login Required</Text>
//               <Text className="text-base text-gray-600 text-center mb-8 leading-relaxed">
//                 Please login to view and manage your cart
//               </Text>
//               <TouchableOpacity
//                 className="flex-row items-center justify-center bg-green-800 px-8 py-3.5 rounded-lg gap-2.5"
//                 onPress={() => setShowLoginModal(true)}
//               >
//                 <User size={20} color="white" />
//                 <Text className="text-white text-base font-bold">Login Now</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <>
//               {/* Cart Title Section */}
//               <View className="mb-6">
//                 <View className="flex-row items-center justify-between">
//                   <Text className="text-2xl font-bold text-gray-800">Shopping Cart</Text>
//                   <View className="bg-green-800 px-4 py-2 rounded-full">
//                     <Text className="text-white text-sm font-bold">
//                       {cart.items.length} item{cart.items.length !== 1 ? 's' : ''}
//                     </Text>
//                   </View>
//                 </View>
//               </View>

//               {/* Empty Cart State */}
//               {cart.items.length === 0 ? (
//                 <View className="items-center py-12 px-5">
//                   <View className="w-32 h-32 rounded-full bg-green-50 justify-center items-center mb-6">
//                     <Text className="text-6xl text-green-800">🛒</Text>
//                   </View>
//                   <Text className="text-2xl font-bold text-gray-800 mb-3 text-center">Your cart is empty</Text>
//                   <Text className="text-base text-gray-600 text-center mb-8 leading-relaxed">
//                     Add some products to get started with your crop care journey!
//                   </Text>
//                   <TouchableOpacity
//                     className="flex-row items-center bg-blue-50 px-6 py-3.5 rounded-lg gap-2.5"
//                     onPress={() => router.push('/farmerscreen/cropcare')}
//                   >
//                     <ShoppingCart size={20} color="#333" />
//                     <Text className="text-green-800 text-base font-bold">Browse Products</Text>
//                   </TouchableOpacity>
//                 </View>
//               ) : (
//                 <View className="gap-6">
//                   {loading.cart ? (
//                     <View className="items-center justify-center py-12">
//                       <ActivityIndicator size="large" color="#2c5f2d" />
//                       <Text className="mt-4 text-base text-gray-600">Loading cart...</Text>
//                     </View>
//                   ) : (
//                     <>
//                       {/* Cart Items List */}
//                       <View className="bg-white rounded-xl p-5 shadow-sm shadow-black/5">
//                         {cart.items.map((item) => (
//                           <View key={item._id} className="flex-row py-4 border-b border-gray-200 gap-4">
//                             {/* Product Image */}
//                             <View className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden justify-center items-center">
//                               {item.image ? (
//                                 <Image
//                                   source={{ uri: item.image }}
//                                   className="w-full h-full"
//                                   resizeMode="cover"
//                                 />
//                               ) : (
//                                 <View className="w-full h-full justify-center items-center">
//                                   <Text className="text-4xl text-gray-500">🌱</Text>
//                                 </View>
//                               )}
//                             </View>

//                             {/* Product Details */}
//                             <View className="flex-1 justify-between">
//                               <View className="mb-3">
//                                 <Text className="text-base font-bold text-gray-800 mb-1" numberOfLines={1}>
//                                   {item.seedName}
//                                 </Text>
//                                 <Text className="text-sm text-gray-600 mb-1.5" numberOfLines={1}>
//                                   {item.productName}
//                                 </Text>
//                                 <Text className="text-sm font-semibold text-green-500">
//                                   ₹{item.seedPrice.toFixed(2)} per unit
//                                 </Text>
//                               </View>

//                               {/* Quantity Controls */}
//                               <View className="mt-2">
//                                 <View className="flex-row items-center gap-3">
//                                   <TouchableOpacity
//                                     className="w-8 h-8 rounded-full bg-gray-200 justify-center items-center"
//                                     onPress={() => updateQuantity(item._id!, item.quantity - 1)}
//                                     disabled={loading.cart}
//                                   >
//                                     <Minus size={16} color="#333" />
//                                   </TouchableOpacity>
//                                   <View className="min-w-9 items-center">
//                                     <Text className="text-base font-bold text-gray-800">{item.quantity}</Text>
//                                   </View>
//                                   <TouchableOpacity
//                                     className="w-8 h-8 rounded-full bg-gray-200 justify-center items-center"
//                                     onPress={() => updateQuantity(item._id!, item.quantity + 1)}
//                                     disabled={loading.cart}
//                                   >
//                                     <Plus size={16} color="#333" />
//                                   </TouchableOpacity>
//                                 </View>
//                               </View>
//                             </View>

//                             {/* Item Actions */}
//                             <View className="items-end justify-between">
//                               <Text className="text-lg font-bold text-gray-800 mb-3">
//                                 ₹{(item.seedPrice * item.quantity).toFixed(2)}
//                               </Text>
//                               <TouchableOpacity
//                                 className="flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-red-50"
//                                 onPress={() => removeItem(item._id!)}
//                                 disabled={loading.cart}
//                               >
//                                 <Trash2 size={16} color="#ff4d4f" />
//                                 <Text className="text-red-500 text-xs font-semibold">Remove</Text>
//                               </TouchableOpacity>
//                             </View>
//                           </View>
//                         ))}

//                         {/* Clear Cart Button */}
//                         <View className="mt-5 items-end">
//                           <TouchableOpacity
//                             className="flex-row items-center bg-red-500 px-5 py-3 rounded-lg gap-2"
//                             onPress={clearCart}
//                             disabled={loading.cart}
//                           >
//                             <Trash2 size={16} color="white" />
//                             <Text className="text-white text-sm font-bold">Clear Cart</Text>
//                           </TouchableOpacity>
//                         </View>
//                       </View>

//                       {/* Order Summary */}
//                       <View className="bg-white rounded-xl p-6 shadow-sm shadow-black/5">
//                         <Text className="text-xl font-bold text-gray-800 mb-5 pb-4 border-b-2 border-b-green-800">
//                           Order Summary
//                         </Text>

//                         <View className="gap-3 mb-5">
//                           <View className="flex-row justify-between items-center">
//                             <Text className="text-base text-gray-600">Subtotal</Text>
//                             <Text className="text-base text-gray-600 font-medium">₹{cart.subtotal.toFixed(2)}</Text>
//                           </View>

//                           <View className="flex-row justify-between items-center">
//                             <Text className="text-base text-gray-600">GST (18%)</Text>
//                             <Text className="text-base text-gray-600 font-medium">₹{cart.gst.toFixed(2)}</Text>
//                           </View>

//                           <View className="flex-row justify-between items-center">
//                             <Text className="text-base text-gray-600">Shipping</Text>
//                             <Text className="text-base text-gray-600 font-medium">
//                               {cart.shipping === 0 ? 'FREE' : `₹${cart.shipping.toFixed(2)}`}
//                             </Text>
//                           </View>
//                         </View>

//                         {/* Total Section */}
//                         <View className="flex-row justify-between items-center mt-5 pt-5 border-t-2 border-t-gray-200">
//                           <Text className="text-lg font-bold text-gray-800">Total Amount</Text>
//                           <Text className="text-2xl font-bold text-green-800">₹{cart.total.toFixed(2)}</Text>
//                         </View>

//                         {/* Action Buttons */}
//                         <View className="mt-7 gap-3">
//                           <TouchableOpacity
//                             className="flex-row items-center justify-center bg-green-800 py-4 rounded-lg gap-2.5"
//                             onPress={initiatePayment}
//                             disabled={loading.payment || cart.items.length === 0}
//                           >
//                             <CreditCard size={20} color="white" />
//                             <Text className="text-white text-base font-bold">Proceed to Checkout</Text>
//                           </TouchableOpacity>

//                           <TouchableOpacity
//                             className="flex-row items-center justify-center bg-gray-200 py-4 rounded-lg gap-2.5"
//                             onPress={() => router.push('/farmerscreen/cropcare')}
//                           >
//                             <ShoppingCart size={20} color="#333" />
//                             <Text className="text-gray-800 text-base font-bold">Continue Shopping</Text>
//                           </TouchableOpacity>
//                         </View>

//                         {/* Free Shipping Banner */}
//                         {cart.subtotal < 500 && cart.items.length > 0 && (
//                           <View className="mt-4 p-3 bg-orange-50 rounded-lg border-l-4 border-l-orange-500">
//                             <Text className="text-sm text-gray-600 text-center font-medium">
//                               Add ₹{(500 - cart.subtotal).toFixed(2)} more for FREE shipping!
//                             </Text>
//                           </View>
//                         )}
//                       </View>
//                     </>
//                   )}
//                 </View>
//               )}
//             </>
//           )}
//         </View>
//       </ScrollView>

//       {/* Login Modal */}
//       <Modal
//         visible={showLoginModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowLoginModal(false)}
//       >
//         <View className="flex-1 bg-black/50 justify-center items-center">
//           <View className="bg-white rounded-2xl p-6 w-4/5 items-center">
//             <Text className="text-5xl mb-4 text-green-800">🔒</Text>
//             <Text className="text-xl font-bold text-gray-800 mb-2 text-center">Login Required</Text>
//             <Text className="text-base text-gray-600 text-center mb-6 leading-relaxed">
//               You need to login to access your cart
//             </Text>
//             <View className="flex-row justify-between w-full gap-3">
//               <TouchableOpacity
//                 className="flex-1 bg-gray-200 py-3 rounded-lg"
//                 onPress={() => {
//                   setShowLoginModal(false);
//                   router.back();
//                 }}
//               >
//                 <Text className="text-gray-800 font-bold text-center text-base">Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 className="flex-1 bg-green-800 py-3 rounded-lg"
//                 onPress={handleLogin}
//               >
//                 <Text className="text-white font-bold text-center text-base">Login</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default CropcareCart;


import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { ArrowLeft, CreditCard, LogOut, Minus, Plus, ShoppingCart, Trash2, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


interface CartItem {
  _id?: string;
  productId: string;
  productName: string;
  seedId?: string;
  seedName: string;
  seedPrice: number;
  quantity: number;
  image?: string;
  addedAt: Date;
}

interface CartData {
  _id?: string;
  items: CartItem[];
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
}

interface User {
  _id: string;
  personalInfo: {
    name: string;
    mobileNo: string;
    address?: string;
    villageGramaPanchayat?: string;
    pincode?: string;
    state?: string;
    district?: string;
  };
  role: string;
  farmerId?: string;
}

const { width } = Dimensions.get('window');

const CropcareCart: React.FC = () => {
  const [cart, setCart] = useState<CartData>({
    items: [],
    subtotal: 0,
    gst: 0,
    shipping: 0,
    total: 0
  });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState({
    cart: false,
    payment: false,
    auth: true
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [notificationAnim] = useState(new Animated.Value(0));
  const [showLoginModal, setShowLoginModal] = useState(false);

  const CART_API_URL = 'https://kisan.etpl.ai/api/cropcare';

  useFocusEffect(
    React.useCallback(() => {
      checkAuthStatus();
    }, [])
  );

  useEffect(() => {
    if (user) {
      fetchUserCart();
    } else {
      setCart({
        items: [],
        subtotal: 0,
        gst: 0,
        shipping: 0,
        total: 0
      });
    }
  }, [user]);

  useEffect(() => {
    if (notification) {
      Animated.timing(notificationAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const hideNotification = () => {
    Animated.timing(notificationAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setNotification(null);
    });
  };

  const checkAuthStatus = async () => {
    setLoading(prev => ({ ...prev, auth: true }));
    try {
      const [userData, role, userId, farmerId] = await Promise.all([
        AsyncStorage.getItem('userData'),
        AsyncStorage.getItem('userRole'),
        AsyncStorage.getItem('userId'),
        AsyncStorage.getItem('farmerId'),
      ]);

      if (userData && role && userId) {
        try {
          const parsedUserData = JSON.parse(userData);
          const phone = await AsyncStorage.getItem('phone');

          const userObj: User = {
            _id: userId,
            role: role,
            personalInfo: {
              name: parsedUserData.personalInfo?.name || parsedUserData.name || 'User',
              mobileNo: parsedUserData.personalInfo?.mobileNo || parsedUserData.mobileNo || phone || '',
              address: parsedUserData.personalInfo?.address,
              villageGramaPanchayat: parsedUserData.personalInfo?.villageGramaPanchayat,
              pincode: parsedUserData.personalInfo?.pincode,
              state: parsedUserData.personalInfo?.state,
              district: parsedUserData.personalInfo?.district
            }
          };

          if (farmerId) {
            userObj.farmerId = farmerId;
          }

          setUser(userObj);
          setShowLoginModal(false);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
          setShowLoginModal(true);
        }
      } else {
        setUser(null);
        setShowLoginModal(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setShowLoginModal(true);
    } finally {
      setLoading(prev => ({ ...prev, auth: false }));
    }
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    router.push('/(auth)/Login?role=farmer');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setUser(null);
      setCart({
        items: [],
        subtotal: 0,
        gst: 0,
        shipping: 0,
        total: 0
      });
      setShowLoginModal(true);
      showNotification('success', 'You have been logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      showNotification('error', 'Failed to logout');
    }
  };

  const fetchUserCart = async () => {
    if (!user) return;

    setLoading(prev => ({ ...prev, cart: true }));
    try {
      const idToUse = user.farmerId || user._id;
      const response = await fetch(`${CART_API_URL}/cart/${idToUse}`);
      const data = await response.json();

      if (data.success && data.data) {
        setCart(data.data);
      } else {
        setCart({
          items: [],
          subtotal: 0,
          gst: 0,
          shipping: 0,
          total: 0
        });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      showNotification('error', 'Failed to load cart');
      setCart({
        items: [],
        subtotal: 0,
        gst: 0,
        shipping: 0,
        total: 0
      });
    } finally {
      setLoading(prev => ({ ...prev, cart: false }));
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    setLoading(prev => ({ ...prev, cart: true }));
    try {
      const idToUse = user.farmerId || user._id;
      const response = await fetch(`${CART_API_URL}/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: idToUse,
          quantity: newQuantity
        })
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.data);
        showNotification('success', 'Quantity updated');
      } else {
        showNotification('error', data.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showNotification('error', 'Failed to update quantity');
    } finally {
      setLoading(prev => ({ ...prev, cart: false }));
    }
  };

  const removeItem = async (itemId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setLoading(prev => ({ ...prev, cart: true }));
    try {
      const idToUse = user.farmerId || user._id;
      const response = await fetch(`${CART_API_URL}/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: idToUse })
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.data);
        showNotification('success', 'Item removed from cart');
      } else {
        showNotification('error', data.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      showNotification('error', 'Failed to remove item');
    } finally {
      setLoading(prev => ({ ...prev, cart: false }));
    }
  };

  const clearCart = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setLoading(prev => ({ ...prev, cart: true }));
            try {
              const idToUse = user.farmerId || user._id;
              const response = await fetch(`${CART_API_URL}/cart/clear/${idToUse}`, {
                method: 'DELETE',
              });

              const data = await response.json();
              if (data.success) {
                setCart({
                  items: [],
                  subtotal: 0,
                  gst: 0,
                  shipping: 0,
                  total: 0
                });
                showNotification('success', 'Cart cleared');
              } else {
                showNotification('error', data.message || 'Failed to clear cart');
              }
            } catch (error) {
              console.error('Error clearing cart:', error);
              showNotification('error', 'Failed to clear cart');
            } finally {
              setLoading(prev => ({ ...prev, cart: false }));
            }
          }
        }
      ]
    );
  };

  const initiatePayment = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (cart.items.length === 0) {
      showNotification('error', 'Your cart is empty');
      return;
    }

    router.push('/(farmerscreen)/cropcarecheckout');
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  if (loading.auth) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F4F6F8]">
        <ActivityIndicator size="large" color="#2c5f2d" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F4F6F8]">
      {/* Consistent Header Design */}
      <View className="bg-white px-5 py-4 shadow-sm elevation-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.push("/(farmerscreen)/cropcare")} className="mr-3 p-1">
              <ArrowLeft size={24} color="#000000ff" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-medium text-black">Crop Care Cart</Text>
              {user && (
                <Text className="text-xs text-black/80">
                  Hello, {user.personalInfo.name.split(" ")[0]}
                </Text>
              )}
            </View>
          </View>

          {user && (
            <TouchableOpacity onPress={handleLogout} className="p-1">
              <LogOut size={20} color="#000000ff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="flex-1">
        {/* Notification Component */}
        {notification && (
          <Animated.View
            className="absolute top-4 right-4 p-4 rounded-lg z-[1001] max-w-[calc(100vw-32px)] shadow-lg shadow-black/15"
            style={[
              {
                backgroundColor: notification.type === 'success' ? '#28a745' : '#ff4d4f',
                transform: [{
                  translateX: notificationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [width, 0]
                  })
                }],
                opacity: notificationAnim,
              }
            ]}
          >
            <Text className="text-white font-bold text-sm">{notification.message}</Text>
          </Animated.View>
        )}

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* Show Login Prompt when not authenticated */}
          {!user ? (
            <View className="items-center justify-center py-12 px-5 mt-10">
              <View className="w-24 h-24 rounded-full bg-[#e8f5e9] justify-center items-center mb-6">
                <Text className="text-5xl text-[#2c5f2d]">🔒</Text>
              </View>
              <Text className="text-2xl font-bold text-[#333] mb-3 text-center">Login Required</Text>
              <Text className="text-base text-gray-500 text-center mb-8 leading-relaxed">
                Please login to view and manage your cart
              </Text>
              <TouchableOpacity
                className="flex-row items-center justify-center bg-[#2c5f2d] px-8 py-3.5 rounded-lg gap-2.5"
                onPress={() => setShowLoginModal(true)}
              >
                <User size={20} color="white" />
                <Text className="text-white text-base font-bold">Login Now</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Header Info */}
              {cart.items.length > 0 && (
                <View className="flex-row items-center justify-between mb-6">
                  <Text className="text-xl font-medium text-[#1a1a1a]">Shopping List</Text>
                  <View className="bg-[#e8f5e9] px-3 py-1 rounded-full border border-[#2c5f2d]/20">
                    <Text className="text-[#2c5f2d] text-xs font-bold">
                      {cart.items.length} item{cart.items.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
              )}

              {/* Empty Cart State */}
              {cart.items.length === 0 ? (
                <View className="items-center py-12 px-5">
                  <View className="w-24 h-24 rounded-full bg-gray-100 justify-center items-center mb-6">
                    <ShoppingCart size={40} color="#999" />
                  </View>
                  <Text className="text-xl font-bold text-[#333] mb-2 text-center">Your cart is empty</Text>
                  <Text className="text-sm text-gray-500 text-center mb-8">
                    Add products from the Crop Care section.
                  </Text>
                  <TouchableOpacity
                    className="flex-row items-center bg-[#2c5f2d] px-6 py-3 rounded-lg gap-2"
                    onPress={() => router.push('/(farmerscreen)/cropcare')}
                  >
                    <Text className="text-white text-sm font-medium">Browse Products</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="gap-4">
                  {loading.cart ? (
                    <View className="items-center justify-center py-12">
                      <ActivityIndicator size="large" color="#2c5f2d" />
                      <Text className="mt-4 text-sm text-gray-500">Loading cart...</Text>
                    </View>
                  ) : (
                    <>
                      {/* Cart Items List */}
                      {cart.items.map((item) => (
                        <View key={item._id} className="bg-white rounded-2xl p-4 shadow-sm elevation-[2] border border-black/5">
                          <View className="flex-row gap-4">
                            {/* Product Image */}
                            <View className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden justify-center items-center border border-gray-100">
                              {item.image ? (
                                <Image
                                  source={{ uri: item.image }}
                                  className="w-full h-full"
                                  resizeMode="cover"
                                />
                              ) : (
                                <View className="w-full h-full justify-center items-center bg-[#e8f5e9]">
                                  <Text className="text-3xl text-gray-400">🌱</Text>
                                </View>
                              )}
                            </View>

                            {/* Product Details */}
                            <View className="flex-1 justify-between py-0.5">
                              <View>
                                <Text className="text-[15px] font-bold text-[#333] leading-5 mb-1" numberOfLines={1}>
                                  {item.seedName}
                                </Text>
                                <Text className="text-xs text-gray-500 mb-1" numberOfLines={1}>
                                  {item.productName}
                                </Text>
                                <Text className="text-sm font-medium text-[#2c5f2d]">
                                  ₹{item.seedPrice.toFixed(2)} <Text className="text-gray-400 text-xs font-normal">/ unit</Text>
                                </Text>
                              </View>

                              {/* Quantity Controls */}
                              <View className="flex-row items-center justify-between mt-2">
                                <View className="flex-row items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                                  <TouchableOpacity
                                    className="w-7 h-7 bg-white rounded-md justify-center items-center shadow-sm"
                                    onPress={() => updateQuantity(item._id!, item.quantity - 1)}
                                    disabled={loading.cart}
                                  >
                                    <Minus size={14} color="#333" />
                                  </TouchableOpacity>
                                  <View className="min-w-[32px] items-center px-2">
                                    <Text className="text-sm font-bold text-[#333]">{item.quantity}</Text>
                                  </View>
                                  <TouchableOpacity
                                    className="w-7 h-7 bg-[#2c5f2d] rounded-md justify-center items-center shadow-sm"
                                    onPress={() => updateQuantity(item._id!, item.quantity + 1)}
                                    disabled={loading.cart}
                                  >
                                    <Plus size={14} color="white" />
                                  </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                  onPress={() => removeItem(item._id!)}
                                  className="p-2"
                                  disabled={loading.cart}
                                >
                                  <Trash2 size={18} color="#ff4d4f" />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>

                          <View className="mt-3 pt-3 border-t border-gray-100 flex-row justify-between items-center">
                            <Text className="text-xs text-gray-500 font-medium">Subtotal</Text>
                            <Text className="text-base font-bold text-[#333]">
                              ₹{(item.seedPrice * item.quantity).toFixed(2)}
                            </Text>
                          </View>
                        </View>
                      ))}

                      {/* Clear Cart Button */}
                      <View className="items-end mb-4">
                        <TouchableOpacity
                          className="flex-row items-center px-4 py-2"
                          onPress={clearCart}
                          disabled={loading.cart}
                        >
                          <Text className="text-red-500 text-xs font-medium">Clear Shopping Cart</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Order Summary */}
                      <View className="bg-white rounded-2xl p-5 shadow-sm elevation-[2] border border-black/5 mb-8">
                        <Text className="text-lg font-bold text-[#333] mb-4">
                          Order Summary
                        </Text>

                        <View className="gap-3 mb-4">
                          <View className="flex-row justify-between items-center">
                            <Text className="text-sm text-gray-500">Subtotal</Text>
                            <Text className="text-sm text-[#333] font-medium">₹{cart.subtotal.toFixed(2)}</Text>
                          </View>

                          <View className="flex-row justify-between items-center">
                            <Text className="text-sm text-gray-500">GST (18%)</Text>
                            <Text className="text-sm text-[#333] font-medium">₹{cart.gst.toFixed(2)}</Text>
                          </View>

                          <View className="flex-row justify-between items-center">
                            <Text className="text-sm text-gray-500">Shipping</Text>
                            <Text className="text-sm font-medium text-[#2c5f2d]">
                              {cart.shipping === 0 ? 'FREE' : `₹${cart.shipping.toFixed(2)}`}
                            </Text>
                          </View>
                        </View>

                        <View className="h-[1px] bg-gray-100 mb-4" />

                        {/* Total Section */}
                        <View className="flex-row justify-between items-center mb-6">
                          <Text className="text-base font-bold text-[#333]">Total Amount</Text>
                          <Text className="text-xl font-bold text-[#2c5f2d]">₹{cart.total.toFixed(2)}</Text>
                        </View>

                        {/* Action Buttons */}
                        <View className="gap-3">
                          <TouchableOpacity
                            className="flex-row items-center justify-center bg-[#2c5f2d] py-3.5 rounded-xl shadow-md shadow-green-900/20"
                            onPress={initiatePayment}
                            disabled={loading.payment || cart.items.length === 0}
                          >
                            <CreditCard size={18} color="white" className="mr-2" />
                            <Text className="text-white text-sm font-bold ml-2">Proceed to Checkout</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className="flex-row items-center justify-center bg-gray-50 py-3.5 rounded-xl border border-gray-100"
                            onPress={() => router.push('/(farmerscreen)/cropcare')}
                          >
                            <Text className="text-gray-600 text-sm font-medium">Continue Shopping</Text>
                          </TouchableOpacity>
                        </View>

                        {/* Free Shipping Banner */}
                        {cart.subtotal < 500 && cart.items.length > 0 && (
                          <View className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                            <Text className="text-xs text-orange-700 text-center font-medium">
                              Add ₹{(500 - cart.subtotal).toFixed(2)} more for FREE shipping!
                            </Text>
                          </View>
                        )}
                      </View>
                    </>
                  )}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>

      {/* Login Modal */}
      <Modal
        visible={showLoginModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-[20px] p-6 w-4/5 items-center elevation-[5]">
            <View className="w-[60px] h-[60px] rounded-full bg-[#FF5252] justify-center items-center mb-4">
              <LogOut size={32} color="#fff" />
            </View>
            <Text className="text-xl font-bold mb-2 text-[#333]">Login Required</Text>
            <Text className="text-[15px] text-gray-500 text-center mb-6">
              Please login to access your cart
            </Text>
            <View className="flex-row w-full justify-between gap-3">
              <TouchableOpacity
                className="flex-1 py-3 rounded-[10px] items-center justify-center bg-gray-100"
                onPress={() => {
                  setShowLoginModal(false);
                  router.back();
                }}
              >
                <Text className="text-gray-500 text-sm font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 rounded-[10px] items-center justify-center bg-[#2c5f2d]"
                onPress={handleLogin}
              >
                <Text className="text-white text-sm font-bold">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CropcareCart;