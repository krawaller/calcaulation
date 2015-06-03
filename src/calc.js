/** @jsx React.DOM */

var React = require('react'),
    Mathbox = require('./mathbox'),
    _ = require('lodash');

var Calc = React.createClass({
    updateChild: function(id,latex){
        this.data = _.slice(this.data,0,id).concat([latex]).concat(_.slice(this.data,id+1,666));
        this.props.onUpdate(this.data);
    },
    addRow: function(){
        this.data = (this.data=this.data.concat(""));
        this.props.onUpdate(this.data,true);
    },
    removeRow: function(n){
        setTimeout(function(){
            this.data = _.slice(this.data,0,n).concat(_.slice(this.data,n+1,666));
            this.props.onUpdate(this.data,true);
        }.bind(this));
    },
    copyRow: function(n){
        setTimeout(function(){
            this.data = _.slice(this.data,0,n).concat([this.data[n],this.data[n]]).concat(_.slice(this.data,n+1,666));
            this.props.onUpdate(this.data,true);
        }.bind(this));
    },
    moveRowUp: function(n){
        setTimeout(function(){
            this.data = _.slice(this.data,0,n-1).concat([this.data[n],this.data[n-1]]).concat(_.slice(this.data,n+1,666));
            this.props.onUpdate(this.data,true);
        }.bind(this));
        //var s = this.seeds, a = _.slice(s,0,id-1).concat([ s[id], s[id-1] ]).concat(_.slice(s,id+1,666));
        //this.setState({content: (this.seeds = a)});
    },
    moveRowDown: function(n){
        setTimeout(function(){
            this.data = _.slice(this.data,0,n).concat([this.data[n+1],this.data[n]]).concat(_.slice(this.data,n+2,666));
            this.props.onUpdate(this.data,true);
        }.bind(this));
        // var s = this.seeds, a = _.slice(s,0,id).concat([ s[id+1], s[id] ]).concat(_.slice(s,id+2,666));
        // this.setState({content: (this.seeds = a)});
    },
    render: function(){
        var e = this.props.editing,
            eqtable = _.all(this.props.data,function(t){return t.split("=").length===2;});
        this.data = this.props.data;
        return (
            <div className="calc">
                <table className='calctable'>
                    <tbody>
                        {_.map(this.props.data,function(txt,n){
                            var split = txt.split("=");
                            return e ? (
                                <tr key={n}>
                                    <td>
                                    {this.props.data.length>1? <button onClick={this.removeRow.bind(this,n)} type="button" className="btn btn-default btn-xs">
                                        <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                                    </button>:''}
                                    {' '}<button onClick={this.copyRow.bind(this,n)} type="button" className="btn btn-default btn-xs">
                                        <span className="glyphicon glyphicon-copy" aria-hidden="true"></span>
                                    </button>
                                    {' '}<Mathbox editing={true} data={txt} type={e?'editable':''} onUpdate={this.updateChild.bind(this,n)} />
                                    {n ? <button onClick={this.moveRowUp.bind(this,n)} type="button" className="btn btn-default btn-xs">
                                        <span className="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>
                                    </button>:''}
                                    {this.data.length-1>n ? <button onClick={this.moveRowDown.bind(this,n)} type="button" className="btn btn-default btn-xs">
                                        <span className="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>
                                    </button>:''}
                                    </td>
                                </tr>
                            ) : eqtable ? (
                                <tr className='eqrow' key={n}>
                                    <td><Mathbox data={split[0]} /></td>
                                    <td><Mathbox data="=" /></td>
                                    <td><Mathbox data={split[1]} /></td>
                                </tr>
                            ) : (
                                <tr key={n}>
                                    <td>
                                        <Mathbox data={txt} />
                                    </td>
                                </tr>
                            );
                        }.bind(this))}
                    </tbody>
                </table>
                {e && (
                    <div className="rowbuttons">
                        <button onClick={this.addRow.bind(this)} type="button" className="btn btn-default btn-xs">
                            <span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
                            {' '}Lägg till tom rad
                        </button>
                    </div>
                )}
            </div>
        );
    }
});

module.exports = Calc;