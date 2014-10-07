/** @jsx React.DOM */


var FormatPicker = React.createClass({

    componentDidMount: function() {
        $('.btn', this.getDOMNode()).button();
    },

    render: function() {
        return  <div className="k-format-picker container">
           <div className="row">
            <div className="col-sm-1"><label>Format</label></div>
            <div className="col-sm-11">
            <div className="btn-group" data-toggle="buttons">
                <button className="btn btn-default active">
                    <input type="radio" name="format" value="csv" defaultChecked /> CSV
                </button>
                <button className="btn btn-default">
                    <input type="radio" name="format" value="kml" /> KML
                </button>
                <button className="btn btn-default">
                    <input type="radio" name="format" value="json" /> JSON
                </button>
            </div></div>
        </div></div>;
    }
});

var DatePicker = React.createClass({

    from: function() {
        return $( "#" + this.props.id + "_from", this.getDOMNode() );
    },

    to: function() {
        return $( "#" + this.props.id + "_to", this.getDOMNode() ); 
    },

    getInitialState: function() {
        return { rangeOption: "1 days" };
    },

    componentDidMount: function() {
        var from = this.from(),
            to = this.to();

        $('.btn', this.getDOMNode()).button();

        from.datepicker({
            dateFormat: "yy-mm-dd",
            defaultDate: "-1 day",
            disabled: true,
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onClose: function(selectedDate) {
                to.datepicker("option", "minDate", selectedDate);
            }
        });
        from.datepicker("setDate", moment().subtract(1, "days").startOf("day").toDate());

        to.datepicker({
            dateFormat: "yy-mm-dd",
            defaultDate: null,
            disabled: true,
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            showButtonPanel: true,
            onClose: function(selectedDate) {
                from.datepicker("option", "maxDate", selectedDate);
            }
        });
        to.datepicker("setDate", moment().endOf("day").toDate());
    },

    componentWillUnmount: function() {      
        this.from().datepicker("destroy");
        this.to().datepicker("destroy");
    },

    render: function() {
        return <div className="k-date-picker container">
            <div className="row">
                <div className="col-sm-1">
                    <label>Presets</label>
                </div>
                <div className="btn-group col-sm-11" data-toggle="buttons">
                    <button className="btn btn-default active"  onClick={this.handleClick} >
                        <input type="radio" name="range_opt" value="1 days" defaultChecked />last day
                    </button>
                    <button className="btn btn-default"  onClick={this.handleClick} >
                        <input type="radio" name="range_opt" value="7 days"/>last 7 days
                    </button>
                    <button className="btn btn-default"  onClick={this.handleClick} >
                        <input type="radio" name="range_opt" value="30 days"/>last 30 days
                    </button>
                    <button className="btn btn-default"  onClick={this.handleClick} >
                        <input type="radio" name="range_opt" value="custom"/>Custom
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-11">
                    <label>From <input type="text" id={this.props.id + "_from"} name="from" className="form-control" />
                    </label>
                    <label>to <input type="text" id={this.props.id + "_to"} name="to" className="form-control" />
                    </label>
                </div>
            </div>

            </div>;
    },

    handleClick: function(e) {
        var newValue = e.currentTarget.querySelector('input').value;
        this.setState( {rangeOption: newValue}, function(){

            var disabled = this.state.rangeOption !== "custom",
                fromMmnt = moment().subtract(this.state.rangeOption.split(' ')[0], "days").startOf("day");
                toMmnt = moment().endOf("day"),
                fromWidget = this.from(),
                toWidget = this.to();

                fromWidget.datepicker("setDate", fromMmnt.toDate());                
                fromWidget.datepicker("option", { "disabled": disabled });
                toWidget.datepicker("setDate", toMmnt.toDate()); 
                toWidget.datepicker("option", { "disabled": disabled }); 
        });
    }
});


var ExportForm = React.createClass({
    getInitialState: function() {
        return { devices: [] };
    },
    
    handleSubmit: function(e) {
        console.log("Submit!", this.state.devices, e.nativeEvent.path);
        e.preventDefault();
    },

    render: function() {
        return <form className="k-export-form panel panel-default" onSubmit={this.handleSubmit}>
            <div className="panel-body container-fluid">
                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-5"><DatePicker id={ (this.props.id | 'export_form_') + "_picker"} /></div>
                    <div className="col-md-5"><FormatPicker /></div>
                </div>
                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-10">
                    <hr/>
                    <button type="submit" className="btn btn-primary btn-default">
                        <span>{this.props.action} </span>
                        <span className="glyphicon glyphicon-export"></span>
                    </button>
                    </div>
                </div>
            </div>
        </form>;
    }
});


