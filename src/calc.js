/** @jsx React.DOM */

var React = require('react'),
    Mathbox = require('./mathbox'),
    _ = require('lodash');

var Calc = React.createClass({
    updateChild: function(id,latex){
        this.data = _.slice(this.data,0,id).concat([latex]).concat(_.slice(this.data,id+1,666));
        this.props.onUpdate(this.data);
    },
    addRow: function(copy){
        this.data = (this.data=this.data.concat(copy ? this.data[this.data.length-1] : ""));
        this.props.onUpdate(this.data,true);
    },
    removeRow: function(n){
        setTimeout(function(){
            this.data = _.slice(this.data,0,n).concat(_.slice(this.data,n+1,666));
            this.props.onUpdate(this.data,true);
        }.bind(this));
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
                                    {e && this.props.data.length>1? <button onClick={this.removeRow.bind(this,n)} type="button" className="btn btn-default btn-xs">
                                        <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                                    </button>:''}
                                    {' '}<Mathbox editing={true} data={txt} type={e?'editable':''} onUpdate={this.updateChild.bind(this,n)} />
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
                        <button onClick={this.addRow.bind(this,false)} type="button" className="btn btn-default btn-xs">
                            <span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
                            {' '}Lägg till tom rad
                        </button>
                        <button onClick={this.addRow.bind(this,true)} type="button" className="btn btn-default btn-xs">
                            <span className="glyphicon glyphicon-copy" aria-hidden="true"></span>
                            {' '}Lägg till kopia av sista raden
                        </button>
                    </div>
                )}
            </div>
        );
    }
});

module.exports = Calc;