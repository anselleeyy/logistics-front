layui.use(['layer', 'form', 'element', 'jquery', 'table', 'laydate'], function() {
    let element = layui.element,
        $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate;

    let type = decodeURI(window.location.href.split('=')[2]);
    let goodsBillCode = window.location.href.split('=')[1].split('&')[0];

    $.ajax({
        type: 'get',
        url: nginx_url + '/callback/findDetail/' + goodsBillCode + '/' + type,
        dataType: 'json',
        async: false,
        success: function (result) {
            $.each(result, function (i, item) {
                let temp_id = '#' + i;
                $(temp_id).val(item);
            });
            laydate.render({
                elem: '#writeTime',
                value: new Date(result.writeTime)
            })
        }
    })

});