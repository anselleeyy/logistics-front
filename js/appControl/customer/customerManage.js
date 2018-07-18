layui.use(['element', 'form', 'laydate', 'layer', 'table'], function(){
    let element = layui.element,
    form = layui.form,
    laydate = layui.laydate,
    layer = layui.layer,
    table = layui.table;

    form.verify({
        fax: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^([0-9]{3,4}-)?[0-9]{7,8}$").test(value)){
                return '传真号码格式不正确';
            }
        },
        postcode: function (value, item) {
            if(!new RegExp("^[0-9]{6}$").test(value)){
                return '邮编格式不正确';
            }
        }
    });


    element.on('tab(demo)', function(data){
        if (data.index === 1) {
            table.render({
                elem: '#cusTable',
                height: 'full-170',
                url: nginx_url + '/selectAllCus', //数据接口
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
                    { field: 'id', title: 'ID', fixed: 'left', sort: true, type: 'numbers' },
                    { field: 'customerCode', title: '客户编号', align: "center", sort: true },
                    { field: 'customer', title: '客户姓名', align: 'center' },
                    { field: 'phone', title: '电话', align: "center" },
                    { field: 'address', title: '地址', align: "center", width: 440 },
                    { field: 'email', title: '电子邮件', align: "center", width: 180 },
                    { fixed: 'right', title:"操作", align: "center", toolbar: '#barDemo', width: 200 }
                ]]
            });

            // 监听工具条
            table.on('tool(cusTool)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
                let data = obj.data; //获得当前行数据
                let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                let tr = obj.tr; //获得当前行 tr 的DOM对象

                if(layEvent === 'del'){ //删除
                    layer.confirm('真的删除么', function(index){
                        obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                        layer.close(index);
                        //向服务端发送删除指令
                        $.ajax({
                            type: "DELETE",
                            url: nginx_url + "/deleteCus/" + data.customerCode,
                            success: function (result) {
                                console.log(result);
                            }
                        });
                        layer.msg('删除成功', {
                            time: 800
                        })
                    });
                } else if(layEvent === 'edit'){ //编辑
                    layer.open({
                        type: 2,
                        title: '客户信息修改',
                        content: [ 'customerModify.html?customerCode=' + data.customerCode, 'no' ],
                        area: [ '85%', '85%' ],
                        shadeClose: true,
                        move: false,
                        end: function() {
                            table.reload('cusTable', {
                                url: nginx_url + '/selectAllCus'
                            })
                        }
                    });
                } else if (layEvent === 'detail') {
                    layer.open({
                        type: 2,
                        title: '客户详细信息',
                        content: [ 'customerDetail.html?customerCode=' + data.customerCode, 'no' ],
                        area: [ '85%', '85%' ],
                        shadeClose: true,
                        move: false,
                    });
                }
            });
        }
    });

    form.on('submit(addCus)', function (data) {
        $.ajax({
            type: "post",
            url: nginx_url + "/addCus",
            data: $("#cusForm").serialize(),
            dataType: "json",
            success: function (result) {
                console.log(result);
                if (result === "SUCCESS") {
                    layer.msg('客户添加成功', {
                        time: 800
                    });
                    $("#resetForm").click();
                } else {
                    layer.msg('客户添加失败', {
                        time: 800
                    });
                }
                console.log(result);
            }
        });
        return false;
    });

});
