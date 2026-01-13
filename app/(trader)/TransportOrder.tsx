// import React, { useEffect, useState } from "react";

// /* ================= Interfaces ================= */

// interface ProductItem {
//   productId: string;
//   grade: string;
//   quantity: number;
//   nearestMarket: string;
//   deliveryDate?: string;
// }

// interface MarketDetails {
//   _id: string;	
//   marketName: string;
//   exactAddress: string;
//   landmark?: string;
//   district?: string;
//   state?: string;
//   pincode?: string;
// }

// interface TraderLocation {
//   address: string;
//   state: string;
//   pincode: string;
//   district: string;
//   taluk: string;
//   villageGramaPanchayat: string;
//   post?: string;
// }

// interface TraderDetails {
//   traderId: string;
//   traderName: string;
//   traderMobile: string;
//   location: TraderLocation;
// }

// interface PaymentRecord {
//   amount: number;
//   paidDate: string;
//   razorpayPaymentId?: string;
//   razorpayOrderId?: string;
//   razorpaySignature?: string;
// }

// interface TraderToAdminPayment {
//   totalAmount: number;
//   paidAmount: number;
//   remainingAmount: number;
//   paymentStatus: "pending" | "partial" | "paid";
//   paymentHistory?: PaymentRecord[];
// }

// interface Order {
//   _id: string;
//   orderId: string;
//   traderId: string;
//   productItems: ProductItem[];
//   createdAt: string;
//   pickupMarket?: MarketDetails;
//   traderDetails?: TraderDetails;
//   journeyStatus?: "pending" | "started" | "completed";
//   transporterAccepted?: boolean;
//   transporterStatus?: string;
//   traderToAdminPayment?: TraderToAdminPayment;
// }

// interface ProductDetails {
//   [key: string]: string;
// }

// interface GradePrice {
//   grade: string;
//   pricePerUnit: number;
//   totalQty: number;
//   quantityType: string;
//   priceType: string;
//   status: string;
// }

// interface FullProductDetails {
//   productId: string;
//   categoryId?: {
//     _id: string;
//     name: string;
//   };
//   subCategoryId?: string | {
//     _id: string;
//     name: string;
//   };
//   cropBriefDetails?: string;
//   farmingType?: string;
//   typeOfSeeds?: string;
//   packagingType?: string;
//   packageMeasurement?: string;
//   unitMeasurement?: string;
//   deliveryDate?: string;
//   deliveryTime?: string;
//   nearestMarket?: string;
//   cropPhotos?: string[];
//   gradePrices?: GradePrice[];
//   status?: string;
// }

// interface SubCategory {
//   _id: string;
//   subCategoryId: string;
//   subCategoryName: string;
//   categoryId: string;
//   image?: string;
// }

// /* ================= Component ================= */

// const TransporterOrders: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [productNames, setProductNames] = useState<ProductDetails>({});
//   const [allProducts, setAllProducts] = useState<FullProductDetails[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   /* ================= Fetch All Products ================= */
//   const fetchAllProducts = async () => {
//     try {
//       const res = await fetch(`https://kisan.etpl.ai/product/all`);
//       const data = await res.json();
//       if (data?.data) {
//         setAllProducts(data.data);
        
//         const names: ProductDetails = {};
//         data.data.forEach((product: FullProductDetails) => {
//           let productName = "Product";
//           if (product.subCategoryId) {
//             if (typeof product.subCategoryId === 'object' && 'name' in product.subCategoryId) {
//               productName = product.subCategoryId.name;
//             }
//           } else if (product.categoryId?.name) {
//             productName = product.categoryId.name;
//           }
//           names[product.productId] = productName;
//         });
//         setProductNames(names);
//       }
//     } catch (err) {
//       console.error("Products fetch error:", err);
//     }
//   };

//   /* ================= Fetch All SubCategories ================= */
//   const fetchSubCategories = async () => {
//     try {
//       const res = await fetch(`https://kisan.etpl.ai/subcategory/all`);
//       const data = await res.json();
//       if (data?.data) {
//         setSubCategories(data.data);
//       }
//     } catch (err) {
//       console.error("SubCategories fetch error:", err);
//     }
//   };

//   /* ================= Get SubCategory Name Helper ================= */
//   const getSubCategoryNameForProduct = (product: FullProductDetails): string => {
//     if (!product.subCategoryId) return "N/A";

//     if (typeof product.subCategoryId === 'object' && 'name' in product.subCategoryId) {
//       return product.subCategoryId.name;
//     }

//     const subCatId = typeof product.subCategoryId === 'string' 
//       ? product.subCategoryId 
//       : product.subCategoryId._id;
    
//     const subCat = subCategories.find(sc => sc._id === subCatId || sc.subCategoryId === subCatId);
//     return subCat?.subCategoryName || "N/A";
//   };

//   /* ================= Get Product Details by ID and Grade ================= */
//   const getProductDetails = (productId: string, grade: string) => {
//     const product = allProducts.find(p => p.productId === productId);
//     if (!product) return null;

//     const gradeInfo = product.gradePrices?.find(g => g.grade === grade);
    
//     return {
//       ...product,
//       selectedGrade: gradeInfo
//     };
//   };

//   /* ================= Fetch Market ================= */
//   const fetchMarket = async (marketId: string) => {
//     try {
//       const res = await fetch(`https://kisan.etpl.ai/api/market/${marketId}`);
//       const data = await res.json();
//       if (data?.data) return data.data;
//     } catch (err) {
//       console.error("Market fetch error:", err);
//     }
//     return null;
//   };

//   /* ================= Fetch Trader ================= */
//   const fetchTrader = async (traderId: string) => {
//     try {
//       const res = await fetch(`https://kisan.etpl.ai/farmer/register/all?traderId=${traderId}&role=trader`);
//       const data = await res.json();

//       if (data.success && data.data.length > 0) {
//         const t = data.data[0];
//         return {
//           traderId,
//           traderName: t.personalInfo?.name || "N/A",
//           traderMobile: t.personalInfo?.mobileNo || "N/A",
//           location: {
//             address: t.personalInfo?.address || "",
//             state: t.personalInfo?.state || "",
//             pincode: t.personalInfo?.pincode || "",
//             district: t.personalInfo?.district || "",
//             taluk: t.personalInfo?.taluk || "",
//             villageGramaPanchayat: t.personalInfo?.villageGramaPanchayat || "",
//             post: t.personalInfo?.post || "",
//           },
//         };
//       }
//     } catch (err) {
//       console.error("Trader fetch error:", err);
//     }
//     return null;
//   };

//   /* ================= Fetch Orders ================= */
//   useEffect(() => {
//     const loadOrders = async () => {
//       try {
//         setLoading(true);

//         await fetchSubCategories();
//         await fetchAllProducts();

//         const res = await fetch(`https://kisan.etpl.ai/api/orders`);
//         const data = await res.json();

//         if (data.success) {
//           const orderList = data.data;

//           const enriched = await Promise.all(
//             orderList.map(async (o: any) => {
//               const marketId = o.productItems?.[0]?.nearestMarket;
//               const pickupMarket = marketId ? await fetchMarket(marketId) : null;
//               const traderDetails = await fetchTrader(o.traderId);

//               return {
//                 _id: o._id,
//                 orderId: o.orderId,
//                 traderId: o.traderId,
//                 productItems: o.productItems,
//                 createdAt: o.createdAt,
//                 pickupMarket,
//                 traderDetails,
//                 transporterStatus: o.transporterStatus || "pending",
//                 traderToAdminPayment: o.traderToAdminPayment,
//                 journeyStatus:
//                   o.transporterStatus === "started"
//                     ? "started"
//                     : o.transporterStatus === "completed"
//                       ? "completed"
//                       : "pending",
//                 transporterAccepted: o.transporterStatus === "accepted" || o.transporterStatus === "approved",
//               };
//             })
//           );

//           setOrders(enriched);
//         }
//       } catch (err) {
//         console.error("Order fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadOrders();
//   }, []);

//   /* ================= Check if Can Start Journey ================= */
//   const canStartJourney = (order: Order): { allowed: boolean; reason?: string } => {
//     if (!order.transporterAccepted) {
//       return { allowed: false, reason: "Transporter not accepted yet" };
//     }

//     if (order.transporterStatus === "completed") {
//       const payment = order.traderToAdminPayment;
//       if (!payment || payment.paymentStatus !== "paid" || payment.remainingAmount !== 0) {
//         return { 
//           allowed: false, 
//           reason: `Payment incomplete (₹${payment?.remainingAmount || 0} remaining)` 
//         };
//       }
//     }

//     return { allowed: true };
//   };

//   /* ================= ACTIONS ================= */

//   const handleAccept = async (order: Order) => {
//     try {
//       const transporterDetails = {
//         transporterId: "tran-01",
//         transporterName: "Aravind Transport",
//         transporterMobile: "6360886843",
//         vehicleType: "Mini Truck",
//         vehicleNumber: "KA25AB1234",
//         vehicleCapacity: "2 Ton",
//         driverName: "Ramesh",
//         driverMobile: "9000000000",
//       };

//       const res = await fetch(
//         `https://kisan.etpl.ai/api/orders/${order.orderId}/transporter-accept`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ transporterDetails })
//         }
//       );

//       if (!res.ok) throw new Error("Failed to accept order");

//       alert("Offer sent to Admin ✅ Waiting for approval");

//       setOrders(prev =>
//         prev.map(o =>
//           o.orderId === order.orderId ? { ...o, transporterAccepted: true } : o
//         )
//       );

//     } catch (err) {
//       console.error(err);
//       alert("Failed to accept order");
//     }
//   };

//   const handleStartJourney = async (orderId: string) => {
//     const order = orders.find(o => o.orderId === orderId);
    
//     // Validate payment if transporterStatus is completed
//     if (order?.transporterStatus === "completed") {
//       const payment = order.traderToAdminPayment;
      
//       if (!payment || payment.paymentStatus !== "paid" || payment.remainingAmount !== 0) {
//         alert("❌ Cannot start journey!\n\nPayment must be fully completed before starting the journey.\n\nCurrent Status:\n" +
//           `- Total Amount: ₹${payment?.totalAmount || 0}\n` +
//           `- Paid Amount: ₹${payment?.paidAmount || 0}\n` +
//           `- Remaining: ₹${payment?.remainingAmount || 0}\n` +
//           `- Status: ${payment?.paymentStatus || 'unknown'}`
//         );
//         return;
//       }
//     }

//     const key = prompt("Enter Admin Pickup Secret Key");
//     if (!key) return;

//     try {
//       const res = await fetch(
//         `https://kisan.etpl.ai/api/orders/${orderId}/start-journey`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ pickupKey: key })
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Invalid Key");
//       }

//       alert("Journey Started 🚚");

//       setOrders(prev =>
//         prev.map(o =>
//           o.orderId === orderId ? { ...o, journeyStatus: "started" } : o
//         )
//       );

//     } catch (err: any) {
//       alert(err?.message || "Invalid Key ❌");
//     }
//   };

//   const handleCompleteDelivery = async (orderId: string) => {
//     const key = prompt("Enter Trader Delivery Secret Key");
//     if (!key) return;

//     try {
//       const res = await fetch(
//         `https://kisan.etpl.ai/api/orders/${orderId}/complete-delivery`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ traderKey: key })
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Invalid Key");
//       }

//       alert("Delivery Completed ✅");

//       setOrders((prev) =>
//         prev.map((o) =>
//           o.orderId === orderId ? { ...o, journeyStatus: "completed" } : o
//         )
//       );
//     } catch (err: any) {
//       alert(err?.message || "Invalid Key ❌");
//     }
//   };

//   const handleReject = (orderId: string) => {
//     if (!window.confirm("Reject this order?")) return;
//     setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
//   };

//   /* ================= UI ================= */

//   if (loading) return <div style={{ padding: 40 }}>Loading Orders...</div>;

//   return (
//     <div style={{ padding: 24 }}>
//       <h2>🚚 Transporter Orders</h2>

//       {orders.map((order) => {
//         const journeyStatus = canStartJourney(order);
        
//         return (
//           <div key={order._id} style={cardStyle}>
//             <h3>Order ID: {order.orderId}</h3>

//             <p>
//               <b>Status:</b>{" "}
//               {order.journeyStatus === "pending" && "🟡 Waiting"}
//               {order.journeyStatus === "started" && "🟢 Journey Started"}
//               {order.journeyStatus === "completed" && "✅ Completed"}
//             </p>

//             {/* Payment Status - Show if exists */}
//             {order.traderToAdminPayment && (
//               <div style={{
//                 background: order.traderToAdminPayment.paymentStatus === "paid" ? "#dcfce7" : "#fef3c7",
//                 padding: 12,
//                 borderRadius: 8,
//                 marginTop: 10,
//                 border: `2px solid ${order.traderToAdminPayment.paymentStatus === "paid" ? "#10b981" : "#fbbf24"}`
//               }}>
//                 <b>💰 Payment Status:</b>
//                 <div style={{ marginTop: 8, fontSize: "14px" }}>
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
//                     <div>
//                       <strong>Total:</strong> ₹{order.traderToAdminPayment.totalAmount}
//                     </div>
//                     <div>
//                       <strong>Paid:</strong> ₹{order.traderToAdminPayment.paidAmount}
//                     </div>
//                     <div>
//                       <strong>Remaining:</strong> 
//                       <span style={{
//                         color: order.traderToAdminPayment.remainingAmount === 0 ? "#166534" : "#991b1b",
//                         fontWeight: "bold",
//                         marginLeft: "4px"
//                       }}>
//                         ₹{order.traderToAdminPayment.remainingAmount}
//                       </span>
//                     </div>
//                     <div>
//                       <strong>Status:</strong>
//                       <span style={{
//                         marginLeft: "4px",
//                         padding: "2px 8px",
//                         borderRadius: 4,
//                         fontSize: "11px",
//                         fontWeight: "bold",
//                         background: 
//                           order.traderToAdminPayment.paymentStatus === "paid" ? "#dcfce7" :
//                           order.traderToAdminPayment.paymentStatus === "partial" ? "#fef3c7" : "#fee2e2",
//                         color: 
//                           order.traderToAdminPayment.paymentStatus === "paid" ? "#166534" :
//                           order.traderToAdminPayment.paymentStatus === "partial" ? "#92400e" : "#991b1b",
//                       }}>
//                         {order.traderToAdminPayment.paymentStatus}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Pickup */}
//             <div style={boxBlue}>
//               <b>📍 Pickup</b>
//               {order.pickupMarket ? (
//                 <p>
//                   {order.pickupMarket.marketName},{" "}
//                   {order.pickupMarket.exactAddress} <br />
//                   {order.pickupMarket.district}, {order.pickupMarket.state}
//                 </p>
//               ) : (
//                 <p>Not Available</p>
//               )}
//             </div>

//             {/* Delivery */}
//             <div style={boxGreen}>
//               <b>🏠 Delivery</b>
//               {order.traderDetails ? (
//                 <p>
//                   {order.traderDetails.traderName} — {order.traderDetails.traderMobile}
//                   <br />
//                   {order.traderDetails.location.address},{" "}
//                   {order.traderDetails.location.taluk},{" "}
//                   {order.traderDetails.location.district},{" "}
//                   {order.traderDetails.location.state} -{" "}
//                   {order.traderDetails.location.pincode}
//                 </p>
//               ) : (
//                 <p>Not Available</p>
//               )}
//             </div>

//             {/* Items */}
//             <div style={{ marginTop: 12 }}>
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <b>📦 Items ({order.productItems.length})</b>
//                 <button 
//                   onClick={() => setSelectedOrder(order)}
//                   style={{
//                     padding: "6px 12px",
//                     background: "#3b82f6",
//                     color: "white",
//                     border: "none",
//                     borderRadius: 4,
//                     cursor: "pointer",
//                     fontSize: "12px"
//                   }}
//                 >
//                   View Full Details
//                 </button>
//               </div>
//               {order.productItems.map((item, idx) => (
//                 <div key={idx} style={itemBox}>
//                   <p><b>{productNames[item.productId] || item.productId}</b></p>
//                   <p>Grade: {item.grade} | Qty: {item.quantity}</p>
//                 </div>
//               ))}
//             </div>

//             {/* Payment Warning for Start Journey */}
//             {order.journeyStatus === "pending" && 
//              !journeyStatus.allowed && 
//              journeyStatus.reason && (
//               <div style={{
//                 marginTop: 12,
//                 padding: 12,
//                 background: "#fef3c7",
//                 border: "1px solid #fbbf24",
//                 borderRadius: 6,
//                 color: "#92400e"
//               }}>
//                 <strong>⚠️ Cannot Start Journey:</strong> {journeyStatus.reason}
//               </div>
//             )}

//             {/* ACTIONS */}
//             <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
//               {order.journeyStatus === "pending" && (
//                 <>
//                   <button 
//                     disabled={order.transporterAccepted} 
//                     onClick={() => handleAccept(order)}
//                     style={order.transporterAccepted ? disabledButtonStyle : buttonStyle}
//                   >
//                     {order.transporterAccepted ? "Offer Sent" : "Accept Offer"}
//                   </button>

//                   <button 
//                     disabled={order.transporterAccepted} 
//                     onClick={() => handleReject(order.orderId)}
//                     style={order.transporterAccepted ? disabledButtonStyle : rejectButtonStyle}
//                   >
//                     Reject
//                   </button>

//                   <button
//                     disabled={!journeyStatus.allowed}
//                     onClick={() => handleStartJourney(order.orderId)}
//                     style={!journeyStatus.allowed ? disabledButtonStyle : startButtonStyle}
//                     title={!journeyStatus.allowed ? journeyStatus.reason : "Start the journey"}
//                   >
//                     Start Journey
//                   </button>
//                 </>
//               )}

//               {order.journeyStatus === "started" && (
//                 <button 
//                   onClick={() => handleCompleteDelivery(order.orderId)}
//                   style={completeButtonStyle}
//                 >
//                   Complete Delivery
//                 </button>
//               )}
//             </div>
//           </div>
//         );
//       })}

//       {/* Product Details Modal */}
//       {selectedOrder && (
//         <div style={modalOverlay} onClick={() => setSelectedOrder(null)}>
//           <div style={modalBox} onClick={(e) => e.stopPropagation()}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <h3>Product Details: {selectedOrder.orderId}</h3>
//               <button 
//                 onClick={() => setSelectedOrder(null)}
//                 style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}
//               >
//                 ✕
//               </button>
//             </div>

//             <div style={{ marginTop: 20 }}>
//               <h4 style={{ marginBottom: 15, color: "#374151" }}>📦 Product Items ({selectedOrder.productItems.length})</h4>
//               <div style={{ display: "grid", gap: 16 }}>
//                 {selectedOrder.productItems.map((item, idx) => {
//                   const productDetails = getProductDetails(item.productId, item.grade);
                  
//                   return (
//                     <div key={idx} style={enhancedProductBoxStyle}>
//                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
//                         <div>
//                           <h4 style={{ margin: 0, color: "#1f2937", fontSize: "16px" }}>
//                             {productNames[item.productId] || "Product"}
//                           </h4>
//                           <small style={{ color: "#6b7280" }}>ID: {item.productId}</small>
//                         </div>
//                         <span style={{ 
//                           background: "#dbeafe", 
//                           padding: "4px 12px", 
//                           borderRadius: 4, 
//                           fontSize: "13px",
//                           fontWeight: "600",
//                           color: "#1e40af"
//                         }}>
//                           Grade: {item.grade}
//                         </span>
//                       </div>

//                       {productDetails ? (
//                         <>
//                           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
//                             <div style={infoItem}>
//                               <small style={labelStyle}>Product Name</small>
//                               <strong>{getSubCategoryNameForProduct(productDetails)}</strong>
//                             </div>
//                           </div>

//                           {productDetails.cropBriefDetails && (
//                             <div style={{ ...infoItem, marginBottom: 12 }}>
//                               <small style={labelStyle}>Description</small>
//                               <p style={{ margin: "4px 0 0 0", color: "#374151" }}>
//                                 {productDetails.cropBriefDetails}
//                               </p>
//                             </div>
//                           )}

//                           <div style={{ 
//                             background: "#f0f9ff", 
//                             padding: 12, 
//                             borderRadius: 6,
//                             marginBottom: 12
//                           }}>
//                             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                               <div style={infoItem}>
//                                 <small style={labelStyle}>Ordered Quantity</small>
//                                 <strong style={{ fontSize: "18px", color: "#0369a1" }}>
//                                   {item.quantity} {productDetails.unitMeasurement || "units"}
//                                 </strong>
//                               </div>
//                             </div>
//                           </div>
//                         </>
//                       ) : (
//                         <div style={{ padding: 20, textAlign: "center", color: "#999" }}>
//                           <p>Product details not available</p>
//                           <small>Quantity: {item.quantity} units</small>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ================= Styles ================= */

// const cardStyle: React.CSSProperties = {
//   background: "#fff",
//   padding: 20,
//   marginTop: 20,
//   borderRadius: 12,
//   boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
// };

// const boxBlue: React.CSSProperties = {
//   background: "#ecfeff",
//   padding: 12,
//   borderRadius: 10,
//   marginTop: 10,
// };

// const boxGreen: React.CSSProperties = {
//   background: "#f0fdf4",
//   padding: 12,
//   borderRadius: 10,
//   marginTop: 10,
// };

// const itemBox: React.CSSProperties = {
//   background: "#f9fafb",
//   padding: 10,
//   borderRadius: 8,
//   marginTop: 8,
// };

// const buttonStyle: React.CSSProperties = {
//   padding: "8px 16px",
//   background: "#10b981",
//   color: "white",
//   border: "none",
//   borderRadius: 6,
//   cursor: "pointer",
//   fontWeight: "600",
// };

// const rejectButtonStyle: React.CSSProperties = {
//   padding: "8px 16px",
//   background: "#ef4444",
//   color: "white",
//   border: "none",
//   borderRadius: 6,
//   cursor: "pointer",
//   fontWeight: "600",
// };

// const startButtonStyle: React.CSSProperties = {
//   padding: "8px 16px",
//   background: "#3b82f6",
//   color: "white",
//   border: "none",
//   borderRadius: 6,
//   cursor: "pointer",
//   fontWeight: "600",
// };

// const completeButtonStyle: React.CSSProperties = {
//   padding: "8px 16px",
//   background: "#8b5cf6",
//   color: "white",
//   border: "none",
//   borderRadius: 6,
//   cursor: "pointer",
//   fontWeight: "600",
// };

// const disabledButtonStyle: React.CSSProperties = {
//   padding: "8px 16px",
//   background: "#d1d5db",
//   color: "#6b7280",
//   border: "none",
//   borderRadius: 6,
//   cursor: "not-allowed",
//   fontWeight: "600",
// };

// const modalOverlay: React.CSSProperties = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   background: "rgba(0,0,0,0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 1000,
// };

// const modalBox: React.CSSProperties = {
//   background: "white",
//   padding: 30,
//   borderRadius: 12,
//   maxWidth: "900px",
//   width: "90%",
//   maxHeight: "90vh",
//   overflowY: "auto",
//   boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
// };

// const enhancedProductBoxStyle: React.CSSProperties = {
//   background: "#ffffff",
//   padding: 20,
//   borderRadius: 10,
//   border: "2px solid #e5e7eb",
//   boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
// };

// const infoItem: React.CSSProperties = {
//   display: "flex",
//   flexDirection: "column",
//   gap: 4,
// };

// const labelStyle: React.CSSProperties = {
//   color: "#6b7280",
//   fontSize: "12px",
//   fontWeight: "500",
//   textTransform: "uppercase",
//   letterSpacing: "0.5px",
// };

// export default TransporterOrders;

















// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Clipboard,
//   Modal,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';

// const API_BASE = 'https://kisan.etpl.ai';

// interface Order {
//   _id: string;
//   orderId: string;
//   traderId: string;
//   traderName: string;
//   farmerId: string;
//   productItems: Array<{
//     productId: string;
//     grade: string;
//     quantity: number;
//   }>;
//   traderToAdminPayment: {
//     paymentStatus: string;
//     remainingAmount: number;
//     paidAmount: number;
//     totalAmount: number;
//   };
//   transporterStatus: string;
//   marketToTraderTransport?: {
//     status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected';
//     transporterId?: string;
//     transporterName?: string;
//     transporterMobile?: string;
//     adminGeneratedKey?: string;
//     deliveryKey?: string;
//     journeyStartedAt?: string;
//     journeyCompletedAt?: string;
//     deliveryKeyEnteredAt?: string;
//   };
// }

// const TraderTransport: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [generatedKey, setGeneratedKey] = useState('');
//   const [showKeyModal, setShowKeyModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [refreshing, setRefreshing] = useState(false);
  
//   const router = useRouter();
//   const traderId = "trd-13";
//   const traderName = "Trader";

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API_BASE}/api/orders/trader/${traderId}/transport`);
//       setOrders(res.data.data || []);
//     } catch (error) {
//       console.error('Error fetching trader orders:', error);
//       Alert.alert('Error', 'Error loading your orders');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchOrders();
//   };

//   const generateDeliveryKey = async (order: Order) => {
//     try {
//       const res = await axios.post(`${API_BASE}/api/orders/market-to-trader/trader/generate-key`, {
//         orderId: order.orderId,
//         traderId: order.traderId
//       });
      
//       if (res.data.success) {
//         setGeneratedKey(res.data.data.deliveryKey);
//         setSelectedOrder(order);
//         setShowKeyModal(true);
//         fetchOrders();
//         Alert.alert('Success', 'Delivery key generated! Share with transporter when they arrive with goods.');
//       }
//     } catch (error: any) {
//       Alert.alert('Error', error.response?.data?.message || 'Error generating delivery key');
//     }
//   };

//   const autoGenerateKey = () => {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let key = 'TRADER';
//     for (let i = 0; i < 6; i++) {
//       key += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return key;
//   };

//   const quickGenerateKey = (order: Order) => {
//     const key = autoGenerateKey();
//     setGeneratedKey(key);
//     setSelectedOrder(order);
//     setShowKeyModal(true);
    
//     setTimeout(() => {
//       fetchOrders();
//     }, 500);
//   };

//   const getStatusColor = (status?: string) => {
//     switch (status) {
//       case 'pending': return '#ff9800';
//       case 'accepted': return '#1976d2';
//       case 'in_progress': return '#2196f3';
//       case 'completed': return '#4caf50';
//       default: return '#757575';
//     }
//   };

//   const getStatusText = (order: Order) => {
//     const transport = order.marketToTraderTransport;
    
//     if (!transport) return 'Ready for Transport';
    
//     switch (transport.status) {
//       case 'pending': return '⏳ Waiting for Transporter';
//       case 'accepted': return '✅ Transporter Assigned - Waiting for Pickup';
//       case 'in_progress': 
//         return transport.deliveryKey 
//           ? '🚚 On the Way - Generate Key Below' 
//           : '🚚 On the Way - Wait for Arrival';
//       case 'completed': return '✅ Delivered Successfully';
//       default: return transport.status;
//     }
//   };

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return 'Not yet';
//     return new Date(dateString).toLocaleString();
//   };

//   const isOrderInProgress = (order: Order) => {
//     const transport = order.marketToTraderTransport;
//     return transport?.status === 'in_progress';
//   };

//   const hasGeneratedKey = (order: Order) => {
//     const transport = order.marketToTraderTransport;
//     return !!transport?.deliveryKey;
//   };

//   const copyToClipboard = (text: string) => {
//     Clipboard.setString(text);
//     Alert.alert('Success', 'Key copied to clipboard!');
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#1976d2" />
//         <Text style={styles.loadingText}>Loading your orders...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>📦 Your Goods Delivery</Text>
//         <TouchableOpacity style={styles.refreshButton} onPress={fetchOrders}>
//           <Text style={styles.refreshButtonText}>🔄 Refresh Orders</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Status Summary */}
//         <View style={styles.statusSummary}>
//           <View style={styles.statusItem}>
//             <Text style={styles.statusNumber}>
//               {orders.filter(o => o.marketToTraderTransport?.status === 'in_progress').length}
//             </Text>
//             <Text style={styles.statusLabel}>In Transit</Text>
//           </View>
//           <View style={styles.statusItem}>
//             <Text style={[styles.statusNumber, styles.waitingNumber]}>
//               {orders.filter(o => !o.marketToTraderTransport || ['pending', 'accepted'].includes(o.marketToTraderTransport?.status || '')).length}
//             </Text>
//             <Text style={styles.statusLabel}>Waiting</Text>
//           </View>
//           <View style={styles.statusItem}>
//             <Text style={[styles.statusNumber, styles.deliveredNumber]}>
//               {orders.filter(o => o.marketToTraderTransport?.status === 'completed').length}
//             </Text>
//             <Text style={styles.statusLabel}>Delivered</Text>
//           </View>
//         </View>

//         {orders.length === 0 ? (
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyEmoji}>📭</Text>
//             <Text style={styles.emptyTitle}>No Orders Ready for Delivery</Text>
//             <Text style={styles.emptyDescription}>
//               Your orders will appear here once payment is fully paid and farmer-to-market transport is completed.
//             </Text>
//           </View>
//         ) : (
//           <View style={styles.ordersList}>
//             {orders.map((order) => {
//               const transport = order.marketToTraderTransport;
//               const isInProgress = isOrderInProgress(order);
//               const isCompleted = transport?.status === 'completed';
//               const canGenerateKey = isInProgress && !hasGeneratedKey(order);
//               const shouldShowKey = isInProgress && hasGeneratedKey(order);

//               return (
//                 <View key={order._id} style={styles.orderCard}>
//                   {/* Order Header */}
//                   <View style={styles.orderHeader}>
//                     <View>
//                       <Text style={styles.orderId}>Order: {order.orderId}</Text>
//                       <View style={styles.paymentStatusContainer}>
//                         <Text style={styles.paymentLabel}>Payment:</Text>
//                         <View style={[
//                           styles.paymentStatus,
//                           { backgroundColor: order.traderToAdminPayment.paymentStatus === 'paid' ? '#e8f5e9' : '#fff3cd' }
//                         ]}>
//                           <Text style={[
//                             styles.paymentStatusText,
//                             { color: order.traderToAdminPayment.paymentStatus === 'paid' ? '#2e7d32' : '#ff9800' }
//                           ]}>
//                             {order.traderToAdminPayment.paymentStatus.toUpperCase()}
//                           </Text>
//                         </View>
//                       </View>
//                     </View>
//                     <View style={styles.statusBadgeContainer}>
//                       <View style={[
//                         styles.statusBadge,
//                         { backgroundColor: getStatusColor(transport?.status) }
//                       ]}>
//                         <Text style={styles.statusBadgeText}>{getStatusText(order)}</Text>
//                       </View>
//                     </View>
//                   </View>

//                   {/* Transporter Info */}
//                   {transport?.transporterName && (
//                     <View style={styles.transporterInfo}>
//                       <Text style={styles.transporterTitle}>🚚 Transporter Details</Text>
//                       <View style={styles.transporterDetails}>
//                         <View style={styles.detailItem}>
//                           <Text style={styles.detailLabel}>Name</Text>
//                           <Text style={styles.detailValue}>{transport.transporterName}</Text>
//                         </View>
//                         <View style={styles.detailItem}>
//                           <Text style={styles.detailLabel}>Contact</Text>
//                           <Text style={styles.detailValue}>{transport.transporterMobile || 'N/A'}</Text>
//                         </View>
//                         {transport?.journeyStartedAt && (
//                           <View style={styles.detailItem}>
//                             <Text style={styles.detailLabel}>Journey Started</Text>
//                             <Text style={styles.detailValue}>{formatDate(transport.journeyStartedAt)}</Text>
//                           </View>
//                         )}
//                       </View>
//                     </View>
//                   )}

//                   {/* Items List */}
//                   <View style={styles.itemsContainer}>
//                     <Text style={styles.itemsTitle}>📦 Your Order Items</Text>
//                     <View style={styles.itemsGrid}>
//                       {order.productItems.map((item, index) => (
//                         <View key={index} style={styles.itemCard}>
//                           <Text style={styles.itemName}>{item.productId}</Text>
//                           <Text style={styles.itemDetails}>
//                             Grade: {item.grade} | Qty: {item.quantity}
//                           </Text>
//                         </View>
//                       ))}
//                     </View>
//                   </View>

//                   {/* Delivery Key Section */}
//                   {isInProgress && (
//                     <View style={[
//                       styles.keySection,
//                       { 
//                         backgroundColor: shouldShowKey ? '#e8f5e9' : '#fff3cd',
//                         borderColor: shouldShowKey ? '#4caf50' : '#ff9800'
//                       }
//                     ]}>
//                       <Text style={styles.keyEmoji}>{shouldShowKey ? '🔐' : '🔑'}</Text>
//                       <Text style={[
//                         styles.keyTitle,
//                         { color: shouldShowKey ? '#2e7d32' : '#ff9800' }
//                       ]}>
//                         {shouldShowKey ? '✅ Delivery Key Generated' : 'Generate Delivery Key'}
//                       </Text>
                      
//                       {shouldShowKey ? (
//                         <>
//                           <View style={styles.keyDisplay}>
//                             <Text style={styles.keyText}>{transport.deliveryKey}</Text>
//                           </View>
//                           <Text style={styles.keyInstructions}>
//                             ✅ Share this key with the transporter when they arrive
//                           </Text>
                          
//                           <TouchableOpacity
//                             style={styles.copyButton}
//                             onPress={() => copyToClipboard(transport.deliveryKey || '')}
//                           >
//                             <Text style={styles.copyButtonText}>📋 Copy Key to Share</Text>
//                           </TouchableOpacity>
//                         </>
//                       ) : (
//                         <>
//                           <Text style={styles.keyDescription}>
//                             Transporter is on the way with your goods. Generate a delivery key to give to the transporter 
//                             when they arrive and you verify the goods.
//                           </Text>
                          
//                           <TouchableOpacity
//                             style={styles.generateButton}
//                             onPress={() => generateDeliveryKey(order)}
//                           >
//                             <Text style={styles.generateButtonText}>🔑 Generate Delivery Key</Text>
//                           </TouchableOpacity>
//                         </>
//                       )}
//                     </View>
//                   )}

//                   {/* Completed Status */}
//                   {isCompleted && (
//                     <View style={styles.completedSection}>
//                       <Text style={styles.completedEmoji}>🎉</Text>
//                       <Text style={styles.completedTitle}>Delivery Completed Successfully!</Text>
//                       <View style={styles.completedDetails}>
//                         <View style={styles.completedItem}>
//                           <Text style={styles.completedLabel}>Completed At</Text>
//                           <Text style={styles.completedValue}>{formatDate(transport?.journeyCompletedAt)}</Text>
//                         </View>
//                         <View style={styles.completedItem}>
//                           <Text style={styles.completedLabel}>Key Used At</Text>
//                           <Text style={styles.completedValue}>{formatDate(transport?.deliveryKeyEnteredAt)}</Text>
//                         </View>
//                       </View>
//                     </View>
//                   )}
//                 </View>
//               );
//             })}
//           </View>
//         )}

//         {/* Flow Information */}
//         <View style={styles.flowInfo}>
//           <Text style={styles.flowTitle}>📊 Delivery Flow Status:</Text>
//           <View style={styles.flowSteps}>
//             <View style={styles.flowStep}>
//               <View style={[
//                 styles.stepNumber,
//                 { backgroundColor: orders.some(o => !o.marketToTraderTransport || o.marketToTraderTransport.status === 'pending') ? '#1976d2' : '#ccc' }
//               ]}>
//                 <Text style={styles.stepNumberText}>1</Text>
//               </View>
//               <Text style={styles.stepText}>
//                 <Text style={styles.stepBold}>Transporter accepts order</Text> → Admin generates pickup key
//               </Text>
//             </View>
//             <View style={styles.flowStep}>
//               <View style={[
//                 styles.stepNumber,
//                 { backgroundColor: orders.some(o => o.marketToTraderTransport?.status === 'accepted') ? '#1976d2' : '#ccc' }
//               ]}>
//                 <Text style={styles.stepNumberText}>2</Text>
//               </View>
//               <Text style={styles.stepText}>
//                 <Text style={styles.stepBold}>Transporter starts journey</Text> → Enters admin key, status changes to "in_progress"
//               </Text>
//             </View>
//             <View style={styles.flowStep}>
//               <View style={[
//                 styles.stepNumber,
//                 { backgroundColor: orders.some(o => o.marketToTraderTransport?.status === 'in_progress') ? '#2196f3' : '#ccc' }
//               ]}>
//                 <Text style={styles.stepNumberText}>3</Text>
//               </View>
//               <Text style={styles.stepText}>
//                 <Text style={styles.stepBold}>You generate delivery key</Text> → When transporter arrives with goods
//               </Text>
//             </View>
//             <View style={styles.flowStep}>
//               <View style={[
//                 styles.stepNumber,
//                 { backgroundColor: orders.some(o => o.marketToTraderTransport?.status === 'completed') ? '#4caf50' : '#ccc' }
//               ]}>
//                 <Text style={styles.stepNumberText}>4</Text>
//               </View>
//               <Text style={styles.stepText}>
//                 <Text style={styles.stepBold}>Transporter enters your key</Text> → Delivery marked as completed
//               </Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Generated Key Modal */}
//       <Modal
//         visible={showKeyModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowKeyModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalEmoji}>🔐</Text>
//             <Text style={styles.modalTitle}>Delivery Key Generated!</Text>
            
//             <View style={styles.modalKeyDisplay}>
//               <Text style={styles.modalKeyText}>{generatedKey}</Text>
//             </View>
            
//             <View style={styles.modalInstructions}>
//               <Text style={styles.modalInstructionsTitle}>📋 Instructions:</Text>
//               <View style={styles.instructionsList}>
//                 <Text style={styles.instructionItem}>1. Transporter is on the way with your goods</Text>
//                 <Text style={styles.instructionItem}>2. When transporter arrives, VERIFY the goods first</Text>
//                 <Text style={styles.instructionItem}>3. Check quantity, quality, and condition</Text>
//                 <Text style={styles.instructionItem}>4. Only then share this key with the transporter</Text>
//                 <Text style={styles.instructionItem}>5. Transporter will enter this key to complete delivery</Text>
//               </View>
//             </View>
            
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={() => {
//                   copyToClipboard(generatedKey);
//                 }}
//               >
//                 <Text style={styles.modalButtonText}>📋 Copy Key</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.modalButtonSecondary]}
//                 onPress={() => {
//                   setShowKeyModal(false);
//                   fetchOrders();
//                 }}
//               >
//                 <Text style={styles.modalButtonText}>👍 Got It</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#666',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   refreshButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: '#1976d2',
//     borderRadius: 4,
//   },
//   refreshButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   statusSummary: {
//     flexDirection: 'row',
//     backgroundColor: '#e3f2fd',
//     margin: 16,
//     padding: 16,
//     borderRadius: 8,
//   },
//   statusItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statusNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1976d2',
//   },
//   waitingNumber: {
//     color: '#ff9800',
//   },
//   deliveredNumber: {
//     color: '#4caf50',
//   },
//   statusLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//   },
//   emptyState: {
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     margin: 16,
//     padding: 60,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderStyle: 'dashed',
//     borderColor: '#ddd',
//   },
//   emptyEmoji: {
//     fontSize: 48,
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     color: '#666',
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   emptyDescription: {
//     textAlign: 'center',
//     color: '#888',
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   ordersList: {
//     padding: 16,
//   },
//   orderCard: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   orderHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 20,
//   },
//   orderId: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   paymentStatusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   paymentLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginRight: 8,
//   },
//   paymentStatus: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   paymentStatusText: {
//     fontWeight: 'bold',
//     fontSize: 12,
//   },
//   statusBadgeContainer: {
//     alignItems: 'flex-end',
//   },
//   statusBadge: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   statusBadgeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   transporterInfo: {
//     backgroundColor: '#f0f7ff',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: '#1976d2',
//   },
//   transporterTitle: {
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#1976d2',
//   },
//   transporterDetails: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   detailItem: {
//     width: '50%',
//     marginBottom: 8,
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#666',
//   },
//   detailValue: {
//     fontWeight: 'bold',
//   },
//   itemsContainer: {
//     backgroundColor: '#fff8e1',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//   },
//   itemsTitle: {
//     fontWeight: 'bold',
//     marginBottom: 12,
//     color: '#ff9800',
//   },
//   itemsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   itemCard: {
//     width: '48%',
//     marginRight: '4%',
//     marginBottom: 12,
//     padding: 12,
//     backgroundColor: 'white',
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#ffecb3',
//   },
//   itemName: {
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   itemDetails: {
//     fontSize: 12,
//     color: '#666',
//   },
//   keySection: {
//     borderRadius: 8,
//     padding: 20,
//     marginBottom: 16,
//     borderWidth: 2,
//     alignItems: 'center',
//   },
//   keyEmoji: {
//     fontSize: 24,
//     marginBottom: 12,
//   },
//   keyTitle: {
//     fontWeight: 'bold',
//     fontSize: 18,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   keyDisplay: {
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//     padding: 16,
//     marginVertical: 16,
//   },
//   keyText: {
//     fontFamily: 'monospace',
//     fontSize: 20,
//     fontWeight: 'bold',
//     letterSpacing: 1,
//     textAlign: 'center',
//   },
//   keyInstructions: {
//     fontSize: 16,
//     marginBottom: 16,
//     color: '#4caf50',
//     textAlign: 'center',
//   },
//   copyButton: {
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     backgroundColor: '#2196f3',
//     borderRadius: 6,
//   },
//   copyButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   keyDescription: {
//     textAlign: 'center',
//     color: '#666',
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   generateButton: {
//     paddingHorizontal: 32,
//     paddingVertical: 14,
//     backgroundColor: '#4caf50',
//     borderRadius: 6,
//   },
//   generateButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   completedSection: {
//     backgroundColor: '#e8f5e9',
//     borderRadius: 8,
//     padding: 20,
//     borderWidth: 2,
//     borderColor: '#4caf50',
//     alignItems: 'center',
//   },
//   completedEmoji: {
//     fontSize: 48,
//     marginBottom: 16,
//   },
//   completedTitle: {
//     fontSize: 18,
//     color: '#2e7d32',
//     fontWeight: 'bold',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   completedDetails: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
//   completedItem: {
//     width: '48%',
//     marginBottom: 8,
//   },
//   completedLabel: {
//     fontSize: 14,
//     color: '#666',
//   },
//   completedValue: {
//     fontWeight: 'bold',
//   },
//   flowInfo: {
//     backgroundColor: '#f0f7ff',
//     borderRadius: 12,
//     padding: 24,
//     margin: 16,
//     borderWidth: 1,
//     borderColor: '#bbdefb',
//   },
//   flowTitle: {
//     fontSize: 18,
//     color: '#333',
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   flowSteps: {
//     gap: 16,
//   },
//   flowStep: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   stepNumber: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   stepNumberText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   stepText: {
//     flex: 1,
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   stepBold: {
//     fontWeight: 'bold',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 30,
//     borderRadius: 12,
//     width: '100%',
//     maxWidth: 500,
//     alignItems: 'center',
//   },
//   modalEmoji: {
//     fontSize: 48,
//     marginBottom: 16,
//   },
//   modalTitle: {
//     fontSize: 22,
//     color: '#4caf50',
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   modalKeyDisplay: {
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//     padding: 20,
//     marginVertical: 16,
//     width: '100%',
//     borderWidth: 2,
//     borderStyle: 'dashed',
//     borderColor: '#4caf50',
//   },
//   modalKeyText: {
//     fontFamily: 'monospace',
//     fontSize: 20,
//     fontWeight: 'bold',
//     letterSpacing: 2,
//     textAlign: 'center',
//   },
//   modalInstructions: {
//     backgroundColor: '#e8f5e9',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 24,
//     width: '100%',
//   },
//   modalInstructionsTitle: {
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#2e7d32',
//   },
//   instructionsList: {
//     paddingLeft: 8,
//   },
//   instructionItem: {
//     color: '#333',
//     marginBottom: 4,
//     fontSize: 14,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     gap: 12,
//   },
//   modalButton: {
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     backgroundColor: '#1976d2',
//     borderRadius: 6,
//     minWidth: 140,
//     alignItems: 'center',
//   },
//   modalButtonSecondary: {
//     backgroundColor: '#4caf50',
//   },
//   modalButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default TraderTransport;












import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const API_BASE = 'https://kisan.etpl.ai';

interface Order {
  _id: string;
  orderId: string;
  traderId: string;
  traderName: string;
  farmerId: string;
  productItems: Array<{
    productId: string;
    grade: string;
    quantity: number;
  }>;
  traderToAdminPayment: {
    paymentStatus: string;
    remainingAmount: number;
    paidAmount: number;
    totalAmount: number;
  };
  transporterStatus: string;
  marketToTraderTransport?: {
    status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected';
    transporterId?: string;
    transporterName?: string;
    transporterMobile?: string;
    adminGeneratedKey?: string;
    deliveryKey?: string;
    journeyStartedAt?: string;
    journeyCompletedAt?: string;
    deliveryKeyEnteredAt?: string;
  };
}

const TraderTransport: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const router = useRouter();
  const traderId = "trd-13";
  const traderName = "Trader";

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/orders/trader/${traderId}/transport`);
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Error fetching trader orders:', error);
      Alert.alert('Error', 'Error loading your orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const generateDeliveryKey = async (order: Order) => {
    try {
      const res = await axios.post(`${API_BASE}/api/orders/market-to-trader/trader/generate-key`, {
        orderId: order.orderId,
        traderId: order.traderId
      });
      
      if (res.data.success) {
        setGeneratedKey(res.data.data.deliveryKey);
        setSelectedOrder(order);
        setShowKeyModal(true);
        fetchOrders();
        Alert.alert('Success', 'Delivery key generated! Share with transporter when they arrive with goods.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Error generating delivery key');
    }
  };

  const autoGenerateKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = 'TRADER';
    for (let i = 0; i < 6; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const quickGenerateKey = (order: Order) => {
    const key = autoGenerateKey();
    setGeneratedKey(key);
    setSelectedOrder(order);
    setShowKeyModal(true);
    
    setTimeout(() => {
      fetchOrders();
    }, 500);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-500';
      case 'accepted': return 'bg-blue-700';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (order: Order) => {
    const transport = order.marketToTraderTransport;
    
    if (!transport) return 'Ready for Transport';
    
    switch (transport.status) {
      case 'pending': return '⏳ Waiting for Transporter';
      case 'accepted': return '✅ Transporter Assigned - Waiting for Pickup';
      case 'in_progress': 
        return transport.deliveryKey 
          ? '🚚 On the Way - Generate Key Below' 
          : '🚚 On the Way - Wait for Arrival';
      case 'completed': return '✅ Delivered Successfully';
      default: return transport.status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not yet';
    return new Date(dateString).toLocaleString();
  };

  const isOrderInProgress = (order: Order) => {
    const transport = order.marketToTraderTransport;
    return transport?.status === 'in_progress';
  };

  const hasGeneratedKey = (order: Order) => {
    const transport = order.marketToTraderTransport;
    return !!transport?.deliveryKey;
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Success', 'Key copied to clipboard!');
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#1976d2" />
        <Text className="mt-4 text-lg text-gray-600">Loading your orders...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-5 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">📦 Your Goods Delivery</Text>
        <TouchableOpacity 
          className="px-4 py-2 bg-blue-700 rounded"
          onPress={fetchOrders}
        >
          <Text className="text-white font-bold">🔄 Refresh Orders</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* Status Summary */}
        <View className="flex-row bg-blue-50 mx-4 my-4 p-4 rounded-lg">
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-blue-700">
              {orders.filter(o => o.marketToTraderTransport?.status === 'in_progress').length}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">In Transit</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-orange-500">
              {orders.filter(o => !o.marketToTraderTransport || ['pending', 'accepted'].includes(o.marketToTraderTransport?.status || '')).length}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">Waiting</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-green-500">
              {orders.filter(o => o.marketToTraderTransport?.status === 'completed').length}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">Delivered</Text>
          </View>
        </View>

        {orders.length === 0 ? (
          <View className="items-center bg-gray-50 mx-4 my-4 p-12 rounded-xl border-2 border-dashed border-gray-300">
            <Text className="text-5xl mb-4">📭</Text>
            <Text className="text-lg text-gray-600 font-bold mb-2">No Orders Ready for Delivery</Text>
            <Text className="text-center text-gray-500 text-sm leading-5">
              Your orders will appear here once payment is fully paid and farmer-to-market transport is completed.
            </Text>
          </View>
        ) : (
          <View className="px-4">
            {orders.map((order) => {
              const transport = order.marketToTraderTransport;
              const isInProgress = isOrderInProgress(order);
              const isCompleted = transport?.status === 'completed';
              const canGenerateKey = isInProgress && !hasGeneratedKey(order);
              const shouldShowKey = isInProgress && hasGeneratedKey(order);

              return (
                <View 
                  key={order._id} 
                  className="bg-white rounded-xl p-5 mb-4 shadow-lg shadow-gray-200"
                >
                  {/* Order Header */}
                  <View className="flex-row justify-between items-start mb-5">
                    <View>
                      <Text className="text-lg font-bold text-gray-800">Order: {order.orderId}</Text>
                      <View className="flex-row items-center mt-2">
                        <Text className="text-sm text-gray-600 mr-2">Payment:</Text>
                        <View className={`
                          px-2 py-1 rounded
                          ${order.traderToAdminPayment.paymentStatus === 'paid' 
                            ? 'bg-green-50' 
                            : 'bg-yellow-50'
                          }
                        `}>
                          <Text className={`
                            font-bold text-xs
                            ${order.traderToAdminPayment.paymentStatus === 'paid' 
                              ? 'text-green-700' 
                              : 'text-orange-500'
                            }
                          `}>
                            {order.traderToAdminPayment.paymentStatus.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="items-end">
                      <View className={`${getStatusColor(transport?.status)} px-4 py-2 rounded-full`}>
                        <Text className="text-white text-xs font-bold">{getStatusText(order)}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Transporter Info */}
                  {transport?.transporterName && (
                    <View className="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-blue-700">
                      <Text className="font-bold mb-2 text-blue-700">🚚 Transporter Details</Text>
                      <View className="flex-row flex-wrap">
                        <View className="w-1/2 mb-2">
                          <Text className="text-sm text-gray-600">Name</Text>
                          <Text className="font-bold">{transport.transporterName}</Text>
                        </View>
                        <View className="w-1/2 mb-2">
                          <Text className="text-sm text-gray-600">Contact</Text>
                          <Text className="font-bold">{transport.transporterMobile || 'N/A'}</Text>
                        </View>
                        {transport?.journeyStartedAt && (
                          <View className="w-1/2 mb-2">
                            <Text className="text-sm text-gray-600">Journey Started</Text>
                            <Text className="font-bold">{formatDate(transport.journeyStartedAt)}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                  {/* Items List */}
                  <View className="bg-amber-50 rounded-lg p-4 mb-4">
                    <Text className="font-bold mb-3 text-amber-600">📦 Your Order Items</Text>
                    <View className="flex-row flex-wrap">
                      {order.productItems.map((item, index) => (
                        <View 
                          key={index} 
                          className="w-[48%] mr-[4%] mb-3 p-3 bg-white rounded border border-amber-200"
                        >
                          <Text className="font-bold mb-1">{item.productId}</Text>
                          <Text className="text-xs text-gray-600">
                            Grade: {item.grade} | Qty: {item.quantity}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Delivery Key Section */}
                  {isInProgress && (
                    <View className={`
                      rounded-lg p-5 mb-4 border-2 items-center
                      ${shouldShowKey 
                        ? 'bg-green-50 border-green-500' 
                        : 'bg-yellow-50 border-yellow-500'
                      }
                    `}>
                      <Text className="text-2xl mb-3">{shouldShowKey ? '🔐' : '🔑'}</Text>
                      <Text className={`
                        font-bold text-lg mb-2 text-center
                        ${shouldShowKey ? 'text-green-700' : 'text-yellow-600'}
                      `}>
                        {shouldShowKey ? '✅ Delivery Key Generated' : 'Generate Delivery Key'}
                      </Text>
                      
                      {shouldShowKey ? (
                        <>
                          <View className="bg-gray-50 rounded-lg p-4 my-4 w-full">
                            <Text className="font-mono text-xl font-bold text-center tracking-wide">
                              {transport.deliveryKey}
                            </Text>
                          </View>
                          <Text className="text-base mb-4 text-green-600 text-center">
                            ✅ Share this key with the transporter when they arrive
                          </Text>
                          
                          <TouchableOpacity
                            className="px-6 py-3 bg-blue-500 rounded"
                            onPress={() => copyToClipboard(transport.deliveryKey || '')}
                          >
                            <Text className="text-white font-bold text-base">📋 Copy Key to Share</Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <>
                          <Text className="text-center text-gray-600 mb-5 leading-5">
                            Transporter is on the way with your goods. Generate a delivery key to give to the transporter 
                            when they arrive and you verify the goods.
                          </Text>
                          
                          <TouchableOpacity
                            className="px-8 py-3 bg-green-500 rounded"
                            onPress={() => generateDeliveryKey(order)}
                          >
                            <Text className="text-white font-bold text-base">🔑 Generate Delivery Key</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  )}

                  {/* Completed Status */}
                  {isCompleted && (
                    <View className="bg-green-50 rounded-lg p-5 border-2 border-green-500 items-center">
                      <Text className="text-5xl mb-4">🎉</Text>
                      <Text className="text-lg text-green-700 font-bold mb-3 text-center">
                        Delivery Completed Successfully!
                      </Text>
                      <View className="flex-row flex-wrap justify-center">
                        <View className="w-[48%] mb-2">
                          <Text className="text-sm text-gray-600">Completed At</Text>
                          <Text className="font-bold">{formatDate(transport?.journeyCompletedAt)}</Text>
                        </View>
                        <View className="w-[48%] mb-2">
                          <Text className="text-sm text-gray-600">Key Used At</Text>
                          <Text className="font-bold">{formatDate(transport?.deliveryKeyEnteredAt)}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Flow Information */}
        <View className="bg-blue-50 rounded-xl p-6 mx-4 my-4 border border-blue-200">
          <Text className="text-lg text-gray-800 font-bold mb-4">📊 Delivery Flow Status:</Text>
          <View className="space-y-4">
            <View className="flex-row items-center gap-3">
              <View className={`
                w-7 h-7 rounded-full justify-center items-center
                ${orders.some(o => !o.marketToTraderTransport || o.marketToTraderTransport.status === 'pending') 
                  ? 'bg-blue-700' 
                  : 'bg-gray-400'
                }
              `}>
                <Text className="text-white font-bold text-sm">1</Text>
              </View>
              <Text className="text-sm flex-1 leading-5">
                <Text className="font-bold">Transporter accepts order</Text> → Admin generates pickup key
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View className={`
                w-7 h-7 rounded-full justify-center items-center
                ${orders.some(o => o.marketToTraderTransport?.status === 'accepted') 
                  ? 'bg-blue-700' 
                  : 'bg-gray-400'
                }
              `}>
                <Text className="text-white font-bold text-sm">2</Text>
              </View>
              <Text className="text-sm flex-1 leading-5">
                <Text className="font-bold">Transporter starts journey</Text> → Enters admin key, status changes to "in_progress"
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View className={`
                w-7 h-7 rounded-full justify-center items-center
                ${orders.some(o => o.marketToTraderTransport?.status === 'in_progress') 
                  ? 'bg-blue-500' 
                  : 'bg-gray-400'
                }
              `}>
                <Text className="text-white font-bold text-sm">3</Text>
              </View>
              <Text className="text-sm flex-1 leading-5">
                <Text className="font-bold">You generate delivery key</Text> → When transporter arrives with goods
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View className={`
                w-7 h-7 rounded-full justify-center items-center
                ${orders.some(o => o.marketToTraderTransport?.status === 'completed') 
                  ? 'bg-green-500' 
                  : 'bg-gray-400'
                }
              `}>
                <Text className="text-white font-bold text-sm">4</Text>
              </View>
              <Text className="text-sm flex-1 leading-5">
                <Text className="font-bold">Transporter enters your key</Text> → Delivery marked as completed
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Generated Key Modal */}
      <Modal
        visible={showKeyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowKeyModal(false)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <View className="bg-white p-7 rounded-xl w-full max-w-[500px] items-center">
            <Text className="text-5xl mb-4">🔐</Text>
            <Text className="text-2xl text-green-500 font-bold mb-4 text-center">
              Delivery Key Generated!
            </Text>
            
            <View className="bg-gray-50 rounded-lg p-5 my-4 w-full border-2 border-dashed border-green-500">
              <Text className="font-mono text-xl font-bold text-center tracking-wider">
                {generatedKey}
              </Text>
            </View>
            
            <View className="bg-green-50 rounded-lg p-4 mb-6 w-full">
              <Text className="font-bold mb-2 text-green-700">📋 Instructions:</Text>
              <View className="pl-2">
                <Text className="text-gray-800 mb-1 text-sm">1. Transporter is on the way with your goods</Text>
                <Text className="text-gray-800 mb-1 text-sm">2. When transporter arrives, VERIFY the goods first</Text>
                <Text className="text-gray-800 mb-1 text-sm">3. Check quantity, quality, and condition</Text>
                <Text className="text-gray-800 mb-1 text-sm">4. Only then share this key with the transporter</Text>
                <Text className="text-gray-800 text-sm">5. Transporter will enter this key to complete delivery</Text>
              </View>
            </View>
            
            <View className="flex-row flex-wrap justify-center gap-3">
              <TouchableOpacity
                className="px-6 py-3 bg-blue-700 rounded min-w-[140px] items-center"
                onPress={() => {
                  copyToClipboard(generatedKey);
                }}
              >
                <Text className="text-white font-bold text-base">📋 Copy Key</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-6 py-3 bg-green-500 rounded min-w-[140px] items-center"
                onPress={() => {
                  setShowKeyModal(false);
                  fetchOrders();
                }}
              >
                <Text className="text-white font-bold text-base">👍 Got It</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TraderTransport;