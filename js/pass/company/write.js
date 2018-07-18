layui.use(['element', 'form', 'laydate', 'layer', 'table'], function () {
    let element = layui.element,
        form = layui.form,
        laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table;

    function refreshRegion() {
        $.ajax({
            type: 'get',
            url: nginx_url + '/route/findAllRegions',
            dataType: 'json',
            async: false,
            success: function (result) {
                $.each(result, function (i, item) {
                    let option = '<option value="' + item.city + '">';
                    option += item.city;
                    option += '</option>';
                    $("#city").append(option);
                });
                form.render('select');
            }
        });
    }

    refreshRegion();

    element.on('tab(demo)', function (data) {

        if (data.index === 0) {
            refreshRegion();
        } else {
            table.render({
                elem: '#companyTable',
                height: 'full-170',
                url: nginx_url + '/transfer/findByPage',
                limit: 10,
                limits: [10],
                request: {
                    pageName: 'pageNum' //页码的参数名称，默认：page
                    , limitName: 'limit' //每页数据量的参数名，默认：limit
                },
                response: {
                    statusName: 'code', //数据状态的字段名称，默认：code
                    statusCode: 200, //成功的状态码，默认：0
                    msgName: 'msg', //状态信息的字段名称，默认：msgz
                    countName: 'count', //数据总数的字段名称，默认：count
                    dataName: 'data' //数据列表的字段名称，默认：data
                },
                page: true //开启分页
                , cellMinWidth: 60
                , cols: [[
                    { title: 'ID', fixed: 'left', type: 'numbers', align: 'center' },
                    { field: 'city', title: '所在城市', align: 'center' },
                    { field: 'companyName', title: '公司名称', align: "center" },
                    { field: 'linkPhone', title: '联系方式', align: 'center' },
                    { field: 'detailAddress', title: "公司地址", align: "center", width: 400, fixed: 'right' }
                ]]
            });
        }

        // 监听工具条
    });

    form.on('submit(addCompany)', function () {
        $.ajax({
            type: 'post',
            url: nginx_url + '/transfer/add',
            data: $("#transferComForm").serialize(),
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result === "SUCCESS") {
                    layer.msg('中转公司添加成功', {
                        time: 800,
                        icon: 1
                    });
                    $("#resetForm").click();
                } else {
                    layer.msg('中转公司添加失败', {
                        time: 800,
                        icon: 2
                    });
                }
            }
        });
        return false;
    });
});