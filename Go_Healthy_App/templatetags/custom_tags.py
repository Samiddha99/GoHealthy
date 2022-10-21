import json
from django import template
from Go_Healthy_App.models import *
from datetime import date, datetime, timedelta
#import datetime
from django.utils import timezone as zonetime
import pytz
from django.conf import settings
from numerize import numerize
import os
import ast
import requests
from django.db.models.expressions import F
from django_eventstream import send_event, get_current_event_id
import traceback
from django.core import serializers
from dateutil import parser
import urllib.parse
from django.contrib.sessions.models import Session




register = template.Library()
ist = pytz.timezone('asia/kolkata')

# @register.filter
# def total(value, arg):
#     try:
#         value = str(value)
#         arg = str(arg)
#         hospital = Hospital.objects.get(Unique_Id=value)
#         arg = arg.split(", ")
#         totalBed = 0
#         totalBed = BedNo.objects.filter(Hospital=hospital, Ward=arg[0], Support=arg[1]).count()
#         return totalBed
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
#         return None

# @register.filter
# def isBed(value):
#     try:
#         value = str(value)
#         hospital = Hospital.objects.get(Unique_Id=value)
#         ret = False
#         if (BedNo.objects.filter(Hospital=hospital, Availability="Available", Ward__in=["General Ward", "Female Ward", "Male Ward", "Child Ward", "ICU"]).count() > 0):
#             ret = True
#         return ret
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
#         return None

# @register.filter
# def lstUpdate(value):
#     try:
#         hospital = Hospital.objects.get(Unique_Id=value)
#         if BedNo.objects.filter(Hospital=hospital).exists():
#             b = BedNo.objects.filter(Hospital=hospital).order_by('-Last_Update').first()
#             last = (b.Last_Update.astimezone(ist))
#             return last.strftime("%d %B %Y, %I:%M %p")
#         else:
#             return ''
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
#         return None

# @register.filter
# def Book(value, arg):
#     try:
#         if PatientData.objects.filter(Booking_ID=value).exists() == False:
#             return None
#         else:
#             book = PatientData.objects.get(Booking_ID=value)
#             if arg == "Name":
#                 return book.Patient_Name
#             elif arg == "Gender":
#                 return book.Gender
#             elif arg == "Age":
#                 return book.Age
#             elif arg == "Contact":
#                 return book.Mobile
#             elif arg == "Booked":
#                 t =  book.Booking_Time
#                 return t.astimezone(ist)
#             elif arg == "Expired":
#                 t = book.Expire_Time
#                 return t.astimezone(ist)
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
#         return None

# @register.filter
# def pendingBed(value, arg):
#     try:
#         if BedNo.objects.filter(Booking_Id=value, Availability='Book').exists() == False:
#             return None
#         else:
#             if arg == "ward":
#                 bed = BedNo.objects.filter(Booking_Id=value, Availability='Book').first()
#                 return bed.Ward
#             elif arg == "bed":
#                 bed = BedNo.objects.filter(Booking_Id=value, Availability='Book').first()
#                 return bed.Bed_No
#             elif arg == "building":
#                 bed = BedNo.objects.filter(Booking_Id=value, Availability='Book').first()
#                 return bed.Building
#             elif arg == "floor":
#                 bed = BedNo.objects.filter(Booking_Id=value, Availability='Book').first()
#                 return bed.Flor
#             elif arg == "requirement":
#                 bed = BedNo.objects.filter(Booking_Id=value, Availability='Book').first()
#                 if  bed.Ward in ['General Ward', 'Male Ward', 'Female Ward', 'Child Ward']:
#                     if bed.Has_O2:
#                         return 'With Oxygen'
#                     else:
#                         return 'Non-Oxygen'
#                 if  bed.Ward in ['ICU', 'PICU', 'NICU']:
#                     if bed.Has_Ventilation:
#                         return 'With Ventilator'
#                     else:
#                         return 'Non-Ventilator'
#             elif arg == "id":
#                 bed = BedNo.objects.filter(Booking_Id=value, Availability='Book').first()
#                 return  bed.id
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
#         return None

# @register.filter
# def HaveIt(value, arg):
#     try:
#         if arg == "hospital":
#             ret = Hospital.objects.filter(State = value).exists()
#             return ret
#         elif arg == "doctor":
#             ret1 = Doctor.objects.filter(State = value).exists()
#             return ret1
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
#         return None


# @register.filter
# def UserData(value, arg):
#     try:
#         user = Users.objects.get(username=value)
#         if user.User_Type == "Normal":
#             user = NormalUser.objects.get(Username=user)
#             if arg == 'Image':
#                 ret = user.Image
#             elif arg == 'Name':
#                 ret = user.Name
#         elif user.User_Type == "Hospital":
#             user = Hospital.objects.get(Username=user)
#             if arg == 'Image':
#                 ret = user.Image
#             elif arg == 'Name':
#                 ret = user.Name
#         elif user.User_Type == "Blood Donor":
#             user = Blood_Donar.objects.get(Username=user)
#             if arg == 'Image':
#                 ret = user.Image
#             elif arg == 'Name':
#                 ret = user.Name
#         elif user.User_Type == "Doctor" or user.User_Type == "Blood Donor & Doctor":
#             user = Doctor.objects.get(Username=user)
#             if arg == 'Image':
#                 ret = user.Image
#             elif arg == 'Name':
#                 ret = user.Name
#         else:
#             user = None
#             ret = None
#         return ret
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
#         return None

# @register.filter
# def IST (value): # Used
#     try:
#         if type(value) != str:
#             return value.astimezone(ist)
#         else:
#             return None
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
#         return None

@register.filter
def newChat(value, arg): # used
    try:
        sender = Users.objects.get(username=value)
        receiver = Users.objects.get(username=arg)
        num = Chat.objects.filter(From=sender, To=receiver, Delivered=False).count()
        return num
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
        return None


@register.filter
def totalNewChat(arg): # used
    try:
        user = Users.objects.get(username=arg)
        num = Chat.objects.filter(To=user, Delivered=False).count()
        return num
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
        return None


@register.filter
def totalBookings(arg): # used
    try:
        user = Users.objects.get(username=arg)
        num = PatientData.objects.filter(Username=user).exclude(Status='Expired').exclude(Booked_By='Hospital Authority').count()
        return num
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
        return None

# @register.filter
# def string(arg):
#     try:
#         s = str(arg)
#         return s
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
#         return None

# @register.filter
# def isSpecial(arg):
#     try:
#         doc = Doctor.objects.get(Registration_Number=arg)
#         if doc.Special.Speciality == 'N/A':
#             return False
#         else:
#             return True
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
#         return None


# @register.filter
# def findAge(arg):
#     try:
#         today = date.today()
#         user = Blood_Donar.objects.get(id=arg)
#         dob = user.Date_of_Birth
#         age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
#         return age
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
#         return None


# @register.filter
# def DoctorReviews(arg):
#     try:
#         doctor = Doctor.objects.get(Registration_Number=arg)
#         reviews = DoctorRatingRecord.objects.filter(Doctor_ID=doctor).count()
#         reviews = numerize.numerize(reviews, 1) #it will do 1000 to 1.0K and so on
#         return reviews
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
#         return None

# @register.filter
# def DoctorRating(arg):
#     try:
#         doctor = Doctor.objects.get(Registration_Number=arg)
#         rating = doctor.Rating
#         return rating
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
#         return None

# @register.filter
# def userRated(arg, value):
#     try:
#         doctor = Doctor.objects.get(Registration_Number=value)
#         user = Users.objects.get(username=arg)
#         if DoctorRatingRecord.objects.filter(Doctor_ID=doctor, Person=user).exists():
#             rating = DoctorRatingRecord.objects.get(Doctor_ID=doctor, Person=user)
#             rating = rating.Rate
#         else:
#             rating = 0
#         return rating
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
#         return None


@register.filter
def filename(arg):
    try:
        return os.path.basename(arg.file.name)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
        return None

@register.filter
def LastUpdate(arg): # used
    try:
        user = Users.objects.get(username=arg)
        update1 = user.last_update
        update2 = zonetime.now()
        if('Normal' in user.User_Type):
            person = NormalUser.objects.get(Username=user)
            update2 = person.Last_Update
            if update1 > update2:
                return update1.astimezone(ist)
            else:
                return update2.astimezone(ist)
        elif('Doctor' in user.User_Type):
            person = Doctor.objects.get(Username=user)
            update2 = person.Last_Update
            if update1 > update2:
                return update1.astimezone(ist)
            else:
                return update2.astimezone(ist)
        elif ('Blood Donor' in user.User_Type):
            person = Blood_Donar.objects.get(Username=user)
            update2 = person.Last_Update
            if update1 > update2:
                return update1.astimezone(ist)
            else:
                return update2.astimezone(ist)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
        return None

@register.filter
def getDate(arg): # used
    try:
        Today = date.today()
        if arg == 'Year':
            return Today.year
        elif arg == 'Month':
            return Today.month
        elif arg == 'Day':
            return Today.day
        elif arg == 'Week':
            return Today.weekday()
        elif arg == 'Date':
            return Today
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
        return None

@register.filter
def stringToUrl(value):
    return urllib.parse.quote(value)


# @register.filter
# def convert(arg):
#     try:
#         remaining_time = 0
#         arg = int(arg)
#         if arg > 43200:
#             remaining_time = "Enough"
#         elif arg > 2880:
#             remaining_time = str(arg // 1440)+" Days"
#         elif arg < 2:
#             remaining_time = 'No O2'
#         elif arg < 60:
#             remaining_time = str(arg) + " Min"
#         else:
#             in_hours = str(arg // 60)
#             in_minutes = str(arg % 60)
#             remaining_time = in_hours + " Hrs " + in_minutes + " Min"
#         return remaining_time
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
#         return 0
   
   
# @register.filter
# def totalBloodDonated(value):
#     try:
#         donationCount = BloodDonationCollectionRecord.objects.filter(Email=value, Certificate_issued_for="Blood Donation").count()
#         return donationCount
#     except Exception as e:
#         traceback.print_exc()
#         print("\n\n")
        
        
# @register.filter
# def emergencyDataToJSON(arg):
#     try:
#         dictData = list(Emergency_Number.objects.all().values('Office', 'Subdivision', state=F('State__Name'), district=F('District__Name')))
#         dictData = json.dumps(dictData)
#         return dictData
#     except:
#         traceback.print_exc()
#         print("\n\n")

@register.filter
def getLastNotificationEventId(value): # used
    last_id = get_current_event_id(['notification-{}'.format(value)])
    return last_id


@register.filter
def listConversion(value):
    convertedList = ast.literal_eval(value)  # Convert string like list to pure list
    return convertedList

@register.simple_tag
def isEventEnded(startTime, startDate, EndDate):
    if EndDate is not None:
        endDate = parser.parse(str(EndDate)+" "+str(startTime))
        if(endDate > datetime.now()):
            return False
        else:
            return True
    else:
        startDate = parser.parse(str(startDate)+" "+str(startTime))
        if(startDate > datetime.now()):
            return False
        else:
            return True


@register.simple_tag
def makeList(upto):
    l = []
    for i in range(0, upto):
        l.append(i)
    return l

@register.filter
def isTheSessionActive(value): # if user of this session currently login in any device
    session_query = Session.objects.filter(session_key=value)
    if session_query.exists():
        return True
    else:
        return False


@register.filter
def listLength(value):
    return len(value)