
var page = 1;
var district = null;


$("#emergencySearch").on('submit', function(event){
    event.preventDefault();
    $("#filter_search").html('Searching');
    page = 1
    lookingFor = 'Filter';
    updateURI({lookingFor: lookingFor});
    loadEmergencyNumber();

});
$("#filter_clear").on('click', function(){
    $("#emergencySearch").trigger('reset');
    page = 1
    lookingFor = 'All';
    updateURI({lookingFor: lookingFor});
    loadEmergencyNumber();
});

function resetVal(){
    $("#district").html(`<option label="Select District"></option>`)
    $("#district").attr("data-toggle", "tooltip");
    $("#district").attr("data-placement", "top");
    $("#district").attr("title", "To Select District choose A State First");
    $("#office").prop('disabled', true)
    $("#subdivision").prop('disabled', true)
    disableEnableOfficeField()
}
$("#emergencySearch").on('reset', resetVal);


var worker_load_emergency = new Worker('/static/javascripts/emergency_worker.js');


function updateURI({lookingFor='All'}={}){
    var targetURL = $("#emergencySearch").attr('action');
    if(lookingFor != 'All'){
        data = $("#emergencySearch").serializeToJSON({
            parseBooleans: false,
        }); //get form data in json format
        targetURL += '?' + $.param(data); //form data to uri
    }
    history.pushState({page: 1}, document.title, targetURL); //update url
}

function loadEmergencyNumber({callbacks=undefined}={}){
    $(".no-resuls-found").hide();
    $("#filter_search").prop('disabled', true);
    $("#filter_clear").prop('disabled', true);
    if(page == 1){
       
        $("#emergency_data_table").html(`<h4 class="text-muted mt-5 mb-5" align="center" id="search_record">Fetching Records....</h4>`);
    }
    var targetURL = $("#emergencySearch").attr('action');
    $("#emergencySearch").trigger('reset');
    try{
        var search = location.search.substring(1); //get the url
        data = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}'); //get data from uri in JSON format
        $("#emergencySearch").jsonToForm(data); //fiil the input fields from the json data
        district = data['district'];
        loadDistrict();
    }
    catch{
        data = {}
        $("#district").html(`<option label="Select District"></option>`)
        $("#office").prop('disabled', true)
        $("#subdivision").prop('disabled', true)
    }
    
    data['action'] = 'Search'; //add new key value
    data['page'] = page

    $("#filter_search").prop('disabled', false);
    $("#filter_search").html('Search');
    $("#filter_clear").prop('disabled', false);
    $("#filter_clear").html('Clear');
    
    $.get(targetURL, data, function(emergencyData){
        var totalData = emergencyData['total']
        if(totalData > 0){
            if(page == 1){
                $("#emergency_data_table").html("");
            }
            sendData = {
                'emergencyData': emergencyData,
            }
            worker_load_emergency.postMessage(sendData);
            if(emergencyData['isLast']){
                $("#loadMoreBtn").hide();
            }
            else{
                $("#loadMoreBtn").show();
            }
        }
        else{
            if(page == 1){
                $("#emergency_data_table").html("");
                $(".no-resuls-found").show();
            }
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
    loadEmergencyNumber({callbacks: [f,]});
})


worker_load_emergency.addEventListener('message', function(e) {
    var data = e.data
    $(`#emergency_data_table`).append(data['html']);
}, false);


$("#state").on('change', loadDistrict);
function loadDistrict()
{
    state = $('#state').val();
    options = '';
    $("#district").html(`<option label='Select District'></option>`)
    if(state != 'All States & Union Territories' && state != '' && state != undefined){
        $("#district").removeAttr("data-toggle");
        $("#district").removeAttr("data-placement");
        $("#district").removeAttr("title");
        $.ajax({
            url:"/get-district/",
            data:{
                'state':state,
            },
            dataType: 'json',
            cache: false,
            success: function(response)
            {
                var dc = Number(response.districtcount);
                for(i=0; i<dc; i++)
                {
                    options += `<option value="${response.districts[i]}">${response.districts[i]}</option>`;
                }
                $("#district").append(options);

                if(district != null){
                    $("#district").val(district);
                }
                district = null;
            },
        });
    }
    else{
        $("#district").attr("data-toggle", "tooltip");
        $("#district").attr("data-placement", "top");
        $("#district").attr("title", "To Select District choose A State First");
    }
}


function disableEnableOfficeField(){
    var inputState = $("#state").val();
    var inputDistrict = $("#district").val();
    var inputSubdivision = $("#subdivision").val();
    if((inputState != '') && (inputDistrict != '')){
        $("#office").prop('disabled', false);
        $("#office").removeAttr("data-toggle");
        $("#office").removeAttr("data-placement");
        $("#office").removeAttr("title");

        $("#subdivision").prop('disabled', false);
        $("#subdivision").removeAttr("data-toggle");
        $("#subdivision").removeAttr("data-placement");
        $("#subdivision").removeAttr("title");
    }
    else{
        $("#office").val('');
        $("#office").prop('disabled', true);
        $("#office").attr("data-toggle", "tooltip");
        $("#office").attr("data-placement", "bottom");
        $("#office").attr("title", "Select state and district first");
        $("#subdivision").prop('disabled', true);
        $("#subdivision").attr("data-toggle", "tooltip");
        $("#subdivision").attr("data-placement", "bottom");
        $("#subdivision").attr("title", "Select state and district first");
    }
}
$('#state').on('change', disableEnableOfficeField)
$('#district').on('change', disableEnableOfficeField)
$('#subdivision').on('change', disableEnableOfficeField)


new Autocomplete('#autocomplete', {
    search: input => {
        return new Promise(resolve => {
            if (input.length < 1) {
                return resolve([])
            }
            else{
                data = {
                    'action': 'Name_Search',
                    'office': input,
                    'state': $("#state").val(),
                    'district': $("#district").val(),
                    'subdivision': $("#subdivision").val(),
                }
                urlDecodedData = $.param(data)
                const url = `/emergency-number/?${urlDecodedData}`
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                    resolve(data.emergencies)
                })
            }
        });
    },
    renderResult: (result, props) => {
        renderedHtml = `
        <li ${props}>
            <div class="autocomplete-option-title">
                ${result.Office}
            </div>
            <div class="autoload-option-snippet">
                ${result.Subdivision}, ${result.District__Name}, ${result.State__Name}, 
            </div>
        </li>
        `
        return renderedHtml;
    },
    getResultValue: result => result.Office,
});

$(document).ready(function(){
    page = 1
    loadEmergencyNumber();
    disableEnableOfficeField()
});

$(window).on("popstate", function () {
    page = 1
    loadEmergencyNumber();
    disableEnableOfficeField()
});