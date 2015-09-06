var React = require('react-native');
var AnimalSubmission = require('./animal_submission.ios.js');
var _ = require('lodash');

var animals = ['Penguin', 'Bear', 'Turtle', 'Cat', 'Bat', 'Dog',
               'Ant', 'Beaver', 'Bee', 'Butterfly', 'Caterpillar',
               'Cheetah', 'Chicken', 'Cockroach', 'Dolphin', 'Duck',
               'Elephant', 'Giraffe', 'Jellyfish', 'Kangaroo', 'Ladybug',
               'Lion', 'Lobster', 'Monkey', 'Moose', 'Mosquito', 'Narwhal',
               'Octopus', 'Owl', 'Panda', 'Pelican', 'Pig', 'Porcupine',
               'Reindeer', 'Scorpion', 'Snake', 'Spider', 'Squirrel', 'Stingray'
];

var Router = React.createClass({
  render: function() {
    return (
      <AnimalSubmission animal={this.state.animal} reset={this.reset}/>
    )
  },
  getInitialState: function() {
    return {
      animal: _.sample(animals)
    };
  },
  reset: function() {
    this.setState({
      animal: _.sample(animals)
    });
  }
});

module.exports = Router;
