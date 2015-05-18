/** @jsx React.DOM */

var React = require('react'),
    Mathbox = require('./mathbox');
    _ = require('lodash');

var Home = React.createClass({
    getInitialState: function(){
        this.seeds = decodeURIComponent(window.location.hash.replace(/^\#/,"")).split("__");
        return { content: this.seeds };
    },
    update: function(id,latex){
        this.seeds = _.slice(this.seeds,0,id).concat([latex]).concat(_.slice(this.seeds,id+1,666));
        console.log("SO",this.seeds);
    },
    addRow: function(){
        setTimeout(function(){
            this.setState({content:(this.seeds=this.seeds.concat(""))});
        }.bind(this));
    },
    render: function(){
        return (
            <div>
                <h4>Beskrivning</h4>
                <Mathbox key="desc" seed={this.state.content[0]} type='textbox' update={this.update.bind(this,0)} />
                <h4>Uträkning</h4>
                {_.map(_.tail(this.state.content),function(txt,n){
                    return (
                        <div key={n+1}>
                            <Mathbox seed={txt} update={this.update.bind(this,n+1)} />
                        </div>
                    );
                }.bind(this))}
                <p>
                    <button onClick={this.addRow}>Ny rad</button>
                </p>
            </div>
        );
    }
});

module.exports = Home;