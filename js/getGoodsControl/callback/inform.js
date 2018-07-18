layui.use(['layer', 'form', 'element', 'jquery', 'table', 'laydate'], function() {
    let element = layui.element,
        $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate;

    let driverId = $.cookie('loginId');
    let href = window.location.href;
    let goodBillCode = href.split('=')[1].split('&')[0];
    let goodsRevertBillCode;
    $.ajax({
        type: 'get',
        url: nginx_url + '/vehicle/findRevertId/' + goodBillCode,
        dataType: 'json',
        async: false,
        success: function (result) {
            goodsRevertBillCode = result;
        }
    });
    let receiveGoodsLinkman = decodeURI(href.split('=')[2]);

    $.ajax({
        type: 'get',
        url: nginx_url + '/driverInfo/selectById/' + driverId,
        dataType: 'json',
        async: false,
        success: function (result) {
            console.log(result);
            $("#driverName").val(result.driverName);
        }
    });
    $("#goodsRevertCode").val(goodsRevertBillCode);
    $("#receiveGoodsPerson").val(receiveGoodsLinkman);

    laydate.render({
        elem: '#rceiveGoodsDate',
        type: 'date',
        value: new Date()
    });

    form.on('submit(confirm)', function () {
        $("#releaseForm :input").each(function () {
            $(this).removeAttr("disabled");
        });

        $.ajax({
            type: 'post',
            url: nginx_url + '/bill/addArrived/' + goodsRevertBillCode,
            data: $("#releaseForm").serialize(),
            dataType: 'json',
            async: false,
            success: function (result) {
                if (result === 'SUCCESS') {
                    layer.msg('到货通知成功', {
                        time: 800,
                        icon: 1
                    }, function () {
                        let index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.layer.close(index); //再执行关闭
                    })
                } else {
                    layer.msg('到货通知失败', {
                        time: 800,
                        icon: 1
                    });
                }
            }
        });
        return false;
    });
});