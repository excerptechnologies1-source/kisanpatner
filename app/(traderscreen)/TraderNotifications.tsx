// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   Alert,
//   ActivityIndicator,
//   RefreshControl,
//   StatusBar,
//   FlatList,
//   Linking,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface Notification {
//   _id: string;
//   type?: 'payment' | 'payment_received' | 'payment_status' | 'offer';
//   offerId?: string;
//   productId?: string;
//   productName?: string;
//   productCode?: string;
//   farmerId?: string;
//   farmerName?: string;
//   gradeId?: string;
//   gradeName?: string;
//   offeredPrice?: number;
//   quantity?: number;
//   totalAmount: number;
//   status?: 'pending' | 'accepted' | 'rejected' | 'countered';
//   counterPrice?: number;
//   counterQuantity?: number;
//   counterDate?: string;
//   isRead: boolean;
//   notificationReadAt?: string;
//   createdAt: string;
//   unitMeasurement?: string;
//   categoryName?: string;
//   subCategoryName?: string;
//   nearestMarket?: string;
//   deliveryDate?: string;
//   orderId?: string;
//   orderObjectId?: string;
//   paymentId?: string;
//   amount?: number;
//   paidDate?: string;
//   paidAmount?: number;
//   remainingAmount?: number;
//   paymentStatus?: string;
//   fees?: {
//     labourFee: number;
//     transportFee: number;
//   };
//   message?: string;
//   razorpayPaymentId?: string;
// }

// type FilterType = 'all' | 'unread' | 'offers' | 'payments';

// const TraderNotifications: React.FC = () => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [filter, setFilter] = useState<FilterType>('all');
//   const navigation = useNavigation();

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const traderId = await AsyncStorage.getItem('traderId');
      
//       if (!traderId) {
//         throw new Error('Trader not logged in');
//       }

//       const response = await fetch(`https://kisan.etpl.ai/product/trader-notifications/${traderId}`);
//       const data = await response.json();

//       if (data.success) {
//         setNotifications(data.data);
//         setUnreadCount(data.unreadCount);
//         setError(null);
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch notifications');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchNotifications();
//   };

//   const markAsRead = async (notification: Notification) => {
//     if (notification.isRead) return;

//     try {
//       const body: any = {
//         notificationId: notification._id
//       };

//       if (notification.type === 'payment' || notification.type === 'payment_status') {
//         body.type = 'payment';
//         body.orderObjectId = notification.orderObjectId;
//       } else if (notification.type === 'payment_received') {
//         body.type = 'payment_received';
//         body.orderObjectId = notification.orderObjectId;
//         body.paymentId = notification.paymentId;
//       } else {
//         body.type = 'offer';
//         body.productId = notification.productId;
//         body.gradeId = notification.gradeId;
//         body.offerId = notification._id;
//       }

//       const response = await fetch('http://localhost:8080/product/mark-trader-notification-read', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body)
//       });

//       const data = await response.json();
//       if (data.success) {
//         fetchNotifications();
//       }
//     } catch (err) {
//       console.error('Error marking as read:', err);
//     }
//   };

//   const markAllAsRead = async () => {
//     try {
//       const traderId = await AsyncStorage.getItem('traderId');
//       const response = await fetch('http://localhost:8080/product/mark-all-trader-notifications-read', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ traderId })
//       });

//       const data = await response.json();
//       if (data.success) {
//         Alert.alert('Success', `${data.updatedCount} notifications marked as read`);
//         fetchNotifications();
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Error marking all as read');
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return (
//           <View style={[styles.badge, styles.pendingBadge]}>
//             <Icon name="clock-outline" size={12} color="#856404" />
//             <Text style={styles.pendingBadgeText}> Pending</Text>
//           </View>
//         );
//       case 'accepted':
//         return (
//           <View style={[styles.badge, styles.acceptedBadge]}>
//             <Icon name="check-circle-outline" size={12} color="#155724" />
//             <Text style={styles.acceptedBadgeText}> Accepted</Text>
//           </View>
//         );
//       case 'rejected':
//         return (
//           <View style={[styles.badge, styles.rejectedBadge]}>
//             <Icon name="close-circle-outline" size={12} color="#721c24" />
//             <Text style={styles.rejectedBadgeText}> Rejected</Text>
//           </View>
//         );
//       case 'countered':
//         return (
//           <View style={[styles.badge, styles.counteredBadge]}>
//             <Icon name="swap-horizontal" size={12} color="#0c5460" />
//             <Text style={styles.counteredBadgeText}> Counter Offer</Text>
//           </View>
//         );
//       case 'paid':
//         return (
//           <View style={[styles.badge, styles.paidBadge]}>
//             <Icon name="check" size={12} color="#155724" />
//             <Text style={styles.paidBadgeText}> Paid</Text>
//           </View>
//         );
//       case 'partial':
//         return (
//           <View style={[styles.badge, styles.partialBadge]}>
//             <Icon name="alert-circle-outline" size={12} color="#856404" />
//             <Text style={styles.partialBadgeText}> Partial</Text>
//           </View>
//         );
//       default:
//         return (
//           <View style={[styles.badge, styles.defaultBadge]}>
//             <Text style={styles.defaultBadgeText}>{status}</Text>
//           </View>
//         );
//     }
//   };

//   const getNotificationIcon = (notification: Notification) => {
//     if (notification.type === 'payment' || notification.type === 'payment_received') {
//       return <Icon name="currency-inr" size={24} color="#28a745" />;
//     }
    
//     switch (notification.status) {
//       case 'pending':
//         return <Icon name="clock-outline" size={24} color="#ffc107" />;
//       case 'accepted':
//         return <Icon name="check-circle-outline" size={24} color="#28a745" />;
//       case 'rejected':
//         return <Icon name="close-circle-outline" size={24} color="#dc3545" />;
//       case 'countered':
//         return <Icon name="swap-horizontal" size={24} color="#17a2b8" />;
//       default:
//         return <Icon name="bell-outline" size={24} color="#6c757d" />;
//     }
//   };

//   const getNotificationMessage = (notification: Notification) => {
//     if (notification.type === 'payment' || notification.type === 'payment_status') {
//       return notification.message || 'Payment status update';
//     }
//     if (notification.type === 'payment_received') {
//       return notification.message || 'Payment received';
//     }

//     switch (notification.status) {
//       case 'accepted':
//         return 'Your offer was accepted by the farmer';
//       case 'rejected':
//         return 'Your offer was rejected by the farmer';
//       case 'countered':
//         return 'Farmer sent you a counter offer';
//       case 'pending':
//         return 'Your offer is pending review';
//       default:
//         return 'Offer update';
//     }
//   };

//   const filteredNotifications = notifications.filter(n => {
//     if (filter === 'all') return true;
//     if (filter === 'unread') return !n.isRead;
//     if (filter === 'offers') return !n.type || n.type === 'offer';
//     if (filter === 'payments') return n.type === 'payment' || n.type === 'payment_received';
//     return true;
//   });

//   const formatTimeAgo = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

//     if (seconds < 60) return 'Just now';
//     if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
//     if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
//     if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
//     return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
//   };

//   const offerCount = notifications.filter(n => !n.type || n.type === 'offer').length;
//   const paymentCount = notifications.filter(n => n.type === 'payment' || n.type === 'payment_received').length;

//   const renderNotificationItem = ({ item }: { item: Notification }) => (
//     <TouchableOpacity
//       style={[
//         styles.notificationCard,
//         !item.isRead && styles.unreadNotificationCard
//       ]}
//       onPress={() => markAsRead(item)}
//       activeOpacity={0.8}
//     >
//       <View style={styles.notificationContent}>
//         <View style={styles.notificationHeader}>
//           <View style={styles.iconContainer}>
//             {getNotificationIcon(item)}
//           </View>
//           <View style={styles.headerContent}>
//             <View style={styles.titleContainer}>
//               {!item.isRead && (
//                 <View style={styles.unreadDot} />
//               )}
//               <Text style={styles.notificationTitle}>
//                 {getNotificationMessage(item)}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Payment Notification */}
//         {(item.type === 'payment' || item.type === 'payment_received') && (
//           <View style={styles.paymentSection}>
//             <View style={styles.badgeContainer}>
//               <View style={styles.orderBadge}>
//                 <Icon name="receipt" size={12} color="#fff" />
//                 <Text style={styles.orderBadgeText}> {item.orderId}</Text>
//               </View>
//               {item.paymentStatus && getStatusBadge(item.paymentStatus)}
//               {item.razorpayPaymentId && (
//                 <View style={styles.razorpayBadge}>
//                   <Icon name="check-circle" size={12} color="#28a745" />
//                   <Text style={styles.razorpayBadgeText}> {item.razorpayPaymentId.substring(0, 8)}...</Text>
//                 </View>
//               )}
//             </View>

//             {item.type === 'payment_received' && (
//               <View style={styles.paymentReceivedAlert}>
//                 <View style={styles.paymentReceivedHeader}>
//                   <Icon name="check-circle" size={16} color="#28a745" />
//                   <Text style={styles.paymentReceivedText}>
//                     {' '}Payment Received: ₹{item.amount?.toFixed(2)}
//                   </Text>
//                 </View>
//                 {item.paidDate && (
//                   <Text style={styles.paymentDate}>
//                     Paid on: {new Date(item.paidDate).toLocaleString('en-IN')}
//                   </Text>
//                 )}
//               </View>
//             )}

//             {item.type === 'payment' && (
//               <View style={styles.paymentDetails}>
//                 <View style={styles.paymentRow}>
//                   <View style={styles.paymentColumn}>
//                     <Text style={styles.paymentLabel}>Total Amount:</Text>
//                     <Text style={styles.paymentValue}>₹{item.totalAmount?.toFixed(2)}</Text>
//                   </View>
//                   <View style={styles.paymentColumn}>
//                     <Text style={styles.paymentLabel}>Paid:</Text>
//                     <Text style={[styles.paymentValue, styles.paidValue]}>
//                       ₹{item.paidAmount?.toFixed(2)}
//                     </Text>
//                   </View>
//                   <View style={styles.paymentColumn}>
//                     <Text style={styles.paymentLabel}>Remaining:</Text>
//                     <Text style={[styles.paymentValue, styles.remainingValue]}>
//                       ₹{item.remainingAmount?.toFixed(2)}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             )}

//             {item.fees && (
//               <View style={styles.feesContainer}>
//                 <Icon name="information-outline" size={14} color="#6c757d" />
//                 <Text style={styles.feesText}>
//                   {' '}Labour Fee: ₹{item.fees.labourFee} | Transport Fee: ₹{item.fees.transportFee}
//                 </Text>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Offer Notification */}
//         {(!item.type || item.type === 'offer') && (
//           <View style={styles.offerSection}>
//             <View style={styles.badgeContainer}>
//               {item.status && getStatusBadge(item.status)}
//               {item.productCode && (
//                 <View style={styles.productCodeBadge}>
//                   <Icon name="package-variant" size={12} color="#495057" />
//                   <Text style={styles.productCodeText}> {item.productCode}</Text>
//                 </View>
//               )}
//               {item.gradeName && (
//                 <View style={styles.gradeBadge}>
//                   <Text style={styles.gradeText}>{item.gradeName}</Text>
//                 </View>
//               )}
//             </View>

//             {item.productName && (
//               <Text style={styles.productName}>
//                 <Text style={styles.productNameBold}>{item.productName}</Text>
//                 {item.categoryName && ` - ${item.categoryName}`}
//                 {item.subCategoryName && ` › ${item.subCategoryName}`}
//               </Text>
//             )}

//             <View style={styles.offerDetails}>
//               <View style={styles.offerRow}>
//                 <Icon name="currency-inr" size={16} color="#28a745" />
//                 <Text style={styles.offerText}>
//                   <Text style={styles.offerLabel}> Your Offer:</Text>
//                   {' '}₹{item.offeredPrice} × {item.quantity} {item.unitMeasurement}
//                 </Text>
//               </View>
//               <Text style={styles.totalAmount}>= ₹{item.totalAmount?.toFixed(2)}</Text>
//             </View>

//             {item.nearestMarket && (
//               <View style={styles.marketRow}>
//                 <Icon name="map-marker-outline" size={16} color="#007bff" />
//                 <Text style={styles.marketText}>
//                   <Text style={styles.marketLabel}> Market:</Text> {item.nearestMarket}
//                 </Text>
//               </View>
//             )}

//             {/* Counter Offer Details */}
//             {item.status === 'countered' && item.counterPrice && (
//               <View style={styles.counterOfferAlert}>
//                 <View style={styles.counterOfferHeader}>
//                   <Icon name="swap-horizontal" size={16} color="#17a2b8" />
//                   <Text style={styles.counterOfferTitle}> Farmer's Counter Offer:</Text>
//                 </View>
//                 <Text style={styles.counterOfferDetails}>
//                   ₹{item.counterPrice} × {item.counterQuantity} {item.unitMeasurement}
//                   <Text style={styles.counterOfferTotal}>
//                     {' '}= ₹{(item.counterPrice * (item.counterQuantity || 0)).toFixed(2)}
//                   </Text>
//                 </Text>
//                 {item.counterDate && (
//                   <Text style={styles.counterDate}>
//                     Counter sent: {new Date(item.counterDate).toLocaleString('en-IN')}
//                   </Text>
//                 )}
//               </View>
//             )}

//             {item.deliveryDate && (
//               <View style={styles.deliveryRow}>
//                 <Icon name="calendar-outline" size={16} color="#6c757d" />
//                 <Text style={styles.deliveryText}>
//                   Delivery: {new Date(item.deliveryDate).toLocaleDateString('en-IN')}
//                 </Text>
//               </View>
//             )}
//           </View>
//         )}

//         <View style={styles.timeContainer}>
//           <Icon name="clock-outline" size={12} color="#6c757d" />
//           <Text style={styles.timeText}> {formatTimeAgo(item.createdAt)}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderFilterButton = (type: FilterType, label: string, count: number, icon: string) => (
//     <TouchableOpacity
//       style={[
//         styles.filterButton,
//         filter === type && styles.activeFilterButton
//       ]}
//       onPress={() => setFilter(type)}
//     >
//       <Icon
//         name={icon}
//         size={16}
//         color={filter === type ? '#fff' : '#28a745'}
//       />
//       <Text
//         style={[
//           styles.filterButtonText,
//           filter === type && styles.activeFilterButtonText
//         ]}
//       >
//         {' '}{label} ({count})
//       </Text>
//     </TouchableOpacity>
//   );

//   if (loading && !refreshing) {
//     return (
//       <SafeAreaView style={styles.loadingContainer}>
//         <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
//         <ActivityIndicator size="large" color="#28a745" />
//         <Text style={styles.loadingText}>Loading notifications...</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <Icon name="bell" size={28} color="#ffc107" />
//           <View style={styles.headerTitleContainer}>
//             <Text style={styles.headerTitle}>Notifications</Text>
//             <Text style={styles.headerSubtitle}>
//               {unreadCount > 0 && (
//                 <View style={styles.unreadCountBadge}>
//                   <Text style={styles.unreadCountText}>{unreadCount} New</Text>
//                 </View>
//               )}
//               <Text style={styles.totalCount}>{notifications.length} total notifications</Text>
//             </Text>
//           </View>
//         </View>
        
//         <View style={styles.headerActions}>
//           {unreadCount > 0 && (
//             <TouchableOpacity
//               style={styles.markAllButton}
//               onPress={markAllAsRead}
//             >
//               <Icon name="check-all" size={20} color="#28a745" />
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => navigation.navigate('AllProducts' as never)}
//           >
//             <Icon name="store" size={20} color="#28a745" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => navigation.navigate('MyPurchases' as never)}
//           >
//             <Icon name="package-variant" size={20} color="#007bff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {error && (
//         <View style={styles.errorContainer}>
//           <Icon name="alert-circle-outline" size={24} color="#dc3545" />
//           <Text style={styles.errorText}> {error}</Text>
//         </View>
//       )}

//       {/* Filter Tabs */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={styles.filterContainer}
//         contentContainerStyle={styles.filterContent}
//       >
//         {renderFilterButton('all', 'All', notifications.length, 'view-grid-outline')}
//         {renderFilterButton('unread', 'Unread', unreadCount, 'email-outline')}
//         {renderFilterButton('offers', 'Offers', offerCount, 'tag-outline')}
//         {renderFilterButton('payments', 'Payments', paymentCount, 'currency-inr')}
//       </ScrollView>

//       {/* Notifications List */}
//       {filteredNotifications.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Icon name="bell-off" size={80} color="#dee2e6" />
//           <Text style={styles.emptyTitle}>No notifications</Text>
//           <Text style={styles.emptySubtitle}>
//             {filter === 'unread' ? 'All caught up! No unread notifications.' : 'You have no notifications yet.'}
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredNotifications}
//           renderItem={renderNotificationItem}
//           keyExtractor={(item) => item._id}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={['#28a745']}
//               tintColor="#28a745"
//             />
//           }
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
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
//     marginTop: 16,
//     fontSize: 16,
//     color: '#6c757d',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#dee2e6',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerTitleContainer: {
//     marginLeft: 12,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#212529',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#6c757d',
//     marginTop: 4,
//   },
//   unreadCountBadge: {
//     backgroundColor: '#dc3545',
//     borderRadius: 12,
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     marginRight: 8,
//   },
//   unreadCountText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   totalCount: {
//     fontSize: 14,
//     color: '#6c757d',
//   },
//   headerActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   markAllButton: {
//     marginRight: 12,
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: '#e8f5e9',
//   },
//   actionButton: {
//     marginLeft: 8,
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: '#f8f9fa',
//   },
//   errorContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8d7da',
//     marginHorizontal: 16,
//     marginVertical: 12,
//     padding: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#f5c6cb',
//   },
//   errorText: {
//     color: '#721c24',
//     fontSize: 14,
//     flex: 1,
//   },
//   filterContainer: {
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#dee2e6',
//   },
//   filterContent: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   filterButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginRight: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#28a745',
//     backgroundColor: '#fff',
//   },
//   activeFilterButton: {
//     backgroundColor: '#28a745',
//     borderColor: '#28a745',
//   },
//   filterButtonText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#28a745',
//   },
//   activeFilterButtonText: {
//     color: '#fff',
//   },
//   listContent: {
//     padding: 16,
//   },
//   notificationCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     marginBottom: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   unreadNotificationCard: {
//     borderWidth: 2,
//     borderColor: '#ffc107',
//     backgroundColor: '#fffcf5',
//   },
//   notificationContent: {
//     flex: 1,
//   },
//   notificationHeader: {
//     flexDirection: 'row',
//     marginBottom: 12,
//   },
//   iconContainer: {
//     marginRight: 12,
//   },
//   headerContent: {
//     flex: 1,
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   unreadDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#dc3545',
//     marginRight: 8,
//   },
//   notificationTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#212529',
//     flex: 1,
//   },
//   badgeContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 8,
//     gap: 8,
//   },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   pendingBadge: {
//     backgroundColor: '#fff3cd',
//     borderWidth: 1,
//     borderColor: '#ffeaa7',
//   },
//   pendingBadgeText: {
//     color: '#856404',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   acceptedBadge: {
//     backgroundColor: '#d4edda',
//     borderWidth: 1,
//     borderColor: '#c3e6cb',
//   },
//   acceptedBadgeText: {
//     color: '#155724',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   rejectedBadge: {
//     backgroundColor: '#f8d7da',
//     borderWidth: 1,
//     borderColor: '#f5c6cb',
//   },
//   rejectedBadgeText: {
//     color: '#721c24',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   counteredBadge: {
//     backgroundColor: '#d1ecf1',
//     borderWidth: 1,
//     borderColor: '#bee5eb',
//   },
//   counteredBadgeText: {
//     color: '#0c5460',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   paidBadge: {
//     backgroundColor: '#d4edda',
//     borderWidth: 1,
//     borderColor: '#c3e6cb',
//   },
//   paidBadgeText: {
//     color: '#155724',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   partialBadge: {
//     backgroundColor: '#fff3cd',
//     borderWidth: 1,
//     borderColor: '#ffeaa7',
//   },
//   partialBadgeText: {
//     color: '#856404',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   defaultBadge: {
//     backgroundColor: '#e2e3e5',
//     borderWidth: 1,
//     borderColor: '#d6d8db',
//   },
//   defaultBadgeText: {
//     color: '#383d41',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   orderBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#007bff',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   orderBadgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   razorpayBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#dee2e6',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   razorpayBadgeText: {
//     color: '#212529',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   paymentSection: {
//     marginBottom: 12,
//   },
//   paymentReceivedAlert: {
//     backgroundColor: '#d4edda',
//     borderWidth: 1,
//     borderColor: '#c3e6cb',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 8,
//   },
//   paymentReceivedHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   paymentReceivedText: {
//     color: '#155724',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   paymentDate: {
//     color: '#6c757d',
//     fontSize: 12,
//   },
//   paymentDetails: {
//     marginBottom: 8,
//   },
//   paymentRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   paymentColumn: {
//     flex: 1,
//   },
//   paymentLabel: {
//     fontSize: 12,
//     color: '#6c757d',
//     marginBottom: 2,
//   },
//   paymentValue: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#212529',
//   },
//   paidValue: {
//     color: '#28a745',
//   },
//   remainingValue: {
//     color: '#dc3545',
//   },
//   feesContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   feesText: {
//     fontSize: 12,
//     color: '#6c757d',
//   },
//   offerSection: {
//     marginBottom: 12,
//   },
//   productCodeBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#dee2e6',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   productCodeText: {
//     color: '#495057',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   gradeBadge: {
//     backgroundColor: '#f8f9fa',
//     borderWidth: 1,
//     borderColor: '#dee2e6',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   gradeText: {
//     color: '#495057',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   productName: {
//     fontSize: 14,
//     color: '#6c757d',
//     marginBottom: 8,
//   },
//   productNameBold: {
//     fontWeight: '600',
//     color: '#212529',
//   },
//   offerDetails: {
//     marginBottom: 8,
//   },
//   offerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   offerText: {
//     fontSize: 14,
//     color: '#212529',
//     marginLeft: 4,
//   },
//   offerLabel: {
//     fontWeight: '600',
//   },
//   totalAmount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#28a745',
//     marginLeft: 24,
//   },
//   marketRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   marketText: {
//     fontSize: 14,
//     color: '#212529',
//     marginLeft: 4,
//   },
//   marketLabel: {
//     fontWeight: '600',
//   },
//   counterOfferAlert: {
//     backgroundColor: '#d1ecf1',
//     borderWidth: 1,
//     borderColor: '#bee5eb',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 8,
//   },
//   counterOfferHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   counterOfferTitle: {
//     color: '#0c5460',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   counterOfferDetails: {
//     fontSize: 14,
//     color: '#0c5460',
//     marginBottom: 4,
//   },
//   counterOfferTotal: {
//     fontWeight: 'bold',
//     color: '#28a745',
//   },
//   counterDate: {
//     fontSize: 12,
//     color: '#6c757d',
//   },
//   deliveryRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   deliveryText: {
//     fontSize: 12,
//     color: '#6c757d',
//     marginLeft: 4,
//   },
//   timeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     marginTop: 8,
//   },
//   timeText: {
//     fontSize: 12,
//     color: '#6c757d',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyTitle: {
//     fontSize: 20,
//     color: '#6c757d',
//     fontWeight: '600',
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     color: '#adb5bd',
//     textAlign: 'center',
//   },
// });

// export default TraderNotifications;  





import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface Notification {
  _id: string;
  type?: 'payment' | 'payment_received' | 'payment_status' | 'offer';
  offerId?: string;
  productId?: string;
  productName?: string;
  productCode?: string;
  farmerId?: string;
  farmerName?: string;
  gradeId?: string;
  gradeName?: string;
  offeredPrice?: number;
  quantity?: number;
  totalAmount: number;
  status?: 'pending' | 'accepted' | 'rejected' | 'countered';
  counterPrice?: number;
  counterQuantity?: number;
  counterDate?: string;
  isRead: boolean;
  notificationReadAt?: string;
  createdAt: string;
  unitMeasurement?: string;
  categoryName?: string;
  subCategoryName?: string;
  nearestMarket?: string;
  deliveryDate?: string;
  orderId?: string;
  orderObjectId?: string;
  paymentId?: string;
  amount?: number;
  paidDate?: string;
  paidAmount?: number;
  remainingAmount?: number;
  paymentStatus?: string;
  fees?: {
    labourFee: number;
    transportFee: number;
  };
  message?: string;
  razorpayPaymentId?: string;
}

type FilterType = 'all' | 'unread' | 'offers' | 'payments';

const TraderNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<FilterType>('all');
  const navigation = useNavigation();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const traderId = await AsyncStorage.getItem('traderId');
      
      if (!traderId) {
        throw new Error('Trader not logged in');
      }

      const response = await fetch(`https://kisan.etpl.ai/product/trader-notifications/${traderId}`);
      const data = await response.json();

      console.log('API Response:', data); // Debug log

      if (data.success) {
        setNotifications(data.data || []);
        setUnreadCount(data.unreadCount || 0);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch notifications');
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markAsRead = async (notification: Notification) => {
    if (notification.isRead) return;

    try {
      const body: any = {
        notificationId: notification._id,
        traderId: await AsyncStorage.getItem('traderId'),
      };

      if (notification.type === 'payment' || notification.type === 'payment_status') {
        body.type = 'payment';
        body.orderObjectId = notification.orderObjectId;
      } else if (notification.type === 'payment_received') {
        body.type = 'payment_received';
        body.orderObjectId = notification.orderObjectId;
        body.paymentId = notification.paymentId;
      } else {
        body.type = 'offer';
        body.productId = notification.productId;
        body.gradeId = notification.gradeId;
        body.offerId = notification._id;
      }

      const response = await fetch('https://kisan.etpl.ai/product/mark-trader-notification-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (data.success) {
        // Update local state immediately for better UX
        setNotifications(prev => prev.map(n => 
          n._id === notification._id ? { ...n, isRead: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const traderId = await AsyncStorage.getItem('traderId');
      const response = await fetch('https://kisan.etpl.ai/product/mark-all-trader-notifications-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ traderId })
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', `${data.updatedCount} notifications marked as read`);
        // Update all notifications to read
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      Alert.alert('Error', 'Error marking all as read');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <View style={[styles.badge, styles.pendingBadge]}>
            <Icon name="clock-outline" size={10} color="#856404" />
            <Text style={styles.pendingBadgeText}> Pending</Text>
          </View>
        );
      case 'accepted':
        return (
          <View style={[styles.badge, styles.acceptedBadge]}>
            <Icon name="check-circle-outline" size={10} color="#155724" />
            <Text style={styles.acceptedBadgeText}> Accepted</Text>
          </View>
        );
      case 'rejected':
        return (
          <View style={[styles.badge, styles.rejectedBadge]}>
            <Icon name="close-circle-outline" size={10} color="#721c24" />
            <Text style={styles.rejectedBadgeText}> Rejected</Text>
          </View>
        );
      case 'countered':
        return (
          <View style={[styles.badge, styles.counteredBadge]}>
            <Icon name="swap-horizontal" size={10} color="#0c5460" />
            <Text style={styles.counteredBadgeText}> Counter</Text>
          </View>
        );
      case 'paid':
        return (
          <View style={[styles.badge, styles.paidBadge]}>
            <Icon name="check" size={10} color="#155724" />
            <Text style={styles.paidBadgeText}> Paid</Text>
          </View>
        );
      case 'partial':
        return (
          <View style={[styles.badge, styles.partialBadge]}>
            <Icon name="alert-circle-outline" size={10} color="#856404" />
            <Text style={styles.partialBadgeText}> Partial</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.badge, styles.defaultBadge]}>
            <Text style={styles.defaultBadgeText}>{status}</Text>
          </View>
        );
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    if (notification.type === 'payment' || notification.type === 'payment_received' || notification.type === 'payment_status') {
      return <Icon name="cash-multiple" size={22} color="#28a745" />;
    }
    
    switch (notification.status) {
      case 'pending':
        return <Icon name="clock-outline" size={22} color="#ffc107" />;
      case 'accepted':
        return <Icon name="check-circle-outline" size={22} color="#28a745" />;
      case 'rejected':
        return <Icon name="close-circle-outline" size={22} color="#dc3545" />;
      case 'countered':
        return <Icon name="swap-horizontal" size={22} color="#17a2b8" />;
      default:
        return <Icon name="bell-outline" size={22} color="#6c757d" />;
    }
  };

  const getNotificationMessage = (notification: Notification) => {
    if (notification.type === 'payment') {
      return notification.message || 'Payment update';
    }
    if (notification.type === 'payment_status') {
      return notification.message || 'Payment status update';
    }
    if (notification.type === 'payment_received') {
      return notification.message || 'Payment received';
    }

    switch (notification.status) {
      case 'accepted':
        return 'Offer accepted by farmer';
      case 'rejected':
        return 'Offer rejected by farmer';
      case 'countered':
        return 'Farmer sent counter offer';
      case 'pending':
        return 'Offer pending review';
      default:
        return 'Offer update';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    if (filter === 'offers') return !n.type || n.type === 'offer';
    if (filter === 'payments') return n.type === 'payment' || n.type === 'payment_received' || n.type === 'payment_status';
    return true;
  });

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (seconds < 60) return 'Just now';
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
      
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch (e) {
      return 'Recently';
    }
  };

  const offerCount = notifications.filter(n => !n.type || n.type === 'offer').length;
  const paymentCount = notifications.filter(n => n.type === 'payment' || n.type === 'payment_received' || n.type === 'payment_status').length;

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.isRead && styles.unreadNotificationCard
      ]}
      onPress={() => markAsRead(item)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <View style={styles.iconContainer}>
            {getNotificationIcon(item)}
          </View>
          <View style={styles.headerContent}>
            <View style={styles.titleRow}>
              {!item.isRead && (
                <View style={styles.unreadDot} />
              )}
              <Text style={styles.notificationTitle} numberOfLines={1}>
                {getNotificationMessage(item)}
              </Text>
              <Text style={styles.timeText}>
                {formatTimeAgo(item.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Notification */}
        {(item.type === 'payment' || item.type === 'payment_received' || item.type === 'payment_status') && (
          <View style={styles.paymentSection}>
            <View style={styles.badgeRow}>
              {item.orderId && (
                <View style={styles.orderBadge}>
                  <Icon name="receipt" size={10} color="#fff" />
                  <Text style={styles.orderBadgeText} numberOfLines={1}>
                    {item.orderId.length > 12 ? `${item.orderId.substring(0, 12)}...` : item.orderId}
                  </Text>
                </View>
              )}
              {item.paymentStatus && getStatusBadge(item.paymentStatus)}
            </View>

            {item.type === 'payment_received' && (
              <View style={styles.paymentReceivedAlert}>
                <View style={styles.paymentReceivedRow}>
                  <Icon name="check-circle" size={14} color="#28a745" />
                  <Text style={styles.paymentReceivedText}>
                    {' '}Received: ₹{item.amount?.toFixed(2) || '0.00'}
                  </Text>
                </View>
                {item.paidDate && (
                  <Text style={styles.paymentDate}>
                    Paid on: {new Date(item.paidDate).toLocaleDateString('en-IN')}
                  </Text>
                )}
              </View>
            )}

            {item.type === 'payment' && (
              <View style={styles.paymentDetails}>
                <View style={styles.amountRow}>
                  <View style={styles.amountItem}>
                    <Text style={styles.amountLabel}>Total:</Text>
                    <Text style={styles.amountValue}>₹{item.totalAmount?.toFixed(2) || '0.00'}</Text>
                  </View>
                  <View style={styles.amountItem}>
                    <Text style={styles.amountLabel}>Paid:</Text>
                    <Text style={[styles.amountValue, styles.paidValue]}>
                      ₹{item.paidAmount?.toFixed(2) || '0.00'}
                    </Text>
                  </View>
                  <View style={styles.amountItem}>
                    <Text style={styles.amountLabel}>Remaining:</Text>
                    <Text style={[styles.amountValue, styles.remainingValue]}>
                      ₹{item.remainingAmount?.toFixed(2) || '0.00'}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Offer Notification */}
        {(!item.type || item.type === 'offer') && (
          <View style={styles.offerSection}>
            <View style={styles.badgeRow}>
              {item.status && getStatusBadge(item.status)}
              {item.productCode && (
                <View style={styles.productCodeBadge}>
                  <Icon name="package-variant" size={10} color="#495057" />
                  <Text style={styles.productCodeText} numberOfLines={1}>
                    {' '}{item.productCode}
                  </Text>
                </View>
              )}
            </View>

            {item.productName && (
              <Text style={styles.productName} numberOfLines={1}>
                <Text style={styles.productNameBold}>{item.productName}</Text>
                {item.categoryName && ` - ${item.categoryName}`}
                {item.subCategoryName && ` › ${item.subCategoryName}`}
              </Text>
            )}

            <View style={styles.offerDetails}>
              <View style={styles.offerRow}>
                <Icon name="currency-inr" size={14} color="#28a745" />
                <Text style={styles.offerText}>
                  <Text style={styles.offerLabel}> Offer:</Text>
                  {' '}₹{item.offeredPrice} × {item.quantity} {item.unitMeasurement}
                </Text>
              </View>
              <Text style={styles.totalAmount}>= ₹{item.totalAmount?.toFixed(2)}</Text>
            </View>

            {/* Counter Offer Details */}
            {item.status === 'countered' && item.counterPrice && (
              <View style={styles.counterOfferAlert}>
                <View style={styles.counterOfferRow}>
                  <Icon name="swap-horizontal" size={14} color="#17a2b8" />
                  <Text style={styles.counterOfferTitle}> Counter:</Text>
                  <Text style={styles.counterOfferDetails}>
                    {' '}₹{item.counterPrice} × {item.counterQuantity} {item.unitMeasurement}
                  </Text>
                </View>
                <Text style={styles.counterOfferTotal}>
                  = ₹{(item.counterPrice * (item.counterQuantity || 0)).toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (type: FilterType, label: string, count: number, icon: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === type && styles.activeFilterButton
      ]}
      onPress={() => setFilter(type)}
      activeOpacity={0.7}
    >
      <Icon
        name={icon}
        size={16}
        color={filter === type ? '#fff' : '#28a745'}
      />
      <Text
        style={[
          styles.filterButtonText,
          filter === type && styles.activeFilterButtonText
        ]}
        numberOfLines={1}
      >
        {' '}{label} ({count})
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Icon name="bell" size={26} color="#ffc107" />
            {unreadCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <View style={styles.headerSubtitleRow}>
              {unreadCount > 0 && (
                <View style={styles.unreadCountBadge}>
                  <Text style={styles.unreadCountText}>{unreadCount} New</Text>
                </View>
              )}
              <Text style={styles.totalCount}>
                • {notifications.length} total
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={markAllAsRead}
              activeOpacity={0.7}
            >
              <Icon name="check-all" size={22} color="#28a745" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={22} color="#dc3545" />
          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
          <TouchableOpacity onPress={fetchNotifications} style={styles.retryButton}>
            <Icon name="refresh" size={18} color="#28a745" />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {renderFilterButton('all', 'All', notifications.length, 'view-grid-outline')}
          {renderFilterButton('unread', 'Unread', unreadCount, 'email-outline')}
          {renderFilterButton('offers', 'Offers', offerCount, 'tag-outline')}
          {renderFilterButton('payments', 'Payments', paymentCount, 'cash-multiple')}
        </ScrollView>
      </View>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="bell-off" size={80} color="#e0e0e0" />
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptySubtitle}>
            {filter === 'unread' ? 'All caught up! No unread notifications.' : 'You have no notifications yet.'}
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchNotifications}>
            <Icon name="refresh" size={18} color="#fff" />
            <Text style={styles.refreshButtonText}> Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#28a745']}
              tintColor="#28a745"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyFilterContainer}>
              <Icon name="filter-off" size={60} color="#e0e0e0" />
              <Text style={styles.emptyFilterTitle}>No notifications found</Text>
              <Text style={styles.emptyFilterSubtitle}>
                Try changing your filter or check back later
              </Text>
            </View>
          }
        />
      )}

     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6c757d',
    fontFamily: 'System',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    position: 'relative',
  },
  headerBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
    fontFamily: 'System',
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  unreadCountBadge: {
    backgroundColor: '#dc3545',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadCountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'System',
  },
  totalCount: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 6,
    fontFamily: 'System',
  },
  headerActions: {
    flexDirection: 'row',
  },
  markAllButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorContent: {
    flex: 1,
    marginLeft: 12,
  },
  errorTitle: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
    marginBottom: 2,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 12,
    fontFamily: 'System',
  },
  retryButton: {
    padding: 8,
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  activeFilterButton: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6c757d',
    fontFamily: 'System',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for bottom nav
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadNotificationCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#28a745',
    backgroundColor: '#f8fff8',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
    fontFamily: 'System',
  },
  timeText: {
    fontSize: 11,
    color: '#adb5bd',
    fontFamily: 'System',
    marginLeft: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pendingBadge: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  pendingBadgeText: {
    color: '#856404',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'System',
  },
  acceptedBadge: {
    backgroundColor: '#d4edda',
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  acceptedBadgeText: {
    color: '#155724',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'System',
  },
  rejectedBadge: {
    backgroundColor: '#f8d7da',
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  rejectedBadgeText: {
    color: '#721c24',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'System',
  },
  counteredBadge: {
    backgroundColor: '#d1ecf1',
    borderWidth: 1,
    borderColor: '#bee5eb',
  },
  counteredBadgeText: {
    color: '#0c5460',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'System',
  },
  paidBadge: {
    backgroundColor: '#d4edda',
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  paidBadgeText: {
    color: '#155724',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'System',
  },
  partialBadge: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  partialBadgeText: {
    color: '#856404',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'System',
  },
  defaultBadge: {
    backgroundColor: '#e2e3e5',
    borderWidth: 1,
    borderColor: '#d6d8db',
  },
  defaultBadgeText: {
    color: '#383d41',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'System',
  },
  orderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    maxWidth: 120,
  },
  orderBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'System',
  },
  paymentSection: {
    marginBottom: 8,
  },
  paymentReceivedAlert: {
    backgroundColor: '#d4edda',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  paymentReceivedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  paymentReceivedText: {
    color: '#155724',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'System',
  },
  paymentDate: {
    color: '#6c757d',
    fontSize: 11,
    fontFamily: 'System',
  },
  paymentDetails: {
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  amountItem: {
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 11,
    color: '#6c757d',
    fontFamily: 'System',
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    fontFamily: 'System',
  },
  paidValue: {
    color: '#28a745',
  },
  remainingValue: {
    color: '#dc3545',
  },
  offerSection: {
    marginBottom: 8,
  },
  productCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  productCodeText: {
    color: '#495057',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'System',
  },
  productName: {
    fontSize: 13,
    color: '#495057',
    marginBottom: 8,
    fontFamily: 'System',
  },
  productNameBold: {
    fontWeight: '600',
    color: '#212529',
  },
  offerDetails: {
    marginBottom: 8,
  },
  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  offerText: {
    fontSize: 13,
    color: '#212529',
    marginLeft: 6,
    fontFamily: 'System',
  },
  offerLabel: {
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#28a745',
    marginLeft: 20,
    fontFamily: 'System',
  },
  counterOfferAlert: {
    backgroundColor: '#e7f6f8',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  counterOfferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  counterOfferTitle: {
    color: '#0c5460',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'System',
    marginLeft: 4,
  },
  counterOfferDetails: {
    color: '#0c5460',
    fontSize: 12,
    fontFamily: 'System',
  },
  counterOfferTotal: {
    color: '#28a745',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'System',
    marginLeft: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    color: '#6c757d',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'System',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'System',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
    marginLeft: 6,
  },
  emptyFilterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyFilterTitle: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'System',
  },
  emptyFilterSubtitle: {
    fontSize: 13,
    color: '#adb5bd',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'System',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  activeNavButton: {},
  navButtonText: {
    fontSize: 10,
    color: '#6c757d',
    marginTop: 4,
    fontFamily: 'System',
  },
  activeNavButtonText: {
    color: '#28a745',
    fontWeight: '600',
  },
});

export default TraderNotifications;