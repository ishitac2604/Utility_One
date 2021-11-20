const year = new Date().getFullYear();
$(".copyright").text("© Copyright " + year + " Ishita Chandra")
console.log("hey");

$('.flipper').click(function(){
    $(this).toggleClass("flip");
});
