/** @jsx React.DOM */

var React = require('react'),
    _ = require('lodash');

var Mathbox = React.createClass({
    componentDidMount: function(){
        this.j = $(this.getDOMNode());
        this.j.mathquill(this.props.type||"editable");
        this.j.bind("keydown keypress",_.throttle(function(){
            var l = this.j.mathquill('latex');
            if (l!== this.prev){
                this.props.update(l);
                this.prev = l;
            }
        }.bind(this),300));
        console.log("DIDMOUNT",this.key,"with content",this.props.seed);
    },
    componentWillUnmount: function(){
        this.j.unbind();
    },
    componentDidUpdate: function(){
        setTimeout(function(){
            this.j.mathquill('redraw');
        }.bind(this),500);
        console.log("DIDUPDATE",this.key,"with content",this.props.seed);
    },
    render: function(){
        this.prev = this.props.seed||'';
        return <div>{this.prev}</div>;
    }
});

module.exports = Mathbox;