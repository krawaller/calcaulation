/** @jsx React.DOM */

var React = require('react'),
    Entry = require('./entry'),
    Mathbox = require('./mathbox.js'),
    _ = require('lodash');

var Home = React.createClass({
    readStateFromQuery: function(){
        var json, hash = decodeURIComponent(window.location.hash.replace(/^\#/,""))||"[]";
        try {
            json = JSON.parse(hash);
            return json;
        } catch(e) {
            console.log("failed to parse!",hash,e);
            alert("Misslyckades med att läsa in uträkning!");
            return [];
        }
    },
    generateNewHash: function(){
        var l = window.location, jsonstr;
        try {
            jsonstr = JSON.stringify(this.seeds);
            return "#"+encodeURIComponent(jsonstr);
        } catch(e) {
            console.log("failed to stringify",this.seeds,e);
            alert("Misslyckades med att spara uträkning!");
            return "";
        }
    },
    generateNewUri: function(){
        var l = window.location, hash = this.generateNewHash();
        return l.href.split("#")[0] + hash;
    },
    getInitialState: function(){
        this.seeds = this.readStateFromQuery();
        return !this.seeds || !this.seeds.length || (this.seeds.length === 1 && (this.seeds[0] === '' || !this.seeds[0].length)) ? {
            content: (this.seeds=[""]),
            fromscratch: true,
            editing: true,
            href: window.location.href
        } : {
            content: this.seeds,
            editing: false,
            href: window.location.href
        }
    },
    onUpdate: function(id,data,forceredraw){
        console.log("OnUpdate called for box",id,"with data",data,"and force",forceredraw,", seeds are now",this.seeds);
        this.seeds = _.slice(this.seeds,0,id).concat([data]).concat(_.slice(this.seeds,id+1,666));
        if (forceredraw){
            this.setState({content:this.seeds});
        }
    },
    onCopy: function(id){
        this.seeds = _.slice(this.seeds,0,id).concat([this.seeds[id],this.seeds[id]]).concat(_.slice(this.seeds,id+1,666));
        this.setState({content:this.seeds});
    },
    onMoveUp: function(id){
        var s = this.seeds, a = _.slice(s,0,id-1).concat([ s[id], s[id-1] ]).concat(_.slice(s,id+1,666));
        this.setState({content: (this.seeds = a)});
    },
    onMoveDown: function(id){
        var s = this.seeds, a = _.slice(s,0,id).concat([ s[id+1], s[id] ]).concat(_.slice(s,id+2,666));
        this.setState({content: (this.seeds = a)});
    },
    onDelete: function(id){
        this.setState({content: (this.seeds = _.slice(this.seeds,0,id).concat(_.slice(this.seeds,id+1,666)))});
    },
    startEdit: function(){
        this.setState({editing:true});
    },
    cancelEdit: function(){
        this.setState({editing:false,content:(this.seeds=(this.savedseeds||this.readStateFromQuery()))});
    },
    saveEdit: function(){
        var url = this.generateNewUri();
        window.location = url;
        console.log("Sparar uträkning!",url);
        this.savedseeds = this.seeds;
        this.setState({
            content: this.seeds,
            editing: false,
            fromscratch: false,
            href: url
        });
    },
    newCalc: function(){
        window.location.hash=""
        this.setState(this.getInitialState());
    },
    addNewBox: function(kind){
        this.setState({content:(this.seeds=this.seeds.concat(kind))});
    },
    toggleHelp: function(){
        this.setState({
            showhelp: !this.state.showhelp,
            showlink:false
        });
    },
    toggleLink: function(){
        this.setState({
            showlink: !this.state.showlink,
            showhelp:false
        });
    },
    render: function(){
        var e = this.state.editing || this.state.fromscratch;
        return (
            <div>
                <div className="wrapper">
                    <div className="togglers">
                        <button onClick={this.toggleHelp} type="button" className="btn btn-default btn-sm">
                            <span className="glyphicon glyphicon-question-sign" aria-hidden="true"></span>
                            {' '}Hjälp
                        </button>
                        {!this.state.fromscratch ? <p><button onClick={this.toggleLink} type="button" className="btn btn-default btn-sm">
                            <span className="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
                            {' '}Dela
                        </button></p>:''}
                        {!e?(
                            <div className='editbtns'>
                                <p><button onClick={this.startEdit} type="button" className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                    {' '}Ändra
                                </button></p>
                                {!this.state.fromscratch ? <button onClick={this.newCalc} type="button" className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon-certificate" aria-hidden="true"></span>
                                    {' '}Ny
                                </button> : ''}
                            </div>
                        ):(
                            <div className='editbtns'>
                                {!this.state.fromscratch ? <p><button onClick={this.cancelEdit} type="button" className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                    {' '}Avbryt
                                </button></p> : ''}
                                <button onClick={this.saveEdit} type="button" className="btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
                                    {' '}Spara
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="entries">
                        {_.map(this.state.content,function(data,n){
                            return <div key={n} className='entrycontainer'>
                                <Entry
                                    key={n} pos={n} outof={this.state.content.length} data={data} editing={e}
                                    onUpdate={this.onUpdate.bind(this,n)} 
                                    onMoveUp={this.onMoveUp.bind(this,n)}
                                    onMoveDown={this.onMoveDown.bind(this,n)}
                                    onDelete={this.onDelete.bind(this,n)}
                                    onCopy={this.onCopy.bind(this,n)}
                                />
                            </div>;
                        },this)}
                    </div>
                    {e && <div className="rowbuttons">
                        <button onClick={this.addNewBox.bind(this,'')} type="button" className="btn btn-default btn-sm">
                            <span className="glyphicon glyphicon-text-size" aria-hidden="true"></span>
                            {' '}Lägg till ny textbox
                        </button>
                        <button onClick={this.addNewBox.bind(this,[['']])} type="button" className="btn btn-default btn-sm">
                            <span className="glyphicon glyphicon-align-justify" aria-hidden="true"></span>
                            {' '}Lägg till ny mattebox
                        </button>
                    </div>}
                </div>
                {this.state.showlink ? <div className="datalink">
                    <button onClick={this.toggleLink} type="button" className="closer btn btn-default btn-sm">
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    </button>
                    <p>Dela denna uträkning genom att kopiera och skicka länken nedan!</p>
                    <a href={this.state.href}>{this.state.href}</a>
                </div> : ''}
                {this.state.showhelp ? <div className="help">
                    <button onClick={this.toggleHelp} type="button" className="closer btn btn-default btn-sm">
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    </button>
                    <p>
Välkommen till det matematiska redovisningsverktyget! Här kan du skapa en <strong>redovisning</strong> och sedan enkelt
<strong>dela</strong> den med andra genom att kopiera och skicka den genererade länken.
                    </p>
                    <p>
En redovisning består av en eller flera <strong>boxar</strong> med information. Du kan kopiera, lägga till och ta bort boxar
(fast du kan inte ta bort den sista), samt flytta dem upp och ned. Det finns två olika sorters boxar:
                    </p>
                    <p>
                        <ul>
                            <li>
<strong>Textboxen</strong> är tänkt att fungera som ett vanligt textstycke. Här skriver du in vanlig flödande text,
exempelvis en inledande beskrivning av uppgiften och/eller ett avslutande svar. Du kan också gå in i ett "matteläge" i
textboxen genom att skriva ett dollartecken ($)!
                            </li>
                            <li>
<p><strong>Matteboxen</strong> är en matematisk uträkning bestående av en eller flera rader. Om varje rad är en ekvation så
kommer matteboxen se till att likhetstecknena på de olika raderna ligger i en lodrät linje, så att det blir lättare att
se vad som händer i höger- respektive vänsterledet.</p>
<p>I framtiden är det tänkt att du via knappar ska få hjälp att skriva in mer avancerade matematik, men i dagsläget måste du
skriva in speciella kommandon. Här är en lista över de vanligaste! Notera att varje kommando måste avslutas med ett
mellanslag.</p>
<ul>
    <li><strong>Kvadratrot</strong> skrivs med <code>\sqrt</code>: <Mathbox data="\sqrt 3 x"/></li>
    <li><strong>Övriga rötter</strong> skrivs med <code>\nthroot</code>: <Mathbox data="\nthroot 3 x"/></li>
    <li><strong>Pi</strong> skrivs med <code>\pi</code>: <Mathbox data="x+\pi"/></li>
    <li><strong>Plus minus</strong> skrivs med <code>\plusminus</code>: <Mathbox data="x\plusminus 3"/></li>
</ul>
<p>
Du kan lägga till, kopiera, ta bort och flytta rader i en mattebox, precis på samma sätt som du kan göra med boxarna i redovisningen.
</p>
                            </li>
                        </ul>
                    </p>
                </div> : ''}
            </div>
        );
    }
});

module.exports = Home;