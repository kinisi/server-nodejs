/**
 * dashboard construction
 * depends on jquery, react, bootstrap
 */

var oauth_token = null;
var userid = null;

function initialize() {
    var qs = location.search.slice(1).split("&").reduce(function(p,c) { c.split("=").every(function(k,i,a) { p[k] = a[i+1]; }); return p; }, {});

    oauth_token = qs['token'];
    userid = qs['userid'];

    //$('#image_download').append($('<a>').prop({'href':'/download/rpi-image?userid='+userid+'&oauth_token='+oauth_token}).text('Download your rPi image here'));


    var to = setTimeout(function() {
        var url = "/table/device_configuration?oauth_token=" + oauth_token + "&userid=" + userid + "&c=api_token_id,device_id&f=api_token_id|eq|" + userid + "&o=device_id&limit=100"; // + QUERY_LIMIT;

        $.getJSON(url, function(data) {
            $("#loading").hide();
            makeDeviceTable(data);
        }).complete(function() { to = null; });
    }, 10);

}

function makeDeviceTable(data) {

    var DEVICE_ID = "kinisi-device-id";

    $('<tr>').append(
        $('<th>').text('Device ID (view map)'),
        $('<th>').text('Last Measurement'),
        $('<th>').text('Last Receive'),
        $('<th>').text('Num Loc Entries'),
        $('<th>').text('MAC wlan'),
        $('<th>').text('MAC eth'),
        $('<th>').append(
            $('<button>').prop({'class': 'btn btn-primary btn-xs', id: 'export_panel_button', 'disabled': true }).append(
                $('<span>').text('Export '),
                $('<span>').prop({'class': 'glyphicon glyphicon-export'})
            )
        )
    ).appendTo('#device_table');


    $.each(data, function(i, item) {
        var $tr = $('<tr>').append(
            $('<td>').append($('<a>').prop({'href':'/static/testmap-osm.html?userid='+userid+'&token='+oauth_token+'&device_id='+item.device_id}).text(item.device_id)),
            $('<td>').prop({'id': item.device_id+'_measure'}),
            $('<td>').prop({'id': item.device_id+'_receive'}),
            $('<td>').prop({'id': item.device_id+'_entries'}),
            $('<td>').prop({'id': item.device_id+'_wlan'}),
            $('<td>').prop({'id': item.device_id+'_eth'}),
            $('<td>').prop({'id': item.device_id+'_export'}).append(
                $('<input>').prop({type: 'checkbox', 'class': 'export'})
                    .data(DEVICE_ID, item.device_id))
        ).appendTo('#device_table');
    });

    $.each(data, function(i, item) {
        var url = "/table/device_location?oauth_token=" + oauth_token + "&userid=" + userid + "&c=measure_time&f=device_id|eq|" + item.device_id + "&o=measure_time%20desc&limit=1";
        $.getJSON(url, function(data) {
            var cell_text;
            if (data && data[0] && ("measure_time" in data[0])) {
                cell_text = data[0].measure_time;
            } else {
                cell_text = "No data";
            }
            $('#'+item.device_id+'_measure').text(cell_text);
        }).complete(function() {});
    });

    $.each(data, function(i, item) {
        var url = "/table/device_location?oauth_token=" + oauth_token + "&userid=" + userid + "&c=receive_time&f=device_id|eq|" + item.device_id + "&o=receive_time%20desc&limit=1";
        $.getJSON(url, function(data) {
            var cell_text;
            if (data && data[0] && ("receive_time" in data[0])) {
                cell_text = data[0].receive_time;
            } else {
                cell_text = "No data";
            }
            $('#'+item.device_id+'_receive').text(cell_text);
        }).complete(function() {});
    });

    $.each(data, function(i, item) {
        //var url = "/table/device_interface?oauth_token=" + oauth_token + "&userid=" + userid + "&c=address&f=device_id|eq|" + item.device_id + ";name|like|eth&o=address&limit=1";
        var url = "/table/device_location?oauth_token=" + oauth_token + "&userid=" + userid + "&f=device_id|eq|" + item.device_id + ";latitude|nnull;longitude|nnull&G=count|device_id";
        $.getJSON(url, function(data) {
            var cell_text;
            if (data && data[0] && ("count(device_id)" in data[0])) {
                cell_text = data[0]["count(device_id)"];
            } else {
                cell_text = "No data";
            }
            $('#'+item.device_id+'_entries').text(cell_text);
        }).complete(function() {});
    });

    $.each(data, function(i, item) {
        var url = "/table/device_interface?oauth_token=" + oauth_token + "&userid=" + userid + "&c=address&f=device_id|eq|" + item.device_id + ";name|like|wlan&o=address&limit=1";
        $.getJSON(url, function(data) {
            var cell_text;
            if (data && data[0] && ("address" in data[0])) {
                cell_text = data[0].address;
            } else {
                cell_text = "No data";
            }
            $('#'+item.device_id+'_wlan').text(cell_text);
        }).complete(function() {});
    });

    $.each(data, function(i, item) {
        var url = "/table/device_interface?oauth_token=" + oauth_token + "&userid=" + userid + "&c=address&f=device_id|eq|" + item.device_id + ";name|like|eth&o=address&limit=1";
        $.getJSON(url, function(data) {
            var cell_text;
            if (data && data[0] && ("address" in data[0])) {
                cell_text = data[0].address;
            } else {
                cell_text = "No data";
            }
            $('#'+item.device_id+'_eth').text(cell_text);
        }).complete(function() {});
    });

    // export panel
    var formUrl = "https://api.kinisi.cc/geoserver/api/export?api_token=" + oauth_token;
    var exportBox = React.renderComponent(ExportForm({id: "export_form", action: "Submit", url: formUrl}), $('#export_panel').get(0));

    function enableExportView() {
        var checked = $(":checkbox.export").filter(function(i, elem) {
            return elem.checked;
        }).map(function(i, elem) {
            return $(elem).data(DEVICE_ID);
        });
        var checkedForAny = checked.length > 0;
        $("#export_panel_button").attr("disabled", !checkedForAny && $("#export_panel").hasClass("hidden") );
        return checked;
    }

    $("#export_panel_button").click(function(e) {
        e.preventDefault();
        $("#export_panel").toggleClass("hidden");
        enableExportView();
    });

    $(":checkbox.export").change(function() {
        var checked = enableExportView();
        exportBox.setState({"devices": checked.get()});
    });

}

