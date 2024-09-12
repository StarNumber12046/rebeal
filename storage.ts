import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getAuthToken() {
    return await AsyncStorage.getItem("authToken");
}

export async function getRefreshToken() {
    return await AsyncStorage.getItem("refreshToken");
}