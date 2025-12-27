
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   Image,
//   Alert,
//   StatusBar,
//   ActivityIndicator,
//   Dimensions,
//   FlatList
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   Package,
//   CheckCircle,
//   Clock,
//   XCircle,
//   ArrowLeft,
//   Filter,
//   Calendar,
//   DollarSign,
//   User,
//   ChevronRight,
//   Download,
//   ShoppingCart,
//   MapPin,
//   CreditCard,
//   FileText,
//   X
// } from 'lucide-react-native';
// import axios from 'axios';

// // Define types
// interface OrderItem {
//   seedName: string;
//   seedPrice: number;
//   quantity: number;
//   image?: string;
// }

// interface ShippingAddress {
//   name: string;
//   mobileNo: string;
//   address: string;
//   villageGramaPanchayat?: string;
//   pincode: string;
//   state: string;
//   district: string;
//   taluk?: string;
//   post?: string;
// }

// interface PaymentInfo {
//   method: 'razorpay' | 'cod';
//   status: 'pending' | 'completed' | 'failed';
//   amount: number;
//   razorpayOrderId?: string;
//   razorpayPaymentId?: string;
// }

// interface Order {
//   _id: string;
//   orderId: string;
//   userId: string;
//   items: OrderItem[];
//   shippingAddress: ShippingAddress;
//   payment: PaymentInfo;
//   orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   subtotal: number;
//   gst: number;
//   shipping: number;
//   total: number;
//   createdAt: string;
//   updatedAt: string;
// }

// interface User {
//   _id: string;
//   personalInfo: {
//     name: string;
//     mobileNo: string;
//   };
//   role: string;
// }

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// const CropcareOrders: React.FC = () => {
//   const router = useRouter();
  
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState({
//     orders: false,
//   });
//   const [filter, setFilter] = useState<string>('all');
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   useEffect(() => {
//     if (user) {
//       fetchUserOrders();
//     }
//   }, [user, filter]);

//   const checkAuthStatus = async () => {
//     try {
//       const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
//       const userRole = await AsyncStorage.getItem('role');
//       const userData = await AsyncStorage.getItem('userData');

//       if (isLoggedIn === 'true' && userRole && userData) {
//         try {
//           const parsedUserData = JSON.parse(userData);
//           const userId = await AsyncStorage.getItem('userId') || parsedUserData._id || parsedUserData.id;
//           const phone = await AsyncStorage.getItem('phone') || '';
          
//           setUser({
//             _id: userId,
//             personalInfo: {
//               name: parsedUserData.personalInfo?.name || parsedUserData.name || 'User',
//               mobileNo: parsedUserData.mobileNo || phone || '',
//             },
//             role: userRole
//           });
//         } catch (error) {
//           console.error('Error parsing user data:', error);
//           router.push('/(login)/Login');
//         }
//       } else {
//         router.push('/(login)/Login');
//       }
//     } catch (error) {
//       console.error('Error reading from AsyncStorage:', error);
//       router.push('/(login)/Login');
//     }
//   };

//   const fetchUserOrders = async () => {
//     if (!user) return;
    
//     setLoading(prev => ({ ...prev, orders: true }));
//     try {
//       const response = await axios.get(`https://kisan.etpl.ai/api/payment/orders/${user._id}`);
      
//       if (response.data.success) {
//         let filteredOrders = response.data.data;
        
//         if (filter !== 'all') {
//           filteredOrders = filteredOrders.filter((order: Order) => 
//             filter === 'pending' ? order.orderStatus === 'pending' :
//             filter === 'delivered' ? order.orderStatus === 'delivered' :
//             filter === 'cancelled' ? order.orderStatus === 'cancelled' : true
//           );
//         }
        
//         setOrders(filteredOrders);
//       }
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       Alert.alert('Error', 'Failed to fetch orders. Please try again.');
//     } finally {
//       setLoading(prev => ({ ...prev, orders: false }));
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchUserOrders();
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending': return '#f59e0b';
//       case 'confirmed': return '#3b82f6';
//       case 'processing': return '#8b5cf6';
//       case 'shipped': return '#10b981';
//       case 'delivered': return '#059669';
//       case 'cancelled': return '#ef4444';
//       default: return '#6b7280';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     const iconSize = 16;
//     const color = getStatusColor(status);
//     switch (status) {
//       case 'delivered': return <CheckCircle size={iconSize} color={color} />;
//       case 'shipped': return <Package size={iconSize} color={color} />;
//       case 'cancelled': return <XCircle size={iconSize} color={color} />;
//       default: return <Clock size={iconSize} color={color} />;
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const goBackToShop = () => {
//     router.push('/transporterpages/cropcare');
//   };

//   const viewOrderDetails = (order: Order) => {
//     setSelectedOrder(order);
//     setModalVisible(true);
//   };

//   const closeOrderDetails = () => {
//     setModalVisible(false);
//     setTimeout(() => setSelectedOrder(null), 300);
//   };

//   const downloadInvoice = (order: Order) => {
//     Alert.alert('Download Invoice', `Invoice for ${order.orderId} would be downloaded`);
//   };

//   const cancelOrder = (orderId: string) => {
//     Alert.alert(
//       'Cancel Order',
//       'Are you sure you want to cancel this order?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel'
//         },
//         {
//           text: 'Yes, Cancel',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               // Call API to cancel order
//               Alert.alert('Success', 'Order cancellation request sent');
//             } catch (error) {
//               Alert.alert('Error', 'Failed to cancel order');
//             }
//           }
//         }
//       ]
//     );
//   };

//   const reorder = (order: Order) => {
//     Alert.alert('Reorder', 'Items added to cart for reorder');
//     router.push('/transporterpages/cropcarecart');
//   };

//   const renderFilterButton = (filterType: string, label: string, icon: React.ReactNode) => {
//     const isActive = filter === filterType;
//     return (
//       <TouchableOpacity
//         style={[
//           styles.filterButton,
//           isActive && styles.filterButtonActive
//         ]}
//         onPress={() => setFilter(filterType)}
//       >
//         {icon}
//         <Text style={[
//           styles.filterButtonText,
//           isActive && styles.filterButtonTextActive
//         ]}>
//           {label}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   const renderOrderItem = (item: OrderItem, index: number) => (
//     <View key={index} style={styles.orderItem}>
//       <View style={styles.itemImageContainer}>
//         {item.image ? (
//           <Image 
//             source={{ uri: item.image }} 
//             style={styles.itemImage}
//             resizeMode="cover"
//           />
//         ) : (
//           <View style={styles.itemImagePlaceholder}>
//             <Text style={styles.itemImagePlaceholderText}>🌱</Text>
//           </View>
//         )}
//       </View>
//       <View style={styles.itemDetails}>
//         <Text style={styles.itemName} numberOfLines={2}>{item.seedName}</Text>
//         <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
//       </View>
//       <Text style={styles.itemPrice}>
//         ₹{(item.seedPrice * item.quantity).toFixed(2)}
//       </Text>
//     </View>
//   );

//   const renderOrderCard = ({ item }: { item: Order }) => (
//     <TouchableOpacity 
//       style={styles.orderCard}
//       onPress={() => viewOrderDetails(item)}
//       activeOpacity={0.7}
//     >
//       <View style={styles.orderHeader}>
//         <View style={styles.orderInfo}>
//           <Text style={styles.orderId}>{item.orderId}</Text>
//           <View style={styles.orderDateContainer}>
//             <Calendar size={14} color="#666" />
//             <Text style={styles.orderDateText}>{formatDate(item.createdAt)}</Text>
//           </View>
//         </View>
//         <View style={[
//           styles.orderStatusContainer,
//           { backgroundColor: `${getStatusColor(item.orderStatus)}20` }
//         ]}>
//           {getStatusIcon(item.orderStatus)}
//           <Text style={[
//             styles.orderStatusText,
//             { color: getStatusColor(item.orderStatus) }
//           ]}>
//             {item.orderStatus.charAt(0).toUpperCase() + item.orderStatus.slice(1)}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.orderItems}>
//         {item.items.map((orderItem, index) => renderOrderItem(orderItem, index))}
//       </View>

//       <View style={styles.orderFooter}>
//         <View style={styles.orderTotalContainer}>
//           <DollarSign size={16} color="#333" />
//           <Text style={styles.orderTotalText}>Total: ₹{item.total.toFixed(2)}</Text>
//         </View>
//         <View style={styles.orderActions}>
//           <TouchableOpacity
//             style={[styles.actionButton, styles.viewDetailsButton]}
//             onPress={() => viewOrderDetails(item)}
//           >
//             <Text style={styles.viewDetailsButtonText}>View Details</Text>
//             <ChevronRight size={14} color="#fff" />
//           </TouchableOpacity>
//           {(item.orderStatus === 'pending' || item.orderStatus === 'processing') && (
//             <TouchableOpacity
//               style={[styles.actionButton, styles.cancelButton]}
//               onPress={() => cancelOrder(item._id)}
//             >
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           )}
//           {item.orderStatus === 'delivered' && (
//             <TouchableOpacity
//               style={[styles.actionButton, styles.reorderButton]}
//               onPress={() => reorder(item)}
//             >
//               <ShoppingCart size={14} color="#2c5f2d" />
//               <Text style={styles.reorderButtonText}>Reorder</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderEmptyState = () => (
//     <View style={styles.emptyState}>
//       <View style={styles.emptyIconContainer}>
//         <Text style={styles.emptyIcon}>📦</Text>
//       </View>
//       <Text style={styles.emptyTitle}>No orders found</Text>
//       <Text style={styles.emptySubtitle}>
//         {filter === 'all' 
//           ? "You haven't placed any orders yet."
//           : `No ${filter} orders found.`
//         }
//       </Text>
//       <TouchableOpacity
//         style={[styles.actionButton, styles.shopButton]}
//         onPress={goBackToShop}
//       >
//         <ShoppingCart size={18} color="#fff" />
//         <Text style={styles.shopButtonText}>Start Shopping</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#2c5f2d" barStyle="light-content" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerContent}>
//           <TouchableOpacity 
//             style={styles.backButton} 
//             onPress={goBackToShop}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <ArrowLeft size={24} color="#fff" />
//           </TouchableOpacity>
//           <View style={styles.headerTitleContainer}>
//             <Text style={styles.headerTitle}>🌾 Crop Care Orders</Text>
//           </View>
//           {user && (
//             <View style={styles.userInfo}>
//               <User size={20} color="#fff" />
//               <View style={styles.userDetails}>
//                 <Text style={styles.userName}>{user.personalInfo.name}</Text>
//                 <View style={styles.userRole}>
//                   <Text style={styles.userRoleText}>{user.role}</Text>
//                 </View>
//               </View>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* Main Content */}
//       <View style={styles.main}>
//         {/* Title and Filters */}
//         <View style={styles.titleSection}>
//           <View style={styles.titleRow}>
//             <Package size={28} color="#2c5f2d" />
//             <Text style={styles.title}>My Orders</Text>
//             <View style={styles.orderCount}>
//               <Text style={styles.orderCountText}>{orders.length}</Text>
//             </View>
//           </View>
          
//           <ScrollView 
//             horizontal 
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.filtersContent}
//           >
//             <View style={styles.filters}>
//               {renderFilterButton('all', 'All Orders', <Filter size={14} color={filter === 'all' ? '#fff' : '#666'} />)}
//               {renderFilterButton('pending', 'Pending', <Clock size={14} color={filter === 'pending' ? '#fff' : '#666'} />)}
//               {renderFilterButton('delivered', 'Delivered', <CheckCircle size={14} color={filter === 'delivered' ? '#fff' : '#666'} />)}
//               {renderFilterButton('cancelled', 'Cancelled', <XCircle size={14} color={filter === 'cancelled' ? '#fff' : '#666'} />)}
//             </View>
//           </ScrollView>
//         </View>

//         {/* Orders List */}
//         {loading.orders ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#2c5f2d" />
//             <Text style={styles.loadingText}>Loading your orders...</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={orders}
//             renderItem={renderOrderCard}
//             keyExtractor={(item) => item._id}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.ordersList}
//             ListEmptyComponent={renderEmptyState}
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             ItemSeparatorComponent={() => <View style={styles.separator} />}
//           />
//         )}
//       </View>

//       {/* Order Details Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={closeOrderDetails}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             {/* Modal Header */}
//             <View style={styles.modalHeader}>
//               <View style={styles.modalTitleContainer}>
//                 <Text style={styles.modalTitle}>Order Details</Text>
//                 <Text style={styles.modalOrderId}>{selectedOrder?.orderId}</Text>
//               </View>
//               <TouchableOpacity 
//                 style={styles.closeButton} 
//                 onPress={closeOrderDetails}
//                 hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//               >
//                 <X size={28} color="#666" />
//               </TouchableOpacity>
//             </View>

//             {selectedOrder && (
//               <ScrollView 
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={styles.modalScrollContent}
//               >
//                 {/* Order Status */}
//                 <View style={styles.detailSection}>
//                   <View style={styles.detailTitleRow}>
//                     <Package size={22} color="#2c5f2d" />
//                     <Text style={styles.detailTitle}>Order Status</Text>
//                   </View>
//                   <View style={[
//                     styles.orderStatusBadge,
//                     { backgroundColor: `${getStatusColor(selectedOrder.orderStatus)}15` }
//                   ]}>
//                     {getStatusIcon(selectedOrder.orderStatus)}
//                     <Text style={[
//                       styles.orderStatusBadgeText,
//                       { color: getStatusColor(selectedOrder.orderStatus) }
//                     ]}>
//                       {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
//                     </Text>
//                   </View>
//                   <View style={styles.statusDates}>
//                     <Text style={styles.statusDateText}>
//                       Ordered: {formatDate(selectedOrder.createdAt)}
//                     </Text>
//                     {selectedOrder.updatedAt !== selectedOrder.createdAt && (
//                       <Text style={styles.statusDateText}>
//                         Updated: {formatDate(selectedOrder.updatedAt)}
//                       </Text>
//                     )}
//                   </View>
//                 </View>

//                 {/* Shipping Address */}
//                 <View style={styles.detailSection}>
//                   <View style={styles.detailTitleRow}>
//                     <MapPin size={22} color="#2c5f2d" />
//                     <Text style={styles.detailTitle}>Shipping Address</Text>
//                   </View>
//                   <View style={styles.addressBox}>
//                     <Text style={styles.addressName}>{selectedOrder.shippingAddress.name}</Text>
//                     <Text style={styles.addressLine}>{selectedOrder.shippingAddress.address}</Text>
//                     {selectedOrder.shippingAddress.villageGramaPanchayat && (
//                       <Text style={styles.addressLine}>{selectedOrder.shippingAddress.villageGramaPanchayat}</Text>
//                     )}
//                     <Text style={styles.addressLine}>
//                       {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
//                     </Text>
//                     {selectedOrder.shippingAddress.taluk && (
//                       <Text style={styles.addressDetail}>Taluk: {selectedOrder.shippingAddress.taluk}</Text>
//                     )}
//                     {selectedOrder.shippingAddress.post && (
//                       <Text style={styles.addressDetail}>Post: {selectedOrder.shippingAddress.post}</Text>
//                     )}
//                     <Text style={[styles.addressLine, styles.addressPhone]}>
//                       📱 {selectedOrder.shippingAddress.mobileNo}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Payment Details */}
//                 <View style={styles.detailSection}>
//                   <View style={styles.detailTitleRow}>
//                     <CreditCard size={22} color="#2c5f2d" />
//                     <Text style={styles.detailTitle}>Payment Details</Text>
//                   </View>
//                   <View style={styles.paymentDetails}>
//                     <View style={styles.paymentRow}>
//                       <Text style={styles.paymentLabel}>Method:</Text>
//                       <Text style={styles.paymentValue}>
//                         {selectedOrder.payment.method === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}
//                       </Text>
//                     </View>
//                     <View style={styles.paymentRow}>
//                       <Text style={styles.paymentLabel}>Status:</Text>
//                       <View style={[
//                         styles.paymentStatus,
//                         { backgroundColor: selectedOrder.payment.status === 'completed' ? '#d1fae5' : '#fef3c7' }
//                       ]}>
//                         <Text style={[
//                           styles.paymentStatusText,
//                           { color: selectedOrder.payment.status === 'completed' ? '#065f46' : '#92400e' }
//                         ]}>
//                           {selectedOrder.payment.status.charAt(0).toUpperCase() + selectedOrder.payment.status.slice(1)}
//                         </Text>
//                       </View>
//                     </View>
//                     {selectedOrder.payment.razorpayOrderId && (
//                       <View style={styles.paymentRow}>
//                         <Text style={styles.paymentLabel}>Order ID:</Text>
//                         <Text style={[styles.paymentValue, styles.paymentId]}>{selectedOrder.payment.razorpayOrderId}</Text>
//                       </View>
//                     )}
//                   </View>
//                 </View>

//                 {/* Order Summary */}
//                 <View style={styles.detailSection}>
//                   <View style={styles.detailTitleRow}>
//                     <FileText size={22} color="#2c5f2d" />
//                     <Text style={styles.detailTitle}>Order Summary</Text>
//                   </View>
//                   <View style={styles.orderSummary}>
//                     {selectedOrder.items.map((item, index) => (
//                       <View key={index} style={styles.summaryItem}>
//                         <View style={styles.summaryItemLeft}>
//                           <Text style={styles.summaryItemName} numberOfLines={2}>
//                             {item.seedName}
//                           </Text>
//                           <Text style={styles.summaryItemQuantity}>Qty: {item.quantity}</Text>
//                         </View>
//                         <Text style={styles.summaryItemPrice}>
//                           ₹{(item.seedPrice * item.quantity).toFixed(2)}
//                         </Text>
//                       </View>
//                     ))}
//                   </View>
//                   <View style={styles.summaryBreakdown}>
//                     <View style={styles.summaryRow}>
//                       <Text style={styles.summaryLabel}>Subtotal:</Text>
//                       <Text style={styles.summaryValue}>₹{selectedOrder.subtotal.toFixed(2)}</Text>
//                     </View>
//                     <View style={styles.summaryRow}>
//                       <Text style={styles.summaryLabel}>GST (18%):</Text>
//                       <Text style={styles.summaryValue}>₹{selectedOrder.gst.toFixed(2)}</Text>
//                     </View>
//                     <View style={styles.summaryRow}>
//                       <Text style={styles.summaryLabel}>Shipping:</Text>
//                       <Text style={[
//                         styles.summaryValue,
//                         selectedOrder.shipping === 0 && styles.freeShipping
//                       ]}>
//                         {selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping.toFixed(2)}`}
//                       </Text>
//                     </View>
//                     <View style={styles.summaryTotal}>
//                       <Text style={styles.summaryTotalLabel}>Total Amount</Text>
//                       <Text style={styles.summaryTotalValue}>₹{selectedOrder.total.toFixed(2)}</Text>
//                     </View>
//                   </View>
//                 </View>

//                 {/* Action Buttons */}
//                 <View style={styles.modalActions}>
//                   {selectedOrder.orderStatus === 'delivered' && (
//                     <TouchableOpacity
//                       style={[styles.modalActionButton, styles.reorderActionButton]}
//                       onPress={() => {
//                         reorder(selectedOrder);
//                         closeOrderDetails();
//                       }}
//                     >
//                       <ShoppingCart size={20} color="#2c5f2d" />
//                       <Text style={styles.reorderActionText}>Reorder All Items</Text>
//                     </TouchableOpacity>
//                   )}
//                   <TouchableOpacity
//                     style={[styles.modalActionButton, styles.downloadActionButton]}
//                     onPress={() => downloadInvoice(selectedOrder)}
//                   >
//                     <Download size={20} color="#fff" />
//                     <Text style={styles.downloadActionText}>Download Invoice</Text>
//                   </TouchableOpacity>
//                 </View>
//               </ScrollView>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     backgroundColor: '#2c5f2d',
//     paddingTop: 50,
//     paddingBottom: 20,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//   },
//   backButton: {
//     padding: 8,
//     borderRadius: 10,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   headerTitleContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: 'white',
//     letterSpacing: 0.5,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   userDetails: {
//     alignItems: 'flex-start',
//   },
//   userName: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   userRole: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//     borderRadius: 10,
//     marginTop: 2,
//   },
//   userRoleText: {
//     color: 'white',
//     fontSize: 11,
//     fontWeight: '500',
//   },
//   main: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   titleSection: {
//     marginTop: 24,
//     marginBottom: 20,
//   },
//   titleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#1a1a1a',
//   },
//   orderCount: {
//     backgroundColor: '#2c5f2d',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   orderCountText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   filtersContent: {
//     paddingHorizontal: 4,
//   },
//   filters: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   filterButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderWidth: 1.5,
//     borderColor: '#e5e7eb',
//     borderRadius: 25,
//     backgroundColor: 'white',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   filterButtonActive: {
//     backgroundColor: '#2c5f2d',
//     borderColor: '#2c5f2d',
//     shadowColor: '#2c5f2d',
//     shadowOpacity: 0.15,
//   },
//   filterButtonText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#666',
//   },
//   filterButtonTextActive: {
//     color: 'white',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 60,
//   },
//   loadingText: {
//     marginTop: 20,
//     color: '#666',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   ordersList: {
//     paddingBottom: 30,
//   },
//   separator: {
//     height: 16,
//   },
//   orderCard: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     elevation: 4,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//   },
//   orderHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 20,
//   },
//   orderInfo: {
//     flex: 1,
//   },
//   orderId: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 6,
//   },
//   orderDateContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   orderDateText: {
//     fontSize: 13,
//     color: '#666',
//     fontWeight: '500',
//   },
//   orderStatusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   orderStatusText: {
//     fontSize: 13,
//     fontWeight: '700',
//   },
//   orderItems: {
//     marginBottom: 20,
//   },
//   orderItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f5f5f5',
//   },
//   itemImageContainer: {
//     width: 70,
//     height: 70,
//     borderRadius: 10,
//     backgroundColor: '#f5f5f5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
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
//   itemImagePlaceholderText: {
//     fontSize: 28,
//   },
//   itemDetails: {
//     flex: 1,
//   },
//   itemName: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//     lineHeight: 20,
//   },
//   itemQuantity: {
//     fontSize: 13,
//     color: '#666',
//     fontWeight: '500',
//   },
//   itemPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     minWidth: 80,
//     textAlign: 'right',
//   },
//   orderFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 18,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   orderTotalContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   orderTotalText: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1a1a1a',
//   },
//   orderActions: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   viewDetailsButton: {
//     backgroundColor: '#2c5f2d',
//   },
//   viewDetailsButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   cancelButton: {
//     backgroundColor: '#fff2f0',
//     borderWidth: 1,
//     borderColor: '#ffccc7',
//   },
//   cancelButtonText: {
//     color: '#dc2626',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   reorderButton: {
//     backgroundColor: '#f0f7ff',
//     borderWidth: 1,
//     borderColor: '#91caff',
//   },
//   reorderButtonText: {
//     color: '#2c5f2d',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 80,
//     paddingHorizontal: 20,
//   },
//   emptyIconContainer: {
//     marginBottom: 24,
//   },
//   emptyIcon: {
//     fontSize: 70,
//     opacity: 0.3,
//   },
//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#666',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   emptySubtitle: {
//     fontSize: 16,
//     color: '#999',
//     textAlign: 'center',
//     marginBottom: 40,
//     lineHeight: 24,
//   },
//   shopButton: {
//     backgroundColor: '#2c5f2d',
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     paddingHorizontal: 32,
//     paddingVertical: 16,
//     borderRadius: 12,
//     shadowColor: '#2c5f2d',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   shopButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     maxHeight: '90%',
//     paddingTop: 20,
//     paddingBottom: 40,
//   },
//   modalScrollContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//     marginBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   modalTitleContainer: {
//     flex: 1,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 4,
//   },
//   modalOrderId: {
//     fontSize: 15,
//     color: '#666',
//     fontWeight: '600',
//   },
//   closeButton: {
//     padding: 6,
//   },
//   detailSection: {
//     marginBottom: 28,
//   },
//   detailTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     marginBottom: 16,
//   },
//   detailTitle: {
//     fontSize: 19,
//     fontWeight: '700',
//     color: '#1a1a1a',
//   },
//   orderStatusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//   },
//   orderStatusBadgeText: {
//     fontSize: 15,
//     fontWeight: '700',
//   },
//   statusDates: {
//     marginTop: 12,
//     gap: 6,
//   },
//   statusDateText: {
//     fontSize: 13,
//     color: '#666',
//     fontWeight: '500',
//   },
//   addressBox: {
//     backgroundColor: '#f8f9fa',
//     padding: 20,
//     borderRadius: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: '#2c5f2d',
//   },
//   addressName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 8,
//   },
//   addressLine: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 6,
//     lineHeight: 20,
//   },
//   addressDetail: {
//     fontSize: 13,
//     color: '#777',
//     marginBottom: 4,
//   },
//   addressPhone: {
//     marginTop: 12,
//     fontWeight: '600',
//   },
//   paymentDetails: {
//     backgroundColor: '#f8f9fa',
//     padding: 20,
//     borderRadius: 12,
//     gap: 16,
//   },
//   paymentRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   paymentLabel: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '600',
//   },
//   paymentValue: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//     flex: 1,
//     textAlign: 'right',
//   },
//   paymentStatus: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   paymentStatusText: {
//     fontSize: 13,
//     fontWeight: '700',
//   },
//   paymentId: {
//     fontSize: 13,
//     color: '#666',
//     fontWeight: '500',
//   },
//   orderSummary: {
//     backgroundColor: '#f8f9fa',
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 20,
//   },
//   summaryItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   summaryItemLeft: {
//     flex: 1,
//     marginRight: 16,
//   },
//   summaryItemName: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//     lineHeight: 20,
//   },
//   summaryItemQuantity: {
//     fontSize: 13,
//     color: '#666',
//     fontWeight: '500',
//   },
//   summaryItemPrice: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1a1a1a',
//   },
//   summaryBreakdown: {
//     backgroundColor: '#f8f9fa',
//     padding: 20,
//     borderRadius: 12,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   summaryLabel: {
//     fontSize: 15,
//     color: '#666',
//     fontWeight: '500',
//   },
//   summaryValue: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333',
//   },
//   freeShipping: {
//     color: '#10b981',
//     fontWeight: '700',
//   },
//   summaryTotal: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16,
//     paddingTop: 16,
//     borderTopWidth: 2,
//     borderTopColor: '#e5e7eb',
//   },
//   summaryTotalLabel: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1a1a1a',
//   },
//   summaryTotalValue: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#2c5f2d',
//   },
//   modalActions: {
//     flexDirection: 'row',
//     gap: 16,
//     marginTop: 30,
//   },
//   modalActionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 12,
//     paddingVertical: 18,
//     borderRadius: 12,
//   },
//   reorderActionButton: {
//     backgroundColor: '#f0f7ff',
//     borderWidth: 1.5,
//     borderColor: '#2c5f2d',
//   },
//   reorderActionText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#2c5f2d',
//   },
//   downloadActionButton: {
//     backgroundColor: '#2c5f2d',
//     shadowColor: '#2c5f2d',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   downloadActionText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: 'white',
//   },
// });

// export default CropcareOrders;




import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Alert,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Package,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  Filter,
  Calendar,
  DollarSign,
  User,
  ChevronRight,
  Download,
  ShoppingCart,
  MapPin,
  CreditCard,
  FileText,
  X,
  LogOut
} from 'lucide-react-native';
import axios from 'axios';

// Define types
interface OrderItem {
  seedName: string;
  seedPrice: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  name: string;
  mobileNo: string;
  address: string;
  villageGramaPanchayat?: string;
  pincode: string;
  state: string;
  district: string;
  taluk?: string;
  post?: string;
}

interface PaymentInfo {
  method: 'razorpay' | 'cod';
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

interface Order {
  _id: string;
  orderId: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  payment: PaymentInfo;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  personalInfo: {
    name: string;
    mobileNo: string;
  };
  role: string;
  farmerId?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CropcareOrders: React.FC = () => {
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState({
    orders: false,
    auth: true
  });
  const [filter, setFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    } else {
      // Reset orders when user is not authenticated
      setOrders([]);
    }
  }, [user, filter]);

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

      console.log('Orders Auth check:', { userData, role, userId, farmerId });

      if (userData && role && userId) {
        try {
          const parsedUserData = JSON.parse(userData);
          
          const userObj: User = {
            _id: userId,
            role: role,
            personalInfo: {
              name: parsedUserData.personalInfo?.name || parsedUserData.name || 'User',
              mobileNo: parsedUserData.personalInfo?.mobileNo || parsedUserData.mobileNo || '',
            }
          };

          // Add farmerId if available
          if (farmerId) {
            userObj.farmerId = farmerId;
          }

          setUser(userObj);
          setShowLoginModal(false);
          console.log('Orders User authenticated:', userObj);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
          setShowLoginModal(true);
        }
      } else {
        console.log('Orders User not authenticated');
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
      setOrders([]);
      setShowLoginModal(true);
      showNotification('success', 'You have been logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      showNotification('error', 'Failed to logout');
    }
  };

  const fetchUserOrders = async () => {
    if (!user) return;

    setLoading(prev => ({ ...prev, orders: true }));
    try {
      // Use farmerId if available, otherwise use userId
      const idToUse = user.farmerId || user._id;
      console.log('Fetching orders for ID:', idToUse);
      
      const response = await axios.get(`https://kisan.etpl.ai/api/payment/orders/${idToUse}`);
      
      if (response.data.success) {
        let filteredOrders = response.data.data;
        
        if (filter !== 'all') {
          filteredOrders = filteredOrders.filter((order: Order) => 
            filter === 'pending' ? order.orderStatus === 'pending' :
            filter === 'delivered' ? order.orderStatus === 'delivered' :
            filter === 'cancelled' ? order.orderStatus === 'cancelled' : true
          );
        }
        
        setOrders(filteredOrders);
      } else {
        showNotification('error', response.data.message || 'Failed to fetch orders');
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      showNotification('error', error.response?.data?.message || 'Failed to fetch orders. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
      setRefreshing(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    Alert.alert(
      type === 'success' ? 'Success' : 'Error',
      message,
      [{ text: 'OK' }]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'processing': return '#8b5cf6';
      case 'shipped': return '#10b981';
      case 'delivered': return '#059669';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    const iconSize = 16;
    const color = getStatusColor(status);
    switch (status) {
      case 'delivered': return <CheckCircle size={iconSize} color={color} />;
      case 'shipped': return <Package size={iconSize} color={color} />;
      case 'cancelled': return <XCircle size={iconSize} color={color} />;
      default: return <Clock size={iconSize} color={color} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const goBackToShop = () => {
    router.push('/farmerscreen/cropcare');
  };

  const viewOrderDetails = (order: Order) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const closeOrderDetails = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  const downloadInvoice = (order: Order) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    Alert.alert('Download Invoice', `Invoice for ${order.orderId} would be downloaded`);
  };

  const cancelOrder = (orderId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              // Call API to cancel order
              Alert.alert('Success', 'Order cancellation request sent');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel order');
            }
          }
        }
      ]
    );
  };

  const reorder = (order: Order) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    Alert.alert('Reorder', 'Items added to cart for reorder');
    router.push('/farmerscreen/cropcarecart');
  };

  const renderFilterButton = (filterType: string, label: string, icon: React.ReactNode) => {
    const isActive = filter === filterType;
    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          isActive && styles.filterButtonActive
        ]}
        onPress={() => setFilter(filterType)}
        disabled={!user}
      >
        {icon}
        <Text style={[
          styles.filterButtonText,
          isActive && styles.filterButtonTextActive
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOrderItem = (item: OrderItem, index: number) => (
    <View key={index} style={styles.orderItem}>
      <View style={styles.itemImageContainer}>
        {item.image ? (
          <Image 
            source={{ uri: item.image }} 
            style={styles.itemImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.itemImagePlaceholder}>
            <Text style={styles.itemImagePlaceholderText}>🌱</Text>
          </View>
        )}
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.seedName}</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
      </View>
      <Text style={styles.itemPrice}>
        ₹{(item.seedPrice * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  const renderOrderCard = ({ item }: { item: Order }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => viewOrderDetails(item)}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>{item.orderId}</Text>
          <View style={styles.orderDateContainer}>
            <Calendar size={14} color="#666" />
            <Text style={styles.orderDateText}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
        <View style={[
          styles.orderStatusContainer,
          { backgroundColor: `${getStatusColor(item.orderStatus)}20` }
        ]}>
          {getStatusIcon(item.orderStatus)}
          <Text style={[
            styles.orderStatusText,
            { color: getStatusColor(item.orderStatus) }
          ]}>
            {item.orderStatus.charAt(0).toUpperCase() + item.orderStatus.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {item.items.map((orderItem, index) => renderOrderItem(orderItem, index))}
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.orderTotalContainer}>
          <DollarSign size={16} color="#333" />
          <Text style={styles.orderTotalText}>Total: ₹{item.total.toFixed(2)}</Text>
        </View>
        <View style={styles.orderActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.viewDetailsButton]}
            onPress={() => viewOrderDetails(item)}
          >
            <Text style={styles.viewDetailsButtonText}>View Details</Text>
            <ChevronRight size={14} color="#fff" />
          </TouchableOpacity>
          {(item.orderStatus === 'pending' || item.orderStatus === 'processing') && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => cancelOrder(item._id)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          {item.orderStatus === 'delivered' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.reorderButton]}
              onPress={() => reorder(item)}
            >
              <ShoppingCart size={14} color="#2c5f2d" />
              <Text style={styles.reorderButtonText}>Reorder</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderLoginPrompt = () => (
    <View style={styles.loginPromptContainer}>
      <View style={styles.loginPromptIconContainer}>
        <Text style={styles.loginPromptIcon}>🔒</Text>
      </View>
      <Text style={styles.loginPromptTitle}>Login Required</Text>
      <Text style={styles.loginPromptDescription}>
        Please login to view your orders
      </Text>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => setShowLoginModal(true)}
      >
        <Text style={styles.loginButtonText}>Login Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
      </View>
      <Text style={styles.emptyTitle}>No orders found</Text>
      <Text style={styles.emptySubtitle}>
        {filter === 'all' 
          ? "You haven't placed any orders yet."
          : `No ${filter} orders found.`
        }
      </Text>
      <TouchableOpacity
        style={[styles.actionButton, styles.shopButton]}
        onPress={goBackToShop}
      >
        <ShoppingCart size={18} color="#fff" />
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading.auth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2c5f2d" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2c5f2d" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={goBackToShop}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>🌾 Crop Care Orders</Text>
          </View>
          {user ? (
            <View style={styles.userInfo}>
              <User size={20} color="#fff" />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.personalInfo.name}</Text>
                <View style={styles.userRoleContainer}>
                  <View style={styles.userRole}>
                    <Text style={styles.userRoleText}>{user.role}</Text>
                  </View>
                  <TouchableOpacity onPress={handleLogout} style={styles.logoutButtonSmall}>
                    <LogOut size={12} color="white" />
                    <Text style={styles.logoutTextSmall}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.loginPromptHeader}
              onPress={() => setShowLoginModal(true)}
            >
              <Text style={styles.loginTextHeader}>Tap to Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        {/* Show Login Prompt when not authenticated */}
        {!user ? (
          renderLoginPrompt()
        ) : (
          <>
            {/* Title and Filters */}
            <View style={styles.titleSection}>
              <View style={styles.titleRow}>
                <Package size={28} color="#2c5f2d" />
                <Text style={styles.title}>My Orders</Text>
                <View style={styles.orderCount}>
                  <Text style={styles.orderCountText}>{orders.length}</Text>
                </View>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContent}
              >
                <View style={styles.filters}>
                  {renderFilterButton('all', 'All Orders', <Filter size={14} color={filter === 'all' ? '#fff' : '#666'} />)}
                  {renderFilterButton('pending', 'Pending', <Clock size={14} color={filter === 'pending' ? '#fff' : '#666'} />)}
                  {renderFilterButton('delivered', 'Delivered', <CheckCircle size={14} color={filter === 'delivered' ? '#fff' : '#666'} />)}
                  {renderFilterButton('cancelled', 'Cancelled', <XCircle size={14} color={filter === 'cancelled' ? '#fff' : '#666'} />)}
                </View>
              </ScrollView>
            </View>

            {/* Orders List */}
            {loading.orders ? (
              <View style={styles.cartLoadingContainer}>
                <ActivityIndicator size="large" color="#2c5f2d" />
                <Text style={styles.cartLoadingText}>Loading your orders...</Text>
              </View>
            ) : (
              <FlatList
                data={orders}
                renderItem={renderOrderCard}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.ordersList}
                ListEmptyComponent={renderEmptyState}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            )}
          </>
        )}
      </View>

      {/* Order Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeOrderDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>Order Details</Text>
                <Text style={styles.modalOrderId}>{selectedOrder?.orderId}</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={closeOrderDetails}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={28} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}
              >
                {/* Order Status */}
                <View style={styles.detailSection}>
                  <View style={styles.detailTitleRow}>
                    <Package size={22} color="#2c5f2d" />
                    <Text style={styles.detailTitle}>Order Status</Text>
                  </View>
                  <View style={[
                    styles.orderStatusBadge,
                    { backgroundColor: `${getStatusColor(selectedOrder.orderStatus)}15` }
                  ]}>
                    {getStatusIcon(selectedOrder.orderStatus)}
                    <Text style={[
                      styles.orderStatusBadgeText,
                      { color: getStatusColor(selectedOrder.orderStatus) }
                    ]}>
                      {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
                    </Text>
                  </View>
                  <View style={styles.statusDates}>
                    <Text style={styles.statusDateText}>
                      Ordered: {formatDate(selectedOrder.createdAt)}
                    </Text>
                    {selectedOrder.updatedAt !== selectedOrder.createdAt && (
                      <Text style={styles.statusDateText}>
                        Updated: {formatDate(selectedOrder.updatedAt)}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Shipping Address */}
                <View style={styles.detailSection}>
                  <View style={styles.detailTitleRow}>
                    <MapPin size={22} color="#2c5f2d" />
                    <Text style={styles.detailTitle}>Shipping Address</Text>
                  </View>
                  <View style={styles.addressBox}>
                    <Text style={styles.addressName}>{selectedOrder.shippingAddress.name}</Text>
                    <Text style={styles.addressLine}>{selectedOrder.shippingAddress.address}</Text>
                    {selectedOrder.shippingAddress.villageGramaPanchayat && (
                      <Text style={styles.addressLine}>{selectedOrder.shippingAddress.villageGramaPanchayat}</Text>
                    )}
                    <Text style={styles.addressLine}>
                      {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                    </Text>
                    {selectedOrder.shippingAddress.taluk && (
                      <Text style={styles.addressDetail}>Taluk: {selectedOrder.shippingAddress.taluk}</Text>
                    )}
                    {selectedOrder.shippingAddress.post && (
                      <Text style={styles.addressDetail}>Post: {selectedOrder.shippingAddress.post}</Text>
                    )}
                    <Text style={[styles.addressLine, styles.addressPhone]}>
                      📱 {selectedOrder.shippingAddress.mobileNo}
                    </Text>
                  </View>
                </View>

                {/* Payment Details */}
                <View style={styles.detailSection}>
                  <View style={styles.detailTitleRow}>
                    <CreditCard size={22} color="#2c5f2d" />
                    <Text style={styles.detailTitle}>Payment Details</Text>
                  </View>
                  <View style={styles.paymentDetails}>
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>Method:</Text>
                      <Text style={styles.paymentValue}>
                        {selectedOrder.payment.method === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}
                      </Text>
                    </View>
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentLabel}>Status:</Text>
                      <View style={[
                        styles.paymentStatus,
                        { backgroundColor: selectedOrder.payment.status === 'completed' ? '#d1fae5' : '#fef3c7' }
                      ]}>
                        <Text style={[
                          styles.paymentStatusText,
                          { color: selectedOrder.payment.status === 'completed' ? '#065f46' : '#92400e' }
                        ]}>
                          {selectedOrder.payment.status.charAt(0).toUpperCase() + selectedOrder.payment.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    {selectedOrder.payment.razorpayOrderId && (
                      <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Order ID:</Text>
                        <Text style={[styles.paymentValue, styles.paymentId]}>{selectedOrder.payment.razorpayOrderId}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Order Summary */}
                <View style={styles.detailSection}>
                  <View style={styles.detailTitleRow}>
                    <FileText size={22} color="#2c5f2d" />
                    <Text style={styles.detailTitle}>Order Summary</Text>
                  </View>
                  <View style={styles.orderSummary}>
                    {selectedOrder.items.map((item, index) => (
                      <View key={index} style={styles.summaryItem}>
                        <View style={styles.summaryItemLeft}>
                          <Text style={styles.summaryItemName} numberOfLines={2}>
                            {item.seedName}
                          </Text>
                          <Text style={styles.summaryItemQuantity}>Qty: {item.quantity}</Text>
                        </View>
                        <Text style={styles.summaryItemPrice}>
                          ₹{(item.seedPrice * item.quantity).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.summaryBreakdown}>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Subtotal:</Text>
                      <Text style={styles.summaryValue}>₹{selectedOrder.subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>GST (18%):</Text>
                      <Text style={styles.summaryValue}>₹{selectedOrder.gst.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Shipping:</Text>
                      <Text style={[
                        styles.summaryValue,
                        selectedOrder.shipping === 0 && styles.freeShipping
                      ]}>
                        {selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping.toFixed(2)}`}
                      </Text>
                    </View>
                    <View style={styles.summaryTotal}>
                      <Text style={styles.summaryTotalLabel}>Total Amount</Text>
                      <Text style={styles.summaryTotalValue}>₹{selectedOrder.total.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  {selectedOrder.orderStatus === 'delivered' && (
                    <TouchableOpacity
                      style={[styles.modalActionButton, styles.reorderActionButton]}
                      onPress={() => {
                        reorder(selectedOrder);
                        closeOrderDetails();
                      }}
                    >
                      <ShoppingCart size={20} color="#2c5f2d" />
                      <Text style={styles.reorderActionText}>Reorder All Items</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.modalActionButton, styles.downloadActionButton]}
                    onPress={() => downloadInvoice(selectedOrder)}
                  >
                    <Download size={20} color="#fff" />
                    <Text style={styles.downloadActionText}>Download Invoice</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

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
              You need to login to view your orders
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
    </View>
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
  header: {
    backgroundColor: '#2c5f2d',
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  userDetails: {
    alignItems: 'flex-start',
  },
  userRoleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  userName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  userRole: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  userRoleText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '500',
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginTextHeader: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  main: {
    flex: 1,
    paddingHorizontal: 16,
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
  titleSection: {
    marginTop: 24,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  orderCount: {
    backgroundColor: '#2c5f2d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  orderCountText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  filtersContent: {
    paddingHorizontal: 4,
  },
  filters: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 25,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#2c5f2d',
    borderColor: '#2c5f2d',
    shadowColor: '#2c5f2d',
    shadowOpacity: 0.15,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  cartLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  cartLoadingText: {
    marginTop: 20,
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  ordersList: {
    paddingBottom: 30,
  },
  separator: {
    height: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  orderDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderDateText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  orderStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  orderStatusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  orderItems: {
    marginBottom: 20,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  itemImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImagePlaceholderText: {
    fontSize: 28,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  itemQuantity: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    minWidth: 80,
    textAlign: 'right',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  orderTotalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderTotalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  viewDetailsButton: {
    backgroundColor: '#2c5f2d',
  },
  viewDetailsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fff2f0',
    borderWidth: 1,
    borderColor: '#ffccc7',
  },
  cancelButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  reorderButton: {
    backgroundColor: '#f0f7ff',
    borderWidth: 1,
    borderColor: '#91caff',
  },
  reorderButtonText: {
    color: '#2c5f2d',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 70,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  shopButton: {
    backgroundColor: '#2c5f2d',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#2c5f2d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  modalOrderId: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  closeButton: {
    padding: 6,
  },
  detailSection: {
    marginBottom: 28,
  },
  detailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  orderStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  orderStatusBadgeText: {
    fontSize: 15,
    fontWeight: '700',
  },
  statusDates: {
    marginTop: 12,
    gap: 6,
  },
  statusDateText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  addressBox: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2c5f2d',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  addressLine: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  addressDetail: {
    fontSize: 13,
    color: '#777',
    marginBottom: 4,
  },
  addressPhone: {
    marginTop: 12,
    fontWeight: '600',
  },
  paymentDetails: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    gap: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  paymentValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  paymentStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  paymentStatusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  paymentId: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  orderSummary: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  summaryItemLeft: {
    flex: 1,
    marginRight: 16,
  },
  summaryItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  summaryItemQuantity: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  summaryItemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  summaryBreakdown: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  freeShipping: {
    color: '#10b981',
    fontWeight: '700',
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c5f2d',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 30,
  },
  modalActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    borderRadius: 12,
  },
  reorderActionButton: {
    backgroundColor: '#f0f7ff',
    borderWidth: 1.5,
    borderColor: '#2c5f2d',
  },
  reorderActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c5f2d',
  },
  downloadActionButton: {
    backgroundColor: '#2c5f2d',
    shadowColor: '#2c5f2d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
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
});

export default CropcareOrders;