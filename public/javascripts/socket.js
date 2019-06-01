socket = io();
// set socket id to user_id
let user_id= $('.login_user_id').text();
socket.emit('addidtosocket',{id:user_id});


let mlist = $('#msglist');
let message = $('#message_box');

$("#message_box").keypress(function(e) {
    if(e.keyCode == 13 && message.val() != "" ) {

            var user_id = $('.msg_user_id').text();
            var friend_id = $('.msg_friend_id').text();

            mlist.append(`<li class="chat__bubble chat__bubble--sent"> ${message.val()} </li>`);
            socket.emit('newmsg',{user_id:user_id, friend_id:friend_id, message:message.val()});
            $(".msg-box").animate({
                scrollTop: $('.msg-box')[0].scrollHeight - $('.msg-box')[0].clientHeight
            }, 300);
        document.getElementById('message_box').value = '';

    }
    if(message.val() == "")
    $('.send').removeClass("opacity");

});

function sendmsg( user_id, friend_id){
   if(message.val() != ""){
       mlist.append(`<li class="chat__bubble chat__bubble--sent"> ${message.val()} </li>`);
       socket.emit('newmsg',{user_id:user_id, friend_id:friend_id, message:message.val()});
       document.getElementById('message_box').value = '';
       $(".msg-box").animate({
           scrollTop: $('.msg-box')[0].scrollHeight - $('.msg-box')[0].clientHeight
       }, 300);

   }
};

socket.on('receive_message',(data)=>{
    console.log('here the reciver message socket working fine');
    mlist.append(`<li class="chat__bubble chat__bubble--rcvd"> ${data.message} </li>`);
    $(".msg-box").animate({
        scrollTop: $('.msg-box')[0].scrollHeight - $('.msg-box')[0].clientHeight
    }, 300);
});

function openchat(id){
    $("#middle-section").load(
        "/profile/new/messages/"+id
    );

}


$(function () {

 /* let loginContainer = $('#login-container');
  let chatContainer = $('#chat-container');

  chatContainer.hide();

  let username = $('#username');
  let login = $('#login');
  let message = $('#message');
  let send = $('#send');
  let list = $('#list');

    var x = document.getElementById("demo1");
    var y = document.getElementById("demo2");


    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function error(){
        x.value = "error occur ";
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(showPosition,error,options);
        } else {
            x.value = "Geolocation is not supported by this browser.";}
    }


    function showPosition(position) {
        x.value= position.coords.latitude;
        y.value = position.coords.longitude;
    }

    getLocation();


    let aaa = setInterval(function () {
        socket.emit('posi',{
            lati : x.value,
            long : y.value,
        })
    },1000);

    setTimeout(function () {
        clearInterval(aaa);
    },2000);


    login.click(function () {
        socket.emit('login', {username: username.val()});
        socket.emit('posi',{
            lati : x.value,
            long : y.value,
        });
    });*/


    let list = $('#list');

    socket.emit('get_new_user',{});
    socket.on('all_active',(data)=>{
        var s = "";
        for(let i=0;i<data.all_member.length;i++){

            s += ` <li ><div class="member"> <img class="img" src="${data.all_member[i].imagePath}">
                    <div class="details">
                        <div class="name">${data.all_member[i].name}</div>
                        <div class="distance">Near</div>
                    </div>
                    <div class="module">
                        <div class="message" onclick="newmessage(this)">Message</div>
                        <div class="profile" onclick="checkprofile(this)">Profile </div>
                    </div>
                    <p style="display: none">${data.all_member[i].user}</p></div>
                   
                </li>`;
        }
        list.empty();
        list.append(s);
    });



    /*setInterval(function () {
        list.empty();
        socket.emit('print',{});
    },5000);*/


});
