layui.use([ 'layer', 'form', 'element', 'jquery', 'table', 'laydate' ], function() {
    let element = layui.element,
        $ = layui.jquery,
        layer = layui.layer,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate;

    let customerCode = window.location.href.split('=')[1];

    $.ajax({
        type: 'get',
        url: nginx_url + '/goodsBill/selectByCode/' + customerCode,
        dataType: 'json',
        async: false,
        success: function (result) {
            console.log(result);

            $("#goodsBillCode").val(result.goodsBillCode);
            $("#customer").val(result.receiveGoodsCustomer);
            $("#receiveGoodsPerson").val(result.receiveGoodsCustomerCode);
        }
    });

    laydate.render({
        elem: '#receiveGoodsDate',
        value: new Date()
    });

    form.on('submit(confirm)', function () {

        $("#confirmForm :input").each(function () {
            $(this).removeAttr("disabled");
        });

        $.ajax({
            type: 'post',
            url: nginx_url + '/transfer/addCusRec',
            data: $("#confirmForm").serialize(),
            dataType: 'json',
            success: function (result) {
                if (result === 'SUCCESS') {
                    layer.msg('回执填写成功', {
                        time: 800,
                        icon: 1
                    }, function () {
                        let index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.layer.close(index); //再执行关闭
                    })
                } else {
                    layer.msg('回执填写失败', {
                        time: 800,
                        icon: 1
                    });
                }
            }

        });

        return false;
    })


});