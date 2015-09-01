'use strict';

var React = require('react-native');

var {
  AppRegistry,
  View,
  Text,
  Image,
  requireNativeComponent,
  NativeModules,
  ListView,
} = React;

var DrawingCapture = requireNativeComponent('DRAWView', null);

var styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  countdown: {
    justifyContent: 'center',
    marginTop: 30
  },
  images: {
    flex: 1,
    justifyContent: 'center',
  },
  image: { flex: 1, width: 300, height: 161},
};

var steps = {
  DRAWING: 'DRAWING',
  SUBMITTING: 'SUBMITTING',
  VIEWING: 'VIEWING'
};

var DrawingHandler = React.createClass({
  _onSaveEvent: function() {
    NativeModules.DRAWViewManager.imageAsBase64Encoded((error, base64Image) => {
      this.props.onSave(base64Image);
    });
  },
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.countdown} onPress={this._onSaveEvent}>Click me!</Text>
        <DrawingCapture style={{flex: 1}}/>
      </View>
    )
  },
});

function submitDrawing(base64Image) {
  return fetch('http://localhost:3000/drawings', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'image': base64Image
    }),
  });
}
function retrieveDrawingUrls() {
  return fetch('http://localhost:3000/drawings', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(function (response) {
      return response.json()
    })
    .then(function(drawings){
      return drawings.drawing_urls;
    });
}

var AwesomeProject = React.createClass({
  getInitialState: function () {
    return {step: steps.DRAWING}
  },
  render: function () {
    switch (this.state.step) {
      case steps.DRAWING:
        return <DrawingHandler onSave={this.onSave} animal={'Penguin'}/>;
        break;
      case steps.SUBMITTING:
        return this.renderSubmitting();
        break;
      case steps.VIEWING:
        return this.renderViewing();
        break;
    }
  },
  onSave: function (base64Image) {
    this.setState({step: steps.SUBMITTING});
    submitDrawing(base64Image).then(() => {
        retrieveDrawingUrls().then((drawingUrls) => {
          var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({step: steps.VIEWING, drawingUrls: dataSource.cloneWithRows(drawingUrls)});
        });
      });
  },
  renderSubmitting: function () {
    return (
      <View style={styles.container}>
        <Text>Submitting your Penguin!</Text>
      </View>
    )
  },
  renderViewing: function () {
    return (
      <View style={styles.images}>
        <ListView
          dataSource={this.state.drawingUrls}
          renderRow={(drawingUrl) => <Image source={{uri: drawingUrl}} style={styles.image}/>}
          />
      </View>
    )
  }
});


AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
