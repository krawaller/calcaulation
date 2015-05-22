/** @jsx React.DOM */

var React = require('react'),
    _ = require('lodash');

var Mathbox = React.createClass({
    setMeUp: function(){
        var j = $(this.refs.math.getDOMNode());
        j.mathquill(this.props.type);
        if (!this.props.editing && this.props.type==="textbox"){
            // this is a textbox that's not being edited which MQ doesn't support, so have to fake disabling
            setTimeout(function(){
                $(this.refs.math.getDOMNode()).addClass("noborder").unbind();
            }.bind(this));
        } else if (this.props.editing) {
            // we're editing, so adding listener
            j.removeClass("noborder").on("keydown keypress",_.throttle(function(){
                var l = $(this.refs.math.getDOMNode()).mathquill('latex');
                if (l!== this.prev){
                    this.props.onUpdate(l);
                    this.prev = l;
                }
            }.bind(this),300));
        }
    },
    tearMeDown: function(){
        $(this.refs.math.getDOMNode()).mathquill('revert').unbind();
    },
    componentDidMount: function(){ this.setMeUp(); },
    componentDidUpdate: function(){ this.setMeUp(); },
    componentWillUnmount: function(){ this.tearMeDown(); },
    componentWillUpdate: function(){ this.tearMeDown(); },
    render: function(){
        this.prev = this.props.data||'';
        return <div ref='math'>{this.prev}</div>;
    }
});

module.exports = Mathbox;