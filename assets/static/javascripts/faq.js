$(".btn-faq").on('click', function(){
    $(".btn-faq").removeClass('clicked');
    $(this).addClass('clicked');
    $(".question-section").removeClass('active')
    let section = $(this).attr('data-target');
    $(section).addClass('active');
});