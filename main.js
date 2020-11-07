function btn() {
    var x = false
    if (x == false) {
        $('.all').css('border', '1px solid lightskyblue')
        var x = true
    }
    game()
}



$(document).ready(function() {
    fetch('../Json/PF.json')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            Json = data
        })
        .catch((err) => {
            // Do something for an error here
            alert("something went wrong" + err)
        })

})

function getPreperation() {
    var varPreperation =
        Json.Preperation[parseInt(Math.random() * Json.Preperation.length)]
    return varPreperation
}

function getfood() {
    var varfood =
        Json.Food[parseInt(Math.random() * Json.Food.length)]
    return varfood
}

function game() {
    $("#one").html(getPreperation())
    $("#two").html(getfood())
    $("#three").html(getPreperation())
    $("#four").html(getfood())
    $("#and").html("and")
}
$("#footer").css("color", "white")