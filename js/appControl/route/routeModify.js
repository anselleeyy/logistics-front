layui.use(['element', 'form', 'laydate', 'layer', 'table', 'jquery'], function() {
    let element = layui.element,
        laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table,
        $ = layui.jquery;
    form = layui.form;

    let expandId = window.location.href.split('=')[1];


    // 获取所有城市信息（id + cityName）
    $.ajax({
        type: 'get',
        url: nginx_url + '/route/findAllRegions',
        dataType: 'json',
        async: false,
        success: function (result) {
            let index = 1;
            $.each(result, function (i, item) {
                while (true) {
                    if (item.id === index) {
                        cityArray.push(item.city);
                        index++;
                        break;
                    } else {
                        cityArray.push('');
                        index++;
                    }
                }
            });
        }
    });

    $.ajax({
        type: 'get',
        url: nginx_url + '/route/findExpand/' + expandId,
        async: false,
        dataType: 'json',
        success: function (result) {
            cityId = result.cityId;
            $("#cityId").val(cityArray[cityId-1]);
            selected = result.rangeCity.split(',');
            refreshInt();
            refreshSelect();
            $.each(selected, function (i, item) {
                let content = "<button type='button' class='layui-btn layui-btn-sm' id='city-" + item +"' onclick='removeSpan(" + item + ")'>";
                content += cityArray[item-1];
                content += "<span class='layui-badge layui-bg-gray' style='font-size: 4px; line-height: 16px; height: 16px'>X</span></button>";
                $("#selectedCity").append(content);
            });
            form.render('select');
        }
    });

    form.on('select(changeRange)', function (data) {
        let select_id = parseInt(data.value);
        selected.push(select_id);
        refreshSelect();
        let content = "<button type='button' class='layui-btn layui-btn-sm' id='city-" + select_id +"' onclick='removeSpan(" + select_id + ")'>";
        content += cityArray[select_id-1];
        content += "<span class='layui-badge layui-bg-gray' style='font-size: 4px; line-height: 16px; height: 16px'>X</span></button>";
        $("#selectedCity").append(content);
        form.render('select');
    });

    form.on('submit(modInfo)', function () {
        $.ajax({
            type: 'put',
            url: nginx_url + '/route/update/' + expandId,
            async: false,
            data: {
                'cityId': cityId,
                'rangeCity': selected.toString()
            },
            dataType: 'json',
            success: function (result) {
                if (result === 'SUCCESS') {
                    layer.msg('修改成功', {
                        time: 800,
                        icon: 1
                    }, function () {
                        let index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.layer.close(index); //再执行关闭
                    });
                } else {
                    layer.msg('修改失败', {
                        time: 800,
                        icon: 5
                    })
                }
            }
        });
        return false;
    })

});
let form;
let selected;
let cityId;
let cityArray = [];

function removeSpan(id) {
    let buttonId = '#city-' + id;
    selected.splice($.inArray(id, selected), 1);
    $(buttonId).remove();
    refreshSelect();
    form.render('select');
}

function refreshSelect() {
    let selector = $("#rangeCity");
    selector.empty();
    let init = "<option value=''>请选择范围城市</option>";
    selector.append(init);
    $.each(cityArray, function (i, item) {
        if ((i+1) !== cityId && $.inArray((i+1), selected) === -1 && item !== '') {
            let option = "<option value='" + (i+1) + "'>";
            option += item;
            option += "</option>";
            $("#rangeCity").append(option);
        }
    });
}

function refreshInt() {
    $.each(selected, function (i, item) {
        selected[i] = parseInt(item);
    });
}