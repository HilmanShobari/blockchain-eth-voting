import React, { Component } from 'react';
import { Router } from '../routes';
import LoadingPage from './LoadingPage';

const withLoading = (WrappedComponent) => {
  return class extends Component {
    state = {
      isLoading: false
    };

    componentDidMount() {
      // Show loading when route changes
      Router.onRouteChangeStart = () => {
        this.setState({ isLoading: true });
      };

      Router.onRouteChangeComplete = () => {
        this.setState({ isLoading: false });
      };

      Router.onRouteChangeError = () => {
        this.setState({ isLoading: false });
      };
    }

    componentWillUnmount() {
      // Clean up event listeners
      Router.onRouteChangeStart = null;
      Router.onRouteChangeComplete = null;
      Router.onRouteChangeError = null;
    }

    render() {
      if (this.state.isLoading) {
        return <LoadingPage message="Loading Page..." />;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withLoading; 