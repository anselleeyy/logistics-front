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
        url: nginx_url + "/clear/selectHelpBillClearByCode/" + goodsBillCode,
        async: false,
        success: function (result) {
            console.log(result);
            $.each(result, function (i, item) {
                let temp_id = '#' + i;
                $(temp_id).val(item);
            });
            if (result.balanceTime != null && result.balanceTime !== '') {
                laydate.render({
                    elem: '#balanceTime',
                    type: 'date',
                    value: new Date(result.balanceTime)
                    // theme: 'grid'
                });
            }

        }

    });


});