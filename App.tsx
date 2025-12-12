import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  Modal,
} from "react-native";

import Geolocation from "@react-native-community/geolocation";
import { launchCamera } from "react-native-image-picker";
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";

export default function App() {
  const USER = "Khushbu";
  const PASS = "1246";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // Popup states
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showCameraPopup, setShowCameraPopup] = useState(false);

  //---------------------------------------
  // FUNCTION: Get Location
  //---------------------------------------
  const openLocation = async () => {
  const permissionType =
    Platform.OS === "android"
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

  const result = await request(permissionType);

  if (result === RESULTS.GRANTED) {
    Geolocation.getCurrentPosition(
      (pos) => {
        Alert.alert(
          "Location Found!",
          `Latitude: ${pos.coords.latitude}\nLongitude: ${pos.coords.longitude}`
        );
      },
      (err) => Alert.alert("Error", err.message),
      { enableHighAccuracy: true,
       timeout: 30000, 
       }
    );
  } else if (result === RESULTS.DENIED) {
    Alert.alert("Permission Denied", "You denied location permission.");
  } else if (result === RESULTS.BLOCKED) {
    Alert.alert(
      "Permission Blocked",
      "Location permission is blocked. Open settings to allow.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => openSettings() },
      ]
    );
  }
};







  //---------------------------------------
  // FUNCTION: Camera Permission + Open Camera
  //---------------------------------------
  const handleCamera = async () => {
    const permissionType =
      Platform.OS === "android"
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;

    const currentStatus = await check(permissionType);

    if (currentStatus === RESULTS.GRANTED) return openCamera();

    const req = await request(permissionType);

    if (req === RESULTS.GRANTED) {
      return openCamera();
    } else if (req === RESULTS.DENIED) {
      Alert.alert("Permission Denied", "You denied camera permission.");
    } else if (req === RESULTS.BLOCKED) {
      Alert.alert(
        "Permission Blocked",
        "Camera permission is blocked. Open settings to allow.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => openSettings() },
        ]
      );
    }
  };

  //---------------------------------------
  // FUNCTION: Launch Camera
  //---------------------------------------
  const openCamera = () => {
    launchCamera({ mediaType: "photo" }, (res) => {
      if (res.didCancel) {
        Alert.alert("Cancelled", "User closed camera");
      } else if (res.errorCode) {
        Alert.alert("Error", res.errorMessage);
      } else {
        Alert.alert("Success", "Photo clicked successfully!");
      }
    });
  };

  //---------------------------------------
  // LOGIN & LOGOUT
  //---------------------------------------
  const handleLogin = () => {
    if (username.toLowerCase() === USER.toLowerCase() && password === PASS) {
    setLoggedIn(true);
    }
    else {
    Alert.alert("Error", "Incorrect username or password");
  }

  }

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  //---------------------------------------
  // UI
  //---------------------------------------
  return (
    <SafeAreaView style={styles.container}>

      {/* LOCATION PERMISSION POPUP */}
      <Modal visible={showLocationPopup} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.popupBox}>
            <Text style={styles.popupTitle}>Allow Location Permission?</Text>
            <Text style={styles.popupMsg}>
              We need your location to proceed.
            </Text>

            <TouchableOpacity
              style={styles.allowBtn}
              onPress={() => {
                setShowLocationPopup(false);
                openLocation();
              }}
            >
              <Text style={styles.allowText}>Allow</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowLocationPopup(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CAMERA PERMISSION POPUP */}
      <Modal visible={showCameraPopup} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.popupBox}>
            <Text style={styles.popupTitle}>Allow Camera Permission?</Text>
            <Text style={styles.popupMsg}>
              We need camera access to take photos.
            </Text>

            <TouchableOpacity
              style={styles.allowBtn}
              onPress={() => {
                setShowCameraPopup(false);
                handleCamera();
              }}
            >
              <Text style={styles.allowText}>Allow</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowCameraPopup(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {!loggedIn ? (
        <View style={styles.box}>
          <Text style={styles.title}>Static Login</Text>

          <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.note}>Use Credentials → khushbu/ 1246</Text>
        </View>
      ) : (
        <View style={styles.box}>
          <Text style={styles.title}>Welcome!</Text>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowLocationPopup(true)}
          >
            <Text style={styles.actionTxt}>Get Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowCameraPopup(true)}
          >
            <Text style={styles.actionTxt}>Open Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { marginTop: 20, backgroundColor: "#1e8504ff" }]}
            onPress={handleLogout}
          >
            <Text style={{ color: "#fff", }}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },

  // Popup
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 10,
  },
  popupTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  popupMsg: { fontSize: 14, color: "#555", marginBottom: 20 },

  allowBtn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  allowText: { color: "#fff", fontSize: 16 },

  cancelBtn: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: { color: "#333", fontSize: 16 },

  // Other UI
  box: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 10,
    elevation: 3,
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
  note: { marginTop: 10, textAlign: "center", color: "#777" },
  actionBtn: {
    borderWidth: 1,
    borderColor: "#444",
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  actionTxt: { fontWeight: "600", fontSize: 16 },
});
