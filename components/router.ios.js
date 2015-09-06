var React = require('react-native');
var AnimalSubmission = require('./animal_submission.ios.js');

var Router = React.createClass({
  render: function() {
    return (
      <AnimalSubmission animal={'Penguin'}/>
    )
  }
});

module.exports = Router;
