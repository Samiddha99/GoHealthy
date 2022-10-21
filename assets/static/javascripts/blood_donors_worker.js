

function displayProfile(donor){
    if(donor.Username__display_profile_pic == true){
        return `${donor['Image']}`
    }
    else if(donor.Gender == 'Male'){
        return "/static/images/male_donor.jpg"
    }
    else if(donor.Gender == 'Female'){
        return "/static/images/female_donor.png"
    }
    else{
        return "/static/images/anonomous_donor.png"
    }
}

function displayGender(donor){
    if(donor.Gender == 'Female'){
        return '<i class="fa-duotone fa-user-hair-long" style="font-size:20px"></i>'
    }
    else if(donor.Gender == 'Male'){
        return '<i class="fa-duotone fa-user-vneck-hair" style="font-size:20px"></i>'
    }
}

function displayBloodDonated(donated){
    if(donated > 0){
       return `<p class="text-right mt-1" style="margin-top:-12px; color:white">Blood Donated: At least ${donated} times</p>`
    }
    else{
        return ''
    }
}

function displayLoginAlert(is_login){
    if(is_login == false){
        let e = `data-toggle="tooltip" data-placement="top" title="Login Required"`;
        return e;
    }
    else{
        return 'title="Do Chat"';
    }
}

function displayAge(dob){
    var dob = new Date(dob);
    var month_diff = Date.now() - dob.getTime();  //calculate month difference from current date in time
    var age_dt = new Date(month_diff);  //convert the calculated difference in date format
    var year = age_dt.getUTCFullYear();   //extract year from date
    var age = Math.abs(year - 1970);  //now calculate the age of the user 
    return age;
}

self.addEventListener('message', function(e) {
    var receivedData = e.data;
    var donorData = receivedData['donorData']

    if(donorData['totalPageItem'] > 0){
        for(i=0; i<donorData['totalPageItem']; i++){
            var html = 
            `<div class="card mb-5 card-animation" style="box-shadow:-10px 10px 30px 3px grey;width:100%" align="center">
                <div class="wrapper" style="background: url('/static/images/GoHealthy_donor info background.png');background-repeat:no-repeat;background-size:100% 100%; padding:10px;">
                    ${displayBloodDonated(donorData['Donors'][i]['blood_donated'])}
                    <div class="row mt-4">
                        <div class="col-md-5"></div>
                        <div class="col-md text-left">
                            <div class="card-text" style="color:white">
                                <span style="color:white">
                                    <span class="card-text-data-heading">${donorData['Donors'][i]['Name'].toUpperCase()}</span> &nbsp;
                                    ${displayGender(donorData['Donors'][i])}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-1"></div>
                        <div class="col-md-4 col-5 text-left text-md-center">
                            <img id="profilepic" class="card-image" src="${displayProfile(donorData['Donors'][i])}" alt="Blood Donor Profile Picture">					
                        </div>
                        <div class="col-md col-7 mt-md-3 text-left text-data">
                            <div class="card-text-bio">
                                <h5 class="card-text card-text-data">
                                    <div class="row no-gutters">
                                        <div class="col-1 text-right">
                                            <i class="fad fa-phone-rotary card-text-data-icon"></i>
                                        </div>
                                        <div class="col ml-2 text-left">
                                            +91 ${donorData['Donors'][i].Username__Contact}
                                        </div>
                                    </div>
                                </h5>
                                <h5 class="card-text card-text-data">
                                    <div class="row no-gutters">
                                        <div class="col-1 text-right">
                                            <i class="fad fa-tint card-text-data-icon"></i>
                                        </div>
                                        <div class="col ml-2 text-left">
                                            ${donorData['Donors'][i].Blood_Group}
                                        </div>
                                    </div>
                                </h5>
                                <h5 class="card-text card-text-data">
                                    <div class="row no-gutters">
                                        <div class="col-1 text-right">
                                            <i class="fad fa-user-clock card-text-data-icon"></i>
                                        </div>
                                        <div class="col ml-2 text-left">
                                            ${displayAge(donorData['Donors'][i]['Date_of_Birth'])} Yrs
                                        </div>
                                    </div>
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body" style="margin-top:5px">
                    <div>
                        <div class="row">
                            <div class="col-md-1"></div>
                            <div class="col-md-5 card-text col-right-border card-address text-center text-md-left" id="colAddress">
                                <h5 class="card-address-state">${donorData['Donors'][i].State__Name}</h5>
                                <h6 class="card-address-text">Town/Village: ${donorData['Donors'][i].City}</h6>
                                <h6 class="card-address-text">Sub Division: ${donorData['Donors'][i].Subdivision}</h6>
                                <h6 class="card-address-text">District: ${donorData['Donors'][i].District__Name}</h6>
                                <h6 class="card-address-text">Pin: ${donorData['Donors'][i].Pin}</h6>
                                <hr class="horizontalDivider">
                            </div>
                            <div class="col-md" align="left">
                                <p class="text-muted" style="white-space: pre-wrap">Address:<br>${donorData['Donors'][i].Address}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-0" style="margin:-20px;padding:10px;background-color:#FFE0EC">
                        <div class="row">
                            <div class="col">
                                <a href="tel: +91${donorData['Donors'][i].Username__Contact}" class="btn btn-success"
                                style="font-size:20px;width:150px;border:2px solid white" aria-labelledby="Call">
                                    <i class="fad fa-phone-alt"></i>
                                    Call</a>
                            </div>
                            <div class="col">
                                <form id="chat username" method="post" action="">
                                    <input type="hidden" name="csrfmiddlewaretoken" value="${receivedData['csrfmiddlewaretoken']}">
                                    <input type="hidden" name="chatwith" value="${donorData['Donors'][i].chat}" form="chat${donorData['request_user']}">
                                    <button type="submit" class="btn btn-success chat-btn" form="chat${donorData['Donors'][i].chat}" name="action"
                                            value="doChat" ${displayLoginAlert(donorData['is_login'])}
                                            style="font-size:20px;width:150px;border:2px solid white" aria-labelledby="Chat">
                                        <i class="fas fa-comment-dots"></i>
                                        Chat
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`

            var sendData = {
                'html': html,
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