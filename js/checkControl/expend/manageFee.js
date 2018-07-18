layui.use(['element', 'form', 'laydate', 'layer', 'table'], function(){
    let element = layui.element,
    form = layui.form,
    laydate = layui.laydate,
    layer = layui.layer,
    table = layui.table;

    laydate.render({
        elem: '#writeDate',
        type: 'date',
        theme: '#393D49',
        value: new Date()
    });
    laydate.render({
        elem: '#payoutMonth',
        type: 'month',
        theme: '#393D49'
    });

    // 员工工资添加
    form.on('submit(addManageFee)', function (data) {
        $.ajax({
            type: "post",
            url: nginx_url + "/check/addManageFee",
            data: $("#manageFeeForm").serialize(),
            dataType: "json",
            success: function (result) {
                if (result === "SUCCESS") {
                    layer.msg('管理费用添加成功', {
                        time: 800
                    }, function () {
                        let index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.layer.close(index); //再执行关闭
                    });
                    $("#resetForm").click();
                } else {
                    layer.msg('管理费用添加失败', {
                        time: 800
                    });
                }
            }
        });
        return false;
    });

});