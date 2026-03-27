import { User } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

const ProfileHeaderButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} className="mr-5">
    <View className="w-9 h-9 rounded-full bg-slate-200 items-center justify-center overflow-hidden border border-slate-300">
      <User size={20} color="#64748b" />
    </View>
  </TouchableOpacity>
);

export default ProfileHeaderButton;