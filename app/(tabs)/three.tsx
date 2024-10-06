import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
import { child, get, getDatabase, ref, set } from "firebase/database";
import app from "@/firebase/firebaseConfig";
import useSolarDataStore from "@/store/useSolarDataStore";

const three = () => {
  const [chargedVoltage, setChargedVoltage] = useState("");
  const [lowBatteryVoltage, setLowBatteryVoltage] = useState("");
  const [cutOffPercent, setCutOffPercent] = useState("0");
  const [emailAdd, setEmailAdd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);

  const { setBatterySetting } = useSolarDataStore();

  const isFocused = useIsFocused();
  const db = getDatabase(app);

  const handleChargeVoltage = (text: string) => {
    const decimalPattern = /^\d*\.?\d{0,2}$/;

    if (text === "" || decimalPattern.test(text)) {
      setChargedVoltage(text);
    }
  };

  const handleLowBatVoltage = (text: string) => {
    const decimalPattern = /^\d*\.?\d{0,2}$/;

    if (text === "" || decimalPattern.test(text)) {
      setLowBatteryVoltage(text);
    }
  };

  const handleCutOffPercent = (text: string) => {
    const cutOffPattern =
      /^(?:0*\.?\d{1,2}|[1-9]*\.\d(\.\d{1,2})?|100(\.0{1,2})?)$/;

    if (text === "" || cutOffPattern.test(text)) {
      setCutOffPercent(text);
    }
  };

  const fetchSettings = async () => {
    try {
      const db = getDatabase(); // Assuming `app` is initialized globally or provided elsewhere
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, "solarSetting/"));

      if (snapshot.exists()) {
        const data = snapshot.val();

        setChargedVoltage(data.chargedVoltage);
        setLowBatteryVoltage(data.lowBatteryVoltage);
        setCutOffPercent(data.cutOffPercent);
        setBatterySetting(data);
        setEmailAdd(data.email);
        setErrorEmail(false);
      }
    } catch (error) {}
  };

  const handleSaveSettings = async () => {
    if (
      chargedVoltage === "" ||
      lowBatteryVoltage === "" ||
      cutOffPercent === ""
    ) {
      setErrors("Please fill all required  field!");
    } else if (parseFloat(chargedVoltage) < parseFloat(lowBatteryVoltage)) {
      setErrors(
        "Invalid Battery Setting. Charged voltage is less than low battery voltage."
      );
    } else if (
      parseFloat(cutOffPercent) != 0 &&
      parseFloat(cutOffPercent) < 20
    ) {
      setErrors("Invalid cut-off percent. Cut-off percent is less than 20%.");
    } else {
      const emailAddPattern =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (emailAddPattern.test(emailAdd)) {
        setIsSaving(true);
        setErrors("");
        setIsSuccess(false);

        let cutOffVoltage =
          (parseFloat(chargedVoltage) - parseFloat(lowBatteryVoltage)) *
            (parseFloat(cutOffPercent) / 100) +
          parseFloat(lowBatteryVoltage);

        await set(ref(db, "solarSetting/"), {
          chargedVoltage: chargedVoltage,
          lowBatteryVoltage: lowBatteryVoltage,
          cutOffPercent: cutOffPercent,
          cutOffVoltage: cutOffVoltage,
          email: emailAdd,
        }).finally(() => {
          setBatterySetting({
            chargedVoltage: chargedVoltage,
            lowBatteryVoltage: lowBatteryVoltage,
            cutOffPercent: cutOffPercent,
            email: emailAdd,
          });
          setIsSaving(false);
          setIsSuccess(true);
        });

        setErrorEmail(false);
      } else {
        setErrorEmail(true);
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
      fetchSettings().finally(() => {
        setIsLoading(false);
        setIsSuccess(false);
        setErrors("");
      });
    }
  }, [isFocused]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ScrollView style={{ minHeight: "100%", backgroundColor: "#dbdcdd" }}>
      <View style={{ flex: 1, padding: 24, gap: 12 }}>
        {/* <TouchableOpacity style={style.btn}>
          <FontAwesome name="bluetooth" size={24} color="blue" />
          <Text style={{ fontSize: 22 }}>Device Settings</Text>
        </TouchableOpacity> */}
        <View style={style.inputContainer}>
          {errors !== "" && <Text style={style.error}>{errors}</Text>}
          {isSuccess && (
            <Text style={style.success}>Setting successfully saved!</Text>
          )}
          <View style={style.inputGroup}>
            <Text style={style.label}>Fully Charge Battery Voltage</Text>
            <TextInput
              value={chargedVoltage}
              style={style.input}
              placeholder="ex. 13.7"
              keyboardType="decimal-pad"
              onChangeText={handleChargeVoltage}
            />
          </View>
          <View style={style.inputGroup}>
            <Text style={style.label}>Low Battery Voltage</Text>
            <TextInput
              value={lowBatteryVoltage}
              style={style.input}
              placeholder="ex. 13.7"
              keyboardType="decimal-pad"
              onChangeText={handleLowBatVoltage}
            />
          </View>
          <View style={style.inputGroup}>
            <Text style={style.label}>
              Cut-off Battery Percent (0 = disable)
            </Text>
            <TextInput
              value={cutOffPercent}
              style={style.input}
              placeholder="ex. 20"
              keyboardType="decimal-pad"
              onChangeText={handleCutOffPercent}
            />
          </View>

          <View style={style.inputGroup}>
            <Text style={style.label}>E-mail </Text>
            {errorEmail && (
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "red" }}>
                Invalid Email
              </Text>
            )}
            <TextInput
              value={emailAdd}
              style={style.input}
              placeholder="sample@gmail.com"
              keyboardType="email-address"
              onChangeText={setEmailAdd}
            />
          </View>

          <TouchableOpacity
            style={style.btnSave}
            disabled={isSaving}
            onPress={handleSaveSettings}
          >
            <Text style={{ fontSize: 22, color: "white", textAlign: "center" }}>
              {isSaving ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  btn: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    gap: 6,
  },
  btnSave: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    gap: 6,
    backgroundColor: "#5dc0f5",
    borderColor: "#3a98c9",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    fontSize: 18,
    borderColor: "#9ca3af",
  },
  inputGroup: { flex: 1, gap: 6 },
  inputContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 6,
    gap: 6,
  },
  error: {
    fontSize: 16,
    color: "red",
  },
  success: {
    fontSize: 16,
    color: "green",
    textAlign: "center",
  },
});

export default three;
