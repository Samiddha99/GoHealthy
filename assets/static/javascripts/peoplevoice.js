


new Autocomplete('#autocomplete-hospital', {
    autoSelect: true,
    search: input => {
        return new Promise(resolve => {
            $("#hospitalId").val('');
            $("#hospitalError").html('')
            if (input.length < 1) {
                return resolve([])
            }
            else{
                data = {
                    'name': input,
                }
                urlDecodedData = $.param(data)
                const url = `/get-hospitals-by-name/?${urlDecodedData}`
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                    resolve(data.hospitals)
                })
            }
        });
    },
    renderResult: (result, props) => {
        renderedHtml = `
        <li ${props}>
            <div class="autocomplete-option-title">
                ${result.Name}
            </div>
            <div class="autocomplete-option-snippet">
                ${result.City}, ${result.Subdivision}, Dist: ${result.District__Name}, ${result.State__Name}, Pin: ${result.Pin} 
            </div>
        </li>
        `
        return renderedHtml;
    },
    getResultValue: result => result.Name,
    onSubmit: result => {
        $("#hospitalId").val(result.id);
    }
});


$("#hospitalName").on('focusout', function(){
    if($(this).val() != '' && $("#hospitalId").val() == ''){
        $("#hospitalError").html("You should select a hospital from the search result if you want to mention a hospital")
    }
});


$("#open-nav").on('click', openNav);
function openNav() {
    document.getElementById("Sidenav").style.width = "100%";
    document.body.style.overflowY = "hidden"
}

$("#close-nav").on('click', closeNav);
function closeNav() {
    document.getElementById("Sidenav").style.width = "0px";
    document.body.style.overflowY = "auto"
}



$("#voiceForm").on('submit', function( event ) {
    event.preventDefault();
    grecaptcha.execute();
    let theForm = new FormData(this)
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    document.getElementById('voiceFormSubmitBtn').disabled = true;
    $('#voiceFormError').html('');
    $('#voiceFormSubmitBtn').html('Submitting')
    $.ajax(
    {
        type:'POST',
        url: $(this).attr('action'),
        data: theForm,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        success:function(response)
        {
            document.getElementById('voiceFormSubmitBtn').disabled = false;
            $('#voiceFormSubmitBtn').html('Submit')
            if(response.status == 'success')
            {
                $("#voiceForm").trigger('reset');
                showSingleButtonAlert('Story Submitted', 'Your story will be publish after approval.<br>It will take maximum 48 hours.', 'OK');
            }
            else if(response.status = 'not success'){
                $('#hospitalError').html('Hospital not found with this keyword!');
            }
            else if(response.status == 'invalidCaptcha')
            {
                $('#voiceFormError').html('Invalid Captcha');
            }
            else
            {
                $('#voiceFormError').html('Error! Please try again');
            }
        },
        error: function(response)
        {
            document.getElementById('voiceFormSubmitBtn').disabled = false;
            $('#voiceFormSubmitBtn').html('Submit')
            $('#voiceFormError').html('Something happened wrong! Try again');
        }
    });
});
