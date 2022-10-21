

function displayProfile(donor){
    if(donor.Username__display_profile_pic == true){
        return `${donor['Image']}`
    }
    else if(donor.Gender == 'Male'){
        return "/static/images/male_doctor.png"
    }
    else if(donor.Gender == 'Female'){
        return "/static/images/female_doctor.png"
    }
    else{
        return "/static/images/anonomous_doctor.png"
    }
}

function displayGender(doctor){
    if(doctor.Gender == 'Female'){
        return '<i class="fa-duotone fa-user-hair-long" style="font-size:20px"></i>'
    }
    else if(doctor.Gender == 'Male'){
        return '<i class="fa-duotone fa-user-vneck-hair" style="font-size:20px"></i>'
    }
}

function displaySpeciality(doctor){
    if(doctor.Special__Speciality != 'N/A'){
        return `<h5 class="card-text card-text-data">
                    <div class="row no-gutters">
                        <div class="col-1 text-right">
                            <i class="fad fa-stethoscope card-text-degree-icon"></i>
                        </div>
                        <div class="col ml-2 text-left">
                            ${doctor.Special__Speciality}
                        </div>
                    </div>
                </h5>`
    }
    else{
        return ''
    }
}

function displayStars({doctorData, is_login}={}){
    if(is_login){
        var ele = ''
        if(doctorData['user_rated'] > 1){
            ele += `<i class="fas fa-star star-zoom" id="star1${doctorData['id']}" data-id="${doctorData['id']}" data-value="1" data-rate="1" data-toggle="tooltip" data-placement="top" data-original-title="Rate 1 Star"></i>`
        }
        else if(doctorData['user_rated'] == 1){
            ele += `<i class="fas fa-star star-zoom" id="star1${doctorData['id']}" data-id="${doctorData['id']}" data-value="0" data-rate="1" data-toggle="tooltip" data-placement="top" data-original-title="Remove Rating"></i>`
        }
        else{
            ele += `<i class="far fa-star star-zoom" id="star1${doctorData['id']}" data-id="${doctorData['id']}" data-value="1" data-rate="1" data-toggle="tooltip" data-placement="top" data-original-title="Rate 1 Star"></i>`
        }

        if(doctorData['user_rated'] >= 2){
            ele += `<i class="fas fa-star star-zoom" id="star2${doctorData['id']}" data-id="${doctorData['id']}" data-value="2" data-rate="2" data-toggle="tooltip" data-placement="top" data-original-title="Rate 2 Star"></i>`
        }
        else{
            ele += `<i class="far fa-star star-zoom" id="star2${doctorData['id']}" data-id="${doctorData['id']}" data-value="2" data-rate="2" data-toggle="tooltip" data-placement="top" data-original-title="Rate 2 Star"></i>`
        }
        
        if(doctorData['user_rated'] >= 3){
            ele += `<i class="fas fa-star star-zoom" id="star3${doctorData['id']}" data-id="${doctorData['id']}" data-value="3" data-rate="3" data-toggle="tooltip" data-placement="top" data-original-title="Rate 3 Star"></i>`
        }
        else{
            ele += `<i class="far fa-star star-zoom" id="star3${doctorData['id']}" data-id="${doctorData['id']}" data-value="3" data-rate="3" data-toggle="tooltip" data-placement="top" data-original-title="Rate 3 Star"></i>`
        }
        
        if(doctorData['user_rated'] >= 4){
            ele += `<i class="fas fa-star star-zoom" id="star4${doctorData['id']}" data-id="${doctorData['id']}" data-value="4" data-rate="4" data-toggle="tooltip" data-placement="top" data-original-title="Rate 4 Star"></i>`
        }
        else{
            ele += `<i class="far fa-star star-zoom" id="star4${doctorData['id']}" data-id="${doctorData['id']}" data-value="4" data-rate="4" data-toggle="tooltip" data-placement="top" data-original-title="Rate 4 Star"></i>`
        }
        
        if(doctorData['user_rated'] >= 5){
            ele += `<i class="fas fa-star star-zoom" id="star5${doctorData['id']}" data-id="${doctorData['id']}" data-value="5" data-rate="5" data-toggle="tooltip" data-placement="top" data-original-title="Rate 5 Star"></i>`
        }
        else{
            ele += `<i class="far fa-star star-zoom" id="star5${doctorData['id']}" data-id="${doctorData['id']}" data-value="5" data-rate="5" data-toggle="tooltip" data-placement="top" data-original-title="Rate 5 Star"></i>`
        }
    }
    else{
        ele = `<i class="far fa-star star-zoom" data-toggle="tooltip" data-placement="top" title="Do Login to give rating"></i> <i class="far fa-star star-zoom" data-toggle="tooltip" data-placement="top" data-original-title="Do Login to give rating"></i> <i class="far fa-star star-zoom" data-toggle="tooltip" data-placement="top" data-original-title="Do Login to give rating"></i> <i class="far fa-star star-zoom" data-toggle="tooltip" data-placement="top" data-original-title="Do Login to give rating"></i> <i class="far fa-star star-zoom" data-toggle="tooltip" data-placement="top" data-original-title="Do Login to give rating"></i>`
    }
    return ele;
}

function displayRating(doctorData){
    if(doctorData['total_rating'] != null){
        let rating = Number(doctorData['total_rating']) / Number(doctorData['total_votes']);
        rating = String(Math.round(rating * 10) / 10) //round to 1 decimal place
        rating = rating.length == 1 ? `${rating}.0` : rating
        return rating;
    }
    else{
        return '0.0';
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

function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "K", "M", "B", "T", "P", "E" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }
    return number;
}

self.addEventListener('message', function(e) {
    var receivedData = e.data;
    var doctorData = receivedData['doctorData']

    if(doctorData['totalPageItem'] > 0){
        for(i=0; i<doctorData['totalPageItem']; i++){
            var html = 
            `<div class="card mb-5 card-animation" style="box-shadow:-10px 10px 30px 3px grey;width:100%">
                <div class="wrapper" style="background: url('/static/images/GoHealthy_doctor info background.png');background-repeat:no-repeat;background-size:100% 100%; padding:10px;">
                    <div class="mb-1" align="right" style="color:#FFD800;">
                        <span class="rating">
                            ${displayStars({doctorData: doctorData['Doctors'][i], is_login: doctorData['is_login']})}
                        </span>
                        <br>
                        <span style="color:#FFD800">
                            Rating: <span id="doctorRatings-${doctorData['Doctors'][i]['id']}">
                                ${displayRating(doctorData['Doctors'][i])}</span>/5.0&nbsp;&nbsp;Votes: 
                            <span id="doctorVotes-${doctorData['Doctors'][i]['id']}">
                                ${abbrNum(doctorData['Doctors'][i]['total_votes'], 1)}
                            </span>
                        </span>
                    </div>
                    <div class="row row-heading">
                        <div class="col-md-5"></div>
                        <div class="col-md text-left">
                            <div class="card-text text-left" style="color:white">
                                <div style="line-height:10px">
                                    <span class="dr-text" style="font-size:17px; font-weight:570;">DR.</span>
                                </div>
                                <span class="card-text-data-heading">
                                    ${doctorData['Doctors'][i]['Name'].toUpperCase()}
                                </span>
                                <span>
                                    &nbsp;${displayGender(doctorData['Doctors'][i])}
                                </span>
                                <div class="card-text card-text-data reg-no">
                                    REG: ${doctorData['Doctors'][i].Username__ID_Number}                                
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-1"></div>
                        <div class="col-md-4 col-5 mr-0 text-left text-md-center">
                            <img class="card-image" src="${displayProfile(doctorData['Doctors'][i])}" alt="Doctor Profile Picture">
                        </div>
                        <div class="col-md col-7 mt-md-3 text-left text-data">
                            <h5 class="card-text card-text-data">
                                <div class="row no-gutters">
                                    <div class="col-1 text-right">
                                        <i class="fad fa-phone-rotary card-text-data-icon"></i>
                                    </div>
                                    <div class="col ml-2 text-left">
                                        +91 ${doctorData['Doctors'][i].Username__Contact}
                                    </div>
                                </div>
                            </h5>
                            <h5 class="card-text card-text-data">
                                <div class="row no-gutters">
                                    <div class="col-1 text-right">
                                        <i class="fad fa-user-md card-text-data-icon"></i>
                                    </div>
                                    <div class="col ml-2 text-left">
                                        ${doctorData['Doctors'][i].Degree__Degree}
                                    </div>
                                </div>
                            </h5>
                            ${displaySpeciality(doctorData['Doctors'][i])}
                        </div>
                    </div>
                </div>
                <div class="card-body" style="margin-top:5px">
                    <div>
                        <div class="row">
                            <div class="col-md-1"></div>
                            <div class="col-md-5 card-text col-right-border card-address text-center text-md-left">
                                <h5 class="card-address-state">${doctorData['Doctors'][i].State__Name}</h5>
                                <h6 class="card-address-text">Town/Village: ${doctorData['Doctors'][i].City}</h6>
                                <h6 class="card-address-text">Sub Division: ${doctorData['Doctors'][i].Subdivision}</h6>
                                <h6 class="card-address-text">District: ${doctorData['Doctors'][i].District__Name}</h6>
                                <h6 class="card-address-text">Pin: ${doctorData['Doctors'][i].Pin}</h6>
                                <hr class="horizontalDivider">
                            </div>
                            <div class="col-md" align="left">
                                <p class="text-muted" style="white-space: pre-wrap">Address:<br>${doctorData['Doctors'][i].Address}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-0" style="margin:-20px;padding:10px;background-color:#CBF0FF">
                        <div class="row">
                            <div class="col">
                                <a href="tel: +91${doctorData['Doctors'][i].Username__Contact}" class="btn btn-success"
                                style="font-size:20px;width:150px;border:2px solid white" aria-labelledby="Call">
                                    <i class="fad fa-phone-alt"></i>
                                    Call</a>
                            </div>
                            <div class="col">
                                <form id="chat username" method="post" action="">
                                    <input type="hidden" name="csrfmiddlewaretoken" value="${receivedData['csrfmiddlewaretoken']}">
                                    <input type="hidden" name="chatwith" value="${doctorData['Doctors'][i].chat}" form="chat${doctorData['request_user']}">
                                    <button type="submit" class="btn btn-success chat-btn" form="chat${doctorData['Doctors'][i].chat}" name="action"
                                            value="doChat" ${displayLoginAlert(doctorData['is_login'])}
                                            style="font-size:20px;width:150px;border:2px solid white" aria-labelledby="Chat">
                                            <i class="fa-solid fa-user-doctor-message"></i>
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