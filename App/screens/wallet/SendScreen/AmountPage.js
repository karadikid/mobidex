import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import * as TickerService from '../../../../services/TickerService';
import * as WalletService from '../../../../services/WalletService';
import { styles } from '../../../../styles';
import {
  formatAmount,
  getForexIcon,
  isValidAmount,
  processVirtualKeyboardCharacter
} from '../../../../utils';
import MaxButton from '../../../components/MaxButton';
import Row from '../../../components/Row';
import TokenAmount from '../../../components/TokenAmount';
import TouchableTokenAmount from '../../../components/TouchableTokenAmount';
import TokenAmountKeyboard from '../../../components/TokenAmountKeyboard';

export default class AmountPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      forex: '',
      focus: 'amount',
      error: false
    };
  }

  render() {
    const { asset } = this.props;
    const balance = WalletService.getAdjustedBalanceByAddress(asset.address);

    return (
      <View style={{ padding: 20, flex: 1, width: '100%' }}>
        <TokenAmount
          label={'Wallet Amount'}
          symbol={asset.symbol}
          icon={<Entypo name="wallet" size={30} />}
          containerStyle={{
            marginTop: 10,
            marginBottom: 10,
            padding: 0
          }}
          symbolStyle={{ marginRight: 10 }}
          format={false}
          cursor={false}
          amount={formatAmount(balance ? balance : '0')}
          onPress={() => this.setState({ focus: 'amount' })}
        />
        {/*<TouchableTokenAmount
          label={'Send Amount'}
          symbol={asset.symbol}
          containerStyle={{
            flex: 1,
            marginTop: 10,
            marginBottom: 10,
            padding: 0
          }}
          symbolStyle={{ marginRight: 10 }}
          format={false}
          cursor={this.state.focus === 'amount'}
          cursorProps={{ style: { marginLeft: 2 } }}
          amount={this.state.amount}
          onPress={() => this.setState({ focus: 'amount' })}
        />*/}
        <Row style={[styles.w100, styles.flex1]}>
          <TouchableTokenAmount
            label={'Send Amount'}
            symbol={asset.symbol}
            containerStyle={{
              flex: 1,
              marginTop: 10,
              marginBottom: 10,
              padding: 0
            }}
            symbolStyle={{ marginRight: 10 }}
            format={false}
            cursor={this.state.focus === 'amount'}
            cursorProps={{ style: { marginLeft: 2 } }}
            amount={this.state.amount}
            onPress={() => this.setState({ focus: 'amount' })}
            wrapperStyle={[styles.flex1]}
          />
          <MaxButton
            buttonStyle={[styles.mt3]}
            onPress={this.setMaxTokenAmount}
          />
        </Row>
        <TouchableTokenAmount
          label={'Send Amount in Forex'}
          symbol={'USD'}
          icon={getForexIcon('USD', { size: 30, style: { marginLeft: 10 } })}
          containerStyle={{
            marginTop: 10,
            marginBottom: 10,
            padding: 0
          }}
          symbolStyle={{ marginRight: 10 }}
          format={false}
          cursor={this.state.focus === 'forex'}
          cursorProps={{ style: { marginLeft: 2 } }}
          amount={this.state.forex}
          onPress={() => this.setState({ focus: 'forex' })}
        />
        <TokenAmountKeyboard
          onChange={v =>
            this.state.focus === 'forex'
              ? this.updateForexAmount(v)
              : this.updateTokenAmount(v)
          }
          onSubmit={() => this.submit()}
          pressMode="char"
          buttonTitle={'Next'}
          disabled={new BigNumber(this.state.amount || 0).lte(0)}
        />
      </View>
    );
  }

  async submit() {
    try {
      new BigNumber(this.state.amount);
      this.props.onSubmit(this.state.amount);
    } catch (err) {
      this.setState({ error: true });
    }
  }

  setTokenAmount = amount => {
    if (isValidAmount(amount)) {
      const forex = TickerService.getForexTicker(this.props.asset.symbol);
      const forexAmount =
        amount && forex && forex.price
          ? new BigNumber(amount).mul(forex.price).toString()
          : '';
      this.setState({ amount, forex: forexAmount });
    }
  };

  setMaxTokenAmount = () => {
    const { asset } = this.props;
    const balance = WalletService.getAdjustedBalanceByAddress(asset.address);
    this.setTokenAmount(balance.toString());
  };

  updateTokenAmount = value => {
    const amount = processVirtualKeyboardCharacter(
      value,
      this.state.amount.toString()
    );

    this.setTokenAmount(amount);
  };

  updateForexAmount = value => {
    const forexAmount = processVirtualKeyboardCharacter(
      value,
      this.state.forex.toString()
    );

    if (isValidAmount(forexAmount)) {
      const forex = TickerService.getForexTicker(this.props.asset.symbol);
      const tokenAmount =
        forexAmount && forex
          ? formatAmount(new BigNumber(forexAmount).div(forex.price))
          : '';
      this.setState({ amount: tokenAmount, forex: forexAmount });
    }
  };
}

AmountPage.propTypes = {
  asset: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
};