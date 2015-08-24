'use strict';

var React = require('react-native');
var SignatureCapture = require('react-native-signature-capture');

var {
  AppRegistry,
  View,
  Text,
} = React;

var styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  }
};

var steps = {
  DRAWING: 'DRAWING',
  SUBMITTING: 'SUBMITTING',
  AWAITING_VOTE: 'AWAITING_VOTE',
  VOTING: 'VOTING',
  VIEWING_VOTE: 'VIEWING_VOTE'
};

var DrawingHandler = React.createClass({
  _onSaveEvent: function(result) {
    this.props.onSave(result.encoded);
  },
  render: function() {
    return (
      <View style={styles.container}>
        <Text>Draw a {this.props.animal}!</Text>
        <SignatureCapture onSaveEvent={this._onSaveEvent} />
      </View>
    )
  },
});

var AwesomeProject = React.createClass({
  getInitialState: function() {
    return {step: steps.DRAWING}
  },
  render: function() {
    switch (this.state.step) {
      case steps.DRAWING:
        return <DrawingHandler onSave={this.onSave} animal={'Penguin'}/>;
        break;
      case steps.SUBMITTING:
        return this.renderSubmitting();
        break;
      case steps.AWAITING_VOTE:
        return this.renderAwaitingVote();
        break;
    }
  },
  onSave: function(base64Image) {
    this.setState({step: steps.SUBMITTING});

    fetch('http://localhost:3000/drawings', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'image': base64Image
      }),
    })
      .then(function(response){ return response.json()})
      .then(() => {
        this.setState({step: steps.AWAITING_VOTE})
      });
  },
  renderSubmitting: function() {
    return (
      <View style={styles.container}>
        <Text>Submitting your Penguin!</Text>
      </View>
    )
  },
  renderAwaitingVote: function() {
    return (
      <View style={styles.container}>
        <Text>Waiting on some slow poke to vote!</Text>
      </View>
    )
  }
});


AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
