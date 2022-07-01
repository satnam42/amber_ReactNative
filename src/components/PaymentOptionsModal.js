import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Modal, Radio } from "@ui-kitten/components";
import Ionicons from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";
import { colors } from "../constants";
import { useNavigation } from "@react-navigation/core";

const { width, height } = Dimensions.get("screen");

const PAYMENT_METHODS = {
  CreditCard: 'CreditCard',
  StripeCard: 'StripeCard',
}


const PaymentOptionsModal = ({ visible, setVisible, }) => {
  const [paymentMethod, setPaymentMethod] = React.useState(PAYMENT_METHODS.StripeCard);


  const navigation = useNavigation()



  const handleClose = () => {
    setVisible(false);
  };








  const handleRedirectToCheckout = () => {


    if (paymentMethod === PAYMENT_METHODS.CreditCard) {
      navigation.navigate("CreditCardScreen", {
        paymentMethod
      });
    }
    if (paymentMethod === PAYMENT_METHODS.StripeCard) {
      navigation.navigate("CreditCardScreen", {
        paymentMethod
      });
    }
    setVisible(false);

  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
        style={{
          width: width,
          height: height,
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: colors.blurDark,
            padding: 10,
            paddingBottom: 40,
            marginBottom: 45,
            width: "100%",
          }}
        >
          {/* row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              blurRadius: 90,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
                letterSpacing: 0.8,
              }}
            >
              Payment method
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name={"md-close"} size={30} color={"#fff"} />
            </TouchableOpacity>
          </View>
          {/* Credit Card */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "80%",
              marginVertical: 10,
            }}
          >
            {/* raido */}
            <Radio
              checked={paymentMethod === PAYMENT_METHODS.CreditCard}
              onChange={(nextChecked) => setPaymentMethod(PAYMENT_METHODS.CreditCard)}
              style={{ marginHorizontal: 10 }}
            ></Radio>
            {/* ICON */}
            <Octicons name="credit-card" size={45} color="#fff" />
            <Text
              style={{
                fontSize: 16,
                marginHorizontal: 10,
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Credit card
            </Text>
          </View>

          {/* Strip*/}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "80%",
              marginVertical: 10,
            }}
          >
            {/* raido */}
            <Radio
              checked={paymentMethod === PAYMENT_METHODS.StripeCard}
              onChange={(nextChecked) => setPaymentMethod(PAYMENT_METHODS.StripeCard)}
              style={{ marginHorizontal: 10 }}
            ></Radio>
            {/* ICON */}
            <Octicons name="credit-card" size={45} color="#fff" />
            <Text
              style={{
                fontSize: 17,
                marginHorizontal: 10,
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Stripe Card
            </Text>
          </View>
          {/* BTN */}
          <View
            style={{ width: "100%", alignItems: "center", marginVertical: 10 }}
          >
            <TouchableOpacity onPress={handleRedirectToCheckout}>
              <Text
                style={{
                  backgroundColor: "#548fd1",
                  color: "#fff",
                  fontSize: 20,
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                  borderRadius: 30,
                  textAlign: "center",
                }}
              >
                Go to checkout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PaymentOptionsModal;
const styles = StyleSheet.create({
  container: {
    // minHeight: 192,
  },
  backdrop: {
    backgroundColor: "transparent",
  },
});
