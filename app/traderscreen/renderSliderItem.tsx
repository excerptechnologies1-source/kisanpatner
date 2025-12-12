import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity } from "react-native";

// Render slider item separately for cleaner code
  
  const renderSliderItem = ({ item }:{item:{id:string,img:string,title:string,des:string}}) => {
    const router=useRouter()
    return (
        <TouchableOpacity
      activeOpacity={0.9}
      className="w-64 mr-4 rounded-md overflow-hidden bg-white shadow-lg"
      onPress={() => console.log("Slider item pressed:", item.id)}
    >
      <Image
        source={{ uri: item.img }}
        className="w-full h-40"
        resizeMode="cover"
      />
      
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        className="absolute bottom-0 left-0 right-0 h-2/3 justify-end p-4"
      >
        <Text className="text-white font-bold text-lg mb-1">{item.title}</Text>
        <Text className="text-white text-sm opacity-90">{item.des}</Text>
        <TouchableOpacity onPress={()=>router.push("/")} className="w-[95%] bg-green-400 mt-3 flex rounded  justify-center items-center p-2">
           <Text className="text-white text-sm">View Details</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
    )
  }
  
  export default renderSliderItem