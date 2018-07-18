layui.use(['layer', 'form', 'element', 'jquery', 'table'], function() {
    let element = layui.element,
        $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        table = layui.table;

    refresh();

    function refresh() {
        table.render({
            elem: '#billTable',
            height: 'full-170',
            url: nginx_url + '/bill/findNotRelease', //数据接口
            limit: 10,
            limits: [10],
            request: {
                pageName: 'pageNum' //页码的参数名称，默认：page
                , limitName: 'limit' //每页数据量的参数名，默认：limit
            },
            response: {
                statusName: 'code', //数据状态的字段名称，默认：code
                statusCode: 200, //成功的状态码，默认：0
                msgName: 'msg', //状态信息的字段名称，默认：msg
                countName: 'count', //数据总数的字段名称，默认：count
                dataName: 'data' //数据列表的字段名称，默认：data
            },
            page: true //开启分页
            , cellMinWidth: 60
            , cols: [[
                {title: 'ID', fixed: 'left', type: 'numbers', align: 'center'},
                {field: 'billCode', title: '货运单编号', align: "center", sort: true},
                {field: 'writeDate', title: '填写日期', align: 'center', templet: '#createTime'},
                {fixed: 'right', title: "操作", align: "center", toolbar: '#barDemo', width: 200}
            ]]
        });
    }

    element.on('tab(demo)', function(data){
        if (data.index === 0) {
            refresh();
        } else {
            table.render({
                elem: '#billTable1',
                height: 'full-170',
                url: nginx_url + '/bill/findByPage', //数据接口
                limit: 10,
                limits: [ 10 ],
                request: {
                    pageName: 'pageNum' //页码的参数名称，默认：page
                    , limitName: 'limit' //每页数据量的参数名，默认：limit
                },
                response: {
                    statusName: 'code', //数据状态的字段名称，默认：code
                    statusCode: 200, //成功的状态码，默认：0
                    msgName: 'msg', //状态信息的字段名称，默认：msg
                    countName: 'count', //数据总数的字段名称，默认：count
                    dataName: 'data' //数据列表的字段名称，默认：data
                },
                page: true //开启分页
                , cellMinWidth: 60
                , cols: [[
                    { title: 'ID', fixed: 'left', type: 'numbers', align: 'center' },
                    { field: 'billType', title: '单据类型', align: "center", sort: true },
                    { field: 'billCode', title: '单据编号', align: 'center' },
                    { field: 'writeDate', title: '填写日期', align: 'center', templet: '#createTime' }
                ]]
            });
        }
    });

    table.on('tool(billTool)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        let data = obj.data; //获得当前行数据
        let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        // let tr = obj.tr; //获得当前行 tr 的DOM对象

        layer.open({
            type: 2,
            title: '分发单据 - ' + data.billCode,
            content: ['release.html?id=' + data.billCode, 'no'],
            area: ['75%', '75%'],
            shadeClose: true,
            move: false,
            end: function() {
                table.reload('billTable', {
                    url: nginx_url + '/bill/findNotRelease'
                })
            }
        });
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