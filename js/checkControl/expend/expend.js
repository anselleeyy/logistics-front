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
                elem: '#financeFeeTable',
                height: 'full-170',
                url: nginx_url + '/check/selectFinanceFee', //数据接口
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
                    { field: 'id', title: '财务费用id', sort: true },
                    { field: 'fee', title: '财务费用' },
                    { field: 'payoutMonth', title: '支出月份' },
                    { field: 'writeDate', title: '填写日期', templet: '#createTime' }
                ]]
            });
        } else if (data.index === 2) {
            table.render({
                elem: '#manageFeeTable',
                height: 'full-170',
                url: nginx_url + '/check/selectManageFee', //数据接口
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
                    { field: 'id', title: '管理费用id', sort: true },
                    { field: 'officeFee', title: '办公费' },
                    { field: 'houseRent', title: '房租费' },
                    { field: 'waterElecFee', title: '水电费' },
                    { field: 'phoneFee', title: '电话费' },
                    { field: 'writeDate', title: '填写日期', templet: '#createTime' },
                    { title: '操作', fixed: 'right' , toolbar: '#barDemo2' }
                ]]
            });
        }
    });

    // 监听工具条
    table.on('tool(employeeWageTool)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        let data = obj.data; //获得当前行数据
        let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        // let tr = obj.tr; //获得当前行 tr 的DOM对象

        if(layEvent === 'addWage'){ //编辑
            layer.open({
                type: 2,
                title: '添加职员工资',
                content: [ 'employeeWage.html?employeeCode=' + data.employeeCode + '&name=' + data.employeeName ],
                area: [ '85%', '85%' ],
                shadeClose: true,
                move: false,
                end: function() {
                    table.reload('employeeWageTable', {
                        url: nginx_url + '/selectAllEmp', //数据接口
                    })
                }
            });
        }  else if (layEvent === 'detail') {
            layer.open({
                type: 2,
                title: '职员工资详细信息',
                content: ['showEmployeeWage.html?employeeCode=' + data.employeeCode ],
                area: ['85%', '85%'],
                shadeClose: true,
                move: false,
            });
        }
    });

    table.on('tool(manageFeeTool)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        let data = obj.data; //获得当前行数据
        let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        // let tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'detail') {
            layer.open({
                type: 2,
                title: '管理费用详细信息',
                content: ['showManageFee.html?id=' + data.id ],
                area: ['85%', '85%'],
                shadeClose: true,
                move: false,
            });
        }
    });

    form.on('submit(addFinanceFee)', function () {
        layer.open({
            type: 2,
            title: '添加财务费用',
            content: ['financeFee.html', 'no'],
            area: ['85%', '85%'],
            shadeClose: true,
            move: false,
            end: function() {
                table.reload('financeFeeTable', {
                    url: nginx_url + '/check/selectFinanceFee', //数据接口
                })
            }
        });
        return false;
    });
    form.on('submit(addManageFee)', function () {
        layer.open({
            type: 2,
            title: '添加管理费用',
            content: ['manageFee.html', 'no'],
            area: ['85%', '85%'],
            shadeClose: true,
            move: false,
            end: function() {
                table.reload('manageFeeTable', {
                    url: nginx_url + '/check/selectManageFee'
                })
            }
        });
        return false;
    });


    function refreshTable() {
        table.render({
            elem: '#employeeWageTable',
            height: 'full-170',
            url: nginx_url + '/selectAllEmp', //数据接口
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
                { field: 'employeeCode', title: '职员编号', sort: true },
                { field: 'employeeName', title: '职员姓名'},
                { field: 'department', title: '部门' },
                { field: 'position', title: '职位' },
                { fixed: 'right', title:"操作", align:"center", toolbar: '#barDemo1' }
            ]]
        });
    }

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





