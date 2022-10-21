$(".set-before").on('keyup', hourMinuteInput);
$(".set-before").on('change', hourMinuteInput);
function hourMinuteInput(){
    $(".set-before-error").html('');
    let max = $(this).attr('max');
    let maxDigitLength = max.length;
    let value = $(this).val();
    if(value.length > maxDigitLength || value.length < maxDigitLength){
        value = Number(value).toString().padStart(maxDigitLength, '0');
        $(this).val(value);
    }
    let min = $(this).attr('min').padStart(maxDigitLength, '0');

    if(Number(value) > Number(max)){
        $(this).val(max)
    }
    if(Number(value) < Number(min)){
        $(this).val(min)
    }
}
$(".set-before").on('change', hourMinuteInputValidation);
$(".set-before").on('keyup', hourMinuteInputValidation);
function hourMinuteInputValidation(){
    $(`#set-reminder-form-submit`).prop('disabled', false);
    let hh = Number($(`#set-before-hh`).val());
    let mm = Number($(`#set-before-mm`).val());
    if(hh <= 0 && mm <= 0){
        $(`#set-before-error`).html(`You can set reminder minimum 30 minute before`);
        $(`#set-reminder-form-submit`).prop('disabled', true);
    }
}

$("#setReminderModal").on("show.bs.modal", function(){
    $("#set-reminder-form").trigger('reset');
});
$("#setReminderModal").on("hide.bs.modal", function(){
    $("#set-reminder-form").trigger('reset');
});
$("#set-reminder-form").on('reset', function(event){
    $("#set-reminder-form").prop('disabled', false)
    $("#set-reminder-form-submit").prop('disabled', false);
    $("#set-reminder-form-submit-text").html('SET');
    $(`#set-before-error`).html("");
    $(`#set-before-success`).html("");
    $(".add-to-calender-button").css('visibility', 'hidden');
});

$("#set-reminder-form").on('submit', function(event){
    event.preventDefault();
    let theForm = new FormData(this)
    let csrf = $('input[name=csrfmiddlewaretoken]').val()
    theForm.append('csrfmiddlewaretoken', csrf);
    $(this).prop('disabled', true);
    $(`#set-reminder-form-submit-text`).html(`<i class="fa-regular fa-loader fa-spin"></i>`);
    $(`#set-reminder-form-submit`).prop('disabled', true);
    $(`#set-before-error`).html("");
    $(`#set-before-success`).html("");
    $.ajax(
    {
        type:'POST',
        url: "/set-blood-donation-camp-reminder/",
        data: theForm,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        success:function(response)
        {
            $("#set-reminder-form").prop('disabled', false);
            $("#set-reminder-form-submit-text").html("SET");
            $("#set-reminder-form-submit").prop('disabled', false);
            if(response.error == '0'){
                $(`#alarm_reminder`).html(response.send_before_minute)
                $(".add-to-calender-button").css('visibility', 'visible');
                $(`#set-before-success`).html(response.message);
            }
            else if(response.error == '1'){
                $(`#set-before-error`).html(response.message)
            }
            else{
                $(`#set-before-error`).html("Error occurred. Try again!");
            }
        },
        error:function(response)
        {
            $("#set-reminder-form").prop('disabled', false);
            $("#set-reminder-form-submit-text").html("SET");
            $("#set-reminder-form-submit").prop('disabled', false);
            $(`#set-before-error`).html("Error occurred. Try again!");
        },
    });
});


timer = function (targetTime)
{
    // Update the count down every 1 second
    varInterval = setInterval(function(){
        var next = new Date(targetTime);
        var now = new Date();
        timeleft = next - now;

        var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

        // If the count down is finished
        if (timeleft <= 0)
        {
            $("#day-remain").html('00');
            $("#hour-remain").html('00');
            $("#minute-remain").html('00');
            $("#second-remain").html('00');
            clearInterval(varInterval);
        }
        else{
            $("#day-remain").html((days <= 9) ? `0${days}` : days);
            $("#hour-remain").html((hours <= 9) ? `0${hours}` : hours);
            $("#minute-remain").html((minutes <= 9) ? `0${minutes}` : minutes);
            $("#second-remain").html((seconds <= 9) ? `0${seconds}` : seconds);
        }
    }, 1000);
}

var time_start = $("#time_start").val();
var time_end = $("#time_end").val();
var date_start = $("#date_start").val();
var date_end = $("#date_end").val();

var datetime_start = `${date_start} ${time_start}`;

var today = new Date();

var today_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

var last_day_start_time = new Date(`${date_end} ${time_start}`);

if(date_end != 'None' && today <= last_day_start_time){
    console.log('000')
    if(today <= new Date(`${today_date} ${time_start}`)){
        var today_start_at = `${today_date} ${time_start}`;
        timer(today_start_at);
    }
    else if(today > new Date(`${today_date} ${time_end}`)){
        today.setDate(today.getDate()+1)
        if(today <= last_day_start_time){
            tomorow_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            tomorow_start_at = `${tomorow_date} ${time_start}`;
            timer(tomorow_start_at)
        }
    }
}
else{
    timer(datetime_start);
}