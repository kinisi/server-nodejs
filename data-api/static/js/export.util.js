/** @jsx React.DOM */


var FormatPicker = React.createClass({
    componentDidMount: function() {
        $('.btn', this.getDOMNode()).button();
    },
    
    render: function() {
        return <div className="btn-group" data-toggle="buttons">
            <label className="btn btn-default active">
                <input type="radio" name="format_options" id="option_csv" defaultChecked /> CSV
            </label>
            <label className="btn btn-default">
                <input type="radio" name="format_options" id="option_kml" /> KML
            </label>
        </div>;
    }
});

var DatePicker = React.createClass({
    componentDidMount: function() {        
        var from = "#" + this.props.name + "-from",
            to = "#" + this.props.name + "-to",
            node = this.getDOMNode();

        $('.btn', node).button();
        
        $(from, node).datepicker({
            defaultDate: "-1w",
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function( selectedDate ) {
                $(to, node).datepicker( "option", "minDate", selectedDate );
            }
        });

        $(to, node).datepicker({
            defaultDate: "today",
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function( selectedDate ) {
                $(from, node).datepicker( "option", "maxDate", selectedDate );
            }
        });
    },

    render: function() {
        return <div>
   
         Presets: 
         <div className="btn-group" data-toggle="buttons">
            <label className="btn btn-default active">
                <input type="radio" name="range_options" id="option1" defaultChecked /> 1 day
            </label>
            <label className="btn btn-default">
                <input type="radio" name="range_options" id="option2" /> 1 week 
            </label>
            <label className="btn btn-default">
                <input type="radio" name="range_options" id="option3" /> 1 month 
            </label>

        </div>
        <div>
        <label htmlFor={this.props.name + "-from"}>From</label>
        <input type="text" id={this.props.name + "-from"} name="from" className="form-control"/>
        <label htmlFor={this.props.name + "-to"}>to</label>
        <input type="text" id={this.props.name + "-to"} name="to" className="form-control"/>
        </div>
        </div>;
    }
});

var DeviceList = React.createClass({
    render: function() {
        return <div>DeviceList</div>;
    }
});


var ExportBox = React.createClass({
    render: function() {
        return <div>
    <DatePicker />
    <hr/>
    <FormatPicker />
    <DeviceList />
    <hr/>
    <button className="btn btn-primary btn-default"> 
        <span>{this.props.action} </span> 
        <span className="glyphicon glyphicon-export"></span>
    </button></div>;
    }
});


