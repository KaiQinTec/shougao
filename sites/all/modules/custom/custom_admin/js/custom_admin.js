(function($) {
    $(document).ready(function() {
        $('#edit-submit-admin-views-node').text('查询');
        $('#edit-submit-admin-views-node').val('查询');

        $('select[name="workbench_access"]').find('option').eq(1).attr('selected', true);

        // 点击著录，弹出类型选择
        $('#create_node, #add-new-node').bind('click', function() {
            $('#modalContentTypes').modal('show');

            var type = $.cookie('selected_type');
            if(type != undefined) {
                
                $('#select-type').find('option').each(function(i) {
                    if($(this).attr('value') == type) {
                        $(this).attr('selected', true);
                    }
                });
            }
        });
        // 点击选择，跳转到对应的添加内容页面
        $('.select-type').bind('click', function() {
            var type = $('#select-type').val();
            if(type == null) {
                alert('请选择要著录的类型');
                return;
            }

            $.cookie('selected_type', type);

            type = type.replace(/_/g, '-');

            var path = Drupal.settings.basePath + 'node/add/' + type;
            window.location.href = path;
        });

        if($('.view-id-custom_facets_pages') || $('#views-form-admin-views-node-system-1')) {

            $('#views-form-admin-views-node-system-1, .view-custom-facets-pages').find('td.views-field-title a').on('click', function() {
                var nid = $(this).attr('data-nid');
                if(nid == undefined) {
                    var arr = $(this).attr('href').split('/');
                    nid = arr[2];
                }
                $('#modalShowNode').modal('show');
                $.ajax({
                    type: 'GET',
                    url: '/ajax/node-review/' + nid,
                    dataType: 'html',
                    success: function(data) {
                        $('#modalShowNode').find('.modal-body').html(data).find('h2 a').attr('href', '#');
                        $('#modalShowNode').find('.modal-body .field-type-image').find('.field-item').each(function(index) {
                            if(index > 0) {
                                $(this).find('a').eq(0).html('[点击查看]');
                            }
                        });
                    }
                });
                return false;
            });

            $('.page-search-facets .views-field-title, .page-search-facets-list .views-field-title, .page-search-creator .views-field-title, .page-search-creator-list  .views-field-title').find('a').on('click', function() {
                var nid = $(this).attr('data-nid');
                if(nid == undefined) {
                    var arr = $(this).attr('href').split('/');
                    nid = arr[2];
                }
                $('#modalShowNode').modal('show');
                $.ajax({
                    type: 'GET',
                    url: '/ajax/node-table-review/' + nid,
                    dataType: 'html',
                    success: function(data) {
                        $('#modalShowNode').find('.modal-body').html(data).find('h2 a').attr('href', '#');
                    }
                });
                return false;
            });
        }

        // 选择国家和地区
        /*if($('#edit-field-bf-place-und')) {
            var place_type = $('#edit-field-bf-place-und').val();
            if(place_type == '国家' || place_type == '_none') {
                $('.field-name-field-shl-placevalue-contry').css('display', 'block');
                $('.field-name-field-shl-placevalue-area').css('display', 'none');
            } else {
                $('.field-name-field-shl-placevalue-contry').css('display', 'none');
                $('.field-name-field-shl-placevalue-area').css('display', 'block');
            }

            $('#edit-field-bf-place-und').change(function(el) {
                place_type = $('#edit-field-bf-place-und').val();
                if(place_type == '国家' || place_type == '_none') {
                    $('.field-name-field-shl-placevalue-contry').css('display', 'block');
                    $('.field-name-field-shl-placevalue-area').css('display', 'none');
                } else {
                    $('.field-name-field-shl-placevalue-contry').css('display', 'none');
                    $('.field-name-field-shl-placevalue-area').css('display', 'block');
                }
            });
        }*/

        $('#edit-mi-ji, #edit-operation').on('change', function() {
            if($('#edit-mi-ji').val() > 0 || $('#edit-operation').val() != 0) {
                $('#edit-submit--2').attr('disabled', false);
            }
        });

        // 如果设置审核未通过，必须填写原因
        if($('#edit-workbench-moderation-state-new')) {
            $current_val = $('#edit-log').val();
            $('#edit-workbench-moderation-state-new').on('change', function() {
                if($(this).val() == 'no_published') {
                    $('#edit-log').css('border-color', 'red');
                } else {
                    $('#edit-log').css('border-color', '#ccc');
                }
            });

            $('#edit-submit').on('click', function() {
                if($('#edit-workbench-moderation-state-new').val() == 'no_published') {
                    if($current_val == $('#edit-log').val()) {
                        alert('请填写审核笔记。');
                        return false;
                    }
                }
            });

            // 点击暂存，自动选择草稿状态
            $('#edit-temp-storage').on('click', function() {
                $('#edit-workbench-moderation-state-new').find('option:eq(0)').attr('selected', 'selected');
            });
        }

        // 为导出按钮增加默认条件
        if($('.feed-icon').length > 0) {
            var url = $('.feed-icon').find('a').attr('href');
            if(url.indexOf('?') == -1) {
                $('.hasDatepicker').each(function(i) {
                    if(i == 0) {
                        url += '?';
                    } else {
                        url += '&';
                    }
                    url += $(this).attr('name') + '=' + $(this).val();
                });
                $('.feed-icon').find('a').attr('href', url)
            }
        }

        use_name_api_list();
        use_address_api_list();
        use_name_api_add();
        use_addr_api_add();


        //下拉框样式修改
        var lbl = $(".form-checkboxes").prev();
        lbl.addClass("lblleft");
    });

    if(Drupal.ajax) {
        Drupal.ajax.prototype.commands.MoreUseNameApi = function(ajax, response, status) {
            use_name_api_list();
            use_address_api_list();
            use_name_api_add();
            use_addr_api_add();
        }
    }

    // 展开添加规范人名
    function use_name_api_add() {
        if('.add-api-list') {

            $('#modalSearcheAddUser').on('click', function() {
                $('#modalAPIList').modal('hide');
                var current_input_id = $('#modalAPIList').find('input#current_input_index').val();
                $('#' + current_input_id).parents('.field-type-text').find('.add-api-list').click();
            });

            $('.add-api-list').on('click', function() {
                $('#modalAPIAdd').modal('show');

                var inputId = $(this).parents('.field-type-text').find('input').attr('id');
                $('#modalAPIAdd').find('input#current_add_user_input_index').val(inputId);

                $('#searchUserAddressList').on('click', function() {
                    var keyWord = $('#userAddAddress').val();
                    if(keyWord == '') {
                        alert('请输入关键字');
                        return;
                    }
                    if ($.fn.DataTable.isDataTable("#addUserAddressList")) {
                        $('#addUserAddressList').DataTable().clear().destroy();
                    }
    
                    $('#addUserAddressList').DataTable({
                        "processing": true,
                        "serverSide": true,
                        "ajax": {
                            url: Drupal.settings.basePath + 'get-address-api-list', // ajax source
                            dataType: 'json',
                            type: 'POST',
                            data: {search: keyWord}
                        },
                        "initComplete": function() {
                            
                        },
                        "drawCallback": function( settings ) {
                            $('td.use_address').find('a').click(function() {
                                $('input#userAddAddress').val($(this).attr('data-fname'));
                                $('input#nativePlace').val($(this).attr('data-uri'));
                                alert('已选择当前地址');
                            });
    
                            $('[data-toggle="tooltip"]').tooltip();
                        },
                        //"pageLength": 10,
                        "paging": false,
                        "searching":false,
                        "info":     false,
                        "lengthChange": false,
                        "ordering": false,
                        "columns": [
                            { className: "address_country" },
                            { className: "address_province" },
                            { className: "address_city" },
                            { className: "use_address" }
                        ],
                        /*"order": [
                            [1, "desc"]
                        ],*/ // set second column as a default sort by desc
                        "language": {
                            "url" : Drupal.settings.basePath + 'sites/all/modules/custom/custom_admin/datatables/Chinese.txt'
                        }
                    });
                });

                // 点击确定后，添加内容到标准库
                $('#userSearchAPIAdd').on('click', function() {
                    var data = $('#addUserForm').serializeArray();
                    var postData = {};
                    for(var i in data) {
                        if(data[i].value == '' && data[i].name != 'deathday') {
                            title = $('#' + data[i].name).attr('placeholder');
                            alert('请输入 ' + title + ' 的值！');
                            $('#' + data[i].name).parent('div').addClass('has-error');
                            return;
                        } else {
                            $('#' + data[i].name).parent('div').removeClass('has-error');
                        }
                        if(data[i].name != 'current_add_user_input_index' && data[i].name != 'userAddAddress') {
                            postData[data[i].name] = data[i].value.replace(/\-/g, '.');
                        }
                    }
                    
                    if(postData["deathday"]!="")
                        {
                            var birthday =new Date(postData["birthday"]);
                            var deathday =new Date(postData["deathday"]);
                            var sysDate = new Date();

                            if(deathday<birthday){
                                alert("死亡年月必须大于出生年月！");
                                $('#' + data[i].name).parent('div').addClass('has-error');
                                return;
                            }
                            else if(sysDate<deathday) {
                                alert("死亡年月不得晚于当前日期！");
                                $('#' + data[i].name).parent('div').addClass('has-error');
                                return;
                            }
                            else {
                                $('#' + data[i].name).parent('div').removeClass('has-error');
                            }
                        }
                        else
                        {
                            var birthday=new Date(postData["birthday"]);
                            var sysDate = new Date();
                            if(sysDate<birthday) {
                                alert("出生年月不得晚于当前日期！");
                                $('#' + data[i].name).parent('div').addClass('has-error');
                                return;
                            }
                            else {
                                $('#' + data[i].name).parent('div').removeClass('has-error');
                            }
                        }
                    postData.noteOfSource = '上海图书馆中国文化名人手稿知识库';
                    $.ajax({
                        url: '/add-user-to-api',
                        //url: 'http://data.library.sh.cn/persons/insert4sg',
                        type: 'POST',
                        dataType: 'JSON',
                        data: postData,
                        success: function(responseData) {
                            if(responseData.status == 'success') {
                                $('#' + data[5].value).val(data[0].value);
                                $('#modalAPIAdd').modal('hide');
                            }
                            else
                            {
                                alert("已存在该人名信息，请查询后选择！");
                                return;
                            }
                        }
                    });
                });
            });
        }
    }

    // 展开添加规范地名
    function use_addr_api_add() {
        if('.add-address-api-list') {

            $('#modalSearcheAddAddr').on('click', function() {
                $('#modalAddressAPIList').modal('hide');
                var current_input_id = $('#modalAddressAPIList').find('input#current_address_input_index').val();
                $('#' + current_input_id).parents('td').find('.add-address-api-list').click();
            });

            $('.add-address-api-list').on('click', function() {
                $('#modalAddrAdd').modal('show');

                var inputId = $(this).parents('td').find('input').attr('id');
                $('#modalAddrAdd').find('input#current_add_address_input_index').val(inputId);

                // 点击确定后，添加内容到标准库
                $('#addressAPIAdd').on('click', function() {
                    var data = $('#addAddrForm').serializeArray();
                    var postData = {};
                    for(var i in data) {
                        if(data[i].name == 'label' || data[i].name == 'country') {
                            if(data[i].value == '') {
                                title = $('#' + data[i].name).attr('placeholder');
                                alert('请输入 ' + title + ' 的值！');
                                $('#' + data[i].name).parent('div').addClass('has-error');
                                return;
                            }
                        }

                        if(data[i].name != 'current_add_address_input_index') {
                            postData[data[i].name] = data[i].value;
                        }
                    }

                    $.ajax({
                        url: '/add-addr-to-api',
                        type: 'POST',
                        dataType: 'JSON',
                        data: postData,
                        success: function(responseData) {
                            if(responseData.status == 'success') {
                                $('#' + data[5].value).val(data[0].value);
                                $('#modalAddrAdd').modal('hide');
                            }
                        }
                    });
                });
            });
        }
    }

    // 展开规范档
    function use_name_api_list() {
        if($('.use-api-list')) {
            $('.use-api-list').on('click', function() {
                $('#modalAPIList').modal('show');

                var inputId = $(this).prev().find('input').attr('id');
                $('#modalAPIList').find('input#current_input_index').val(inputId);
            });

            $('#searchAPIList').click(function() {
                var keyWord = $('#searchKeyWord').val();
                if(keyWord == '') {
                    swal('请输入关键字。');
                    return;
                }

                if ($.fn.DataTable.isDataTable("#specAuthorList")) {
                    $('#specAuthorList').DataTable().clear().destroy();
                }

                $('#specAuthorList').DataTable({
                    "processing": true,
                    "serverSide": true,
                    "ajax": {
                        url: Drupal.settings.basePath + 'get-api-list', // ajax source
                        dataType: 'json',
                        type: 'POST',
                        data: {search: keyWord}
                    },
                    "initComplete": function() {
                        
                    },
                    "drawCallback": function( settings ) {
                        $('td.use_author').find('a').click(function() {
                            var inputId = $('#modalAPIList').find('input#current_input_index').val();
                            $('input#' + inputId).val($(this).attr('data-fname'));
                            $('#modalAPIList').modal('hide');
                        });

                        $('[data-toggle="tooltip"]').tooltip();
                    },
                    "pageLength": 10,
                    "searching":false,
                    "info":     false,
                    "lengthChange": false,
                    "ordering": false,
                    "columns": [
                        { className: "author_name" },
                        { className: "author_place" },
                        { className: "author_spec" },
                        { className: "use_author" }
                    ],
                    /*"order": [
                        [1, "desc"]
                    ],*/ // set second column as a default sort by desc
                    "language": {
                        "url" : Drupal.settings.basePath + 'sites/all/modules/custom/custom_admin/datatables/Chinese.txt'
                    }
                });
            });
        }
    }

    function use_address_api_list() {
        if($('.use-address-api-list')) {
            $('.use-address-api-list').on('click', function() {
                $('#modalAddressAPIList').modal('show');

                var inputId = $(this).prev().find('input').attr('id');
                $('#modalAddressAPIList').find('input#current_address_input_index').val(inputId);
            });

            $('#searchAddressAPIList').click(function() {
                var keyWord = $('#searchAddressKeyWord').val();
                if(keyWord == '') {
                    swal('请输入关键字。');
                    return;
                }

                if ($.fn.DataTable.isDataTable("#specAddressList")) {
                    $('#specAddressList').DataTable().clear().destroy();
                }

                $('#specAddressList').DataTable({
                    "processing": true,
                    "serverSide": true,
                    "ajax": {
                        url: Drupal.settings.basePath + 'get-address-api-list', // ajax source
                        dataType: 'json',
                        type: 'POST',
                        data: {search: keyWord}
                    },
                    "initComplete": function() {
                        
                    },
                    "drawCallback": function( settings ) {
                        $('td.use_address').find('a').click(function() {
                            var inputId = $('#modalAddressAPIList').find('input#current_address_input_index').val();
                            $('input#' + inputId).val($(this).attr('data-fname'));
                            $('#modalAddressAPIList').modal('hide');
                        });

                        $('[data-toggle="tooltip"]').tooltip();
                    },
                    //"pageLength": 10,
                    "paging": false,
                    "searching":false,
                    "info":     false,
                    "lengthChange": false,
                    "ordering": false,
                    "columns": [
                        { className: "address_country" },
                        { className: "address_province" },
                        { className: "address_city" },
                        { className: "use_address" }
                    ],
                    /*"order": [
                        [1, "desc"]
                    ],*/ // set second column as a default sort by desc
                    "language": {
                        "url" : Drupal.settings.basePath + 'sites/all/modules/custom/custom_admin/datatables/Chinese.txt'
                    }
                });
            });
        }
    
    $('.views-field-field-sw-qwtp').find('a').attr('target', '_blank');
    }
})(jQuery);