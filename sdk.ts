import getHeaders from "happy-headers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { ProfileContext, ProfileContextType } from "./app/_layout";

// Generated by https://quicktype.io

export interface FullUser {
    biography:       string;
    birthdate:       Date;
    canDeletePost:   boolean;
    canPost:         boolean;
    canUpdateRegion: boolean;
    countryCode:     string;
    createdAt:       Date;
    customRealmoji:  string;
    devices:         Device[];
    fullname:        string;
    id:              string;
    isRealPeople:    boolean;
    lastBtsPostAt:   Date;
    links:           any[];
    location:        string;
    phoneNumber:     string;
    profilePicture:  ProfilePicture;
    realmojis:       any[];
    region:          string;
    streakLength:    number;
    type:            string;
    userFreshness:   string;
    username:        string;
}

export interface Device {
    clientVersion: string;
    device:        string;
    deviceId:      string;
    language:      string;
    platform:      string;
    timezone:      string;
}

export interface ProfilePicture {
    height: number;
    url:    string;
    width:  number;
}

// Generated by https://quicktype.io

export interface FriendsPosts {
    userPosts:         UserPosts;
    friendsPosts:      FriendsPost[];
    remainingPosts:    number;
    maxPostsPerMoment: number;
    eventProtoBytes:   any[];
}

export interface FriendsPost {
    user:                  User;
    momentId:              MomentID;
    region:                Region;
    posts:                 FriendsPostPost[];
    moment:                Moment;
    contentMappingEnabled: boolean;
}

export interface Moment {
    id:     MomentID;
    region: Region;
}

export enum MomentID {
    RAPtQYW5Yk8ZhfMJhuN4W = "RAPtQYW5Yk8ZhfMJhuN4W",
}

export enum Region {
    EuropeWest = "europe-west",
}

export interface FriendsPostPost {
    id:                  string;
    primary:             ProfilePicture;
    secondary:           ProfilePicture;
    realMojis:           RealMoji[];
    comments:            Comment[];
    tags:                any[];
    retakeCounter:       number;
    lateInSeconds:       number;
    isLate:              boolean;
    isMain:              boolean;
    visibility:          Visibility[];
    postedAt:            Date;
    takenAt:             Date;
    creationDate:        Date;
    updatedAt:           Date;
    postType:            PostType;
    location?:           Location;
    caption?:            string;
    origin?:             string;
    btsMedia?:           ProfilePicture;
    parentPostId?:       string;
    parentPostUserId?:   string;
    parentPostUsername?: string;
}

export interface ProfilePicture {
    url:        string;
    width:      number;
    height:     number;
    mediaType?: MediaType;
}

export enum MediaType {
    Image = "image",
    Video = "video",
}

export interface Comment {
    id:       string;
    user:     User;
    content:  string;
    postedAt: Date;
}

export interface User {
    id:             string;
    username:       string;
    profilePicture: ProfilePicture;
    type:           UserType;
    countryCode?:   CountryCode;
}

export enum CountryCode {
    It = "IT",
}

export enum UserType {
    User = "USER",
}

export interface Location {
    latitude:  number;
    longitude: number;
}

export enum PostType {
    Bts = "bts",
    Default = "default",
}

export interface RealMoji {
    id:        string;
    user:      User;
    media:     ProfilePicture;
    emoji:     Emoji;
    type:      RealMojiType;
    isInstant: boolean;
    postedAt:  Date;
}

export enum Emoji {
    Emoji = "\ud83d\udc4d",
    Empty = "\ud83d\ude0d",
    Fluffy = "\ud83d\ude32",
    Purple = "⚡",
    Tentacled = "\ud83d\ude03",
}

export enum RealMojiType {
    Happy = "happy",
    HeartEyes = "heartEyes",
    Instant = "instant",
    Surprised = "surprised",
    Up = "up",
}

export enum Visibility {
    Friends = "friends",
    FriendsOfFriends = "friends-of-friends",
}

export interface UserPosts {
    user:                  User;
    momentId:              MomentID;
    region:                Region;
    posts:                 UserPost[];
    contentMappingEnabled: boolean;
}

export interface UserPost {
    id:            string;
    primary:       ProfilePicture;
    secondary:     ProfilePicture;
    realMojis:     any[];
    comments:      any[];
    tags:          any[];
    retakeCounter: number;
    lateInSeconds: number;
    isLate:        boolean;
    isMain:        boolean;
    visibility:    Visibility[];
    postedAt:      Date;
    takenAt:       Date;
    creationDate:  Date;
    updatedAt:     Date;
    unblurCount:   number;
    postType:      PostType;
}

// Generated by https://quicktype.io

export interface Memories {
    data:                 Memory[];
    next:                 null;
    memoriesSynchronized: boolean;
}

export interface Memory {
    id:        string;
    thumbnail: Image;
    primary:   Image;
    secondary: Image;
    isLate:    boolean;
    memoryDay: string;
    location:  Location | null;
}

export interface Location {
    longitude: number;
    latitude:  number;
}

export interface Image {
    url:    string;
    width:  number;
    height: number;
}

// Generated by https://quicktype.io

export interface PinnedMemories {
    pinnedMemories: PinnedMemory[];
}

export interface PinnedMemory {
    id:        string;
    primary:   Image;
    secondary: Image;
    takenAt:   Date;
    memoryDay: string;
    isLate:    boolean;
    isMain:    boolean;
    momentId:  string;
    postType:  string;
}

// Generated by https://quicktype.io

export interface Friends {
    data:  Friend[];
    next:  null;
    total: number;
}

export interface Friend {
    id:              string;
    username:        string;
    fullname:        string;
    profilePicture?: ProfilePicture;
    status:          Status;
}

export interface ProfilePicture {
    url:    string;
    height: number;
    width:  number;
}

export enum Status {
    Accepted = "accepted",
}

// Generated by https://quicktype.io

export interface Profile {
    id:             string;
    username:       string;
    fullname:       string;
    profilePicture: ProfilePicture;
    relationship:   Relationship;
    createdAt:      Date;
    isRealPeople:   boolean;
    userFreshness:  string;
    streakLength:   number;
    type:           string;
    location?:      string;
    biography?:     string;
    links:          any[];
}

export interface Relationship {
    status:        string;
    commonFriends: CommonFriends;
    friendedAt:    string;
}

export interface CommonFriends {
    sample: Sample[];
    total:  number;
}

export interface Sample {
    id:             string;
    username:       string;
    fullname:       string;
    profilePicture: ProfilePicture;
}


export async function getMyProfile(userContext: ProfileContextType) {
    if (userContext && userContext.user) {
        console.log("User already fetched");
        return userContext.user;
    }
    const authToken = await AsyncStorage.getItem("authToken");
    console.log(authToken);
    const userResponse = await fetch("https://mobile.bereal.com/api/person/me", {
        headers: {
            ...getHeaders(),
            Authorization: `Bearer ${authToken}`,
        }
        });
        const user: FullUser = await userResponse.json();
        console.log(JSON.stringify(user));
        return user;
}

export async function getUserProfile(id: string) {
    const authToken = await AsyncStorage.getItem("authToken");
    const userResponse = await fetch("https://mobile.bereal.com/api/person/profiles/" + id, {
        headers: {
            ...getHeaders(),
            Authorization: `Bearer ${authToken}`,
        }
        });
        const user: Profile = await userResponse.json();
        console.log(JSON.stringify(user));
        return user;
}

export async function getMyPosts() {
    const authToken = await AsyncStorage.getItem("authToken");

    const postsResponse = await fetch("https://mobile.bereal.com/api/feeds/friends-v1", {
        headers: {
            ...getHeaders(),
            Authorization: `Bearer ${authToken}`,
        }
    });
    const allPosts: FriendsPosts = await postsResponse.json();
    return allPosts.userPosts.posts;

}

export async function getFriendsPosts() {
    const authToken = await AsyncStorage.getItem("authToken");
    const friends = await fetch("https://mobile.bereal.com/api/feeds/friends-v1", {
        headers: {
            ...getHeaders(),
            Authorization: `Bearer ${authToken}`,
        }
    });
    const friendsFeed: FriendsPosts = await friends.json();
    const flattenedPosts = friendsFeed.friendsPosts.flatMap((post) =>
        post.posts.map((p) => ({
            ...p,
            user: post.user,
        }))
    );
    
    return flattenedPosts.toReversed();
}

export async function getPins(userId: string) {
    const authToken = await AsyncStorage.getItem("authToken");

    const pinsResponse = await fetch("https://mobile.bereal.com/api/feeds/memories-v1/pinned-memories/for-user/" + userId, {
        headers: {
            ...getHeaders(),
            Authorization: `Bearer ${authToken}`,
        }
    });
    const pins = await pinsResponse.json();
    return pins;
}

export async function getMyPins(userContext: ProfileContextType) {
    const authToken = await AsyncStorage.getItem("authToken");

    const profile = await getMyProfile(userContext);
    const pinsResponse = await fetch("https://mobile.bereal.com/api/feeds/memories-v1/pinned-memories/for-user/" + profile.id, {
        headers: {
            ...getHeaders(),
            Authorization: `Bearer ${authToken}`,
        }
    });
    const pins = await pinsResponse.json();
    return pins;
}
export async function getMemories() {
    try {
      const authToken = await AsyncStorage.getItem("authToken");
  
      const response = await fetch("https://mobile.bereal.com/api/feeds/memories", {
        headers: {
          ...getHeaders(),
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const statsFeed: Memories = await response.json();
      console.log(statsFeed); // Do not use `JSON.stringify` unless necessary
      return statsFeed;
    } catch (error) {
      console.error("Error fetching memories:", error);
      throw error; // Re-throw the error to be handled elsewhere if needed
    }
  }

export async function getFriends(userContext: ProfileContextType) {
    if (userContext && userContext.friends) {
        console.log("Friends already fetched");
        return userContext.friends;
    }
    const authToken = await AsyncStorage.getItem("authToken");
    const friendsResponse = await fetch("https://mobile.bereal.com/api/relationships/friends", {
        headers: {
            ...getHeaders(),
            Authorization: `Bearer ${authToken}`,
        },
    });
    const friends: Friends = await friendsResponse.json();
    userContext.setFriends(friends);
    return friends;
    
}
  
export async function getSuggestedFriends(userContext: ProfileContextType) {
    if (userContext && userContext.suggestedFriends) {
        console.log("Suggested friends already fetched");
        return userContext.suggestedFriends;
    }
    const authToken = await AsyncStorage.getItem("authToken");
    const friends = await getFriends(userContext);
    const friendsResponse = await fetch("https://mobile.bereal.com/api/relationships/suggestions", {
        headers: {
            ...getHeaders(),
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            data: {
                friends: [
                    ...friends.data.map((friend) => friend.id),
                ],
                toExclude: []
            }
        }), method: "POST"
    });
    const friendSuggestions = await friendsResponse.json();
    console.warn(JSON.stringify(friendSuggestions));
    userContext.setSuggestedFriends(friendSuggestions);
    return friendSuggestions;
}

export async function generateUploadUrl() {
    const authToken = await AsyncStorage.getItem("authToken");

    const response = await fetch("https://mobile.bereal.com/api/content/posts/upload-url?mimeType=image/webp", {
        headers: {
            ...getHeaders(),
            Authorization: `Bearer ${authToken}`,
            "content-type": "application/json",
            'bereal-app-version-code': '14549',
            "bereal-os-version": "14.7.1",
            "accept-language": "en-US;q=1.0",
            "bereal-app-language": "en-US",
            "user-agent": "BeReal/0.28.2 (AlexisBarreyat.BeReal; build:8425; iOS 14.7.1) 1.0.0/BRApiKit",
            "bereal-device-language": "en",
        },
        method: "GET",
    });
    const t = await response.text();
    console.log(t)
    const uploadUrl = JSON.parse(t);
    console.log(uploadUrl);
    return uploadUrl.data;
}

export async function finalizeUpload(data: any) {
    const authToken = await AsyncStorage.getItem("authToken");
    
    const response = await fetch("https://mobile.bereal.com/api/content/posts", {
        headers: {
            ...getHeaders(),
            Authorization: `Bearer ${authToken}`,
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
    });
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Error uploading image");
    }
}