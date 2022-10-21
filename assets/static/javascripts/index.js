

$(window).on('load', function(){
    $(".loading-image-background").fadeOut(4000);
    document.body.style.overflowY = 'auto'
});



var totalVisitors = String($('#totalVisitorsText').text());
document.getElementById('totalVisitors').innerHTML = '';
var Speed = 1000;
var p = 0;
var changePosition = [];

function updateTotalVisitor(newTotalVisitors){
    var newTotalVisitors = String(newTotalVisitors)
    var newText = '';
    
    for(k=0; k<newTotalVisitors.length; k++)
    {
        if(newTotalVisitors[k] != totalVisitors[k]){
            changePosition.push(k)
        }
    }
    

    visitorChange = setInterval(function(){
        var audio = document.getElementById('slice-sound');
        audio.volume = 0.4;
        newText = $(`#total-visitors-text-${changePosition[p]}`).text();
        var domElement = document.getElementById(`total-visitors-text-${changePosition[p]}`);

        $(`#total-visitors-text-${changePosition[p]}`).removeClass('number-new');
        $(`#total-visitors-text-${changePosition[p]}`).addClass('number-hiding');
        
        myVar = setTimeout(function(){
            if(domElement != null){
                domElement.innerHTML = newTotalVisitors[changePosition[p-1]];
            }
            else{
                $('#totalVisitors').append(`<span class="back-board" id="total-visitors-${changePosition[p-1]}"><span class="back-board-text" id="total-visitors-text-${changePosition[p-1]}" style="visibility: hidden">${newTotalVisitors[changePosition[p-1]]}</span></span>`);
            }
            audio.play();
            $(`#total-visitors-text-${changePosition[p-1]}`).removeClass('number-hiding');          
            $(`#total-visitors-text-${changePosition[p-1]}`).addClass('number-new');
            $(`#total-visitors-text-${changePosition[p-1]}`).css('visibility', 'visible')
        }, 400);
        
        p = p+1;
        if(changePosition.length <= p){
            clearInterval(visitorChange);
        }
        
    }, Speed);
}

$(document).ready(function() {
    for(j=0; j<totalVisitors.length; j++){
        document.getElementById('totalVisitors').innerHTML += `<span class="back-board"><span class="back-board-text" id="total-visitors-text-${j}" style="visibility: visible;">${totalVisitors[j]}</span></span>`;
    }
});



var liveDataSource;
var liveSiteVisitorData =  function() {
    var uri = `/events/live-site-visitor/`;
    liveDataSource = new ReconnectingEventSource(uri);
    liveDataSource.addEventListener('message', function (event) {
        var eventData = JSON.parse(event.data);
        updateTotalVisitor(eventData['total_visitor']);
    }, false);
}
$(document).ready(function(){
    liveSiteVisitorData();
});



function randomColorText()
{
    var speed = 800;
    randomColor = setInterval(function(){
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
            $(".random-color").css("color", color);
            }
    }, speed);
}
randomColorText();



var speed = 300;
var i1 = 0;
var txt1 = 'Low Bed Availability';
var writing1 = 1;
var erasing1 = 0;
var textWriting1
var textErasing1;
var textAnimation1;
var temp1;
var sleep1 = 0;
textWriting1 = function()
{
    if(writing1 == 1)
    {
        if (i1 < txt1.length) {
            writing1 = 1;
            erasing1 = 0;
            document.getElementById("lowBedText").innerHTML += txt1.charAt(i1);
            i1++;
        }
        else
        {
            temp1 = txt1;
            writing1 = 0;
            erasing1 = 1;
            sleep1 = 0;
        }
    }
}
textErasing1 = function()
{
    if(erasing1 == 1)
    {
        if (i1 >= 0)
        {
            writing1 = 0;
            erasing1 = 1;
            temp1 = temp1.substr(0,temp1.length-1);;
            document.getElementById("lowBedText").innerHTML = temp1;
            i1--;
        }
        else
        {
            writing1 = 1;
            erasing1 = 0;
            sleep1 = 0;
        }
    }
}
function textAnimation1()
{
    startTyping1 = setInterval(function(){
        textWriting1();
        if(writing1 == 0 && sleep1 < 15)
        {
            sleep1 = sleep1 +1;
        }
        if(sleep1 >= 15)
        {
            textErasing1();
        }
    }, speed);
}
textAnimation1();



var speed = 300;
var i2 = 0;
var txt2 = 'Low Numbers of Hospitals';
var writing2 = 1;
var erasing2 = 0;
var textWriting2
var textErasing2;
var textAnimation2;
var temp2;
var sleep2 = 0;
textWriting2 = function()
{
    if(writing2 == 1)
    {
        if (i2 < txt2.length) {
            writing2 = 1;
            erasing2 = 0;
            document.getElementById("lowHospitalText").innerHTML += txt2.charAt(i2);
            i2++;
        }
        else
        {
            temp2 = txt2;
            writing2 = 0;
            erasing2 = 1;
            sleep2 = 0;
        }
    }
}
textErasing2 = function()
{
    if(erasing2 == 1)
    {
        if (i2 >= 0)
        {
            writing2 = 0;
            erasing2 = 1;
            temp2 = temp2.substr(0,temp2.length-1);;
            document.getElementById("lowHospitalText").innerHTML = temp2;
            i2--;
        }
        else
        {
            writing2 = 1;
            erasing2 = 0;
            sleep2 = 0;
        }
    }
}
function textAnimation2()
{
    startTyping2 = setInterval(function(){
        textWriting2();
        if(writing2 == 0 && sleep2 < 15)
        {
            sleep2 = sleep2 +1;
        }
        if(sleep2 >= 15)
        {
            textErasing2();
        }
    }, speed);
}
textAnimation2();



var speed = 300;
var i3 = 0;
var txt3 = 'Low Numbers of Doctors';
var writing3 = 1;
var erasing3 = 0;
var textWriting3;
var textErasing3;
var textAnimation3;
var temp3;
var sleep3 = 0;
textWriting3 = function()
{
    if(writing3 == 1)
    {
        if (i3 < txt3.length) {
            writing3 = 1;
            erasing3 = 0;
            document.getElementById("lowDoctorText").innerHTML += txt3.charAt(i3);
            i3++;
        }
        else
        {
            temp3 = txt3;
            writing3 = 0;
            erasing3 = 1;
            sleep3 = 0;
        }
    }
}
textErasing3 = function()
{
    if(erasing3 == 1)
    {
        if (i3 >= 0)
        {
            writing3 = 0;
            erasing3 = 1;
            temp3 = temp3.substr(0,temp3.length-1);;
            document.getElementById("lowDoctorText").innerHTML = temp3;
            i3--;
        }
        else
        {
            writing3 = 1;
            erasing3 = 0;
            sleep3 = 0;
        }
    }
}
function textAnimation3()
{
    startTyping3 = setInterval(function(){
        textWriting3();
        if(writing3 == 0 && sleep3 < 15)
        {
            sleep3 = sleep3 +1;
        }
        if(sleep3 >= 15)
        {
            textErasing3();
        }
    }, speed);
}
textAnimation3();



var speed = 300;
var i4 = 0;
var txt4 = 'Blood Crisis';
var writing4 = 1;
var erasing4 = 0;
var textWriting4;
var textErasing4;
var textAnimation4;
var temp4;
var sleep4 = 0;
textWriting4 = function()
{
    if(writing4 == 1)
    {
        if (i4 < txt4.length) {
            writing4 = 1;
            erasing4 = 0;
            document.getElementById("bloodCrisisText").innerHTML += txt4.charAt(i4);
            i4++;
        }
        else
        {
            temp4 = txt4;
            writing4 = 0;
            erasing4 = 1;
            sleep4 = 0;
        }
    }
}
textErasing4 = function()
{
    if(erasing4 == 1)
    {
        if (i4 >= 0)
        {
            writing4 = 0;
            erasing4 = 1;
            temp4 = temp4.substr(0,temp4.length-1);;
            document.getElementById("bloodCrisisText").innerHTML = temp4;
            i4--;
        }
        else
        {
            writing4 = 1;
            erasing4 = 0;
            sleep4 = 0;
        }
    }
}
function textAnimation4()
{
    startTyping4 = setInterval(function(){
        textWriting4();
        if(writing4 == 0 && sleep4 < 15)
        {
            sleep4 = sleep4 +1;
        }
        if(sleep4 >= 15)
        {
            textErasing4();
        }
    }, speed);
}
textAnimation4();



var speed = 300;
var i5 = 0;
var txt5 = 'Delay in Emergency Treatment';
var writing5 = 1;
var erasing5 = 0;
var textWriting5;
var textErasing5;
var textAnimation5;
var temp5;
var sleep5 = 0;
textWriting5 = function()
{
    if(writing5 == 1)
    {
        if (i5 < txt5.length) {
            writing5 = 1;
            erasing5 = 0;
            document.getElementById("delayTreatment").innerHTML += txt5.charAt(i5);
            i5++;
        }
        else
        {
            temp5 = txt5;
            writing5 = 0;
            erasing5 = 1;
            sleep5 = 0;
        }
    }
}
textErasing5 = function()
{
    if(erasing5 == 1)
    {
        if (i5 >= 0)
        {
            writing5 = 0;
            erasing5 = 1;
            temp5 = temp5.substr(0,temp5.length-1);;
            document.getElementById("delayTreatment").innerHTML = temp5;
            i5--;
        }
        else
        {
            writing5 = 1;
            erasing5 = 0;
            sleep5 = 0;
        }
    }
}
function textAnimation5()
{
    startTyping5 = setInterval(function(){
        textWriting5();
        if(writing5 == 0 && sleep5 < 15)
        {
            sleep5 = sleep5 +1;
        }
        if(sleep5 >= 15)
        {
            textErasing5();
        }
    }, speed);
}
textAnimation5();

