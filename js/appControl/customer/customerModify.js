layui.use(['element', 'form', 'laydate', 'jquery', 'layer', 'table'], function() {
    let element = layui.element,
        form = layui.form,
        laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table,
        $ = layui.jquery;

    let customerCode = window.location.href.split("=")[1];
    $.ajax({
        type: "get",
        url: nginx_url + "/selectCusByCode/" + customerCode,
        success: function (result) {
            console.log(result);
            $("#customerCode").val(result.customerCode);
            $("#customer").val(result.customer);
            $("#phone").val(result.phone);
            $("#fax").val(result.fax);
            $("#address").val(result.address);
            $("#postCode").val(result.postCode);
            $("#linkman").val(result.linkman);
            $("#linkmanMobile").val(result.linkmanMobile);
            $("#customerType").val(result.customerType);
            $("#enterpriseProperty").val(result.enterpriseProperty);
            $("#enterpriseSize").val(result.enterpriseSize);
            $("#email").val(result.email);
        }
    });

    form.on('submit(modifyCus)', function () {
        $.ajax({
            type: 'put',
            url: nginx_url + '/updateCustomerInfo/' + customerCode,
            data: $("#cusForm").serialize(),
            dataType: "json",
            success: function (result) {
                console.log(result);
                if (result === "SUCCESS") {
                    layer.msg('更新成功', {
                        time: 800,
                        icon: 1
                    }, function () {
                        let index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.layer.close(index); //再执行关闭
                    });
                } else {
                    layer.msg('更新失败', {
                        time: 800,
                        icon: 2
                    });
                }
            }

        });
        return false;
    });

    form.verify({
        fax: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^([0-9]{3,4}-)?[0-9]{7,8}$").test(value)){
                return '传真号码格式不正确';
            }
        },
        postcode: function (value, item) {
            if(!new RegExp("^[0-9]{6}$").test(value)){
                return '邮编格式不正确';
            }
        }
    });

});