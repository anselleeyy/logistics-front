layui.use(['layer', 'form', 'element', 'jquery', 'table'], function() {
    let element = layui.element,
        $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        table = layui.table;

    table.render({
        elem: '#billTable',
        height: 'full-170',
        url: nginx_url + '/bill/findNotRelease', //数据接口
        limit: 10,
        limits: [ 10 ],
        request: {
            pageName: 'pageNum' //页码的参数名称，默认：page
            ,limitName: 'limit' //每页数据量的参数名，默认：limit
        },
        response: {
            statusName: 'code', //数据状态的字段名称，默认：code
            statusCode: 200, //成功的状态码，默认：0
            msgName: 'msg', //状态信息的字段名称，默认：msg
            countName: 'count', //数据总数的字段名称，默认：count
            dataName: 'data' //数据列表的字段名称，默认：data
        },
        page: true //开启分页
        ,cellMinWidth: 60
        ,cols: [[
            { title: 'ID', fixed: 'left', type: 'numbers', align: 'center' },
            { field: 'billCode', title: '货运单编号', align: "center", sort: true },
            { field: 'billState', title: '单据状态', align: "center", sort: true },
            { field: 'writeDate', title: '填写日期', align: 'center', templet: '#createTime' },
            { fixed: 'right', title:"操作", align: "center", toolbar: '#barDemo', width: 200 }
        ]]
    });

});

function createTime(v){
    let dateTime;
    let date = new Date();
    date.setTime(v);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = date.getDate();
    d = d < 10 ? "0" + d : d;
    dateTime = y + "-" + m + "-" + d;
    return dateTime;
}