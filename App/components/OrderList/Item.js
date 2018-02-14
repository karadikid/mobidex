import React, { Component } from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";

export default class OrderItem extends Component {
  render() {
    let { orderType, price, priceToken, amount, amountToken } = this.props;
    let priceSymbol = priceToken.symbol;
    let amountSymbol = amountToken.symbol;

    return (
      <View style={[{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center", }]}>
        {orderType === "bid" ? 
            (<Text>Bid </Text>)
          : (<Text>Ask </Text>)}
        <Text>{amount.toString()} {amountSymbol}</Text>
        <Text> for </Text>
        <Text>{price.toString()} {priceSymbol}</Text>
      </View>
    );
  }
}