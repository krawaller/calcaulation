/** @jsx React.DOM */

var React = require('react'),
	Home = require('./home');

if (typeof window !== 'undefined') {
    window.React = React;
}

$(function(){
	React.render(<Home />, document.body);
});