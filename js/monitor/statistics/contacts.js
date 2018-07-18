layui.use(['element', 'form', 'laydate', 'jquery', 'layer', 'table'], function() {
    let element = layui.element,
        form = layui.form,
        laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table,
        $ = layui.jquery;

    let goodsBillCode = window.location.href.split("=")[1];
    $.ajax({
        type: "get",
        url: nginx_url + "/monitor/selectContactsServiceByCode/" + goodsBillCode,
        async: false,
        success: function (result) {
            $.each(result, function (i, item) {
                let temp_id = '#' + i;
                $(temp_id).val(item);
            });
            laydate.render({
                elem: '#sendGoodsDate',
                type: 'date',
                value: new Date(result.sendGoodsDate)
            })
        }

    });

});