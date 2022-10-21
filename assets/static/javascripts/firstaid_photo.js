
$(document).ready(function(){
    $(".card-img-bottom").css('visibility', 'visible');
})



var scale = 1;
var modal = document.getElementById("imageModal");
var modalImg = document.getElementById("img-show");
var captionText = document.getElementById("caption");
var currentImageId = 0;
$(".card-img-bottom").on('click', function(event){
    event.stopPropagation();
    event.stopImmediatePropagation();
    currentImageId = Number(this.id);
    scale = 1;
    modal.style.display = "block";
    modalImg.src = this.getAttribute('value');
    modalImg.style.transform = "scale(1)"
    captionText.innerHTML = this.alt;
    document.body.style.overflowY = 'hidden';
});

$(".image-background").on('click', function(event){
    if ((event.target.id == "img-show" || $(event.target).parents("#img-show").length) || (event.target.id == "id_zoom-place" || $(event.target).parents("#id_zoom-place").length) || (event.target.id == "id_left-space" || $(event.target).parents("#id_left-space").length) || (event.target.id == "id_right-space" || $(event.target).parents("#id_right-space").length)){ //if clicked on the image

    }
    else{ //if clicked outside the image
        modal.style.display = "none";
        document.body.style.overflowY = 'auto';
    }
});



function goNext(){
    currentImageId = currentImageId + 1;
    console.log(currentImageId)
    imageToDisplay = document.getElementById(`${currentImageId}`)
    if(imageToDisplay != null){
        scale = 1;
        modal.style.display = "block";
        modalImg.src = imageToDisplay.getAttribute('value');
        modalImg.style.transform = "scale(1)"
        captionText.innerHTML = imageToDisplay.alt;
        document.body.style.overflowY = 'hidden';
    }
    else{
        currentImageId = currentImageId - 1;
    }
}
$("#id_right-button").on('click', goNext);

function goPrevious(){
    currentImageId = currentImageId - 1;
    console.log(currentImageId)
    imageToDisplay = document.getElementById(`${currentImageId}`);
    if(imageToDisplay != null){
        scale = 1;
        modal.style.display = "block";
        modalImg.src = imageToDisplay.getAttribute('value');
        modalImg.style.transform = "scale(1)"
        captionText.innerHTML = imageToDisplay.alt;
        document.body.style.overflowY = 'hidden';
    }
    else{
        currentImageId = currentImageId + 1;
    }
}
$("#id_left-button").on('click', goPrevious);

document.addEventListener('keydown', function(){
    if(event.which === 39) {
        goNext();
    }
    if(event.which === 37) {
        goPrevious();
    }
});



function zoomIn(){
    scale = scale + 0.1
    if(scale <= 2){
        var modalImg = document.getElementById("img-show");
        modalImg.style.transform = `scale(${scale})`;
        $("#zoom-out").prop('disabled', false);
    }
    if(scale >= 2){
        $('#zoom-in').prop('disabled', true);
    }
    else{
        $('#zoom-in').prop('disabled', false);
    }
}
$("#zoom-in").on('click', zoomIn);

function zoomOut(){
    scale = scale - 0.1
    if(scale >= 1){
        var modalImg = document.getElementById("img-show");
        modalImg.style.transform = `scale(${scale})`;
        $("#zoom-in").prop('disabled', false);
    }
    if(scale <= 1){
        $('#zoom-out').prop('disabled', true);
    }
    else{
        $('#zoom-out').prop('disabled', false);
    }
}
$("#zoom-out").on('click', zoomOut);

document.addEventListener('keydown', function(){
    if(event.which === 107) {
        zoomIn();
    }
    if(event.which === 109) {
        zoomOut();
    }
});