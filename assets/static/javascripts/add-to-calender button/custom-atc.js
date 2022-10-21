window.addeventasync = function(){
    addeventatc.settings({
        appleical  : {show:true, text:"Apple Calendar"},
        google     : {show:true, text:"Add to Google Calender <em>(online)</em>"},
        office365  : {show:true, text:"Use Office 365 <em>(online)</em>"},
        outlook    : {show:true, text:"Add to Outlook"},
        outlookcom : {show:true, text:"Use Outlook.com <em>(online)</em>"},
        yahoo      : {show:true, text:"Add to Yahoo Calender <em>(online)</em>"},
        facebook   : {show:true, text:"Facebook"},
        dropdown : {order:"google,appleical,office365,outlook,outlookcom,yahoo,facebook"},
        mouse : false,
    });
};