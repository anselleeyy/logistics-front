let cityArray = [];
let range_city = [];
let cityId;

let range_dot = [ '', 'layui-bg-orange', 'layui-bg-green', 'layui-bg-cyan', 'layui-bg-blue', 'layui-bg-black', 'layui-bg-gray' ];

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
        console.log(cityArray);
    }
});

layui.use(['element', 'form', 'laydate', 'layer', 'table', 'jquery'], function() {
    let element = layui.element,
        form = layui.form,
        laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table,
        $ = layui.jquery;

    refreshTable();

    // 监听工具条
    table.on('tool(expandTool)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        let data = obj.data; //获得当前行数据
        let layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        // let tr = obj.tr; //获得当前行 tr 的DOM对象

        if(layEvent === 'del'){ //删除
            layer.confirm('真的删除么', function(index){
                //向服务端发送删除指令
                $.ajax({
                    type: "DELETE",
                    url: nginx_url + "/route/delete/" + data.id,
                    dataType: 'json',
                    async: false,
                    success: function (result) {
                        console.log(result);
                        if (result === 'SUCCESS') {
                            layer.msg('删除成功', {
                                time: 800,
                                icon: 1
                            });
                        } else {
                            layer.msg('删除成功', {
                                time: 800,
                                icon: 2
                            });
                        }
                    }

                });
                table.reload('expandTable', {
                    url: nginx_url +  '/route/findAllExpands'
                })
            });
        } else if (layEvent === 'edit'){ //修改
            layer.open({
                type: 2,
                title: '主要城市范围修改',
                content: [ 'routeModify.html?id=' + data.id, 'no' ],
                area: [ '75%', '75%' ],
                shadeClose: true,
                move: false,
                end: function() {
                    table.reload('expandTable', {
                        url: nginx_url + '/route/findAllExpands'
                    })
                }
            });
        }
    });

    form.on('submit(addInfo)', function () {
        let cityId = $("#city").val();
        console.log("cityId: " + cityId);
        console.log("range: " + range_city.toString());
        $.ajax({
            type: 'post',
            url: nginx_url + '/route/add',
            data: {
                'cityId': cityId,
                'rangeCity': range_city.toString()
            },
            dataType: 'json',
            success: function (result) {
                if (result === 'SUCCESS') {
                    layer.msg('添加成功', {
                        time: 800,
                        icon: 1
                    });
                    $("#resetForm").click();
                } else {
                    layer.msg('添加失败', {
                        time: 800,
                        icon: 5
                    })
                }
            }
        });
        return false;
    });

    element.on('tab(demo)', function(data){
        if (data.index === 0) {
            refreshTable();
        } else if (data.index === 1) {
            $.ajax({
                type: 'get',
                url: nginx_url + '/route/findLeftRegions',
                dataType: 'json',
                async: false,
                success: function (result) {
                    console.log('regions: ' + result);
                    let citySelector = $("#city");
                    citySelector.empty();
                    let init = "<option value=''>请选择城市</option>";
                    citySelector.append(init);
                    $.each(result, function (i, item) {
                        let option = "<option value='" + item.id + "'>";
                        option += item.city;
                        option += "</option>";
                        citySelector.append(option);
                    });
                    form.render('select');
                }
            });
        } else {
            $("#routeInfo").empty();
            $.ajax({
                type: 'get',
                url: nginx_url + '/route/findAllRoutes',
                dataType: 'json',
                success: function (result) {
                    console.log(result);
                    let rand = 0;
                    $.each(result, function (i, item) {
                        let content = '<div class="layui-row layui-col-space15">'+
                            '<div class="layui-col-md12">' +
                            '<div class="layui-card">' +
                            '<div class="layui-card-header">' +
                            '<div class="layui-col-md4">';
                        content += cityArray[item.startStation-1] + ' - ' + cityArray[item.endStation-1];
                        content +=  '</div><div class="layui-col-md4">';
                        content += '里程：' + item.distance + 'km';
                        content +=  '</div><div class="layui-col-md4">';
                        content += '耗时：' + item.fetchTime + '天';
                        content += '</div></div>' +
                            '<div class="layui-card-body layui-col-space10">';
                        if (item.passStation !== '') {
                            let passStation = item.passStation.split(',');
                            $.each(passStation, function (j, temp) {
                                content += j === 0 ? '' : ' - ';
                                content += '<span class="layui-badge-dot ' + range_dot[(rand++ % 7)] + '"></span> ';
                                content += '<span> ' + cityArray[temp-1] + '</span>'

                            });
                        } else {
                            content += '<span class="layui-badge-dot ' + range_dot[(rand++ % 7)] + '"></span>';
                            content += '<span> 直达</span>'
                        }
                        $("#routeInfo").append(content);
                    });
                }
            })
        }
    });

    form.on('select(changeCity)', function (data) {
        $("#selectedCity").empty();
        cityId = data.value;
        range_city = [];
        let rangeCity = $("#rangeCity");
        rangeCity.empty();
        $.each(cityArray, function (i, item) {
            if ((i+1) !== parseInt(cityId) && item !== '') {
                let option = "<option value='" + (i+1) + "'>";
                option += item;
                option += "</option>";
                rangeCity.append(option);
            }
        });
        rangeCity.removeAttr('disabled');
        form.render('select');
    });

    form.on('select(changeRange)', function (data) {
        let select_id = parseInt(data.value);
        console.log(select_id);
        console.log('当前选中的城市：' + cityArray[select_id-1]);
        range_city.push(select_id);
        let rangeCity = $("#rangeCity");
        rangeCity.empty();
        let init = "<option value=''>请选择范围城市</option>";
        rangeCity.append(init);
        $.each(cityArray, function (i, item) {
            if ((i+1) !== cityId && $.inArray((i+1), range_city) === -1 && item !== '') {
                let option = "<option value='" + (i+1) + "'>";
                option += item;
                option += "</option>";
                rangeCity.append(option);
            }
        });
        let content = "<button type='button' class='layui-btn layui-btn-sm' id='city-" + select_id +"' onclick='removeSpan(" + select_id + ")'>";
        content += cityArray[select_id-1];
        content += "<span class='layui-badge layui-bg-gray' style='font-size: 4px; line-height: 16px; height: 16px'>X</span></button>";
        $("#selectedCity").append(content);
        console.log(range_city);
        form.render('select');
    });

    $("#resetForm").click(function () {
        $("#selectedCity").empty();
    });

    function refreshTable() {
        table.render({
            elem: '#expandTable',
            height: 'full-170',
            url: nginx_url + '/route/findAllExpands', //数据接口
            limit: 10,
            limits: [ 10 ],
            request: {
                pageName: 'pageNum', //页码的参数名称，默认：page
                limitName: 'limit' //每页数据量的参数名，默认：limit
            },
            response: {
                statusName: 'code', //数据状态的字段名称，默认：code
                statusCode: 200, //成功的状态码，默认：0
                msgName: 'msg', //状态信息的字段名称，默认：msg
                countName: 'count', //数据总数的字段名称，默认：count
                dataName: 'data' //数据列表的字段名称，默认：data
            },
            page: true, //开启分页
            cellMinWidth: 80,
            cols: [[
                { title: 'ID', fixed: 'left', sort: true, type: 'numbers' },
                { field: 'cityId', title: '主要城市', sort: true, templet: '#cityFormat', width: 150, align: 'center' },
                { field: 'rangeCity', title: '范围城市', templet: '#rangeFormat', align: 'center' },
                { fixed: 'right', title:"操作", align:"center", toolbar: '#barDemo', width: 150    }
            ]]
        });
    }

});

function format(id) {
    let array = ('' + id).split(',');
    let result = '';
    $.each(array, function (i, item) {
        let index = item-1;
        result += (i === 0 ? '' : ', ');
        result += cityArray[index];
    });
    return result;
}

function removeSpan(id) {
    let buttonId = '#city-' + id;
    range_city.splice($.inArray(id, range_city), 1);
    console.log(range_city);
    $(buttonId).remove();
}