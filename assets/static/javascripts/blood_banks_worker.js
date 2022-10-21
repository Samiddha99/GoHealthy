function displayContact(bloodBankData){
    var contact = `Emergency: ${bloodBankData.Emergency_Number}`
    if(!(bloodBankData.Toll_Free_Number == '' || bloodBankData.Toll_Free_Number == undefined || bloodBankData.Toll_Free_Number == null)){
        contact += `<br>Toll Free: ${bloodBankData.Toll_Free_Number}`
    }
    if(!(bloodBankData.Helpline_Number == '' || bloodBankData.Helpline_Number == undefined || bloodBankData.Helpline_Number == null)){
        contact +=  `<br>Helpline: ${bloodBankData.Helpline_Number}`
    }
    if(bloodBankData['Contacts'].length > 0){
        var otherContacts = '';
        for(j=0; j<bloodBankData['Contacts'].length; j++){
            if(!(bloodBankData['Contacts'][j] == '' || bloodBankData['Contacts'][j] == undefined || bloodBankData['Contacts'][j] == null)){
                otherContacts += `${bloodBankData['Contacts'][j]}`
                if(j != bloodBankData['Contacts'].length-1){
                    otherContacts +=`, `
                }
            }
        }
        otherContactsHtml = ''
        if(otherContacts != ''){
            otherContactsHtml = `<br>Other: ${otherContacts}`
        }
        
    }
    contactHtml = `${contact}${otherContactsHtml}`
    return contactHtml;
}

function displayWebsite(bloodBankData){
    if(bloodBankData.Website == '' || bloodBankData.Website == undefined || bloodBankData.Website == null){
        return '';
    }
    else{
        return `<br>${bloodBankData['Website']}`;
    }
}


self.addEventListener('message', function(e) {
    var receivedData = e.data;

    for(i=0; i<receivedData.bloodBank.length; i++){
        var bloodBank = receivedData.bloodBank[i]
        var html = 
        `<div class="mb-3">
            <a href="/blood-bank/${bloodBank['Unique_Id']}" style="text-decoration: none;">
                <div class="box box-blood-bank">
                    <div class="header">
                        <div style="margin-bottom:-5px">${bloodBank['Name']}</div>
                        <span>${bloodBank['Ownership']}</span>
                    </div>
                    <div class="row no-gutters">
                        <div class="col">
                            <div class="group-head">
                                A+
                            </div>
                            <div class="group-data" id="whole_blood_A_pos-${bloodBank['Unique_Id']}">
                                ${bloodBank['Blood_Availability']['whole_blood_A_pos']}
                            </div>
                        </div>
                        <div class="col">
                            <div class="group-head">
                                A-
                            </div>
                            <div class="group-data" id="whole_blood_A_neg-${bloodBank['Unique_Id']}">
                                ${bloodBank['Blood_Availability']['whole_blood_A_neg']}
                            </div>
                        </div>
                        <div class="col">
                            <div class="group-head">
                                B+
                            </div>
                            <div class="group-data" id="whole_blood_B_pos-${bloodBank['Unique_Id']}">
                                ${bloodBank['Blood_Availability']['whole_blood_B_pos']}
                            </div>
                        </div>
                        <div class="col">
                            <div class="group-head">
                                B-
                            </div>
                            <div class="group-data" id="whole_blood_B_neg-${bloodBank['Unique_Id']}">
                                ${bloodBank['Blood_Availability']['whole_blood_B_neg']}
                            </div>
                        </div>
                        <div class="col">
                            <div class="group-head">
                                AB+
                            </div>
                            <div class="group-data" id="whole_blood_AB_pos-${bloodBank['Unique_Id']}">
                                ${bloodBank['Blood_Availability']['whole_blood_AB_pos']}
                            </div>
                        </div>
                        <div class="col">
                            <div class="group-head">
                                AB-
                            </div>
                            <div class="group-data" id="whole_blood_AB_neg-${bloodBank['Unique_Id']}">
                                ${bloodBank['Blood_Availability']['whole_blood_AB_neg']}
                            </div>
                        </div>
                        <div class="col">
                            <div class="group-head">
                                O+
                            </div>
                            <div class="group-data" id="whole_blood_O_pos-${bloodBank['Unique_Id']}">
                                ${bloodBank['Blood_Availability']['whole_blood_O_pos']}
                            </div>
                        </div>
                        <div class="col">
                            <div class="group-head">
                                O-
                            </div>
                            <div class="group-data" id="whole_blood_O_neg-${bloodBank['Unique_Id']}">
                                ${bloodBank['Blood_Availability']['whole_blood_O_neg']}
                            </div>
                        </div>
                        <div class="col">
                            <div class="group-head">
                                hh
                            </div>
                            <div class="group-data">
                                ${bloodBank['Blood_Availability']['whole_blood_hh']}
                            </div>
                        </div>
                    </div>
                    <div class="row no-gutters">
                        <div class="col-md-5">
                            <div class="box-footer">
                                <div class="footer-head">
                                    Contact
                                </div>
                                <div class="footer-data middle-left-align">
                                    ${displayContact(bloodBank)}
                                    <br>Email: ${bloodBank['Username__email']}
                                    ${displayWebsite(bloodBank)}
                                </div>
                            </div>
                        </div>
                        <div class="col-md">
                            <div class="box-footer">
                                <div class="footer-head">
                                    Address
                                </div>
                                <div class="footer-data footer-address middle-left-align">
                                    State: ${bloodBank['State__Name']}
                                    <br>Dist: ${bloodBank['District__Name']}
                                    <br>Sub: ${bloodBank['Subdivision']}
                                    <br>Town/Village: ${bloodBank['City']}
                                    <br>Pin: ${bloodBank['Pin']}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="end-fotter">
                        Last Update: <span id="last_update-${bloodBank['Unique_Id']}"></span>
                    </div>
                </div>
            </a>
        </div>`
        
        var sendData = {
            'html': html,
            'id': bloodBank.id,
            'Bank_Id': bloodBank.Unique_Id,
            'last_update': bloodBank.Last_Update,
            'isLastRecord': i==receivedData.bloodBank.length-1,
        }
        self.postMessage(sendData);
    }

}, false);