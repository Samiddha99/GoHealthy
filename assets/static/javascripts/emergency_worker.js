

function displayPerson(data){
    if(data['Person'] != ''){
        let h = `<tr align="center">
                    <th scope="row">Person</th>
                    <td>${data['Title']}. ${data['Person']}</td>
                </tr>`
        return h;
    }
    else{
        return '';
    }
}

function displayDesignation(data){
    if(data['Person_Designation'] != ''){
        let h = `<tr align="center">
                    <th scope="row">Person's Designation</th>
                    <td>${data['Person_Designation']}</td>
                </tr>`
        return h;
    }
    else{
        return '';
    }
}

function displayContact(data){
    var h = ''
    for(j=0; j<data['Contact'].length; j++){
         h += `<tr align="center">
                    <th scope="row">Contact ${j+1}</th>
                    <td>${data['Contact'][j]}</td>
                </tr>`
    }
    return h;
}



self.addEventListener('message', function(e) {
    var receivedData = e.data;
    var emergencyData = receivedData['emergencyData']['emergencies']
    var total = receivedData['emergencyData']['total']

        for(i=0; i<total; i++){
            var html = 
            `<table class="table mb-4 table-striped table-white table-bordered" width="100%;">
                <thead>
                <tr align="center">
                    <th colspan="2" scope="col" class="emergency-table-header">${emergencyData[i]['Office']}</th>
                </tr>
                </thead>
                <tbody>
                    ${displayPerson(emergencyData[i])}
                    ${displayDesignation(emergencyData[i])}
                    <tr align="center">
                        <th scope="row">State</th>
                        <td>${emergencyData[i]['State__Name']}</td>
                    </tr>
                    <tr align="center">
                        <th scope="row">District</th>
                        <td>${emergencyData[i]['District__Name']}</td>
                    </tr>
                    <tr align="center">
                        <th scope="row">Subdivision</th>
                        <td>${emergencyData[i]['Subdivision']}</td>
                    </tr>
                    ${displayContact(emergencyData[i])}
                </tbody>
            </table>`

            var sendData = {
                'html': html,
            }
            self.postMessage(sendData);
        }
}, false);