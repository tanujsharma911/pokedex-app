import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { pokemonTypeColors } from "../../utils/utils";

interface Pokemon {
  id: number;
  name: string;
  url: string;
  image?: string;
  types: string[];
}

interface PokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [data, setData] = useState<PokemonResponse | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=20",
      ).then((res) => res.json());

      const pokemons = response.results.map(async ({ name, url }: Pokemon) => {
        const data = await fetch(url).then((res) => res.json());

        return {
          id: data.id,
          name,
          url,
          image: data.sprites.other?.["official-artwork"]?.front_default,
          types: data.types.map(
            (item: { type: { name: string } }) => item.type.name,
          ),
        };
      });

      const resolvedPokemons = await Promise.all(pokemons);

      setData({
        ...response,
        results: resolvedPokemons,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="flex-1 bg-white"
    >
      <FlatList
        data={data?.results ?? []}
        numColumns={2}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 24,
        }}
        columnWrapperStyle={{
          gap: 8,
        }}
        ListHeaderComponent={
          <View className="mb-6">
            <Text className="text-4xl font-bold mt-10">Pokédex</Text>

            <Text className="text-lg font-medium mt-2 text-zinc-500">
              Search for a Pokémon by name or using its National Pokédex number.
            </Text>

            <View className="bg-zinc-100 rounded-xl flex-row items-center mt-4 px-4 py-1 gap-2">
              <Feather name="search" size={20} color="gray" />

              <TextInput
                placeholder="Name or number"
                className="flex-1 font-medium"
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={{
              backgroundColor: `${pokemonTypeColors[item.types[0]]}33`,
              borderRadius: 12,
            }}
            className="flex-1 px-2 py-2 mb-2 rounded-xl active:scale-98 active:opacity-90 transition-all duration-50"
            onPress={() =>
              router.push({
                pathname: "/details",
                params: {
                  pokemonName: item.name.toString(),
                },
              })
            }
          >
            <Text
              className="font-medium text-sm mb-2"
              style={{
                fontFamily: "monospace",
                color: `${pokemonTypeColors[item.types[0]]}`,
                fontWeight: "medium",
              }}
            >
              #{Number(item.id).toString().padStart(3, "0")}
            </Text>

            <Image
              source={{ uri: item.image }}
              className="w-full h-32"
              resizeMode="contain"
            />

            <Text className="font-bold text-lg text-center capitalize mb-2">
              {item.name}
            </Text>

            {/* <View className="flex-row justify-center gap-2 mt-2">
              {item.types.map((type) => {
                return (
                  <Text key={type} className={`font-light text-sm`}>
                    {type}
                  </Text>
                );
              })}
            </View> */}
          </Pressable>
        )}
      />
    </View>
  );
}
