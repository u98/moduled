let config = {
    host: 'http://localhost:8000',
    pagination: 5
}
let app = {
    pagination: {},
    render: (url) => {
        $('.background-loading').show();
        let result;
        $.ajax({
            type: 'get',
            url: url
        }).done(e => {
            let count = e.data.length / config.pagination;
            let str = $('.item-airline').html();
            let re = /{{([^{}]*)}}/g;
            $('.add-new-list-item').html('');
            e.data.forEach( function(element, index) {
                result = str.replace(re, (match, group) => {
                    return element[group];
                });
                $('.add-new-list-item').append(result);
            });
            $('.pagination').html('');
            $('.pagination').append(`<li onclick="app.render(\'${e.path}?page=0\')">&laquo;</li>`);
            $('.pagination').append(`<li onclick="app.pagination.prev(\'${e.path}\');">&lsaquo;</li>`);
            for (var i = 1; i <= e.last_page; i++) {
                if (e.current_page == i)
                    $('.pagination').append(`<li onclick="app.render(\'${e.path}?page=${i}\')" class="active">${i}</li>`);
                else
                    $('.pagination').append(`<li onclick="app.render(\'${e.path}?page=${i}\')">${i}</li>`);
            }
            $('.pagination').append(`<li onclick="app.pagination.next(\'${e.path}\', \'${e.last_page}\');">&rsaquo;</li>`);
            $('.pagination').append(`<li onclick="app.render(\'${e.path}?page=${e.last_page}\')">&raquo;</li>`);
            $('.background-loading').hide();
            $('.flight-list').show();
        });
    }
}

$(document).ready(() => {
    $('.item-airline').hide();
    $('.flight-list').hide();
    $('#return_date').prop('disabled', true);
    $('.radio input[name="flight_type"]').change((e) => {
        if (e.target.value !== 'return') {
            $('#return_date').prop('disabled', true);
            $('#return_date').prop('required', false);
            $('#return_date').val('');
        }
        else {
            $('#return_date').prop('disabled', false);
            $('#return_date').prop('required', true);
        }
    });
    $('#form-booking').submit((e) => {
        e.preventDefault();
        let depar_date = $('#departure_date').val();
        let return_date = $('#return_date').val();
        let url = `${config.host}/api/v1/get-flight/${depar_date}/${return_date}`;
        app.render(url);
        console.log($('#form-booking').serializeArray());
        // return false;
    });
    $('.btn-confirm').click(() => {
        $('.model-confirm').modal('hide');
        $('main .container').find('section').hide();
    });
    $('.login-form').submit((e) => {
        e.preventDefault();
        $.ajax({
            url: `${config.host}/api/v1/auth/login`,
            method: 'POST',
            asyn: false,
            dataType: 'json',
            data: JSON.stringify({
                user: 'admin',
                password: 'adminpass'
            }),
        }).done(e => {
            console.log(e);
        });
    });
    $.ajax({
    	url: `${config.host}/api/v1/test`,
    	method: 'OPTIONS',
		contentType: "application/json",
    	data: JSON.stringify({
                user: 'admin',
                password: 'adminpass'
        }),
        }).done(e => {
            console.log(e);
        });
});

app.pagination.prev = (url) => {
    let current = Number($('.pagination > li.active').text());
    if (current > 1)
        app.render(`${url}?page=${current-1}`);
}
app.pagination.next = (url, max) => {
    let current = Number($('.pagination > li.active').text());
    if (current < Number(max) )
        app.render(`${url}?page=${current+1}`);
}
app.select = (e) => {
    let parent = $(e).parent().parent();
    let airline_name = parent.find('#airline_name').text();
    let price = parent.find('#price').text();
    let flight_time = parent.find('#flight_time').text();
    $('.confirm-modal').find('#airline_name').text(airline_name);
    $('.confirm-modal').find('#price').text(price);
    $('.confirm-modal').find('#flight_time').text(flight_time);
}