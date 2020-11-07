$(document).ready(function() {
    $.getJSON("../Json/PF.json", function(result) {
        $.each(result.Preperation, function(i, field) {
            $("#Preperation").append("<li>" + result.Preperation[i] + "</li>");
        });
        $.each(result.Food, function(i, field) {
            $("#Food").append("<li>" + result.Food[i] + "</li>");
        });
    });
});