layui.use(['layer', 'form', 'element', 'jquery', 'table'], function() {
    let element = layui.element,
        $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        table = layui.table;

    let driverId = $.cookie('loginId');

    table.render({
        elem: '#billTable',
        height: 'full-170',
        url: nginx_url + '/transfer/arriveGoods/' + driverId, //数据接口
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
            { field: 'goodsBillCode', title: '货运单编号', align: "center", sort: true },
            { field: 'sendGoodsCustomer', title: '发货客户姓名', align: 'center' },
            { field: 'sendGoodsCustomerTel', title: '发货客户电话', align: 'center' },
            { field: 'receiveGoodsCustomer', title: '收货客户姓名', align: 'center' },
            { field: 'receiveGoodsCustomerTel', title: '收货客户电话', align: 'center' },
            { fixed: 'right', title:"操作", align: "center", toolbar: '#barDemo', width: 250 }
        ]]
    });

    table.on('tool(billTool)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        let data = obj.data; //获得当前行数据
        let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）

        if (layEvent === 'inform') { //填写司机回执并且发出到货通知
            layer.open({
                type: 2,
                title: data.goodsBillCode + '货物回执单填写',
                content: [ 'inform.html?code=' + data.goodsBillCode + '&name=' + data.receiveGoodsCustomer ],
                area: [ '85%', '85%' ],
                shadeClose: true,
                move: false,
                end: function() {
                    table.reload('billTable', {
                        url: nginx_url + '/transfer/arriveGoods/' + driverId
                    })
                }
            });
        } else {

        }
    });

});