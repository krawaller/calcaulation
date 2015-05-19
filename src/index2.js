/** @jsx React.DOM */

var React = require('react'),
	Home = require('./home2');

if (typeof window !== 'undefined') {
    window.React = React;
}

$(function(){
	React.render(<Home />, document.body);
});