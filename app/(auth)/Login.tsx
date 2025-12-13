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
  const role = (params.role as string) || "farmer";
  console.log("Login role:", role);

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

  const goToRegister = () => {
    router.push({
      pathname: "/(auth)/Registration",
      params: { role },
    });
  };

  const selectMethod = (method: "mpin" | "password" | "otp") => {
    setLoginMethod(method);
    setError("");
    setOtpSent(false);
    setMpin("");
    setPassword("");
    setOtp("");
  };

  const handleSendOtp = async () => {
    setError("");
    if (!mobileNo.trim() || mobileNo.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://kisan.etpl.ai/farmer/send-otp",
        {
          mobileNo: mobileNo.trim(),
          role: role,
        }
      );

      if (response.data.success) {
        setOtpSent(true);
        Alert.alert(
          "Success",
          response.data.message || "OTP sent successfully to your WhatsApp"
        );
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError("");

    if (!mobileNo.trim() || mobileNo.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      let response;

      if (loginMethod === "otp") {
        if (!otp.trim()) {
          setError("Please enter the OTP");
          setLoading(false);
          return;
        }

        response = await axios.post(
          "https://kisan.etpl.ai/farmer/verify-otp-login",
          {
            mobileNo: mobileNo.trim(),
            otp: otp.trim(),
            role: role,
          }
        );
      } else if (loginMethod === "mpin") {
        if (!mpin.trim() || mpin.length !== 4) {
          setError("Please enter a valid 4-digit MPIN");
          setLoading(false);
          return;
        }

        response = await axios.post(
          "https://kisan.etpl.ai/farmer/login-mpin",
          {
            mobileNo: mobileNo.trim(),
            mpin: mpin.trim(),
            role: role,
          }
        );
      } else {
        if (!password.trim()) {
          setError("Please enter your password");
          setLoading(false);
          return;
        }

        response = await axios.post(
          "https://kisan.etpl.ai/farmer/login-password",
          {
            mobileNo: mobileNo.trim(),
            password: password.trim(),
            role: role,
          }
        );
      }
      console.log("Login response:", response.data);
      if (response.data.success) {
        await AsyncStorage.setItem("isLoggedIn", "true");
        await AsyncStorage.setItem("role", role);
        await AsyncStorage.setItem("farmerPhone", response.data.data.mobileNo);
        await AsyncStorage.setItem("farmerId", response.data.data.id);
        await AsyncStorage.setItem(
          "farmerData",
          JSON.stringify(response.data.data)
        );

        Alert.alert("Success", response.data.message || "Login successful!");
        // Navigate based on role
if (role === "farmer") {
  router.push("/(farmer)/home");
} else if (role === "trader") {
  router.push("/(trader)/home");
} else if (role === "transport") {
  router.push("/");
} else {
  // fallback (optional)
  router.push("/(auth)/Login");
}

      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white py-10">
      <StatusBar barStyle="dark-content" />

      {/* Background image */}
      <ImageBackground
        source={require("../../assets/images/green-bg.jpg")}
        resizeMode="contain"
        className="flex-1 bg-position-bottom"
      >
        {/* White overlay */}
        <View className="flex-1 bg-white/60">
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View className="flex-1 px-6 pt-12 pb-8">
                {/* Logo + title */}
                <View className="items-center mb-6">
                  <View className="h-18 w-18 items-center justify-center mb-3">
                    {/* green logo */}
                    <Text className="text-[#1FAD4E] text-2xl font-inter-semibold">🌾</Text>
                  </View>
                  <Text className="text-2xl font-inter-semibold text-slate-900">
                    Welcome back
                  </Text>
                  <Text className="text-xs text-slate-500 mt-1 font-inter-semibold">
                    Login to Your {role} Account.
                  </Text>
                </View>

                {/* Card */}
                <View className="px-5 pt-4 pb-6">
                  {/* Phone label */}
                  <Text className="text-xs text-slate-600 mb-1 font-inter-semibold">
                    Phone number
                  </Text>

                  {/* Phone input */}
                  <View className="flex-row items-center border border-slate-200 rounded-xl px-3 py-2 mb-1 bg-slate-50 font-inter-semibold">
                    <MaterialCommunityIcons
                      name="phone"
                      size={18}
                      color="#64748B"
                    />
                    <Text className="text-slate-700 font-medium mx-2 ">
                      +91
                    </Text>
                    <View className="h-5 w-px bg-slate-200 mr-2" />
                    <TextInput
                      value={mobileNo}
                      onChangeText={(t) => {
                        setMobileNo(t);
                        setOtpSent(false);
                      }}
                      keyboardType="phone-pad"
                      maxLength={10}
                      placeholder="9876543210"
                      placeholderTextColor="#9CA3AF"
                      className="flex-1 text-sm text-slate-900"
                    />
                  </View>

                  <Text className="text-[11px] text-slate-500 mb-4 font-inter-semibold">
                    We&apos;ll send an OTP to this number.
                  </Text>

                  {/* --- OTP FLOW --- */}
                  {loginMethod === "otp" && (
                    <>
                      {!otpSent ? (
                        <TouchableOpacity
                          onPress={handleSendOtp}
                          disabled={loading}
                          className={`rounded-xl py-3 items-center mb-4 bg-[#1FAD4E] ${
                            loading ? "opacity-60" : ""
                          }`}
                        >
                          {loading ? (
                            <View className="flex-row items-center">
                              <ActivityIndicator
                                color="#fff"
                                size="small"
                              />
                              <Text className="text-white font-inter-semibold text-sm ml-2 font-inter-semibold">
                                Sending OTP...
                              </Text>
                            </View>
                          ) : (
                            <Text className="text-white font-inter-semibold text-sm font-inter-semibold">
                              Send OTP via WhatsApp
                            </Text>
                          )}
                        </TouchableOpacity>
                      ) : (
                        <>
                          <View className="mb-3 font-inter-semibold">
                            <Text className="text-xs text-slate-600 mb-1">
                              Enter OTP <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                              className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-sm"
                              placeholder="Enter 6-digit OTP"
                              keyboardType="number-pad"
                              maxLength={6}
                              value={otp}
                              onChangeText={setOtp}
                            />
                            <TouchableOpacity
                              onPress={handleSendOtp}
                              disabled={loading}
                            >
                              <Text className="text-xs text-[#1FAD4E] mt-2">
                                Resend OTP
                              </Text>
                            </TouchableOpacity>
                          </View>

                          <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loading}
                            className={`rounded-2xl py-3 items-center mb-4 bg-[#1FAD4E] ${
                              loading ? "opacity-60" : ""
                            }`}
                          >
                            {loading ? (
                              <View className="flex-row items-center">
                                <ActivityIndicator
                                  color="#fff"
                                  size="small"
                                />
                                <Text className="text-white font-inter-semibold text-sm ml-2">
                                  Verifying...
                                </Text>
                              </View>
                            ) : (
                              <Text className="text-white font-inter-semibold text-sm">
                                Login
                              </Text>
                            )}
                          </TouchableOpacity>
                        </>
                      )}
                    </>
                  )}

                  {/* --- MPIN FLOW --- */}
                  {loginMethod === "mpin" && (
                    <>
                      <View className="mb-3">
                        <Text className="text-xs text-slate-600 mb-1 font-inter-semibold">
                          MPIN <Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                          className="border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-sm"
                          placeholder="Enter 4-digit MPIN"
                          keyboardType="number-pad"
                          maxLength={4}
                          secureTextEntry
                          value={mpin}
                          onChangeText={setMpin}
                        />
                      </View>

                      <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className={`rounded-2xl py-3 items-center mb-4 bg-[#1FAD4E] ${
                          loading ? "opacity-60" : ""
                        }`}
                      >
                        {loading ? (
                          <View className="flex-row items-center">
                            <ActivityIndicator
                              color="#fff"
                              size="small"
                            />
                            <Text className="text-white font-inter-semibold text-sm ml-2">
                              Logging in...
                            </Text>
                          </View>
                        ) : (
                          <Text className="text-white font-inter-semibold text-sm">
                            Login with MPIN
                          </Text>
                        )}
                      </TouchableOpacity>
                    </>
                  )}

                  {/* --- PASSWORD FLOW --- */}
                  {loginMethod === "password" && (
                    <>
                      <View className="mb-3">
                        <Text className="text-xs text-slate-600 mb-1 font-inter-semibold">
                          Password <Text className="text-red-500">*</Text>
                        </Text>
                        <View className="flex-row items-center border border-slate-200 rounded-xl bg-slate-50">
                          <TextInput
                            className="flex-1 px-3 py-2 text-sm"
                            placeholder="Enter your password"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                          />
                          <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            className="px-3 py-2"
                          >
                            {showPassword ? (
                              <EyeOff size={20} color="#6B7280" />
                            ) : (
                              <Eye size={20} color="#6B7280" />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className={`rounded-2xl py-3 items-center mb-4 bg-[#1FAD4E] ${
                          loading ? "opacity-60" : ""
                        }`}
                      >
                        {loading ? (
                          <View className="flex-row items-center">
                            <ActivityIndicator
                              color="#fff"
                              size="small"
                            />
                            <Text className="text-white font-inter-semibold text-sm ml-2">
                              Logging in...
                            </Text>
                          </View>
                        ) : (
                          <Text className="text-white font-inter-semibold text-sm">
                            Login
                          </Text>
                        )}
                      </TouchableOpacity>
                    </>
                  )}

                  {/* Error */}
                  {error ? (
                    <View className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
                      <Text className="text-xs text-red-700">{error}</Text>
                    </View>
                  ) : null}

                  {/* Divider */}
                  <View className="flex-row items-center mb-3">
                    <View className="flex-1 h-px bg-slate-200" />
                    <Text className="mx-3 text-xs text-grey-400 font-inter-semibold">or</Text>
                    <View className="flex-1 h-px bg-slate-200" />
                  </View>

                  {/* Login using password button */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    className="flex-row items-center justify-center bg-white rounded-2xl py-3 mb-3 border border-slate-200 font-inter-semibold"
                    onPress={() => selectMethod("password")}
                  >
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={18}
                      color="#1F2933"
                    />
                    <Text className="ml-2 text-sm font-inter-semibold text-slate-800">
                      Login using password
                    </Text>
                  </TouchableOpacity>

                  {/* Use MPIN button */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    className="flex-row items-center justify-center bg-white rounded-2xl py-3 border border-slate-200"
                    onPress={() => selectMethod("mpin")}
                  >
                    <MaterialCommunityIcons
                      name="dialpad"
                      size={18}
                      color="#1F2933"
                    />
                    <Text className="ml-2 text-sm font-inter-semibold text-slate-800">
                      Use MPIN
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Register & forgot links */}
                <View className="flex-row justify-center mt-2">
                  <Text className="text-xs text-slate-500">
                    Don&apos;t have an account?{" "}
                  </Text>
                  <TouchableOpacity onPress={goToRegister}>
                    <Text className="text-xs font-inter-semibold text-[#1FAD4E]">
                      Register here
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row justify-center items-center mt-1">
                  <TouchableOpacity>
                    <Text className="text-xs text-[#1FAD4E] font-inter-semibold">Forgot MPIN?</Text>
                  </TouchableOpacity>
                  <Text className="mx-2 text-slate-300">|</Text>
                  <TouchableOpacity>
                    <Text className="text-xs text-[#1FAD4E] font-inter-semibold">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
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
