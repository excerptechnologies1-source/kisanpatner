// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// interface Notification {
//   _id: string;
//   offerId: string;
//   productId: string;
//   productName: string;
//   productCode: string;
//   gradeId: string;
//   gradeName: string;
//   traderId: string;
//   traderName: string;
//   offeredPrice: number;
//   quantity: number;
//   totalAmount: number;
//   status: 'pending' | 'accepted' | 'rejected' | 'countered';
//   counterPrice?: number;
//   counterQuantity?: number;
//   counterDate?: string;
//   isRead: boolean;
//   notificationReadAt?: string;
//   createdAt: string;
//   unitMeasurement: string;
//   categoryName: string;
//   subCategoryName: string;
// }

// const FarmerNotifications: React.FC = () => {
//   const navigation = useNavigation();
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [filter, setFilter] = useState<'all' | 'unread' | 'pending' | 'accepted' | 'rejected' | 'countered'>('all');

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const farmerId = await AsyncStorage.getItem('farmerId');
//       if (!farmerId) {
//         throw new Error('Farmer not logged in');
//       }

//       const response = await fetch(`https://kisan.etpl.ai/product/farmer-notifications/${farmerId}`);
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
//       const response = await fetch('https://kisan.etpl.ai/product/mark-notification-read', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           productId: notification.productId,
//           gradeId: notification.gradeId,
//           offerId: notification._id
//         })
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
//       const farmerId = await AsyncStorage.getItem('farmerId');
//       const response = await fetch('https://kisan.etpl.ai/product/mark-all-notifications-read', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ farmerId })
//       });

//       const data = await response.json();
//       if (data.success) {
//         Alert.alert('Success', `✅ ${data.updatedCount} notifications marked as read`);
//         fetchNotifications();
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Error marking all as read');
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       pending: { icon: '⏳', label: 'Pending', bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200' },
//       accepted: { icon: '✓', label: 'Accepted', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200' },
//       rejected: { icon: '✗', label: 'Rejected', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' },
//       countered: { icon: '💬', label: 'Countered', bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200' },
//     };

//     const config = statusConfig[status as keyof typeof statusConfig] || { 
//       icon: '', label: status, bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200'
//     };

//     return (
//       <View className={`px-3 py-1.5 rounded-full border ${config.bgColor} ${config.borderColor}`}>
//         <Text className={`text-xs font-medium ${config.textColor}`}>
//           {config.icon} {config.label}
//         </Text>
//       </View>
//     );
//   };

//   const getNotificationMessage = (notification: Notification) => {
//     switch (notification.status) {
//       case 'pending':
//         return `New offer received from ${notification.traderName}`;
//       case 'accepted':
//         return `You accepted ${notification.traderName}'s offer`;
//       case 'rejected':
//         return `You rejected ${notification.traderName}'s offer`;
//       case 'countered':
//         return `You sent a counter offer to ${notification.traderName}`;
//       default:
//         return `Offer update from ${notification.traderName}`;
//     }
//   };

//   const filteredNotifications = notifications.filter(n => {
//     if (filter === 'all') return true;
//     if (filter === 'unread') return !n.isRead;
//     return n.status === filter;
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

//   if (loading && !refreshing) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#10B981" />
//         <Text className="mt-4 text-base text-gray-600 font-medium">Loading notifications...</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-white pt-16 pb-5 px-5 border-b border-gray-100 shadow-sm">
//         <View className="flex-row items-center justify-between mb-2">
//           <Text className="text-3xl font-medium text-gray-900">Notifications</Text>
//           {unreadCount > 0 && (
//             <View className="bg-emerald-500 px-3 py-1.5 rounded-full">
//               <Text className="text-white text-sm font-medium">{unreadCount} New</Text>
//             </View>
//           )}
//         </View>
//         <Text className="text-sm text-gray-500 mb-4">{notifications.length} total notifications</Text>
//         {unreadCount > 0 && (
//           <TouchableOpacity 
//             className="bg-indigo-50 px-4 py-3 rounded-xl active:bg-indigo-100"
//             onPress={markAllAsRead}
//           >
//             <Text className="text-indigo-600 text-sm font-medium text-center">Mark All Read</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {error && (
//         <View className="bg-red-50 p-4 mx-5 mt-4 rounded-xl border-l-4 border-red-500">
//           <Text className="text-red-800 text-sm">⚠️ {error}</Text>
//         </View>
//       )}

//       {/* Filter Tabs */}
//       <ScrollView 
//         horizontal 
//         showsHorizontalScrollIndicator={false}
//         className="bg-white py-3 px-4 border-b border-gray-100"
//       >
//         <TouchableOpacity
//           className={`px-4 py-2 mr-2 rounded-full ${filter === 'all' ? 'bg-emerald-500' : 'bg-gray-100'}`}
//           onPress={() => setFilter('all')}
//         >
//           <Text className={`text-sm font-medium ${filter === 'all' ? 'text-white' : 'text-gray-600'}`}>
//             All ({notifications.length})
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className={`px-4 py-2 mr-2 rounded-full ${filter === 'unread' ? 'bg-emerald-500' : 'bg-gray-100'}`}
//           onPress={() => setFilter('unread')}
//         >
//           <Text className={`text-sm font-medium ${filter === 'unread' ? 'text-white' : 'text-gray-600'}`}>
//             Unread ({unreadCount})
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className={`px-4 py-2 mr-2 rounded-full ${filter === 'pending' ? 'bg-emerald-500' : 'bg-gray-100'}`}
//           onPress={() => setFilter('pending')}
//         >
//           <Text className={`text-sm font-medium ${filter === 'pending' ? 'text-white' : 'text-gray-600'}`}>
//             Pending ({notifications.filter(n => n.status === 'pending').length})
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className={`px-4 py-2 mr-2 rounded-full ${filter === 'countered' ? 'bg-emerald-500' : 'bg-gray-100'}`}
//           onPress={() => setFilter('countered')}
//         >
//           <Text className={`text-sm font-medium ${filter === 'countered' ? 'text-white' : 'text-gray-600'}`}>
//             Countered ({notifications.filter(n => n.status === 'countered').length})
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className={`px-4 py-2 rounded-full ${filter === 'accepted' ? 'bg-emerald-500' : 'bg-gray-100'}`}
//           onPress={() => setFilter('accepted')}
//         >
//           <Text className={`text-sm font-medium ${filter === 'accepted' ? 'text-white' : 'text-gray-600'}`}>
//             Accepted ({notifications.filter(n => n.status === 'accepted').length})
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* Notifications List */}
//       <ScrollView
//         className="flex-1 px-4 pt-4"
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10B981']} />}
//       >
//         {filteredNotifications.length === 0 ? (
//           <View className="items-center justify-center py-16">
//             <Text className="text-6xl mb-4">📭</Text>
//             <Text className="text-xl font-medium text-gray-900 mb-2">No notifications</Text>
//             <Text className="text-sm text-gray-500 text-center">
//               {filter === 'unread' ? 'All caught up! No unread notifications.' : 'You have no notifications yet.'}
//             </Text>
//           </View>
//         ) : (
//           filteredNotifications.map((notification) => (
//             <TouchableOpacity
//               key={notification._id}
//               className={`bg-white rounded-2xl p-4 mb-3 border-l-4 ${
//                 notification.isRead ? 'border-gray-200' : 'border-emerald-500 bg-emerald-50/30'
//               }`}
//               onPress={() => markAsRead(notification)}
//               activeOpacity={0.7}
//             >
//               {!notification.isRead && (
//                 <View className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-emerald-500" />
//               )}
              
//               <View className="flex-1">
//                 <Text className="text-base font-medium text-gray-900 mb-2 pr-4">
//                   {getNotificationMessage(notification)}
//                 </Text>
                
//                 <View className="flex-row items-center mb-3 flex-wrap gap-2">
//                   {getStatusBadge(notification.status)}
//                   <View className="bg-gray-100 px-2.5 py-1 rounded-md">
//                     <Text className="text-xs text-gray-700 font-medium">{notification.productCode}</Text>
//                   </View>
//                   <View className="bg-gray-100 px-2.5 py-1 rounded-md">
//                     <Text className="text-xs text-gray-700 font-medium">{notification.gradeName}</Text>
//                   </View>
//                 </View>

//                 <Text className="text-sm text-gray-700 mb-2 font-medium">
//                   {notification.productName}
//                 </Text>
                
//                 <Text className="text-xs text-gray-500 mb-3">
//                   {notification.categoryName} › {notification.subCategoryName}
//                 </Text>

//                 <View className="bg-gray-50 p-3 rounded-xl mb-2">
//                   <Text className="text-xs text-gray-500 mb-1">Trader</Text>
//                   <Text className="text-sm font-medium text-gray-900">{notification.traderName}</Text>
//                 </View>

//                 <View className="bg-blue-50 p-3 rounded-xl border border-blue-100 mb-2">
//                   <Text className="text-xs text-blue-600 mb-1 font-medium">OFFER DETAILS</Text>
//                   <Text className="text-sm text-gray-900 font-medium">
//                     ₹{notification.offeredPrice} × {notification.quantity} {notification.unitMeasurement}
//                   </Text>
//                   <Text className="text-lg font-medium text-blue-700 mt-1">
//                     ₹{notification.totalAmount.toFixed(2)}
//                   </Text>
//                 </View>

//                 {notification.status === 'countered' && notification.counterPrice && (
//                   <View className="bg-purple-50 p-3 rounded-xl border border-purple-200 mb-2">
//                     <Text className="text-xs text-purple-600 mb-1 font-medium">YOUR COUNTER OFFER</Text>
//                     <Text className="text-sm text-gray-900 font-medium">
//                       ₹{notification.counterPrice} × {notification.counterQuantity} {notification.unitMeasurement}
//                     </Text>
//                     <Text className="text-lg font-medium text-purple-700 mt-1">
//                       ₹{(notification.counterPrice * notification.counterQuantity!).toFixed(2)}
//                     </Text>
//                   </View>
//                 )}

//                 <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
//                   <Text className="text-xs text-gray-400">{formatTimeAgo(notification.createdAt)}</Text>
//                   {notification.isRead && notification.notificationReadAt && (
//                     <Text className="text-xs text-emerald-600 font-medium">✓ Read</Text>
//                   )}
//                 </View>

//                 {notification.status === 'pending' && (
//                   <TouchableOpacity
//                     className="bg-emerald-500 py-3 px-4 rounded-xl mt-3 active:bg-emerald-600"
//                     onPress={(e) => {
//                       e.stopPropagation();
//                       navigation.navigate('OfferDetails' as never, { offerId: notification._id } as never);
//                     }}
//                   >
//                     <Text className="text-white text-sm font-medium text-center">View & Respond →</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </TouchableOpacity>
//           ))
//         )}
//         <View className="h-4" />
//       </ScrollView>
//     </View>
//   );
// };

// export default FarmerNotifications;





// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// interface Notification {
//   _id: string;
//   offerId: string;
//   productId: string;
//   productName: string;
//   productCode: string;
//   gradeId: string;
//   gradeName: string;
//   traderId: string;
//   traderName: string;
//   offeredPrice: number;
//   quantity: number;
//   totalAmount: number;
//   status: 'pending' | 'accepted' | 'rejected' | 'countered';
//   counterPrice?: number;
//   counterQuantity?: number;
//   counterDate?: string;
//   isRead: boolean;
//   notificationReadAt?: string;
//   createdAt: string;
//   unitMeasurement: string;
//   categoryName: string;
//   subCategoryName: string;
// }

// const FarmerNotifications: React.FC = () => {
//   const navigation = useNavigation();
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [filter, setFilter] = useState<'all' | 'unread' | 'pending' | 'accepted' | 'rejected' | 'countered'>('all');

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const farmerId = await AsyncStorage.getItem('farmerId');
//       if (!farmerId) {
//         throw new Error('Farmer not logged in');
//       }

//       const response = await fetch(`https://kisan.etpl.ai/product/farmer-notifications/${farmerId}`);
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
//       const response = await fetch('https://kisan.etpl.ai/product/mark-notification-read', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           productId: notification.productId,
//           gradeId: notification.gradeId,
//           offerId: notification._id
//         })
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
//       const farmerId = await AsyncStorage.getItem('farmerId');
//       const response = await fetch('https://kisan.etpl.ai/product/mark-all-notifications-read', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ farmerId })
//       });

//       const data = await response.json();
//       if (data.success) {
//         Alert.alert('Success', `✅ ${data.updatedCount} notifications marked as read`);
//         fetchNotifications();
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Error marking all as read');
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const statusConfig = {
//       pending: { icon: '⏳', label: 'Pending', bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200' },
//       accepted: { icon: '✓', label: 'Accepted', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200' },
//       rejected: { icon: '✗', label: 'Rejected', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' },
//       countered: { icon: '💬', label: 'Countered', bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200' },
//     };

//     const config = statusConfig[status as keyof typeof statusConfig] || { 
//       icon: '', label: status, bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200'
//     };

//     return (
//       <View className={`px-2.5 py-1 rounded-full border ${config.bgColor} ${config.borderColor}`}>
//         <Text className={`text-xs font-medium ${config.textColor}`}>
//           {config.icon} {config.label}
//         </Text>
//       </View>
//     );
//   };

//   const getNotificationMessage = (notification: Notification) => {
//     switch (notification.status) {
//       case 'pending':
//         return `New offer received from ${notification.traderName}`;
//       case 'accepted':
//         return `You accepted ${notification.traderName}'s offer`;
//       case 'rejected':
//         return `You rejected ${notification.traderName}'s offer`;
//       case 'countered':
//         return `You sent a counter offer to ${notification.traderName}`;
//       default:
//         return `Offer update from ${notification.traderName}`;
//     }
//   };

//   const filteredNotifications = notifications.filter(n => {
//     if (filter === 'all') return true;
//     if (filter === 'unread') return !n.isRead;
//     return n.status === filter;
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

//   if (loading && !refreshing) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <ActivityIndicator size="large" color="#10B981" />
//         <Text className="mt-4 text-base text-gray-600 font-medium">Loading notifications...</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-white pt-16 pb-4 px-5 border-b border-gray-100 shadow-sm">
//         <View className="flex-row items-center justify-between mb-2">
//           <Text className="text-3xl font-medium text-gray-900">Notifications</Text>
//           {unreadCount > 0 && (
//             <View className="bg-emerald-500 px-3 py-1.5 rounded-full">
//               <Text className="text-white text-sm font-medium">{unreadCount} New</Text>
//             </View>
//           )}
//         </View>
//         <Text className="text-sm text-gray-500 font-medium mb-3">{notifications.length} total notifications</Text>
//         {unreadCount > 0 && (
//           <TouchableOpacity 
//             className="bg-indigo-50 px-4 py-2.5 rounded-xl active:bg-indigo-100"
//             onPress={markAllAsRead}
//           >
//             <Text className="text-indigo-600 text-sm font-medium text-center">Mark All Read</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {error && (
//         <View className="bg-red-50 p-3 mx-5 mt-4 rounded-xl border-l-4 border-red-500">
//           <Text className="text-red-800 text-sm font-medium">⚠️ {error}</Text>
//         </View>
//       )}

//       {/* Filter Tabs */}
//       <ScrollView 
//         horizontal 
//         showsHorizontalScrollIndicator={false}
//         className="bg-white py-2 px-4 border-b border-gray-100"
//       >
//         <TouchableOpacity
//           className={`px-3 py-1.5 mr-2 rounded-full ${filter === 'all' ? 'bg-emerald-500' : 'bg-gray-100'}`}
//           onPress={() => setFilter('all')}
//         >
//           <Text className={`text-xs font-medium ${filter === 'all' ? 'text-white' : 'text-gray-600'}`}>
//             All ({notifications.length})
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className={`px-3 py-1.5 mr-2 rounded-full ${filter === 'unread' ? 'bg-emerald-500' : 'bg-gray-100'}`}
//           onPress={() => setFilter('unread')}
//         >
//           <Text className={`text-xs font-medium ${filter === 'unread' ? 'text-white' : 'text-gray-600'}`}>
//             Unread ({unreadCount})
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className={`px-3 py-1.5 mr-2 rounded-full ${filter === 'pending' ? 'bg-emerald-500' : 'bg-gray-100'}`}
//           onPress={() => setFilter('pending')}
//         >
//           <Text className={`text-xs font-medium ${filter === 'pending' ? 'text-white' : 'text-gray-600'}`}>
//             Pending ({notifications.filter(n => n.status === 'pending').length})
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className={`px-3 py-1.5 mr-2 rounded-full ${filter === 'countered' ? 'bg-emerald-500' : 'bg-gray-100'}`}
//           onPress={() => setFilter('countered')}
//         >
//           <Text className={`text-xs font-medium ${filter === 'countered' ? 'text-white' : 'text-gray-600'}`}>
//             Countered ({notifications.filter(n => n.status === 'countered').length})
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className={`px-3 py-1.5 rounded-full ${filter === 'accepted' ? 'bg-emerald-500' : 'bg-gray-100'}`}
//           onPress={() => setFilter('accepted')}
//         >
//           <Text className={`text-xs font-medium ${filter === 'accepted' ? 'text-white' : 'text-gray-600'}`}>
//             Accepted ({notifications.filter(n => n.status === 'accepted').length})
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* Notifications List */}
//       <ScrollView
//         className="flex-1 px-4 pt-4"
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10B981']} />}
//       >
//         {filteredNotifications.length === 0 ? (
//           <View className="items-center justify-center py-16">
//             <Text className="text-6xl mb-4">📭</Text>
//             <Text className="text-xl font-medium text-gray-900 mb-2">No notifications</Text>
//             <Text className="text-sm text-gray-500 font-medium text-center">
//               {filter === 'unread' ? 'All caught up! No unread notifications.' : 'You have no notifications yet.'}
//             </Text>
//           </View>
//         ) : (
//           filteredNotifications.map((notification) => (
//             <TouchableOpacity
//               key={notification._id}
//               className={`bg-white rounded-xl p-3 mb-3 border border-gray-200 ${
//                 !notification.isRead && 'bg-emerald-50/30'
//               }`}
//               onPress={() => markAsRead(notification)}
//               activeOpacity={0.7}
//             >
//               {!notification.isRead && (
//                 <View className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-500" />
//               )}
              
//               <View className="flex-1">
//                 <Text className="text-base font-medium text-gray-900 mb-2 pr-4">
//                   {getNotificationMessage(notification)}
//                 </Text>
                
//                 <View className="flex-row items-center mb-2 flex-wrap gap-2">
//                   {getStatusBadge(notification.status)}
//                   <View className="bg-gray-100 px-2 py-1 rounded-md">
//                     <Text className="text-xs text-gray-700 font-medium">{notification.productCode}</Text>
//                   </View>
//                   <View className="bg-gray-100 px-2 py-1 rounded-md">
//                     <Text className="text-xs text-gray-700 font-medium">{notification.gradeName}</Text>
//                   </View>
//                 </View>

//                 <Text className="text-sm text-gray-700 mb-2 font-medium">
//                   {notification.productName}
//                 </Text>
                
//                 <Text className="text-xs text-gray-500 font-medium mb-2">
//                   {notification.categoryName} › {notification.subCategoryName}
//                 </Text>

//                 <View className="bg-gray-50 p-2.5 rounded-lg mb-2 border border-gray-200">
//                   <Text className="text-xs text-gray-500 font-medium mb-1">Trader</Text>
//                   <Text className="text-sm font-medium text-gray-900">{notification.traderName}</Text>
//                 </View>

//                 <View className="bg-blue-50 p-2.5 rounded-lg border border-gray-200 mb-2">
//                   <Text className="text-xs text-blue-600 mb-1 font-medium">OFFER DETAILS</Text>
//                   <Text className="text-sm text-gray-900 font-medium">
//                     ₹{notification.offeredPrice} × {notification.quantity} {notification.unitMeasurement}
//                   </Text>
//                   <Text className="text-lg font-medium text-blue-700 mt-1">
//                     ₹{notification.totalAmount.toFixed(2)}
//                   </Text>
//                 </View>

//                 {notification.status === 'countered' && notification.counterPrice && (
//                   <View className="bg-purple-50 p-2.5 rounded-lg border border-gray-200 mb-2">
//                     <Text className="text-xs text-purple-600 mb-1 font-medium">YOUR COUNTER OFFER</Text>
//                     <Text className="text-sm text-gray-900 font-medium">
//                       ₹{notification.counterPrice} × {notification.counterQuantity} {notification.unitMeasurement}
//                     </Text>
//                     <Text className="text-lg font-medium text-purple-700 mt-1">
//                       ₹{(notification.counterPrice * notification.counterQuantity!).toFixed(2)}
//                     </Text>
//                   </View>
//                 )}

//                 <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-100">
//                   <Text className="text-xs text-gray-400 font-medium">{formatTimeAgo(notification.createdAt)}</Text>
//                   {notification.isRead && notification.notificationReadAt && (
//                     <Text className="text-xs text-emerald-600 font-medium">✓ Read</Text>
//                   )}
//                 </View>

//                 {notification.status === 'pending' && (
//                   <TouchableOpacity
//                     className="bg-emerald-500 py-2.5 px-4 rounded-lg mt-2 active:bg-emerald-600"
//                     onPress={(e) => {
//                       e.stopPropagation();
//                       navigation.navigate('OfferDetails' as never, { offerId: notification._id } as never);
//                     }}
//                   >
//                     <Text className="text-white text-sm font-medium text-center">View & Respond →</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </TouchableOpacity>
//           ))
//         )}
//         <View className="h-4" />
//       </ScrollView>
//     </View>
//   );
// };

// export default FarmerNotifications;









import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,

  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Notification {
  _id: string;
  offerId: string;
  productId: string;
  productName: string;
  productCode: string;
  gradeId: string;
  gradeName: string;
  traderId: string;
  traderName: string;
  offeredPrice: number;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  counterPrice?: number;
  counterQuantity?: number;
  counterDate?: string;
  isRead: boolean;
  notificationReadAt?: string;
  createdAt: string;
  unitMeasurement: string;
  categoryName: string;
  subCategoryName: string;
}

const FarmerNotifications: React.FC = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread' | 'pending' | 'accepted' | 'rejected' | 'countered'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const farmerId = await AsyncStorage.getItem('farmerId');
      if (!farmerId) {
        throw new Error('Farmer not logged in');
      }

      const response = await fetch(`https://kisan.etpl.ai/product/farmer-notifications/${farmerId}`);
      const data = await response.json();

      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.unreadCount);
        setError(null);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
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
      const response = await fetch('https://kisan.etpl.ai/product/mark-notification-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: notification.productId,
          gradeId: notification.gradeId,
          offerId: notification._id
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchNotifications();
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const farmerId = await AsyncStorage.getItem('farmerId');
      const response = await fetch('https://kisan.etpl.ai/product/mark-all-notifications-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerId })
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', `✅ ${data.updatedCount} notifications marked as read`);
        fetchNotifications();
      }
    } catch (err) {
      Alert.alert('Error', 'Error marking all as read');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { icon: '⏳', label: 'Pending', bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200' },
      accepted: { icon: '✓', label: 'Accepted', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', borderColor: 'border-emerald-200' },
      rejected: { icon: '✗', label: 'Rejected', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' },
      countered: { icon: '💬', label: 'Countered', bgColor: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      icon: '', label: status, bgColor: 'bg-gray-50', textColor: 'text-gray-700', borderColor: 'border-gray-200'
    };

    return (
      <View className={`px-2.5 py-1 rounded-full border ${config.bgColor} ${config.borderColor}`}>
        <Text className={`text-xs font-medium ${config.textColor}`}>
          {config.icon} {config.label}
        </Text>
      </View>
    );
  };

  const getNotificationMessage = (notification: Notification) => {
    switch (notification.status) {
      case 'pending':
        return `New offer received from ${notification.traderName}`;
      case 'accepted':
        return `You accepted ${notification.traderName}'s offer`;
      case 'rejected':
        return `You rejected ${notification.traderName}'s offer`;
      case 'countered':
        return `You sent a counter offer to ${notification.traderName}`;
      default:
        return `Offer update from ${notification.traderName}`;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    return n.status === filter;
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="mt-4 text-base text-gray-600 font-medium">Loading notifications...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">

      {/* Header */}
      <View className="bg-white pt-3 pb-4 px-5 border-b border-gray-100 shadow-sm">
        <View className="flex-row">
          <TouchableOpacity
                      onPress={() => router.back()}
                      className="p-2 mr-2"
                    >
                      <ChevronLeft size={24} color="#374151" />
                    </TouchableOpacity>
          <Text className="text-2xl font-medium text-gray-900">Notifications</Text>
          {unreadCount > 0 && (
            <View className="bg-emerald-500 px-3 py-1.5 rounded-full">
              <Text className="text-white text-sm font-medium">{unreadCount} New</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity 
            className="bg-indigo-50 px-4 py-2.5 rounded-xl active:bg-indigo-100"
            onPress={markAllAsRead}
          >
            <Text className="text-indigo-600 text-sm font-medium text-center">Mark All Read</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View className="bg-red-50 p-3 mx-5 mt-4 rounded-xl border-l-4 border-red-500">
          <Text className="text-red-800 text-sm font-medium">⚠️ {error}</Text>
        </View>
      )}

      {/* Filter Tabs */}
      <View className="bg-white px-5 py-3 border-b border-gray-200">
        <View className="flex-row">
          <TouchableOpacity
            className={`mr-6 pb-2 ${filter === 'all' ? 'border-b-2 border-emerald-500' : ''}`}
            onPress={() => setFilter('all')}
          >
            <Text className={`text-sm font-medium ${filter === 'all' ? 'text-emerald-600' : 'text-gray-500'}`}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`mr-6 pb-2 ${filter === 'unread' ? 'border-b-2 border-emerald-500' : ''}`}
            onPress={() => setFilter('unread')}
          >
            <Text className={`text-sm font-medium ${filter === 'unread' ? 'text-emerald-600' : 'text-gray-500'}`}>
              Unread
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`mr-6 pb-2 ${filter === 'pending' ? 'border-b-2 border-emerald-500' : ''}`}
            onPress={() => setFilter('pending')}
          >
            <Text className={`text-sm font-medium ${filter === 'pending' ? 'text-emerald-600' : 'text-gray-500'}`}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`mr-6 pb-2 ${filter === 'countered' ? 'border-b-2 border-emerald-500' : ''}`}
            onPress={() => setFilter('countered')}
          >
            <Text className={`text-sm font-medium ${filter === 'countered' ? 'text-emerald-600' : 'text-gray-500'}`}>
              Countered
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`pb-2 ${filter === 'accepted' ? 'border-b-2 border-emerald-500' : ''}`}
            onPress={() => setFilter('accepted')}
          >
            <Text className={`text-sm font-medium ${filter === 'accepted' ? 'text-emerald-600' : 'text-gray-500'}`}>
              Accepted
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10B981']} />}
      >
        {filteredNotifications.length === 0 ? (
          <View className="items-center justify-center py-16">
            <Text className="text-6xl mb-4">📭</Text>
            <Text className="text-xl font-medium text-gray-900 mb-2">No notifications</Text>
            <Text className="text-sm text-gray-500 font-medium text-center">
              {filter === 'unread' ? 'All caught up! No unread notifications.' : 'You have no notifications yet.'}
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification._id}
              className={`bg-white rounded-xl p-3 mb-3 border border-gray-200 ${
                !notification.isRead && 'bg-emerald-50/30'
              }`}
              onPress={() => markAsRead(notification)}
              activeOpacity={0.7}
            >
              {!notification.isRead && (
                <View className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-500" />
              )}
              
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900 mb-2 pr-4">
                  {getNotificationMessage(notification)}
                </Text>
                
                <View className="flex-row items-center mb-2 flex-wrap gap-2">
                  {getStatusBadge(notification.status)}
                  <View className="bg-gray-100 px-2 py-1 rounded-md">
                    <Text className="text-xs text-gray-700 font-medium">{notification.productCode}</Text>
                  </View>
                  <View className="bg-gray-100 px-2 py-1 rounded-md">
                    <Text className="text-xs text-gray-700 font-medium">{notification.gradeName}</Text>
                  </View>
                </View>

                <Text className="text-sm text-gray-700 mb-2 font-medium">
                  {notification.productName}
                </Text>
                
                <Text className="text-xs text-gray-500 font-medium mb-2">
                  {notification.categoryName} › {notification.subCategoryName}
                </Text>

                <View className="bg-gray-50 p-2.5 rounded-lg mb-2 border border-gray-200">
                  <Text className="text-xs text-gray-500 font-medium mb-1">Trader</Text>
                  <Text className="text-sm font-medium text-gray-900">{notification.traderName}</Text>
                </View>

                <View className="bg-blue-50 p-2.5 rounded-lg border border-gray-200 mb-2">
                  <Text className="text-xs text-blue-600 mb-1 font-medium">OFFER DETAILS</Text>
                  <Text className="text-sm text-gray-900 font-medium">
                    ₹{notification.offeredPrice} × {notification.quantity} {notification.unitMeasurement}
                  </Text>
                  <Text className="text-lg font-medium text-blue-700 mt-1">
                    ₹{notification.totalAmount.toFixed(2)}
                  </Text>
                </View>

                {notification.status === 'countered' && notification.counterPrice && (
                  <View className="bg-purple-50 p-2.5 rounded-lg border border-gray-200 mb-2">
                    <Text className="text-xs text-purple-600 mb-1 font-medium">YOUR COUNTER OFFER</Text>
                    <Text className="text-sm text-gray-900 font-medium">
                      ₹{notification.counterPrice} × {notification.counterQuantity} {notification.unitMeasurement}
                    </Text>
                    <Text className="text-lg font-medium text-purple-700 mt-1">
                      ₹{(notification.counterPrice * notification.counterQuantity!).toFixed(2)}
                    </Text>
                  </View>
                )}

                <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-100">
                  <Text className="text-xs text-gray-400 font-medium">{formatTimeAgo(notification.createdAt)}</Text>
                  {notification.isRead && notification.notificationReadAt && (
                    <Text className="text-xs text-emerald-600 font-medium">✓ Read</Text>
                  )}
                </View>

                {/* {notification.status === 'pending' && (
                  <TouchableOpacity
                    className="bg-emerald-500 py-2.5 px-4 rounded-lg mt-2 active:bg-emerald-600"
                    onPress={(e) => {
                      e.stopPropagation();
                      navigation.navigate('OfferDetails' as never, { offerId: notification._id } as never);
                    }}
                  >
                    <Text className="text-white text-sm font-medium text-center">View & Respond →</Text>
                  </TouchableOpacity>
                )} */}
              </View>
            </TouchableOpacity>
          ))
        )}
        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default FarmerNotifications;