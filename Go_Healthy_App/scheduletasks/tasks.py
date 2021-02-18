from Go_Healthy_App.models import *
from django.core.mail import send_mail
from django.conf import settings
import time
from timeloop import Timeloop
from django.utils import timezone
from django.db.models import Q
import requests
from django.contrib import messages
from background_task import background



def deleteOTP():
    OTP.objects.filter(Expire_Time__lte=timezone.now()).delete()
    return None



def expireBooking():
    book = Bed_Book.objects.filter(Expire_Time__lte = timezone.now(), Status = 'Not Admit Still Now')
    Bed_Book.objects.filter(Expire_Time__lte = timezone.now(), Status = 'Not Admit Still Now').update(Status='Expired')
    for i in book:
        BedNo.objects.filter(Booking_Id=i.Booking_ID).update(Book_by = None, vailability = 'Available', Booking_Id = None)
    return None



def deleteExpireBooking():
    delete_when = timezone.now() - timedelta(hours=100)
    Bed_Book.objects.filter(Expire_Time__lte=delete_when, Status='Expired').delete()
    return None



def multipleBookingWarning():
    Booking = Bed_Book.objects.filter(Status='Expired').order_by('user')
    count = Bed_Book.objects.filter(Status='Expired').count()
    j = 0
    userid = []
    books = ''
    if count > 0:
        for i in Booking:
            if j == 0 or userid[j-1] != i.user:
                userid.append(i.user)
                j += 1
        p = None
        for i in range(0, j):
            if Bed_Book.objects.filter(Status='Expired', user=userid[i]).count() >= 2 and Users.objects.get(username=userid[i].username).is_book_allow == False:
                theUser = Users.objects.get(username=userid[i].username)
                theUser.session_set.all().delete()
                theUser.is_book_allow = False
                theUser.save()
                userType = theUser.User_Type
                if userType == 'Normal':
                    p = NormalUser.objects.get(Username=userid[i])
                elif userType == 'Doctor' or userType == 'Blood Donor & Doctor':
                    p = Doctor.objects.get(Username=userid[i])
                elif userType == 'Blood Donor':
                    p = Blood_Donar.objects.get(Username=userid[i])

                file = open('Multiple_Booking_Alert.html')
                mes = file.read()
                file.close()
                mes = mes.replace('myname', p.Name).replace('mybooks', books)
                subject = 'Unnecessary Booking Happened'
                body = ''
                htmlMessage = mes
                sender = settings.EMAIL_HOST_USER
                receiver = [theUser.email, ]

                send_mail(subject=subject, message=None, from_email=sender, recipient_list=receiver,
                          fail_silently=False,
                          html_message=htmlMessage)
    return None



def deleteResetLink():
    ResetPasswordCode.objects.filter(Expire_Time__lte=timezone.now()).delete()
    return None





def bookExpireAlert():
    remain = timezone.now() + timedelta(minutes=30.0)
    book = Bed_Book.objects.filter(Status="Not Admit Still Now", Expire_Time__lte=remain)
    for i in book:
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
    return None


def deleteRealese():
    when_delete = timezone.now() - timedelta(days=60)
    Bed_Book.objects.filter(Status="Released", Admit_Time__lte = when_delete).delete()
    return None




def deleteNonVerifyUser():
    del_time = timezone.now() - timedelta(days=30)
    Users.objects.filter(is_verified=False, date_joined__lte=del_time).delete()
    return None



def changeBedNo():
    bed = BedNo.objects.exclude(Booking_Id=None)
    for i in bed:
        if Bed_Book.objects.filter(Booking_ID=i.Booking_Id).exists() == False:
            BedNo.objects.filter(Booking_Id=i.Booking_Id).update(Availability = 'Available', Book_by = None, Booking_Id = None)
        else:
            book = Bed_Book.objects.get(Booking_ID=i.Booking_Id)
            if book.Status == 'Expired':
                b = BedNo.objects.get(Booking_Id=i.Booking_Id)
                b.Availability = 'Available'
                b.Book_by = None
                b.Booking_Id = None
                b.save()
    return None

def userOnline():
    check_time = timezone.now() + timedelta(minutes=1)
    Users.objects.filter(is_online=True, last_seen__lt=check_time).update(is_online=False)
    return None
