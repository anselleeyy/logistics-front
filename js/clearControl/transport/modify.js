layui.use(['element', 'form', 'laydate', 'jquery', 'layer', 'table'], function() {
    let element = layui.element,
        form = layui.form,
        laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table,
        $ = layui.jquery;

    let backBillCode = window.location.href.split("=")[1];
    $.ajax({
        type: "get",
        url: nginx_url + "/clear/selectDriverClearByCode/" + backBillCode,
        async: false,
        success: function (result) {
            $.each(result, function (i, item) {
                let temp_id = '#' + i;
                $(temp_id).val(item);

                if (result.balanceTime != null && result.balanceTime !== '') {
                    laydate.render({
                        elem: '#balanceTime',
                        type: 'date',
                        value: new Date(result.balanceTime)
                        // theme: 'grid'
                    });
                }
            });

        }

    });

    laydate.render({
        elem: '#balanceTime',
        type: 'date'
    });

    form.on('submit(addTransport)', function () {

        $("#transportForm :input").each(function () {
            $(this).removeAttr("disabled");
        });

        $.ajax({
            type: 'put',
            url: nginx_url + '/clear/addDriClear',
            data: $("#transportForm").serialize(),
            dataType: "json",
            success: function (result) {
                console.log(result);
                if (result === "SUCCESS") {
                    layer.msg('结账成功', {
                        time: 800,
                        icon: 1
                    }, function () {
                        let index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.layer.close(index); //再执行关闭
                    });
                } else {
                    layer.msg('结账失败', {
                        time: 800,
                        icon: 2
                    });
                }
            }

        });
        return false;
    });

});