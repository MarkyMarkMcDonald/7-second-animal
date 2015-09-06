var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var _ = require('lodash');
var DrawingCanvas = require('./drawing_canvas.ios.js');
var SERVER_URL = 'http://seven-second-animal.cfapps.pez.pivotal.io';
var queryString = require('query-string');
var Button = require('react-native-button');

var {
  View,
  Text,
  Image,
  NativeModules,
  ListView,
  } = React;

var styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  image: {flex: 1, width: 362, height: 600},
};

var steps = {
  DRAWING: 'DRAWING',
  SUBMITTING: 'SUBMITTING',
  VIEWING: 'VIEWING'
};

function submitDrawing(prompt, base64Image) {
  return fetch(SERVER_URL + '/drawings', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64Image,
      prompt: prompt
    }),
  });
}
function retrieveDrawingUrls(prompt) {
  var endpoint = SERVER_URL + '/drawings?' + queryString.stringify({prompt: prompt});
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(function (response) {
    return response.json()
  })
    .then(function (drawings) {
      return _.map(drawings.drawing_urls, function (path) {
        return SERVER_URL + path;
      });
    });
}
function getContentForStep(state, step, props, reset) {
  switch (step) {
    case steps.DRAWING:
      return <DrawingCanvas animal={props.animal} countdown={state.drawingCountdown}/>;
      break;
    case steps.SUBMITTING:
      return <Text>Submitting your {props.animal}!</Text>;
      break;
    case steps.VIEWING:
      return (
        <View>
          <Button style={{color: 'green'}} onPress={reset}>Next Animal!</Button>
          <ListView
          dataSource={state.drawingUrls}
          renderRow={(drawingUrl) => <Image source={{uri: drawingUrl}} style={styles.image}/>}
          />
        </View>
      );
      break;
  }
  return <View></View>
}

var AnimalSubmission = React.createClass({
  mixins: [TimerMixin],
  componentDidMount: function () {
    this.setInterval(this.tick, 1000);
  },
  tick: function () {
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
      drawingCountdown: 7
    }
  },
  render: function () {
    return (
      <View style={styles.container}>
        {getContentForStep(this.state, this.state.step, this.props, this.reset)}
      </View>
    );
  },
  reset: function(){
    this.props.reset();
    this.setState({step: steps.DRAWING, drawingCountdown: 7});
  },
  saveDrawing: function () {
    NativeModules.DRAWViewManager.imageAsBase64Encoded((error, base64Image) => {
      this.setState({step: steps.SUBMITTING});
      submitDrawing(this.props.animal, base64Image).then(() => {
        retrieveDrawingUrls(this.props.animal).then((drawingUrls) => {
          var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({step: steps.VIEWING, drawingUrls: dataSource.cloneWithRows(drawingUrls)});
        });
      });
    });
  }
});

module.exports = AnimalSubmission;
