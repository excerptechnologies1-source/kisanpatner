import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { JSX } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import renderCategoryItem from "../traderscreen/renderCategoryItem";
import renderSliderItem from "../traderscreen/renderSliderItem";
import KisanHeader from "../traderscreen/kisanHeader";

const Home = () => {
  const router=useRouter()

  type ActionItem = {
  title: string;
  icon: JSX.Element;
  link: string; // MUST be string (not optional)
};


  const postRequired:ActionItem[] = [
    {
      link: "/Postrequirementform",
      title: "Post Requirement",
      icon: <FontAwesome6 name="file-lines" size={26} color="#4CAF50" />,
    },
    {
      link: "/CropList",
      title: "All Crops",
      icon: <Entypo name="crop" size={26} color="#4CAF50" />,
    },
    {
      link: "/",
      title: "My Order",
      icon: <MaterialCommunityIcons name="truck-delivery" size={26} color="#4CAF50" />,
    },
  ];

  const slider = [
    {
      id: "1",
      img: "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
      title: "Fresh Tomatoes Arrived",
      des: "Premium Quality Tomatoes available now.",
    },
    {
      id: "2",
      img: "https://thumbs.dreamstime.com/b/vegetables-group-white-background-vector-illustration-48246562.jpg",
      title: "Fresh Vegetables Arrived",
      des: "Premium Quality vegetables available now.",
    },
    {
      id: "3",
      img: "https://happyharvestfarms.com/blog/wp-content/uploads/2024/01/Vegetables-3.jpg",
      title: "Fresh Vegetables Arrived",
      des: "Premium Quality vegetables available now.",
    },
  ];

  const Category=[
    {
      id: "1",
      img: "https://cdn.firstcry.com/education/2022/11/08143105/Green-Vegetables-Names-in-English-for-Kids.jpg",
      title: "Tomatoes",
    },
    {
      id: "2",
      img: "https://images.squarespace-cdn.com/content/v1/578753d7d482e9c3a909de40/1475214227717-ZZC578EFLPPMNHNRTKQH/444B0502.jpg?format=2500w",
      title: "Tomatoes",
    },
    {
      id: "3",
      img: "https://hips.hearstapps.com/hmg-prod/images/fresh-vegetables-in-basket-on-wooden-background-royalty-free-image-1676394780.jpg?crop=1xw:0.84415xh;0,0.108xh",
      title: "Tomatoes",
    },
    {
      id: "4",
      img: "https://cdn.britannica.com/63/186963-138-AEE87658/vegetables.jpg?w=800&h=450&c=crop",
      title: "Tomatoes",
    },
    {
      id: "5",
      img: "https://5.imimg.com/data5/ANDROID/Default/2024/11/469480228/YS/EE/TL/63667197/product-jpeg-500x500.jpg",
      title: "Tomatoes",
    },
    {
      id: "6",
      img: "https://media.post.rvohealth.io/wp-content/uploads/sites/3/2025/05/healthful-vegetables-GettyImages-1251268295-Facebook.jpg",
      title: "Tomatoes",
    },
    {
      id: "7",
      img: "https://agricultureguruji.com/wp-content/uploads/2021/05/best-vegetable-grow-in-greenhouse-scaled.jpeg",
      title: "Tomatoes",
    },
    {
      id: "8",
      img: "https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb.jpg",
      title: "Tomatoes",
    },
  ]

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-white">
      <KisanHeader />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
    
        {/* POST REQUIRED SECTION */}
        <View className="px-6 mt-2">
          <Text className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            {postRequired.map((item, i) => (
              <TouchableOpacity
                key={i}
                className="bg-white w-28 h-28 rounded-lg mb-4 border border-gray-100 justify-center items-center shadow-sm"
                activeOpacity={0.8}
                onPress={() => router.push(item.link as any)}
              >
                <View className="mb-3 p-3 rounded-full bg-green-50">
                  {item.icon}
                </View>
                <Text className="text-center text-sm font-semibold text-gray-600">
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SLIDER SECTION */}
        <View className="mt-6">
          <View className="px-6 mb-3">
            <Text className="text-lg font-semibold text-gray-700">Featured Products</Text>
          </View>
          
          <FlatList
            data={slider}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={renderSliderItem}
            snapToInterval={272} // w-64 (256) + mr-4 (16) = 272
            decelerationRate="fast"
          />
        </View>

        {/* Add more sections as needed */}
        <View className="px-6 mt-8">
          <Text className="text-lg font-semibold text-gray-700 mb-4">
           Explore Category
          </Text>
          {/* Add your recently viewed items here */}
        </View>
       <FlatList
  data={Category}
  numColumns={2}
  keyExtractor={(item) => item.id}
  renderItem={renderCategoryItem}
  scrollEnabled={false}  // because ScrollView already scrolls
  columnWrapperStyle={{ justifyContent: "space-between" }}
  contentContainerStyle={{ paddingHorizontal: 16 }}
/>


     <View style={{marginBottom:100}} className="flex-row p-3 justify-center items-center">
       <TouchableOpacity onPress={()=>router.push("/")} className="bg-green-500 p-2 px-5 border border-green-600 rounded-lg shadow-xl">
         <Text className="text-white">View all</Text>
       </TouchableOpacity>
      </View>
      </ScrollView>

    </SafeAreaView>
  );
};

export default Home;

