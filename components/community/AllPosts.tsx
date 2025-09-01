import { icons } from "@/constants/icons";
import { Post } from "@/types/community";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <View className="bg-[#1C1C1C] rounded-3xl  mb-4 overflow-hidden">
      <View className="flex-row items-center p-4 pb-3">
        <View className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <Image
            source={icons.user}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1">
          <View className="flex-col">
            <View className="flex-row items-center">
              <Text className="text-white font-semibold text-[15px] mr-1">
                {post.author.name}
              </Text>
              {post.author.verified && (
                <View className="w-4 h-4 bg-[#0368FF] rounded-full items-center justify-center mr-2">
                  <Feather name="check" size={8} color="white" />
                </View>
              )}
            </View>
            <Text className="text-gray-400 text-[13px]">
              {post.author.username}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <View className="flex-row items-center text-gray-400 text-[13px] mr-3">
            <View className="bg-[#FFFFFF0F]/[6%] p-2 rounded-full">
              <Text className="text-gray-400 font-semibold text-[13px]">
                TBD Podcast
              </Text>
            </View>
            <Text className="text-gray-400 text-[16px]"> {post.timestamp}</Text>
          </View>
          <TouchableOpacity>
            <Feather name="more-vertical" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-4 pb-3">
        <Text className="text-white text-[15px] leading-5">{post.content}</Text>
        <Text className="text-gray-400 text-[13px] pt-2">
          {post.likes} likes
        </Text>
      </View>

      {/* Post Image (if exists) */}
      {post.type === "image" && post.image && (
        <View className="mx-4 mb-3 rounded-3xl overflow-hidden">
          <Image
            source={{ uri: post.image }}
            style={{
              // width: width - 80,
              height: 300,
            }}
            resizeMode="cover"
            className="rounded-xl"
          />
          <View className="absolute bottom-4 left-4 right-4">
            <TouchableOpacity className="bg-black/60 w-full rounded-full px-4 py-4 flex-row items-center">
              <Feather name="globe" size={14} color="white" />

              <Text className="text-white text-[13px] font-medium ml-2">
                Visit website
              </Text>

              <Feather
                name="chevron-right"
                size={14}
                color="white"
                className="ml-auto"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Post Actions */}
      <View className="flex-row items-center justify-between px-4 py-3 ">
        <View className="flex-row gap-2">
          <TouchableOpacity className="flex-row items-center bg-[#36363666] rounded-full p-3">
            <View className="w-6 h-6 rounded-full items-center justify-center mr-1">
              <Feather name="message-circle" size={20} color="#9CA3AF" />
            </View>
            <Text className="text-gray-400 text-[13px]">{post.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center bg-[#36363666]/[40%] rounded-full p-2">
            <View className="w-7 h-7 rounded-full items-center justify-center mr-2 ">
              <Image source={icons.record} className="h-full w-full" />
            </View>
            <Text className="text-gray-400 text-[13px]">Record a comment</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-2">
          <TouchableOpacity className="bg-[#36363666]/[40%] p-3 rounded-full">
            <Feather name="send" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#36363666]/[40%] p-3 rounded-full">
            <Feather name="bookmark" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

interface AllPostsProps {
  posts?: Post[];
}

const AllPosts: React.FC<AllPostsProps> = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <View className="px-6 pb-20 items-center">
        <View className="rounded-xl p-4 mb-4">
          <View className="h-16 w-16 bg-gray-700 rounded-xl items-center justify-center">
            <Feather name="grid" size={32} color="#9CA3AF" />
          </View>
        </View>

        <Text className="text-white text-[18px] font-semibold mb-2">
          No posts has been uploaded yet
        </Text>
        <Text className="text-gray-400 text-[14px] text-center mb-6">
          Tap on the button below to{"\n"}add the first post
        </Text>

        <TouchableOpacity
          onPress={() => console.log("Make posts pressed")}
          className="bg-[#0368FF] rounded-full py-4 px-8"
          activeOpacity={0.8}
        >
          <Text className="text-white text-[16px] font-semibold">
            Make posts
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostCard post={item} />}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={{
        paddingBottom: 20,
        paddingTop: 10,
      }}
      ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
    />
  );
};

export default AllPosts;
