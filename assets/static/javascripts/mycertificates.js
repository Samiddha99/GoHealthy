
var page = 1;

$("#certificatesSearch").on('submit', function(event){
    event.preventDefault();
    $("#filter_search").html('Searching');
    page = 1
    lookingFor = 'Filter';
    updateURI({lookingFor: lookingFor});
    loadCertificates();

});
$("#filter_clear").on('click', function(){
    $("#certificatesSearch").trigger('reset');
    page = 1
    lookingFor = 'All';
    updateURI({lookingFor: lookingFor});
    loadCertificates();
});


var worker_load_certificates = new Worker('/static/javascripts/certificates_worker.js');


function updateURI({lookingFor='All'}={}){
    var targetURL = $("#certificatesSearch").attr('action');
    if(lookingFor != 'All'){
        data = $("#certificatesSearch").serializeToJSON({
            parseBooleans: false,
        }); //get form data in json format
        targetURL += '?' + $.param(data); //form data to uri
    }
    history.pushState({page: 1}, document.title, targetURL); //update url
}

function loadCertificates({callbacks=undefined}={}){
    $(".no-resuls-found").hide();
    $("#filter_search").prop('disabled', true);
    $("#filter_clear").prop('disabled', true);
    if(page == 1){
        $("#all-certificates").html("");
        $(".loading-skeleton").show();
    }
    var targetURL = $("#certificatesSearch").attr('action');
    $("#certificatesSearch").trigger('reset');
    try{
        var search = location.search.substring(1); //get the url
        data = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}'); //get data from uri in JSON format
        $("#certificatesSearch").jsonToForm(data); //fiil the input fields from the json data
    }
    catch{
        data = {}
    }
    
    data['action'] = 'Search'; //add new key value
    data['page'] = page

    $("#filter_search").prop('disabled', false);
    $("#filter_search").html('Search');
    $("#filter_clear").prop('disabled', false);
    $("#filter_clear").html('Clear');
    
    $.get(targetURL, data, function(certificateData){
        var totalData = certificateData['total']
        if(totalData > 0){
            sendData = {
                'certificateData': certificateData,
            }
            worker_load_certificates.postMessage(sendData);
            if(certificateData['isLast']){
                $("#loadMoreBtn").hide();
            }
            else{
                $("#loadMoreBtn").show();
            }
        }
        else{
            if(page == 1){
                $(".no-resuls-found").show();
            }
            $(".loading-skeleton").hide();
            $("#loadMoreBtn").hide();
        }

        if(callbacks != undefined){
            for(i in callbacks){
                fun = callbacks[i];
                fun();
            }
        }
    }).fail(function(){
        $("#filter_search").prop('disabled', false);
        $("#filter_search").html('Search');
        $("#filter_clear").prop('disabled', false);
        $("#filter_clear").html('Clear');
    });
}


$("#loadMoreBtn").on('click', function(){
    page += 1;
    $("#loadMoreBtn").prop('disabled', true);
    var moreButton = document.getElementById("loadMoreBtn")
    dotMovingAnimation(moreButton, 5)
    var f = function(){
        dotMovingAnimation(moreButton, 0)
        $("#loadMoreBtn").html('Load More');
        $("#loadMoreBtn").prop('disabled', false);
    }
    loadCertificates({callbacks: [f,]});
})


worker_load_certificates.addEventListener('message', function(e) {
    var data = e.data
    $(".loading-skeleton").hide();
    $(`#all-certificates`).append(data['html']);
    issuedDate = formatDate(data.Issued_at);
    issuedFor = data.issued_for;
    if(issuedFor == 'Blood Donation'){
        $(`#donated-date-${data.Certificate_Id}`).html(`Blood Donated on: ${issuedDate}`);
    }
    else if(issuedFor == 'Blood Collection'){
        $(`#donated-date-${data.Certificate_Id}`).html(`Blood Collected on: ${issuedDate}`);
    }
}, false);




$(document).ready(function(){
    page = 1
    loadCertificates();
});

$(window).on("popstate", function () {
    page = 1
    loadCertificates();
});