/** @jsx React.DOM */

var React = require('react'),
    _ = require('lodash'),
    MathQuill = window.MathQuill;

var Mathbox = React.createClass({
    setMeUp: function(){
        var n = this.getDOMNode();
        MathQuill[this.props.type||"StaticMath"](n,{
            handlers: {
                reflow: function(field){
                    var l = field.latex();
                    if (l!=this.prev){
                        this.prev = l;
                        this.props.update(l);
                    }
                    console.log("EDITED WAS CALLED")
                }.bind(this)
            }
        }).latex(this.prev);
    },
    tearMeDown: function(){
        MathQuill(this.getDOMNode()).revert();
    },
    componentDidMount: function(){
        console.log("DIDMOUNT",this.props.id,"with content",this.props.seed);
        this.setMeUp();
    },
    componentWillUnmount: function(){
        this.tearMeDown();
    },
    componentWillUpdate: function(){
        this.tearMeDown();
    },
    componentDidUpdate: function(){
        //setTimeout(function(){
            this.setMeUp();
        //}.bind(this),500);
        console.log("DIDUPDATE",this.props.id,"with content",this.props.seed);
    },
    render: function(){
        console.log("DIDRENDER",this.props.id,"with content",this.props.seed);
        this.prev = this.props.seed||'';
        return <div>{this.prev}</div>;
    }
});

module.exports = Mathbox;