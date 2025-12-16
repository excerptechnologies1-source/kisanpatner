

import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LoginScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const roleParam = Array.isArray(params.role) ? params.role[0] : params.role;
  const role = (roleParam as string) || "farmer";

  const [loginMethod, setLoginMethod] = useState<"mpin" | "password" | "otp">(
    "otp"
  );
  const [mobileNo, setMobileNo] = useState("");
  const [mpin, setMpin] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  // ----------------------------
  // ROLE-BASED ENDPOINTS
  // ----------------------------
  const getEndpoint = (type: string) => {
    if (role === "transport") {
      if (type === "sendOtp") return "https://kisan.etpl.ai/transport/send-otp";
      if (type === "verifyOtp")
        return "https://kisan.etpl.ai/transport/verify-otp-login";
      if (type === "mpin")
        return "https://kisan.etpl.ai/transport/login-with-mpin";
      if (type === "password")
        return "https://kisan.etpl.ai/transport/login-with-password";
    }

    // Farmer + Trader
    if (type === "sendOtp") return "https://kisan.etpl.ai/farmer/send-otp";
    if (type === "verifyOtp")
      return "https://kisan.etpl.ai/farmer/verify-otp-login";
    if (type === "mpin") return "https://kisan.etpl.ai/farmer/login-mpin";
    if (type === "password")
      return "https://kisan.etpl.ai/farmer/login-password";
  };

  const goToRegister = () => {
    router.push({
      pathname: "/(auth)/Registration",
      params: { role },
    });
  };

  // RESET VALUES WHEN METHOD CHANGES
  const selectMethod = (method: "mpin" | "password" | "otp") => {
    setLoginMethod(method);
    setError("");
    setOtpSent(false);
    setOtp("");
    setMpin("");
    setPassword("");
  };

  // ----------------------------
  // SEND OTP
  // ----------------------------
  const handleSendOtp = async () => {
    setError("");

    if (!mobileNo || mobileNo.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(getEndpoint("sendOtp")!, {
        mobileNo,
        role,
      });

      if (response.data.success) {
        setOtpSent(true);
        Alert.alert("Success", "OTP sent successfully!");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // LOGIN
  // ----------------------------
  const handleLogin = async () => {
    setError("");

    if (!mobileNo || mobileNo.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      let response;

      // OTP LOGIN
      if (loginMethod === "otp") {
        if (!otp.trim()) return setError("OTP is required");
        if (otp.length !== 6) return setError("OTP must be 6 digits");

        response = await axios.post(getEndpoint("verifyOtp")!, {
          mobileNo,
          otp,
          role,
        });
      }

      // MPIN LOGIN
      else if (loginMethod === "mpin") {
        if (!mpin.trim()) return setError("MPIN is required");
        if (mpin.length !== 4) return setError("MPIN must be 4 digits");

        response = await axios.post(getEndpoint("mpin")!, {
          mobileNo,
          mpin,
          role,
        });
      }

      // PASSWORD LOGIN
      else {
        if (!password.trim()) return setError("Password is required");
        if (password.length < 4)
          return setError("Password must be at least 4 characters");

        response = await axios.post(getEndpoint("password")!, {
          mobileNo,
          password,
          role,
        });
      }

      if (!response.data.success) {
        return setError(response.data.message || "Login failed");
      }

      // SAVE WHEN ROLE = TRANSPORT
      if (role === "transport") {
        const user = response.data.data;

        await AsyncStorage.setItem("mobile", mobileNo);
        await AsyncStorage.setItem("userId", user.id);
        await AsyncStorage.setItem("transporter_data", JSON.stringify(user));

        if (response.data.token) {
          await AsyncStorage.setItem("transporter_token", response.data.token);
        }

        router.replace("/(transporter)/home");
        return;
      }

      // FARMER + TRADER
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("role", role);

      Alert.alert("Success", "Login successful!");

      if (role === "farmer") router.push("/(farmer)/home");
      else if (role === "trader") router.push("/(trader)/home");
      else router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <View className="flex-1 bg-white py-10">
      <StatusBar barStyle="dark-content" />

      <ImageBackground
        source={require("../../assets/images/green-bg.jpg")}
        resizeMode="contain"
        className="flex-1 bg-position-bottom"
      >
        <View className="flex-1 bg-white/60">
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View className="flex-1 px-6 pt-12 pb-8">
                {/* Logo */}
                <View className="items-center mb-6">
                  <Text className="text-[#1FAD4E] text-4xl">🌾</Text>
                  <Text className="text-2xl font-heading text-slate-900">
                    Welcome back
                  </Text>
                  <Text className="text-xs text-slate-500 mt-1 font-subheading">
                    Login to Your {role} Account.
                  </Text>
                </View>

                {/* Card */}
                <View className="px-5 pt-4 pb-6">
                  {/* PHONE NUMBER */}
                  <Text className="text-xs text-slate-600 mb-1 font-subheading">
                    Phone Number
                  </Text>

                  <View className="flex-row items-center border border-slate-200 rounded-lg px-3 py-2 mb-3 bg-slate-50">
                    <MaterialCommunityIcons
                      name="phone"
                      size={18}
                      color="#64748B"
                    />
                    <Text className="mx-2 text-slate-700 font-medium">+91</Text>
                    <TextInput
                      value={mobileNo}
                      onChangeText={(t) => {
                        setMobileNo(t);
                        setOtpSent(false);
                      }}
                      keyboardType="number-pad"
                      maxLength={10}
                      placeholder="9876543210"
                      className="flex-1 text-sm font-medium"
                    />
                  </View>

                  {/* OTP FLOW */}
                  {loginMethod === "otp" && (
                    <>
                      {!otpSent ? (
                        <TouchableOpacity
                          onPress={handleSendOtp}
                          className="bg-[#1FAD4E] rounded-lg py-3 items-center"
                        >
                          {loading ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <Text className="text-white text-base font-medium">
                              Send OTP via WhatsApp
                            </Text>
                          )}
                        </TouchableOpacity>
                      ) : (
                        <>
                          <TextInput
                            className="border border-slate-200 rounded-xl px-3 py-2 mt-3 bg-slate-50 font-medium"
                            placeholder="Enter 6-digit OTP"
                            keyboardType="number-pad"
                            maxLength={6}
                            value={otp}
                            onChangeText={setOtp}
                          />
                          <TouchableOpacity onPress={handleSendOtp}>
                            <Text className="text-xs text-[#1FAD4E] mt-2 font-medium">
                              Resend OTP
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </>
                  )}

                  {/* MPIN FLOW */}
                  {loginMethod === "mpin" && (
                    <TextInput
                      className="border border-slate-200 rounded-lg px-3 py-2 mt-3 bg-slate-50 font-medium"
                      placeholder="Enter 4-digit MPIN"
                      keyboardType="number-pad"
                      secureTextEntry
                      maxLength={4}
                      value={mpin}
                      onChangeText={setMpin}
                    />
                  )}

                  {/* PASSWORD FLOW */}
                  {loginMethod === "password" && (
                    <View className="flex-row items-center border border-slate-200 rounded-lg bg-slate-50 px-3 mt-3 font-medium" >
                      <TextInput
                        className="flex-1 py-2 "
                        placeholder="Enter your password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* ERROR */}
                  {error !== "" && (
                    <View className="bg-red-100 border border-red-300 py-2 px-3 rounded-xl mt-3">
                      <Text className="text-xs text-red-700">{error}</Text>
                    </View>
                  )}

                  {/* LOGIN BUTTON */}
                  {(loginMethod !== "otp" || otpSent) && (
                    <TouchableOpacity
                      onPress={handleLogin}
                      className="bg-[#1FAD4E] rounded-lg py-3 items-center mt-4 font-medium"
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text className="text-white font-medium">Login</Text>
                      )}
                    </TouchableOpacity>
                  )}

                  {/* DIVIDER */}
                  <View className="flex-row items-center my-5">
                    <View className="flex-1 h-px bg-slate-300" />
                    <Text className="text-xs text-slate-500 px-3 font-medium">or</Text>
                    <View className="flex-1 h-px bg-slate-300" />
                  </View>

                  {/* ----------------------- LOGIN METHOD SWITCHER AT BOTTOM ----------------------- */}
                  <View className="flex-col justify-around gap-3 ">
                    <TouchableOpacity
                      activeOpacity={0.9}
                      className="flex-row items-center justify-center bg-white rounded-2xl py-3 border border-slate-200"
                      onPress={() => selectMethod("mpin")}
                    >
                      <MaterialCommunityIcons
                        name="dialpad"
                        size={15}
                        color="#1F2933"
                      />
                      <Text className="ml-2 text-sm font-heading text-slate-800 font-medium">
                        Use MPIN
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.9}
                      className="flex-row items-center justify-center bg-white rounded-2xl py-3 mb-3 border border-slate-200 font-heading"
                      onPress={() => selectMethod("password")}
                    >
                      <MaterialCommunityIcons
                        name="lock-outline"
                        size={15}
                        color="#1F2933"
                      />
                      <Text className="ml-2 text-sm font-heading text-slate-800 font-medium">
                        Login using password
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Register & forgot links */}
                  <View className="flex-row justify-center mt-5">
                    <Text className="text-xs text-slate-500 font-medium">
                      Don&apos;t have an account ? {" "}
                    </Text>
                    <TouchableOpacity onPress={goToRegister}>
                      <Text className="text-xs font-medium text-[#1FAD4E]">
                        Register here
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row justify-center items-center mt-1">
                    <TouchableOpacity>
                      <Text className="text-xs text-[#1FAD4E] font-medium">
                        Forgot MPIN?
                      </Text>
                    </TouchableOpacity>
                    <Text className="mx-2 text-slate-300">|</Text>
                    <TouchableOpacity>
                      <Text className="text-xs text-[#1FAD4E] font-medium">
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
