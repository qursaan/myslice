function logout () {
    var username=$(this).attr('username');
    var msg="Are you sure you want to logout as " + username + " ?";
    if (confirm(msg)) window.location="/logout/";
}
$(document).ready(function() { $('#logout').click(logout); })
