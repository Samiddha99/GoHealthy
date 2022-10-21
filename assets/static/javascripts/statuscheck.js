$('#bookstatusCheck').on('submit', function(event){
    event.preventDefault();
    $('#bedbook-status-btn').html('Checking....');
    $('#booking-error').html("")
    $.ajax(
    {
        type:'POST',
        url: $(this).attr('action'),
        data: {
            type: 'Bed_Book',
            id: $('#bookId').val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response){
            $('#bedbook-status-btn').html('Check Status');
            if(response.has_book == 'No'){
                html = `<h3>Booking Not Found!</h3>
                        <p>May be Patient referenced to this booking has been released from the hospital many days ago or no booking was done with this Id. </p>`
                $('#booking-error').html(html)
            }
            else if(response.has_book == 'Yes'){
                location.href =response.url
            }
        },
        error:function(){
            $('#bedbook-status-btn').html('Check Status');
            html = `<h3>Error!</h3>
                    <p>We are facing some error at the moment. Please try again later.</p>`;
            $('#booking-error').html(html)
        }
    });
});

$('#complaintstatusCheck').on('submit', function(event){
    event.preventDefault();
    $(".status-image").css('display', 'none');
    $("#complaint-show").css('display', 'none');
    $('#compalint-status-btn').prop('disabled', true);
    $('#compalint-status-btn').html('Checking....');
    $('#complaint-error').html("")
    $.ajax(
    {
        type:'POST',
        url: $(this).attr('action'),
        data: {
            type: 'Complaint',
            id: $('#complaintId').val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response){
            $('#compalint-status-btn').html('Check Status');
            $('#compalint-status-btn').prop('disabled', false);
            if(response.has_Complaint == 'No'){
                html = `<h3> Complaint Not Found!</h3>
                        <p>May be you type wrong Complaint ID or Your complaint is already resolved so many days ago.</p>`;;
                $('#complaint-error').html(html)
            }
            else if(response.has_Complaint == 'Yes'){
                $("#complaint-id").html(response.complaint[0].Complain_Id);
                $("#complaint-name").html(response.complaint[0].Name);
                $("#complaint-email").html(response.complaint[0].Email);
                $("#complaint-contact").html(response.complaint[0].Phone);
                $("#complaint-address").html(response.complaint[0].Address);
                $("#complaint-state").html(response.complaint[0].State__Name);
                $("#complaint-district").html(response.complaint[0].District__Name);
                $("#complaint-pin").html(response.complaint[0].Pin);
                $("#complaint-city").html(response.complaint[0].City);
                $("#complaint-subdivision").html(response.complaint[0].Subdivision);
                $("#complaint-language").html(`${response.complaint[0].Language__Language} (${response.complaint[0].Language__Local_Script})`);
                $("#complaint-subject").html(response.complaint[0].Subject);
                $("#complaint-complain").html(response.complaint[0].Complain);
                $("#complaint-date").html(formatDateTime(response.complaint[0].Complaint_Time));
                $("#complaint-attachment").html(`<a href="${response.attachment_url}" target="_blank">${response.attachment_Name}</a>`)
                $("#status-"+response.complaint[0].Status).css('display', 'block');
                $("#complaint-show").css('display', 'block');
            }
        },
        error:function(){
            $('#compalint-status-btn').prop('disabled', false);
            $('#compalint-status-btn').html('Check Status');
            html = `<h3>Error!</h3>
                    <p>We are facing some error at the moment. Please try again later.</p>`;
            $('#complaint-error').html(html)
        }
    });
});
