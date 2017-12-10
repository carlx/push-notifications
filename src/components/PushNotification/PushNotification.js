import React from 'react';
import PropTypes from 'prop-types';
import bowser from 'bowser';
import { APPLICATION_SERVER_KEY } from './constants';

export class PushNotification extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSubscribed: false,
      log: null,
      debug: this.props.debug || false,
    };
  }

  componentDidMount() {
    if (['Chrome', 'Firefox', 'Opera'].includes(bowser.name)) {
      this.nonSafariInit();
    }
  }

  subscription = null;
  serviceWorkerRegistration = null;

  subscribeUser = () => {
    this.serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: APPLICATION_SERVER_KEY,
    })
      .then((subscription) => {
        this.subscription = subscription;
        this.updateSubscriptionOnServer(subscription);
        this.setState({ isSubscribed: true, log: `User is subscribed:${JSON.stringify(subscription)}` });
      })
      .catch((error) => {
        this.setState({ isSubscribed: false, log: `Failed to subscribe the user: ${JSON.stringify(error)}` });
      });
  }

  unsubscribeUser = () => {
    this.serviceWorkerRegistration.pushManager.getSubscription()
      .then((subscription) => {
        if (subscription) {
          return this.subscription.unsubscribe();
        }
        throw new Error('No subsription');
      }).then(() => {
        this.setState({ isSubscribed: false, log: 'User is unsubscribed.' });
      // todo update on server
      }).catch((error) => {
        this.setState({ log: `Error unsubscribing ${JSON.stringify(error)}` });
      });
  }

  subscribe = () => this.state.isSubscribed
    ? this.unsubscribeUser()
    : this.subscribeUser()

  nonSafariInit = () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      this.setState({ log: 'Service Worker and Push is supported' });
      navigator.serviceWorker.register('sw.js')
        .then((swReg) => {
          // todo automatic subscription
          this.serviceWorkerRegistration = swReg;
          this.setState({ log: 'Service Worker is registered' });
        }).catch((error) => {
          this.setState({ log: `Service Worker Error ${JSON.stringify(error)}` });
        });
    } else {
      this.setState({ log: 'Push messaging is not supported' });
      // todo dispatch action
    }
  }

  updateSubscriptionOnServer = (subscription) => {
    fetch('http://localhost:3066/notify',
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(subscription),
      }).then((success) => {
      if (success.status === 200) {
        return success.json();
      }
      throw new Error();
    }).then((json) => this.setState({ log: `Data sended to server: ${JSON.stringify(json)}` }))
      .catch(() => this.setState({ log: 'Faild sending to server' }));
  }

  sendToServer = () => {
    this.updateSubscriptionOnServer(this.subscription);
  }


  render() {
    console.log(this.state.log);
    return (
      <div>
        <button onClick={this.subscribe}>
          {
            this.state.isSubscribed ? 'Disable Push Messaging' : 'Enable Push Messaging'
          }
        </button>
        {this.state.isSubscribed &&
        <button onClick={this.sendToServer}>
          updateSubscrition on serwer
        </button>
        }
      </div>
    );
  }
}

PushNotification.propTypes = {
  debug: PropTypes.bool,
};

PushNotification.defaultProps = {
  debug: true,
};

export default PushNotification;
