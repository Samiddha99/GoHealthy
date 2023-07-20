
from django.conf import settings
import time
#from datetime import *
import datetime
from timeloop import Timeloop
from django.db import transaction
from django.db.models import Q
import urllib, urllib3
import urllib.request
import urllib.parse
from django.contrib import messages
from background_task import background
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.schedulers.blocking import BlockingScheduler
from django.utils import timezone as zonetime
from mailjet_rest import Client as mailjet_client
from django.db.models import Count
import requests
from email.mime.multipart import MIMEMultipart
from django_eventstream import send_event
from email.mime.text import MIMEText
from django.core.mail import EmailMessage
from django.core.mail import send_mail
import smtplib
import traceback
from Go_Healthy_App.models import *
from django.db.models.expressions import F
from Go_Healthy_App.utils import *  


schedule = BlockingScheduler()

@schedule.scheduled_job(trigger='interval', minutes=1)
def deleteOTP():
    try:
        with transaction.atomic(durable=True):
            when = zonetime.now() - datetime.timedelta(minutes=10.0)
            OTP.objects.filter(Added_at__lte=when, Is_Verified=False).delete()
            when = zonetime.now() - datetime.timedelta(hours=24.0)
            OTP.objects.filter(Added_at__lte=when, Is_Verified=True).exclude(expire='unlimited').delete()

            when = zonetime.now() - datetime.timedelta(hours=72.0)
            OTP.objects.filter(Added_at__lte=when, Is_Verified=True, expire='unlimited').delete()
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
    finally:
        return True




@schedule.scheduled_job(trigger='interval', minutes=1)
def deleteResetLink():
    try:
        with transaction.atomic(durable=True):
            del_time = zonetime.now() - datetime.timedelta(minutes=10.0)
            ResetPasswordCode.objects.filter(Added_at__lte=del_time).delete()
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
    finally:
        return True



@schedule.scheduled_job(trigger='interval', minutes=5)
def sendBloodDonationCampReminder():
    try:
        with transaction.atomic(durable=True):
            upcomingCamps = BloodDonationCamp.incoming_objects.all()
            reminders =  CampReminder.objects.filter(Camp__in=upcomingCamps)
            for i in reminders:
                targetURL = settings.SITE_URL + reverse("Go_Healthy_App:BloodDonationCampDetail", kwargs={'id': i.camp_id})
                event_start_date = i.Camp.Start_Date
                event_start_time = i.Camp.Start_Time
                event_end_date = i.Camp.End_Date
                event_end_time = i.Camp.End_Time
                Send_Before_in_minute = int(i.Send_Before_in_minute)
                event_start_datetime = parser.parse(event_start_date+" "+event_start_time)
                event_start_datetime = event_start_datetime + datetime.timedelta(days=i.reminder_sent)

                if event_start_datetime - datetime.timedelta(minutes=Send_Before_in_minute) <= datetime.datetime.now():
                    if event_end_date is None:
                        startDate = str(event_start_time)
                    else:
                        startDate = str(event_start_time)+" to "+str(event_end_time)

                    file = open('SMS_Templates/Blood_Donation_Camp_Event_Reminder.txt')
                    message = file.read()
                    file.close()

                    diff = event_start_datetime - datetime.datetime.now()
                    diffInMinutes = diff.total_seconds() / 60

                    if diffInMinutes < 60:
                        minutes = divmod(diff.seconds, 60)
                        diff = str(minutes[0])+" Minutes "+str(minutes[1])+" Seconds"
                    else:
                        days, seconds = diff.days, diff.seconds
                        hours = seconds // 3600 
                        minutes = (seconds % 3600) // 60
                        seconds = seconds % 60
                        if days <= 0:
                            diff = str(hours)+" Hours "+str(minutes)+" Minutes "+str(seconds)+" Seconds"
                        else:
                            diff = str(days)+" Days "+str(hours)+" Hours "+str(minutes)+" Minutes "+str(seconds)+" Seconds"
                    shortedTargetUrl = shortUrl(destination=targetURL, title="Blood Donation Camp Details")
                    organizerWebsite = i.Camp.Organizer_Website
                    shortedOrganizerWebsite = 'Not Provided'
                    if organizerWebsite is not None:
                        shortedOrganizerWebsite = shortUrl(destination=organizerWebsite, title="Blood Donation Camp's Organizer's Website")
                    mes = message.replace("**Organizer**", i.Camp.Organizer).replace("**afterhour**", diff).replace("**EventDate**", startDate).replace("**EventTime**", str(i.Camp.Start_Time)+" to "+str(i.Camp.End_Time)).replace("**State**", i.Camp.State.Name).replace("**District**", i.District.Name).replace("**Subdivision**", i.Camp.Subdivision).replace("**City**", i.Camp.City).replace("**Landmark**", i.Camp.Landmark).replace("**Pin**", i.Camp.Pin).replace("**Contact**", i.Camp.Organizer_Contact).replace("**Website**", shortedOrganizerWebsite).replace("**Event_Link**", shortedTargetUrl)
                    if event_end_date is not None: 
                        event_end_datetime = parser.parse(event_end_date+" "+event_end_time)
                        if event_start_datetime <= event_end_datetime:
                            i.reminder_sent += 1
                            i.save()
                            newThreadSMS = sendSMS(numbers=[i.Mobile,], message=mes, template_id='')
                            newThreadSMS.start()
                        else:
                            CampReminder.objects.filter(id=i.id).delete()
                    else:
                        newThreadSMS = sendSMS(numbers=[i.Mobile,], message=mes, template_id='')
                        newThreadSMS.start()
                        CampReminder.objects.filter(id=i.id).delete()
    except:
        pass
    finally:
        return True
            

            




class BookExpireAlert(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
    def run(self):
        try:
            with transaction.atomic(durable=True):
                remain = zonetime.now() + datetime.timedelta(minutes=30.0)
                book = PatientData.objects.filter(Status="Not Admit Still Now", Expire_Time__lte=remain)
                file = open('SMS_Templates/Book_Expiring.txt')
                message = file.read()
                file.close()
                for i in book:
                    mes = message.replace('**yourId**', i.Booking_ID)
                    newThreadSMS =  sendSMS(numbers=[i.Mobile,], message=mes, template_id='')
                    newThreadSMS.start()
        except Exception as e:
            traceback.print_exc()
            print("\n\n")
        

@schedule.scheduled_job(trigger='interval', minutes=1)
def bookExpireAlert():
    try:
        threadTask = BookExpireAlert()
        threadTask.start()
    except:
        pass
    finally:
        return True
    



class ExpireBooking(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
    def run(self):
        try:
            with transaction.atomic(durable=True):
                books = PatientData.objects.filter(Expire_Time__lte = zonetime.now(), Status = 'Not Admit Still Now')
                book = list(books.values_list('Booking_ID', flat=True))
                beds = BedNo.objects.filter(Booking_Id__in=book)
                beds_id = list(beds.values_list('id', flat=True))
                beds.update(Book_by = None, Availability = 'Available', Booking_Id = None, Last_Update=zonetime.now())
                fetchBed(hospitals=Hospital.objects.filter(hospital_bed__id__in=beds_id), needThread=True)
                for i in books:
                    bk = PatientData.objects.get(Booking_ID=i.Booking_ID)
                    bk.Status = "Expired"
                    bk.save()
        except Exception as e:
            traceback.print_exc()
            print("\n\n")
        

@schedule.scheduled_job(trigger='interval', minutes=1)
def expireBooking():
    try:
        threadTask = ExpireBooking()
        threadTask.start()
    except:
        pass
    finally:
        return True



@schedule.scheduled_job(trigger='interval', minutes=1)
def unreserveBed():
    try:
        with transaction.atomic(durable=True):
            del_time = zonetime.now() - datetime.timedelta(minutes=15.0)
            beds = BedNo.objects.filter(Availability='Reserved', Last_Update__lte=del_time)
            beds_id = list(beds.values_list('id', flat=True))
            beds.update(Availability='Available')
            fetchBed(hospitals = Hospital.objects.filter(hospital_bed__id__in=beds_id), needThread=True)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
    finally:
        return True





@schedule.scheduled_job(trigger='interval', hours=1)
def multipleBookingWarning():
    try:
        with transaction.atomic(durable=True):
            Booking = PatientData.objects.values('Username', 'Username__username').annotate(Username_count=Count('Username')).order_by('Username').filter(Username_count__gte=2, Status='Expired', Username__is_book_allow=True) # return all bookings with same user more than 2
            usernames = list(Booking.values_list('Username__username', flat=True))
            userEmails = list(Booking.values(email=F('Username__email'), name=F('Username__username')))
            if len(userEmails) > 0:
                try:
                    file = open('Email_Templates/User/Multiple_Booking_Alert.html')
                    mes = file.read()
                    file.close()
                    mes = mes.replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact'))
                    subject = 'Unnecessary Booking Happened'
                    body = None
                    htmlMessage = mes
                    sender = settings.DEFAULT_FROM_EMAIL
                    newThreadEmail = Send_Mail(From=sender, To=userEmails, Subject=subject, Text=body, HTML=htmlMessage, messageGroup="Multiple_Booking_Warning")
                    newThreadEmail.start()
                except:
                    pass
                finally:
                    pass
            Users.objects.filter(username__in=usernames).update(is_book_allow=False)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
    finally:
        return True



@schedule.scheduled_job('cron', hour='19', minute='32') #run at every 17.32 PM UTC (i.e. 12.02 AM)
def donorDowngradeMessage():
    try:
        with transaction.atomic(durable=True):
            past_year = datetime.date.today().year - 65
            past_month = datetime.date.today().month
            past_day = datetime.date.today().day
            date_time_str = "{0}/{1}/{2}".format(past_day, past_month, past_year)
            past =  datetime.datetime.strptime(date_time_str, '%d/%m/%Y')
            donorsOver65 = Blood_Donar.objects.filter(Date_of_Birth__lt=past)
            for donor in donorsOver65:
                userTypes = donor.Username.User_Type
                userTypes.remove('Blood Donor')
                if not "Doctor" in userTypes:
                    userTypes.append('Normal')
                    profilePic = donor.Image
                    head, tail = os.path.split(str(profilePic.file))
                    imageFile = File(profilePic.file, name=tail)
                    NormalUser.objects.create(Username=donor.Username, Name=donor.Name, Gender=donor.Gender, Address=donor.Address, State=donor.State, City=donor.City, Subdivision=donor.Subdivision, District=donor.District, Pin=donor.Pin, Permanent_Address=donor.Permanent_Address, Permanent_State=donor.Permanent_State, Permanent_City=donor.Permanent_City, Permanent_Subdivision=donor.Permanent_Subdivision, Permanent_District=donor.Permanent_District, Permanent_Pin=donor.Permanent_Pin, Image=imageFile)
            donorsOver65Emails = list(donorsOver65.values(email=F('Username__email'), name=F('Name')))
            donorsOver65.delete()
            def sendMessage():
                if len(donorsOver65Emails) > 0:
                    try:
                        file = open('Email_Templates/User/Donor_Age_No_More_Eligible.html')
                        mes = file.read()
                        file.close()
                        donorEligibilityUrl = settings.SITE_URL + reverse('Go_Healthy_App:DonorEligibility')
                        mes = mes.replace("**eligibility_criteria_url**", donorEligibilityUrl).replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact'))
                        subject = 'Blood Donor Account Is Downgraded'
                        body = None
                        htmlMessage = mes
                        sender = settings.DEFAULT_FROM_EMAIL
                        newThreadEmail = Send_Mail(From=sender, To=donorsOver65Emails, Subject=subject, Text=body, HTML=htmlMessage, messageGroup="Donor_Account_Downgraded")
                        newThreadEmail.start()
                    except:
                        pass
                    finally:
                        pass
            transaction.on_commit(sendMessage)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
    finally:
        return True



@schedule.scheduled_job(trigger='interval', days=30)
def deleteBloodRequest():
    try:
        with transaction.atomic(durable=True):
            del_time = zonetime.now() - datetime.timedelta(years=10)
            BloodRequest.objects.filter(Requested_at__lt=del_time).delete()
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
    finally:
        return True


@schedule.scheduled_job(trigger='interval', days=30)
def deleteBloodDonationCamps():
    try:
        with transaction.atomic(durable=True):
            del_time = zonetime.now() - datetime.timedelta(years=10)
            BloodDonationCamp.objects.filter(Q(End_Date=None, Start_Date__lt=del_time.date()) | Q(~Q(End_Date=None), End_Date__lt=del_time.date())).delete()
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
    finally:
        return True





@schedule.scheduled_job(trigger='interval', days=1)
def deletePastPatientRecords():
    try:
        with transaction.atomic(durable=True):
            when_delete = zonetime.now() - datetime.timedelta(years=10)
            PatientData.objects.filter(Status__in=['Released', 'Died', 'Referred'], Status_Changed_At__lte = when_delete).delete()
            ReferredPatient.objects.filter(ReferredDate__lte = when_delete).delete()
            delete_when = zonetime.now() - datetime.timedelta(days=30)
            PatientData.objects.filter(Expire_Time__lte=delete_when, Status__in=["Don't Need to Admit", 'Expired']).delete()
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
    finally:
        return True





@schedule.scheduled_job('cron', hour='19', minute='32') #run at every 17.32 PM UTC (i.e. 12.02 AM)
def deleteNonVerifyUser():
    try:
        with transaction.atomic(durable=True):
            del_time = zonetime.now() - datetime.timedelta(days=30)
            Users.objects.filter(is_verified=False, date_joined__date__lte=del_time).delete()
            del_time = zonetime.now() - datetime.timedelta(days=3)
            Users.objects.filter(Registered=False, date_joined__date__lte=del_time).delete()
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
    finally:
        return True





@schedule.scheduled_job(trigger='interval', days=1)
def deleteContactUs():
    try:
        with transaction.atomic(durable=True):
            del_time = zonetime.now() - datetime.timedelta(days=100)
            ContactUs.objects.filter(Contact_Time__lte=del_time).delete()
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
    finally:
        return True


@schedule.scheduled_job(trigger='interval', days=1, id='FeedbackDelete', name='Delete old feedbacks')
def deleteFeedback():
    try:
        with transaction.atomic(durable=True):
            del_time = zonetime.now() - datetime.timedelta(days=100)
            UserFeedback.objects.filter(Added_at__lte=del_time).delete()
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
    finally:
        return True


@schedule.scheduled_job('cron', id='id_reset-live-data', hour='19', minute='30') #run at every 19.30 PM UTC (i.e. 12.00 AM)
def resetLiveData():
    try:
        eventData = {
            'total_book': PatientData.objects.filter(Booking_Time__date=datetime.datetime.now()).exclude(Status='Expired').exclude(Booked_By='Hospital Authority').count(),
            'book_changed': '1',
            
            'total_bloodRequest': BloodRequest.today_objects.all().count(),
            'bloodRequest_changed': '1',
            'total_bloodDonationCamp': BloodDonationCamp.today_objects.all().count(),
            'bloodDonationCamp_changed': '1',
            'total_bloodDonated': BloodDonationCollectionRecord.objects.filter(Issued_at__date=datetime.datetime.now(), Certificate_issued_for="Blood Donation").count(),
            'bloodDonated_changed': '1',
            'total_bloodCollected': BloodDonationCollectionRecord.objects.filter(Issued_at__date=datetime.datetime.now(), Certificate_issued_for="Blood Collection").count(),
            'bloodCollected_changed': '1',
            
            
            'total_admit': PatientData.objects.filter(Admit_Time__date=datetime.datetime.now(), Status='Admitted').count(),
            'admit_changed': '1',
            'total_released': PatientData.objects.filter(Status_Changed_At__date=datetime.datetime.now(), Status='Released').count(),
            'released_changed': '1',
            'total_referred': ReferredPatient.objects.filter(ReferredDate__date=zonetime.now()).order_by('Patient__pk').distinct('Patient__pk').count(),
            'referred_changed': '1',
            'total_died': PatientData.objects.filter(Status_Changed_At__date=datetime.datetime.now(), Status='Died').count(),
            'died_changed': '1',
        }
        send_event('liveData', 'message', eventData)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
    finally:
        return True

def startSchedule():
    print("Starting schedule tasks..............")
    try:
        schedule.start()
    except Exception as e:
        traceback.print_exc()
    finally:
        return True
    
def stopSchedule():
    try:
        schedule.shutdown(wait=True)
    except Exception as e:
        traceback.print_exc()
    finally:
        return True

