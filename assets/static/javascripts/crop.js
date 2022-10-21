// import Cropper from 'cropperjs';
var cropper
var cropStartFunction = function(){}
var cropDoneFunction = function(){}

$('#cropModal').on('shown.bs.modal', function (event) {
    cropStartFunction()
})
$("#crop-done").on('click', function(){
    cropDoneFunction()
})

function initializeImageCroper({image_src, aspect_ratio=NaN, display_image='', image_input='', afterCropFunction=undefined}={}){
    $('#image-to-be-crop').attr('src', image_src);
    cropStartFunction = function(){
        const image = document.getElementById('image-to-be-crop');
        cropper = new Cropper(image, {
            aspectRatio: aspect_ratio,
            viewMode: 1,
            initialAspectRatio: aspect_ratio,
            autoCropArea: 1,
            responsive: true,
            restore: false,
            background: false,
            autoCrop: true,
            movable: false,
            zoomOnTouch: false,
            zoomOnWheel: false,
        });
    }
    $('#cropModal').modal('show')

    cropDoneFunction = function(){
        cropedImage = cropper.getCroppedCanvas({
            fillColor: "#e1e0e0",
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        })
        if(display_image != ''){
            $(display_image).attr('src', cropedImage.toDataURL());
        }
        
        cropedImage.toBlob(function(blob){ // convert croped image to blob format
            let random_no = Math.floor(Math.random() * (999999999-1) + 9999999)
            let fileName = `user_croped_image-${random_no}.png`
            let file = new File([blob], fileName, {type: "image/png",}); //convert blob formated image to a image file
            let container = new DataTransfer(); 
            container.items.add(file);
            document.querySelector(image_input).files = container.files; // set the image to te file-input field
            
            if(afterCropFunction != undefined){
                afterCropFunction()
            }
            $('#cropModal').modal('hide')
        })
    }
}
$('#cropModal').on('hidden.bs.modal', function (event) {
    cropper.destroy()
})

$("#crop-reset").on("click", function(){
    cropper.reset()
})
$("#crop-rotate-left").on("click", function(){
    cropper.rotate(-90)
})
$("#crop-rotate-right").on("click", function(){
    cropper.rotate(90)
})
var scaleX = -1
$("#crop-flip-horizental").on("click", function(){
    cropper.scaleX(scaleX)
    scaleX *= -1
})
var scaleY = -1
$("#crop-flip-vertical").on("click", function(){
    cropper.scaleY(scaleY)
    scaleY *= -1
})
