import { View } from "react-native";

const IconWrapper = ({ focused, Icon }: { focused: boolean; Icon: any }) => (
  <View className={`items-center justify-center w-10 h-10 rounded-xl ${focused ? 'bg-indigo-600' : 'bg-transparent'}`}>
    <Icon size={24} color={focused ? '#FFFFFF' : '#94a3b8'} strokeWidth={focused ? 2.5 : 2} />
  </View>
);

export default IconWrapper;