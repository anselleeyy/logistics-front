layui.use(['element', 'form', 'laydate', 'layer', 'table'], function() {
    let element = layui.element,
        form = layui.form,
        laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table;

    lay('.test-item').each(function () {
        laydate.render({
            elem: this,
            trigger: 'click'
        })
    });

    $.ajax({
        type: "get",
        url: nginx_url + "/vehicle/selectLeftCodes",
        async: false,
        success: function (result) {
            $.each(result, function (i, item) {
                let option = "<option value='" + item + "'>";
                option += item;
                option += "</option>";
                $("#goodsRevertBillCode").append(option);
            });
            form.render('select');
        }
    });

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
                $("#loadStation").append(option);
                $("#dealGoodsStation").append(option);
            });
            form.render('select');
        }
    });


    form.on('select(changeSend)', function (data) {
        // ajax
        $.ajax({
            type: 'get',
            url: nginx_url + '/vehicle/findGoodsBill/' + data.value,
            success: function (result) {
                $("#receiveGoodsLinkman").val(result.receiveGoodsCustomer);
                $("#linkmanPhone").val(result.receiveGoodsCustomerTel);
                $("#receiveGoodsDetailAddr").val(result.receiveGoodsCustomerAddr);
            }
        });
    });

    laydate.render({
        elem: '#signTime',
        value: new Date()
    });

    // 货运单回执信息添加
    form.on('submit(addCargoReceipt)', function () {

        $("#receiveGoodsLinkman").removeAttr("disabled");
        $("#linkmanPhone").removeAttr("disabled");
        $("#receiveGoodsDetailAddr").removeAttr("disabled");
        $("#backBillState").removeAttr("disabled");

        $.ajax({
            type: "post",
            url: nginx_url + "/vehicle/add",
            data: $("#cargoReceiptForm").serialize(),
            dataType: "json",
            async: false,
            success: function (result) {
                if (result === "SUCCESS") {
                    layer.msg('货运回执单添加成功', {
                        time: 800,
                        icon: 1
                    });
                    $("#resetForm").click();
                } else {
                    layer.msg('货运回执单添加失败', {
                        time: 800,
                        icon: 2
                    });
                }
            }
        });
        return false;
    });

});