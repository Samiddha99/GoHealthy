
function dateFormat(date)
{
    var dt = new Date(date);
    day = dt.toLocaleString('default', { day: 'numeric' });
    month = dt.toLocaleString('default', { month: 'short' });
    year = dt.toLocaleString('default', { year: 'numeric' });
    
    dt = `${(day <= 9) ? '0'+day : day} ${(month <= 9) ? '0'+month : month} ${(year <= 9) ? '0'+year : year}`;
    return dt;
}
function timeFormat(time)
{
    time = time.split(":")
    let hour = time[0]
    let ampm = hour >= 12 ? 'PM' : 'AM'; //AM or PM
    hour = hour % 12; //convert in 12-hour format;
    hour = hour ? hour : 12; //display 0 as 12
    let minute = time[1]
    
    dt = `${hour <=9 ? '0'+hour : hour}:${minute} ${ampm}`
    return dt;
}

function formatDateTimeforAddEvent(date, time, startDate='')
{
    if(date == null){
        date = startDate;
    }
    var dt = new Date(date);
    day = dt.toLocaleString('default', { day: 'numeric' });
    month = dt.toLocaleString('default', { month: 'numeric' });
    year = dt.toLocaleString('default', { year: 'numeric' });

    time = time.split(":")
    let hour = time[0]
    hour = hour % 12; //convert in 12-hour format;
    hour = hour ? hour : 12; //display 0 as 12
    let minute = time[1]
    let ampm = hour >= 12 ? 'PM' : 'AM'; //AM or PM
    
    dt = `${(month <= 9) ? '0'+month : month}/${(day <= 9) ? '0'+day : day}/${year} ${hour <=9 ? '0'+hour : hour}:${minute} ${ampm}`;
    return dt;
}

function repeatAlarm(endDate){
    if(endDate != null){
        var dt = new Date(endDate);
        day = dt.toLocaleString('default', { day: 'numeric' });
        month = dt.toLocaleString('default', { month: 'numeric' });
        year = dt.toLocaleString('default', { year: 'numeric' });
        return `<span class="recurring">FREQ=DAILY;UNTIL=${year}${(month <= 9) ? '0'+month : month}${(day <= 9) ? '0'+day : day}T235959</span>`
    }
    else{
        return ''
    }
}

function displayDate(startDate, endDate){
    startDate = dateFormat(startDate);
    if(endDate != null){
        endDate = dateFormat(endDate);
        return `<span>${startDate} To ${endDate}</span>`;
    }
    else{
        return `<span>Date: ${startDate}</span>`
    }
}
function displayWebsite(url){
    if(url == null || url == undefined || url == ''){
        return ''
    }
    else{
        return `<p>${url}</p>`;
    }
}

function isEnded(startDate, endDate, startTime, campId){
    current_datetime = new Date()
    start = new Date(`${startDate} ${startTime}`);
    if(endDate != null){
        end = new Date(`${endDate} ${startTime}`);
        if(end > current_datetime){
            return `<button type="button" class="btn btn-primary mb-2" data-toggle="modal" data-target="#setReminderModal-${campId}"><i class="fa-regular fa-alarm-clock"></i> Set Reminder</button>`
        }
    }
    else{
        if(start > current_datetime){
            return `<button type="button" class="btn btn-primary mb-2" data-toggle="modal" data-target="#setReminderModal-${campId}"><i class="fa-regular fa-alarm-clock"></i> Set Reminder</button>`
        }
    }
    return ``;
}

self.addEventListener('message', function(e) {
    var receivedData = e.data;
    for(i=0; i<receivedData.donationCamps.length; i++){
        var donationCamp = receivedData.donationCamps[i]
        var html = 
        `
            <div class="card mb-3 data-card" align="center">
                <div class="card-body" style="padding-top: 10px !important; padding-bottom: 5px !important;">
                    <div class="card-title">
                        <h6 style="margin-bottom: 0px;">Organized By:</h6>
                        <span style="font-size: 20px;">${donationCamp.Organizer}</span>
                    </div>
                    <div class="card-text" style="margin-top:-10px !important;">
                        <hr>
                        <div class="row">
                            <div class="col-md text-left col-venue">
                                <h5 style="font-size: 18px;margin-bottom: 0px" class="text-center"><strong>Venue</strong></h5>
                                <p style="line-height:30px;">
                                    <b>City: </b>${donationCamp.City}
                                    <br><b>Subdivision: </b>${donationCamp.Subdivision}
                                    <br><b>State: </b>${donationCamp.State__Name}
                                    <br><b>District: </b>${donationCamp.District__Name}
                                    <br><b>Pin: </b>${donationCamp.Pin}
                                    <br><b>Landmark: </b>${donationCamp.Landmark}
                                </p>
                            </div>
                            <div class="col-md pt-3 pt-md-0">
                                <h5 style="font-size: 18px;margin-bottom: 0px" class="text-center"><strong>Contact</strong></h5>
                                <p style="margin-bottom:-4px">${donationCamp.Organizer_Contact}</p>
                                <p style="margin-bottom:-4px">${donationCamp.Email}</p>
                                ${displayWebsite(donationCamp.Organizer_Website)}

                                <h5 style="font-size: 18px;margin-bottom: 0px" class="text-center mt-3"><strong>Organized On</strong></h5>
                                <p>
                                    ${displayDate(donationCamp.Start_Date, donationCamp.End_Date)}
                                </p>
                                <p style="margin-top: -18px !important;">
                                    Time: ${timeFormat(donationCamp.Start_Time)} - ${timeFormat(donationCamp.End_Time)}
                                </p>
                                ${isEnded(donationCamp.Start_Date, donationCamp.End_Date, donationCamp.Start_Time, donationCamp.camp_id)}
                            </div>
                        </div>
                        <a href="/blood-donation-camp/${donationCamp.camp_id}" class="mb-3" style="text-decoration:none; font-size:18px">More Info</a>
                    </div>
                </div>
            </div>
        
        <div class="modal fade setReminderModal text-left" id="setReminderModal-${donationCamp.camp_id}" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="setReminderModalLabel-${donationCamp.camp_id}" aria-hidden="true">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title text-muted" id="reminderModalLabel-${donationCamp.camp_id}">SET REMINDER</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                    <form class="set-reminder-form" id="set-reminder-form-${donationCamp.camp_id}" method="post" data-id="${donationCamp.camp_id}">
                        <input type="hidden" name="reminder_event" form="set-reminder-form-${donationCamp.camp_id}" value="${donationCamp.camp_id}">
                        <div class="floating-label">
                            <input type="tel" inputmode="tel" class="form-control input-sm reminder-input" name="reminder_mobile" id="reminder_mobile-${donationCamp.camp_id}" form="set-reminder-form-${donationCamp.camp_id}" minlength="10" maxlength="10" placeholder=" " required>
                            <label for="reminder_mobile-${donationCamp.camp_id}">
                                <span>Your mobile no</span>
                            </label>
                        </div>
                        <div class="reminder-input-info">
                            We will send a reminder to this number before the event starts
                        </div>
                        <label for="send-before" class="mt-3">Send Reminder Before</label>
                        <div class="row no-gutters">
                            <div class="col">
                                <div class="input-group mb-3">
                                    <input type="number" name="reminder_hh" id="set-before-hh-${donationCamp.camp_id}" inputmode="numeric" step="1" min="00" max="24" class="form-control input-sm reminder-input set-before" form="set-reminder-form-${donationCamp.camp_id}" placeholder="HH" value="01" aria-describedby="hh-addon-${donationCamp.camp_id}" data-id="${donationCamp.camp_id}" required>
                                    <div class="input-group-append">
                                    <span class="input-group-text addon" id="hh-addon-${donationCamp.camp_id}">HH</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col ml-1">
                                <div class="input-group mb-3">
                                    <input type="number" name="reminder_mm" id="set-before-mm-${donationCamp.camp_id}" inputmode="numeric" step="1" min="00" max="59" class="form-control input-sm reminder-input set-before" form="set-reminder-form-${donationCamp.camp_id}" placeholder="MM" value="00" aria-describedby="mm-addon-${donationCamp.camp_id}" data-id="${donationCamp.camp_id}" required>
                                    <div class="input-group-append">
                                    <span class="input-group-text addon" id="hh-addon-${donationCamp.camp_id}">MM</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-3 ml-1">
                                <button type="submit" class="btn btn-primary set-reminder-form-submit" id="set-reminder-form-submit-${donationCamp.camp_id}" form="set-reminder-form-${donationCamp.camp_id}">
                                <i class="fa-thin fa-calendar-check"></i> <span class="set-reminder-form-submit-text" id="set-reminder-form-submit-text-${donationCamp.camp_id}">SET</span>
                                </button>
                            </div>
                        </div>
                        <div id="set-before-error-${donationCamp.camp_id}" class="set-before-error" style="color: red; font-size:14px; margin-top:-10px"></div>
                        <div id="set-before-success-${donationCamp.camp_id}" class="text-success set-before-success"></div>
                    </form>
                    <div class="text-center mt-3 add-to-calender-button-div" align="center" id="add-to-calender-button-div-${donationCamp.camp_id}">
                        <div title="Add to Calendar" class="addeventatc add-to-calender-button add-to-calender-button-${donationCamp.camp_id}" data-intel="true" data-dropdown-x="auto" data-dropdown-y="auto" data-google-api="true">
                            Add to Calendar
                            <span class="start">${formatDateTimeforAddEvent(donationCamp.Start_Date, donationCamp.Start_Time)}</span>
                            <span class="end">${formatDateTimeforAddEvent(donationCamp.End_Date, donationCamp.End_Time, donationCamp.Start_Date)}</span>
                            <span class="date_format">MM/DD/YYYY</span>
                            <span class="timezone">Asia/Calcutta</span>
                            <span class="title">Blood Donation Camp</span>
                            <span class="description">
                                Organized by: ${donationCamp.Organizer},
                                <br>Contact: ${donationCamp.Organizer_Contact},
                                <br>Email: ${donationCamp.Email},
                                <br><br>
                                <b>VENUE:</b>
                                <br>State: ${donationCamp.State__Name}
                                <br>District: ${donationCamp.District__Name}
                                <br>Subdivision: ${donationCamp.Subdivision}
                                <br>City: ${donationCamp.City}
                                <br>Landmark: ${donationCamp.Landmark}
                                <br>Pin: ${donationCamp.Pin}
                                <br><br>
                                <b>DATE and TIME:</b>
                                <br>Date: ${displayDate(donationCamp.Start_Date, donationCamp.End_Date)}
                                <br>Time: ${timeFormat(donationCamp.Start_Time)} - ${timeFormat(donationCamp.End_Time)}
                            </span>
                            <span class="location">${donationCamp.Landmark}</span>
                            <span class="organizer">${donationCamp.Organizer}</span>
                            <span class="organizer_email">${donationCamp.Email}</span>
                            <span class="alarm_reminder" id="alarm_reminder-${donationCamp.camp_id}">60</span>
                            <span class="calname">Blood Donation Camp-${donationCamp.camp_id}</span>
                            ${repeatAlarm(donationCamp.End_Date)}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary reminder-modal-close" data-dismiss="modal">Close</button>
                </div>
            </div>
            </div>
        </div>`
        
        var sendData = {
            'html': html,
            'id': donationCamp.camp_id,
            'isLastRecord': i==receivedData.donationCamps.length-1,
        }
        self.postMessage(sendData);
    }

}, false);