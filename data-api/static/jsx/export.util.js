/** @jsx React.DOM */

/**
 * The listener event always reports String objects or undefined
 * Todo: make more generic
 */
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
                            <input type="radio" name="format" value="CSV" defaultChecked />
                        CSV
                        </button>
                        <button className="btn btn-default" onClick={this.handleClick}>
                            <input type="radio" name="format" value="KML" />
                        KML
                        </button>
                        <button className="btn btn-default" onClick={this.handleClick}>
                            <input type="radio" name="format" value="JSON" />
                        JSON
                        </button>
                    </div>
                </div>
            </div>
        </div>;
    }
});


/** dealing with dates:  the dates reflect times in the locale, represented as Moment objects where possible.
 * start times are pegged to the start of the day in local time.
 * end times are pegged to the end of day in local time
 * the listener event always reports Date objects
 */
var DateRangePicker = React.createClass({

    getInitialState: function () {
        return { duration: "1 days" };
    },

    componentDidMount: function () {
        var from = this.from(),
            to = this.to(),
            start = moment().subtract(1, "days").startOf("day"),
            end = moment().endOf("day"),
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
                // selectedDate is "YYYY-MM-DD"
                to.datepicker("option", "minDate", selectedDate);
                that.updateChangeListener(
                    moment(from.datepicker("getDate")),
                    moment(to.datepicker("getDate")).endOf("day")
                );
            }
        });
        from.datepicker("setDate", start.format("YYYY-MM-DD"));

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
                // selectedDate is "YYYY-MM-DD"
                from.datepicker("option", "maxDate", selectedDate);
                that.updateChangeListener(
                    moment(from.datepicker("getDate")),
                    moment(to.datepicker("getDate")).endOf("day")
                );
            }
        });
        to.datepicker("setDate", end.format("YYYY-MM-DD"));
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
        if (!start.isValid() || !end.isValid()) {
            throw "Invalid date types sent to change listener";
        }
        try {
            if (this.props.onChange) {
                this.props.onChange({ "type": "daterange", "value": {"from": start.toDate(), "to": end.toDate()}, "cause": cause})
            }
        } catch (e) {
            console.error(e);
        }
    },

    handleClick: function (e) {
        var newValue = e.currentTarget.querySelector('input').value;
        this.setState({duration: newValue}, function () {
            var disabled = this.state.duration !== "custom",
                fromMoment = moment().subtract(this.state.duration.split(' ')[0], "days").startOf("day"),
                toMoment = moment().endOf("day"),
                fromWidget = this.from(),
                toWidget = this.to();

            fromWidget.datepicker("setDate", fromMoment.format("YYYY-MM-DD"));
            toWidget.datepicker("setDate", toMoment.format("YYYY-MM-DD"));

            fromWidget.datepicker("option", "disabled", disabled);
            toWidget.datepicker("option", "disabled", disabled);

            this.updateChangeListener(fromMoment, toMoment, e);
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
        this.setState({ from: e.value.from, to: e.value.to }, function() {
            console.debug("handleDateChange", JSON.stringify(e.value));
        });
    },

    handleFormatChange: function(e) {
        this.setState({ format: e.value}, function() {
            console.debug("handleFormatChange", JSON.stringify(e.value));
        });
    },

    handleSubmit: function (e) {
        var dateFormat = "YYYYMMDDHHmmss",
            url = this.props.url,
            startDate = moment(this.state.from).format(dateFormat),
            endDate = moment(this.state.to).format(dateFormat),
            fileFormat = this.state.format;
            that = this;

        e.preventDefault();
        this.state.devices.forEach(function (deviceId) {
            that.ajaxDownload(url, {device_id: deviceId, start_time: startDate, end_time: endDate, format: fileFormat});
        });
    },

    toDateString: function (date) {
        return date && date.toString ? date.toString() : "n/a";
    },

    ajaxDownload: function (url, data) {
        var iframe,
            iframeDoc,
            iframeHtml;

        if ((iframe = $('#download_iframe')).length === 0) {
            iframe = $("<iframe id='download_iframe'" +
                    " style='display: none' src='about:blank'></iframe>"
            ).appendTo("body");
        }

        iframeDoc = iframe[0].contentWindow || iframe[0].contentDocument;
        if (iframeDoc.document) {
            iframeDoc = iframeDoc.document;
        }

        iframeHtml = "<html><head></head><body><form method='GET' action='" + url +"'>";

        Object.keys(data).forEach(function(key){
            iframeHtml += "<input type='hidden' name='" + key + "' value='" + data[key] + "'>";

        });

        iframeHtml +="</form></body></html>";
        console.log(iframeHtml + Object.keys(data).map(function(x) { return x + "=" + data[x]; }).join('&'));
        iframeDoc.open();
        iframeDoc.write(iframeHtml);
        $(iframeDoc).find('form').submit();
    },

    render: function () {
        return <form className="k-export-form panel panel-default" onSubmit={this.handleSubmit}>
            <div className="panel-body container-fluid">
                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-5">
                        <DateRangePicker onChange={this.handleDateChange}/>
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
            </div>
        </form>;
    }
});


