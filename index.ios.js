'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var _ = require('lodash');

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
  image: { flex: 1, width: 362, height: 600},
};

var steps = {
  DRAWING: 'DRAWING',
  SUBMITTING: 'SUBMITTING',
  VIEWING: 'VIEWING'
};

var DrawingHandler = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.countdown}>Draw a {this.props.animal}! {this.props.countdown}</Text>
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
      return _.map(drawings.drawing_urls, function (path) {
        return 'http://localhost:3000' + path;
      });
    });
}
function getContentForStep(state, step) {
  switch (step) {
    case steps.DRAWING:
      return <DrawingHandler animal={'Penguin'} countdown={state.drawingCountdown}/>;
      break;
    case steps.SUBMITTING:
      return <Text>Submitting your Penguin!</Text>;
      break;
    case steps.VIEWING:
      return <ListView
        dataSource={state.drawingUrls}
        renderRow={(drawingUrl) => <Image source={{uri: drawingUrl}} style={styles.image}/>}
        />;
      break;
  }
  return <View></View>
}

var AwesomeProject = React.createClass({
  mixins: [TimerMixin],
  componentDidMount: function() {
    this.setInterval(this.tick, 1000);
  },
  tick: function(){
    if (this.state.step === steps.DRAWING) {
      var reducedDrawingCountdown = this.state.drawingCountdown - 1;
      this.setState({step: steps.DRAWING, drawingCountdown: reducedDrawingCountdown});
      if (this.state.drawingCountdown <= 1) {
        this.saveDrawing();
      }
    }
  },
  getInitialState: function () {
    return {
      step: steps.DRAWING,
      drawingCountdown: 10
    }
  },
  render: function () {
    return (
      <View style={styles.container}>
        {getContentForStep(this.state, this.state.step)}
      </View>
    );
  },
  saveDrawing: function () {
    NativeModules.DRAWViewManager.imageAsBase64Encoded((error, base64Image) => {
      this.setState({step: steps.SUBMITTING});
      submitDrawing(base64Image).then(() => {
        retrieveDrawingUrls().then((drawingUrls) => {
          var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({step: steps.VIEWING, drawingUrls: dataSource.cloneWithRows(drawingUrls)});
        });
      });
    });
  }});


AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
