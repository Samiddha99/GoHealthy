$("#reset").on('click', cancelAll);
function cancelAll()
{
    document.getElementById("statusId").innerHTML = ""
    document.getElementById("resultId").innerHTML = ""
}

$(".digit-btn").on('click', putinput)
function putinput()
{
    var toggle_status = $('#input_for').prop('checked');
    let value = $(this).val();
    if (toggle_status == true)
    {
        prev = $('#weight').val()

        var res = prev.concat(value);
        $('#weight').val(res);
    }
    if (toggle_status == false)
    {
        prev = $('#height').val();

        var res = prev.concat(value);
        $('#height').val(res);
    }
}

$("#erase").on('click', erasefield);
function erasefield()
{
    var toggle_status = $('#input_for').prop('checked');
    if (toggle_status == true)
    {
        prev = $('#weight').val();

        var res = prev.slice(0, -1);
        $('#weight').val(res);
    }
    if (toggle_status == false)
    {
        prev = $('#height').val()

        var res = prev.slice(0, -1);
        $('#height').val(res);
    }
}




$('#calbmi').on('submit',function(e) {
    e.preventDefault();
    $.ajax(
    {
        type:'POST',
        url: $(this).attr('action'),
        data:{
            weight:$('#weight').val(),
            height:$('#height').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
        },
        dataType: 'json',
        cache: false,
        success:function(response)
        {

            if(response.error === "1"){
                $('#statusId').hide();
                $('#resultId').hide();
                $('#errorId').show();
                document.getElementById("errorId").innerHTML = "<h6 style='color:red;'>Error! Provide Correct Input</h6>"
            }
            else{
                $('#errorId').hide();
                $('#statusId').show();
                $('#resultId').show();
                var answer = Number(response.result);
                if(answer < 18.5)
                {
                    document.getElementById("statusId").innerHTML = "<h6 style='font-size:17px'>STATUS</h6> <h6 style='color:blue;'>"+response.status+"</h6>"
                }
                else if(answer >= 18.5  && answer <= 24.9)
                {
                    document.getElementById("statusId").innerHTML = "<h6 style='font-size:17px'>STATUS</h6> <h6 style='color:green;'>"+response.status+"</h6>"
                }
                else if(answer >= 25 && answer <= 29.9)
                {
                    document.getElementById("statusId").innerHTML = "<h6 style='font-size:17px'>STATUS</h6> <h6 style='color:yellow;'>"+response.status+"</h6>"
                }
                else if(answer >= 30 && answer <= 34.9)
                {
                    document.getElementById("statusId").innerHTML = "<h6 style='font-size:17px'>STATUS</h6> <h6 style='color:orange;'>"+response.status+"</h6>"
                }
                else
                {
                    document.getElementById("statusId").innerHTML = "<h6 style='font-size:17px'>STATUS</h6><h6 style='color:red;margin-top:-12px;'>"+response.status+"</h6>"
                }
                document.getElementById("resultId").innerHTML = "<h6 style='font-size:17px; padding-top:5px'><span>BMI:  &nbsp</span><span style='color:green;'>"+response.result+"</span></h6>"
            }
        },
        error: function(response)
        {
            $('#statusId').hide();
            $('#resultId').hide();
            document.getElementById("otpveifymessage").innerHTML = "<h6 style='color:red'>Error!</h6>"
        },
    });
});


