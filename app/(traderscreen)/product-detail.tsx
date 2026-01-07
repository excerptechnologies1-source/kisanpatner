import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Image Slider Component
const ImageSlider = ({ images, productId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Create pan responder for swipe gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (e, gestureState) => {
      const { dx } = gestureState;
      const swipeThreshold = 50;

      if (Math.abs(dx) > swipeThreshold) {
        if (dx > 0) {
          goToPrevious();
        } else {
          goToNext();
        }
      }
    },
  });

  if (!images || images.length === 0) {
    return (
      <View className="relative w-full h-64 bg-gray-200 rounded-lg justify-center items-center">
        <Text className="text-gray-500">No image available</Text>
      </View>
    );
  }

  const imageUrl = images[currentIndex]?.startsWith('http') 
    ? images[currentIndex] 
    : `https://kisan.etpl.ai/${images[currentIndex]}`;

  return (
    <View className="relative w-full h-64" {...panResponder.panHandlers}>
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-full rounded-lg"
        resizeMode="cover"
      />
      
      {images.length > 1 && (
        <>
          <TouchableOpacity
            onPress={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2"
          >
            <ChevronLeft size={20} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2"
          >
            <ChevronRight size={20} color="white" />
          </TouchableOpacity>
        </>
      )}
      
      {images.length > 1 && (
        <View className="absolute bottom-3 w-full flex-row justify-center">
          {images.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// Offer Modal Component
const OfferModal = ({ 
  visible, 
  onClose, 
  product, 
  grade,
  onMakeOffer 
}) => {
  const [offerPrice, setOfferPrice] = useState('');
  const [offerQuantity, setOfferQuantity] = useState('');

  const handleSubmit = () => {
    if (!offerPrice || !offerQuantity) {
      Alert.alert('Error', 'Please enter both price and quantity');
      return;
    }

    const price = parseFloat(offerPrice);
    const quantity = parseInt(offerQuantity);
    const maxQty = grade.totalQty;

    if (price <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    if (quantity <= 0 || quantity > maxQty) {
      Alert.alert('Error', `Please enter a valid quantity (max: ${maxQty})`);
      return;
    }

    onMakeOffer(product, grade, price, quantity);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-xl p-6 w-full max-w-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-gray-900">Make Offer</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-600 mb-2">
            Product: {product?.cropBriefDetails}
          </Text>
          <Text className="text-gray-600 mb-4">
            Grade: {grade?.grade} Grade
          </Text>

          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Your Offer Price (per {product?.unitMeasurement})</Text>
            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 text-lg"
              placeholder="Enter your price"
              value={offerPrice}
              onChangeText={setOfferPrice}
              keyboardType="numeric"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-1">
              Quantity (Max: {grade?.totalQty} {product?.unitMeasurement})
            </Text>
            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 text-lg"
              placeholder="Enter quantity"
              value={offerQuantity}
              onChangeText={setOfferQuantity}
              keyboardType="numeric"
            />
          </View>

          <View className="flex-row">
            <TouchableOpacity
              className="flex-1 bg-gray-200 rounded-lg py-3 mr-2 items-center"
              onPress={onClose}
            >
              <Text className="text-gray-700 font-medium">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-green-600 rounded-lg py-3 ml-2 items-center"
              onPress={handleSubmit}
            >
              <Text className="text-white font-semibold">Submit Offer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Offer states
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerProduct, setOfferProduct] = useState<any>(null);
  const [offerGrade, setOfferGrade] = useState<any>(null);
  
  // Quantity modal states
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedGrade, setSelectedGrade] = useState<any>(null);
  const [quantityInput, setQuantityInput] = useState('');

  useEffect(() => {
    loadProductData();
  }, []);

  const loadProductData = () => {
    try {
      setLoading(true);
      if (params.productData) {
        const productData = JSON.parse(params.productData as string);
        setProduct(productData);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  // Handle Accept Offer
  const handleAcceptOffer = async (product: any, grade: any) => {
    const traderId = await AsyncStorage.getItem('traderId');
    const traderName = (await AsyncStorage.getItem('traderName')) || 'Unknown Trader';
    if (!traderId) return Alert.alert('Error', 'Please login as a trader first');

    const maxQty = grade.totalQty;

    if (grade.quantityType === 'bulk') {
      const totalAmount = grade.pricePerUnit * maxQty;
      Alert.alert(
        'Confirm Purchase',
        `Product: ${product.cropBriefDetails}\nGrade: ${grade.grade}\nPrice: ₹${grade.pricePerUnit}/${product.unitMeasurement}\nQuantity: ${maxQty} ${product.unitMeasurement}\n\nTotal: ₹${totalAmount.toFixed(2)}`,
        [
          { text: 'Cancel' },
          { text: 'Confirm', onPress: () => processPurchase(product, grade, traderId, traderName, maxQty) }
        ]
      );
    } else {
      setSelectedProduct(product);
      setSelectedGrade(grade);
      setQuantityInput('');
      setShowQuantityModal(true);
    }
  };

  // Handle Make Offer
  const handleMakeOffer = (product: any, grade: any) => {
    setOfferProduct(product);
    setOfferGrade(grade);
    setShowOfferModal(true);
  };

  // Submit Make Offer
  const handleSubmitMakeOffer = async (product: any, grade: any, price: number, quantity: number) => {
    try {
      const traderId = await AsyncStorage.getItem('traderId');
      const traderName = (await AsyncStorage.getItem('traderName')) || 'Unknown Trader';
      if (!traderId) return Alert.alert('Error', 'Please login as a trader first');

      const res = await fetch('https://kisan.etpl.ai/product/make-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          gradeId: grade._id,
          traderId,
          traderName,
          offeredPrice: price,
          quantity,
          status: 'pending'
        })
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert('Success', 'Your offer has been submitted successfully!');
      } else {
        Alert.alert('Error', data.message || 'Failed to submit offer');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit offer. Please try again.');
    }
  };

  const handleQuantitySubmit = async () => {
    const traderId = await AsyncStorage.getItem('traderId');
    const traderName = (await AsyncStorage.getItem('traderName')) || 'Unknown Trader';

    const qty = Number(quantityInput);
    const maxQty = selectedGrade.totalQty;

    if (!qty || qty <= 0) return Alert.alert('Error', 'Enter valid quantity');
    if (qty > maxQty) return Alert.alert('Error', `Max available ${maxQty}`);

    const totalAmount = selectedGrade.pricePerUnit * qty;

    setShowQuantityModal(false);

    Alert.alert(
      'Confirm Purchase',
      `Qty: ${qty}\nTotal: ₹${totalAmount.toFixed(2)}`,
      [
        { text: 'Cancel' },
        { text: 'Confirm', onPress: () => processPurchase(selectedProduct, selectedGrade, traderId!, traderName, qty) }
      ]
    );
  };

  const processPurchase = async (product: any, grade: any, traderId: string, traderName: string, quantity: number) => {
    try {
      const res = await fetch('https://kisan.etpl.ai/product/accept-listed-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, gradeId: grade._id, traderId, traderName, quantity })
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert('Success', 'Purchase Completed');
        router.back();
      } else Alert.alert('Error', data.message);
    } catch {
      Alert.alert('Error', 'Failed');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#28a745" />
        <Text className="mt-2 text-gray-500 text-base">Loading...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-red-600 text-lg mb-4">{error || 'Product not found'}</Text>
        <TouchableOpacity
          className="bg-green-600 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="bg-white border-b border-gray-200 px-4 py-4 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-900" numberOfLines={1}>
          {product.cropBriefDetails}
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* IMAGE SLIDER */}
        <View className="px-4 pt-4">
          <ImageSlider 
            images={product.cropPhotos || []} 
            productId={product._id}
          />
        </View>

        {/* PRODUCT INFO */}
        <View className="px-4 pt-6">
          <Text className="text-2xl font-bold text-gray-900">
            {product.cropBriefDetails}
          </Text>

          {/* PRODUCT ID */}
          <View className="bg-green-600 px-3 py-1 rounded mt-2 self-start">
            <Text className="text-white text-sm font-semibold">
              {product.productId}
            </Text>
          </View>

          {/* CATEGORY TAGS */}
          <View className="flex-row flex-wrap mt-4">
            <View className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2">
              <Text className="text-gray-700 text-sm">
                {product.categoryId?.categoryName}
              </Text>
            </View>

            <View className="bg-green-100 px-3 py-1 rounded-full mr-2 mb-2">
              <Text className="text-green-700 text-sm">
                {product.farmingType}
              </Text>
            </View>

            <View className="bg-blue-100 px-3 py-1 rounded-full mb-2">
              <Text className="text-blue-700 text-sm">
                {product.subCategoryId?.subCategoryName}
              </Text>
            </View>
          </View>

          {/* PRODUCT DETAILS */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Product Details</Text>
            <View className="bg-gray-50 rounded-lg p-4">
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600">Unit Measurement:</Text>
                <Text className="text-gray-900 font-medium">{product.unitMeasurement}</Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600">Available Grades:</Text>
                <Text className="text-gray-900 font-medium">
                  {product.gradePrices.filter((g: any) => g.status !== 'sold').length}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Total Quantity:</Text>
                <Text className="text-gray-900 font-medium">
                  {product.gradePrices
                    .filter((g: any) => g.status !== 'sold')
                    .reduce((sum: number, g: any) => sum + g.totalQty, 0)} {product.unitMeasurement}
                </Text>
              </View>
            </View>
          </View>

          {/* AVAILABLE GRADES */}
          <View className="mt-8">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Available Grades ({product.gradePrices.filter((g: any) => g.status !== 'sold').length})
            </Text>

            {product.gradePrices
              .filter((g: any) => g.status !== 'sold')
              .map((grade: any) => (
                <View key={grade._id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <View className="flex-row justify-between items-center mb-4">
                    <View>
                      <Text className="text-lg font-semibold text-gray-900">
                        {grade.grade} Grade
                      </Text>
                      <Text className="text-gray-600 text-sm mt-1">
                        Available: {grade.totalQty} {product.unitMeasurement}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        Price Type: {grade.priceType === 'fixed' ? 'Fixed Price' : 'Negotiable'}
                      </Text>
                    </View>
                    <Text className="text-xl font-bold text-green-700">
                      ₹{grade.pricePerUnit}/{product.unitMeasurement}
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row">
                    <TouchableOpacity
                      className={`flex-1 bg-green-600 rounded-xl py-3 mr-2 items-center ${grade.totalQty === 0 ? "opacity-50" : ""}`}
                      disabled={grade.totalQty === 0}
                      onPress={() => handleAcceptOffer(product, grade)}
                    >
                      <Text className="text-white font-medium text-sm">Accept Price</Text>
                    </TouchableOpacity>

                    {grade.priceType === "negotiable" && (
                      <TouchableOpacity
                        className={`flex-1 border-2 border-green-600 rounded-xl py-3 items-center ${grade.totalQty === 0 ? "opacity-50" : ""}`}
                        disabled={grade.totalQty === 0}
                        onPress={() => handleMakeOffer(product, grade)}
                      >
                        <Text className="text-green-600 font-medium text-sm">Make Offer</Text>
                      </TouchableOpacity>
                    )}


                    {grade.priceType === "fixed" && (
                      <TouchableOpacity
                        className={`flex-1 border-2 border-green-600 rounded-xl py-3 items-center ${grade.totalQty === 0 ? "opacity-50" : ""}`}
                        disabled={grade.totalQty === 0}
                        onPress={() => handleMakeOffer(product, grade)}
                      >
                        <Text className="text-green-600 font-medium text-sm">Make Offer</Text>
                      </TouchableOpacity>
                    )}

                  </View>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>

      {/* MAKE OFFER MODAL */}
      <OfferModal
        visible={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        product={offerProduct}
        grade={offerGrade}
        onMakeOffer={handleSubmitMakeOffer}
      />

      {/* QUANTITY MODAL */}
      <Modal
        visible={showQuantityModal}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-xl p-6 w-full max-w-sm">
            <Text className="text-xl font-semibold text-gray-900 mb-2">Enter Quantity</Text>
            <Text className="text-gray-600 mb-4">
              Available: {selectedGrade?.totalQty} {selectedProduct?.unitMeasurement}
            </Text>

            <TextInput
              className="bg-gray-100 rounded-lg px-4 py-3 text-lg text-center mb-4"
              placeholder="Enter quantity"
              value={quantityInput}
              onChangeText={setQuantityInput}
              keyboardType="numeric"
              autoFocus
            />

            <View className="flex-row">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-lg py-3 mr-2 items-center"
                onPress={() => setShowQuantityModal(false)}
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-green-600 rounded-lg py-3 ml-2 items-center"
                onPress={handleQuantitySubmit}
              >
                <Text className="text-white font-semibold">Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductDetailScreen;