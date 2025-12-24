import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Allcrops: React.FC = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [gradeOffers, setGradeOffers] = useState<{[gradeId: string]: {price: string, quantity: string}}>({});
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [quantityInput, setQuantityInput] = useState('');
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const traderId = await AsyncStorage.getItem('traderId');
      const res = await fetch(`https://kisan.etpl.ai/product/all?traderId=${traderId}`);
      const data = await res.json();
      setProducts(data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const getImageUrl = (path: string) => {
    if (!path) return 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400';
    if (path.startsWith('http')) return path;
    return `https://kisan.etpl.ai/${path}`;
  };

  const handleAcceptOffer = async (product: any, grade: any) => {
    const traderId = await AsyncStorage.getItem('traderId');
    const traderName = await AsyncStorage.getItem('traderName') || 'Unknown Trader';
    
    if (!traderId) {
      Alert.alert('Error', 'Please login as a trader first');
      return;
    }

    const maxQty = grade.totalQty;

    if (grade.quantityType === 'bulk') {
      // For bulk, directly confirm with full quantity
      const totalAmount = grade.pricePerUnit * maxQty;
      Alert.alert(
        'Confirm Purchase',
        `Product: ${product.cropBriefDetails}\nGrade: ${grade.grade}\nPrice: ₹${grade.pricePerUnit}/${product.unitMeasurement}\nQuantity: ${maxQty} ${product.unitMeasurement}\n\nTotal Amount: ₹${totalAmount.toFixed(2)}\n\nThis is a bulk purchase. You must buy the full quantity.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Confirm', 
            onPress: () => processPurchase(product, grade, traderId, traderName, maxQty)
          }
        ]
      );
    } else {
      // For flexible, show quantity input modal
      setSelectedProduct(product);
      setSelectedGrade(grade);
      setQuantityInput('');
      setShowQuantityModal(true);
    }
  };

  const handleQuantitySubmit = async () => {
    const traderId = await AsyncStorage.getItem('traderId');
    const traderName = await AsyncStorage.getItem('traderName') || 'Unknown Trader';
    
    const numQuantity = Number(quantityInput);
    const maxQty = selectedGrade.totalQty;

    if (!quantityInput || isNaN(numQuantity) || numQuantity <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    if (numQuantity > maxQty) {
      Alert.alert('Error', `Maximum available quantity is ${maxQty}`);
      return;
    }

    const totalAmount = selectedGrade.pricePerUnit * numQuantity;
    
    setShowQuantityModal(false);
    
    Alert.alert(
      'Confirm Purchase',
      `Product: ${selectedProduct.cropBriefDetails}\nGrade: ${selectedGrade.grade}\nPrice: ₹${selectedGrade.pricePerUnit}/${selectedProduct.unitMeasurement}\nQuantity: ${numQuantity} ${selectedProduct.unitMeasurement}\n\nTotal Amount: ₹${totalAmount.toFixed(2)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => processPurchase(selectedProduct, selectedGrade, traderId, traderName, numQuantity)
        }
      ]
    );
  };

  const processPurchase = async (product: any, grade: any, traderId: string, traderName: string, quantity: number) => {
    try {
      const response = await fetch('https://kisan.etpl.ai/product/accept-listed-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          gradeId: grade._id,
          traderId,
          traderName,
          quantity
        })
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert(
          '✅ Purchase Successful!',
          `Total Amount: ₹${data.data.totalAmount.toFixed(2)}\nRemaining Quantity: ${data.data.remainingQty} ${product.unitMeasurement}\n\nProceeding to payment...`
        );
        fetchProducts();
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
      Alert.alert('Error', 'Failed to process purchase. Please try again.');
    }
  };

  const handleMakeOffer = (product: any) => {
    AsyncStorage.getItem('traderId').then(traderId => {
      if (!traderId) {
        Alert.alert('Error', 'Please login as a trader first');
        return;
      }

      const initialOffers: {[key: string]: {price: string, quantity: string}} = {};
      product.gradePrices
        .filter((g: any) => g.status !== 'sold' && g.priceType === 'negotiable')
        .forEach((grade: any) => {
          initialOffers[grade._id] = {
            price: grade.pricePerUnit.toString(),
            quantity: grade.quantityType === 'bulk' ? grade.totalQty.toString() : ''
          };
        });

      setSelectedProduct(product);
      setGradeOffers(initialOffers);
      setShowOfferModal(true);
    });
  };

  const submitOffer = async () => {
    const traderId = await AsyncStorage.getItem('traderId');
    const traderName = await AsyncStorage.getItem('traderName') || 'Unknown Trader';

    const hasValidOffer = Object.values(gradeOffers).some(
      offer => offer.price && offer.quantity
    );

    if (!hasValidOffer) {
      Alert.alert('Error', 'Please enter price and quantity for at least one grade');
      return;
    }

    const offers = [];
    for (const [gradeId, offer] of Object.entries(gradeOffers)) {
      if (offer.price && offer.quantity) {
        const grade = selectedProduct.gradePrices.find((g: any) => g._id === gradeId);
        
        const numPrice = Number(offer.price);
        const numQuantity = Number(offer.quantity);

        if (numQuantity > grade.totalQty) {
          Alert.alert('Error', `${grade.grade}: Maximum available is ${grade.totalQty}`);
          return;
        }

        if (grade.quantityType === 'bulk' && numQuantity !== grade.totalQty) {
          Alert.alert('Error', `${grade.grade}: Bulk purchase requires full quantity`);
          return;
        }

        offers.push({
          gradeId,
          gradeName: grade.grade,
          offeredPrice: numPrice,
          quantity: numQuantity,
          listedPrice: grade.pricePerUnit
        });
      }
    }

    const totalAmount = offers.reduce((sum, o) => sum + (o.offeredPrice * o.quantity), 0);
    const offerSummary = offers.map(o => 
      `${o.gradeName}: ₹${o.offeredPrice} × ${o.quantity} = ₹${(o.offeredPrice * o.quantity).toFixed(2)}`
    ).join('\n');

    Alert.alert(
      'Confirm Your Bid',
      `${offerSummary}\n\nTotal Bid Amount: ₹${totalAmount.toFixed(2)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', onPress: () => processOfferSubmission(offers, traderId, traderName) }
      ]
    );
  };

  const processOfferSubmission = async (offers: any[], traderId: string, traderName: string) => {
    try {
      if (offers.length === 1) {
        const offer = offers[0];
        const response = await fetch('https://kisan.etpl.ai/product/make-offer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: selectedProduct._id,
            gradeId: offer.gradeId,
            traderId,
            traderName,
            offeredPrice: offer.offeredPrice,
            quantity: offer.quantity
          })
        });

        const data = await response.json();
        
        if (data.success) {
          Alert.alert('Success', '✅ Offer submitted successfully!\n\nThe farmer will review your bid.');
          setShowOfferModal(false);
          fetchProducts();
        } else {
          Alert.alert('Error', data.message);
        }
      } else {
        const response = await fetch('https://kisan.etpl.ai/product/make-offer-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: selectedProduct._id,
            traderId,
            traderName,
            offers: offers.map(o => ({
              gradeId: o.gradeId,
              offeredPrice: o.offeredPrice,
              quantity: o.quantity
            }))
          })
        });

        const data = await response.json();
        
        if (data.success) {
          Alert.alert('Success', '✅ All offers submitted successfully!\n\nThe farmer will review your bid.');
          setShowOfferModal(false);
          fetchProducts();
        } else {
          Alert.alert('Error', 'Some offers failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting offers:', error);
      Alert.alert('Error', 'Failed to submit offers. Please try again.');
    }
  };

  const updateGradeOffer = (gradeId: string, field: 'price' | 'quantity', value: string) => {
    setGradeOffers(prev => ({
      ...prev,
      [gradeId]: {
        ...prev[gradeId],
        [field]: value
      }
    }));
  };

  const calculateTotalBid = () => {
    return Object.entries(gradeOffers).reduce((sum, [gradeId, offer]) => {
      if (offer.price && offer.quantity) {
        return sum + (Number(offer.price) * Number(offer.quantity));
      }
      return sum;
    }, 0);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#28a745']} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>🏪 Available Products</Text>
            <Text style={styles.productCount}>{products.length} products</Text>
          </View>
          <TouchableOpacity
            style={styles.myPurchasesButton}
            onPress={() => navigation.navigate('MyPurchases' as never)}
          >
            <Text style={styles.myPurchasesButtonText}>📦 My Purchases</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={fetchProducts}>
          <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏪</Text>
            <Text style={styles.emptyTitle}>No products available</Text>
            <Text style={styles.emptySubtitle}>Check back later for new listings.</Text>
          </View>
        ) : (
          <View style={styles.productsContainer}>
            {products.map((product) => (
              <View key={product._id} style={styles.productCard}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: getImageUrl(product.cropPhotos?.[0]) }}
                    style={styles.productImage}
                  />
                  <View style={styles.farmingTypeBadge}>
                    <Text style={styles.farmingTypeText}>{product.farmingType}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.productTitle}>{product.cropBriefDetails}</Text>
                  
                  <View style={styles.badgeContainer}>
                    <View style={styles.productIdBadge}>
                      <Text style={styles.productIdText}>{product.productId}</Text>
                    </View>
                  </View>

                  <View style={styles.categoryContainer}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{product.categoryId?.categoryName}</Text>
                    </View>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{product.subCategoryId?.subCategoryName}</Text>
                    </View>
                  </View>

                  {product.gradePrices
                    .filter((grade: any) => grade.status !== 'sold')
                    .map((grade: any) => (
                    <View key={grade._id} style={styles.gradeContainer}>
                      <View style={styles.gradeInfo}>
                        <View style={styles.gradeHeader}>
                          <Text style={styles.gradeName}>{grade.grade}</Text>
                          {grade.status === 'partially_sold' && (
                            <View style={styles.partiallySoldBadge}>
                              <Text style={styles.partiallySoldText}>Partially Sold</Text>
                            </View>
                          )}
                        </View>
                        
                        <Text style={styles.gradePrice}>
                          ₹{grade.pricePerUnit}/{product.unitMeasurement || 'unit'}
                        </Text>
                        
                        <View style={styles.quantityRow}>
                          <Text style={styles.quantityText}>
                            Qty: {grade.totalQty} {product.unitMeasurement || 'units'}
                          </Text>
                          {grade.quantityType === 'bulk' && (
                            <View style={styles.bulkBadge}>
                              <Text style={styles.bulkText}>Bulk Only</Text>
                            </View>
                          )}
                        </View>
                        
                        <Text style={styles.priceTypeText}>
                          {grade.priceType === 'fixed' ? '🔒 Fixed Price' : '💬 Negotiable'}
                        </Text>
                      </View>

                      <View style={styles.gradeActions}>
                        <TouchableOpacity
                          style={[styles.acceptButton, grade.totalQty === 0 && styles.disabledButton]}
                          onPress={() => handleAcceptOffer(product, grade)}
                          disabled={grade.totalQty === 0}
                        >
                          <Text style={styles.acceptButtonText}>Accept Price</Text>
                        </TouchableOpacity>
                        
                        {grade.priceType === 'negotiable' && (
                          <TouchableOpacity
                            style={[styles.offerButton, grade.totalQty === 0 && styles.disabledButton]}
                            onPress={() => handleMakeOffer(product)}
                            disabled={grade.totalQty === 0}
                          >
                            <Text style={styles.offerButtonText}>Make Offer</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}

                  {product.gradePrices.some((g: any) => g.priceType === 'negotiable' && g.status !== 'sold') && (
                    <TouchableOpacity
                      style={styles.makeOfferAllButton}
                      onPress={() => handleMakeOffer(product)}
                    >
                      <Text style={styles.makeOfferAllButtonText}>Make Offer for All Grades</Text>
                    </TouchableOpacity>
                  )}

                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📦</Text>
                    <Text style={styles.detailText}>
                      {product.packageMeasurement} {product.packagingType}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📅</Text>
                    <Text style={styles.detailText}>
                      {new Date(product.deliveryDate).toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>🕐</Text>
                    <Text style={styles.detailText}>{product.deliveryTime}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📍</Text>
                    <Text style={styles.detailText}>{product.nearestMarket}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Quantity Input Modal */}
      <Modal
        visible={showQuantityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQuantityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.quantityModalContent}>
            <Text style={styles.modalTitle}>Enter Quantity</Text>
            
            {selectedGrade && selectedProduct && (
              <Text style={styles.modalSubtitle}>
                Max: {selectedGrade.totalQty} {selectedProduct.unitMeasurement}
              </Text>
            )}

            <TextInput
              style={styles.quantityInput}
              value={quantityInput}
              onChangeText={setQuantityInput}
              keyboardType="numeric"
              placeholder="Enter quantity"
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowQuantityModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleQuantitySubmit}
              >
                <Text style={styles.modalSubmitButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Offer Modal */}
      <Modal
        visible={showOfferModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOfferModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.offerModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bid by Trader - All Grades</Text>
              <TouchableOpacity onPress={() => setShowOfferModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.tipContainer}>
                <Text style={styles.tipText}>
                  💡 Tip: Enter your offer for each grade. Leave blank if you don't want to bid on that grade.
                </Text>
              </View>

              {selectedProduct && (
                <>
                  <Text style={styles.productNameInModal}>{selectedProduct.cropBriefDetails}</Text>

                  {selectedProduct.gradePrices
                    .filter((g: any) => g.status !== 'sold' && g.priceType === 'negotiable')
                    .map((grade: any) => {
                      const offer = gradeOffers[grade._id] || { price: '', quantity: '' };
                      const amount = offer.price && offer.quantity 
                        ? (Number(offer.price) * Number(offer.quantity)).toFixed(2)
                        : '-';
                      
                      return (
                        <View key={grade._id} style={styles.gradeOfferRow}>
                          <View style={styles.gradeOfferHeader}>
                            <Text style={styles.gradeOfferName}>{grade.grade}</Text>
                            {grade.quantityType === 'bulk' && (
                              <View style={styles.bulkBadge}>
                                <Text style={styles.bulkText}>Bulk</Text>
                              </View>
                            )}
                          </View>

                          <View style={styles.offerInputContainer}>
                            <View style={styles.inputGroup}>
                              <Text style={styles.inputLabel}>Price (₹)</Text>
                              <TextInput
                                style={styles.offerInput}
                                placeholder={`₹${grade.pricePerUnit}`}
                                value={offer.price}
                                onChangeText={(value) => updateGradeOffer(grade._id, 'price', value)}
                                keyboardType="numeric"
                              />
                            </View>

                            <View style={styles.inputGroup}>
                              <Text style={styles.inputLabel}>Qty ({selectedProduct.unitMeasurement})</Text>
                              <TextInput
                                style={styles.offerInput}
                                placeholder={`Max: ${grade.totalQty}`}
                                value={offer.quantity}
                                onChangeText={(value) => updateGradeOffer(grade._id, 'quantity', value)}
                                keyboardType="numeric"
                                editable={grade.quantityType !== 'bulk'}
                              />
                            </View>
                          </View>

                          <Text style={styles.offerAmount}>
                            Amount: <Text style={styles.offerAmountValue}>
                              {amount !== '-' ? `₹${amount}` : '-'}
                            </Text>
                          </Text>
                        </View>
                      );
                    })}

                  <View style={styles.totalBidContainer}>
                    <Text style={styles.totalBidLabel}>Total Bid Amount:</Text>
                    <Text style={styles.totalBidAmount}>₹{calculateTotalBid().toFixed(2)}</Text>
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowOfferModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={submitOffer}
              >
                <Text style={styles.modalSubmitButtonText}>Submit Bid</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  productCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  myPurchasesButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  myPurchasesButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  refreshButton: {
    margin: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#28a745',
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#28a745',
    fontWeight: '600',
    fontSize: 14,
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
  },
  productsContainer: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  farmingTypeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  farmingTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    padding: 16,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  productIdBadge: {
    backgroundColor: '#007bff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  productIdText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  categoryText: {
    color: '#333',
    fontSize: 12,
  },
  gradeContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  gradeInfo: {
    marginBottom: 8,
  },
  gradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  gradeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  partiallySoldBadge: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  partiallySoldText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
  },
  gradePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  quantityText: {
    fontSize: 12,
    color: '#666',
  },
  bulkBadge: {
    backgroundColor: '#17a2b8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  bulkText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  priceTypeText: {
    fontSize: 12,
    color: '#666',
  },
  gradeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  offerButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  offerButtonText: {
    color: '#28a745',
    fontWeight: '600',
    fontSize: 13,
  },
  disabledButton: {
    opacity: 0.5,
  },
  makeOfferAllButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  makeOfferAllButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  offerModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxWidth: 600,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  tipContainer: {
    backgroundColor: '#d1ecf1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  tipText: {
    fontSize: 12,
    color: '#0c5460',
  },
  productNameInModal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  gradeOfferRow: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  gradeOfferHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gradeOfferName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  offerInputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  offerInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  offerAmount: {
    fontSize: 13,
    color: '#666',
  },
  offerAmountValue: {
    fontWeight: 'bold',
    color: '#28a745',
  },
  totalBidContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  totalBidLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalBidAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#6c757d',
  },
  modalCancelButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  modalSubmitButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#28a745',
  },
  modalSubmitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Allcrops;