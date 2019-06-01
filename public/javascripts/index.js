$(function () {

    $('.sign-up').hide();
    $('.sign-in').hide();
    $('.all-friends').hide();

    $('.sign-in-btn').click(function () {
        $('.current').hide();
        $('.sign-up').hide();
        $('.sign-in').show();
    });

    $('.sign-up-btn').click(function () {
        $('.current').hide();
        $('.sign-in').hide();
        $('.sign-up').show();
    });

    $('.message').click(function () {
        $('.current').show();
        $('.sign-in').hide();
        $('.sign-up').hide();
    });

    $('.friend').click(function () {
        $('.current').show();
        $('.sign-in').hide();
        $('.sign-up').hide();
    });

    $('.option').click(function () {

        var value = $('.option').text();

        if (value == 'Messages') {

            $('.option').html('Profile');
            $('.user-profile').hide();
            $('.all-friends').show();

        } else {
            $('.option').html('Messages');
            $('.user-profile').show();
            $('.all-friends').hide();
        }
    });

    $('.profile').click(function () {
        $('.user-profile').show();
        $('.all-friends').hide();
    });


})
