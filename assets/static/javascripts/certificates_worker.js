

function displayCertificateId(certificateData){
    issued_for = certificateData.Certificate_issued_for;
    if(issued_for == 'Blood Donation'){
        html = `<div class="text-right certificate-id">
                    Certificate Id: ${certificateData['Certificate_Id']}
                </div>`
        return html;
    }
    else{
        return '';
    }
}

function donateUnit(certificateData){
    issued_for = certificateData.Certificate_issued_for;
    bloodGroup = certificateData.Blood_Group;
    if(bloodGroup == "Unknown"){
        bloodGroup = '';
    }
    else{
        bloodGroup = ` ${bloodGroup}`;
    }
    if(issued_for == "Blood Donation"){
        return `Donated: ${certificateData.Unit} Unit${bloodGroup} ${certificateData.Component}`
    }
    else if(issued_for == "Blood Collection"){
        return `Collected: ${certificateData.Unit} Unit ${certificateData.Blood_Group} ${certificateData.Component}`
    }
}

function displayButton(certificateData){
    issued_for = certificateData.Certificate_issued_for;
    if(issued_for == 'Blood Donation'){
        html = `<div class="text-center">
                    <a class="btn btn-sm btn-secondary" href="/blood-certificate/${certificateData.Certificate_Id}" target="_blank" style="border-radius:30px">View Certificate</a>
                </div>`
        return html;
    }
    else{
        return '';
    }
}


self.addEventListener('message', function(e) {
    var receivedData = e.data;
    var certificateData = receivedData['certificateData']['certificates']
    var total = receivedData['certificateData']['total']

        for(i=0; i<total; i++){
            certificate = certificateData[i];
            var html = 
            `
                <div class="card data-card mb-4">
                    <div class="card-body">
                        ${displayCertificateId(certificate)}
                        <div class="row">
                            <div class="col-md-8">
                                <div class="bank-name">${certificate.Blood_Bank__Name}</div>
                                <div class="donated-date" id="donated-date-${certificate.Certificate_Id}"></div>
                                <div class="donate-unit">${donateUnit(certificate)}</div>
                            </div>
                            <div class="col-md mt-2">
                                <div class="certificate-name">Name: ${certificate.Name}</div>
                                <div class="certificate-phone">phone: ${certificate.Phone}</div>
                                <div class="certificate-email">${certificate.Email != '' ? certificate.Email : ''}</div>
                            </div>
                        </div>
                        ${displayButton(certificate)}
                    </div>
                </div>
            `

            var sendData = {
                'html': html,
                'Certificate_Id': certificate.Certificate_Id,
                'issued_for': certificate.Certificate_issued_for,
                'Issued_at': certificate.Issued_at,
            }
            self.postMessage(sendData);
        }
}, false);