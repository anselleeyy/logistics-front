layui.use(['element', 'form', 'laydate', 'layer', 'table'], function(){
    let element = layui.element,
    form = layui.form,
    laydate = layui.laydate,
    layer = layui.layer,
    table = layui.table;

    let id = window.location.href.split("=")[1];
    $.ajax({
        type: "get",
        url: nginx_url + "/check/findManageFee/" + id,
        async: false,
        success: function (result) {
            $.each(result, function (i, item) {
                let temp_id = '#' + i;
                $(temp_id).val(item);
            });
            if (result.writeDate != null && result.writeDate !== '') {
                laydate.render({
                    elem: '#writeDate',
                    type: 'date',
                    value: new Date(result.writeDate)
                    // theme: 'grid'
                });
            }
        }


    });

});