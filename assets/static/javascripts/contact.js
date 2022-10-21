
function activeWorkingTable(){
    let curr = new Date();
    const weekNumber = curr.getDay();
    $(`#week-${weekNumber}`).addClass('table-active');
}
activeWorkingTable();


$( "#contactform" ).on('submit', function( event ) {
    event.preventDefault();
    document.getElementById('messageSubmitBtn').disabled = true;
    document.getElementById('submitmessageContact').innerHTML = "Sending....";
    $('#display-alert').html("");
    $.ajax(
    {
        type:'POST',
        url: $(this).attr('action'),
        data:{
            name:$('#nameContact').val(),
            email:$('#emailContact').val(),
            phone:$('#phoneContact').val(),
            message: $('#messageContact').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            document.getElementById('submitmessageContact').innerHTML = ""
            if(response.success == '1')
            {
                $('#nameContact').val('');
                $('#emailContact').val('');
                $('#phoneContact').val('');
                $('#messageContact').val('');
                html = `<div class="alert alert-success alert-dismissible fade show" role="alert" id="successAlert">
                            <strong>Success! </strong>We received your message.<br>We will contact you if needed.
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`
            }
            $('#display-alert').html(html);
            document.getElementById('messageSubmitBtn').disabled = false;
        },
        error:function(response)
        {
            document.getElementById('submitmessageContact').innerHTML = "";
            html = `<div class="alert alert-danger alert-dismissible fade show" role="alert" id="errorAlert">
                        <strong>Error!</strong> Some error occurred.<br>Please try again.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`
            $('#display-alert').html(html);
            document.getElementById('messageSubmitBtn').disabled = false;
        },
    });
    return false;
});