from Go_Healthy_App.models import *
from django.core.mail import send_mail
from django.conf import settings
import time
from timeloop import Timeloop
from datetime import timedelta
import requests
from django.contrib import messages
from background_task import background



def deleteOTP():
    OTP.objects.all().delete()



def expireBooking():
    book = Bed_Book.objects.filter(Expire_Time__lte = timezone.now(), Status = 'Not Admit Still Now')
    for i in book:
        if BedNo.objects.filter(Booking_Id=i.Booking_ID).exists():
            bed = BedNo.objects.get(Booking_Id=i.Booking_ID)
            bed.Book_by = None
            bed.Availability = 'Available'
            bed.Booking_Id = None
            bed.save()
            b = Bed_Book.objects.get(Booking_ID=i.Booking_ID)
            b.Status = 'Expired'
            b.save()



def deleteExpireBooking():
    time_now = timezone.now()
    delete_when = time_now - timedelta(hours=100)
    Bed_Book.objects.filter(Expire_Time__lte=delete_when, Status='Expired').delete()



def multipleBookingWarning():
    Booking = Bed_Book.objects.filter(Status='Expired').order_by('user')
    count = Bed_Book.objects.filter(Status='Expired').count()
    j = 0
    userid = []
    if count > 0:
        for i in Booking:
            if j == 0:
                userid.append(i.user)
                j += 1
            elif userid[j-1] != i.user:
                userid.append(i.user)
                j += 1
        p = None
        for i in range(0, j):
            if Bed_Book.objects.filter(Status='Expired', user=userid[i]).count() >= 2 and Users.objects.get(username=userid[i].username).is_active == True:
                theUser = Users.objects.get(username=userid[i].username)
                theUser.session_set.all().delete()
                theUser.is_active = False
                theUser.save()
                userType = theUser.User_Type
                if userType == 'Normal':
                    p = NormalUser.objects.get(Username=userid[i])
                elif userType == 'Doctor' or userType == 'Blood Donor & Doctor':
                    p = Doctor.objects.get(Username=userid[i])
                elif userType == 'Blood Donor':
                    p = Blood_Donar.objects.get(Username=userid[i])

                subject = 'unnecessary Booking Happened'
                body = ''
                htmlMessage = "<html><body><h1 style='color:yellow'>Go Healthy</h1><h4 style='color:red'>You have violenced T&C</h4><h5>You have booked bed multiple times, but didn't go to the hospital.<br>We deactivated your account.</h5></body></html>"
                sender = settings.EMAIL_HOST_USER
                receiver = [theUser.email, ]

                send_mail(subject=subject, message=body, from_email=sender, recipient_list=receiver,
                          fail_silently=False,
                          html_message=htmlMessage)

                subject = 'unnecessary Booking Happened'
                body = ''
                htmlMessage = "<html><body><h1 style='color:yellow'>Go Healthy</h1><h5>A user book bed multiple times but don't go to the hospital.<br>Username: "+str(theUser.username)+"<br>Name: "+str(p.Name)+"<br>User Type: "+str(theUser.User_Type)+"<br>Email: "+str(theUser.email)+"<br>Contact: "+str(p.Contact)+"</h5></body></html>"
                sender = settings.EMAIL_HOST_USER
                receiver = [settings.EMAIL_HOST_USER, ]

                send_mail(subject=subject, message=body, from_email=sender, recipient_list=receiver,
                          fail_silently=False,
                          html_message=htmlMessage)



def deleteResetLink():
    ResetPasswordCode.objects.filter(Expire_Time__lte=timezone.now()).delete()





def bookExpireAlert():
    book = Bed_Book.objects.filter(Status="Not Admit Still Now")
    for i in book:
        remain = i.Expire_Time - timedelta(minutes=30)
        if remain <= timezone.now():
            url = "https://www.fast2sms.com/dev/bulk"
            payload = {
                'sender_id': 'FSTSMS',
                'message': "42459",
                'language': 'english',
                'route': 'qt',
                'numbers': i.Mobile,
                'variables': "{#BB#}",
                'variables_values': i.Booking_ID,
            }
            headers = {
                'authorization': settings.FAST2SMAS_API_KEY,
                'Content-Type': "application/x-www-form-urlencoded",
                'Cache-Control': "no-cache",
            }
            requests.request("POST", url, data=payload, headers=headers)


def deleteRealese():
    when_delete = timezone.now() - timedelta(days=60)
    Bed_Book.objects.filter(Status="Released", Admit_Time__lte = when_delete).delete()




def deleteNonVerifyUser():
    the_user = Users.objects.filter(is_verified=False)
    insts = []
    n = 0
    for i in the_user:
        join = i.date_joined
        join = join + timedelta(days=30)
        if join <= timezone.now():
            insts[n] =i.username
            n += 1
    for i in insts:
        Users.objects.filter(username=insts[i]).delete()



def changeBedNo():
    bed = BedNo.objects.exclude(Booking_Id=None)
    for i in bed:
        if Bed_Book.objects.filter(Booking_ID=i.Booking_Id).exists() == False:
            b= BedNo.objects.get(Booking_Id=i.Booking_Id)
            b.Availability = 'Available'
            b.Book_by = None
            b.Booking_Id = None
            b.save()
        else:
            book = Bed_Book.objects.get(Booking_ID=i.Booking_Id)
            if book.Status == 'Expired':
                b = BedNo.objects.get(Booking_Id=i.Booking_Id)
                b.Availability = 'Available'
                b.Book_by = None
                b.Booking_Id = None
                b.save()
