/** @jsx React.DOM */

var React = require('react'),
    _ = require('lodash');

var Mathbox = React.createClass({
    captureClick: function(e){
        /*console.log("caught...",this.props.editing,this.props.type)
        if (!this.props.editing && this.props.type==="textbox"){
            console.log("STOPPED")
            e.stopPropagation();
            e.preventDefault();
        }*/
    },
    setMeUp: function(){
        var j = $(this.refs.math.getDOMNode());
        j.mathquill(this.props.type);
        if (!this.props.editing && this.props.type==="textbox"){
            console.log("gonna remove listeners...")
            setTimeout(function(){
                $(this.refs.math.getDOMNode()).addClass("noborder").unbind();
            }.bind(this));
        } else {
            j.removeClass("noborder").bind("keydown keypress",_.throttle(function(){
                var l = $(this.refs.math.getDOMNode()).mathquill('latex');
                if (l!== this.prev){
                    this.props.update(l);
                    this.prev = l;
                }
            }.bind(this),300));
        }
    },
    tearMeDown: function(){
        $(this.refs.math.getDOMNode()).mathquill('revert').unbind();
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
        return <div onClick={this.captureClick}><div ref='math'>{this.prev}</div></div>;
    }
});

module.exports = Mathbox;