import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const renderCategoryItem = ({ item }: any) => {
  return (
   <TouchableOpacity
       activeOpacity={0.8}
       className="w-1/2 p-2"
       onPress={() => console.log("Category:", item.title)}
     >
       <View className="rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100">
         <Image
           source={{ uri: item.img }}
           className="w-full h-28"
           resizeMode="cover"
         />
   
         <View className="p-3">
           <Text className="font-medium text-gray-700">{item.title}</Text>
         </View>
       </View>
     </TouchableOpacity>
  )
}

export default renderCategoryItem