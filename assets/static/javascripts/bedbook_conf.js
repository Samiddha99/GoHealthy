$(document).ready(function() {
    document.body.scrollTop = 2;
    document.documentElement.scrollTop = 2;
});


$("#open_print").on('click', function(){
    frames['print_frame'].print()
});