/**
 * dashboard construction
 * depends on jquery, react, bootstrap
 */

function initialize(userid, oauthToken, apiToken) {
    var url = "/table/device_configuration?oauth_token=" + oauthToken + "&userid=" + userid +
        "&c=api_token_id,device_id&f=api_token_id|eq|" + userid + "&o=device_id&limit=100"; // + QUERY_LIMIT;

    var to = setTimeout(function() {
        $.getJSON(url, function(data) {
            $("#loading").hide();
            makeDeviceTable(data, userid, oauthToken, apiToken);
        }).complete(function() { to = null; });
    }, 10);
}

// currently disabled
function createImageDownload(userid, oauthToken) {
    $('#image_download').append($('<a>').prop({
        'href':'/download/rpi-image?userid=' + userid + '&oauth_token=' + oauthToken})
        .text('Download your rPi image here'));
}

function makeDeviceTable(data, userid, oauthToken, apiToken) {
    var DEVICE_ID_TAG = "kinisi-device-id";

    $('<tr>').append(
        $('<th>').text('Device Name'),
        $('<th>').text('Map Link ').append($('<span>').prop({'class': 'glyphicon glyphicon-globe'})),
        $('<th>').text('Last Measurement'),
        $('<th>').text('Last Receive'),
        $('<th>').text('Location Entries'),
        $('<th>').text('MAC WLAN address'),
        $('<th>').text('MAC ethernet address'),
        $('<th>').append(
            // attach disabled export button, enable on checking a device
            $('<button>').prop({'class': 'btn btn-primary btn-xs', id: 'export_panel_button', disabled: true })
                .append(
                    $('<span>').text('Export '),
                    $('<span>').prop({'class': 'glyphicon glyphicon-export'})
            )
        )
    ).appendTo('#device_table');


    $.each(data, function(i, item) {
        var $tr = $('<tr>').append(
            $('<td>').text('Device ' + (i + 1)),
            $('<td>').append(
                $('<a>').prop({ 'href':'/static/testmap-osm.html?userid=' + userid + '&token=' + oauthToken +
                    '&device_id=' + item.device_id}).append($('<span>').prop({'class': 'glyphicon glyphicon-map-marker'}))),
            $('<td>').prop({'id': item.device_id+'_measure'}),
            $('<td>').prop({'id': item.device_id+'_receive'}),
            $('<td>').prop({'id': item.device_id+'_entries'}),
            $('<td>').prop({'id': item.device_id+'_wlan'}),
            $('<td>').prop({'id': item.device_id+'_eth'}),
            $('<td>').prop({'id': item.device_id+'_export'}).append(
                $('<input>').prop({type: 'checkbox', 'class': 'export'})
                    .data(DEVICE_ID_TAG, item.device_id))
        ).appendTo('#device_table');
    });

    $.each(data, function(i, item) {
        var url = "/table/device_location?oauth_token=" + oauthToken + "&userid=" + userid + "&c=measure_time&f=device_id|eq|" + item.device_id + "&o=measure_time%20desc&limit=1";
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
        var url = "/table/device_location?oauth_token=" + oauthToken + "&userid=" + userid + "&c=receive_time&f=device_id|eq|" + item.device_id + "&o=receive_time%20desc&limit=1";
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
        //var url = "/table/device_interface?oauth_token=" + oauthToken + "&userid=" + userid + "&c=address&f=device_id|eq|" + item.device_id + ";name|like|eth&o=address&limit=1";
        var url = "/table/device_location?oauth_token=" + oauthToken + "&userid=" + userid + "&f=device_id|eq|" + item.device_id + ";latitude|nnull;longitude|nnull&G=count|device_id";
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
        var url = "/table/device_interface?oauth_token=" + oauthToken + "&userid=" + userid + "&c=address&f=device_id|eq|" + item.device_id + ";name|like|wlan&o=address&limit=1";
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
        var url = "/table/device_interface?oauth_token=" + oauthToken + "&userid=" + userid + "&c=address&f=device_id|eq|" + item.device_id + ";name|like|eth&o=address&limit=1";
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
    var formUrl = "https://api.kinisi.cc/geoserver/api/export";
    var exportBox = React.renderComponent(ExportForm({
        id: "export_form",
        action: "Submit",
        url: formUrl,
        api: apiToken
    }), $('#export_panel').get(0));

    function enableExportView() {
        var checked = $(":checkbox.export").filter(function(i, elem) {
            return elem.checked;
        }).map(function(i, elem) {
            return $(elem).data(DEVICE_ID_TAG);
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

