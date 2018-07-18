layui.use(['layer', 'form', 'element', 'laydate', 'jquery', 'table'], function() {
    let element = layui.element,
        $ = layui.jquery,
        form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table;

    form.render();

    let driverId = window.location.href.split("=")[1];

    $.ajax({
        type: 'get',
        url: nginx_url + '/driverInfo/selectById/' + driverId,
        dataType: 'json',
        success: function (result) {
            $.each(result, function (i, item) {
                let temp_id = '#' + i;
                $(temp_id).val(item);
            });
            $(":radio[name='gender'][value='" + result.gender + "']").prop("checked", "checked");
            form.render('radio');
            laydate.render({
                elem: '#birthday',
                type: 'date',
                value: new Date(result.birthday)
            });
            if (result.companyCar === true) {
                $("#switchValue").attr("checked", "checked");
            }
            form.render('checkbox');
        }
    })
});