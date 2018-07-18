layui.use(['element', 'form', 'laydate', 'jquery', 'layer', 'table'], function() {
    let element = layui.element,
        form = layui.form,
        laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table,
        $ = layui.jquery;

    let goodsRevertBillCode = window.location.href.split("=")[1];
    $.ajax({
        type: "get",
        url: nginx_url + "/vehicle/selectByCode/" + goodsRevertBillCode,
        success: function (result) {
            console.log(result);
            $.each(result, function (i, item) {
                let temp_id = '#' + i;
                $(temp_id).val(item);
            });

            // 日期
            laydate.render({
                elem: '#signTime',
                type: 'date',
                value: new Date(result.signTime)
                // theme: 'grid'
            });
            if (result.startCarryTime != null && result.startCarryTime !== '') {
                laydate.render({
                    elem: '#startCarryTime',
                    type: 'date',
                    value: new Date(result.startCarryTime)
                    // theme: 'grid'
                });
            }
            if (result.arriveTime != null && result.arriveTime !== '') {
                laydate.render({
                    elem: '#arriveTime',
                    type: 'date',
                    value: new Date(result.arriveTime)
                    // theme: 'grid'
                });
            }
        }
    });

    form.on('submit(update)', function () {

        $("#cargoReceiptForm :input").each(function () {
            $(this).removeAttr("disabled");
        });

        $("#arriveTime").attr("disabled", "disabled");

        $.ajax({
            type: 'put',
            url: nginx_url + '/vehicle/update',
            data: $("#cargoReceiptForm").serialize(),
            dataType: "json",
            success: function (result) {
                console.log(result);
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
                        time: 800,
                        icon: 2
                    });
                }
            }

        });
        return false;
    });
    form.on('submit(send)', function () {

        $("#cargoReceiptForm :input").each(function () {
            $(this).removeAttr("disabled");
        });

        $("#arriveTime").attr("disabled", "disabled");

        $.ajax({
            type: 'put',
            url: nginx_url + '/vehicle/submit',
            data: $("#cargoReceiptForm").serialize(),
            dataType: "json",
            success: function (result) {
                console.log(result);
                if (result === "SUCCESS") {
                    layer.msg('发货成功', {
                        time: 800,
                        icon: 1
                    }, function () {
                        let index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.layer.close(index); //再执行关闭
                    });
                } else {
                    layer.msg('发货失败', {
                        time: 800,
                        icon: 2
                    });
                }
            }

        });
        return false;
    });

    lay('.test-item').each(function () {
        laydate.render({
            elem: this,
            trigger: 'click'
        })
    });

});