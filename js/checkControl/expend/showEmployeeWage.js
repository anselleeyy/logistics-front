layui.use(['element', 'form', 'laydate', 'layer', 'table'], function(){
    let element = layui.element,
    form = layui.form,
    laydate = layui.laydate,
    layer = layui.layer,
    table = layui.table;

    let employeeCode = window.location.href.split("=")[1];
    $.ajax({
        type: "get",
        url: nginx_url + "/check/findWage/" + employeeCode,
        async: false,
        success: function (result) {
            $.each(result, function (i, item) {
                let temp_id = '#' + i;
                $(temp_id).val(item);
            });
            if (result.date != null && result.date !== '') {
                laydate.render({
                    elem: '#date',
                    type: 'date',
                    value: new Date(result.date)
                    // theme: 'grid'
                });
            }
        }


    });

});