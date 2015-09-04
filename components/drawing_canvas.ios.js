var React = require('react-native');
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
};

var {
  View,
  Text,
  requireNativeComponent,
} = React;
var DrawingCapture = requireNativeComponent('DRAWView', null);

var DrawingCanvas = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.countdown}>Draw a {this.props.animal}! {this.props.countdown}</Text>
        <DrawingCapture style={{flex: 1}}/>
      </View>
    )
  },
});

module.exports = DrawingCanvas;
