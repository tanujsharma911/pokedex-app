import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { pokemonTypeColors } from "../../utils/utils";

interface Pokemon {
  id: number;
  name: string;
  url: string;
  image?: string;
  types: string[];
  height?: number;
  weight?: number;
  base_experience?: number;
}

export default function Details() {
  const insets = useSafeAreaInsets();
  const { pokemonName } = useLocalSearchParams();
  const router = useRouter();

  const [data, setData] = useState<Pokemon | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
      ).then((res) => res.json());

      setData({
        id: response.id,
        name: response.name,
        url: `https://pokeapi.co/api/v2/pokemon/${response.id}`,
        image: response.sprites.other?.["official-artwork"]?.front_default,
        types: response.types.map(
          (item: { type: { name: string } }) => item.type.name,
        ),
        height: response.height,
        weight: response.weight,
        base_experience: response.base_experience,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="rounded-t-3xl"
    >
      <View className="absolute top-3 left-0 right-0 h-1 flex justify-center items-center">
        <View className="w-16 h-full bg-zinc-300" />
      </View>

      <View className="px-6">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-2xl font-bold capitalize">{data?.name}</Text>
          <Text className="text-xl font-medium text-zinc-500">
            #{data?.id.toString().padStart(3, "0")}
          </Text>
        </View>

        <View className="bg-zinc-200 rounded-3xl my-4 overflow-hidden">
          <Image
            source={{ uri: data?.image }}
            className="self-center w-full aspect-square"
          />
        </View>

        <View className="flex gap-2">
          <View className="flex flex-row gap-2 items-center justify-between border-b border-zinc-200 pb-2">
            <Text className="font-medium text-lg">Type</Text>
            <View className="flex flex-row gap-2">
              {data?.types.map((type) => (
                <Text
                  key={type}
                  className={`text-sm font-medium px-2 py-1 rounded-xl capitalize`}
                  style={{
                    backgroundColor: `${pokemonTypeColors[type]}33`,
                  }}
                >
                  {type}
                </Text>
              ))}
            </View>
          </View>
          <View className="flex flex-row gap-2 items-center justify-between border-b border-zinc-200 pb-2">
            <Text className="font-medium text-lg">Height</Text>
            <Text>{data?.height}</Text>
          </View>

          <View className="flex flex-row gap-2 items-center justify-between border-b border-zinc-200 pb-2">
            <Text className="font-medium text-lg">Weight</Text>
            <Text>{data?.weight}</Text>
          </View>

          <View className="flex flex-row gap-2 items-center justify-between">
            <Text className="font-medium text-lg">Base Experience</Text>
            <Text>{data?.base_experience}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
