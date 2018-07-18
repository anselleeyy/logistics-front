layui.use(['element', 'form', 'laydate', 'layer', 'table'], function(){
    let element = layui.element,
    form = layui.form,
    laydate = layui.laydate,
    layer = layui.layer,
    table = layui.table;

    let employee = window.location.href.split("=")[2];
    let employeeCode = window.location.href.split("=")[1].split("&")[0];
    $("#employeeCode").val(employeeCode);
    $("#employee").val(decodeURI(employee));
    laydate.render({
        elem: '#date',
        type: 'date',
        value: new Date()
        // theme: 'grid'
    });

    // 员工工资添加
    form.on('submit(addEmployeeWage)', function (data) {
        $.ajax({
            type: "post",
            url: nginx_url + "/check/addWage",
            data: $("#employeeWageForm").serialize(),
            dataType: "json",
            success: function (result) {
                if (result === "SUCCESS") {
                    layer.msg('员工工资添加成功', {
                        time: 800
                    }, function () {
                        let index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.layer.close(index); //再执行关闭
                    });
                    $("#resetForm").click();
                } else {
                    layer.msg('员工工资添加失败', {
                        time: 800
                    });
                }
            }
        });
        return false;
    });

});