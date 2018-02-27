import * as _ from "lodash";
import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { loadOrders } from "../../thunks";
import OrderList from "../components/OrderList";
import TradingInfo from "../components/TradingInfo";
import TokenFilterBar from "../components/TokenFilterBar";

class TradingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quoteToken: _.find(props.tokens, { address: props.products[0].tokenB.address }),
      baseToken: _.find(props.tokens, { address: props.products[0].tokenA.address })
    };
  }

  componentDidMount() {
    this.props.dispatch(loadOrders());
  }

  filteredOrders() {
    return this.props.orders.filter(order => order.makerTokenAddress === this.state.quoteToken.address || order.takerTokenAddress === this.state.quoteToken.address)
  }

  quoteTokens() {
    return _.uniqBy(this.props.products.map(p => p.tokenB).map(t => _.find(this.props.tokens, { address: t.address })), "address");
  }

  baseTokens() {
    return _.uniqBy(this.props.products.map(p => p.tokenA).map(t => _.find(this.props.tokens, { address: t.address })), "address");
  }

  render() {
    let { quoteToken, baseToken } = this.state;
    let quoteTokens = this.quoteTokens();
    let baseTokens = this.baseTokens();
    let orders = this.filteredOrders();

    return (
      <View>
        <TokenFilterBar
            quoteTokens={quoteTokens}
            baseTokens={baseTokens}
            selectedQuoteToken={quoteToken}
            selectedBaseToken={baseToken}
            onQuoteTokenSelect={quoteToken => this.setState({ quoteToken })}
            onBaseTokenSelect={baseToken => this.setState({ baseToken })} />
        <TradingInfo quoteToken={quoteToken} orders={orders} />
        <OrderList
            quoteToken={quoteToken}
            baseToken={baseToken}
            orders={orders}
            onPress={order => (this.props.navigation.navigate("OrderDetails", { order, quoteToken }))} />
      </View>
    );
  }
}

export default connect((state) => ({ ...state.device, ...state.relayer }), (dispatch) => ({ dispatch }))(TradingScreen);
