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
                <label className="btn btn-default active">
                    <input type="radio" name="format" value="csv" defaultChecked /> CSV
                </label>
                <label className="btn btn-default">
                    <input type="radio" name="format" value="kml" /> KML
                </label>
                <label className="btn btn-default">
                    <input type="radio" name="format" value="json" /> JSON
                </label>
            </div></div>
        </div></div>;
    }
});

var DatePicker = React.createClass({

    getIntialState: function() {
        return { rangeOption: "1 day" };
    },

    componentDidMount: function() {
        var component = this,
            from = "#" + this.props.name + "-from",
            to = "#" + this.props.name + "-to",
            node = this.getDOMNode();

        $('.btn', node).button();

        $(from, node).datepicker({
            defaultDate: "-1d",
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function( selectedDate ) {
                $(to, node).datepicker( "option", "minDate", selectedDate);
            }
        });

        $(to, node).datepicker({
            defaultDate: "today",
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function( selectedDate ) {
                $(from, node).datepicker( "option", "maxDate", selectedDate);
            }
        });
    },

    render: function() {
        return <div className="k-date-picker container">
            <div className="row">
                <div className="col-sm-1">
                    <label>Presets</label>
                </div>
                <div className="btn-group col-sm-11" data-toggle="buttons">
                    <label className="btn btn-default active">
                        <input type="radio" name="range_opt" value="1 day" defaultChecked />1 day
                    </label>
                    <label className="btn btn-default">
                        <input type="radio" name="range_opt" value="7 days"/>7 days
                    </label>
                    <label className="btn btn-default">
                        <input type="radio" name="range_opt" value="30 days"/>30 days
                    </label>
                    <label className="btn btn-default">
                        <input type="radio" name="range_opt" value="custom"/>Custom
                    </label>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-11">
                    <label>From <input type="text" id={this.props.name + "-from"} name="from" className="form-control" />
                    </label>
                    <label>to <input type="text" id={this.props.name + "-to"} name="to" className="form-control" />
                    </label>
                </div>
            </div>

            </div>;
    }
});


var ExportForm = React.createClass({

    handleSubmit: function(e) {
        console.log(e);
        //e.preventDefault();
        //alert(JSON.stringify(e));
    },

    render: function() {
        return <form className="k-export-form panel panel-default" id={this.props.id} onSubmit={this.handleSubmit}>
            <div className="panel-body container-fluid">
                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-5"><DatePicker /></div>
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


