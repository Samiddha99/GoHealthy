
self.addEventListener('message', function(e) {
    var receivedData = e.data;

    for(i=0; i<receivedData.length; i++){
        var bloodRequest = receivedData[i]
        var html = 
        `<div class="row">
            <div class="col-md-1 col-icon order-md-1">
                <div class="fa-6x icon-stack">
                    <i class="fas fa-tint" style="color:red"></i>
                    <div class="icon-text" align="center">${bloodRequest.Blood_Group}</div>
                </div>
                <div style="font-size:15px">Unit: ${bloodRequest.Unit} Unit</div>
            </div>
            <div class="col-md-7 order-md-2">
                <h6 class="text-primary" style="margin-bottom:2px;font-size:17px">Patient:</h6>
                <h5 style="color:blue" class="mb-3">${bloodRequest.Patient_Name}</h5>
                <p style="color:green; font-size:21px"><i class="fas fa-phone-volume"></i> ${bloodRequest.Contact}</p>
                <p style="font-size: 18px; color:#595959">${bloodRequest.Admit_Hospital__Name}</p>
            </div>
            <div class="col-md mr-5 order-md-4 text-md-center">
                <div class="row" style="margin-top:-10px">
                    <div class="col-md">
                        <span class="text-muted">${bloodRequest.Admit_Hospital__City}, ${bloodRequest.Admit_Hospital__State__Name}</span>
                    </div>
                    <div class="col-md text-center mt-md-0 mt-3" style="padding:0px">
                        <span class="text-muted" style="margin-left:-30px; margin-right:-30px;">Requested at: <span id="requested_at-${bloodRequest.id}"></span></span>
                    </div>
                </div>
            </div>
            <div class="col-md mr-5 order-md-3" align="center">
                <a href="tel: +91${bloodRequest.Contact}" class="btn btn-outline-success mt-md-4 mt-3" style="font-size:20px;width:130px;margin-bottom:5px;width:100%">
                    <i class="fas fa-phone-alt"></i> Call
                </a>
            </div>
        </div>
        <hr class="mb-4">`
        
        var sendData = {
            'html': html,
            'id': bloodRequest.id,
            'Requested_at': bloodRequest.Requested_at,
        }
        self.postMessage(sendData);
    }

}, false);