var rank_timer = setInterval(function () {
    if ($('tr .center').length > 0) {
        getCheckInStatus();

        $('a[href="#/statistic"]').after('<button title="延长cookie过期时间" id="extend_cookie_button" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content"><i aria-hidden="true" class="v-icon material-icons theme--light">stars</i></div></button>')
        $('#extend_cookie_button').on('click', function () {
            extendCookie();
        });

        $('#extend_cookie_button').after('<button title="一键签到" id="check_in_button" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content"><i aria-hidden="true" class="v-icon material-icons theme--light">book</i></div></button>')
        $('#check_in_button').on('click', function () {
            checkIn();
        });

        $('#check_in_button').after('<button title="流量条" id="mybar_button" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content"><i aria-hidden="true" class="v-icon material-icons theme--light">dehaze</i></div></button>')
        $('#mybar_button').on('click', function () {
            showMybar();
        });

        window.clearInterval(rank_timer);
    }
}, 100);

var check_in_list = [];
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
var check_in_status = false;
var check_in_timeout_count = 0;
var check_in_timer = setInterval(function () {
    if (check_in_timeout_count > 20) {
        alert(check_in_list.join(',') + '请求超时，请手动检查');
        check_in_status = false;
        check_in_timeout_count = 0;
        check_in_list = [];
        return;
    }
    if (check_in_list.length > 0) {
        check_in_timeout_count++;
        check_in_status = true;
    } else if (check_in_status) {
        check_in_timeout_count = 0;
        check_in_status = false;
        alert('签到完成');
    }
}, 1000);

setInterval(function () {
    if (window.location.hash !== '#/home' && window.location.hash !== '#/' && $('.fc-button-group').length > 0) {
        location.reload();
    }
    //检查是否有未登录
    $('a:contains("未登录")').each(function () {
        if ($(this).next().length > 0) {
            return;
        }
        $(this).after('<br><a>导入过期cookie</a>');
        $(this).next().next().on('click', function () {
            importExpiredCookie($(this).parents('tr').children().find('a').eq(0).attr('href'));
        })
    })
}, 1000);

function genMybarPic() {
    loadJS('/js/html2canvas.js', function () {
        $('#mybar_bbcode').hide();
        $('#mybar_pic').hide();
        $('#mybar_loading').show();
        html2canvas($('.v-content__wrap')[0], {
            useCORS: true,
            width: 444,
            background: "#fff",
        }).then(function (canvas) {
            $($('.v-content__wrap')[0]).find('img').remove();
            $($('.v-content__wrap')[0]).find('br').remove();
            $($('.v-content__wrap')[0]).append(canvas);
            $('#mybar_loading').hide();
            alert('生成成功, 右键复制图片或者下载图片')
        })
    })
}

var ptpp_user_data = '';

function showMybar() {
    var list = $('tbody').children();
    chrome.storage.local.get('PT-Plugin-Plus-Config', function (res) {
        if (typeof res['PT-Plugin-Plus-Config']['sites'] !== 'undefined') {
            ptpp_user_data = res['PT-Plugin-Plus-Config']['sites'];
        }
    });
    var mybar_bbcode = '';
    var get_user_data_timer = setInterval(function () {
        if (ptpp_user_data !== '') {
            $($('.v-content__wrap')[0]).html('<button style="margin-left: 572px;position: absolute;" id="mybar_close" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content">关闭&nbsp;<i aria-hidden="true" class="v-icon material-icons theme--light">cancel</i></div></button>');
            $($('.v-content__wrap')[0]).append('<button style="display:none;margin-left: 572px;margin-top:50px;position: absolute;" id="mybar_bbcode" title="用于论坛等" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content">生成BBCode代码&nbsp;<i aria-hidden="true" class="v-icon material-icons theme--light">code</i></div></button>');
            $($('.v-content__wrap')[0]).append('<button style="display:none;margin-left: 572px;margin-top:100px;position: absolute;" id="mybar_pic" title="生成图片" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content">生成图片&nbsp;<i aria-hidden="true" class="v-icon material-icons theme--light">panorama</i></div></button>');
            $($('.v-content__wrap')[0]).append('<button style="margin-left: 672px;position: absolute;" id="mybar_loading" title="正在生成" class="v-btn v-btn--router theme--light success" title=""><div class="v-btn__content">正在生成<i aria-hidden="true" class="v-icon material-icons theme--light">autorenew</i></div></button>');
            var mybar_loading_timer = setInterval(function () {
                if ($('#mybar_loading').length === 0) {
                    window.clearInterval(mybar_loading_timer);
                    return;
                }
                if ($('#mybar_loading').html().length % 2 === 1) {
                    $('#mybar_loading').html('<div class="v-btn__content">正在加载。。<i aria-hidden="true" class="v-icon material-icons theme--light">autorenew</i></div>');
                } else {
                    $('#mybar_loading').html('<div class="v-btn__content">正在加载。<i aria-hidden="true" class="v-icon material-icons theme--light">autorenew</i></div>');
                }
            }, 300)
            $('#mybar_close').on('click', function () {
                location.reload();
            });
            $('#mybar_bbcode').on('click', function () {
                $('#mybar_bbcode').remove();
                $($('.v-content__wrap')[0]).find('img').remove()
                $($('.v-content__wrap')[0]).find('br').remove()
                $('#mybar_pic').remove();
                $($('.v-content__wrap')[0]).append('<textarea style="width: 500px;height: 100%;">' + mybar_bbcode + '</textarea>');
            });
            $('#mybar_pic').on('click', function () {
                genMybarPic();
            });
            window.clearInterval(get_user_data_timer);
            for (var i = 0; i < list.length; i++) {
                let item = $(list[i]);
                if (!item.children().eq(1).text()) {
                    continue;
                }
                let site_url = item.find('.caption').parent();
                if (!site_url) {
                    continue;
                }
                let site_url_href = site_url.attr('href');
                if (!site_url_href) {
                    continue;
                }
                let site_user_data = '';
                let site_schema = '';

                site_url = parseUrl(site_url_href);
                if (typeof site_url.host === 'undefined') {
                    continue;
                }
                site_url = site_url.host;

                for (var j = 0; j < ptpp_user_data.length; j++) {
                    if (ptpp_user_data[j]['host'] === 'www.nicept.net') {
                        ptpp_user_data[j]['host'] = 'nicept.net';
                    }
                    if (site_url === ptpp_user_data[j]['host'] || site_url.replace(/www./, '') === ptpp_user_data[j]['host']) {
                        if (typeof ptpp_user_data[j]['schema'] !== 'undefined') {
                            site_schema = ptpp_user_data[j]['schema'];
                        } else {
                            $.ajax({
                                url: '/resource/sites/' + ((site_url === ptpp_user_data[j]['host']) ? site_url : site_url.replace(/www./, '')) + '/config.json',
                                async: false,
                                type: 'GET',
                                dataType: 'JSON',
                                success: function (res) {
                                    site_schema = res.schema;
                                },
                            })
                        }
                        //ccfbits config.json里没写schema
                        if (site_schema === 'NexusPHP' || site_schema === 'TTG' || site_url === 'ccfbits.org') {
                            site_user_data = ptpp_user_data[j]['user'];
                        }
                        break;
                    }
                }
                if (site_user_data === '') {
                    continue;
                }
                if (site_url_href.substr(site_url_href.length - 1, 1) !== '/') {
                    site_url_href += '/';
                }

                if (site_url === 'hdcity.city') {
                    site_user_data.id = site_user_data.id[0];
                }
                if (typeof site_user_data.id === 'undefined' || isNaN(site_user_data.id) || !site_user_data.id) {
                    continue;
                }
                $.ajax({
                    url: site_url_href + 'mybar.php?userid=' + site_user_data.id + '.png',
                    type: 'GET',
                    complete: function (xhr, status) {
                        if (status === 'success') {
                            if (xhr.responseText.length < 800) {
                                return;
                            }
                            mybar_bbcode += '[img]' + site_url_href + 'mybar.php?userid=' + site_user_data.id + '.png' + '[/img]' + "\r\n";
                            $($('.v-content__wrap')[0]).append('<img style="margin-top:5px;width:444px;" src="' + site_url_href + 'mybar.php?userid=' + site_user_data.id + '.png' + '"><br>');
                        }
                    },
                    // async: false,
                })
            }
            $(document).ajaxStop(function () {
                $('#mybar_loading').hide()
                $("#mybar_bbcode").show();
                $("#mybar_pic").show();
            });
        }
    }, 100);
}

function importExpiredCookie(site_url) {
    try {
        chrome.cookies.getAllCookieStores(function () {
        });
    } catch (e) {
        alert('请前往权限设置，打开cookie操作权限');
        return;
    }
    var cookies = prompt("导入cookie", "请复制ptpp备份文件中的cookies.json，内容全部粘贴到这里");
    try {
        cookies = JSON.parse(cookies);
        if (cookies.length > 0) {
            let import_cookies_flag = false;
            for (var i = 0; i < cookies.length; i++) {
                if (site_url === cookies[i].url) {
                    for (var j = 0; j < cookies[i].cookies.length; j++) {
                        var param = {
                            url: site_url,
                            name: cookies[i].cookies[j].name,
                            value: cookies[i].cookies[j].value,
                            domain: cookies[i].cookies[j].domain,
                            path: cookies[i].cookies[j].path,
                            secure: cookies[i].cookies[j].secure,
                            httpOnly: cookies[i].cookies[j].httpOnly,
                            sameSite: cookies[i].cookies[j].sameSite,
                            storeId: cookies[i].cookies[j].storeId,
                            expirationDate: 2147483647,
                        };
                        chrome.cookies.set(param, function (cookie) {
                        });
                        import_cookies_flag = true;
                    }
                    break;
                }
            }
            if (import_cookies_flag === false) {
                alert('恢复失败');
            } else  {
                alert('恢复成功,请尝试重新刷新站点');
            }
        } else {
            alert('格式不正确，请复制ptpp备份文件中的cookies.json，内容全部复制到这里');
        }
    } catch (e) {
        alert('格式不正确，请复制ptpp备份文件中的cookies.json，内容全部粘贴到这里');
    }

}

function getCheckInStatus() {
    var list = $('tbody').children();
    for (var i = 0; i < list.length; i++) {
        var item = $(list[i]);
        if (!item.children().eq(1).text()) {
            continue;
        }
        let site_url = item.find('.caption').parent();
        if (!site_url) {
            continue;
        }
        site_url = site_url.attr('href');
        if (!site_url) {
            continue;
        }
        site_url = parseUrl(site_url).host.replace(/www\./, '').replace(/\./g, '_');
        if (!isNaN(site_url.substr(0, 1))) {
            site_url = 'i' + site_url;
        }
        var check_in = localStorage.getItem('check_in');
        if (check_in === null) {
            return;
        }
        check_in = JSON.parse(check_in);
        var check_in_date = '';

        eval('try{check_in_date = check_in.' + site_url + ';}catch(e){}');
        if (check_in_date && check_in_date === ((new Date().getMonth() + 1) + '' + new Date().getDate())) {
            item.find('.caption').after('<span style="color:green;">✔</span>');
        }
    }
}

function checkIn() {
    // $.ajaxSettings.async = false;
    // $.ajaxSettings.timeout = 10;
    alert('正在一键签到');
    var list = $('tbody').children();
    for (var i = 0; i < list.length; i++) {
        var item = $(list[i]);
        let item2 = $(list[i]);
        if (!item.children().eq(1).text()) {
            continue;
        }
        let site_url = item.find('.caption').parent();
        if (!site_url) {
            continue;
        }
        site_url = site_url.attr('href');
        if (!site_url) {
            continue;
        }
        var caption_parent_find_span = item.find('.caption').parent().find('span');
        for (var j = 0; j < caption_parent_find_span.length; j++) {
            if ($(caption_parent_find_span[j]).attr('style') === 'color:green;') {
                $(caption_parent_find_span[j]).remove();
            }
        }
        var check_in_config = getCheckInConfig(site_url);
        if (check_in_config.url !== "" || check_in_config.callback !== "") {
            if (check_in_config.callback) {
                check_in_config.callback(item2);
            } else {
                var check_in_site_url = parseUrl(site_url).host.replace(/www\./, '').replace(/\./g, '_');
                if (!isNaN(check_in_site_url.substr(0, 1))) {
                    check_in_site_url = 'i' + check_in_site_url;
                }
                check_in_list.push(check_in_site_url);
                $.get(check_in_config.url, function () {
                    var check_in = localStorage.getItem('check_in');
                    if (check_in === null) {
                        check_in = {};
                    } else {
                        check_in = JSON.parse(check_in);
                    }
                    var check_in_site_url = parseUrl(site_url).host.replace(/www\./, '').replace(/\./g, '_');
                    if (!isNaN(check_in_site_url.substr(0, 1))) {
                        check_in_site_url = 'i' + check_in_site_url;
                    }
                    eval('check_in.' + check_in_site_url + ' = (new Date().getMonth() + 1) + \'\' + new Date().getDate();')
                    localStorage.setItem('check_in', JSON.stringify(check_in));
                    check_in_list.remove(check_in_site_url);
                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                });
            }
        }
    }
}

function downloadFile(content, fileName) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    element.click();
}

function extendCookie() {
    if (localStorage.getItem('cookie_backup') !== null) {
        if (confirm('您已使用过此功能')) {
            if (!confirm('确定再次更新cookie过期时间吗')) {
                return;
            }
        } else {
            return;
        }
    } else {
        if (!confirm('确定延长全站cookie过期时间吗')) {
            return;
        }
    }

    try {
        chrome.cookies.getAllCookieStores(function () {
        });
    } catch (e) {
        alert('请前往权限设置，打开cookie操作权限');
        return;
    }
    var list = $('tbody').children();
    var cookie_backup = [];
    for (var i = 0; i < list.length; i++) {
        var item = $(list[i]);
        if (!item.children().eq(1).text()) {
            continue;
        }
        let site_url = item.find('.caption').parent();
        if (!site_url) {
            continue;
        }
        site_url = site_url.attr('href');
        if (!site_url) {
            continue;
        }
        chrome.cookies.getAll({"url": site_url}, function (cookie) {
            let update_cookie_count = 0;
            for (var j = 0; j < cookie.length; j++) {
                cookie_backup.push(cookie[j]);
                if (typeof cookie[j].expirationDate === 'undefined') {
                    continue;
                }
                if (typeof cookie[j].name === 'undefined') {
                    continue;
                }
                //chrome.cookies.remove({url: site_url, name: cookie[j].name}, function() {});continue;
                var param = {
                    url: site_url,
                    name: cookie[j].name,
                    value: cookie[j].value,
                    domain: cookie[j].domain,
                    path: cookie[j].path,
                    secure: cookie[j].secure,
                    httpOnly: cookie[j].httpOnly,
                    expirationDate: 2147483647,
                };
                chrome.cookies.set(param, function (cookie) {
                });
                update_cookie_count++;
            }
        });
    }
    setTimeout(function () {
        downloadFile(JSON.stringify(cookie_backup), 'PT-Plugin-Plus-Cookie-Backup-' + getDate + '.json')
        if (localStorage.getItem('cookie_backup') === null) {
            localStorage.setItem('cookie_backup', JSON.stringify(cookie_backup));
        }
        alert('更新成功');
    }, 2000);
}

var rank_flag = false;


function showIncrease(site_url, max_upload, item){
    var history_site_url = parseUrl(site_url).host;
    if (history_site_url == "www.hddolby.com" || history_site_url == "www.tjupt.org"){
        history_site_url = history_site_url.replace(/www\./, '');
    }
    chrome.runtime.sendMessage({
        action: "getUserHistoryData",
        data: history_site_url
    }, function(t){
        if (t.resolve){

            var keys = Object.keys(t.resolve);
            var last,last_time,current_time;
            var current_upload = t.resolve.latest.uploaded;
            for(var i = keys.length - 1;i > 0;i--){
                if (keys[i]=="latest"){
                    continue;
                }
                if(t.resolve[keys[i]].uploaded == current_upload){
                    current_time = keys[i]; 
                    continue;
                }
                if (t.resolve[keys[i]].uploaded){
                    last = t.resolve[keys[i]].uploaded;
                    last_time = keys[i];
                    break;
                }
            }
            if (!last_time){
                vender_list('只有一天数据无法显示毕业进度', 3, item);
                return;
            }
            var day_cost = (new Date(current_time) - new Date(last_time)) / 86400000;
            var speed = (current_upload -  last) / day_cost;
            vender_list(day_cost+'天内上传增加了' + bytes2Size(speed), 2, item);
            if (max_upload > 0){
                if (current_upload > max_upload){
                    vender_list('毕业需要'+ bytes2Size(max_upload) + ',已经毕业', 3, item);
                } else {
                    vender_list('毕业需要'+ bytes2Size(max_upload) , 2, item);
                    vender_list('还需要'+bytes2Size(max_upload - current_upload) +','+ ((max_upload - current_upload)/speed).toFixed(2) + '天' , 2, item);
                }
            }
        }
    });
}


function size2Bytes(size) {
    if (size.indexOf('KiB') !== -1 || size.indexOf('KB') !== -1) {
        return parseFloat(size) * Math.pow(2, 10);
    }
    if (size.indexOf('MiB') !== -1 || size.indexOf('MB') !== -1) {
        return parseFloat(size) * Math.pow(2, 20);
    }
    if (size.indexOf('GiB') !== -1 || size.indexOf('GB') !== -1) {
        return parseFloat(size) * Math.pow(2, 30);
    }
    if (size.indexOf('TiB') !== -1 || size.indexOf('TB') !== -1) {
        return parseFloat(size) * Math.pow(2, 40);
    }
    if (size.indexOf('PiB') !== -1 || size.indexOf('PB') !== -1) {
        return parseFloat(size) * Math.pow(2, 50);
    }
    return 0;
}

function bytes2Size(bytes) {
    if (isNaN(bytes)) {
        return '';
    }
    var symbols = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var exp = Math.floor(Math.log(bytes) / Math.log(2));
    if (exp < 1) {
        exp = 0;
    }
    var i = Math.floor(exp / 10);
    bytes = bytes / Math.pow(2, 10 * i);

    if (bytes.toString().length > bytes.toFixed(2).toString().length) {
        bytes = bytes.toFixed(2);
    }
    return bytes + ' ' + symbols[i];
}

function timestamp2Date(timestamp) {
    var date = new Date(timestamp * 1000);
    return date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
}

function loadJS(url, callback) {
    var script = document.createElement('script'),
        fn = callback || function () {
        };
    script.type = 'text/javascript';
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
                script.onreadystatechange = null;
                fn();
            }
        };
    } else {
        script.onload = function () {
            fn();
        };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}

function vender_list(content, type, item) {
    rank_flag = true;
    if (type === 1) {
        //时间满足了  但数据不够的
        if (item.children().eq(2).find('span').length > 0) {
            item.children().eq(2).append('<span style="color: orangered">' + content + '</span>');
        } else {
            item.children().eq(2).append('<br><span style="color: orangered">' + content + '</span>');
        }
    } else if (type === 2) {
        item.children().eq(2).append('<br><span style="color: green">' + content + '</span>');
    } else if (type === 3) {
        item.children().eq(2).append('<br><span style="color: orangered">' + content + '</span>');
    } else {
        item.children().eq(2).append('<br><span>' + content + '</span>');
    }
}

function parseUrl(url) {
    let urlObj = {
        protocol: /^(.+)\:\/\//,
        host: /\:\/\/(.+?)[\?\#\s\/]/,
        path: /\w(\/.*?)[\?\#\s]/,
        query: /\?(.+?)[\#\/\s]/,
        hash: /\#(\w+)\s$/
    }
    url += ' '

    function formatQuery(str) {
        return str.split('&').reduce((a, b) => {
            let arr = b.split('=')
            a[arr[0]] = arr[1]
            return a
        }, {})
    }

    for (let key in urlObj) {
        let pattern = urlObj[key]
        urlObj[key] = key === 'query' ? (pattern.exec(url) && formatQuery(pattern.exec(url)[1])) : (pattern.exec(url) && pattern.exec(url)[1])
    }
    return urlObj
}

function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.ceil(n * k) / k;
        };

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

function getDate() {
    var date, year, month, day, hour, minute, second;
    date = new Date();
    year = date.getFullYear();
    month = ((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    day = date.getDate < 10 ? "0" + date.getDate() : date.getDate();
    hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return year + "-" + month + "-" + day + "_" + hour + "-" + minute + "-" + second;
}

function getCheckInConfig(site_url) {
    var url = '';
    var callback = '';
    site_url = parseUrl(site_url).host.replace(/www\./, '');
    switch (site_url) {
        case '52pt.site' :
            callback = function (item2) {
                check_in_list.push('i52pt_site');
                $.get('https://52pt.site/bakatest.php', function (res) {
                    if (res.indexOf('name="questionid" value="') !== -1) {
                        var question_id = res.split('name="questionid" value="');
                        if (typeof question_id[1] !== 'undefined') {
                            question_id = question_id[1].split('"')[0];
                            if (!isNaN(question_id)) {
                                $.post('https://52pt.site/bakatest.php', {
                                    wantskip: '不会',
                                    choice: [1],
                                    questionid: question_id
                                })
                            }
                        }
                    }
                    var check_in = localStorage.getItem('check_in');
                    if (check_in === null) {
                        check_in = {};
                    } else {
                        check_in = JSON.parse(check_in);
                    }
                    check_in.i52pt_site = (new Date().getMonth() + 1) + '' + new Date().getDate();
                    localStorage.setItem('check_in', JSON.stringify(check_in));
                    check_in_list.remove('i52pt_site');
                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                })
            };
            break;
        case 'chdbits.co' :
            callback = function (item2) {
                check_in_list.remove('chdbits_co');
                $.get('https://chdbits.co/bakatest.php', function (res) {
                    if (res.indexOf('name="questionid" value="') !== -1) {
                        var question_id = res.split('name="questionid" value="');
                        if (typeof question_id[1] !== 'undefined') {
                            question_id = question_id[1].split('"')[0];
                            if (!isNaN(question_id)) {
                                $.post('https://chdbits.co/bakatest.php', {
                                    wantskip: '不会',
                                    choice: [1],
                                    questionid: question_id
                                }, function () {
                                    var check_in = localStorage.getItem('check_in');
                                    if (check_in === null) {
                                        check_in = {};
                                    } else {
                                        check_in = JSON.parse(check_in);
                                    }
                                    check_in.chdbits_co = (new Date().getMonth() + 1) + '' + new Date().getDate();
                                    localStorage.setItem('check_in', JSON.stringify(check_in));
                                    check_in_list.remove('chdbits_co');
                                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                                })
                            }
                        }
                    }
                })
            };
            break;
        case 'hdarea.co' :
            callback = function (item2) {
                check_in_list.push('hdarea_co');
                $.post('https://www.hdarea.co/sign_in.php', {action: 'sign_in'}, function () {
                    var check_in = localStorage.getItem('check_in');
                    if (check_in === null) {
                        check_in = {};
                    } else {
                        check_in = JSON.parse(check_in);
                    }
                    check_in.hdarea_co = (new Date().getMonth() + 1) + '' + new Date().getDate();
                    localStorage.setItem('check_in', JSON.stringify(check_in));
                    check_in_list.remove('hdarea_co');
                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                });
            };
            break;
        case 'hdchina.org' :
            callback = function (item2) {
                check_in_list.push('hdchina_org');
                $.get('https://hdchina.org/', function (res) {
                    if (res.indexOf('<meta name="x-csrf" content="') !== -1) {
                        var csrf = res.split('<meta name="x-csrf" content="');
                        if (typeof csrf[1] !== 'undefined') {
                            csrf = csrf[1].split('"')[0];
                            if (csrf.length > 0) {
                                $.post('https://hdchina.org/plugin_sign-in.php?cmd=signin', {csrf: csrf}, function () {
                                    var check_in = localStorage.getItem('check_in');
                                    if (check_in === null) {
                                        check_in = {};
                                    } else {
                                        check_in = JSON.parse(check_in);
                                    }
                                    check_in.hdchina_org = (new Date().getMonth() + 1) + '' + new Date().getDate();
                                    localStorage.setItem('check_in', JSON.stringify(check_in));
                                    check_in_list.remove('hdchina_org');
                                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                                })
                            }
                        }
                    }
                })
            };
            break;
        case 'pt.hdupt.com' :
            callback = function (item2) {
                check_in_list.push('pt_hdupt_com');
                $.post('https://pt.upxin.net/added.php', {action: 'qiandao'}, function () {
                    var check_in = localStorage.getItem('check_in');
                    if (check_in === null) {
                        check_in = {};
                    } else {
                        check_in = JSON.parse(check_in);
                    }
                    check_in.pt_hdupt_com = (new Date().getMonth() + 1) + '' + new Date().getDate();
                    localStorage.setItem('check_in', JSON.stringify(check_in));
                    check_in_list.remove('pt_hdupt_com');
                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                });
            };
            break;
        case 'pt.upxin.net' :
            callback = function (item2) {
                check_in_list.push('pt_upxin_net');
                $.post('https://pt.upxin.net/added.php', {action: 'qiandao'}, function () {
                    var check_in = localStorage.getItem('check_in');
                    if (check_in === null) {
                        check_in = {};
                    } else {
                        check_in = JSON.parse(check_in);
                    }
                    check_in.pt_upxin_net = (new Date().getMonth() + 1) + '' + new Date().getDate();
                    localStorage.setItem('check_in', JSON.stringify(check_in));
                    check_in_list.remove('pt_upxin_net');
                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                });
            };
            break;
        case 'totheglory.im' :
            callback = function (item2) {
                check_in_list.remove('totheglory_im');
                $.get('https://totheglory.im', function (res) {
                    if (res.indexOf('$.post("signed.php", {') !== -1) {
                        var param = res.split('$.post("signed.php", {');
                        if (typeof param[1] !== 'undefined') {
                            if (res.indexOf('},') !== -1) {
                                param = param[1].split('},');
                                if (typeof param[0] !== 'undefined') {
                                    param = param[0].replace(/:/g, '=').replace('/,/g', ';');
                                    eval(param);
                                    if (typeof signed_timestamp !== 'undefined' && typeof signed_token !== 'undefined') {
                                        $.post("https://totheglory.im/signed.php", {
                                            signed_timestamp: signed_timestamp,
                                            signed_token: signed_token
                                        }, function () {
                                            var check_in = localStorage.getItem('check_in');
                                            if (check_in === null) {
                                                check_in = {};
                                            } else {
                                                check_in = JSON.parse(check_in);
                                            }
                                            check_in.totheglory_im = (new Date().getMonth() + 1) + '' + new Date().getDate();
                                            localStorage.setItem('check_in', JSON.stringify(check_in));
                                            check_in_list.remove('totheglory_im');
                                            item2.find('.caption').after('<span style="color:green;">✔</span>');
                                        });
                                    }
                                }
                            }
                        }
                    }
                })
            };
            break;
        case 'yingk.com' :
            callback = function (item2) {
                check_in_list.remove('yingk_com');
                $.get('https://yingk.com/bakatest.php', function (res) {
                    if (res.indexOf('name="questionid" value="') !== -1) {
                        var question_id = res.split('name="questionid" value="');
                        if (typeof question_id[1] !== 'undefined') {
                            question_id = question_id[1].split('"')[0];
                            if (!isNaN(question_id)) {
                                $.post('https://yingk.com/bakatest.php', {
                                    wantskip: '不会',
                                    choice: [1],
                                    questionid: question_id
                                }, function () {
                                    var check_in = localStorage.getItem('check_in');
                                    if (check_in === null) {
                                        check_in = {};
                                    } else {
                                        check_in = JSON.parse(check_in);
                                    }
                                    check_in.yingk_com = (new Date().getMonth() + 1) + '' + new Date().getDate();
                                    localStorage.setItem('check_in', JSON.stringify(check_in));
                                    check_in_list.remove('yingk_com');
                                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                                })
                            }
                        }
                    }
                })
            };
            break;
        case 'club.hares.top' :
            callback = function (item2) {
                check_in_list.remove('club_hares_top');
                $.get('https://club.hares.top/attendance.php?action=sign', function (res) {
                    var check_in = localStorage.getItem('check_in');
                    if (check_in === null) {
                        check_in = {};
                    } else {
                        check_in = JSON.parse(check_in);
                    }
                    check_in.club_hares_top = (new Date().getMonth() + 1) + '' + new Date().getDate();
                    localStorage.setItem('check_in', JSON.stringify(check_in));
                    check_in_list.remove('club_hares_top');
                    item2.find('.caption').after('<span style="color:green;">✔</span>');
                },"json")
            }; 
            break;
        case 'pt.btschool.club' :
            url = 'https://pt.btschool.club/index.php?action=addbonus';
            break;
        case 'discfan.net' :
            url = 'https://discfan.net/attendance.php';
            break;
        case 'haidan.video' :
            url = 'https://www.haidan.video/signin.php';
            break;
        case 'hddolby.com' :
            url = 'https://www.hddolby.com/attendance.php';
            break;
        case 'hdatmos.club' :
            url = 'https://hdatmos.club/attendance.php';
            break;
        case 'pt.soulvoice.club' :
            url = 'https://pt.soulvoice.club/attendance.php';
            break;
        case '1ptba.com' :
            url = 'https://1ptba.com/attendance.php';
            break;
        case 'hdzone.me' :
            url = 'https://hdzone.me/attendance.php';
            break;
        case 'htpt.cc' :
            url = 'https://www.htpt.cc/attendance.php';
            break;
        case 'lemonhd.org' :
            url = 'https://lemonhd.org/attendance.php';
            break;
        case 'nicept.net' :
            url = 'https://www.nicept.net/attendance.php';
            break;
        case 'ourbits.club' :
            url = 'https://ourbits.club/attendance.php';
            break;
        case 'pterclub.com' :
            url = 'https://pterclub.com/attendance-ajax.php';
            break;
        case 'pthome.net' :
            url = 'https://pthome.net/attendance.php';
            break;
        case 'pttime.org' :
            url = 'https://www.pttime.org/attendance.php';
            break;
        case 'hdfans.org' :
            url = 'https://hdfans.org/attendance.php';
            break;
        case 'hdmayi.com' :
            url = 'http://hdmayi.com/attendance.php';
            break;
        case 'hdcity.city' :
            url = 'https://hdcity.city/sign';
            break;
        case 'hdhome.org' :
            url = 'https://hdhome.org/attendance.php';
            break;
        case 'hdtime.org' :
            url = 'https://hdtime.org/attendance.php';
            break;
        case 'audiences.me' :
            url = 'https://audiences.me/attendance.php';
            break;
        case 'hhanclub.top' :
            url = 'https://hhanclub.top/attendance.php';
            break;
    }
    return {url: url, callback: callback};
}