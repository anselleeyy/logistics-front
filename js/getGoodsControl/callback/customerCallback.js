layui.use(['layer', 'form', 'element', 'jquery', 'table'], function() {
    let element = layui.element,
        $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        table = layui.table;

    let tableArray = [ '#receiveTable', '#receivedTable' ];
    let tableUrl = [ '/goodsBill/findWait/', '' ];
    let customerCode = $.cookie('loginId');

    refreshTable(0);

    element.on('tab(demo)', function(data){
        if (data.index === 0) {
            refreshTable(0);
        } else {
            table.render({
                elem: tableArray[data.index],
                height: 'full-170',
                url: nginx_url + '/transfer/findCusRes/' + customerCode, //数据接口
                limit: 10,
                limits: [ 10 ],
                request: {
                    pageName: 'pageNum' //页码的参数名称，默认：page
                    ,limitName: 'limit' //每页数据量的参数名，默认：limit
                },
                response: {
                    statusName: 'code', //数据状态的字段名称，默认：code
                    statusCode: 200, //成功的状态码，默认：0
                    msgName: 'msg', //状态信息的字段名称，默认：msgz
                    countName: 'count', //数据总数的字段名称，默认：count
                    dataName: 'data' //数据列表的字段名称，默认：data
                },
                page: true //开启分页
                ,cellMinWidth: 60
                ,cols: [[
                    { title: 'ID', fixed: 'left', type: 'numbers', align: 'center' },
                    { field: 'goodsBillCode', title: '运单号', align: "center", sort: true },
                    { field: 'checkGoodsRecord', title: '验收内容', align: 'center' },
                    { field: 'receiveGoodsDate', title: '收货日期', align: 'center', templet: '#createTime' },
                ]]
            });
        }
    });

    function refreshTable(id) {
        table.render({
            elem: tableArray[id],
            height: 'full-170',
            url: nginx_url + tableUrl[id] + customerCode, //数据接口
            limit: 10,
            limits: [ 10 ],
            request: {
                pageName: 'pageNum' //页码的参数名称，默认：page
                ,limitName: 'limit' //每页数据量的参数名，默认：limit
            },
            response: {
                statusName: 'code', //数据状态的字段名称，默认：code
                statusCode: 200, //成功的状态码，默认：0
                msgName: 'msg', //状态信息的字段名称，默认：msgz
                countName: 'count', //数据总数的字段名称，默认：count
                dataName: 'data' //数据列表的字段名称，默认：data
            },
            page: true //开启分页
            ,cellMinWidth: 60
            ,cols: [[
                { title: 'ID', fixed: 'left', type: 'numbers', align: 'center' },
                { field: 'goodsBillCode', title: '运单号', align: "center", sort: true },
                { field: 'sendGoodsCustomer', title: '发货人', align: 'center' },
                { field: 'sendGoodsAddr', title: '发货地', align: 'center', width: 450 },
                { fixed: 'right', title:"操作", align: "center", toolbar: '#bar', width: 250 }
            ]]
        });
    }

    table.on('tool(billTool)', function(obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        let data = obj.data; //获得当前行数据
        let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        // let tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'confirm') {
            layer.open({
                type: 2,
                title: '货运单 - ' + data.goodsBillCode + ' 中转信息填写',
                content: [ 'confirm.html?billCode=' + data.goodsBillCode, 'no' ],
                area: [ '85%', '85%' ],
                shadeClose: true,
                move: false,
                end: function() {
                    table.reload('receiveTable', {
                        url: nginx_url + tableUrl[0] + customerCode
                    })
                }
            });
        }
    })

});

function createTime(v){
    console.log(v);
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