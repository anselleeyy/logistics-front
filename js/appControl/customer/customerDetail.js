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

    $("#goToMod").click(function () {
        let index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭

    })

});