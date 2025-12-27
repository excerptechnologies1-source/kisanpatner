


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { ArrowLeft, CheckCircle, CreditCard, Home, MapPin, Phone } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
// import {
//     ActivityIndicator,
//     Alert,
//     Modal,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import CropcareOrders from './cropcareorders';

// interface CartItem {
//     _id?: string;
//     productId: string;
//     productName: string;
//     seedId?: string;
//     seedName: string;
//     seedPrice: number;
//     quantity: number;
//     image?: string;
// }

// interface CartData {
//     _id?: string;
//     items: CartItem[];
//     subtotal: number;
//     gst: number;
//     shipping: number;
//     total: number;
// }

// interface User {
//     _id: string;
//     personalInfo: {
//         name: string;
//         mobileNo: string;
//         address?: string;
//         villageGramaPanchayat?: string;
//         pincode?: string;
//         state?: string;
//         district?: string;
//         taluk?: string;
//         post?: string;
//     };
//     role: string;
// }

// interface ShippingAddress {
//     name: string;
//     mobileNo: string;
//     address: string;
//     villageGramaPanchayat: string;
//     pincode: string;
//     state: string;
//     district: string;
//     taluk: string;
//     post: string;
//     landmark?: string;
// }

// const CropcareCheckout: React.FC = () => {
//     const router = useRouter();

//     const [cart, setCart] = useState<CartData>({
//         items: [],
//         subtotal: 0,
//         gst: 0,
//         shipping: 0,
//         total: 0
//     });
//     const [user, setUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState({
//         cart: false,
//         payment: false
//     });
//     const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
//     const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
//         name: '',
//         mobileNo: '',
//         address: '',
//         villageGramaPanchayat: '',
//         pincode: '',
//         state: '',
//         district: '',
//         taluk: '',
//         post: '',
//         landmark: ''
//     });
//     const [useDefaultAddress, setUseDefaultAddress] = useState(true);
//     const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

//     const CART_API_URL = 'https://kisan.etpl.ai/api/cropcare';

//     useEffect(() => {
//         checkAuthStatus();
//     }, []);

//     useEffect(() => {
//         if (user) {
//             fetchUserCart();
//             if (useDefaultAddress && user.personalInfo) {
//                 setShippingAddress({
//                     name: user.personalInfo.name || '',
//                     mobileNo: user.personalInfo.mobileNo || '',
//                     address: user.personalInfo.address || '',
//                     villageGramaPanchayat: user.personalInfo.villageGramaPanchayat || '',
//                     pincode: user.personalInfo.pincode || '',
//                     state: user.personalInfo.state || '',
//                     district: user.personalInfo.district || '',
//                     taluk: user.personalInfo.taluk || '',
//                     post: user.personalInfo.post || '',
//                     landmark: ''
//                 });
//             }
//         }
//     }, [user, useDefaultAddress]);

//     const checkAuthStatus = async () => {
//         try {
//             const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
//             const userRole = await AsyncStorage.getItem('role');
//             const userData = await AsyncStorage.getItem('userData');

//             if (isLoggedIn === 'true' && userRole && userData) {
//                 try {
//                     const parsedUserData = JSON.parse(userData);
//                     const userId = await AsyncStorage.getItem('userId');
//                     const phone = await AsyncStorage.getItem('phone');

//                     setUser({
//                         _id: userId || parsedUserData._id || parsedUserData.id || '',
//                         personalInfo: {
//                             name: parsedUserData.personalInfo?.name || parsedUserData.name || 'User',
//                             mobileNo: parsedUserData.mobileNo || phone || '',
//                             address: parsedUserData.personalInfo?.address,
//                             villageGramaPanchayat: parsedUserData.personalInfo?.villageGramaPanchayat,
//                             pincode: parsedUserData.personalInfo?.pincode,
//                             state: parsedUserData.personalInfo?.state,
//                             district: parsedUserData.personalInfo?.district,
//                             taluk: parsedUserData.personalInfo?.taluk,
//                             post: parsedUserData.personalInfo?.post
//                         },
//                         role: userRole
//                     });
//                 } catch (error) {
//                     console.error('Error parsing user data:', error);
//                     showNotification('error', 'Please login again');
//                     setTimeout(() => router.push('/(auth)/Login?role=farmer'), 1500);
//                 }
//             } else {
//                 showNotification('error', 'Please login to checkout');
//                 setTimeout(() => router.push('/(auth)/Login?role=farmer'), 1500);
//             }
//         } catch (error) {
//             console.error('Error checking auth status:', error);
//             showNotification('error', 'Please login again');
//             setTimeout(() => router.push('/(auth)/Login?role=farmer'), 1500);
//         }
//     };

//     const fetchUserCart = async () => {
//         if (!user) return;

//         setLoading(prev => ({ ...prev, cart: true }));
//         try {
//             const userId = user._id;
//             const response = await axios.get(`${CART_API_URL}/cart/${userId}`);

//             if (response.data.success) {
//                 const cartData = response.data.data;
//                 if (cartData && cartData.items && cartData.items.length > 0) {
//                     setCart(cartData);
//                 } else {
//                     showNotification('error', 'Your cart is empty');
//                     setTimeout(() => router.push('/farmerscreen/cropcarecart'), 1500);
//                 }
//             }
//         } catch (error) {
//             console.error('Error fetching cart:', error);
//             showNotification('error', 'Failed to load cart');
//         } finally {
//             setLoading(prev => ({ ...prev, cart: false }));
//         }
//     };

//     const showNotification = (type: 'success' | 'error', message: string) => {
//         setNotification({ type, message });
//         setTimeout(() => setNotification(null), 3000);
//     };

//     const validateShippingAddress = () => {
//         const requiredFields = ['name', 'mobileNo', 'address', 'pincode', 'state', 'district'];

//         for (const field of requiredFields) {
//             if (!shippingAddress[field as keyof ShippingAddress]) {
//                 showNotification('error', `Please fill in ${field}`);
//                 return false;
//             }
//         }

//         if (shippingAddress.mobileNo.length !== 10) {
//             showNotification('error', 'Please enter a valid 10-digit mobile number');
//             return false;
//         }

//         if (shippingAddress.pincode.length !== 6) {
//             showNotification('error', 'Please enter a valid 6-digit pincode');
//             return false;
//         }

//         return true;
//     };

//     const initiatePayment = async () => {
//         if (!user || cart.items.length === 0) {
//             showNotification('error', 'Your cart is empty');
//             return;
//         }

//         if (!validateShippingAddress()) {
//             return;
//         }

//         if (paymentMethod === 'cod') {
//             // For Cash on Delivery
//             showNotification('success', 'Order placed successfully! Cash on Delivery selected.');
//             setTimeout(() => {
//                 router.push('/farmerscreen/cropcareorders');
//             }, 2000);
//             return;
//         }

//         // For Razorpay payment
//         setLoading(prev => ({ ...prev, payment: true }));
//         try {
//             // Create Razorpay order
//             const orderResponse = await axios.post(`https://kisan.etpl.ai/api/payment/create-order`, {
//                 userId: user._id
//             });

//             if (orderResponse.data.success) {
//                 const { orderId, amount, currency, key } = orderResponse.data.data;

//                 // For Expo/React Native, you would use Razorpay's React Native SDK
//                 // This is a simulated implementation
//                 Alert.alert(
//                     'Payment Required',
//                     `Amount: ₹${(amount / 100).toFixed(2)}\n\nRazorpay payment gateway would open here.`,
//                     [
//                         {
//                             text: 'Simulate Payment',
//                             onPress: async () => {
//                                 try {
//                                     const verifyResponse = await axios.post(`https://kisan.etpl.ai/api/payment/verify`, {
//                                         razorpay_order_id: orderId,
//                                         razorpay_payment_id: 'simulated_payment_id_' + Date.now(),
//                                         razorpay_signature: 'simulated_signature',
//                                         shippingAddress: shippingAddress,
//                                         paymentMethod: paymentMethod
//                                     });

//                                     if (verifyResponse.data.success) {
//                                         showNotification('success', 'Payment successful! Order placed.');
//                                         setTimeout(() => {
//                                             router.push('/farmerscreen/cropcareorders');
//                                         }, 2000);
//                                     } else {
//                                         showNotification('error', 'Payment verification failed');
//                                     }
//                                 } catch (error) {
//                                     console.error('Payment verification error:', error);
//                                     showNotification('error', 'Payment verification error');
//                                 }
//                             }
//                         },
//                         { text: 'Cancel', style: 'cancel' }
//                     ]
//                 );
//             }
//         } catch (error: any) {
//             console.error('Error creating order:', error);
//             showNotification('error', error.response?.data?.message || 'Payment initialization failed');
//         } finally {
//             setLoading(prev => ({ ...prev, payment: false }));
//         }
//     };

//     const goBackToCart = () => {
//         if (router.canGoBack()) {
//             router.back();   // go back if possible
//         } else {
//             router.push("/farmerscreen/cropcarecart"); // force navigate to cart
//         }
//     };

//     const handleAddressChange = (name: keyof ShippingAddress, value: string) => {
//         setShippingAddress(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const fetchPincodeData = async (pincode: string) => {
//         if (pincode.length !== 6) return;

//         try {
//             const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//             const data = await response.json();

//             if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
//                 const postOffice = data[0].PostOffice[0];
//                 setShippingAddress(prev => ({
//                     ...prev,
//                     state: postOffice.State,
//                     district: postOffice.District,
//                     taluk: postOffice.Block || postOffice.Division || '',
//                     post: postOffice.Name
//                 }));
//             }
//         } catch (error) {
//             console.error("Error fetching pincode data:", error);
//         }
//     };

//     const handlePincodeChange = (value: string) => {
//         setShippingAddress(prev => ({
//             ...prev,
//             pincode: value
//         }));

//         if (value.length === 6) {
//             fetchPincodeData(value);
//         }
//     };

//     return (
//         <SafeAreaView style={styles.container} edges={['top']}>
//             {/* Notification */}
//             {notification && (
//                 <Modal
//                     transparent
//                     visible={!!notification}
//                     animationType="slide"
//                     onRequestClose={() => setNotification(null)}
//                 >
//                     <View style={styles.notificationContainer}>
//                         <View style={[
//                             styles.notification,
//                             { backgroundColor: notification.type === 'success' ? '#28a745' : '#ff4d4f' }
//                         ]}>
//                             <Text style={styles.notificationText}>{notification.message}</Text>
//                         </View>
//                     </View>
//                 </Modal>
//             )}

//             {/* Header */}
//             <View style={styles.header}>
//                 <View style={styles.headerContent}>
//                     <View style={styles.headerRow}>
//                         <Text style={styles.headerTitle}>🌾 Crop Care Checkout</Text>
//                         {user && (
//                             <View style={styles.userInfo}>
//                                 <Text style={styles.userName}>👤 {user.personalInfo.name}</Text>
//                                 <View style={styles.userRoleBadge}>
//                                     <Text style={styles.userRoleText}>{user.role}</Text>
//                                 </View>
//                             </View>
//                         )}
//                     </View>
//                 </View>
//             </View>

//             <ScrollView style={styles.scrollView}>
//                 <View style={styles.main}>
//                     {/* Back to Cart */}
//                     <TouchableOpacity
//                         style={styles.backButton}
//                         onPress={() => router.push("/farmerscreen/cropcarecart")}
//                     >
//                         <ArrowLeft size={20} color="#2c5f2d" />
//                         <Text style={styles.backButtonText}>Back to Cart</Text>
//                     </TouchableOpacity>

//                     <Text style={styles.title}>Checkout</Text>

//                     {loading.cart ? (
//                         <View style={styles.loadingContainer}>
//                             <ActivityIndicator size="large" color="#2c5f2d" />
//                             <Text style={styles.loadingText}>Loading checkout...</Text>
//                         </View>
//                     ) : (
//                         <View style={styles.content}>
//                             {/* Left Section - Shipping & Payment */}
//                             <View style={styles.leftSection}>
//                                 {/* Shipping Address */}
//                                 <View style={styles.section}>
//                                     <View style={styles.sectionTitle}>
//                                         <MapPin size={20} color="#333" />
//                                         <Text style={styles.sectionTitleText}>Shipping Address</Text>
//                                     </View>

//                                     <View style={styles.addressToggle}>
//                                         <Text style={styles.toggleLabel}>Use my default address</Text>
//                                         <TouchableOpacity
//                                             style={[
//                                                 styles.toggleSwitch,
//                                                 useDefaultAddress && styles.toggleSwitchActive
//                                             ]}
//                                             onPress={() => setUseDefaultAddress(!useDefaultAddress)}
//                                         >
//                                             <View style={[
//                                                 styles.toggleKnob,
//                                                 useDefaultAddress && styles.toggleKnobActive
//                                             ]} />
//                                         </TouchableOpacity>
//                                     </View>

//                                     {!useDefaultAddress ? (
//                                         <View>
//                                             <View style={styles.formGroup}>
//                                                 <Text style={styles.label}>Full Name *</Text>
//                                                 <TextInput
//                                                     style={styles.input}
//                                                     value={shippingAddress.name}
//                                                     onChangeText={(value) => handleAddressChange('name', value)}
//                                                     placeholder="Enter full name"
//                                                 />
//                                             </View>

//                                             <View style={styles.formGroup}>
//                                                 <Text style={styles.label}>Mobile Number *</Text>
//                                                 <TextInput
//                                                     style={styles.input}
//                                                     value={shippingAddress.mobileNo}
//                                                     onChangeText={(value) => handleAddressChange('mobileNo', value)}
//                                                     placeholder="Enter 10-digit mobile number"
//                                                     keyboardType="phone-pad"
//                                                     maxLength={10}
//                                                 />
//                                             </View>

//                                             <View style={styles.formGroup}>
//                                                 <Text style={styles.label}>Address *</Text>
//                                                 <TextInput
//                                                     style={[styles.input, styles.textarea]}
//                                                     value={shippingAddress.address}
//                                                     onChangeText={(value) => handleAddressChange('address', value)}
//                                                     placeholder="Enter complete address"
//                                                     multiline
//                                                     numberOfLines={3}
//                                                 />
//                                             </View>

//                                             <View style={styles.formGroup}>
//                                                 <Text style={styles.label}>Village / Grama Panchayath</Text>
//                                                 <TextInput
//                                                     style={styles.input}
//                                                     value={shippingAddress.villageGramaPanchayat}
//                                                     onChangeText={(value) => handleAddressChange('villageGramaPanchayat', value)}
//                                                     placeholder="Enter village or grama panchayath"
//                                                 />
//                                             </View>

//                                             <View style={styles.formGroup}>
//                                                 <Text style={styles.label}>Pincode *</Text>
//                                                 <TextInput
//                                                     style={styles.input}
//                                                     value={shippingAddress.pincode}
//                                                     onChangeText={handlePincodeChange}
//                                                     placeholder="Enter 6-digit pincode"
//                                                     keyboardType="number-pad"
//                                                     maxLength={6}
//                                                 />
//                                             </View>

//                                             <View style={styles.row}>
//                                                 <View style={[styles.formGroup, styles.halfWidth]}>
//                                                     <Text style={styles.label}>State *</Text>
//                                                     <TextInput
//                                                         style={styles.input}
//                                                         value={shippingAddress.state}
//                                                         onChangeText={(value) => handleAddressChange('state', value)}
//                                                         placeholder="Enter state"
//                                                     />
//                                                 </View>

//                                                 <View style={[styles.formGroup, styles.halfWidth]}>
//                                                     <Text style={styles.label}>District *</Text>
//                                                     <TextInput
//                                                         style={styles.input}
//                                                         value={shippingAddress.district}
//                                                         onChangeText={(value) => handleAddressChange('district', value)}
//                                                         placeholder="Enter district"
//                                                     />
//                                                 </View>
//                                             </View>

//                                             <View style={styles.row}>
//                                                 <View style={[styles.formGroup, styles.halfWidth]}>
//                                                     <Text style={styles.label}>Taluk</Text>
//                                                     <TextInput
//                                                         style={styles.input}
//                                                         value={shippingAddress.taluk}
//                                                         onChangeText={(value) => handleAddressChange('taluk', value)}
//                                                         placeholder="Enter taluk"
//                                                     />
//                                                 </View>

//                                                 <View style={[styles.formGroup, styles.halfWidth]}>
//                                                     <Text style={styles.label}>Post</Text>
//                                                     <TextInput
//                                                         style={styles.input}
//                                                         value={shippingAddress.post}
//                                                         onChangeText={(value) => handleAddressChange('post', value)}
//                                                         placeholder="Enter post office"
//                                                     />
//                                                 </View>
//                                             </View>

//                                             <View style={styles.formGroup}>
//                                                 <Text style={styles.label}>Landmark (Optional)</Text>
//                                                 <TextInput
//                                                     style={styles.input}
//                                                     value={shippingAddress.landmark}
//                                                     onChangeText={(value) => handleAddressChange('landmark', value)}
//                                                     placeholder="Near temple, school, etc."
//                                                 />
//                                             </View>
//                                         </View>
//                                     ) : user?.personalInfo && (
//                                         <View style={styles.defaultAddress}>
//                                             <View style={styles.addressContent}>
//                                                 <Home size={20} color="#2c5f2d" />
//                                                 <View style={styles.addressDetails}>
//                                                     <Text style={styles.addressName}>{user.personalInfo.name}</Text>
//                                                     <Text style={styles.addressText}>{user.personalInfo.address}</Text>
//                                                     <Text style={styles.addressText}>{user.personalInfo.villageGramaPanchayat}</Text>
//                                                     <Text style={styles.addressText}>
//                                                         {user.personalInfo.district}, {user.personalInfo.state} - {user.personalInfo.pincode}
//                                                     </Text>
//                                                     <View style={styles.phoneRow}>
//                                                         <Phone size={14} color="#666" />
//                                                         <Text style={styles.addressText}>{user.personalInfo.mobileNo}</Text>
//                                                     </View>
//                                                 </View>
//                                             </View>
//                                         </View>
//                                     )}
//                                 </View>

//                                 {/* Payment Method */}
//                                 <View style={[styles.section, styles.paymentMethods]}>
//                                     <View style={styles.sectionTitle}>
//                                         <CreditCard size={20} color="#333" />
//                                         <Text style={styles.sectionTitleText}>Payment Method</Text>
//                                     </View>

//                                     <TouchableOpacity
//                                         style={[
//                                             styles.paymentOption,
//                                             paymentMethod === 'razorpay' && styles.paymentOptionSelected
//                                         ]}
//                                         onPress={() => setPaymentMethod('razorpay')}
//                                     >
//                                         <Text style={styles.paymentIcon}>💳</Text>
//                                         <View style={styles.paymentInfo}>
//                                             <Text style={styles.paymentTitle}>Credit/Debit Card, UPI, NetBanking</Text>
//                                             <Text style={styles.paymentDescription}>
//                                                 Pay securely with Razorpay. All major cards and UPI accepted.
//                                             </Text>
//                                         </View>
//                                         {paymentMethod === 'razorpay' && (
//                                             <CheckCircle size={20} color="#2c5f2d" />
//                                         )}
//                                     </TouchableOpacity>

//                                     <TouchableOpacity
//                                         style={[
//                                             styles.paymentOption,
//                                             paymentMethod === 'cod' && styles.paymentOptionSelected
//                                         ]}
//                                         onPress={() => setPaymentMethod('cod')}
//                                     >
//                                         <Text style={styles.paymentIcon}>💰</Text>
//                                         <View style={styles.paymentInfo}>
//                                             <Text style={styles.paymentTitle}>Cash on Delivery</Text>
//                                             <Text style={styles.paymentDescription}>
//                                                 Pay when you receive your order. Available for all locations.
//                                             </Text>
//                                         </View>
//                                         {paymentMethod === 'cod' && (
//                                             <CheckCircle size={20} color="#2c5f2d" />
//                                         )}
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>

//                             {/* Right Section - Order Summary */}
//                             <View style={styles.rightSection}>
//                                 <View style={styles.sectionTitle}>
//                                     <Text style={styles.sectionTitleText}>Order Summary</Text>
//                                 </View>

//                                 {/* Order Items */}
//                                 <View style={styles.orderItems}>
//                                     {cart.items.map((item) => (
//                                         <View key={item._id} style={styles.orderItem}>
//                                             <View style={styles.orderItemName}>
//                                                 <Text style={styles.orderItemMainText}>{item.seedName}</Text>
//                                                 <Text style={styles.orderItemSubText}>{item.productName}</Text>
//                                             </View>
//                                             <Text style={styles.orderItemQuantity}>
//                                                 x{item.quantity}
//                                             </Text>
//                                             <Text style={styles.orderItemPrice}>
//                                                 ₹{(item.seedPrice * item.quantity).toFixed(2)}
//                                             </Text>
//                                         </View>
//                                     ))}
//                                 </View>

//                                 {/* Order Summary */}
//                                 <View style={styles.summaryRow}>
//                                     <Text style={styles.summaryLabel}>Subtotal</Text>
//                                     <Text style={styles.summaryValue}>₹{cart.subtotal.toFixed(2)}</Text>
//                                 </View>

//                                 <View style={styles.summaryRow}>
//                                     <Text style={styles.summaryLabel}>GST (18%)</Text>
//                                     <Text style={styles.summaryValue}>₹{cart.gst.toFixed(2)}</Text>
//                                 </View>

//                                 <View style={styles.summaryRow}>
//                                     <Text style={styles.summaryLabel}>Shipping</Text>
//                                     <Text style={styles.summaryValue}>
//                                         {cart.shipping === 0 ? 'FREE' : `₹${cart.shipping.toFixed(2)}`}
//                                     </Text>
//                                 </View>

//                                 <View style={styles.summaryTotal}>
//                                     <Text style={styles.summaryTotalLabel}>Total</Text>
//                                     <Text style={styles.summaryTotalValue}>₹{cart.total.toFixed(2)}</Text>
//                                 </View>

//                                 {/* Place Order Button */}
//                                 <TouchableOpacity
//                                     style={[
//                                         styles.placeOrderButton,
//                                         (loading.payment || cart.items.length === 0) && styles.placeOrderButtonDisabled
//                                     ]}
//                                     onPress={initiatePayment}
//                                     disabled={loading.payment || cart.items.length === 0}
//                                 >
//                                     {loading.payment ? (
//                                         <ActivityIndicator color="white" />
//                                     ) : (
//                                         <Text style={styles.placeOrderButtonText}>
//                                             {paymentMethod === 'cod'
//                                                 ? 'Place Order (Cash on Delivery)'
//                                                 : 'Pay & Place Order'}
//                                         </Text>
//                                     )}
//                                 </TouchableOpacity>

//                                 {/* Security Note */}
//                                 <View style={styles.securityNote}>
//                                     <Text style={styles.securityNoteText}>🔒 Your payment is secure and encrypted</Text>
//                                 </View>
//                             </View>
//                         </View>
//                     )}
//                 </View>
//             </ScrollView>
//             <CropcareOrders />
//         </SafeAreaView>

//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f8f9fa',
//     },
//     scrollView: {
//         flex: 1,
//     },
//     header: {
//         backgroundColor: '#2c5f2d',
//         paddingVertical: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 10,
//         elevation: 3,
//     },
//     headerContent: {
//         paddingHorizontal: 20,
//     },
//     headerRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     headerTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: 'white',
//     },
//     userInfo: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 15,
//     },
//     userName: {
//         color: 'white',
//         fontSize: 16,
//     },
//     userRoleBadge: {
//         backgroundColor: 'rgba(255,255,255,0.2)',
//         paddingHorizontal: 12,
//         paddingVertical: 4,
//         borderRadius: 12,
//     },
//     userRoleText: {
//         color: 'white',
//         fontSize: 14,
//     },
//     main: {
//         padding: 20,
//     },
//     backButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 8,
//         marginBottom: 20,
//     },
//     backButtonText: {
//         color: '#2c5f2d',
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
//     title: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 30,
//     },
//     loadingContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 60,
//         paddingHorizontal: 20,
//     },
//     loadingText: {
//         marginTop: 15,
//         fontSize: 16,
//         color: '#666',
//     },
//     content: {
//         gap: 30,
//     },
//     leftSection: {
//         backgroundColor: 'white',
//         borderRadius: 12,
//         padding: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.05,
//         shadowRadius: 12,
//         elevation: 2,
//     },
//     rightSection: {
//         backgroundColor: 'white',
//         borderRadius: 12,
//         padding: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.05,
//         shadowRadius: 12,
//         elevation: 2,
//     },
//     section: {
//         marginBottom: 30,
//     },
//     sectionTitle: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//         marginBottom: 20,
//         paddingBottom: 15,
//         borderBottomWidth: 2,
//         borderBottomColor: '#2c5f2d',
//     },
//     sectionTitleText: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     addressToggle: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//         marginBottom: 20,
//     },
//     toggleLabel: {
//         fontSize: 14,
//         color: '#666',
//     },
//     toggleSwitch: {
//         width: 50,
//         height: 24,
//         backgroundColor: '#ccc',
//         borderRadius: 24,
//         padding: 4,
//     },
//     toggleSwitchActive: {
//         backgroundColor: '#2c5f2d',
//     },
//     toggleKnob: {
//         width: 16,
//         height: 16,
//         backgroundColor: 'white',
//         borderRadius: 8,
//     },
//     toggleKnobActive: {
//         transform: [{ translateX: 26 }],
//     },
//     formGroup: {
//         marginBottom: 20,
//     },
//     label: {
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#333',
//         marginBottom: 8,
//     },
//     input: {
//         width: '100%',
//         padding: 12,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 8,
//         fontSize: 14,
//         color: '#333',
//         backgroundColor: '#fff',
//     },
//     textarea: {
//         minHeight: 100,
//         textAlignVertical: 'top',
//     },
//     row: {
//         flexDirection: 'row',
//         gap: 15,
//     },
//     halfWidth: {
//         flex: 1,
//     },
//     defaultAddress: {
//         padding: 20,
//         backgroundColor: '#f0fff4',
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: '#2c5f2d',
//     },
//     addressContent: {
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         gap: 15,
//     },
//     addressDetails: {
//         flex: 1,
//     },
//     addressName: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 10,
//     },
//     addressText: {
//         fontSize: 14,
//         color: '#666',
//         marginBottom: 5,
//     },
//     phoneRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 5,
//     },
//     paymentMethods: {
//         marginTop: 30,
//     },
//     paymentOption: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 15,
//         padding: 15,
//         borderWidth: 2,
//         borderColor: '#ddd',
//         borderRadius: 8,
//         marginBottom: 15,
//     },
//     paymentOptionSelected: {
//         borderColor: '#2c5f2d',
//         backgroundColor: '#f0fff4',
//     },
//     paymentIcon: {
//         fontSize: 24,
//     },
//     paymentInfo: {
//         flex: 1,
//     },
//     paymentTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 5,
//     },
//     paymentDescription: {
//         fontSize: 14,
//         color: '#666',
//     },
//     orderItems: {
//         marginBottom: 20,
//     },
//     orderItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: '#eaeaea',
//     },
//     orderItemName: {
//         flex: 1,
//     },
//     orderItemMainText: {
//         fontSize: 14,
//         color: '#333',
//     },
//     orderItemSubText: {
//         fontSize: 12,
//         color: '#999',
//         marginTop: 2,
//     },
//     orderItemQuantity: {
//         fontSize: 14,
//         color: '#666',
//         marginRight: 15,
//     },
//     orderItemPrice: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         color: '#333',
//         minWidth: 80,
//         textAlign: 'right',
//     },
//     summaryRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 15,
//     },
//     summaryLabel: {
//         fontSize: 16,
//         color: '#666',
//     },
//     summaryValue: {
//         fontSize: 16,
//         color: '#666',
//     },
//     summaryTotal: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 20,
//         paddingTop: 20,
//         borderTopWidth: 2,
//         borderTopColor: '#eaeaea',
//     },
//     summaryTotalLabel: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     summaryTotalValue: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     placeOrderButton: {
//         width: '100%',
//         padding: 16,
//         backgroundColor: '#2c5f2d',
//         borderRadius: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: 25,
//     },
//     placeOrderButtonDisabled: {
//         backgroundColor: '#ccc',
//     },
//     placeOrderButtonText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: 'white',
//     },
//     securityNote: {
//         marginTop: 15,
//         padding: 10,
//         backgroundColor: '#fff9f0',
//         borderRadius: 6,
//     },
//     securityNoteText: {
//         fontSize: 12,
//         color: '#666',
//         textAlign: 'center',
//     },
//     notificationContainer: {
//         position: 'absolute',
//         top: 20,
//         right: 20,
//         zIndex: 1001,
//     },
//     notification: {
//         padding: 15,
//         borderRadius: 8,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     notificationText: {
//         color: 'white',
//         fontWeight: 'bold',
//     },
// });

// export default CropcareCheckout;





import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, CreditCard, Home, MapPin, Phone, User, LogOut } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CropcareOrders from './cropcareorders';

interface CartItem {
    _id?: string;
    productId: string;
    productName: string;
    seedId?: string;
    seedName: string;
    seedPrice: number;
    quantity: number;
    image?: string;
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
        taluk?: string;
        post?: string;
    };
    role: string;
    farmerId?: string;
}

interface ShippingAddress {
    name: string;
    mobileNo: string;
    address: string;
    villageGramaPanchayat: string;
    pincode: string;
    state: string;
    district: string;
    taluk: string;
    post: string;
    landmark?: string;
}

const CropcareCheckout: React.FC = () => {
    const router = useRouter();

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
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        name: '',
        mobileNo: '',
        address: '',
        villageGramaPanchayat: '',
        pincode: '',
        state: '',
        district: '',
        taluk: '',
        post: '',
        landmark: ''
    });
    const [useDefaultAddress, setUseDefaultAddress] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
    const [showLoginModal, setShowLoginModal] = useState(false);

    const CART_API_URL = 'https://kisan.etpl.ai/api/cropcare';

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        if (user) {
            fetchUserCart();
            if (useDefaultAddress && user.personalInfo) {
                setShippingAddress({
                    name: user.personalInfo.name || '',
                    mobileNo: user.personalInfo.mobileNo || '',
                    address: user.personalInfo.address || '',
                    villageGramaPanchayat: user.personalInfo.villageGramaPanchayat || '',
                    pincode: user.personalInfo.pincode || '',
                    state: user.personalInfo.state || '',
                    district: user.personalInfo.district || '',
                    taluk: user.personalInfo.taluk || '',
                    post: user.personalInfo.post || '',
                    landmark: ''
                });
            }
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
    }, [user, useDefaultAddress]);

    const checkAuthStatus = async () => {
        setLoading(prev => ({ ...prev, auth: true }));
        try {
            // Check all required authentication items from farmer login
            const [userData, role, userId, farmerId] = await Promise.all([
                AsyncStorage.getItem('userData'),
                AsyncStorage.getItem('userRole'),
                AsyncStorage.getItem('userId'),
                AsyncStorage.getItem('farmerId'),
            ]);

            console.log('Checkout Auth check:', { userData, role, userId, farmerId });

            if (userData && role && userId) {
                try {
                    const parsedUserData = JSON.parse(userData);
                    
                    const userObj: User = {
                        _id: userId,
                        role: role,
                        personalInfo: {
                            name: parsedUserData.personalInfo?.name || parsedUserData.name || 'User',
                            mobileNo: parsedUserData.personalInfo?.mobileNo || parsedUserData.mobileNo || '',
                            address: parsedUserData.personalInfo?.address,
                            villageGramaPanchayat: parsedUserData.personalInfo?.villageGramaPanchayat,
                            pincode: parsedUserData.personalInfo?.pincode,
                            state: parsedUserData.personalInfo?.state,
                            district: parsedUserData.personalInfo?.district,
                            taluk: parsedUserData.personalInfo?.taluk,
                            post: parsedUserData.personalInfo?.post
                        }
                    };

                    // Add farmerId if available
                    if (farmerId) {
                        userObj.farmerId = farmerId;
                    }

                    setUser(userObj);
                    setShowLoginModal(false);
                    console.log('Checkout User authenticated:', userObj);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    setUser(null);
                    setShowLoginModal(true);
                }
            } else {
                console.log('Checkout User not authenticated');
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
            console.log('Fetching cart for checkout with ID:', idToUse);
            
            const response = await axios.get(`${CART_API_URL}/cart/${idToUse}`);

            if (response.data.success) {
                const cartData = response.data.data;
                if (cartData && cartData.items && cartData.items.length > 0) {
                    setCart(cartData);
                } else {
                    showNotification('error', 'Your cart is empty');
                    setTimeout(() => router.push('/farmerscreen/cropcarecart'), 1500);
                }
            } else {
                showNotification('error', response.data.message || 'Failed to load cart');
            }
        } catch (error: any) {
            console.error('Error fetching cart:', error);
            showNotification('error', error.response?.data?.message || 'Failed to load cart');
        } finally {
            setLoading(prev => ({ ...prev, cart: false }));
        }
    };

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const validateShippingAddress = () => {
        if (!user) {
            setShowLoginModal(true);
            return false;
        }

        const requiredFields = ['name', 'mobileNo', 'address', 'pincode', 'state', 'district'];

        for (const field of requiredFields) {
            if (!shippingAddress[field as keyof ShippingAddress]) {
                showNotification('error', `Please fill in ${field}`);
                return false;
            }
        }

        if (shippingAddress.mobileNo.length !== 10) {
            showNotification('error', 'Please enter a valid 10-digit mobile number');
            return false;
        }

        if (shippingAddress.pincode.length !== 6) {
            showNotification('error', 'Please enter a valid 6-digit pincode');
            return false;
        }

        return true;
    };

    const initiatePayment = async () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        if (cart.items.length === 0) {
            showNotification('error', 'Your cart is empty');
            return;
        }

        if (!validateShippingAddress()) {
            return;
        }

        if (paymentMethod === 'cod') {
            // For Cash on Delivery
            showNotification('success', 'Order placed successfully! Cash on Delivery selected.');
            setTimeout(() => {
                router.push('/farmerscreen/cropcareorders');
            }, 2000);
            return;
        }

        // For Razorpay payment
        setLoading(prev => ({ ...prev, payment: true }));
        try {
            // Use farmerId if available, otherwise use userId
            const idToUse = user.farmerId || user._id;
            
            // Create Razorpay order
            const orderResponse = await axios.post(`https://kisan.etpl.ai/api/payment/create-order`, {
                userId: idToUse,
                amount: cart.total,
                currency: 'INR'
            });

            if (orderResponse.data.success) {
                const { orderId, amount, currency, key } = orderResponse.data.data;

                // For Expo/React Native, you would use Razorpay's React Native SDK
                // This is a simulated implementation
                Alert.alert(
                    'Payment Required',
                    `Amount: ₹${(amount / 100).toFixed(2)}\n\nRazorpay payment gateway would open here.`,
                    [
                        {
                            text: 'Simulate Payment',
                            onPress: async () => {
                                try {
                                    const verifyResponse = await axios.post(`https://kisan.etpl.ai/api/payment/verify`, {
                                        razorpay_order_id: orderId,
                                        razorpay_payment_id: 'simulated_payment_id_' + Date.now(),
                                        razorpay_signature: 'simulated_signature',
                                        shippingAddress: shippingAddress,
                                        paymentMethod: paymentMethod,
                                        cartItems: cart.items,
                                        userId: idToUse
                                    });

                                    if (verifyResponse.data.success) {
                                        showNotification('success', 'Payment successful! Order placed.');
                                        setTimeout(() => {
                                            router.push('/farmerscreen/cropcareorders');
                                        }, 2000);
                                    } else {
                                        showNotification('error', verifyResponse.data.message || 'Payment verification failed');
                                    }
                                } catch (error: any) {
                                    console.error('Payment verification error:', error);
                                    showNotification('error', error.response?.data?.message || 'Payment verification error');
                                }
                            }
                        },
                        { text: 'Cancel', style: 'cancel' }
                    ]
                );
            } else {
                showNotification('error', orderResponse.data.message || 'Payment initialization failed');
            }
        } catch (error: any) {
            console.error('Error creating order:', error);
            showNotification('error', error.response?.data?.message || 'Payment initialization failed');
        } finally {
            setLoading(prev => ({ ...prev, payment: false }));
        }
    };

    const goBackToCart = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push("/farmerscreen/cropcarecart");
        }
    };

    const handleAddressChange = (name: keyof ShippingAddress, value: string) => {
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchPincodeData = async (pincode: string) => {
        if (pincode.length !== 6) return;

        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();

            if (data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
                const postOffice = data[0].PostOffice[0];
                setShippingAddress(prev => ({
                    ...prev,
                    state: postOffice.State,
                    district: postOffice.District,
                    taluk: postOffice.Block || postOffice.Division || '',
                    post: postOffice.Name
                }));
            }
        } catch (error) {
            console.error("Error fetching pincode data:", error);
        }
    };

    const handlePincodeChange = (value: string) => {
        setShippingAddress(prev => ({
            ...prev,
            pincode: value
        }));

        if (value.length === 6) {
            fetchPincodeData(value);
        }
    };

    if (loading.auth) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2c5f2d" />
                <Text style={styles.loadingText}>Checking authentication...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Notification */}
            {notification && (
                <Modal
                    transparent
                    visible={!!notification}
                    animationType="slide"
                    onRequestClose={() => setNotification(null)}
                >
                    <View style={styles.notificationContainer}>
                        <View style={[
                            styles.notification,
                            { backgroundColor: notification.type === 'success' ? '#28a745' : '#ff4d4f' }
                        ]}>
                            <Text style={styles.notificationText}>{notification.message}</Text>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerTitle}>🌾 Crop Care Checkout</Text>
                        {user ? (
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>👤 {user.personalInfo.name}</Text>
                                <View style={styles.userRoleContainer}>
                                    <View style={styles.userRoleBadge}>
                                        <Text style={styles.userRoleText}>{user.role}</Text>
                                    </View>
                                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButtonSmall}>
                                        <LogOut size={12} color="white" />
                                        <Text style={styles.logoutTextSmall}>Logout</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity 
                                style={styles.loginPromptHeader}
                                onPress={() => setShowLoginModal(true)}
                            >
                                <User size={16} color="white" />
                                <Text style={styles.loginTextHeader}>Tap to Login</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.main}>
                    {/* Show Login Prompt when not authenticated */}
                    {!user ? (
                        <View style={styles.loginPromptContainer}>
                            <View style={styles.loginPromptIconContainer}>
                                <Text style={styles.loginPromptIcon}>🔒</Text>
                            </View>
                            <Text style={styles.loginPromptTitle}>Login Required</Text>
                            <Text style={styles.loginPromptDescription}>
                                Please login to proceed with checkout
                            </Text>
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => setShowLoginModal(true)}
                            >
                                <Text style={styles.loginButtonText}>Login Now</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            {/* Back to Cart */}
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.push("/farmerscreen/cropcarecart")}
                            >
                                <ArrowLeft size={20} color="#2c5f2d" />
                                <Text style={styles.backButtonText}>Back to Cart</Text>
                            </TouchableOpacity>

                            <Text style={styles.title}>Checkout</Text>

                            {loading.cart ? (
                                <View style={styles.cartLoadingContainer}>
                                    <ActivityIndicator size="large" color="#2c5f2d" />
                                    <Text style={styles.cartLoadingText}>Loading checkout...</Text>
                                </View>
                            ) : (
                                <View style={styles.content}>
                                    {/* Left Section - Shipping & Payment */}
                                    <View style={styles.leftSection}>
                                        {/* Shipping Address */}
                                        <View style={styles.section}>
                                            <View style={styles.sectionTitle}>
                                                <MapPin size={20} color="#333" />
                                                <Text style={styles.sectionTitleText}>Shipping Address</Text>
                                            </View>

                                            <View style={styles.addressToggle}>
                                                <Text style={styles.toggleLabel}>Use my default address</Text>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.toggleSwitch,
                                                        useDefaultAddress && styles.toggleSwitchActive
                                                    ]}
                                                    onPress={() => setUseDefaultAddress(!useDefaultAddress)}
                                                >
                                                    <View style={[
                                                        styles.toggleKnob,
                                                        useDefaultAddress && styles.toggleKnobActive
                                                    ]} />
                                                </TouchableOpacity>
                                            </View>

                                            {!useDefaultAddress ? (
                                                <View>
                                                    <View style={styles.formGroup}>
                                                        <Text style={styles.label}>Full Name *</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={shippingAddress.name}
                                                            onChangeText={(value) => handleAddressChange('name', value)}
                                                            placeholder="Enter full name"
                                                        />
                                                    </View>

                                                    <View style={styles.formGroup}>
                                                        <Text style={styles.label}>Mobile Number *</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={shippingAddress.mobileNo}
                                                            onChangeText={(value) => handleAddressChange('mobileNo', value)}
                                                            placeholder="Enter 10-digit mobile number"
                                                            keyboardType="phone-pad"
                                                            maxLength={10}
                                                        />
                                                    </View>

                                                    <View style={styles.formGroup}>
                                                        <Text style={styles.label}>Address *</Text>
                                                        <TextInput
                                                            style={[styles.input, styles.textarea]}
                                                            value={shippingAddress.address}
                                                            onChangeText={(value) => handleAddressChange('address', value)}
                                                            placeholder="Enter complete address"
                                                            multiline
                                                            numberOfLines={3}
                                                        />
                                                    </View>

                                                    <View style={styles.formGroup}>
                                                        <Text style={styles.label}>Village / Grama Panchayath</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={shippingAddress.villageGramaPanchayat}
                                                            onChangeText={(value) => handleAddressChange('villageGramaPanchayat', value)}
                                                            placeholder="Enter village or grama panchayath"
                                                        />
                                                    </View>

                                                    <View style={styles.formGroup}>
                                                        <Text style={styles.label}>Pincode *</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={shippingAddress.pincode}
                                                            onChangeText={handlePincodeChange}
                                                            placeholder="Enter 6-digit pincode"
                                                            keyboardType="number-pad"
                                                            maxLength={6}
                                                        />
                                                    </View>

                                                    <View style={styles.row}>
                                                        <View style={[styles.formGroup, styles.halfWidth]}>
                                                            <Text style={styles.label}>State *</Text>
                                                            <TextInput
                                                                style={styles.input}
                                                                value={shippingAddress.state}
                                                                onChangeText={(value) => handleAddressChange('state', value)}
                                                                placeholder="Enter state"
                                                            />
                                                        </View>

                                                        <View style={[styles.formGroup, styles.halfWidth]}>
                                                            <Text style={styles.label}>District *</Text>
                                                            <TextInput
                                                                style={styles.input}
                                                                value={shippingAddress.district}
                                                                onChangeText={(value) => handleAddressChange('district', value)}
                                                                placeholder="Enter district"
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={styles.row}>
                                                        <View style={[styles.formGroup, styles.halfWidth]}>
                                                            <Text style={styles.label}>Taluk</Text>
                                                            <TextInput
                                                                style={styles.input}
                                                                value={shippingAddress.taluk}
                                                                onChangeText={(value) => handleAddressChange('taluk', value)}
                                                                placeholder="Enter taluk"
                                                            />
                                                        </View>

                                                        <View style={[styles.formGroup, styles.halfWidth]}>
                                                            <Text style={styles.label}>Post</Text>
                                                            <TextInput
                                                                style={styles.input}
                                                                value={shippingAddress.post}
                                                                onChangeText={(value) => handleAddressChange('post', value)}
                                                                placeholder="Enter post office"
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={styles.formGroup}>
                                                        <Text style={styles.label}>Landmark (Optional)</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={shippingAddress.landmark}
                                                            onChangeText={(value) => handleAddressChange('landmark', value)}
                                                            placeholder="Near temple, school, etc."
                                                        />
                                                    </View>
                                                </View>
                                            ) : user?.personalInfo && (
                                                <View style={styles.defaultAddress}>
                                                    <View style={styles.addressContent}>
                                                        <Home size={20} color="#2c5f2d" />
                                                        <View style={styles.addressDetails}>
                                                            <Text style={styles.addressName}>{user.personalInfo.name}</Text>
                                                            <Text style={styles.addressText}>{user.personalInfo.address}</Text>
                                                            <Text style={styles.addressText}>{user.personalInfo.villageGramaPanchayat}</Text>
                                                            <Text style={styles.addressText}>
                                                                {user.personalInfo.district}, {user.personalInfo.state} - {user.personalInfo.pincode}
                                                            </Text>
                                                            <View style={styles.phoneRow}>
                                                                <Phone size={14} color="#666" />
                                                                <Text style={styles.addressText}>{user.personalInfo.mobileNo}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            )}
                                        </View>

                                        {/* Payment Method */}
                                        <View style={[styles.section, styles.paymentMethods]}>
                                            <View style={styles.sectionTitle}>
                                                <CreditCard size={20} color="#333" />
                                                <Text style={styles.sectionTitleText}>Payment Method</Text>
                                            </View>

                                            <TouchableOpacity
                                                style={[
                                                    styles.paymentOption,
                                                    paymentMethod === 'razorpay' && styles.paymentOptionSelected
                                                ]}
                                                onPress={() => setPaymentMethod('razorpay')}
                                            >
                                                <Text style={styles.paymentIcon}>💳</Text>
                                                <View style={styles.paymentInfo}>
                                                    <Text style={styles.paymentTitle}>Credit/Debit Card, UPI, NetBanking</Text>
                                                    <Text style={styles.paymentDescription}>
                                                        Pay securely with Razorpay. All major cards and UPI accepted.
                                                    </Text>
                                                </View>
                                                {paymentMethod === 'razorpay' && (
                                                    <CheckCircle size={20} color="#2c5f2d" />
                                                )}
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[
                                                    styles.paymentOption,
                                                    paymentMethod === 'cod' && styles.paymentOptionSelected
                                                ]}
                                                onPress={() => setPaymentMethod('cod')}
                                            >
                                                <Text style={styles.paymentIcon}>💰</Text>
                                                <View style={styles.paymentInfo}>
                                                    <Text style={styles.paymentTitle}>Cash on Delivery</Text>
                                                    <Text style={styles.paymentDescription}>
                                                        Pay when you receive your order. Available for all locations.
                                                    </Text>
                                                </View>
                                                {paymentMethod === 'cod' && (
                                                    <CheckCircle size={20} color="#2c5f2d" />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Right Section - Order Summary */}
                                    <View style={styles.rightSection}>
                                        <View style={styles.sectionTitle}>
                                            <Text style={styles.sectionTitleText}>Order Summary</Text>
                                        </View>

                                        {/* Order Items */}
                                        <View style={styles.orderItems}>
                                            {cart.items.map((item) => (
                                                <View key={item._id} style={styles.orderItem}>
                                                    <View style={styles.orderItemName}>
                                                        <Text style={styles.orderItemMainText}>{item.seedName}</Text>
                                                        <Text style={styles.orderItemSubText}>{item.productName}</Text>
                                                    </View>
                                                    <Text style={styles.orderItemQuantity}>
                                                        x{item.quantity}
                                                    </Text>
                                                    <Text style={styles.orderItemPrice}>
                                                        ₹{(item.seedPrice * item.quantity).toFixed(2)}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>

                                        {/* Order Summary */}
                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>Subtotal</Text>
                                            <Text style={styles.summaryValue}>₹{cart.subtotal.toFixed(2)}</Text>
                                        </View>

                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>GST (18%)</Text>
                                            <Text style={styles.summaryValue}>₹{cart.gst.toFixed(2)}</Text>
                                        </View>

                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>Shipping</Text>
                                            <Text style={styles.summaryValue}>
                                                {cart.shipping === 0 ? 'FREE' : `₹${cart.shipping.toFixed(2)}`}
                                            </Text>
                                        </View>

                                        <View style={styles.summaryTotal}>
                                            <Text style={styles.summaryTotalLabel}>Total</Text>
                                            <Text style={styles.summaryTotalValue}>₹{cart.total.toFixed(2)}</Text>
                                        </View>

                                        {/* Place Order Button */}
                                        <TouchableOpacity
                                            style={[
                                                styles.placeOrderButton,
                                                (loading.payment || cart.items.length === 0) && styles.placeOrderButtonDisabled
                                            ]}
                                            onPress={() => router.push('/farmerscreen/cropcareorders')}
                                            disabled={loading.payment || cart.items.length === 0}
                                        >
                                            {loading.payment ? (
                                                <ActivityIndicator color="white" />
                                            ) : (
                                                <Text style={styles.placeOrderButtonText}>
                                                    {paymentMethod === 'cod'
                                                        ? 'Place Order (Cash on Delivery)'
                                                        : 'Pay & Place Order'}
                                                </Text>
                                            )}
                                        </TouchableOpacity>

                                        {/* Security Note */}
                                        <View style={styles.securityNote}>
                                            <Text style={styles.securityNoteText}>🔒 Your payment is secure and encrypted</Text>
                                        </View>
                                    </View>
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
                <View style={styles.loginModalOverlay}>
                    <View style={styles.loginModalContent}>
                        <Text style={styles.loginModalIcon}>🔒</Text>
                        <Text style={styles.loginModalTitle}>Login Required</Text>
                        <Text style={styles.loginModalText}>
                            You need to login to proceed with checkout
                        </Text>
                        <View style={styles.loginModalButtons}>
                            <TouchableOpacity
                                style={[styles.loginModalButton, styles.cancelButton]}
                                onPress={() => {
                                    setShowLoginModal(false);
                                    router.back();
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.loginModalButton, styles.loginButton]}
                                onPress={handleLogin}
                            >
                                <Text style={styles.loginButtonText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
          
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        backgroundColor: '#2c5f2d',
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    headerContent: {
        paddingHorizontal: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    userName: {
        color: 'white',
        fontSize: 16,
    },
    userRoleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    userRoleBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    userRoleText: {
        color: 'white',
        fontSize: 14,
    },
    logoutButtonSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    logoutTextSmall: {
        fontSize: 10,
        color: 'white',
        fontWeight: '600',
    },
    loginPromptHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    loginTextHeader: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    main: {
        padding: 20,
    },
    loginPromptContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
        marginTop: 40,
    },
    loginPromptIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(44, 95, 45, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    loginPromptIcon: {
        fontSize: 60,
        color: '#2c5f2d',
    },
    loginPromptTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    loginPromptDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    loginButton: {
        backgroundColor: '#2c5f2d',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 8,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    backButtonText: {
        color: '#2c5f2d',
        fontWeight: 'bold',
        fontSize: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    cartLoadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    cartLoadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#666',
    },
    content: {
        gap: 30,
    },
    leftSection: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    rightSection: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#2c5f2d',
    },
    sectionTitleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    addressToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    toggleLabel: {
        fontSize: 14,
        color: '#666',
    },
    toggleSwitch: {
        width: 50,
        height: 24,
        backgroundColor: '#ccc',
        borderRadius: 24,
        padding: 4,
    },
    toggleSwitchActive: {
        backgroundColor: '#2c5f2d',
    },
    toggleKnob: {
        width: 16,
        height: 16,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    toggleKnobActive: {
        transform: [{ translateX: 26 }],
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        fontSize: 14,
        color: '#333',
        backgroundColor: '#fff',
    },
    textarea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        gap: 15,
    },
    halfWidth: {
        flex: 1,
    },
    defaultAddress: {
        padding: 20,
        backgroundColor: '#f0fff4',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2c5f2d',
    },
    addressContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 15,
    },
    addressDetails: {
        flex: 1,
    },
    addressName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    addressText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    paymentMethods: {
        marginTop: 30,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        padding: 15,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 15,
    },
    paymentOptionSelected: {
        borderColor: '#2c5f2d',
        backgroundColor: '#f0fff4',
    },
    paymentIcon: {
        fontSize: 24,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    paymentDescription: {
        fontSize: 14,
        color: '#666',
    },
    orderItems: {
        marginBottom: 20,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    orderItemName: {
        flex: 1,
    },
    orderItemMainText: {
        fontSize: 14,
        color: '#333',
    },
    orderItemSubText: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    orderItemQuantity: {
        fontSize: 14,
        color: '#666',
        marginRight: 15,
    },
    orderItemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        minWidth: 80,
        textAlign: 'right',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#666',
    },
    summaryValue: {
        fontSize: 16,
        color: '#666',
    },
    summaryTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 2,
        borderTopColor: '#eaeaea',
    },
    summaryTotalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    summaryTotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    placeOrderButton: {
        width: '100%',
        padding: 16,
        backgroundColor: '#2c5f2d',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
    },
    placeOrderButtonDisabled: {
        backgroundColor: '#ccc',
    },
    placeOrderButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    securityNote: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#fff9f0',
        borderRadius: 6,
    },
    securityNoteText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    notificationContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1001,
    },
    notification: {
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    notificationText: {
        color: 'white',
        fontWeight: 'bold',
    },
    loginModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginModalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '80%',
        alignItems: 'center',
    },
    loginModalIcon: {
        fontSize: 48,
        marginBottom: 16,
        color: '#2c5f2d',
    },
    loginModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    loginModalText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    loginModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
    },
    loginModalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#2c5f2d',
    },
});

export default CropcareCheckout;