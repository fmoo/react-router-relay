import PropTypes from 'prop-types';
import React from 'react';

import QueryAggregator from './QueryAggregator';

const propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  Relay: PropTypes.object.isRequired,
};

const childContextTypes = {
  queryAggregator: PropTypes.object.isRequired,
};

class RelayRouterContext extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.queryAggregator = new QueryAggregator(props);
  }

  getChildContext() {
    return {
      queryAggregator: this.queryAggregator,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location === this.props.location) {
      return;
    }

    this.queryAggregator.updateQueryConfig(nextProps);
  }

  renderCallback = (renderArgs) => {
    this.queryAggregator.setRenderArgs(renderArgs);
    return this.props.children;
  };

  render() {
    const { Relay, props } = this.props;

    return (
      <Relay.Renderer
        environment={Relay.Store}
        {...props}
        Container={this.queryAggregator}
        render={this.renderCallback}
        queryConfig={this.queryAggregator.queryConfig}
      />
    );
  }
}

RelayRouterContext.propTypes = propTypes;
RelayRouterContext.childContextTypes = childContextTypes;

export default RelayRouterContext;
