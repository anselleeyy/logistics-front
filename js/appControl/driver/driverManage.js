layui.use(['layer', 'form', 'element', 'laydate', 'jquery', 'table'], function() {
    let element = layui.element,
        $ = layui.jquery,
        form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table;
    form.render();

    laydate.render({
        elem: '#birthday',
        type: 'date',
        theme: '#393D49'
    });

    form.on('switch(checkCondition)', function (data) {
        if (data.elem.checked === true) {
            $("#companyCar").val(true);
        } else {
            $("#companyCar").val(false);
        }
    });

    form.on('submit(addDriver)', function () {
        $.ajax({
            type: 'post',
            url: nginx_url + '/driverInfo/add',
            data: $("#driverForm").serialize(),
            dataType: 'json',
            success: function (result) {
                console.log(result);
                if (result === 'SUCCESS') {
                    layer.msg('司机信息添加成功', {
                        time: 800,
                        icon: 1
                    });
                    $("#resetForm").click();
                } else {
                    layer.msg('司机信息添加失败', {
                        time: 800,
                        icon: 1
                    });
                }
            }
        });
        return false;
    });

    element.on('tab(driverFilter)', function(data){
        if (data.index === 1) {
            table.render({
                elem: '#driverTable',
                height: 'full-170',
                url: nginx_url + '/driverInfo/selectAllByPage', //数据接口
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
                    { title: 'ID', fixed: 'left', sort: true, type: 'numbers', align: 'center' },
                    { field: 'id', title: '司机编号', align: 'center' },
                    { field: 'driverName', title: '司机姓名', align: 'center' },
                    { field: 'phone', title: '电话', align: 'center' },
                    { field: 'state', title: '状态', align: 'center' },
                    { field: 'carNo', title: '车号', align: 'center' },
                    { field: 'carType', title: '车型', align: 'center' },
                    { fixed: 'right', title:"操作", align:"center", toolbar: '#barDemo', width: 200 }
                ]]
            });

            // 监听工具条
            table.on('tool(driverTool)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
                let data = obj.data; //获得当前行数据
                let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）

                if(layEvent === 'del'){ //删除
                    layer.confirm('真的删除么', function(){
                        // obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                        // layer.close(index);
                        //向服务端发送删除指令
                        $.ajax({
                            type: "DELETE",
                            url: nginx_url + "/driverInfo/delete/" + data.id,
                            async: false,
                            dataType: 'json',
                            success: function (result) {
                                console.log(result);
                                if (result === 'SUCCESS') {
                                    layer.msg('删除成功', {
                                        time: 800,
                                        icon: 1
                                    });
                                } else {
                                    layer.msg('删除失败', {
                                        time: 800,
                                        icon: 5
                                    });
                                }
                            }
                        });
                        table.reload('driverTable', {
                            url: nginx_url + '/driverInfo/selectAllByPage'
                        });
                    });

                } else if(layEvent === 'edit'){ //编辑
                    layer.open({
                        type: 2,
                        title: '司机 - ' + data.id + '信息修改',
                        content: ['driverModify.html?id=' + data.id, 'no'],
                        area: ['95%', '95%'],
                        shadeClose: true,
                        move: false,
                        end: function() {
                            table.reload('driverTable', {
                                url: nginx_url + '/driverInfo/selectAllByPage'
                            })
                        }
                    });
                } else if(layEvent === 'detail') {
                    layer.open({
                        type: 2,
                        title: '司机 - ' + data.id + ' 信息详情',
                        content: [ 'driverDetail.html?id=' + data.id, 'no' ],
                        area: [ '95%', '95%' ],
                        shadeClose: true,
                        move: false
                    });
                }
            });
        }
    });

});