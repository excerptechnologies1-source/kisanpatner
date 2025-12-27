// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
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
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#2c5f2d" />
//         <Text style={styles.loadingText}>Checking authentication...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#2c5f2d" barStyle="light-content" />

//       {/* Notification Component */}
//       {notification && (
//         <Animated.View
//           style={[
//             styles.notification,
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
//           <Text style={styles.notificationText}>{notification.message}</Text>
//         </Animated.View>
//       )}

//       {/* Header Section */}
//       <View style={styles.header}>
//         <View style={styles.headerRow}>
//           <TouchableOpacity
//             onPress={() => router.push("/farmerscreen/cropcare")}
//             style={styles.backButtonHeader}
//           >
//             <ArrowLeft size={24} color="white" />
//           </TouchableOpacity>
//           <View style={styles.headerCenter}>
//             <Text style={styles.headerTitle}>🛒 Crop Care Cart</Text>
//             {user ? (
//               <View style={styles.userInfo}>
//                 <Text style={styles.userName}>{user.personalInfo.name}</Text>
//                 <View style={styles.roleBadge}>
//                   <Text style={styles.roleText}>{user.role}</Text>
//                 </View>
//                 <TouchableOpacity onPress={handleLogout} style={styles.logoutButtonSmall}>
//                   <LogOut size={12} color="white" />
//                   <Text style={styles.logoutTextSmall}>Logout</Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity 
//                 style={styles.loginPromptHeader}
//                 onPress={() => setShowLoginModal(true)}
//               >
//                 <User size={14} color="white" />
//                 <Text style={styles.loginTextHeader}>Tap to Login</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//           <View style={styles.headerRightPlaceholder} />
//         </View>
//       </View>

//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         <View style={styles.mainContent}>
//           {/* Show Login Prompt when not authenticated */}
//           {!user ? (
//             <View style={styles.loginPromptContainer}>
//               <View style={styles.loginPromptIconContainer}>
//                 <Text style={styles.loginPromptIcon}>🔒</Text>
//               </View>
//               <Text style={styles.loginPromptTitle}>Login Required</Text>
//               <Text style={styles.loginPromptDescription}>
//                 Please login to view and manage your cart
//               </Text>
//               <TouchableOpacity
//                 style={styles.loginButton}
//                 onPress={() => setShowLoginModal(true)}
//               >
//                 <User size={20} color="white" />
//                 <Text style={styles.loginButtonText}>Login Now</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <>
//               {/* Cart Title Section */}
//               <View style={styles.titleSection}>
//                 <View style={styles.titleRow}>
//                   <Text style={styles.cartTitle}>Shopping Cart</Text>
//                   <View style={styles.cartCountBadge}>
//                     <Text style={styles.cartCountText}>
//                       {cart.items.length} item{cart.items.length !== 1 ? 's' : ''}
//                     </Text>
//                   </View>
//                 </View>
//               </View>

//               {/* Empty Cart State */}
//               {cart.items.length === 0 ? (
//                 <View style={styles.emptyCartContainer}>
//                   <View style={styles.emptyCartIconContainer}>
//                     <Text style={styles.emptyCartIcon}>🛒</Text>
//                   </View>
//                   <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
//                   <Text style={styles.emptyCartDescription}>
//                     Add some products to get started with your crop care journey!
//                   </Text>
//                   <TouchableOpacity
//                     style={styles.shoppingButton}
//                     onPress={() => router.push('/farmerscreen/cropcare')}
//                   >
//                     <ShoppingCart size={20} color="#333" />
//                     <Text style={styles.shoppingButtonText}>Browse Products</Text>
//                   </TouchableOpacity>
//                 </View>
//               ) : (
//                 <View style={styles.cartContent}>
//                   {loading.cart ? (
//                     <View style={styles.cartLoadingContainer}>
//                       <ActivityIndicator size="large" color="#2c5f2d" />
//                       <Text style={styles.cartLoadingText}>Loading cart...</Text>
//                     </View>
//                   ) : (
//                     <>
//                       {/* Cart Items List */}
//                       <View style={styles.cartItemsContainer}>
//                         {cart.items.map((item) => (
//                           <View key={item._id} style={styles.cartItemCard}>
//                             {/* Product Image */}
//                             <View style={styles.itemImageWrapper}>
//                               {item.image ? (
//                                 <Image
//                                   source={{ uri: item.image }}
//                                   style={styles.itemImage}
//                                   resizeMode="cover"
//                                 />
//                               ) : (
//                                 <View style={styles.itemImagePlaceholder}>
//                                   <Text style={styles.placeholderIcon}>🌱</Text>
//                                 </View>
//                               )}
//                             </View>

//                             {/* Product Details */}
//                             <View style={styles.itemDetails}>
//                               <View style={styles.itemTextContainer}>
//                                 <Text style={styles.itemName} numberOfLines={1}>
//                                   {item.seedName}
//                                 </Text>
//                                 <Text style={styles.itemProduct} numberOfLines={1}>
//                                   {item.productName}
//                                 </Text>
//                                 <Text style={styles.itemPrice}>
//                                   ₹{item.seedPrice.toFixed(2)} per unit
//                                 </Text>
//                               </View>

//                               {/* Quantity Controls */}
//                               <View style={styles.quantitySection}>
//                                 <View style={styles.quantityControls}>
//                                   <TouchableOpacity
//                                     style={styles.quantityButton}
//                                     onPress={() => updateQuantity(item._id!, item.quantity - 1)}
//                                     disabled={loading.cart}
//                                   >
//                                     <Minus size={16} color="#333" />
//                                   </TouchableOpacity>
//                                   <View style={styles.quantityDisplayContainer}>
//                                     <Text style={styles.quantityDisplay}>{item.quantity}</Text>
//                                   </View>
//                                   <TouchableOpacity
//                                     style={styles.quantityButton}
//                                     onPress={() => updateQuantity(item._id!, item.quantity + 1)}
//                                     disabled={loading.cart}
//                                   >
//                                     <Plus size={16} color="#333" />
//                                   </TouchableOpacity>
//                                 </View>
//                               </View>
//                             </View>

//                             {/* Item Actions */}
//                             <View style={styles.itemActions}>
//                               <Text style={styles.itemTotalPrice}>
//                                 ₹{(item.seedPrice * item.quantity).toFixed(2)}
//                               </Text>
//                               <TouchableOpacity
//                                 style={styles.removeItemButton}
//                                 onPress={() => removeItem(item._id!)}
//                                 disabled={loading.cart}
//                               >
//                                 <Trash2 size={16} color="#ff4d4f" />
//                                 <Text style={styles.removeItemText}>Remove</Text>
//                               </TouchableOpacity>
//                             </View>
//                           </View>
//                         ))}

//                         {/* Clear Cart Button */}
//                         <View style={styles.clearCartContainer}>
//                           <TouchableOpacity
//                             style={styles.clearCartButton}
//                             onPress={clearCart}
//                             disabled={loading.cart}
//                           >
//                             <Trash2 size={16} color="white" />
//                             <Text style={styles.clearCartText}>Clear Cart</Text>
//                           </TouchableOpacity>
//                         </View>
//                       </View>

//                       {/* Order Summary */}
//                       <View style={styles.orderSummaryCard}>
//                         <Text style={styles.orderSummaryTitle}>Order Summary</Text>

//                         <View style={styles.summaryRows}>
//                           <View style={styles.summaryRow}>
//                             <Text style={styles.summaryLabel}>Subtotal</Text>
//                             <Text style={styles.summaryValue}>₹{cart.subtotal.toFixed(2)}</Text>
//                           </View>

//                           <View style={styles.summaryRow}>
//                             <Text style={styles.summaryLabel}>GST (18%)</Text>
//                             <Text style={styles.summaryValue}>₹{cart.gst.toFixed(2)}</Text>
//                           </View>

//                           <View style={styles.summaryRow}>
//                             <Text style={styles.summaryLabel}>Shipping</Text>
//                             <Text style={styles.summaryValue}>
//                               {cart.shipping === 0 ? 'FREE' : `₹${cart.shipping.toFixed(2)}`}
//                             </Text>
//                           </View>
//                         </View>

//                         {/* Total Section */}
//                         <View style={styles.totalSection}>
//                           <Text style={styles.totalLabel}>Total Amount</Text>
//                           <Text style={styles.totalValue}>₹{cart.total.toFixed(2)}</Text>
//                         </View>

//                         {/* Action Buttons */}
//                         <View style={styles.actionButtonsContainer}>
//                           <TouchableOpacity
//                             style={styles.checkoutButton}
//                             onPress={initiatePayment}
//                             disabled={loading.payment || cart.items.length === 0}
//                           >
//                             <CreditCard size={20} color="white" />
//                             <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
//                           </TouchableOpacity>

//                           <TouchableOpacity
//                             style={styles.continueShoppingButton}
//                             onPress={() => router.push('/farmerscreen/cropcare')}
//                           >
//                             <ShoppingCart size={20} color="#333" />
//                             <Text style={styles.continueShoppingText}>Continue Shopping</Text>
//                           </TouchableOpacity>
//                         </View>

//                         {/* Free Shipping Banner */}
//                         {cart.subtotal < 500 && cart.items.length > 0 && (
//                           <View style={styles.freeShippingBanner}>
//                             <Text style={styles.freeShippingText}>
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
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalIcon}>🔒</Text>
//             <Text style={styles.modalTitle}>Login Required</Text>
//             <Text style={styles.modalText}>
//               You need to login to access your cart
//             </Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => {
//                   setShowLoginModal(false);
//                   router.back();
//                 }}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.loginButton]}
//                 onPress={handleLogin}
//               >
//                 <Text style={styles.loginButtonText}>Login</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   // Container Styles
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//     fontWeight: '500',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   mainContent: {
//     padding: 20,
//   },

//   // Header Styles
//   header: {
//     backgroundColor: '#2c5f2d',
//     paddingTop: 12,
//     paddingBottom: 16,
//     paddingHorizontal: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   backButtonHeader: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   headerCenter: {
//     flex: 1,
//     alignItems: 'center',
//     marginHorizontal: 12,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 4,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   userName: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.9)',
//   },
//   roleBadge: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 12,
//   },
//   roleText: {
//     fontSize: 12,
//     color: 'white',
//     fontWeight: '600',
//   },
//   logoutButtonSmall: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     gap: 4,
//   },
//   logoutTextSmall: {
//     fontSize: 10,
//     color: 'white',
//     fontWeight: '600',
//   },
//   loginPromptHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//     gap: 6,
//   },
//   loginTextHeader: {
//     fontSize: 12,
//     color: 'white',
//     fontWeight: '600',
//   },
//   headerRightPlaceholder: {
//     width: 40,
//   },

//   // Login Prompt Styles
//   loginPromptContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//     paddingHorizontal: 20,
//     marginTop: 40,
//   },
//   loginPromptIconContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: 'rgba(44, 95, 45, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   loginPromptIcon: {
//     fontSize: 60,
//     color: '#2c5f2d',
//   },
//   loginPromptTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   loginPromptDescription: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 32,
//     lineHeight: 22,
//   },
//   loginButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#2c5f2d',
//     paddingHorizontal: 32,
//     paddingVertical: 14,
//     borderRadius: 8,
//     gap: 10,
//   },
//   loginButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   // Title Section
//   titleSection: {
//     marginBottom: 24,
//   },
//   titleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   cartTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   cartCountBadge: {
//     backgroundColor: '#2c5f2d',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   cartCountText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },

//   // Cart Loading
//   cartLoadingContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//   },
//   cartLoadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#666',
//   },

//   // Empty Cart Styles
//   emptyCartContainer: {
//     alignItems: 'center',
//     paddingVertical: 60,
//     paddingHorizontal: 20,
//   },
//   emptyCartIconContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: 'rgba(44, 95, 45, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   emptyCartIcon: {
//     fontSize: 60,
//     color: '#2c5f2d',
//   },
//   emptyCartTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   emptyCartDescription: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 32,
//     lineHeight: 22,
//   },
//   shoppingButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f7ff',
//     paddingHorizontal: 24,
//     paddingVertical: 14,
//     borderRadius: 8,
//     gap: 10,
//   },
//   shoppingButtonText: {
//     color: '#2c5f2d',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   // Cart Content Styles
//   cartContent: {
//     gap: 24,
//   },
//   cartItemsContainer: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },

//   // Cart Item Card Styles
//   cartItemCard: {
//     flexDirection: 'row',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//     gap: 16,
//   },
//   itemImageWrapper: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//     backgroundColor: '#f5f5f5',
//     overflow: 'hidden',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   itemImage: {
//     width: '100%',
//     height: '100%',
//   },
//   itemImagePlaceholder: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderIcon: {
//     fontSize: 32,
//     color: '#999',
//   },
//   itemDetails: {
//     flex: 1,
//     justifyContent: 'space-between',
//   },
//   itemTextContainer: {
//     marginBottom: 12,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   itemProduct: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 6,
//   },
//   itemPrice: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#28a745',
//   },
//   quantitySection: {
//     marginTop: 8,
//   },
//   quantityControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   quantityButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quantityDisplayContainer: {
//     minWidth: 36,
//     alignItems: 'center',
//   },
//   quantityDisplay: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   itemActions: {
//     alignItems: 'flex-end',
//     justifyContent: 'space-between',
//   },
//   itemTotalPrice: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 12,
//   },
//   removeItemButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 6,
//     backgroundColor: '#fff5f5',
//   },
//   removeItemText: {
//     color: '#ff4d4f',
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   // Clear Cart Button
//   clearCartContainer: {
//     marginTop: 20,
//     alignItems: 'flex-end',
//   },
//   clearCartButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ff4d4f',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//     gap: 8,
//   },
//   clearCartText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },

//   // Order Summary Styles
//   orderSummaryCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   orderSummaryTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 20,
//     paddingBottom: 16,
//     borderBottomWidth: 2,
//     borderBottomColor: '#2c5f2d',
//   },
//   summaryRows: {
//     gap: 12,
//     marginBottom: 20,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   summaryLabel: {
//     fontSize: 16,
//     color: '#666',
//   },
//   summaryValue: {
//     fontSize: 16,
//     color: '#666',
//     fontWeight: '500',
//   },
//   totalSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 20,
//     paddingTop: 20,
//     borderTopWidth: 2,
//     borderTopColor: '#eaeaea',
//   },
//   totalLabel: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   totalValue: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#2c5f2d',
//   },

//   // Action Buttons
//   actionButtonsContainer: {
//     marginTop: 28,
//     gap: 12,
//   },
//   checkoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#2c5f2d',
//     paddingVertical: 16,
//     borderRadius: 8,
//     gap: 10,
//   },
//   checkoutButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   continueShoppingButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f0f0f0',
//     paddingVertical: 16,
//     borderRadius: 8,
//     gap: 10,
//   },
//   continueShoppingText: {
//     color: '#333',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   // Free Shipping Banner
//   freeShippingBanner: {
//     marginTop: 16,
//     padding: 12,
//     backgroundColor: '#fff9f0',
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#ffa500',
//   },
//   freeShippingText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     fontWeight: '500',
//   },

//   // Notification Styles
//   notification: {
//     position: 'absolute',
//     top: 70,
//     right: 16,
//     padding: 16,
//     borderRadius: 8,
//     zIndex: 1001,
//     maxWidth: width - 32,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   notificationText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 24,
//     width: '80%',
//     alignItems: 'center',
//   },
//   modalIcon: {
//     fontSize: 48,
//     marginBottom: 16,
//     color: '#2c5f2d',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   modalText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 24,
//     lineHeight: 22,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     gap: 12,
//   },
//   modalButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#e0e0e0',
//   },
//   cancelButtonText: {
//     color: '#333',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   loginButton: {
//     backgroundColor: '#2c5f2d',
//   },
// });

// export default CropcareCart;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard, LogOut, User } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
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
      // Reset cart when user is not authenticated
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
      // Check all required authentication items
      const [userData, role, userId, farmerId] = await Promise.all([
        AsyncStorage.getItem('userData'),
        AsyncStorage.getItem('userRole'),
        AsyncStorage.getItem('userId'),
        AsyncStorage.getItem('farmerId'),
      ]);

      console.log('Cart Auth check:', { userData, role, userId, farmerId });

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

          // Add farmerId if available
          if (farmerId) {
            userObj.farmerId = farmerId;
          }

          setUser(userObj);
          setShowLoginModal(false);
          console.log('Cart User authenticated:', userObj);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
          setShowLoginModal(true);
        }
      } else {
        console.log('Cart User not authenticated');
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
      // Use farmerId if available, otherwise use userId
      const idToUse = user.farmerId || user._id;
      console.log('Fetching cart for ID:', idToUse);
      
      const response = await fetch(`${CART_API_URL}/cart/${idToUse}`);
      const data = await response.json();

      console.log('Cart API response:', data);

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

    // Navigate to checkout page
    router.push('/farmerscreen/cropcarecheckout');
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  if (loading.auth) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2c5f2d" />
        <Text className="mt-3 text-base text-gray-600 font-medium">Checking authentication...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar backgroundColor="#2c5f2d" barStyle="light-content" />

      {/* Notification Component */}
      {notification && (
        <Animated.View
          className="absolute top-16 right-4 p-4 rounded-lg z-[1001] max-w-[calc(100vw-32px)] shadow-lg shadow-black/15"
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

      {/* Header Section */}
      <View className="bg-green-800 pt-3 pb-4 px-4 shadow-md shadow-black/10">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.push("/farmerscreen/cropcare")}
            className="p-2 rounded-lg bg-white/10"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <View className="items-center mx-3 flex-1">
            <Text className="text-xl font-bold text-white mb-1">🛒 Crop Care Cart</Text>
            {user ? (
              <View className="flex-row items-center gap-2">
                <Text className="text-sm text-gray-200">{user.personalInfo.name}</Text>
                <View className="bg-white/20 px-2.5 py-0.5 rounded-full">
                  <Text className="text-white text-xs font-semibold">{user.role}</Text>
                </View>
                <TouchableOpacity 
                  onPress={handleLogout} 
                  className="flex-row items-center bg-white/15 px-2 py-1 rounded-lg gap-1"
                >
                  <LogOut size={12} color="white" />
                  <Text className="text-white text-xs font-semibold">Logout</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                className="flex-row items-center bg-white/15 px-3 py-1.5 rounded-lg gap-1.5"
                onPress={() => setShowLoginModal(true)}
              >
                <User size={14} color="white" />
                <Text className="text-white text-xs font-semibold">Tap to Login</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-5">
          {/* Show Login Prompt when not authenticated */}
          {!user ? (
            <View className="items-center justify-center py-12 px-5 mt-10">
              <View className="w-32 h-32 rounded-full bg-green-50 justify-center items-center mb-6">
                <Text className="text-6xl text-green-800">🔒</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-800 mb-3 text-center">Login Required</Text>
              <Text className="text-base text-gray-600 text-center mb-8 leading-relaxed">
                Please login to view and manage your cart
              </Text>
              <TouchableOpacity
                className="flex-row items-center justify-center bg-green-800 px-8 py-3.5 rounded-lg gap-2.5"
                onPress={() => setShowLoginModal(true)}
              >
                <User size={20} color="white" />
                <Text className="text-white text-base font-bold">Login Now</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Cart Title Section */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between">
                  <Text className="text-2xl font-bold text-gray-800">Shopping Cart</Text>
                  <View className="bg-green-800 px-4 py-2 rounded-full">
                    <Text className="text-white text-sm font-bold">
                      {cart.items.length} item{cart.items.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Empty Cart State */}
              {cart.items.length === 0 ? (
                <View className="items-center py-12 px-5">
                  <View className="w-32 h-32 rounded-full bg-green-50 justify-center items-center mb-6">
                    <Text className="text-6xl text-green-800">🛒</Text>
                  </View>
                  <Text className="text-2xl font-bold text-gray-800 mb-3 text-center">Your cart is empty</Text>
                  <Text className="text-base text-gray-600 text-center mb-8 leading-relaxed">
                    Add some products to get started with your crop care journey!
                  </Text>
                  <TouchableOpacity
                    className="flex-row items-center bg-blue-50 px-6 py-3.5 rounded-lg gap-2.5"
                    onPress={() => router.push('/farmerscreen/cropcare')}
                  >
                    <ShoppingCart size={20} color="#333" />
                    <Text className="text-green-800 text-base font-bold">Browse Products</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="gap-6">
                  {loading.cart ? (
                    <View className="items-center justify-center py-12">
                      <ActivityIndicator size="large" color="#2c5f2d" />
                      <Text className="mt-4 text-base text-gray-600">Loading cart...</Text>
                    </View>
                  ) : (
                    <>
                      {/* Cart Items List */}
                      <View className="bg-white rounded-xl p-5 shadow-sm shadow-black/5">
                        {cart.items.map((item) => (
                          <View key={item._id} className="flex-row py-4 border-b border-gray-200 gap-4">
                            {/* Product Image */}
                            <View className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden justify-center items-center">
                              {item.image ? (
                                <Image
                                  source={{ uri: item.image }}
                                  className="w-full h-full"
                                  resizeMode="cover"
                                />
                              ) : (
                                <View className="w-full h-full justify-center items-center">
                                  <Text className="text-4xl text-gray-500">🌱</Text>
                                </View>
                              )}
                            </View>

                            {/* Product Details */}
                            <View className="flex-1 justify-between">
                              <View className="mb-3">
                                <Text className="text-base font-bold text-gray-800 mb-1" numberOfLines={1}>
                                  {item.seedName}
                                </Text>
                                <Text className="text-sm text-gray-600 mb-1.5" numberOfLines={1}>
                                  {item.productName}
                                </Text>
                                <Text className="text-sm font-semibold text-green-500">
                                  ₹{item.seedPrice.toFixed(2)} per unit
                                </Text>
                              </View>

                              {/* Quantity Controls */}
                              <View className="mt-2">
                                <View className="flex-row items-center gap-3">
                                  <TouchableOpacity
                                    className="w-8 h-8 rounded-full bg-gray-200 justify-center items-center"
                                    onPress={() => updateQuantity(item._id!, item.quantity - 1)}
                                    disabled={loading.cart}
                                  >
                                    <Minus size={16} color="#333" />
                                  </TouchableOpacity>
                                  <View className="min-w-9 items-center">
                                    <Text className="text-base font-bold text-gray-800">{item.quantity}</Text>
                                  </View>
                                  <TouchableOpacity
                                    className="w-8 h-8 rounded-full bg-gray-200 justify-center items-center"
                                    onPress={() => updateQuantity(item._id!, item.quantity + 1)}
                                    disabled={loading.cart}
                                  >
                                    <Plus size={16} color="#333" />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>

                            {/* Item Actions */}
                            <View className="items-end justify-between">
                              <Text className="text-lg font-bold text-gray-800 mb-3">
                                ₹{(item.seedPrice * item.quantity).toFixed(2)}
                              </Text>
                              <TouchableOpacity
                                className="flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-red-50"
                                onPress={() => removeItem(item._id!)}
                                disabled={loading.cart}
                              >
                                <Trash2 size={16} color="#ff4d4f" />
                                <Text className="text-red-500 text-xs font-semibold">Remove</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}

                        {/* Clear Cart Button */}
                        <View className="mt-5 items-end">
                          <TouchableOpacity
                            className="flex-row items-center bg-red-500 px-5 py-3 rounded-lg gap-2"
                            onPress={clearCart}
                            disabled={loading.cart}
                          >
                            <Trash2 size={16} color="white" />
                            <Text className="text-white text-sm font-bold">Clear Cart</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Order Summary */}
                      <View className="bg-white rounded-xl p-6 shadow-sm shadow-black/5">
                        <Text className="text-xl font-bold text-gray-800 mb-5 pb-4 border-b-2 border-b-green-800">
                          Order Summary
                        </Text>

                        <View className="gap-3 mb-5">
                          <View className="flex-row justify-between items-center">
                            <Text className="text-base text-gray-600">Subtotal</Text>
                            <Text className="text-base text-gray-600 font-medium">₹{cart.subtotal.toFixed(2)}</Text>
                          </View>

                          <View className="flex-row justify-between items-center">
                            <Text className="text-base text-gray-600">GST (18%)</Text>
                            <Text className="text-base text-gray-600 font-medium">₹{cart.gst.toFixed(2)}</Text>
                          </View>

                          <View className="flex-row justify-between items-center">
                            <Text className="text-base text-gray-600">Shipping</Text>
                            <Text className="text-base text-gray-600 font-medium">
                              {cart.shipping === 0 ? 'FREE' : `₹${cart.shipping.toFixed(2)}`}
                            </Text>
                          </View>
                        </View>

                        {/* Total Section */}
                        <View className="flex-row justify-between items-center mt-5 pt-5 border-t-2 border-t-gray-200">
                          <Text className="text-lg font-bold text-gray-800">Total Amount</Text>
                          <Text className="text-2xl font-bold text-green-800">₹{cart.total.toFixed(2)}</Text>
                        </View>

                        {/* Action Buttons */}
                        <View className="mt-7 gap-3">
                          <TouchableOpacity
                            className="flex-row items-center justify-center bg-green-800 py-4 rounded-lg gap-2.5"
                            onPress={initiatePayment}
                            disabled={loading.payment || cart.items.length === 0}
                          >
                            <CreditCard size={20} color="white" />
                            <Text className="text-white text-base font-bold">Proceed to Checkout</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className="flex-row items-center justify-center bg-gray-200 py-4 rounded-lg gap-2.5"
                            onPress={() => router.push('/farmerscreen/cropcare')}
                          >
                            <ShoppingCart size={20} color="#333" />
                            <Text className="text-gray-800 text-base font-bold">Continue Shopping</Text>
                          </TouchableOpacity>
                        </View>

                        {/* Free Shipping Banner */}
                        {cart.subtotal < 500 && cart.items.length > 0 && (
                          <View className="mt-4 p-3 bg-orange-50 rounded-lg border-l-4 border-l-orange-500">
                            <Text className="text-sm text-gray-600 text-center font-medium">
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
        </View>
      </ScrollView>

      {/* Login Modal */}
      <Modal
        visible={showLoginModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-2xl p-6 w-4/5 items-center">
            <Text className="text-5xl mb-4 text-green-800">🔒</Text>
            <Text className="text-xl font-bold text-gray-800 mb-2 text-center">Login Required</Text>
            <Text className="text-base text-gray-600 text-center mb-6 leading-relaxed">
              You need to login to access your cart
            </Text>
            <View className="flex-row justify-between w-full gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-200 py-3 rounded-lg"
                onPress={() => {
                  setShowLoginModal(false);
                  router.back();
                }}
              >
                <Text className="text-gray-800 font-bold text-center text-base">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-green-800 py-3 rounded-lg"
                onPress={handleLogin}
              >
                <Text className="text-white font-bold text-center text-base">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CropcareCart;