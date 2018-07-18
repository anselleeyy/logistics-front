layui.use(['element', 'form', 'laydate', 'layer', 'table', 'jquery'], function(){
    let element = layui.element,
    form = layui.form,
    laydate = layui.laydate,
    layer = layui.layer,
    table = layui.table,
    $ = layui.jquery;

    $(function () {
        refreshTable();
    });

    element.on('tab(demo)', function(data){
        if (data.index === 0) {

            refreshTable();

        } else if (data.index === 1) {
            table.render({
                elem: '#lineOverallTable',
                height: 'full-170',
                url: nginx_url + '/monitor/printLineOverall', //数据接口
                limit: 10,
                limits: [ 10 ],
                request: {
                    pageName: 'pageNum', //页码的参数名称，默认：page
                    limitName: 'limit' //每页数据量的参数名，默认：limit
                },
                response: {
                    statusName: 'code', //数据状态的字段名称，默认：code
                    statusCode: 200, //成功的状态码，默认：0
                    msgName: 'msg', //状态信息的字段名称，默认：msg
                    countName: 'count', //数据总数的字段名称，默认：count
                    dataName: 'data' //数据列表的字段名称，默认：data
                },
                page: true, //开启分页
                cellMinWidth: 80,
                cols: [[
                    { title: 'ID', fixed: 'left', sort: true, type: 'numbers' },
                    { field: 'loadStation', title: '装货地点', sort: true },
                    { field: 'dealGoodsStation', title: '交货地点' },
                    { field: 'allCarriageTotal', title: '总运费总计', sort: true },
                    { field: 'insuranceTotal', title: '保险费总计' },
                    { field: 'times', title: '次数' }
                ]]
            });
        } else if (data.index === 2) {
            table.render({
                elem: '#driverAmountTable',
                height: 'full-170',
                url: nginx_url + '/monitor/selectDriAcount', //数据接口
                limit: 10,
                limits: [ 10 ],
                request: {
                    pageName: 'pageNum', //页码的参数名称，默认：page
                    limitName: 'limit' //每页数据量的参数名，默认：limit
                },
                response: {
                    statusName: 'code', //数据状态的字段名称，默认：code
                    statusCode: 200, //成功的状态码，默认：0
                    msgName: 'msg', //状态信息的字段名称，默认：msg
                    countName: 'count', //数据总数的字段名称，默认：count
                    dataName: 'data' //数据列表的字段名称，默认：data
                },
                page: true, //开启分页
                cellMinWidth: 80,
                cols: [[
                    { title: 'ID', fixed: 'left', sort: true, type: 'numbers' },
                    { field: 'driverCode', title: '司机编号', sort: true },
                    { field: 'carryFeeTotal', title: '承运费总计' },
                    { field: 'addCarriageTotal', title: '加运费总计' },
                    { field: 'total', title: '总计' }
                ]]
            });
        } else if (data.index === 3) {
            table.render({
                elem: '#carCostTable',
                height: 'full-170',
                url: nginx_url + '/monitor/printCar', //数据接口
                limit: 10,
                limits: [ 10 ],
                request: {
                    pageName: 'pageNum', //页码的参数名称，默认：page
                    limitName: 'limit' //每页数据量的参数名，默认：limit
                },
                response: {
                    statusName: 'code', //数据状态的字段名称，默认：code
                    statusCode: 200, //成功的状态码，默认：0
                    msgName: 'msg', //状态信息的字段名称，默认：msg
                    countName: 'count', //数据总数的字段名称，默认：count
                    dataName: 'data' //数据列表的字段名称，默认：data
                },
                page: true, //开启分页
                cellMinWidth: 80,
                cols: [[
                    { title: 'ID', fixed: 'left', sort: true, type: 'numbers' },
                    { field: 'driverName', title: '司机名称', sort: true },
                    { field: 'carNo', title: '车号' },
                    { field: 'allowCarryWeight', title: '准载重量' },
                    { field: 'carWidth', title: '车厢宽度' },
                    { title: '操作', toolbar: '#bardemo1', fixed: 'right' }
                ]]
            });
        } else {
            table.render({
                elem: '#contactsServiceTable',
                height: 'full-170',
                url: nginx_url + '/monitor/printContactsService', //数据接口
                limit: 10,
                limits: [ 10 ],
                request: {
                    pageName: 'pageNum', //页码的参数名称，默认：page
                    limitName: 'limit' //每页数据量的参数名，默认：limit
                },
                response: {
                    statusName: 'code', //数据状态的字段名称，默认：code
                    statusCode: 200, //成功的状态码，默认：0
                    msgName: 'msg', //状态信息的字段名称，默认：msg
                    countName: 'count', //数据总数的字段名称，默认：count
                    dataName: 'data' //数据列表的字段名称，默认：data
                },
                page: true, //开启分页
                cellMinWidth: 80,
                cols: [[
                    { title: 'ID', fixed: 'left', sort: true, type: 'numbers' },
                    { field: 'sendGoodsCustomer', title: '发货客户' },
                    { field: 'goodsBillCode', title: '货运单编号' },
                    { field: 'billMoney', title: '本单金额' },
                    { title: '操作', toolbar: '#barDemo2', fixed: 'right' }
                ]]
            });
        }
    });

    // 监听工具条
    table.on('tool(carCostTool)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        let data = obj.data; //获得当前行数据
        let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        // let tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'detail') {
            layer.open({
                type: 2,
                title: '车辆成本详细信息',
                content: ['vehicle.html?driverCode=' + data.driverCode ],
                area: ['85%', '85%'],
                shadeClose: true,
                move: false,
            });
        }
    });

    table.on('tool(contactsServiceTool)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        let data = obj.data; //获得当前行数据
        let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        // let tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'detail') {
            layer.open({
                type: 2,
                title: '往来业务详细信息',
                content: ['contacts.html?goodsBillCode=' + data.goodsBillCode ],
                area: ['85%', '85%'],
                shadeClose: true,
                move: false,
            });
        }
    });


    function refreshTable() {
        table.render({
            elem: '#customerAmountTable',
            height: 'full-170',
            url: nginx_url + '/monitor/selectCusAcount', //数据接口
            limit: 10,
            limits: [ 10 ],
            request: {
                pageName: 'pageNum', //页码的参数名称，默认：page
                limitName: 'limit' //每页数据量的参数名，默认：limit
            },
            response: {
                statusName: 'code', //数据状态的字段名称，默认：code
                statusCode: 200, //成功的状态码，默认：0
                msgName: 'msg', //状态信息的字段名称，默认：msg
                countName: 'count', //数据总数的字段名称，默认：count
                dataName: 'data' //数据列表的字段名称，默认：data
            },
            page: true //开启分页
            ,cellMinWidth: 80
            ,cols: [[
                { title: 'ID', fixed: 'left', sort: true, type: 'numbers' },
                { field: 'sendGoodsCustomer', title: '发货客户', sort: true },
                { field: 'carriageTotal', title: '运费总计'},
                { field: 'insuranceTotal', title: '保险费总计' },
                { field: 'pieceAmountTotal', title: '件数总计' }
            ]]
        });
    }

});
