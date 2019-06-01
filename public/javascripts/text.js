var id= $('.profile_name').parent().children().last().html();
$("#left-section").load(
    "/profile/"+id
);

function checkprofile(e){
        var id= $(e).parent().parent().children().last().html();
        console.log(id);
        $("#left-section").load(
            "/profile/"+id
        );
};

function newmessage(e){
    var id= $(e).parent().parent().children().last().html();
    $("#middle-section").load(
        "/profile/new/messages/"+id
    );
    for (var i = 1; i <= 1; i++) {
        var tick = function(i) {
            return function() {

                if(i==1){
                    $('.msg-box').animate({
                            scrollTop: $("#msglist li").last().offset().top
                        },
                        'slow');
                }
            }
        };
        setTimeout(tick(i), 50 * i);
    }
};

$('.profile_name').click(function(){
    var id= $(this).parent().children().last().html();
    $("#left-section").load(
        "/profile/"+id
    );
});

$('.all_messages').click(function(){
    $("#left-section").load(
        "/profile/all/messages/"+id
    );
});



