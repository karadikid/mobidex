import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import {
  loadAssets,
  updateForexTickers,
  updateTokenTickers
} from '../../../thunks';
import Row from '../../components/Row';
import PageRoot from '../../components/PageRoot';
import TokenList from './TokenList';
import TokenDetails from './TokenDetails';

class AccountsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: null
    };
  }

  render() {
    let ethToken = _.find(this.props.assets, { symbol: 'ETH' });
    let filteredTokens = _.filter(
      this.props.assets,
      asset => asset.symbol !== 'ETH' && asset.symbol !== 'WETH'
    );

    return (
      <View>
        <Row>
          <TokenDetails token={this.state.token || ethToken} />
        </Row>
        <Row>
          <TokenList
            token={this.state.token}
            tokens={filteredTokens}
            onPress={token =>
              this.state.token !== token
                ? this.setState({ token })
                : this.setState({ token: null })
            }
          />
        </Row>
      </View>
    );
  }
}

class AccountsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  async componentDidMount() {
    await this.onRefresh();
  }

  render() {
    if (!this.props.assets.length) {
      return null;
    }

    return (
      <PageRoot>
        <ScrollView
          style={{ width: '100%' }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh(true)}
            />
          }
        >
          {this.props.assets.length ? (
            <AccountsView assets={this.props.assets} />
          ) : null}
        </ScrollView>
      </PageRoot>
    );
  }

  async onRefresh(force = false) {
    this.setState({ refreshing: true });
    await this.props.dispatch(loadAssets(force));
    await this.props.dispatch(updateForexTickers());
    await this.props.dispatch(updateTokenTickers());
    this.setState({ refreshing: false });
  }
}

AccountsScreen.propTypes = {
  assets: PropTypes.arrayOf(PropTypes.object).isRequired,
  tokens: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(
  state => ({ ...state.wallet, ...state.relayer, ...state.device.layout }),
  dispatch => ({ dispatch })
)(AccountsScreen);
