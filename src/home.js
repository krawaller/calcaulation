/** @jsx React.DOM */

var React = require('react'),
    Mathbox = require('./mathbox');
    _ = require('lodash');

var Home = React.createClass({
    readStateFromQuery: function(){
        return decodeURIComponent(window.location.hash.replace(/^\#/,"")).split("__");
    },
    saveStateToQuery: function(){
        return encodeURIComponent(this.seeds.join("__"));
    },
    getInitialState: function(){
        this.seeds = this.readStateFromQuery();
        return { content: this.seeds, editing: false, href: window.location.href };
    },
    update: function(id,latex){
        this.seeds = _.slice(this.seeds,0,id).concat([latex]).concat(_.slice(this.seeds,id+1,666));
        console.log("SO",this.seeds);
    },
    addRow: function(){
        this.setState({content:(this.seeds=this.seeds.concat(""))});
    },
    removeRow: function(){
        this.setState({content:(this.seeds=_.dropRight(this.seeds))});
    },
    startEdit: function(){
        this.setState({editing:true});
    },
    cancelEdit: function(){
        this.setState({editing:false,content:this.readStateFromQuery()});
    },
    saveEdit: function(){
        var url = window.location.hash="#"+this.saveStateToQuery();
        console.log("Nu jäklar",url);
        this.setState({
            content: this.seeds,
            editing: false,
            href: window.location.pathname+"#"+this.saveStateToQuery()
        });
    },
    render: function(){
        var e = this.state.editing;
        return (
            <div>
                <h4>Beskrivning</h4>
                <Mathbox key="desc" id="0" seed={this.state.content[0]} editing={e} type='textbox' update={this.update.bind(this,0)} />
                <h4>Beräkningar</h4>
                {_.map(_.tail(this.state.content),function(txt,n){
                    return (
                        <div key={n+1}>
                            <Mathbox seed={txt} id={n+1} type={e?'editable':''} update={this.update.bind(this,n+1)} />
                        </div>
                    );
                }.bind(this))}
                <p>
                    {!e?<button onClick={this.startEdit}>Ändra</button>:(
                        <div>
                            <button onClick={this.addRow}>Ny rad</button>
                            {this.state.content.length>1?<button onClick={this.removeRow}>Ta bort rad</button>:''}
                            <button onClick={this.cancelEdit}>Avbryt</button>
                            <button onClick={this.saveEdit}>Spara</button>
                        </div>
                    )}
                </p>
                <h4>Länk</h4>
                <a href={this.state.href}>{this.state.href}</a>
            </div>
        );
    }
});

module.exports = Home;