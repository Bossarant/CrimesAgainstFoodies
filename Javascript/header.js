var pathname = window.location.pathname; // Returns path only (/path/example.html)
$(function() {
    $('#head').prepend('<div class="header"></div>')
    $('.header').append('<a href="../Home" class="logo">Crimes Against Foodies</a>')
    $('.header').append('<div class="header-right"></div>')
    if (pathname == "/About/") {
        $('.header-right').append('<a href="../Home">Home</a>')
        $('.header-right').append('<a class="active" href="../About">About</a>')
        $('.header-right').append('<a href="../List">List</a>')
    } else if (pathname == "/Home/") {
        $('.header-right').append('<a class="active" href="../Home">Home</a>')
        $('.header-right').append('<a href="../About">About</a>')
        $('.header-right').append('<a href="../List">List</a>')
    } else if (pathname == "/List/") {
        $('.header-right').append('<a href="../Home">Home</a>')
        $('.header-right').append('<a href="../About">About</a>')
        $('.header-right').append('<a class="active" href="../List">List</a>')
    }
})