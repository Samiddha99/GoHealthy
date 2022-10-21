$('#resetPassword').on('submit', function(e) {
    e.preventDefault();
    document.getElementById("sucmessage").innerHTML = "<div class='spinner-border text-success' role='status'></div>"
        $.ajax(
        {
            type:'POST',
            url: $(this).attr('action'),
            data:{
                username:$('#reset_username').val(),
                email:$('#reset_email').val(),
                csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
            dataType: 'json',
            cache: false,
            success:function(response)
            {
                message = response.message;
                if(response.error === "1")
                {
                    document.getElementById("sucmessage").innerHTML = `<b class='text-danger'>${message}</b>`;
                }
                else if(response.error === "2")
                {
                    document.getElementById("sucmessage").innerHTML = `<b class='text-warning'>${message}</b>`
                }
                else if(response.error === "0")
                {
                    document.getElementById("sucmessage").innerHTML = `<b class='text-success'>${message}</b>`;
                }
            },
            error: function(response)
            {
                document.getElementById("sucmessage").innerHTML = "<b class='text-danger'>Failed to Send Reset Link!</b>"
            },
        });
   });