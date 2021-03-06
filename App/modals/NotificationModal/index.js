import React from 'react';
import NavigationProvider from '../../NavigationProvider';
import BaseNotificationModal from './base';

export default class ConfirmationModal extends React.Component {
  static options() {
    return {
      topBar: {
        visible: false,
        drawBehind: true
      }
    };
  }

  render() {
    return (
      <NavigationProvider componentId={this.props.componentId}>
        <BaseNotificationModal {...this.props} />
      </NavigationProvider>
    );
  }
}
