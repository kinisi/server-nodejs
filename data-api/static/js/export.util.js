/** @jsx React.DOM */


var FormatPicker = React.createClass({

    componentDidMount: function () {
        // enable bootstrap buttons
        $('.btn', this.getDOMNode()).button();
        this.updateChangeListener("csv");
    },

    handleClick: function (e) {
        var newValue = e.currentTarget.querySelector('input').value;
        this.updateChangeListener(newValue, e);
    },

    updateChangeListener: function (newValue, cause) {
        try {
            if (this.props.onChange) {
                this.props.onChange({ "type": "format", "value": newValue, "cause": cause})
            }
        } catch (e) {
            console.error(e);
        }
    },

    render: function () {
        return  <div className="k-format-picker container">
            <div className="row">
                <div className="col-sm-1">
                    <label>Format</label>
                </div>
                <div className="col-sm-5">
                    <div className="btn-group" data-toggle="buttons">
                        <button className="btn btn-default active" onClick={this.handleClick}>
                            <input type="radio" name="format" value="csv" defaultChecked />
                        CSV
                        </button>
                        <button className="btn btn-default" onClick={this.handleClick}>
                            <input type="radio" name="format" value="kml" />
                        KML
                        </button>
                        <button className="btn btn-default" onClick={this.handleClick}>
                            <input type="radio" name="format" value="json" />
                        JSON
                        </button>
                    </div>
                </div>
            </div>
        </div>;
    }
});

var DatePicker = React.createClass({



    getInitialState: function () {
        return { rangeOption: "1 days" };
    },

    componentDidMount: function () {
        var from = this.from(),
            to = this.to(),
            start = moment().subtract(1, "days").toDate(),
            end = moment().toDate(),
            that = this;

        // enable Bootstrap buttons
        $('.btn', this.getDOMNode()).button();

        from.datepicker({
            dateFormat: "yy-mm-dd",
            defaultDate: "-1 day",
            disabled: true,
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onClose: function (selectedDate) {
                to.datepicker("option", "minDate", selectedDate);
                that.updateChangeListener(selectedDate, to.datepicker("getDate"));
            }
        });
        from.datepicker("setDate", start);

        to.datepicker({
            dateFormat: "yy-mm-dd",
            defaultDate: null,
            disabled: true,
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            showButtonPanel: true,
            maxDate: "+1 day",
            onClose: function (selectedDate) {
                from.datepicker("option", "maxDate", selectedDate);
                that.updateChangeListener(from.datepicker("getDate"), selectedDate);
            }
        });
        to.datepicker("setDate", end);
        that.updateChangeListener(start, end);
    },

    componentWillUnmount: function () {
        this.from().datepicker("destroy");
        this.to().datepicker("destroy");
    },

    from: function () {
        return $(this.refs.from.getDOMNode());
    },

    to: function () {
        return $(this.refs.to.getDOMNode());
    },

    updateChangeListener: function (start, end, cause) {
        try {
            if (this.props.onChange) {
                this.props.onChange({ "type": "daterange", "value": {"from": new Date(start), "to": new Date(end)}, "cause": cause})
            }
        } catch (e) {
            console.error(e);
        }
    },

    handleClick: function (e) {
        var newValue = e.currentTarget.querySelector('input').value;
        this.setState({rangeOption: newValue}, function () {
            var disabled = this.state.rangeOption !== "custom",
                fromMoment = moment().subtract(this.state.rangeOption.split(' ')[0], "days"),
                toMoment = moment(),
                fromWidget = this.from(),
                toWidget = this.to();

            fromWidget.datepicker("setDate", fromMoment.toDate());
            toWidget.datepicker("setDate", toMoment.toDate());

            fromWidget.datepicker("option", "disabled", disabled);
            toWidget.datepicker("option", "disabled", disabled);

            this.updateChangeListener(fromMoment.toDate(), toMoment.toDate(), e);
        });
    },

    render: function () {
        return <div className="k-date-picker container">
            <div className="row">
                <div className="col-sm-1">
                    <label>Presets</label>
                </div>
                <div className="btn-group col-sm-5" data-toggle="buttons">
                    <button className="btn btn-default active"  onClick={this.handleClick} >
                        <input type="radio" name="range_opt" value="1 days" defaultChecked />
                    last day
                    </button>
                    <button className="btn btn-default"  onClick={this.handleClick} >
                        <input type="radio" name="range_opt" value="7 days"/>
                    last 7 days
                    </button>
                    <button className="btn btn-default"  onClick={this.handleClick} >
                        <input type="radio" name="range_opt" value="30 days"/>
                    last 30 days
                    </button>
                    <button className="btn btn-default"  onClick={this.handleClick} >
                        <input type="radio" name="range_opt" value="custom"/>
                    Custom
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-11">
                    <label>From
                        <input type="text" ref="from" name="from" className="form-control" />
                    </label>
                    <label>to
                        <input type="text" ref="to" name="to" className="form-control" />
                    </label>
                </div>
            </div>
        </div>;
    }

});


var ExportForm = React.createClass({
    getInitialState: function () {
        return { devices: [], format: "csv", from: null, to: null };
    },

    handleDateChange: function(e) {
        console.log("handleDateChange called");
        this.setState({ from: e.value.from, to: e.value.to }, function() {
            console.log("handleDateChange", JSON.stringify(e.value));
        });
    },

    handleFormatChange: function(e) {
        this.setState({ format: e.value}, function() {
            console.log(e);
        });
    },

    handleSubmit: function (e) {
        console.log("Submit!");
        e.preventDefault();
    },

    toDateString: function (date) {
        return date && date.toString ? date.toString() : "n/a";
    },

    render: function () {
        return <form className="k-export-form panel panel-default" onSubmit={this.handleSubmit}>
            <div className="panel-body container-fluid">
                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-5">
                        <DatePicker onChange={this.handleDateChange}/>
                    </div>
                    <div className="col-md-5">
                        <FormatPicker onChange={this.handleFormatChange}/>
                    </div>
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
                <div className="row">
                    <div className="col-md-1">{this.state.format}</div>
                    <div className="col-md-5">{this.state.devices.join(',')}</div>
                    <div className="col-md-3">{this.toDateString(this.state.from) }</div>
                    <div className="col-md-3">{this.toDateString(this.state.to) }</div>
                </div>
            </div>
        </form>;
    }
});


