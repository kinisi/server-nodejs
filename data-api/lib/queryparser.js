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

var sorts = module.exports.sorts = function sorts(v) {
    return tokenize(v).map(function(s) {
        var tokens = tokenize(s, " "), k = tokens[0], dir = tokens[1] || "asc";
        return mysql.escapeId(k) + " " + (dir == "desc" ? "desc" : "asc");
    }).join(",");
};

module.exports.template = function(s, qs) {
    var f = filters(qs.f);
    var c = columns(qs.c) || "*";
    var o = sorts(qs.o);
    f = f ? " where " + f : "";
    o = o ? " order by " + o : "";
    return s.replace(/{{select}}/, c).replace(/{{where}}/, f).replace(/{{order by}}/, o);
}


function tokenize(s, delimeter) {
    delimeter = delimeter || /,/g;
    return ((s && s.split && s.length > 0) ? s.split(delimeter) : []).filter(function(o,i,a){ return i == a.lastIndexOf(o); });
}
