from django import template
from Go_Healthy_App.models import *
from datetime import datetime, timedelta

register = template.Library()

@register.filter
def available(value, arg):
    value = str(value)
    arg = str(arg)
    hospital = Hospital.objects.get(Hospital_Id=value)
    if arg == 'general':
        arg = "General Ward"
    elif arg == "women":
        arg = "Women Ward"
    elif arg == "men":
        arg = "Men Ward"
    elif arg == "child":
        arg = "Child Ward"
    elif arg == "icu":
        arg = "ICU"
    c = BedNo.objects.filter(Hospital=hospital, Availability="Available", Room=arg).count()
    return c

@register.filter
def total(value, arg):
    value = str(value)
    arg = str(arg)
    hospital = Hospital.objects.get(Hospital_Id=value)
    if arg == 'general':
        arg = "General Ward"
    elif arg == "women":
        arg = "Women Ward"
    elif arg == "men":
        arg = "Men Ward"
    elif arg == "child":
        arg = "Child Ward"
    elif arg == "icu":
        arg = "ICU"
    c = BedNo.objects.filter(Hospital=hospital, Room=arg).count()
    return c

@register.filter
def isBed(value):
    value = str(value)
    hospital = Hospital.objects.get(Hospital_Id=value)
    ret = False
    if (BedNo.objects.filter(Hospital=hospital, Availability="Available", Room="General Ward").count() > 0) or (BedNo.objects.filter(Hospital=hospital, Availability="Available", Room="Women Ward").count() > 0) or (BedNo.objects.filter(Hospital=hospital, Availability="Available", Room="Men Ward").count() > 0) or (BedNo.objects.filter(Hospital=hospital, Availability="Available", Room="Child Ward").count() > 0):
        ret = True

    return ret

@register.filter
def Book(value, arg):
    if Bed_Book.objects.filter(Booking_ID=value).exists() == False:
        return None
    else:
        book = Bed_Book.objects.get(Booking_ID=value)
        if arg == "Name":
            return book.Patient_Name
        elif arg == "Contact":
            return book.Mobile
        elif arg == "Booked":
            t =  book.Booking_Time
            return t + timedelta(hours=5.5)
        elif arg == "Expired":
            t = book.Expire_Time
            return t + timedelta(hours=5.5)

@register.filter
def pendingBed(value, arg):
    if BedNo.objects.filter(Booking_Id=value).exists() == False:
        return None
    else:
        if arg == "ward":
            bed = BedNo.objects.get(Booking_Id=value)
            return bed.Room
        elif arg == "bed":
            bed = BedNo.objects.get(Booking_Id=value)
            return bed.Bed_No
        elif arg == "building":
            bed = BedNo.objects.get(Booking_Id=value)
            return bed.Building
        elif arg == "floor":
            bed = BedNo.objects.get(Booking_Id=value)
            return bed.Flor
        elif arg == "id":
            bed = BedNo.objects.get(Booking_Id=value)
            return  bed.id

@register.filter
def HaveIt(value, arg):
    if arg == "hospital":
        ret = Hospital.objects.filter(State = value).exists()
        return ret
    elif arg == "doctor":
        ret1 = Doctor.objects.filter(State = value).exists()
        return ret1


@register.filter
def UserData(value, arg):
    user = Users.objects.get(username=value)
    if user.User_Type == "Normal":
        user = NormalUser.objects.get(Username=user)
        if arg == 'Image':
            ret = user.Image
        elif arg == 'Name':
            ret = user.Name
    elif user.User_Type == "Hospital":
        user = Hospital.objects.get(Username=user)
        if arg == 'Image':
            ret = user.Image
        elif arg == 'Name':
            ret = user.Name
    elif user.User_Type == "Blood Donor":
        user = Blood_Donar.objects.get(Username=user)
        if arg == 'Image':
            ret = user.Image
        elif arg == 'Name':
            ret = user.Name
    elif user.User_Type == "Doctor" or user.User_Type == "Blood Donor & Doctor":
        user = Doctor.objects.get(Username=user)
        if arg == 'Image':
            ret = user.Image
        elif arg == 'Name':
            ret = user.Name
    else:
        user = None
        ret = None
    return ret

@register.filter
def IST(value):
    if type(value) != str:
        return value + timedelta(hours=5.5)
    else:
        return None

@register.filter
def newChat(value, arg):
    sender = Users.objects.get(username=value)
    receiver = Users.objects.get(username=arg)
    num = Chat.objects.filter(From=sender, To=receiver, Delivered=False).count()
    return num


@register.filter
def totalNewChat(arg):
    user = Users.objects.get(username=arg)
    num = Chat.objects.filter(To=user, Delivered=False).count()
    return num


@register.filter
def string(arg):
    try:
        s = str(arg)
        return s
    except:
        return 'none'
