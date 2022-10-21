$(".form-cancel-book").on('submit', function(e){
    e.preventDefault();
    id = $(this).attr('data-id');

    document.getElementById('cancel'+id).innerHTML = "<i class='far fa-spinner fa-spin'></i>";
    document.getElementById('cancelBtnModal'+id).innerHTML = "Canceling";
    $.ajax(
    {
        type:'POST',
        url: $(this).attr('action'),
        data:{
            bookId:id,
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            },
        dataType: 'json',
        cache: false,
        success:function(response)
        {
            $('#cancelBookModal'+id).modal('hide');
            if(response.error === "0")
            {
                document.getElementById('card'+response.id).remove();
                if(response.haveBook == '0')
                {
                    document.getElementById('noBookContent').style.display = 'block';

                }
                else
                {
                    document.getElementById('noBookContent').style.display = 'none';
                }
            }

        },
    });
});