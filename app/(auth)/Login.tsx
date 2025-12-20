// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { Eye, EyeOff } from "lucide-react-native";
// import React, { useState,useEffect } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   ImageBackground,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StatusBar,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import CustomAlert from "../../components/CustomAlert";

// const LoginScreen: React.FC = () => {
//   const params = useLocalSearchParams();
//   const router = useRouter();

//   const roleParam = Array.isArray(params.role) ? params.role[0] : params.role;
//   const role = (roleParam as string) || "farmer";

//   const [loginMethod, setLoginMethod] = useState<"mpin" | "password" | "otp">(
//     "otp"
//   );
//   const [mobileNo, setMobileNo] = useState("");
//   const [mpin, setMpin] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [error, setError] = useState("");
//   const [showAlert, setShowAlert] = useState(false);

//   // ----------------------------
//   // ROLE-BASED ENDPOINTS
//   // ----------------------------
//   const getEndpoint = (type: string) => {
//     if (role === "transport") {
//       if (type === "sendOtp") return "https://kisan.etpl.ai/transport/send-otp";
//       if (type === "verifyOtp")
//         return "https://kisan.etpl.ai/transport/verify-otp-login";
//       if (type === "mpin")
//         return "https://kisan.etpl.ai/transport/login-with-mpin";
//       if (type === "password")
//         return "https://kisan.etpl.ai/transport/login-with-password";
//     }

//     // Farmer + Trader
//     if (type === "sendOtp") return "https://kisan.etpl.ai/farmer/send-otp";
//     if (type === "verifyOtp")
//       return "https://kisan.etpl.ai/farmer/verify-otp-login";
//     if (type === "mpin") return "https://kisan.etpl.ai/farmer/login-mpin";
//     if (type === "password")
//       return "https://kisan.etpl.ai/farmer/login-password";
//   };

//   const goToRegister = () => {
//     router.push({
//       pathname: "/(auth)/Registration",
//       params: { role },
//     });
//   };

//   // RESET VALUES WHEN METHOD CHANGES
//   const selectMethod = (method: "mpin" | "password" | "otp") => {
//     setLoginMethod(method);
//     setError("");
//     setOtpSent(false);
//     setOtp("");
//     setMpin("");
//     setPassword("");
//   };

//   // ----------------------------
//   // SEND OTP
//   // ----------------------------
//   const handleSendOtp = async () => {
//     setError("");

//     if (!mobileNo || mobileNo.length !== 10) {
//       setError("Please enter a valid 10-digit mobile number");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await axios.post(getEndpoint("sendOtp")!, {
//         mobileNo,
//         role,
//       });

//       if (response.data.success) {
//         setOtpSent(true);
//         Alert.alert("Success", "OTP sent successfully!");
//       }
//     } catch (err: any) {
//       setError(err?.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ----------------------------
//   // LOGIN
//   // ----------------------------
//   const handleLogin = async () => {
//     setError("");

//     if (!mobileNo || mobileNo.length !== 10) {
//       setError("Please enter a valid 10-digit mobile number");
//       return;
//     }

//     try {
//       setLoading(true);
//       let response;

//       // OTP LOGIN
//       if (loginMethod === "otp") {
//         if (!otp.trim()) return setError("OTP is required");
//         if (otp.length !== 6) return setError("OTP must be 6 digits");

//         response = await axios.post(getEndpoint("verifyOtp")!, {
//           mobileNo,
//           otp,
//           role,
//         });
//       }

//       // MPIN LOGIN
//       else if (loginMethod === "mpin") {
//         if (!mpin.trim()) return setError("MPIN is required");
//         if (mpin.length !== 4) return setError("MPIN must be 4 digits");

//         response = await axios.post(getEndpoint("mpin")!, {
//           mobileNo,
//           mpin,
//           role,
//         });
//       }

//       // PASSWORD LOGIN
//       else {
//         if (!password.trim()) return setError("Password is required");
//         if (password.length < 4)
//           return setError("Password must be at least 4 characters");

//         response = await axios.post(getEndpoint("password")!, {
//           mobileNo,
//           password,
//           role,
//         });
//       }

//       if (!response.data.success) {
//         return setError(response.data.message || "Login failed");
//       }

//       // SAVE WHEN ROLE = TRANSPORT
//       if (role === "transport") {
//         const user = response.data.data;

//         await AsyncStorage.setItem("mobile", mobileNo);
//         await AsyncStorage.setItem("userId", user.id);
//         await AsyncStorage.setItem("transporter_data", JSON.stringify(user));

//         if (response.data.token) {
//           await AsyncStorage.setItem("transporter_token", response.data.token);
//         }

//         router.replace("/(transporter)/home");
//         return;
//       }

//       // FARMER + TRADER
//       await AsyncStorage.setItem("isLoggedIn", "true");
//       await AsyncStorage.setItem("role", role);

//       setShowAlert(true);

//       if (role === "farmer") router.push("/(farmer)/home");
//       else if (role === "trader") router.push("/(trader)/home");
//       else router.push("/");
//     } catch (err: any) {
//       setError(err?.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//   if (showAlert) {
//     const timer = setTimeout(() => {
//       setShowAlert(false);

//       if (role === "farmer") router.replace("/(farmer)/home");
//       else if (role === "trader") router.replace("/(trader)/home");
//     }, 1200);

//     return () => clearTimeout(timer);
//   }
// }, [showAlert]);

//   // ----------------------------
//   // UI
//   // ----------------------------
//   return (
//    <>
// <CustomAlert
//       visible={showAlert}
//       title="Success"
//       message="Login successful!"
//       onClose={() => setShowAlert(false)}
//     />

//     <View className="flex-1 bg-white py-10">
//       <StatusBar barStyle="dark-content" />

//       <ImageBackground
//         source={require("../../assets/images/green-bg.jpg")}
//         resizeMode="contain"
//         className="flex-1 bg-position-bottom"
//       >
//         <View className="flex-1 bg-white/60">
//           <KeyboardAvoidingView
//             className="flex-1"
//             behavior={Platform.OS === "ios" ? "padding" : undefined}
//           >
//             <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//               <View className="flex-1 px-6 pt-12 pb-8">
//                 {/* Logo */}
//                 <View className="items-center mb-6">
//                   <Text className="text-[#1FAD4E] text-4xl">🌾</Text>
//                   <Text className="text-2xl font-heading text-slate-900">
//                     Welcome back
//                   </Text>
//                   <Text className="text-xs text-slate-500 mt-1 font-subheading">
//                     Login to Your {role} Account.
//                   </Text>
//                 </View>

//                 {/* Card */}
//                 <View className="px-5 pt-4 pb-6">
//                   {/* PHONE NUMBER */}
//                   <Text className="text-xs text-slate-600 mb-1 font-subheading">
//                     Phone Number
//                   </Text>

//                   <View className="flex-row items-center border border-slate-200 rounded-lg px-3 py-2 mb-3 bg-slate-50">
//                     <MaterialCommunityIcons
//                       name="phone"
//                       size={18}
//                       color="#64748B"
//                     />
//                     <Text className="mx-2 text-slate-700 font-medium">+91</Text>
//                     <TextInput
//                       value={mobileNo}
//                       onChangeText={(t) => {
//                         setMobileNo(t);
//                         setOtpSent(false);
//                       }}
//                       keyboardType="number-pad"
//                       maxLength={10}
//                       placeholder="9876543210"
//                       className="flex-1 text-sm font-medium"
//                     />
//                   </View>

//                   {/* OTP FLOW */}
//                   {loginMethod === "otp" && (
//                     <>
//                       {!otpSent ? (
//                         <TouchableOpacity
//                           onPress={handleSendOtp}
//                           className="bg-[#1FAD4E] rounded-lg py-3 items-center"
//                         >
//                           {loading ? (
//                             <ActivityIndicator color="#fff" />
//                           ) : (
//                             <Text className="text-white text-base font-medium">
//                               Send OTP via WhatsApp
//                             </Text>
//                           )}
//                         </TouchableOpacity>
//                       ) : (
//                         <>
//                           <TextInput
//                             className="border border-slate-200 rounded-xl px-3 py-2 mt-3 bg-slate-50 font-medium"
//                             placeholder="Enter 6-digit OTP"
//                             keyboardType="number-pad"
//                             maxLength={6}
//                             value={otp}
//                             onChangeText={setOtp}
//                           />
//                           <TouchableOpacity onPress={handleSendOtp}>
//                             <Text className="text-xs text-[#1FAD4E] mt-2 font-medium">
//                               Resend OTP
//                             </Text>
//                           </TouchableOpacity>
//                         </>
//                       )}
//                     </>
//                   )}

//                   {/* MPIN FLOW */}
//                   {loginMethod === "mpin" && (
//                     <TextInput
//                       className="border border-slate-200 rounded-lg px-3 py-2 mt-3 bg-slate-50 font-medium"
//                       placeholder="Enter 4-digit MPIN"
//                       keyboardType="number-pad"
//                       secureTextEntry
//                       maxLength={4}
//                       value={mpin}
//                       onChangeText={setMpin}
//                     />
//                   )}

//                   {/* PASSWORD FLOW */}
//                   {loginMethod === "password" && (
//                     <View className="flex-row items-center border border-slate-200 rounded-lg bg-slate-50 px-3 mt-3 font-medium" >
//                       <TextInput
//                         className="flex-1 py-2 "
//                         placeholder="Enter your password"
//                         secureTextEntry={!showPassword}
//                         value={password}
//                         onChangeText={setPassword}
//                       />
//                       <TouchableOpacity
//                         onPress={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? (
//                           <EyeOff size={20} />
//                         ) : (
//                           <Eye size={20} />
//                         )}
//                       </TouchableOpacity>
//                     </View>
//                   )}

//                   {/* ERROR */}
//                   {error !== "" && (
//                     <View className="bg-red-100 border border-red-300 py-2 px-3 rounded-xl mt-3">
//                       <Text className="text-xs text-red-700">{error}</Text>
//                     </View>
//                   )}

//                   {/* LOGIN BUTTON */}
//                   {(loginMethod !== "otp" || otpSent) && (
//                     <TouchableOpacity
//                       onPress={handleLogin}
//                       className="bg-[#1FAD4E] rounded-lg py-3 items-center mt-4 font-medium"
//                     >
//                       {loading ? (
//                         <ActivityIndicator color="#fff" />
//                       ) : (
//                         <Text className="text-white font-medium">Login</Text>
//                       )}
//                     </TouchableOpacity>
//                   )}

//                   {/* DIVIDER */}
//                   <View className="flex-row items-center my-5">
//                     <View className="flex-1 h-px bg-slate-300" />
//                     <Text className="text-xs text-slate-500 px-3 font-medium">or</Text>
//                     <View className="flex-1 h-px bg-slate-300" />
//                   </View>

//                   {/* ----------------------- LOGIN METHOD SWITCHER AT BOTTOM ----------------------- */}
//                   <View className="flex-col justify-around gap-3 ">
//                     <TouchableOpacity
//                       activeOpacity={0.9}
//                       className="flex-row items-center justify-center bg-white rounded-2xl py-3 border border-slate-200"
//                       onPress={() => selectMethod("mpin")}
//                     >
//                       <MaterialCommunityIcons
//                         name="dialpad"
//                         size={15}
//                         color="#1F2933"
//                       />
//                       <Text className="ml-2 text-sm font-heading text-slate-800 font-medium">
//                         Use MPIN
//                       </Text>
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       activeOpacity={0.9}
//                       className="flex-row items-center justify-center bg-white rounded-2xl py-3 mb-3 border border-slate-200 font-heading"
//                       onPress={() => selectMethod("password")}
//                     >
//                       <MaterialCommunityIcons
//                         name="lock-outline"
//                         size={15}
//                         color="#1F2933"
//                       />
//                       <Text className="ml-2 text-sm font-heading text-slate-800 font-medium">
//                         Login using password
//                       </Text>
//                     </TouchableOpacity>
//                   </View>

//                   {/* Register & forgot links */}
//                   <View className="flex-row justify-center mt-5">
//                     <Text className="text-xs text-slate-500 font-medium">
//                       Don&apos;t have an account ? {" "}
//                     </Text>
//                     <TouchableOpacity onPress={goToRegister}>
//                       <Text className="text-xs font-medium text-[#1FAD4E]">
//                         Register here
//                       </Text>
//                     </TouchableOpacity>
//                   </View>

//                   <View className="flex-row justify-center items-center mt-1">
//                     <TouchableOpacity>
//                       <Text className="text-xs text-[#1FAD4E] font-medium">
//                         Forgot MPIN?
//                       </Text>
//                     </TouchableOpacity>
//                     <Text className="mx-2 text-slate-300">|</Text>
//                     <TouchableOpacity>
//                       <Text className="text-xs text-[#1FAD4E] font-medium">
//                         Forgot Password?
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             </ScrollView>
//           </KeyboardAvoidingView>
//         </View>
//       </ImageBackground>
//     </View>

//   </>
//   );
// };

// export default LoginScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
const LoginPage = () => {
  const [loginMethod, setLoginMethod] = useState("otp"); // 'otp', 'mpin', 'password'
  const [step, setStep] = useState("phone"); // 'phone', 'verify'
  const [formData, setFormData] = useState({
    mobileNo: "",
    otp: "",
    mpin: "",
    password: "",
    role: "",
  });

  const navigation = useNavigation();
  const route = useRoute();
  const role = (route.params as { role?: string })?.role || "farmer";
  const router = useRouter();
  const goToRegister = () => {
    router.push({
      pathname: "./(auth)/Registration",
      params: { role },
    });
  };
  const redirectByRole = (userRole: string) => {
    if (userRole === "trader") {
      router.replace("/(trader)/home");
    } else if (userRole === "farmer") {
      router.replace("/(farmer)/home");
    } else if (userRole === "transport") {
      router.replace("/(transporter)/home");
    } else {
      router.replace("/(auth)/Login");
    }
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // API Base URL - Update this to your backend URL
  const API_URL = "https://kisan.etpl.ai/farmer";

  // Handle input change
  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Save user data to AsyncStorage
  const saveUserToAsyncStorage = async (userData: any) => {
    try {
      if (!userData) return;

      // Save full object
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      // Use fallback keys safely
      if (userData.id || userData._id) {
        await AsyncStorage.setItem(
          "userId",
          String(userData.id ?? userData._id)
        );
      }

      if (userData.name) {
        await AsyncStorage.setItem("userName", userData.name);
      }

      if (userData.mobileNo) {
        await AsyncStorage.setItem("userMobile", userData.mobileNo);
      }

      if (userData.role) {
        await AsyncStorage.setItem("userRole", userData.role);
      }

      // Role-based IDs (ONLY if present)
      if (userData.role === "farmer" && userData.farmerId) {
        await AsyncStorage.setItem("farmerId", String(userData.farmerId));
      }

      if (userData.role === "trader" && userData.traderId) {
        await AsyncStorage.setItem("traderId", String(userData.traderId));
      }

      if (userData.role === "transport" && userData.transportId) {
        await AsyncStorage.setItem("transportId", String(userData.transportId));
      }

      console.log("✅ User data saved safely:", userData);
    } catch (error) {
      console.error("❌ AsyncStorage save error:", error);
    }
  };

  const logoutUser = async () => {
    try {
      // Clear specific keys
      await AsyncStorage.multiRemove([
        "userData",
        "userId",
        "userName",
        "userMobile",
        "userRole",
        "farmerId",
        "traderId",
      ]);

      console.log("User logged out and AsyncStorage cleared");

      // Redirect to login page
      router.replace("/(auth)/Login");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  // Send OTP
  const sendOTP = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNo: formData.mobileNo,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setStep("verify");
        // For testing - log OTP (remove in production)
        if (data.otp) console.log("OTP:", data.otp);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to send OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and Login
  const verifyOTP = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNo: formData.mobileNo,
          otp: formData.otp,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Save user data to AsyncStorage
        await saveUserToAsyncStorage(data.data);
        setMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });

        // Redirect after 0.5 second
        setTimeout(() => {
          redirectByRole(data.data.role);
        }, 500);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Verification failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Login with MPIN
  const loginWithMPIN = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${API_URL}/login-mpin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNo: formData.mobileNo,
          mpin: formData.mpin,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await saveUserToAsyncStorage(data.data);
        setMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });

        setTimeout(() => {
          redirectByRole(data.data.role);
        }, 500);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Login with Password
  const loginWithPassword = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${API_URL}/login-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNo: formData.mobileNo,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await saveUserToAsyncStorage(data.data);
        setMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });

        setTimeout(() => {
          redirectByRole(data.data.role);
        }, 500);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>👤</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
        </View>

        {/* Login Method Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => {
              setLoginMethod("otp");
              setStep("phone");
            }}
            style={[styles.tab, loginMethod === "otp" && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                loginMethod === "otp" && styles.activeTabText,
              ]}
            >
              OTP
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLoginMethod("mpin");
              setStep("phone");
            }}
            style={[styles.tab, loginMethod === "mpin" && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                loginMethod === "mpin" && styles.activeTabText,
              ]}
            >
              MPIN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLoginMethod("password");
              setStep("phone");
            }}
            style={[styles.tab, loginMethod === "password" && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                loginMethod === "password" && styles.activeTabText,
              ]}
            >
              Password
            </Text>
          </TouchableOpacity>
        </View>

        {/* Alert Messages */}
        {message.text ? (
          <View
            style={[
              styles.alertContainer,
              message.type === "success"
                ? styles.successAlert
                : styles.errorAlert,
            ]}
          >
            <Text
              style={[
                styles.alertText,
                message.type === "success"
                  ? styles.successText
                  : styles.errorText,
              ]}
            >
              {message.text}
            </Text>
          </View>
        ) : null}

        {/* OTP Login */}
        {loginMethod === "otp" && step === "phone" && (
          <View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={formData.mobileNo}
                onChangeText={(text) => handleChange("mobileNo", text)}
                placeholder="Enter 10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            <TouchableOpacity
              onPress={sendOTP}
              disabled={loading}
              style={[styles.button, loading && styles.buttonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* OTP Verification */}
        {loginMethod === "otp" && step === "verify" && (
          <View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={[styles.input, styles.otpInput]}
                value={formData.otp}
                onChangeText={(text) => handleChange("otp", text)}
                placeholder="Enter 6-digit OTP"
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            <TouchableOpacity
              onPress={verifyOTP}
              disabled={loading}
              style={[styles.button, loading && styles.buttonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify & Login</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStep("phone")}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>
                Change Mobile Number
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MPIN Login */}
        {loginMethod === "mpin" && (
          <View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={formData.mobileNo}
                onChangeText={(text) => handleChange("mobileNo", text)}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>MPIN</Text>
              <TextInput
                style={styles.input}
                value={formData.mpin}
                onChangeText={(text) => handleChange("mpin", text)}
                placeholder="Enter 4-digit MPIN"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
              />
            </View>
            <TouchableOpacity
              onPress={loginWithMPIN}
              disabled={loading}
              style={[styles.button, loading && styles.buttonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login with MPIN</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Password Login */}
        {loginMethod === "password" && (
          <View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={formData.mobileNo}
                onChangeText={(text) => handleChange("mobileNo", text)}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                placeholder="Enter password"
                secureTextEntry
              />
            </View>
            <TouchableOpacity
              onPress={loginWithPassword}
              disabled={loading}
              style={[styles.button, loading && styles.buttonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login with Password</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity onPress={logoutUser} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={goToRegister}>
            <Text style={styles.registerLink}>Register here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#16a34a",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  activeTabText: {
    color: "#16a34a",
  },
  alertContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  successAlert: {
    backgroundColor: "#f0fdf4",
  },
  errorAlert: {
    backgroundColor: "#fef2f2",
  },
  alertText: {
    fontSize: 14,
    flex: 1,
  },
  successText: {
    color: "#166534",
  },
  errorText: {
    color: "#991b1b",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  otpInput: {
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 8,
  },
  button: {
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#16a34a",
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  registerLink: {
    fontSize: 14,
    color: "#16a34a",
    fontWeight: "600",
  },
});

export default LoginPage;
