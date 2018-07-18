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
        async: false,
        success: function (result) {
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

});