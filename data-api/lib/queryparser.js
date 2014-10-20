var mysql = require("mysql");

var columns = module.exports.columns = function columns(v) {
    return (v) ? tokenize(v, ",").map(function(c) { return mysql.escapeId(c); }).join(",") : "*";
};

var filters = module.exports.filters = function filters(v) {
    return tokenize(v, ";").map(function(o,i,a) {
        var tokens = tokenize(o, "|"), k = tokens[0], op = tokens[1], val = tokens[2] || "";
        var sql = mysql.escapeId(k);
        switch(op) {
            case "in": sql += " in (" + mysql.escape(val.split(",")) + ")"; break;
            case "nin": sql += " not in (" + mysql.escape(val.split(",")) + ")"; break;
            case "eq": sql += " = " + mysql.escape(val); break;
            case "ne": sql += " != " + mysql.escape(val); break;
            case "gt": sql += " > " + mysql.escape(val); break;
            case "lt": sql += " < " + mysql.escape(val); break;
            case "gte": sql += " >= " + mysql.escape(val); break;
            case "lte": sql += " <= " + mysql.escape(val); break;
            case "null": sql += " is null"; break;
            case "nnull": sql += " is not null"; break;
            case "starts": sql += " like " + mysql.escape(val + "%"); break;
            case "ends": sql += " like " + mysql.escape("%" + val); break;
            case "like": sql += " like " + mysql.escape("%" + val + "%"); break;
            default: return null;
        }
        return sql;
     }).filter(function(o,i,a) { return o != null; }).join(" and ");
};

var aggregate = module.exports.aggregate = function aggregate(v) {
    return tokenize(v, ";").map(function(o,i,a) {
        var tokens = tokenize(o, "|"), fun = tokens[0], col = tokens[1];
        if ( col != "*" ) {
            col_esc = mysql.escapeId(col);
        } else {
            col_esc = mysql.escape(col);
        }
        var sql = fun + "(" + col + ")";
        return sql;
    }).filter(function(o,i,a) { return o != null; }).join(" and ");
};

var aggregate_cols = module.exports.aggregate_cols = function aggregate_cols(v) {
    return tokenize(v, ";").map(function(o,i,a) {
        var tokens = tokenize(o, "|"), fun = tokens[0], col = tokens[1];
        var sql = mysql.escapeId(col);
        return sql;
    }).join(",");
};

var sorts = module.exports.sorts = function sorts(v) {
    return tokenize(v).map(function(s) {
        var tokens = tokenize(s, " "), k = tokens[0], dir = tokens[1] || "asc";
        return mysql.escapeId(k) + " " + (dir == "desc" ? "desc" : "asc");
    }).join(",");
};

module.exports.template = function(s, qs) {
    var f = filters(qs.f);
    var c = null;
    var G = null;
    if ( ('G' in qs) && (qs.G) ) {
        var _c = columns(qs.c);
        if ( _c && (_c != '*') ) {
            c = aggregate(qs.G) + ',' + _c;
        } else {
            c = aggregate(qs.G);
        }
        G = aggregate_cols(qs.G);
    } else {
        c = columns(qs.c) || "*";
    }
    var o = sorts(qs.o);
    f = f ? " where " + f : "";
    o = o ? " order by " + o : "";
    G = G ? " group by " + G : "";
    var str = s.replace(/{{select}}/, c).replace(/{{where}}/, f).replace(/{{group by}}/, G).replace(/{{order by}}/, o);
    return str;
};


function tokenize(s, delimeter) {
    delimeter = delimeter || /,/g;
    return ((s && s.split && s.length > 0) ? s.split(delimeter) : []).filter(function(o,i,a){ return i == a.lastIndexOf(o); });
}
