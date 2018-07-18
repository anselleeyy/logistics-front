layui.use(['element', 'form', 'laydate', 'jquery', 'layer', 'table'], function() {
    let element = layui.element,
        form = layui.form,
        laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table;

    let groupId = window.location.href.split("=")[1];
    $.ajax({
        type: "get",
        url: nginx_url + "/selectGroup/" + groupId,
        success: function (result) {
            $("#groupName").val(result.groupName);
            $("#description").val(result.description);
        }
    });
    
    form.on('submit(modifyGroup)', function () {
        $.ajax({
            type: "PUT",
            url: nginx_url + "/updateDescription/" + groupId,
            data: {
                description: $("#description").val()
            },
            dataType: "json",
            success: function (result) {
                if (result === "SUCCESS") {
                    layer.msg('更新成功', {
                        time: 800,
                        icon: 1
                    }, function () {
                        let index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.layer.close(index); //再执行关闭
                    });
                } else {
                    layer.msg('更新失败', {
                        time: 800
                    }, function () {

                    });
                }
            }
        });
        return false;
    })

});