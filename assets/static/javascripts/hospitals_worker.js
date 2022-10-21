

function displayLoginAlert(is_login){
    if(is_login == false){
        let e = `data-toggle="tooltip" data-placement="top" title="Login Required"`;
        return e;
    }
    else{
        return '';
    }
}

function displayWebsite(hospitalData){
    if(hospitalData.Website == '' || hospitalData.Website == undefined || hospitalData.Website == null){
        return '';
    }
    else{
        h = `<p class="card-text mt-1" style="font-size:14px;color:Navy; font-weight:400;">
                        <i class="fa-solid fa-earth-asia" style="font-size:15px"></i>&nbsp;<a
                            style="color:Navy" href="${hospitalData.Website}">${hospitalData.Website}</a>
                    </p>`
        return h;
    }
}

function displayContact(hospitalData){
    var contact = `<p class="card-text mt-0 mt-md-2">
                    <i class="fad fa-phone-rotary" style="font-size:18px;"></i>&nbsp;<span style="font-weight:500">Emergency:</span>&nbsp;<a style="color:Navy" href="tel:${hospitalData.Emergency_Number}">${hospitalData.Emergency_Number}</a>
                </p>`
    if(!(hospitalData.Toll_Free_Number == '' || hospitalData.Toll_Free_Number == undefined || hospitalData.Toll_Free_Number == null)){
        contact += `<p class="card-text mt-0 mt-md-2">
                    <i class="fa-solid fa-mobile-screen-button" style="font-size:18px;"></i>&nbsp;<span style="font-weight:500">Toll Free:</span>&nbsp;<a style="color:Navy" href="tel:${hospitalData.Toll_Free_Number}">${hospitalData.Toll_Free_Number}</a>
                </p>`
    }
    if(!(hospitalData.Helpline_Number == '' || hospitalData.Helpline_Number == undefined || hospitalData.Helpline_Number == null)){
        contact +=  `<p class="card-text mt-0 mt-md-2">
                        <i class="fa-solid fa-phone" style="font-size:18px;"></i>&nbsp;<span style="font-weight:500">Helpline:</span>&nbsp;<a style="color:Navy" href="tel:${hospitalData.Helpline_Number}">${hospitalData.Helpline_Number}</a>
                    </p>`
    }
    if(hospitalData['Contacts'].length > 0){
        var otherContacts = '';
        for(j=0; j<hospitalData['Contacts'].length; j++){
            if(!(hospitalData['Contacts'][j] == '' || hospitalData['Contacts'][j] == undefined || hospitalData['Contacts'][j] == null)){
                otherContacts += `<span><a style="color:Navy" href="tel:${hospitalData['Contacts'][j]}">${hospitalData['Contacts'][j]}</a></span>`
                if(j != hospitalData['Contacts'].length-1){
                    otherContacts +=`, `
                }
            }
        }
        otherContactsHtml = ''
        if(otherContacts != ''){
            otherContactsHtml = `<p class="card-text mt-0 mt-md-2">
                                <i class="fa-solid fa-square-phone" style="font-size:18px;"></i>&nbsp;<span style="font-weight:500">Other:</span>&nbsp;${otherContacts}
                            </p>`
        }
        
    }
    contactHtml = `<div class="middle-left-align">
                        <h6 style="font-size:14px;color:Navy; font-weight:400;">
                            ${contact}
                            ${otherContactsHtml}
                            <p class="card-text" style="font-size:14px;color:Navy; font-weight:400; margin-right: -45px; margin-top:10px">
                                <i class="fad fa-at" style="font-size:18px;"></i>
                                <a style="color:Navy" href="mailto:${hospitalData.Username__email}">${hospitalData.Username__email}</a>
                            </p>
                            ${displayWebsite(hospitalData)}
                        </h6>
                    </div>`
    return contactHtml;
}

self.addEventListener('message', function(e) {
    var receivedData = e.data;
    var hospitalData = receivedData['hospitalData']
    var department = receivedData['department']

    if(hospitalData['totalPageItem'] > 0){
        for(i=0; i<hospitalData['Hospitals'].length; i++){
            bedData = hospitalData['Hospitals'][i]['Departments'][department]
            var html = 
            `<div class="row ml-3 mr-3" align="center" style="margin-bottom:15px">
                <div class="card card-hospital" style="width:100%;">
                    <div class="card-body" style="padding-top:5px;padding-bottom:5px">
                        <div class="row">
                            <div class="col-md-3"></div>
                            <div class="col-md">
                                <h3 class="card-title mt-1" style="color:#FF00AB;font-family: 'Handlee', cursive; font-weight:400; font-size:20px;">
                                    ${hospitalData['Hospitals'][i].Name}
                                </h3>
                                <h5 style="font-size:14px;color:Navy; margin:0px; margin-top:-10px; margin-bottom:-10px"><i class="fas fa-clinic-medical"></i> ${hospitalData['Hospitals'][i].Type} <i class="fa-solid fa-circle" style="font-size:8px"></i> ${hospitalData['Hospitals'][i].Ownership}</h5>
                                <hr>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3 col-5 order-md-1 mt-md-4">
                                <div class="image-box">
                                    <img src="${hospitalData['Hospitals'][i].Image}" class="lazy box-image" alt="Hospital Picture">
                                </div>
                            </div>

                            <div class="col-md col-7 order-md-3 mt-2 contact-display-div" style="margin-bottom:20px">
                                <div class="antivenom-large-screen">
                                    <h5 class="card-text" style="font-size:16px;color:#FF6A00"><i class="fas fa-syringe"></i> Has Antivenom?
                                    ${hospitalData['Hospitals'][i].Has_Antivenom == 'Yes' ?
                                        '<br><span style="color:green">Yes</span></h5>' :
                                        '<br><span style="color:red">No</span></h5>'}
                                </div>
                                ${displayContact(hospitalData['Hospitals'][i])}
                            </div>

                            <div class="col-md-9 order-md-2">
                                <div class="antivenom-small-screen mt-3 mb-3">
                                    <h5 class="card-text" style="font-size:16px;color:#FF6A00"><i class="fas fa-syringe"></i> Has Antivenom?
                                    ${hospitalData['Hospitals'][i].Has_Antivenom == 'Yes' ?
                                        '<br><span style="color:green">Yes</span></h5>' :
                                        '<br><span style="color:red">No</span></h5>'}
                                </div>
                                <div style="font-size:15px; color:#296AC8; margin-top:-10px;margin-bottom:2px">
                                    <i class="fas fa-clock"></i> Oxygen Remain: <span id="oxygenRemain${hospitalData['Hospitals'][i].id}"></span>
                                </div>
                                <div class="text-muted">
                                    <b>Department: ${hospitalData.department}</b>
                                </div>
                                <div class="row no-gutters">
                                    <div class="col-6 col-md">
                                        <h6 class="available-bed-text" style="color:#D300AE;font-size:16px;margin-bottom:6px;margin-top:6px">Male Ward</h6>
                                        <h6 class="available-bed-text" style="color:red;font-size:14px; line-height:8px; font-weight:400;" id="text-male-O2${hospitalData['Hospitals'][i].id}">With O2: <span id="male-O2${hospitalData['Hospitals'][i].id}" class="available-bed"></span></h6>
                                        <h6 class="available-bed-text" style="color:red;font-size:14px; line-height:8px; font-weight:400;" id="text-male-NoO2${hospitalData['Hospitals'][i].id}">Non-O2: <span id="male-NoO2${hospitalData['Hospitals'][i].id}" class="available-bed"></span></h6>
                                    </div>
                                    <div class="col-6 col-md">
                                        <h6 class="available-bed-text" style="color:#D300AE;font-size:16px;margin-bottom:6px;margin-top:6px">Female Ward</h6>
                                        <h6 class="available-bed-text" style="color:red;font-size:14px; line-height:8px; font-weight:400;" id="text-female-O2${hospitalData['Hospitals'][i].id}">With O2: <span id="female-O2${hospitalData['Hospitals'][i].id}" class="available-bed"></span></h6>
                                        <h6 class="available-bed-text" style="color:red;font-size:14px; line-height:8px; font-weight:400;" id="text-female-NoO2${hospitalData['Hospitals'][i].id}">Non-O2: <span id="female-NoO2${hospitalData['Hospitals'][i].id}" class="available-bed"></span></h6>
                                    </div>
                                    <div class="col-6 col-md">
                                        <h6 class="available-bed-text" style="color:#D300AE;font-size:16px;margin-bottom:6px;margin-top:6px">Child Ward</h6>
                                        <h6 class="available-bed-text" style="color:red;font-size:14px; line-height:8px; font-weight:400;" id="text-child-O2${hospitalData['Hospitals'][i].id}">With O2: <span id="child-O2${hospitalData['Hospitals'][i].id}" class="available-bed"></span></h6>
                                        <h6 class="available-bed-text" style="color:red;font-size:14px; line-height:8px; font-weight:400;" id="text-child-NoO2${hospitalData['Hospitals'][i].id}">Non-O2: <span id="child-NoO2${hospitalData['Hospitals'][i].id}" class="available-bed"></span></h6>
                                    </div>
                                    <div class="col-6 col-md">
                                        <h6 class="available-bed-text" style="color:#D300AE;font-size:16px;margin-bottom:6px;margin-top:6px">ICU</h6>
                                        <h6 class="available-bed-text" style="color:red;font-size:14px; line-height:8px; font-weight:400;" id="text-icu-Ventilator${hospitalData['Hospitals'][i].id}">With Ventilator: <span id="icu-Ventilator${hospitalData['Hospitals'][i].id}" class="available-bed"></span></h6>
                                        <h6 class="available-bed-text" style="color:red;font-size:14px; line-height:8px; font-weight:400;" id="text-icu-NoVentilator${hospitalData['Hospitals'][i].id}">Non-Ventilator: <span id="icu-NoVentilator${hospitalData['Hospitals'][i].id}" class="available-bed"></span></h6>
                                    </div>
                                    <div class="col-6 col-md">
                                        <h6 class="available-bed-text" style="color:#D300AE;font-size:16px;margin-bottom:6px;margin-top:6px">PICU</h6>
                                        <h6 class="available-bed-text" style="color:red;font-size:14px; line-height:8px; font-weight:400;" id="text-picu-Ventilator${hospitalData['Hospitals'][i].id}">With Ventilator: <span id="picu-Ventilator${hospitalData['Hospitals'][i].id}" class="available-bed"></span></h6>
                                        <h6 class="available-bed-text" style="color:red;font-size:14px; line-height:8px; font-weight:400;" id="text-picu-NoVentilator${hospitalData['Hospitals'][i].id}">Non-Ventilator: <span id="picu-NoVentilator${hospitalData['Hospitals'][i].id}" class="available-bed"></span></h6>
                                    </div>
                                    <div class=" col-6 col-md">
                                        <h6 class="available-bed-text" style="color:#D300AE;font-size:16px;margin-bottom:6px;margin-top:6px">NICU</h6>
                                        <h6 class="available-bed-text" style="color:red;font-size:14px; line-height:8px; font-weight:400;" id="text-nicu-Ventilator${hospitalData['Hospitals'][i].id}">With Ventilator: <span id="nicu-Ventilator${hospitalData['Hospitals'][i].id}" class="available-bed"></span></h6>
                                        <h6 class="available-bed-text" style="color:red;font-size:14px; line-height:8px; font-weight:400;" id="text-nicu-NoVentilator${hospitalData['Hospitals'][i].id}">Non-Ventilator: <span id="nicu-NoVentilator${hospitalData['Hospitals'][i].id}" class="available-bed"></span></h6>
                                    </div>
                                </div>
                                <hr>
                            </div>

                            <div class="col-12 col-md-8 order-md-4 middle-left-align">
                                <h6 style="color:black;font-size:14px; font-weight:normal">
                                    <p><b style="font-size:14px;color:#9A0008;"> ${hospitalData['Hospitals'][i].State__Name}</b></p>
                                    <p>Town/Village: ${hospitalData['Hospitals'][i].City}, Subdivision: ${hospitalData['Hospitals'][i].Subdivision},</p>
                                    <p>Dict: ${hospitalData['Hospitals'][i].District__Name}, Pin: ${hospitalData['Hospitals'][i].Pin}</p>
                                    <p>Address: ${hospitalData['Hospitals'][i].Address}.</p>
                                </h6>
                            </div>
                        </div>
                        <hr style="margin-bottom:-2px; margin-top:0px;">
                        <p class="text-muted" style="font-size: 13px; margin-bottom:1px">Last Update: <span id="lastUpdate-${hospitalData['Hospitals'][i].id}"></span></p>
                        <div class="row row-button">
                            <div class="col-md order-md-second">
                                <div>
                                    <a href="/bedbook/${hospitalData['Hospitals'][i].Unique_Id}" class="btn btn-danger disabled no-bed" id="bedBookBtn${hospitalData['Hospitals'][i].id}" ${displayLoginAlert(hospitalData['is_login'])}><i class="fad fa-bed-alt"></i> No Bed</a>
                                </div>
                            </div>
                            <div class="col order-md-first">
                                <a href="tel: +91${hospitalData['Hospitals'][i].Emergency_Number}" class="btn btn-success"
                                style="font-size:20px;width:130px;margin-bottom:5px;width:100%">
                                    <i class="fad fa-phone-alt"></i>
                                    Call</a>
                            </div>
                            <div class="col">
                                <a id="direction-${hospitalData['Hospitals'][i].id}" class="btn btn-primary btn-direction" target="__blank" data-dest="${hospitalData['Hospitals'][i].Latitude},${hospitalData['Hospitals'][i].Longitude}"
                                style="font-size:20px;margin-bottom:5px;width:100%">
                                    <i class="fad fa-route"></i>
                                    Direction
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`

            var sendData = {
                'html': html,
                'hospital': hospitalData['Hospitals'][i],
            }
            self.postMessage(sendData);
            
        }
        var sendData = {
            'noMoreData': true,
        }
        self.postMessage(sendData);
    }
    else{
        var sendData = {
            'html': '',
            'noMoreData': true,
        }
        self.postMessage(sendData);
    }
    //self.close(); // Terminates the worker.
  }, false);