// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { ArrowLeft, CheckCircle, CreditCard, Home, LogOut, MapPin, Phone, User as UserIcon } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Modal,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

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
//     farmerId?: string;
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
//         payment: false,
//         auth: true
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
//     const [showLoginModal, setShowLoginModal] = useState(false);

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
//         } else {
//             // Reset cart when user is not authenticated
//             setCart({
//                 items: [],
//                 subtotal: 0,
//                 gst: 0,
//                 shipping: 0,
//                 total: 0
//             });
//         }
//     }, [user, useDefaultAddress]);

//     const checkAuthStatus = async () => {
//         setLoading(prev => ({ ...prev, auth: true }));
//         try {
//             // Check all required authentication items from farmer login
//             const [userData, role, userId, farmerId] = await Promise.all([
//                 AsyncStorage.getItem('userData'),
//                 AsyncStorage.getItem('userRole'),
//                 AsyncStorage.getItem('userId'),
//                 AsyncStorage.getItem('farmerId'),
//             ]);

//             console.log('Checkout Auth check:', { userData, role, userId, farmerId });

//             if (userData && role && userId) {
//                 try {
//                     const parsedUserData = JSON.parse(userData);
                    
//                     const userObj: User = {
//                         _id: userId,
//                         role: role,
//                         personalInfo: {
//                             name: parsedUserData.personalInfo?.name || parsedUserData.name || 'User',
//                             mobileNo: parsedUserData.personalInfo?.mobileNo || parsedUserData.mobileNo || '',
//                             address: parsedUserData.personalInfo?.address,
//                             villageGramaPanchayat: parsedUserData.personalInfo?.villageGramaPanchayat,
//                             pincode: parsedUserData.personalInfo?.pincode,
//                             state: parsedUserData.personalInfo?.state,
//                             district: parsedUserData.personalInfo?.district,
//                             taluk: parsedUserData.personalInfo?.taluk,
//                             post: parsedUserData.personalInfo?.post
//                         }
//                     };

//                     // Add farmerId if available
//                     if (farmerId) {
//                         userObj.farmerId = farmerId;
//                     }

//                     setUser(userObj);
//                     setShowLoginModal(false);
//                     console.log('Checkout User authenticated:', userObj);
//                 } catch (error) {
//                     console.error('Error parsing user data:', error);
//                     setUser(null);
//                     setShowLoginModal(true);
//                 }
//             } else {
//                 console.log('Checkout User not authenticated');
//                 setUser(null);
//                 setShowLoginModal(true);
//             }
//         } catch (error) {
//             console.error('Error checking auth status:', error);
//             setUser(null);
//             setShowLoginModal(true);
//         } finally {
//             setLoading(prev => ({ ...prev, auth: false }));
//         }
//     };

//     const handleLogin = () => {
//         setShowLoginModal(false);
//         router.push('/(auth)/Login?role=farmer');
//     };

//     const handleLogout = async () => {
//         try {
//             await AsyncStorage.clear();
//             setUser(null);
//             setCart({
//                 items: [],
//                 subtotal: 0,
//                 gst: 0,
//                 shipping: 0,
//                 total: 0
//             });
//             setShowLoginModal(true);
//             showNotification('success', 'You have been logged out successfully');
//         } catch (err) {
//             console.error('Logout error:', err);
//             showNotification('error', 'Failed to logout');
//         }
//     };

//     const fetchUserCart = async () => {
//         if (!user) return;

//         setLoading(prev => ({ ...prev, cart: true }));
//         try {
//             // Use farmerId if available, otherwise use userId
//             const idToUse = user.farmerId || user._id;
//             console.log('Fetching cart for checkout with ID:', idToUse);
            
//             const response = await axios.get(`${CART_API_URL}/cart/${idToUse}`);

//             if (response.data.success) {
//                 const cartData = response.data.data;
//                 if (cartData && cartData.items && cartData.items.length > 0) {
//                     setCart(cartData);
//                 } else {
//                     showNotification('error', 'Your cart is empty');
//                     setTimeout(() => router.push('/farmerscreen/cropcarecart'), 1500);
//                 }
//             } else {
//                 showNotification('error', response.data.message || 'Failed to load cart');
//             }
//         } catch (error: any) {
//             console.error('Error fetching cart:', error);
//             showNotification('error', error.response?.data?.message || 'Failed to load cart');
//         } finally {
//             setLoading(prev => ({ ...prev, cart: false }));
//         }
//     };

//     const showNotification = (type: 'success' | 'error', message: string) => {
//         setNotification({ type, message });
//         setTimeout(() => setNotification(null), 3000);
//     };

//     const validateShippingAddress = () => {
//         if (!user) {
//             setShowLoginModal(true);
//             return false;
//         }

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
//         if (!user) {
//             setShowLoginModal(true);
//             return;
//         }

//         if (cart.items.length === 0) {
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
//             // Use farmerId if available, otherwise use userId
//             const idToUse = user.farmerId || user._id;
            
//             // Create Razorpay order
//             const orderResponse = await axios.post(`https://kisan.etpl.ai/api/payment/create-order`, {
//                 userId: idToUse,
//                 amount: cart.total,
//                 currency: 'INR'
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
//                                         paymentMethod: paymentMethod,
//                                         cartItems: cart.items,
//                                         userId: idToUse
//                                     });

//                                     if (verifyResponse.data.success) {
//                                         showNotification('success', 'Payment successful! Order placed.');
//                                         setTimeout(() => {
//                                             router.push('/farmerscreen/cropcareorders');
//                                         }, 2000);
//                                     } else {
//                                         showNotification('error', verifyResponse.data.message || 'Payment verification failed');
//                                     }
//                                 } catch (error: any) {
//                                     console.error('Payment verification error:', error);
//                                     showNotification('error', error.response?.data?.message || 'Payment verification error');
//                                 }
//                             }
//                         },
//                         { text: 'Cancel', style: 'cancel' }
//                     ]
//                 );
//             } else {
//                 showNotification('error', orderResponse.data.message || 'Payment initialization failed');
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
//             router.back();
//         } else {
//             router.push("/farmerscreen/cropcarecart");
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

//     if (loading.auth) {
//         return (
//             <View className="flex-1 justify-center items-center bg-[#f8f9fa]">
//                 <ActivityIndicator size="large" color="#2c5f2d" />
//                 <Text className="mt-3 text-base text-[#666] font-medium">Checking authentication...</Text>
//             </View>
//         );
//     }

//     return (
//         <SafeAreaView className="flex-1 bg-[#f8f9fa]" edges={['top']}>
//             {/* Notification */}
//             {notification && (
//                 <Modal
//                     transparent
//                     visible={!!notification}
//                     animationType="slide"
//                     onRequestClose={() => setNotification(null)}
//                 >
//                     <View className="absolute top-5 right-5 z-[1001]">
//                         <View style={[
//                             { elevation: 5 },
//                             notification.type === 'success' ? { backgroundColor: '#28a745' } : { backgroundColor: '#ff4d4f' }
//                         ]} className="p-[15px] rounded-lg shadow-sm">
//                             <Text className="text-white font-medium">{notification.message}</Text>
//                         </View>
//                     </View>
//                 </Modal>
//             )}

//             {/* Header */}
//             <View className="bg-[#2c5f2d] py-5 shadow-sm elevation-3">
//                 <View className="px-5">
//                     <View className="flex-row justify-between items-center">
//                         <Text className="text-2xl font-medium text-white">🌾 Crop Care Checkout</Text>
//                         {user ? (
//                             <View className="flex-row items-center gap-[15px]">
//                                 <Text className="text-white text-base">👤 {user.personalInfo.name}</Text>
//                                 <View className="flex-row items-center gap-2">
//                                     <View className="bg-white/20 px-3 py-1 rounded-xl">
//                                         <Text className="text-white text-sm">{user.role}</Text>
//                                     </View>
//                                     <TouchableOpacity onPress={handleLogout} className="flex-row items-center bg-white/15 px-2 py-1 rounded-lg gap-1">
//                                         <LogOut size={12} color="white" />
//                                         <Text className="text-[10px] text-white font-medium">Logout</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>
//                         ) : (
//                             <TouchableOpacity 
//                                 className="flex-row items-center bg-white/15 px-4 py-2 rounded-lg gap-1.5"
//                                 onPress={() => setShowLoginModal(true)}
//                             >
//                                 <UserIcon size={16} color="white" />
//                                 <Text className="text-white text-sm font-medium">Tap to Login</Text>
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                 </View>
//             </View>

//             <ScrollView className="flex-1">
//                 <View className="p-5">
//                     {/* Show Login Prompt when not authenticated */}
//                     {!user ? (
//                         <View className="items-center justify-center py-[60px] px-5 mt-10">
//                             <View className="w-[120px] h-[120px] rounded-[60px] bg-[#2c5f2d]/10 justify-center items-center mb-6">
//                                 <Text className="text-[60px] text-[#2c5f2d]">🔒</Text>
//                             </View>
//                             <Text className="text-[22px] font-medium text-[#333] mb-3 text-center">Login Required</Text>
//                             <Text className="text-base text-[#666] text-center mb-8 leading-[22px]">
//                                 Please login to proceed with checkout
//                             </Text>
//                             <TouchableOpacity
//                                 className="bg-[#2c5f2d] px-8 py-3.5 rounded-lg"
//                                 onPress={() => setShowLoginModal(true)}
//                             >
//                                 <Text className="text-white text-base font-medium">Login Now</Text>
//                             </TouchableOpacity>
//                         </View>
//                     ) : (
//                         <>
//                             {/* Back to Cart */}
//                             <TouchableOpacity
//                                 className="flex-row items-center gap-2 mb-5"
//                                 onPress={() => router.push("/farmerscreen/cropcarecart")}
//                             >
//                                 <ArrowLeft size={20} color="#2c5f2d" />
//                                 <Text className="text-[#2c5f2d] font-medium text-base">Back to Cart</Text>
//                             </TouchableOpacity>

//                             <Text className="text-[28px] font-medium text-[#333] mb-[30px]">Checkout</Text>

//                             {loading.cart ? (
//                                 <View className="items-center justify-center py-[60px] px-5">
//                                     <ActivityIndicator size="large" color="#2c5f2d" />
//                                     <Text className="mt-[15px] text-base text-[#666]">Loading checkout...</Text>
//                                 </View>
//                             ) : (
//                                 <View className="gap-[30px]">
//                                     {/* Left Section - Shipping & Payment */}
//                                     <View className="bg-white rounded-xl p-5 shadow-sm elevation-2">
//                                         {/* Shipping Address */}
//                                         <View className="mb-[30px]">
//                                             <View className="flex-row items-center gap-2.5 mb-5 pb-[15px] border-b-2 border-[#2c5f2d]">
//                                                 <MapPin size={20} color="#333" />
//                                                 <Text className="text-xl font-medium text-[#333]">Shipping Address</Text>
//                                             </View>

//                                             <View className="flex-row items-center gap-2.5 mb-5">
//                                                 <Text className="text-sm text-[#666]">Use my default address</Text>
//                                                 <TouchableOpacity
//                                                     className={`w-[50px] h-6 rounded-3xl p-1 ${useDefaultAddress ? 'bg-[#2c5f2d]' : 'bg-[#ccc]'}`}
//                                                     onPress={() => setUseDefaultAddress(!useDefaultAddress)}
//                                                 >
//                                                     <View
//                                                         className={`w-4 h-4 bg-white rounded-full ${useDefaultAddress ? 'translate-x-[26px]' : ''}`}
//                                                     />
//                                                 </TouchableOpacity>
//                                             </View>

//                                             {!useDefaultAddress ? (
//                                                 <View>
//                                                     <View className="mb-5">
//                                                         <Text className="text-sm font-medium text-[#333] mb-2">Full Name *</Text>
//                                                         <TextInput
//                                                             className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
//                                                             value={shippingAddress.name}
//                                                             onChangeText={(value) => handleAddressChange('name', value)}
//                                                             placeholder="Enter full name"
//                                                         />
//                                                     </View>

//                                                     <View className="mb-5">
//                                                         <Text className="text-sm font-medium text-[#333] mb-2">Mobile Number *</Text>
//                                                         <TextInput
//                                                             className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
//                                                             value={shippingAddress.mobileNo}
//                                                             onChangeText={(value) => handleAddressChange('mobileNo', value)}
//                                                             placeholder="Enter 10-digit mobile number"
//                                                             keyboardType="phone-pad"
//                                                             maxLength={10}
//                                                         />
//                                                     </View>

//                                                     <View className="mb-5">
//                                                         <Text className="text-sm font-medium text-[#333] mb-2">Address *</Text>
//                                                         <TextInput
//                                                             className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white min-h-[100px] align-top"
//                                                             value={shippingAddress.address}
//                                                             onChangeText={(value) => handleAddressChange('address', value)}
//                                                             placeholder="Enter complete address"
//                                                             multiline
//                                                             numberOfLines={3}
//                                                             style={{ textAlignVertical: 'top' }}
//                                                         />
//                                                     </View>

//                                                     <View className="mb-5">
//                                                         <Text className="text-sm font-medium text-[#333] mb-2">Village / Grama Panchayath</Text>
//                                                         <TextInput
//                                                             className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
//                                                             value={shippingAddress.villageGramaPanchayat}
//                                                             onChangeText={(value) => handleAddressChange('villageGramaPanchayat', value)}
//                                                             placeholder="Enter village or grama panchayath"
//                                                         />
//                                                     </View>

//                                                     <View className="mb-5">
//                                                         <Text className="text-sm font-medium text-[#333] mb-2">Pincode *</Text>
//                                                         <TextInput
//                                                             className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
//                                                             value={shippingAddress.pincode}
//                                                             onChangeText={handlePincodeChange}
//                                                             placeholder="Enter 6-digit pincode"
//                                                             keyboardType="number-pad"
//                                                             maxLength={6}
//                                                         />
//                                                     </View>

//                                                     <View className="flex-row gap-[15px]">
//                                                         <View className="flex-1 mb-5">
//                                                             <Text className="text-sm font-medium text-[#333] mb-2">State *</Text>
//                                                             <TextInput
//                                                                 className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
//                                                                 value={shippingAddress.state}
//                                                                 onChangeText={(value) => handleAddressChange('state', value)}
//                                                                 placeholder="Enter state"
//                                                             />
//                                                         </View>

//                                                         <View className="flex-1 mb-5">
//                                                             <Text className="text-sm font-medium text-[#333] mb-2">District *</Text>
//                                                             <TextInput
//                                                                 className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
//                                                                 value={shippingAddress.district}
//                                                                 onChangeText={(value) => handleAddressChange('district', value)}
//                                                                 placeholder="Enter district"
//                                                             />
//                                                         </View>
//                                                     </View>

//                                                     <View className="flex-row gap-[15px]">
//                                                         <View className="flex-1 mb-5">
//                                                             <Text className="text-sm font-medium text-[#333] mb-2">Taluk</Text>
//                                                             <TextInput
//                                                                 className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
//                                                                 value={shippingAddress.taluk}
//                                                                 onChangeText={(value) => handleAddressChange('taluk', value)}
//                                                                 placeholder="Enter taluk"
//                                                             />
//                                                         </View>

//                                                         <View className="flex-1 mb-5">
//                                                             <Text className="text-sm font-medium text-[#333] mb-2">Post</Text>
//                                                             <TextInput
//                                                                 className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
//                                                                 value={shippingAddress.post}
//                                                                 onChangeText={(value) => handleAddressChange('post', value)}
//                                                                 placeholder="Enter post office"
//                                                             />
//                                                         </View>
//                                                     </View>

//                                                     <View className="mb-5">
//                                                         <Text className="text-sm font-medium text-[#333] mb-2">Landmark (Optional)</Text>
//                                                         <TextInput
//                                                             className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
//                                                             value={shippingAddress.landmark}
//                                                             onChangeText={(value) => handleAddressChange('landmark', value)}
//                                                             placeholder="Near temple, school, etc."
//                                                         />
//                                                     </View>
//                                                 </View>
//                                             ) : user?.personalInfo && (
//                                                 <View className="p-5 bg-[#f0fff4] rounded-lg border border-[#2c5f2d]">
//                                                     <View className="flex-row items-start gap-[15px]">
//                                                         <Home size={20} color="#2c5f2d" />
//                                                         <View className="flex-1">
//                                                             <Text className="text-base font-medium text-[#333] mb-2.5">{user.personalInfo.name}</Text>
//                                                             <Text className="text-sm text-[#666] mb-1">{user.personalInfo.address}</Text>
//                                                             <Text className="text-sm text-[#666] mb-1">{user.personalInfo.villageGramaPanchayat}</Text>
//                                                             <Text className="text-sm text-[#666] mb-1">
//                                                                 {user.personalInfo.district}, {user.personalInfo.state} - {user.personalInfo.pincode}
//                                                             </Text>
//                                                             <View className="flex-row items-center gap-[5px]">
//                                                                 <Phone size={14} color="#666" />
//                                                                 <Text className="text-sm text-[#666] mb-1">{user.personalInfo.mobileNo}</Text>
//                                                             </View>
//                                                         </View>
//                                                     </View>
//                                                 </View>
//                                             )}
//                                         </View>

//                                         {/* Payment Method */}
//                                         <View className="mt-[30px] mb-7">
//                                             <View className="flex-row items-center gap-2.5 mb-5 pb-[15px] border-b-2 border-[#2c5f2d]">
//                                                 <CreditCard size={20} color="#333" />
//                                                 <Text className="text-xl font-medium text-[#333]">Payment Method</Text>
//                                             </View>

//                                             <TouchableOpacity
//                                                 className={`flex-row items-center gap-[15px] p-[15px] border-2 rounded-lg mb-[15px] ${
//                                                     paymentMethod === 'razorpay' ? 'border-[#2c5f2d] bg-[#f0fff4]' : 'border-[#ddd]'
//                                                 }`}
//                                                 onPress={() => setPaymentMethod('razorpay')}
//                                             >
//                                                 <Text className="text-2xl">💳</Text>
//                                                 <View className="flex-1">
//                                                     <Text className="text-base font-medium text-[#333] mb-[5px]">Credit/Debit Card, UPI, NetBanking</Text>
//                                                     <Text className="text-sm text-[#666]">
//                                                         Pay securely with Razorpay. All major cards and UPI accepted.
//                                                     </Text>
//                                                 </View>
//                                                 {paymentMethod === 'razorpay' && (
//                                                     <CheckCircle size={20} color="#2c5f2d" />
//                                                 )}
//                                             </TouchableOpacity>

//                                             <TouchableOpacity
//                                                 className={`flex-row items-center gap-[15px] p-[15px] border-2 rounded-lg mb-[15px] ${
//                                                     paymentMethod === 'cod' ? 'border-[#2c5f2d] bg-[#f0fff4]' : 'border-[#ddd]'
//                                                 }`}
//                                                 onPress={() => setPaymentMethod('cod')}
//                                             >
//                                                 <Text className="text-2xl">💰</Text>
//                                                 <View className="flex-1">
//                                                     <Text className="text-base font-medium text-[#333] mb-[5px]">Cash on Delivery</Text>
//                                                     <Text className="text-sm text-[#666]">
//                                                         Pay when you receive your order. Available for all locations.
//                                                     </Text>
//                                                 </View>
//                                                 {paymentMethod === 'cod' && (
//                                                     <CheckCircle size={20} color="#2c5f2d" />
//                                                 )}
//                                             </TouchableOpacity>
//                                         </View>
//                                     </View>

//                                     {/* Right Section - Order Summary */}
//                                     <View className="bg-white rounded-xl p-5 shadow-sm elevation-2">
//                                         <View className="flex-row items-center gap-2.5 mb-5 pb-[15px] border-b-2 border-[#2c5f2d]">
//                                             <Text className="text-xl font-medium text-[#333]">Order Summary</Text>
//                                         </View>

//                                         {/* Order Items */}
//                                         <View className="mb-5">
//                                             {cart.items.map((item) => (
//                                                 <View key={item._id} className="flex-row justify-between items-center py-[15px] border-b border-[#eaeaea]">
//                                                     <View className="flex-1">
//                                                         <Text className="text-sm text-[#333]">{item.seedName}</Text>
//                                                         <Text className="text-xs text-[#999] mt-0.5">{item.productName}</Text>
//                                                     </View>
//                                                     <Text className="text-sm text-[#666] mr-[15px]">
//                                                         x{item.quantity}
//                                                     </Text>
//                                                     <Text className="text-sm font-medium text-[#333] min-w-[80px] text-right">
//                                                         ₹{(item.seedPrice * item.quantity).toFixed(2)}
//                                                     </Text>
//                                                 </View>
//                                             ))}
//                                         </View>

//                                         {/* Order Summary */}
//                                         <View className="flex-row justify-between mb-[15px]">
//                                             <Text className="text-base text-[#666]">Subtotal</Text>
//                                             <Text className="text-base text-[#666]">₹{cart.subtotal.toFixed(2)}</Text>
//                                         </View>

//                                         <View className="flex-row justify-between mb-[15px]">
//                                             <Text className="text-base text-[#666]">GST (18%)</Text>
//                                             <Text className="text-base text-[#666]">₹{cart.gst.toFixed(2)}</Text>
//                                         </View>

//                                         <View className="flex-row justify-between mb-[15px]">
//                                             <Text className="text-base text-[#666]">Shipping</Text>
//                                             <Text className="text-base text-[#666]">
//                                                 {cart.shipping === 0 ? 'FREE' : `₹${cart.shipping.toFixed(2)}`}
//                                             </Text>
//                                         </View>

//                                         <View className="flex-row justify-between mt-5 pt-5 border-t-2 border-[#eaeaea]">
//                                             <Text className="text-lg font-medium text-[#333]">Total</Text>
//                                             <Text className="text-lg font-medium text-[#333]">₹{cart.total.toFixed(2)}</Text>
//                                         </View>

//                                         {/* Place Order Button */}
//                                         <TouchableOpacity
//                                             className={`w-full p-4 rounded-lg items-center justify-center mt-[25px] ${
//                                                 loading.payment || cart.items.length === 0 ? 'bg-[#ccc]' : 'bg-[#2c5f2d]'
//                                             }`}
//                                             onPress={initiatePayment}
//                                             disabled={loading.payment || cart.items.length === 0}
//                                         >
//                                             {loading.payment ? (
//                                                 <ActivityIndicator color="white" />
//                                             ) : (
//                                                 <Text className="text-lg font-medium text-white">
//                                                     {paymentMethod === 'cod'
//                                                         ? 'Place Order (Cash on Delivery)'
//                                                         : 'Pay & Place Order'}
//                                                 </Text>
//                                             )}
//                                         </TouchableOpacity>

//                                         {/* Security Note */}
//                                         <View className="mt-[15px] p-2.5 bg-[#fff9f0] rounded-md">
//                                             <Text className="text-xs text-[#666] text-center">🔒 Your payment is secure and encrypted</Text>
//                                         </View>
//                                     </View>
//                                 </View>
//                             )}
//                         </>
//                     )}
//                 </View>
//             </ScrollView>

//             {/* Login Modal */}
//             <Modal
//                 visible={showLoginModal}
//                 transparent={true}
//                 animationType="slide"
//                 onRequestClose={() => setShowLoginModal(false)}
//             >
//                 <View className="flex-1 bg-black/50 justify-center items-center">
//                     <View className="bg-white rounded-2xl p-6 w-[80%] items-center">
//                         <Text className="text-5xl mb-4 text-[#2c5f2d]">🔒</Text>
//                         <Text className="text-xl font-medium text-[#333] mb-2 text-center">Login Required</Text>
//                         <Text className="text-base text-[#666] text-center mb-6 leading-[22px]">
//                             You need to login to proceed with checkout
//                         </Text>
//                         <View className="flex-row justify-between w-full gap-3">
//                             <TouchableOpacity
//                                 className="flex-1 py-3 rounded-lg items-center bg-[#e0e0e0]"
//                                 onPress={() => {
//                                     setShowLoginModal(false);
//                                     router.back();
//                                 }}
//                             >
//                                 <Text className="text-[#333] font-medium text-base">Cancel</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 className="flex-1 py-3 rounded-lg items-center bg-[#2c5f2d]"
//                                 onPress={handleLogin}
//                             >
//                                 <Text className="text-white font-medium text-base">Login</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
          
//         </SafeAreaView>

//     );
// };

// export default CropcareCheckout;








import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, CreditCard, Home, LogOut, MapPin, Phone, User as UserIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
// ✅ FIXED IMPORT - Use default import for React Native Razorpay
import RazorpayCheckout from 'react-native-razorpay';
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
            const idToUse = user.farmerId || user._id;
            console.log('Fetching cart for checkout with ID:', idToUse);
            
            const response = await axios.get(`${CART_API_URL}/cart/${idToUse}`);

            if (response.data.success) {
                const cartData = response.data.data;
                if (cartData && cartData.items && cartData.items.length > 0) {
                    setCart(cartData);
                } else {
                    showNotification('error', 'Your cart is empty');
                    setTimeout(() => router.push('/(farmerscreen)/cropcarecart'), 1500);
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

    // ✅ FIXED RAZORPAY PAYMENT FUNCTION
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

        // ✅ Cash on Delivery Flow
        if (paymentMethod === 'cod') {
            setLoading(prev => ({ ...prev, payment: true }));
            try {
                const idToUse = user.farmerId || user._id;
                
                const codOrderResponse = await axios.post(`https://kisan.etpl.ai/api/cropcare/orders`, {
                    userId: idToUse,
                    shippingAddress: shippingAddress,
                    paymentMethod: 'cod',
                    cartItems: cart.items,
                    amount: cart.total,
                    subtotal: cart.subtotal,
                    gst: cart.gst,
                    shipping: cart.shipping,
                    total: cart.total
                });

                if (codOrderResponse.data.success) {
                    showNotification('success', 'Order placed successfully! Cash on Delivery selected.');
                    setTimeout(() => {
                        router.push('/(farmerscreen)/cropcareorders');
                    }, 2000);
                } else {
                    showNotification('error', codOrderResponse.data.message || 'Failed to place order');
                }
            } catch (error: any) {
                console.error('COD order error:', error);
                showNotification('error', error.response?.data?.message || 'Failed to place order');
            } finally {
                setLoading(prev => ({ ...prev, payment: false }));
            }
            return;
        }

        // ✅ RAZORPAY PAYMENT FLOW (FIXED WITH NULL CHECK)
        setLoading(prev => ({ ...prev, payment: true }));
        try {
            // ✅ Check if Razorpay module is available
            if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
                Alert.alert(
                    'Payment Unavailable',
                    'Razorpay payment gateway is not available. Please use Cash on Delivery or contact support.',
                    [
                        { text: 'Use COD', onPress: () => setPaymentMethod('cod') },
                        { text: 'Cancel', style: 'cancel' }
                    ]
                );
                setLoading(prev => ({ ...prev, payment: false }));
                return;
            }

            const idToUse = user.farmerId || user._id;
            
            // Step 1: Create Razorpay order on backend
            const orderResponse = await axios.post(`https://kisan.etpl.ai/api/payment/create-order`, {
                userId: idToUse,
                amount: cart.total,
                currency: 'INR'
            });

            if (!orderResponse.data.success) {
                showNotification('error', orderResponse.data.message || 'Payment initialization failed');
                setLoading(prev => ({ ...prev, payment: false }));
                return;
            }

            const { orderId, amount, currency, key } = orderResponse.data.data;

            // Step 2: Prepare Razorpay options
            const options = {
                description: 'Crop Care Seeds & Products',
                image: 'https://kisan.etpl.ai/logo.png',
                currency: currency,
                key: key,
                amount: amount.toString(), // ✅ Ensure it's a string
                order_id: orderId,
                name: '🌾 Kisan Crop Care',
                prefill: {
                    email: '',
                    contact: shippingAddress.mobileNo,
                    name: shippingAddress.name
                },
                theme: {
                    color: '#2c5f2d'
                }
            };

            console.log('Opening Razorpay with options:', options);

            // Step 3: Open Razorpay Checkout
            RazorpayCheckout.open(options)
                .then(async (data: any) => {
                    // ✅ Payment Success
                    console.log('✅ Payment Success:', data);
                    
                    try {
                        const verifyResponse = await axios.post(`https://kisan.etpl.ai/api/payment/verify`, {
                            razorpay_order_id: data.razorpay_order_id,
                            razorpay_payment_id: data.razorpay_payment_id,
                            razorpay_signature: data.razorpay_signature,
                            shippingAddress: shippingAddress,
                            paymentMethod: 'razorpay',
                            cartItems: cart.items,
                            userId: idToUse,
                            subtotal: cart.subtotal,
                            gst: cart.gst,
                            shipping: cart.shipping,
                            total: cart.total
                        });

                        if (verifyResponse.data.success) {
                            showNotification('success', 'Payment successful! Order placed.');
                            setTimeout(() => {
                                router.push('/(farmerscreen)/cropcareorders');
                            }, 2000);
                        } else {
                            showNotification('error', verifyResponse.data.message || 'Payment verification failed');
                        }
                    } catch (error: any) {
                        console.error('Payment verification error:', error);
                        showNotification('error', error.response?.data?.message || 'Payment verification failed');
                    } finally {
                        setLoading(prev => ({ ...prev, payment: false }));
                    }
                })
                .catch((error: any) => {
                    // ❌ Payment Failed/Cancelled
                    console.log('❌ Payment Error:', error);
                    
                    setLoading(prev => ({ ...prev, payment: false }));
                    
                    if (error.code === 0) {
                        showNotification('error', 'Payment cancelled by user');
                    } else if (error.code === 2) {
                        showNotification('error', 'Network error. Please check your connection.');
                    } else {
                        showNotification('error', error.description || 'Payment failed. Please try again.');
                    }
                });

        } catch (error: any) {
            console.error('Error creating Razorpay order:', error);
            showNotification('error', error.response?.data?.message || 'Payment initialization failed');
            setLoading(prev => ({ ...prev, payment: false }));
        }
    };

    const goBackToCart = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push("/(farmerscreen)/cropcarecart");
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
            <View className="flex-1 justify-center items-center bg-[#f8f9fa]">
                <ActivityIndicator size="large" color="#2c5f2d" />
                <Text className="mt-3 text-base text-[#666] font-medium">Checking authentication...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Notification */}
            {notification && (
                <Modal
                    transparent
                    visible={!!notification}
                    animationType="slide"
                    onRequestClose={() => setNotification(null)}
                >
                    <View className="absolute top-5 right-5 z-[1001]">
                        <View style={[
                            { elevation: 5 },
                            notification.type === 'success' ? { backgroundColor: '#28a745' } : { backgroundColor: '#ff4d4f' }
                        ]} className="p-[15px] rounded-lg shadow-sm">
                            <Text className="text-white font-medium">{notification.message}</Text>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Header */}
            <View className="bg-white py-5 shadow-sm elevation-3">
                <View className="px-5">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-2xl font-medium text-black">Crop Care Checkout</Text>
                      
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1">
                <View className="p-5">
                    {!user ? (
                        <View className="items-center justify-center py-[60px] px-5 mt-10">
                            <View className="w-[120px] h-[120px] rounded-[60px] bg-[#2c5f2d]/10 justify-center items-center mb-6">
                                <Text className="text-[60px] text-[#2c5f2d]">🔒</Text>
                            </View>
                            <Text className="text-[22px] font-medium text-[#333] mb-3 text-center">Login Required</Text>
                            <Text className="text-base text-[#666] text-center mb-8 leading-[22px]">
                                Please login to proceed with checkout
                            </Text>
                            <TouchableOpacity
                                className="bg-[#2c5f2d] px-8 py-3.5 rounded-lg"
                                onPress={() => setShowLoginModal(true)}
                            >
                                <Text className="text-white text-base font-medium">Login Now</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity
                                className="flex-row items-center gap-2 mb-5"
                                onPress={() => router.push("/(farmerscreen)/cropcarecart")}
                            >
                                <ArrowLeft size={20} color="#2c5f2d" />
                                <Text className="text-[#2c5f2d] font-medium text-base">Back to Cart</Text>
                            </TouchableOpacity>

                            {loading.cart ? (
                                <View className="items-center justify-center py-[60px] px-5">
                                    <ActivityIndicator size="large" color="#2c5f2d" />
                                    <Text className="mt-[15px] text-base text-[#666]">Loading checkout...</Text>
                                </View>
                            ) : (
                                <View className="gap-[30px]">
                                    {/* Shipping Address Section */}
                                    <View className="bg-white rounded-xl p-5 shadow-sm elevation-2">
                                        <View className="mb-[30px]">
                                            <View className="flex-row items-center gap-2.5 mb-5 pb-[15px] border-b-2 border-[#2c5f2d]">
                                                <MapPin size={20} color="#333" />
                                                <Text className="text-xl font-medium text-[#333]">Shipping Address</Text>
                                            </View>

                                            <View className="flex-row items-center gap-2.5 mb-5">
                                                <Text className="text-sm text-[#666]">Use my default address</Text>
                                                <TouchableOpacity
                                                    className={`w-[50px] h-6 rounded-3xl p-1 ${useDefaultAddress ? 'bg-[#2c5f2d]' : 'bg-[#ccc]'}`}
                                                    onPress={() => setUseDefaultAddress(!useDefaultAddress)}
                                                >
                                                    <View
                                                        className={`w-4 h-4 bg-white rounded-full ${useDefaultAddress ? 'translate-x-[26px]' : ''}`}
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                            {!useDefaultAddress ? (
                                                <View>
                                                    <View className="mb-5">
                                                        <Text className="text-sm font-medium text-[#333] mb-2">Full Name *</Text>
                                                        <TextInput
                                                            className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
                                                            value={shippingAddress.name}
                                                            onChangeText={(value) => handleAddressChange('name', value)}
                                                            placeholder="Enter full name"
                                                        />
                                                    </View>

                                                    <View className="mb-5">
                                                        <Text className="text-sm font-medium text-[#333] mb-2">Mobile Number *</Text>
                                                        <TextInput
                                                            className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
                                                            value={shippingAddress.mobileNo}
                                                            onChangeText={(value) => handleAddressChange('mobileNo', value)}
                                                            placeholder="Enter 10-digit mobile number"
                                                            keyboardType="phone-pad"
                                                            maxLength={10}
                                                        />
                                                    </View>

                                                    <View className="mb-5">
                                                        <Text className="text-sm font-medium text-[#333] mb-2">Address *</Text>
                                                        <TextInput
                                                            className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white min-h-[100px] align-top"
                                                            value={shippingAddress.address}
                                                            onChangeText={(value) => handleAddressChange('address', value)}
                                                            placeholder="Enter complete address"
                                                            multiline
                                                            numberOfLines={3}
                                                            style={{ textAlignVertical: 'top' }}
                                                        />
                                                    </View>

                                                    <View className="mb-5">
                                                        <Text className="text-sm font-medium text-[#333] mb-2">Village / Grama Panchayath</Text>
                                                        <TextInput
                                                            className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
                                                            value={shippingAddress.villageGramaPanchayat}
                                                            onChangeText={(value) => handleAddressChange('villageGramaPanchayat', value)}
                                                            placeholder="Enter village or grama panchayath"
                                                        />
                                                    </View>

                                                    <View className="mb-5">
                                                        <Text className="text-sm font-medium text-[#333] mb-2">Pincode *</Text>
                                                        <TextInput
                                                            className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
                                                            value={shippingAddress.pincode}
                                                            onChangeText={handlePincodeChange}
                                                            placeholder="Enter 6-digit pincode"
                                                            keyboardType="number-pad"
                                                            maxLength={6}
                                                        />
                                                    </View>

                                                    <View className="flex-row gap-[15px]">
                                                        <View className="flex-1 mb-5">
                                                            <Text className="text-sm font-medium text-[#333] mb-2">State *</Text>
                                                            <TextInput
                                                                className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
                                                                value={shippingAddress.state}
                                                                onChangeText={(value) => handleAddressChange('state', value)}
                                                                placeholder="Enter state"
                                                            />
                                                        </View>

                                                        <View className="flex-1 mb-5">
                                                            <Text className="text-sm font-medium text-[#333] mb-2">District *</Text>
                                                            <TextInput
                                                                className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
                                                                value={shippingAddress.district}
                                                                onChangeText={(value) => handleAddressChange('district', value)}
                                                                placeholder="Enter district"
                                                            />
                                                        </View>
                                                    </View>

                                                    <View className="flex-row gap-[15px]">
                                                        <View className="flex-1 mb-5">
                                                            <Text className="text-sm font-medium text-[#333] mb-2">Taluk</Text>
                                                            <TextInput
                                                                className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
                                                                value={shippingAddress.taluk}
                                                                onChangeText={(value) => handleAddressChange('taluk', value)}
                                                                placeholder="Enter taluk"
                                                            />
                                                        </View>

                                                        <View className="flex-1 mb-5">
                                                            <Text className="text-sm font-medium text-[#333] mb-2">Post</Text>
                                                            <TextInput
                                                                className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
                                                                value={shippingAddress.post}
                                                                onChangeText={(value) => handleAddressChange('post', value)}
                                                                placeholder="Enter post office"
                                                            />
                                                        </View>
                                                    </View>

                                                    <View className="mb-5">
                                                        <Text className="text-sm font-medium text-[#333] mb-2">Landmark (Optional)</Text>
                                                        <TextInput
                                                            className="w-full p-3 border border-[#ddd] rounded-lg text-sm text-[#333] bg-white"
                                                            value={shippingAddress.landmark}
                                                            onChangeText={(value) => handleAddressChange('landmark', value)}
                                                            placeholder="Near temple, school, etc."
                                                        />
                                                    </View>
                                                </View>
                                            ) : user?.personalInfo && (
                                                <View className="p-5 bg-white rounded-lg border border-[#2c5f2d]">
                                                    <View className="flex-row items-start gap-[15px]">
                                                        <Home size={20} color="#2c5f2d" />
                                                        <View className="flex-1">
                                                            <Text className="text-base font-medium text-[#333] mb-2.5">{user.personalInfo.name}</Text>
                                                            <Text className="text-sm text-[#666] mb-1">{user.personalInfo.address}</Text>
                                                            <Text className="text-sm text-[#666] mb-1">{user.personalInfo.villageGramaPanchayat}</Text>
                                                            <Text className="text-sm text-[#666] mb-1">
                                                                {user.personalInfo.district}, {user.personalInfo.state} - {user.personalInfo.pincode}
                                                            </Text>
                                                            <View className="flex-row items-center gap-[5px]">
                                                                <Phone size={14} color="#666" />
                                                                <Text className="text-sm text-[#666] mb-1">{user.personalInfo.mobileNo}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            )}
                                        </View>

                                        {/* Payment Method */}
                                        <View className="mt-[30px] mb-7">
                                            <View className="flex-row items-center gap-2.5 mb-5 pb-[15px] border-b-2 border-[#2c5f2d]">
                                                <CreditCard size={20} color="#333" />
                                                <Text className="text-xl font-medium text-[#333]">Payment Method</Text>
                                            </View>

                                            <TouchableOpacity
                                                className={`flex-row items-center gap-[15px] p-[15px] border rounded-lg mb-[15px] ${
                                                    paymentMethod === 'razorpay' ? 'border-[#2c5f2d] bg-white' : 'border-[#ddd]'
                                                }`}
                                                onPress={() => setPaymentMethod('razorpay')}
                                            >
                                                <Text className="text-2xl">💳</Text>
                                                <View className="flex-1">
                                                    <Text className="text-base font-medium text-[#333] mb-[5px]">Credit/Debit Card, UPI, NetBanking</Text>
                                                    <Text className="text-sm text-[#666]">
                                                        Pay securely with Razorpay. All major cards and UPI accepted.
                                                    </Text>
                                                </View>
                                                {paymentMethod === 'razorpay' && (
                                                    <CheckCircle size={20} color="#2c5f2d" />
                                                )}
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                className={`flex-row items-center gap-[15px] p-[15px] border rounded-lg mb-[15px] ${
                                                    paymentMethod === 'cod' ? 'border-[#2c5f2d] bg-white' : 'border-[#ddd]'
                                                }`}
                                                onPress={() => setPaymentMethod('cod')}
                                            >
                                                <Text className="text-2xl">💰</Text>
                                                <View className="flex-1">
                                                    <Text className="text-base font-medium text-[#333] mb-[5px]">Cash on Delivery</Text>
                                                    <Text className="text-sm text-[#666]">
                                                        Pay when you receive your order. Available for all locations.
                                                    </Text>
                                                </View>
                                                {paymentMethod === 'cod' && (
                                                    <CheckCircle size={20} color="#2c5f2d" />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Order Summary */}
                                    <View className="bg-white rounded-xl p-5 shadow-sm elevation-2">
                                        <View className="flex-row items-center gap-2.5 mb-5 pb-[15px] border-b-2 border-[#2c5f2d]">
                                            <Text className="text-xl font-medium text-[#333]">Order Summary</Text>
                                        </View>

                                        <View className="mb-5">
                                            {cart.items.map((item) => (
                                                <View key={item._id} className="flex-row justify-between items-center py-[15px] border-b border-[#eaeaea]">
                                                    <View className="flex-1">
                                                        <Text className="text-sm text-[#333]">{item.seedName}</Text>
                                                        <Text className="text-xs text-[#999] mt-0.5">{item.productName}</Text>
                                                    </View>
                                                    <Text className="text-sm text-[#666] mr-[15px]">
                                                        x{item.quantity}
                                                    </Text>
                                                    <Text className="text-sm font-medium text-[#333] min-w-[80px] text-right">
                                                        ₹{(item.seedPrice * item.quantity).toFixed(2)}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>

                                        <View className="flex-row justify-between mb-[15px]">
                                            <Text className="text-base text-[#666]">Subtotal</Text>
                                            <Text className="text-base text-[#666]">₹{cart.subtotal.toFixed(2)}</Text>
                                        </View>

                                        <View className="flex-row justify-between mb-[15px]">
                                            <Text className="text-base text-[#666]">GST (18%)</Text>
                                            <Text className="text-base text-[#666]">₹{cart.gst.toFixed(2)}</Text>
                                        </View>

                                        <View className="flex-row justify-between mb-[15px]">
                                            <Text className="text-base text-[#666]">Shipping</Text>
                                            <Text className="text-base text-[#666]">
                                                {cart.shipping === 0 ? 'FREE' : `₹${cart.shipping.toFixed(2)}`}
                                            </Text>
                                        </View>

                                        <View className="flex-row justify-between mt-5 pt-5 border-t-2 border-[#eaeaea]">
                                            <Text className="text-lg font-medium text-[#333]">Total</Text>
                                            <Text className="text-lg font-medium text-[#333]">₹{cart.total.toFixed(2)}</Text>
                                        </View>

                                        <TouchableOpacity
                                            className={`w-full p-4 rounded-lg items-center justify-center mt-[25px] ${
                                                loading.payment || cart.items.length === 0 ? 'bg-[#ccc]' : 'bg-[#2c5f2d]'
                                            }`}
                                            onPress={initiatePayment}
                                            disabled={loading.payment || cart.items.length === 0}
                                        >
                                            {loading.payment ? (
                                                <ActivityIndicator color="white" />
                                            ) : (
                                                <Text className="text-lg font-medium text-white">
                                                    {paymentMethod === 'cod'
                                                        ? 'Place Order (Cash on Delivery)'
                                                        : 'Pay & Place Order'}
                                                </Text>
                                            )}
                                        </TouchableOpacity>

                                        <View className="mt-[15px] p-2.5 bg-[#fff9f0] rounded-md">
                                            <Text className="text-xs text-[#666] text-center">🔒 Your payment is secure and encrypted</Text>
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
                <View className="flex-1 bg-black/50 justify-center items-center">
                    <View className="bg-white rounded-2xl p-6 w-[80%] items-center">
                        <Text className="text-5xl mb-4 text-[#2c5f2d]">🔒</Text>
                        <Text className="text-xl font-medium text-[#333] mb-2 text-center">Login Required</Text>
                        <Text className="text-base text-[#666] text-center mb-6 leading-[22px]">
                            You need to login to proceed with checkout
                        </Text>
                        <View className="flex-row justify-between w-full gap-3">
                            <TouchableOpacity
                                className="flex-1 py-3 rounded-lg items-center bg-[#e0e0e0]"
                                onPress={() => {
                                    setShowLoginModal(false);
                                    router.back();
                                }}
                            >
                                <Text className="text-[#333] font-medium text-base">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 py-3 rounded-lg items-center bg-[#2c5f2d]"
                                onPress={handleLogin}
                            >
                                <Text className="text-white font-medium text-base">Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default CropcareCheckout;