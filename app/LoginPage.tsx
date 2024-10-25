import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import app from "../firebase/firebaseConfig";
import { child, get, getDatabase, ref } from "firebase/database";
import useSolarDataStore from "@/store/useSolarDataStore";

const LoginPage = () => {
  const [inputPassword, setInputPassword] = useState("");
  const [errors, setErrors] = useState("");

  const { setLogin, setPassword, password } = useSolarDataStore();

  const handleLogin = async () => {
    //get password from database
    const db = getDatabase(app);

    const snapshot = await get(child(ref(db), "solarSetting/password"));

    if (snapshot.exists()) {
      console.log(snapshot.val(), inputPassword === snapshot.val());
      setPassword(snapshot.val());
      //check if textinput === password
      if (inputPassword === snapshot.val()) {
        // hide login and show main dashboard
        setErrors("");
        setLogin(true);
      } else {
        setErrors("Wrong Password!");

        console.log(inputPassword, password, errors);
      }
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#009FBD",
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: "center",
        gap: 10,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "#f2f3f5",
        }}
      >
        Welcome Back, Please Login!
      </Text>
      <View
        style={{
          backgroundColor: "white",
          borderColor: "#afb3b0",
          borderWidth: 2,
          borderRadius: 10,
          padding: 10,
          gap: 10,
        }}
      >
        <Text style={{ fontWeight: "semibold", fontSize: 18 }}>Password</Text>
        <TextInput
          style={{
            borderWidth: 1,
            fontWeight: "semibold",
            fontSize: 18,
            borderColor: "#afb3b0",
            borderRadius: 4,
            padding: 8,
          }}
          secureTextEntry={true}
          onChangeText={setInputPassword}
        />

        {errors === "" ? null : (
          <Text style={{ color: "red" }}>Wrong password!</Text>
        )}

        <TouchableOpacity
          style={{
            backgroundColor: "#244fab",
            padding: 8,
            borderRadius: 4,
            alignItems: "center",
          }}
          onPress={handleLogin}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginPage;
