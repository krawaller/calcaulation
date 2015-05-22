/** @jsx React.DOM */

var React = require('react'),
    Mathbox = require('./mathbox'),
    Calc = require('./calc'),
    _ = require('lodash');

var Entry = React.createClass({
    render: function(){
        var p = this.props,
            e = p.editing,
            n = p.pos,
            data = p.data,
            type = _.isArray(data) ? "mathbox" : "textbox",
            childprops = {editing:e,onUpdate:p.onUpdate,data:data,type:type,outof:p.outof},
            Comp = _.isArray(data) ? Calc : Mathbox;
        return e ? (
            <div>
                <div className="editentry">
                    <div>
                        <h4>
                            {p.outof>1 ? <button onClick={p.onDelete} type="button" className="btn btn-default btn-sm">
                                <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                            </button>: ''}{' '}
                            {type}{' '}
                            {n ? <button onClick={p.onMoveUp} type="button" className="btn btn-default btn-sm">
                                <span className="glyphicon glyphicon-arrow-up" aria-hidden="true"></span>
                            </button> : ''}{' '}
                            {p.outof-1>n ? <button onClick={p.onMoveDown} type="button" className="btn btn-default btn-sm">
                                <span className="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>
                            </button> : ''}{' '}
                        </h4>
                    </div>
                    <Comp {...childprops} />
                </div>
            </div>
        ) : <Comp {...childprops} />;
    }
});

module.exports = Entry;