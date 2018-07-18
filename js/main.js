let login = $.cookie("loginId");
let funArray = [];
$.ajax({
    type: 'get',
    url: nginx_url + '/selectFunc/' + login,
    async: false,
    dataType: 'json',
    success: function (result) {
        funArray = [];
        $.each(result, function (i, item) {
            funArray.push(item.functionId);
        })
    }
});

for (let i = 1; i <= 11; i++) {
    if ($.inArray(i, funArray) == -1) {
        $("#function_" + i).remove();
    }
}

layui.use(['layer', 'form', 'element', 'jquery'], function() {
    let element = layui.element,
    $ = layui.jquery,
    layer = layui.layer;
    let mainLayout = $('#main-layout');
    let former_id = -1;
    element.on('nav(demo)', function(elem) {

        let nav_a = $(elem[0]);

        let id = nav_a.attr('data-id');
        let url = nav_a.attr('data-url');
        let text = nav_a.attr('data-text');

        if (id === '7') {
            let loginId = $.cookie('loginId');
            let type = loginId.slice(0, 2);
            if (type === 'KH') {
                url = 'html/getGoodsControl/callback/customerCallback.html';
            } else if (type === 'SJ') {
                url = 'html/getGoodsControl/callback/driverCallback.html';
            }
        }

        if(!url) {
            return;
        }
        if (former_id === -1) {
            former_id = id;
        }
        let isActive = $('.main-layout-tab .layui-tab-title').find("li[lay-id=" + id + "]");
        if(isActive.length > 0) {
            //切换到选项卡
            element.tabChange('tab', id);
        } else {
            element.tabDelete('tab', former_id);
            former_id = id;
            element.tabAdd('tab', {
                title: text,
                content: '<iframe src="' + url + '" id="' + id + '" name="iframe' + id + '" class="iframe" frameborder="0" data-id="' + id + '" scrolling="auto" height="100%" width="100%"></iframe>',
                id: id
            });
            element.tabChange('tab', id);
        }
        mainLayout.removeClass('hide-side');
    });

    $("#username").append($.cookie("loginId"));
});

function logout() {
    $.cookie("loginId", null);
    window.location.href = "login.html";
}