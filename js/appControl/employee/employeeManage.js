layui.use(['element', 'form', 'laydate', 'layer', 'table'], function(){
    let element = layui.element,
    form = layui.form,
    laydate = layui.laydate,
    layer = layui.layer,
    table = layui.table;

    refresh();

    element.on('tab(demo)', function(data){
        if (data.index === 1) {
            table.render({
                elem: '#empTable',
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
                page: true, //开启分页
                cellMinWidth: 80,
                cols: [[
                    { title: 'ID', fixed: 'left', sort: true, type: 'numbers' },
                    { field: 'employeeCode', title: '职员编号', sort: true },
                    { field: 'employeeName', title: '职员姓名' },
                    { field: 'department', title: '部门', sort: true },
                    { field: 'position', title: '职位' },
                    { field: 'gender', title: '性别' },
                    { field: 'birthday', title: '出生日期', templet: '#createTime' },
                    { fixed: 'right', title:"操作", align:"center", toolbar: '#barDemo' }
                ]]
            });

            // 监听工具条
            table.on('tool(empTool)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
                let data = obj.data; //获得当前行数据
                let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                // let tr = obj.tr; //获得当前行 tr 的DOM对象

                if(layEvent === 'del'){ //删除
                    layer.confirm('真的删除么', function(index){
                        obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                        layer.close(index);
                        //向服务端发送删除指令
                        $.ajax({
                            type: "DELETE",
                            url: nginx_url + "/deleteEmp/" + data.employeeCode,
                            success: function (result) {
                                console.log(result);
                            }

                        });
                        layer.msg('删除成功', {
                            time: 800
                        });
                        table.reload('empTable', {
                            url: nginx_url + '/selectAllEmp'
                        })
                    });
                } else if(layEvent === 'edit'){ //编辑
                    layer.open({
                        type: 2,
                        title: '职员信息修改',
                        content: ['employeeModify.html?employeeCode=' + data.employeeCode, 'no'],
                        area: ['75%', '75%'],
                        shadeClose: true,
                        move: false,
                        end: function() {
                            table.reload('empTable', {
                                url: nginx_url + '/selectAllEmp'
                            })
                        }
                    });
                }
            });
        }
    });

    laydate.render({
        elem: '#birthday',
        type: 'date',
        theme: '#393D49'
    });
    form.on('switch(checkCondition)', function(data){
        if (data.elem.checked === true) {
            $("#condition").val(1);
        } else {
            $("#condition").val(0);
        }
        // form.render();
    });
    // 职员信息添加
    form.on('submit(addEmp)', function (data) {
        $.ajax({
            type: "post",
            url: nginx_url + "/addEmp",
            data: $("#empForm").serialize(),
            dataType: "json",
            success: function (result) {
                if (result === "SUCCESS") {
                    layer.msg('职员添加成功', {
                        time: 800
                    });
                    $("#resetForm").click();
                } else {
                    layer.msg('职员添加失败', {
                        time: 800
                    });
                }
            }
        });
        return false;
    });

    function refresh() {
        $.ajax({
            type: "get",
            url: nginx_url + "/selectAllUserFroup",
            success: function (result) {
                console.log(result);
                $.each(result, function(i, item) {
                    if (item.groupName !== '客户组' && item.groupName !== '司机组') {
                        let option = "<option value='" + item.groupName + "'>";
                        option += item.groupName;
                        option += "</option>";
                        $("#department").append(option);
                    }
                    form.render();
                });

            }
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





