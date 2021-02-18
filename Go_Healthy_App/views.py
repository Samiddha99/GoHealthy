from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseNotFound
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.http import HttpResponseRedirect, response, JsonResponse
from django.core import serializers
from django.urls import reverse
from django.contrib.sessions.models import Session
import django
import requests
from dateutil import tz
from django.core import exceptions
from django.contrib.auth.hashers import check_password
from django.utils import timezone as zonetime
from itertools import chain
from operator import attrgetter
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from functools import reduce
import operator
import json, urllib, urllib3
from django.core.files.uploadedfile import SimpleUploadedFile, InMemoryUploadedFile

from django.db.models.query import QuerySet
from django.contrib.auth import update_session_auth_hash
import django.contrib.auth.password_validation
from django.contrib import messages
from django.views.generic.edit import CreateView
from django.contrib.auth.models import User
from django.contrib.auth import *
from django.contrib.auth.password_validation import *
import django.contrib.auth.password_validation as validators
from django.contrib.auth.decorators import login_required
from django.core.mail import EmailMessage
from django.core.mail import send_mail
from django.core.paginator import Paginator
from django.conf import settings
#from twilio.rest import Client
from django import forms
from datetime import *
import googlemaps
from django.db.models import Q
import django_filters
import secrets
import string
import random
from .forms import *
from .models import *
from .choice import *



# Create your views here.

# HOSPITAL
def Hospitals(request):
    user = Users.objects.filter(is_verified=True)
    allobj = Hospital.objects.all()
    obj = allobj

    action = request.GET.get('action')

    type = request.GET.get('Type', '')
    search = request.GET.get('Name', '')
    state_search = request.GET.get('State', '')
    district_search = request.GET.get('District', '')
    sub_search = request.GET.get('Subdivision', '')
    Pin = request.GET.get('Pin', '')
    City = request.GET.get('City', '')
    antivenom = request.GET.get('Antivenom_Availability', '')
    bed = request.GET.get('Bed_Availability', '')

    total = 0
    only_bed = False
    if action == 'filter':

        filter_value = {}

        if (state_search == 'All States'):
            district_search = ''
            sub_search = ''
            Pin = ''
            City = ''
            filter_value['Name'] = search
            filter_value['Type'] = type
            filter_value['Has_Antivenom'] = antivenom
            kwargs = {}
            for k, v in filter_value.items():
                if v != '':
                    kwargs[k] = v
            obj = Hospital.objects.filter(**kwargs)
        else:
            filter_value['Name__icontains'] = search
            filter_value['Type'] = type
            filter_value['State'] = state_search
            filter_value['Subdivision'] = sub_search
            filter_value['District'] = district_search
            filter_value['Pin'] = Pin
            filter_value['City'] = City
            filter_value['Has_Antivenom'] = antivenom
            kwargs = {}
            for k, v in filter_value.items():
                if v != '':
                    kwargs[k] = v
            obj = Hospital.objects.filter(**kwargs)

    if bed == 'Yes':
        only_bed = True
        for i in obj:
            gen = BedNo.objects.filter(Hospital=i, Availability='Available', Room='General Ward').count()
            women = BedNo.objects.filter(Hospital=i, Availability='Available', Room='Women Ward').count()
            men = BedNo.objects.filter(Hospital=i, Availability='Available', Room='Men Ward').count()
            child = BedNo.objects.filter(Hospital=i, Availability='Available', Room='Child Ward').count()
            icu = BedNo.objects.filter(Hospital=i, Availability='Available', Room='ICU').count()
            if i.Username.is_verified and (gen > 0 and women > 0 and men > 0 and child > 0 and icu > 0):
                total += 1
    else:
        for i in obj:
            if i.Username.is_verified:
                total += 1
    context = {
        'Hos': obj,
        'HosAll': allobj,
        'total': total,
        'types': type_ch,
        'states': state_ch,
        'state': state_search,
        'district': district_search,
        'name': search,
        'type': type,
        'city': City,
        'pin': Pin,
        'subdivision': sub_search,
        'Has_antivenom':antivenom,
        'Bed':bed,
        'only_bed':only_bed,
        'date':"December 05, 2021 15:37:25",
    }
    return render(request, 'hospital.html', context)



#Doctor
def Doctors(request):
    user = Users.objects.filter(is_verified=True)
    allobj = Doctor.objects.all()
    obj = allobj
    action = request.GET.get('action')

    search = request.GET.get('Name', '')
    state_search = request.GET.get('State', '')
    district_search = request.GET.get('District', '')
    sub_search = request.GET.get('Subdivision', '')
    Pin = request.GET.get('Pin', '')
    City = request.GET.get('City', '')
    Speciality = request.GET.get('Speciality', '')

    if action == 'filter':

        filter_value = {}

        if (state_search == 'All States'):
            district_search = ''
            sub_search = ''
            Pin = ''
            City = ''
            filter_value['Name'] = search
            filter_value['Special'] = Speciality
            kwargs = {}
            for k, v in filter_value.items():
                if v != '':
                    kwargs[k] = v
            obj = Doctor.objects.filter(**kwargs)
        else:
            filter_value['Name__icontains'] = search
            filter_value['Special'] = Speciality
            filter_value['State'] = state_search
            filter_value['Subdivision'] = sub_search
            filter_value['District'] = district_search
            filter_value['Pin'] = Pin
            filter_value['City'] = City
            kwargs = {}
            for k, v in filter_value.items():
                if v != '':
                    kwargs[k] = v
            obj = Doctor.objects.filter(**kwargs)


    total = 0
    for i in obj:
        if i.Username.is_verified:
            total += 1

    set_MD = set(MD)
    set_MS = set(MS)
    set_DNB = set(DNB)
    set_DM = set(DM)
    set_Mch = set(Mch)


    list1 = list(set_MS - set_MD)
    list2 = list(set_DM - set_DNB)
    list1 = set(list1)
    list2 = set(list2)
    list3 = list(list2 - list1)
    list3 = set(list3)
    list4 = set(set_Mch - list3)
    list1 = list(list1)
    list2 = list(list2)
    list3 = list(list3)
    list4 = list(list4)

    combined_list = list1 + list2 + list3 + list4

    context = {
        'Doc': obj,
        'DocAll': allobj,
        'total':total,
        'special_list':combined_list,
        'states': state_ch,
        'state': state_search,
        'district':district_search,
        'name':search,
        'speciality':Speciality,
        'city':City,
        'pin':Pin,
        'subdivision':sub_search,
    }
    return render(request, 'doctor.html', context)



#Blood Donor

def Blood(request):
    user = Users.objects.filter(is_verified=True)
    allobj = Blood_Donar.objects.all()
    obj = allobj
    action = request.GET.get('action')

    group = request.GET.get('Blood_Group', '')
    search = request.GET.get('Name', '')
    state_search = request.GET.get('State', '')
    district_search = request.GET.get('District', '')
    sub_search = request.GET.get('Subdivision', '')
    Pin = request.GET.get('Pin', '')
    City = request.GET.get('City', '')
    if action == 'filter':

        filter_value = {}

        if (state_search == 'All States'):
            district_search = ''
            sub_search = ''
            Pin = ''
            City = ''
            filter_value['Name'] = search
            filter_value['Blood_Group'] = group
            kwargs = {}
            for k, v in filter_value.items():
                if v != '':
                    kwargs[k] = v
            obj = Blood_Donar.objects.filter(**kwargs)
        else:
            filter_value['Name__icontains'] = search
            filter_value['Blood_Group'] = group
            filter_value['State'] = state_search
            filter_value['Subdivision'] = sub_search
            filter_value['District'] = district_search
            filter_value['Pin'] = Pin
            filter_value['City'] = City
            kwargs = {}
            for k, v in filter_value.items():
                if v != '':
                    kwargs[k] = v
            obj = Blood_Donar.objects.filter(**kwargs)

    total = 0
    for i in obj:
        if i.Username.is_verified:
            total += 1
    context = {
        'Blo': obj,
        'BloAll': allobj,
        'total':total,
        'group': group_ch,
        'states': state_ch,
        'city':City,
        'sub':sub_search,
        'district':district_search,
        'name':search,
        'pin':Pin,
        'blogroup':group,
        'state': state_search,
    }
    return render(request, 'blood_donor.html', context)





def BMIAnswer(request):
    if request.method == 'POST':
        # If during BMI Calculation No error is found then try return the result and return error as False
        try:
            Weight = float(request.POST.get('weight'))
            Height = float(request.POST.get('height'))
            result = (Weight / (Height ** 2))  # Formula to calculate BMI
            result = round(result, 2)  # to round of the result with 2 digits after decimal point
            # Check the BMI Status by comparing the result
            if (result < 18.5):
                status = "You are Under Weight!"
            elif (result >= 18.5 and result <= 24.9):
                status = "You are Normal"
            elif (result >= 25 and result <= 29.9):
                status = "You are Over Weight!!"
            elif (result >= 30 and result <= 34.9):
                status = "You are Obese!!!"
            else:
                status = "You are Extremely Obese!!!!"

            data = {'result': result,
                       "error": '0',
                       "status": status
                       }
            return JsonResponse(data)
        # If during BMI Calculation error is found then expect return error as True
        except:
            data = {'error': '1',
                       'result': 'Error'}
            return JsonResponse(data)
    else:
        return render(request, 'bmi_res.html')

def Notifations(request):
    notice = Notification_Notice_and_Event.objects.all()
    context = {
        "notice":notice
    }
    return render(request, 'notice.html', context)


def About(request):
    return render(request, 'about.html')

def EmergencyNumber(request):
    emergency = Emargency_Number.objects.all()
    context = {
        'emergency':emergency,
    }
    return render(request, 'emergency.html',context)

def firstaid(requset):
    return render(requset, 'firstaid.html')


def firstaid_photo(request):
    obj = FirstaidPhoto.objects.all()
    action = request.GET.get("action")
    filter_value = {}
    if action == "filter":
        language = request.GET.get('language', '')
        if language == "All Languages":
            obj = FirstaidPhoto.objects.all()
        else:
            filter_value['Language'] = language
            kwargs = {}
            for k, v in filter_value.items():
                if v != '':
                    kwargs[k] = v
            obj = FirstaidPhoto.objects.filter(**kwargs)
    context = {
        'Ph':obj,
        'languages':language_list,
        }
    return render(request, 'firstaid_photo.html', context)


def firstaid_video(request):
    obj = FirstaidVideo.objects.all()
    action = request.GET.get("action")
    filter_value = {}
    if action == "filter":
        language = request.GET.get('language', '')
        if language == "All Languages":
            obj = FirstaidVideo.objects.all()
        else:
            filter_value['Language'] = language
            kwargs = {}
            for k, v in filter_value.items():
                if v != '':
                    kwargs[k] = v
            obj = FirstaidVideo.objects.filter(**kwargs)
    context = {
        'vid':obj,
        'languages':language_list,
        }
    return render(request, 'firstaid_video.html', context)

def Home(request):
    Notice = Notification_Notice_and_Event.objects.all()

    context = {
        "notice":Notice
    }
    return render(request, 'home.html', context)


@login_required(login_url="/login/")
def ChatSearch(request):
    chat = request.POST.get('chat')
    receiver = request.POST.get('receiver')
    receiver = Users.objects.get(username=receiver)
    sender = request.POST.get('sender')
    sender = Users.objects.get(username=sender)
    chats = Chat.objects.filter(Q(From=sender) & Q(To=receiver) | Q(From=receiver) & Q(To=sender)).filter(Message__icontains=chat)
    id = []
    for i in chats:
        id.append(i.id)

    data = {
        'chat_id':id,
        'num':chats.count(),
    }
    return JsonResponse(data)


@login_required(login_url="/login/")
def TotalChat(request):
    user = request.POST.get('user')
    user = Users.objects.get(username=user)
    who = request.POST.get('with')
    who = Users.objects.get(username=who)
    forDelete = request.POST.get('forDelete')
    last = None
    if who.is_online == True:
        is_online = 'True'
    else:
        is_online = 'False'
        last = who.last_seen + timedelta(hours=5.50)
        last = last.strftime("%b %d %y, %I:%M %p")

    if forDelete == 'Deleted':
        chat = Chat.objects.filter(Q(From=user) & Q(To=who) | Q(From=who) & Q(To=user)).filter(Deleted=True)
    else:
        chat = Chat.objects.filter(Q(From=user) & Q(To=who) | Q(From=who) & Q(To=user)).filter(Deleted=False)
    lis = []
    for i in chat:
        lis.append(i.id)
    data = {
        'ids':lis,
        'is_online':is_online,
        'last':last,
    }
    return JsonResponse(data)

@login_required(login_url="/login/")
def DeleteChat(request):
    id = request.POST.get('id')
    print(id)
    error = None
    try:
        Chat.objects.filter(id=id).update(Message='', Deleted=True)
        error = "0"
    except:
        error = "1"
    finally:
        data = {
            "error":error,
        }
        return JsonResponse(data)

@login_required(login_url="/login/")
def ChatView(request):
    who = request.POST.get('chatwith', 'N/A')
    person = request.POST.get('chatwith', 'N/A')
    me = Users.objects.get(username=request.user.username)
    mychats = Chat.objects.filter(Q(From=me) | Q(To=me)).filter(Deleted=False).order_by('-Time')
    action = request.POST.get('action')
    chatwith = []
    user = None
    profile = None
    c = 0
    checked_user = []
    mychatsearch = request.POST.get('mychatsearch')
    if action == 'SearchMyChat':
        searchPerson = []
        searchUser = []
        searchAdmin = Admin.objects.filter(Name__icontains=mychatsearch)
        for i in searchAdmin:
            searchPerson.append(i.Username)
        searchNormal = NormalUser.objects.filter(Name__icontains=mychatsearch)
        for i in searchNormal:
            searchPerson.append(i.Username)
        searchHospital = Hospital.objects.filter(Name__icontains=mychatsearch)
        for i in searchHospital:
            searchPerson.append(i.Username)
        searchDonor = Blood_Donar.objects.filter(Name__icontains=mychatsearch)
        for i in searchDonor:
            searchPerson.append(i.Username)
        searchDoctor = Doctor.objects.filter(Name__icontains=mychatsearch)
        for i in searchDoctor:
            searchPerson.append(i.Username)
        if len(searchPerson) > 0:
            for i in searchPerson:
                searchUser.append(Users.objects.get(username=i))
        mychats = Chat.objects.filter(Q(From=me) | Q(To=me)).filter(
            Q(Message__icontains=mychatsearch) | Q(From__in=searchUser) | Q(To__in=searchUser)).filter(Deleted=False).order_by('-Time')
    for i in mychats:
        if i.From != request.user:
            user = i.From
        elif i.To != request.user:
            user = i.To
        if user is not None:
            if user.User_Type == "Blood Donor":
                profile = Blood_Donar.objects.get(Username=user)
            elif user.User_Type == "Doctor" or user.User_Type == "Blood Donor & Doctor":
                profile = Doctor.objects.get(Username=user)
            elif user.User_Type == "Normal":
                profile = NormalUser.objects.get(Username=user)
            elif user.User_Type == "Hospital":
                profile = Hospital.objects.get(Username=user)
            elif user.User_Type == "Admin":
                profile = Admin.objects.get(Username=user)
            new = Chat.objects.filter(From=user, To=me, Delivered=False).count()

            if checked_user.count(user) == 0:
                data = [user.username, profile.Name, profile.Image, i.Time, new, i.Message]
                chatwith.append([])
                for j in data:
                    chatwith[c].append(j)
                checked_user.append(user)
                if action == 'SearchMyChat':
                    if mychatsearch in i.Message:
                        chatwith[c][5] = i.Message
                c += 1

    myself = None
    if request.user.User_Type == "Blood Donor":
        myself = Blood_Donar.objects.get(Username=me)
    elif request.user.User_Type == "Blood Donor & Doctor" or request.user.User_Type == "Doctor":
        myself = Doctor.objects.get(Username=me)
    elif request.user.User_Type == "Hospital":
        myself = Hospital.objects.get(Username=me)
    elif request.user.User_Type == "Normal":
        myself = NormalUser.objects.get(Username=me)
    elif request.user.User_Type == "Admin":
        myself = Admin.objects.get(Username=me)

    if request.method == "POST":
        if Users.objects.filter(username=person).exists():
            person = Users.objects.get(username=person)
            personType = person.User_Type
            data = None
            if personType == "Blood Donor":
                data = Blood_Donar.objects.get(Username=person)
            elif personType == "Doctor" or personType == "Blood Donor & Doctor":
                data = Doctor.objects.get(Username=person)
            elif personType == "Normal":
                data = NormalUser.objects.get(Username=person)
            elif personType == "Hospital":
                data = Hospital.objects.get(Username=person)
            elif personType == "Admin":
                myself = Admin.objects.get(Username=me)
            Chat.objects.filter(Q(From=person) & Q(To=me)).update(Delivered=True)
            chats = Chat.objects.filter(Q(From=person) & Q(To=me) | Q(From=me) & Q(To=person))

            if action == 'SearchMyChat':
                context = {
                    "chats": chats,
                    "person": person,
                    "chatwith": chatwith,
                    "me": me,
                    "has_chat": mychats.count(),
                    "myself": myself,
                    "data":data,
                    "with":who,
                    'searchMychat': True,
                }
                return render(request, 'chat.html', context)
            elif action == 'doChat':
                context = {
                    "chats": chats,
                    "person": person,
                    "chatwith": chatwith,
                    "me": me,
                    "has_chat": mychats.count(),
                    "data": data,
                    "with": who,
                    "myself": myself,
                }
                return render(request, 'chat.html', context)
        else:
            context = {
                "person": 'N/A',
                "chatwith": chatwith,
                "me": me,
                "has_chat": mychats.count(),
                "myself": myself,
                "with": who,
                'searchMychat': True,
            }
            return render(request, 'chat.html', context)
    else:
        context = {
            "person": 'N/A',
            "chatwith": chatwith,
            "me":me,
            "has_chat": mychats.count(),
            "myself":myself,
        }
        return render(request, 'chat.html', context)



@login_required(login_url="/login/")
def SendChat(request):
    me = Users.objects.get(username=request.user.username)
    chat = request.POST.get('chat')
    receiver = request.POST.get('receiver')
    receiver = Users.objects.get(username=receiver)
    now = zonetime.now() + timedelta(hours=5.50)
    now = now.strftime("%b, %d, %Y, %I:%M %p")
    c = Chat.objects.create(From=me, To=receiver, Message=chat, Time=now, Delivered=False)
    c.save()
    c = c.id
    data = {
        "chat": chat,
        "id":c,
        "time":now,
        "Del":'False',
    }
    return JsonResponse(data)

def FetchChat(request):
    sender = request.POST.get('sender')
    try:
        sender = Users.objects.get(username=sender)
        chats = Chat.objects.filter(Q(From=sender) & Q(To=request.user) & ~Q(Delivered=True)).order_by('Time')
        count = chats.count()
        chat = []
        now = []
        id = []
        for i in chats:
            chat.append(i.Message)
            id.append(i.id)
            now.append((i.Time + timedelta(hours=5.50)).strftime("%b, %d, %Y, %I:%M %p"))
        checks = Chat.objects.filter(Q(From=request.user) & Q(To=sender) & Q(Delivered=True)).order_by('Time')
        check_count = checks.count()
        check = []
        for i in checks:
            check.append(i.id)
        data = {
            'error':'0',
            'check':check,
            'check_count':check_count,
            'chat':chat,
            'id':id,
            'time':now,
            'count':count,
        }
        chats.update(Delivered=True)
        Users.objects.filter(username=request.user.username).update(is_online=True, last_seen=zonetime.now())
        return JsonResponse(data, safe=False)
    except:
        data = {
            'error':"1",
        }
        return JsonResponse(data, safe=False)


def AjaxContact(request):
    if request.method == 'POST':  # ContactUs Form
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        message = request.POST.get('message')
        ContactUs(Name=name, Phone=phone, Email=email, Message=message).save()
        data = {
                   "success": "1",
                   "mes":message,
                   }
        return JsonResponse(data)

def ContactUsView(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        phone = request.POST.get('phone')
        email = request.POST.get('email')
        message = request.POST.get('message')
        data = {
            "Name":name,
            "Phone":phone,
            "Email":email,
            "Message":message,
        }
        form = ContactUsForm(data)
        if form.is_valid():
            form.save()

            message1 = "We Successfully Submit Your Query! We will contact you if needed."
            context = {"message":message1,
                       "success":1,
                       }
            return render(request, 'contact.html', context)
        else:
            context = {"message": form.errors,
                       "success":0,
                       "Name": name,
                       "Phone": phone,
                       "Email": email,
                       "Message": message,
                       }
            return render(request, 'contact.html', context)
    else:
        return render(request, 'contact.html')



def ComplaintView(request):
    if request.method == 'POST':  #Complaint Form
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        district = request.POST.get('district')
        city = request.POST.get('city')
        pin = request.POST.get('pin')
        attachment = request.FILES.get('attachment')
        complain = request.POST.get('complaint')
        state = request.POST.get('state')
        subdivision = request.POST.get('subdivision')
        subject = request.POST.get('subject')
        otherSubject = request.POST.get('otherSubject')

        if subject == 'Other':
            subject = otherSubject

        data = {
            "Name":name,
            "Email":email,
            "Phone":phone,
            "Address":address,
            "City":city,
            "Subdivision":subdivision,
            "State":state,
            "District":district,
            "Pin":pin,
            "Subject":subject,
            "Complain":complain,
        }
        form = ComplaintForm(data)
        while (1):
            comId = str(secrets.randbits(20))
            comId = ''.join([secrets.choice(comId) for i in range(5)])
            if complaint.objects.filter(Complain_Id=comId).exists():
                continue
            else:
                break
        if form.is_valid():
            newcom = form.save(commit=False)
            newcom.Complain_Id = comId
            newcom.Status = 'Pending'
            newcom.save()
            if attachment is not None:
                comp = complaint.objects.get(Complain_Id=comId)
                comp.Attachment = attachment
                comp.save()

            subject = 'Your Complaint Submitted'
            body = ''
            htmlMessage = "<html><body><h1 style='color:yellow'>Go Healthy</h1><h4 style='color:blue'>Your complaint has been submitted with ID " + comId + "</h4><h6>We will try to help you.<br>If needed we can contact you.</h6></body></html>"
            sender = settings.EMAIL_HOST_USER
            receiver = [email, ]

            send_mail(subject=subject, message=body, from_email=sender, recipient_list=receiver, fail_silently=False,
                      html_message=htmlMessage)

            message = "We Successfully Submit Your Complaint! We will contact you if needed.<br>Your Complaint ID: <b>"+comId+"</b>"
            context = {"message": message,
                       "complaintId":comId,
                       "success": 1,
                       "states": state_list,
                       }
            return render(request, 'complaint.html', context)
        else:
            message = "Failed to Submit Complaint! Please try again!."
            context = {"message": form.errors,
                       "success": 0,
                       "states": state_list,
                       }
            return render(request, 'complaint.html', context)
    else:
        context = {
            "states":state_list,
        }
        return render(request, 'complaint.html', context)


def StatusChecK(request):
    if request.method == 'POST':
        type = request.POST.get('type')
        id = request.POST.get('id')
        if type == 'Bed_Book':
            if Bed_Book.objects.filter(Booking_ID=id).exists() == False:
                context = {
                    "book": 'no',
                }
                return render(request, 'statuscheck.html', context)
            else:
                return HttpResponseRedirect(reverse(BedBookView, args=(id,)))
        elif type == 'Complaint':
            if complaint.objects.filter(Complain_Id=id).exists() == False:
                context = {
                    "type": type,
                    "comp": 'no',
                }
                return render(request, 'statuscheck.html', context)
            else:
                comp = complaint.objects.get(Complain_Id=id)
                context = {
                    "type":type,
                    "comp":'yes',
                    'complaint':comp,
                }
                return render(request, 'statuscheck.html', context)
    else:
        return render(request, 'statuscheck.html')

@login_required(login_url="/login/")
def UserProfile(request):
    cur_user = request.user
    if request.user.User_Type == 'Hospital':
        return redirect(HospitalAdmin)
    if request.user.User_Type == 'Normal':
        return NormalProfile(request)
    elif request.user.User_Type == 'Blood Donor':
        return DonorProfile(request)
    elif request.user.User_Type == 'Blood Donor & Doctor' or request.user.User_Type == 'Doctor':
        return DoctorProfile(request)


@login_required(login_url="/login/")
def DonorProfile(request):
    if request.user.User_Type != 'Blood Donor':
        return redirect(UserProfile)
    person = Blood_Donar.objects.get(Username=request.user)
    if request.method == 'POST':
        name = request.POST.get('name')
        gender = request.POST.get('gender')
        pic = request.FILES.get('picture')
        action = str(request.POST.get('action'))
        if action == 'image':
            cont_type = str(pic.content_type)
            cont_type = cont_type.split('/')
            if cont_type[0] != 'image':
                error = True,
                message = 'Not a vaild Image File!'
                context = {
                    'person': person,
                    "error":error,
                    "message":message,
                    'districts': getDistrict(person.State),
                    'degree':doctor_degree,
                }
                return render(request, 'donorprofile.html', context)
            else:
                person.Image = pic
                person.save()
                context = {
                    'person': person,
                    'districts': getDistrict(person.State),
                    'degree': doctor_degree,
                }
                return HttpResponseRedirect(reverse(DonorProfile,))
        elif action == 'GeneralUpdate':
            person.Name = name
            person.Gender = gender
            person.save()
            context = {
                'person': person,
                'districts': getDistrict(person.State),
                'degree': doctor_degree,
            }
            return HttpResponseRedirect(reverse(DonorProfile,))
        elif action == "AddressUpdate":
            address = request.POST.get('address')
            pin = request.POST.get('pin')
            state = request.POST.get('state')
            district = request.POST.get('district')
            city = request.POST.get('city')
            subdivision = request.POST.get('subdivision')
            person.Address = address
            person.State = state
            person.Pin = pin
            person.District = district
            person.City = city
            person.Subdivision = subdivision
            person.save()
            context = {
                'person': person,
                'districts': getDistrict(person.State),
                'degree': doctor_degree,
            }
            return HttpResponseRedirect(reverse(DonorProfile,))
        else:
            context = {
                'person': person,
                'districts': getDistrict(person.State),
                'degree': doctor_degree,
            }
            return HttpResponseRedirect(reverse(DonorProfile,))
    else:
        context = {
            'person':person,
            'districts':getDistrict(person.State),
            'degree': doctor_degree,
        }
        return render(request, 'donorprofile.html', context)

@login_required(login_url="/login/")
def ProfileUpgrade(request):
    data = {}
    if request.method == "POST":
        upgradeto = request.POST.get('upgradeto')
        user = Users.objects.get(username=request.user.username)

        if upgradeto == "Doctor":
            registrationNo = request.POST.get('registrationNo')
            speciality = request.POST.get('speciality')
            degree = request.POST.get('degree')
            blood = request.POST.get('blood')
            person = NormalUser.objects.get(Username=request.user)
            user = Users.objects.get(username=request.user.username)
            #user.User_Type = "Doctor"
            #user.save()
            Doctor.objects.filter(Username=request.user).delete()
            Doctor(Username=user, Name=person.Name, Registration_Number=registrationNo, Degree=degree,
                   Special=speciality, Gender=person.Gender, Blood_Group=blood, Contact=person.Contact,
                   Address=person.Address, State=person.State, City=person.City, Subdivision=person.Subdivision,
                   District=person.District, Pin=person.Pin, Image=person.Image).save()
            doctor = Doctor.objects.get(Username=request.user.username)
            DoctorUpgrade(Request=doctor, From='Normal User', To='Doctor').save()
            data["error"] = "0"
            #NormalUser.objects.filter(Username=request.user).delete()
            return HttpResponseRedirect(reverse(UserProfile,))
        elif upgradeto == "Blood Donor":
            blood = request.POST.get('blood')
            dob = request.POST.get('dob')
            user.User_Type = "Blood Donor"
            user.save()
            person = NormalUser.objects.get(Username=request.user)
            Blood_Donar.objects.filter(Username=request.user).delete()
            Blood_Donar(Username=user, Name=person.Name, Date_of_Birth=dob, Gender=person.Gender, Blood_Group=blood,
                        Contact=person.Contact, ID_Type=person.ID_Type, ID_Number=person.ID_Number,
                        Address=person.Address, State=person.State, City=person.City, Subdivision=person.Subdivision,
                        District=person.District, Pin=person.Pin, Image=person.Image).save()
            data["error"] = "0"
            NormalUser.objects.filter(Username=request.user).delete()
            return HttpResponseRedirect(reverse(UserProfile,))
        elif upgradeto == "Blood Donor & Doctor":
            registrationNo = request.POST.get('registrationNo')
            speciality = request.POST.get('speciality')
            degree = request.POST.get('degree')
            blood = request.POST.get('blood')
            dob = request.POST.get('dob')
            user.User_Type = "Blood Donor"
            user.save()
            person = NormalUser.objects.get(Username=request.user)
            Blood_Donar.objects.filter(Username=request.user).delete()
            Blood_Donar(Username=user, Name=person.Name, Date_of_Birth=dob, Gender=person.Gender, Blood_Group=blood,
                        Contact=person.Contact, ID_Type=person.ID_Type, ID_Number=person.ID_Number,
                        Address=person.Address, State=person.State, City=person.City, Subdivision=person.Subdivision,
                        District=person.District, Pin=person.Pin, Image=person.Image).save()
            Doctor.objects.filter(Username=request.user).delete()
            Doctor(Username=user, Name=person.Name, Registration_Number=registrationNo, Degree=degree,
                   Special=speciality, Gender=person.Gender, Blood_Group=blood, Contact=person.Contact,
                   Address=person.Address, State=person.State, City=person.City, Subdivision=person.Subdivision,
                   District=person.District, Pin=person.Pin, Image=person.Image).save()
            doctor = Doctor.objects.get(Username=user)
            DoctorUpgrade(Request=doctor, From='Normal User', To='Blood Donor & Doctor').save()
            data["error"] = "0"
            NormalUser.objects.filter(Username=request.user).delete()
            return HttpResponseRedirect(reverse(UserProfile,))
        elif request.user.User_Type == "Blood Donor":
            registrationNo = request.POST.get('registrationNo')
            speciality = request.POST.get('speciality')
            degree = request.POST.get('degree')
            person = Blood_Donar.objects.get(Username=request.user)
            #user.User_Type = "Blood Donor & Doctor"
            #user.save()
            Doctor.objects.filter(Username=request.user).delete()
            Doctor(Username=user, Name=person.Name, Registration_Number=registrationNo, Degree=degree, Special=speciality, Gender=person.Gender, Blood_Group=person.Blood_Group, Contact=person.Contact, Address=person.Address, State=person.State, City=person.City, Subdivision=person.Subdivision, District=person.District, Pin=person.Pin, Image=person.Image).save()
            doctor = Doctor.objects.get(Username=user)
            DoctorUpgrade(Request=doctor, Form='Blood Donor', To='Doctor').save()
            data["error"] = "0"
        elif request.user.User_Type == "Doctor":
            user.User_Type = "Blood Donor & Doctor"
            user.save()
            person = Doctor.objects.get(Username=request.user)
            Blood_Donar.objects.filter(Username=request.user).delete()
            Blood_Donar(Username=user, Name=person.Name, Gender=person.Gender, Blood_Group=person.Blood_Group, Contact=person.Contact, ID_Type="Doctor's Registration", ID_Number=person.Registration_Number, Address=person.Address, State=person.State, City=person.City, Subdivision=person.Subdivision, District=person.District, Pin=person.Pin, Image=person.Image).save()
            data["error"] = "0"
            return HttpResponseRedirect(reverse(UserProfile,))
    return JsonResponse(data)

@login_required(login_url="/login/")
def OTPSendEdit(request):
    email = request.POST.get('email')
    contact = request.POST.get('contact')
    response_data = {}
    type = request.user.User_Type
    person = None
    if type == 'Normal':
        person = NormalUser.objects.get(Username=request.user)
    elif type == 'Hospital':
        person = Hospital.objects.get(Username=request.user)
    elif type == 'Doctor':
        person = Doctor.objects.get(Username=request.user)
    elif type == 'Blood Donor':
        person = Blood_Donar.objects.get(Username=request.user)
    elif type == 'Blood Donor & Doctor':
        person = Doctor.objects.get(Username=request.user)
    emailChange = "no"
    mobileChange = "no"
    if request.method == 'POST':
        emailOTP = None
        mobileOTP = None
        if (email is None or contact is None) or (email == '' or contact == ''):
            response_data['error'] = "1"
        else:
            cur_time = zonetime.now()
            expire = cur_time + timedelta(minutes=10.0)
            OTP.objects.filter(Email=email).delete()
            OTP.objects.filter(Mobile=contact).delete()
            if email != request.user.email:
                e = str(secrets.randbits(20))
                emailOTP = ''.join([secrets.choice(e) for i in range(6)])
                OTP(Email=email, EmailOTP=emailOTP, Expire_Time=expire,
                    Is_Verified=False).save()
                file = open('Email_Update_otp.html')
                mes = file.read()
                file.close()
                mes = mes.replace("myotp", emailOTP)
                subject = 'OTP For Email Update'
                body = ''
                htmlMessage = mes
                sender = settings.EMAIL_HOST_USER
                receiver = [email, ]

                send_mail(subject=subject, message=None, from_email=sender, recipient_list=receiver,
                          fail_silently=False,
                          html_message=htmlMessage)
                response_data['error'] = "0"
                emailChange = "yes"

            if contact != person.Contact:
                m = str(secrets.randbits(20))
                mobileOTP = ''.join([secrets.choice(m) for i in range(6)])
                OTP(Mobile=contact, MobileOTP=mobileOTP, Expire_Time=expire,
                    Is_Verified=False).save()

                url = "https://www.fast2sms.com/dev/bulk"
                payload = {
                    'sender_id': 'FSTSMS',
                    'message': "42505",
                    'language': 'english',
                    'route': 'qt',
                    'numbers': contact,
                    'variables': '{#BB#}',
                    'variables_values': mobileOTP,
                }
                headers = {
                    'authorization': settings.FAST2SMAS_API_KEY,
                    'Content-Type': "application/x-www-form-urlencoded",
                    'Cache-Control': "no-cache",
                }
                requests.request("POST", url, data=payload, headers=headers)
                response_data['error'] = "0"
                mobileChange = "yes"

    response_data['emailChange'] = emailChange
    response_data['mobileChange'] = mobileChange
    response_data['email'] = email
    response_data['contact'] = contact
    return JsonResponse(response_data)

@login_required(login_url="/login/")
def DetectChange(request):
    contact = request.POST.get('contact')
    email = request.POST.get('email')
    type = request.user.User_Type
    data = {}
    data['change'] = "no"
    person = None
    if type == 'Normal':
        person = NormalUser.objects.get(Username=request.user)
    elif type == 'Doctor':
        person = Doctor.objects.get(Username=request.user)
    elif type == 'Blood Donor':
        person = Blood_Donar.objects.get(Username=request.user)
    elif type == 'Blood Donor & Doctor':
        person = Doctor.objects.get(Username=request.user)
    if email != person.Username.email or contact != person.Contact:
        data['change'] = "yes"
    return  JsonResponse(data)

@login_required(login_url="/login/")
def ContactUpdate(request):
    data = {}
    if request.method == "POST":
        contact = request.POST.get('contact')
        email = request.POST.get('email')
        emailotp = request.POST.get('emailotp')
        mobileotp = request.POST.get('mobileotp')
        otp = None
        match = False
        if OTP.objects.filter(Email=email).exists():
            otp = OTP.objects.get(Email=email)
        elif OTP.objects.filter(Mobile=contact).exists():
            otp = OTP.objects.get(Mobile=contact)
        if otp.MobileOTP != "000000" and otp.EmailOTP != "000000":
            if otp.MobileOTP == mobileotp and otp.EmailOTP == emailotp:
                match = True
            else:
                match = False
        elif otp.MobileOTP != "000000":
            if otp.MobileOTP == mobileotp:
                match = True
            else:
                match = False
        elif otp.EmailOTP != "000000":
            if otp.EmailOTP == emailotp:
                match = True
            else:
                match = False
        if match:
            otp.delete()
            person = None
            person2 = None
            type = request.user.User_Type
            if type == 'Normal':
                person = NormalUser.objects.get(Username=request.user)
            elif type == 'Doctor':
                person = Doctor.objects.get(Username=request.user)
            elif type == 'Blood Donor':
                person = Blood_Donar.objects.get(Username=request.user)
            elif type == 'Blood Donor & Doctor':
                person = Doctor.objects.get(Username=request.user)
                person2 = Blood_Donar.objects.get(Username=request.user)
            if contact != person.Contact:
                oldcontact = person.Contact
                person.Contact = contact
                person.save()
                file = open('Contact_Update_Success.html')
                mes = file.read()
                file.close()
                mes = mes.replace("oldcontact", oldcontact).replace("newcontact", contact)
                subject = 'Contact Update Success'
                body = ''
                htmlMessage = mes
                sender = settings.EMAIL_HOST_USER
                receiver = [request.user.email, ]

                send_mail(subject=subject, message=None, from_email=sender, recipient_list=receiver,
                          fail_silently=False,
                          html_message=htmlMessage)
            if person2 is not None and contact != person2.Contact:
                person2.Contact = contact
                person2.save()
            if email != request.user.email:
                oldemail = request.user.email
                user = Users.objects.get(username=request.user.username)
                user.email = email
                user.save()
                file = open('Email_Update_Success.html')
                mes = file.read()
                file.close()
                mes = mes.replace("oldemail", oldemail).replace("newemail", email)
                subject = 'Email Update Success'
                body = ''
                htmlMessage = mes
                sender = settings.EMAIL_HOST_USER
                receiver = [request.user.email, ]

                send_mail(subject=subject, message=None, from_email=sender, recipient_list=receiver,
                          fail_silently=False,
                          html_message=htmlMessage)
            data['error'] = "0"
        else:
            data['error'] = "1"
    else:
        data['error'] = "2"
    return JsonResponse(data)


@login_required(login_url="/login/")
def EdidBloodGroup(request):
    data = {}
    data['error'] = "1"
    bloodGroup = request.POST.get('bloodGroup')
    if request.user.User_Type == "Blood Donor & Doctor":
        donor = Blood_Donar.objects.get(Username=request.user)
        donor.Blood_Group = bloodGroup
        donor.save()
        doctor = Doctor.objects.get(Username=request.user)
        doctor.Blood_Group = bloodGroup
        doctor.save()
        data['error'] = "0"
    elif request.user.User_Type == "Blood Donor":
        donor = Blood_Donar.objects.get(Username=request.user)
        donor.Blood_Group = bloodGroup
        donor.save()
        data['error'] = "0"
    elif request.user.User_Type == "Doctor":
        doctor = Doctor.objects.get(Username=request.user)
        doctor.Blood_Group = bloodGroup
        doctor.save()
        data['error'] = "0"
    return JsonResponse(data)



@login_required(login_url="/login/")
def DoctorProfile(request):
    if request.user.User_Type == 'Blood Donor':
        return redirect(UserProfile)
    person = Doctor.objects.get(Username=request.user)
    if request.user.User_Type == "Blood Donor & Doctor":
        person2 = Blood_Donar.objects.get(Username=request.user)
    if request.method == 'POST':
        name = request.POST.get('name')
        gender = request.POST.get('gender')
        pic = request.FILES.get('picture')
        action = str(request.POST.get('action'))
        if action == 'image':
            cont_type = str(pic.content_type)
            cont_type = cont_type.split('/')
            if cont_type[0] != 'image':
                error = True,
                message = 'Not a vaild Image File!'
                context = {
                    'person': person,
                    "error":error,
                    "message":message,
                    'districts': getDistrict(person.State),
                    'degree': doctor_degree,
                }
                return render(request, 'doctorprofile.html', context)
            else:
                person.Image = pic
                person.save()
                if request.user.User_Type == "Blood Donor & Doctor":
                    person2.Image = pic
                    person2.save()
                context = {
                    'person': person,
                    'districts': getDistrict(person.State),
                    'degree': doctor_degree,
                }
                return HttpResponseRedirect(reverse(DoctorProfile,))
        elif action == 'GeneralUpdate':
            person.Name = name
            person.Gender = gender
            person.save()
            context = {
                'person': person,
                'districts': getDistrict(person.State),
                'degree': doctor_degree,
            }
            return HttpResponseRedirect(reverse(DoctorProfile,))
        elif action == "AddressUpdate":
            address = request.POST.get('address')
            pin = request.POST.get('pin')
            state = request.POST.get('state')
            district = request.POST.get('district')
            city = request.POST.get('city')
            subdivision = request.POST.get('subdivision')
            person.Address = address
            person.State = state
            person.Pin = pin
            person.District = district
            person.City = city
            person.Subdivision = subdivision
            person.save()
            if request.user.User_Type == "Blood Donor & Doctor":
                person2.Address = address
                person2.State = state
                person2.Pin = pin
                person2.District = district
                person2.City = city
                person2.Subdivision = subdivision
                person2.save()
            context = {
                'person': person,
                'districts': getDistrict(person.State),
                'degree': doctor_degree,
            }
            return HttpResponseRedirect(reverse(DonorProfile,))
        else:
            context = {
                'person': person,
                'districts': getDistrict(person.State),
                'degree': doctor_degree,
            }
            return HttpResponseRedirect(reverse(DoctorProfile,))
    else:
        context = {
            'person':person,
            'districts':getDistrict(person.State),
            'degree': doctor_degree,
        }
        return render(request, 'doctorprofile.html', context)



@login_required(login_url="/login/")
def NormalProfile(request):
    if request.user.User_Type != 'Normal':
        return redirect(UserProfile)
    person = NormalUser.objects.get(Username=request.user)
    if request.method == 'POST':
        name = request.POST.get('name')
        gender = request.POST.get('gender')
        pic = request.FILES.get('picture')
        action = str(request.POST.get('action'))
        if action == 'image':
            cont_type = str(pic.content_type)
            cont_type = cont_type.split('/')
            if cont_type[0] != 'image':
                error = True,
                message = 'Not a vaild Image File!'
                context = {
                    'person': person,
                    "error":error,
                    "message":message,
                    'districts': getDistrict(person.State),
                    'degree': doctor_degree,
                }
                return render(request, 'normaluser.html', context)
            else:
                person.Image = pic
                person.save()
                context = {
                    'person': person,
                    'districts': getDistrict(person.State),
                    'degree': doctor_degree,
                }
                return HttpResponseRedirect(reverse(NormalProfile,))
        elif action == 'GeneralUpdate':
            person.Name = name
            person.Gender = gender
            person.save()
            context = {
                'person': person,
                'districts': getDistrict(person.State),
                'degree': doctor_degree,
            }
            return HttpResponseRedirect(reverse(NormalProfile,))
        elif action == "AddressUpdate":
            address = request.POST.get('address')
            pin = request.POST.get('pin')
            state = request.POST.get('state')
            district = request.POST.get('district')
            city = request.POST.get('city')
            subdivision = request.POST.get('subdivision')
            person.Address = address
            person.State = state
            person.Pin = pin
            person.District = district
            person.City = city
            person.Subdivision = subdivision
            person.save()
            context = {
                'person': person,
                'districts': getDistrict(person.State),
                'degree': doctor_degree,
            }
            return HttpResponseRedirect(reverse(NormalProfile,))
        else:
            context = {
                'person': person,
                'districts': getDistrict(person.State),
                'degree': doctor_degree,
            }
            return HttpResponseRedirect(reverse(NormalProfile,))
    else:
        context = {
            'person':person,
            'districts':getDistrict(person.State),
            'degree': doctor_degree,
        }
        return render(request, 'normaluser.html', context)

@login_required(login_url="/login/")
def AddBed(request):
    response_data = {}
    hospital = Hospital.objects.get(Username=request.user)
    if request.method == 'POST':
        Bed_No = request.POST.get('Bed_No')
        room = request.POST.get('room')
        flor = request.POST.get('flor')
        building = request.POST.get('building')
        if BedNo.objects.filter(Hospital=hospital, Bed_No=Bed_No, Flor=flor, Room=room, Building=building).exists():
            response_data['error'] = "exists"
        else:
            BedNo(Hospital=hospital, Bed_No=Bed_No, Flor=flor, Room=room, Building=building).save()
            response_data['error'] = "0"
        return JsonResponse(response_data)


@login_required(login_url="/login/")
def RemoveBed(request):
    response_data = {}
    hospital = Hospital.objects.get(Username=request.user)
    if request.method == 'POST':
        Bed_No = request.POST.get('Bed_No')
        room = request.POST.get('room')
        flor = request.POST.get('flor')
        building = request.POST.get('building')
        if BedNo.objects.filter(Hospital=hospital, Bed_No=Bed_No, Flor=flor, Room=room, Building=building).exists() == False:
            response_data['error'] = "noexists"
        elif BedNo.objects.filter(Hospital=hospital, Bed_No=Bed_No, Flor=flor, Room=room, Building=building, Availability='Used').exists():
            response_data['error'] = "used"
        else:
            bed = BedNo.objects.get(Hospital=hospital, Bed_No=Bed_No, Flor=flor, Room=room, Building=building)
            BedRemove(Hospital=hospital, Bed=bed).save()
            response_data['error'] = "0"
        return JsonResponse(response_data)


@login_required(login_url="/login/")
def WardChange(request):
    hospital = Hospital.objects.get(Username=request.user)
    room = request.GET.get('room')
    bed = BedNo.objects.filter(Hospital=hospital, Room=room, Availability='Available')
    count = BedNo.objects.filter(Hospital=hospital, Room=room, Availability='Available').count()
    response_data = {}
    bedId = []
    floorList = []
    buildingList = []
    bedNo = []
    j = 0
    for i in bed:
        bedId.insert(j, i.id)
        bedNo.insert(j, i.Bed_No)
        floorList.insert(j, i.Flor)
        buildingList.insert(j, i.Building)
        j += 1
    bed_json = serializers.serialize('json', bed)
    response_data['ward'] = room
    response_data['bed'] = bed_json
    response_data['bedId'] = bedId
    response_data['bedNo'] = bedNo
    response_data['floor'] = floorList
    response_data['building'] = buildingList
    response_data['count'] = count
    return JsonResponse(response_data)



@login_required(login_url="/login/")
def StatusChange(request):
    if request.method == 'POST':
        status = request.POST.get('status')
        bookId = request.POST.get('bookId')
        book = Bed_Book.objects.get(Booking_ID=bookId)
        if status == 'Admit':
            disease = request.POST.get('disease')
            Bed_Id = request.POST.get('Bed_Id')
            bed = BedNo.objects.get(id=Bed_Id)
            book.Bed_No = bed
            book.Disease = disease
            book.save()
        elif status == "Release" or status == "Don't Need to Admit":
            book.delete()
    else:
        return redirect(Home)

@login_required(login_url="/login/")
def PatientEdit(request):
    bookid = request.POST.get('bookid')
    status = request.POST.get('status')
    book = Bed_Book.objects.get(Booking_ID=bookid)
    response_data = {}

    bed = BedNo.objects.get(Booking_Id=bookid)
    bed.Availability = "Available"
    bed.Book_by = None
    bed.Booking_Id = None
    bed.save()


    if status == 'Release':
        book = Bed_Book.objects.get(Booking_ID=bookid)
        book.Status = "Released"
        book.save()
        response_data['success'] = "release"
        return JsonResponse(response_data)
    elif status == "edit":
        bedId = request.POST.get('Bed_Id')
        bed = BedNo.objects.get(id=bedId)
        book.Bed_No = bed
        book.save()
        book = Bed_Book.objects.get(Booking_ID=bookid)
        bed.Availability = "Used"
        bed.Book_by = book.user
        bed.Booking_Id = book.Booking_ID
        bed.save()


        response_data['name'] = book.Patient_Name
        response_data['bedno'] = bed.Bed_No
        response_data['ward'] = bed.Room
        response_data['building'] = bed.Building
        response_data['floor'] = bed.Flor
        response_data['success'] = "change"
        return JsonResponse(response_data)



@login_required(login_url="/login/")
def GeneralEdit(request):
    response_data = {}
    if request.method == "POST":
        type = request.POST.get('type')
        name = request.POST.get('name')
        address = request.POST.get('address')
        state = request.POST.get('state')
        district = request.POST.get('district')
        subdivision = request.POST.get('subdivision')
        pin = request.POST.get('pin')
        hos = Hospital.objects.get(Username=request.user)
        hos.Name = name
        hos.Type = type
        hos.Address = address
        hos.State = state
        hos.Subdivision = subdivision
        hos.District = district
        hos.Pin = pin
        hospital = hos.save()

        response_data['success'] = "1"
    else:
        response_data['success'] = "0"

    return JsonResponse(response_data)



@login_required(login_url="/login/")
def HospitalContactEdit(request):
    response_data = {}
    error = "1"
    if request.method == "POST":
        user = Users.objects.get(username=request.user.username)
        contact = request.POST.get('contact')
        email = request.POST.get('email')
        if OTP.objects.filter(Mobile=contact, Email=email).exists():
            otp = OTP.objects.get(Email=email)
            if otp.Is_Verified:
                otp.delete()
                hospital = Hospital.objects.get(Username=request.user)
                hospital.Contact = contact
                hospital.save()
                user.email = email
                user.save()
                error = "0"
            else:
                error = "1"
        else:
            error = "1"
    else:
        error = "1"
    response_data['error'] = error
    return JsonResponse(response_data)



@login_required(login_url="/login/")
def HospitalAdmin(request):
    if request.user.User_Type != 'Hospital':
        return redirect(UserProfile)

    hospital = Hospital.objects.get(Username=request.user)
    if request.user.User_Type != 'Hospital' or request.user.is_verified == False:
        return redirect(Home)
    admitBook = Bed_Book.objects.filter(Hospital_Name=hospital, Status="Admited")

    general = BedNo.objects.filter(Hospital=hospital, Room='General Ward').count()
    general_available = BedNo.objects.filter(Hospital=hospital, Room='General Ward', Availability='Available').count()
    general_used = BedNo.objects.filter(Hospital=hospital, Room='General Ward', Availability='Used').count()
    general_book = BedNo.objects.filter(Hospital=hospital, Room='General Ward', Availability='Book').count()

    women = BedNo.objects.filter(Hospital=hospital, Room='Women Ward').count()
    women_available = BedNo.objects.filter(Hospital=hospital, Room='Women Ward', Availability='Available').count()
    women_used = BedNo.objects.filter(Hospital=hospital, Room='Women Ward', Availability='Used').count()
    women_book = BedNo.objects.filter(Hospital=hospital, Room='Women Ward', Availability='Book').count()

    men = BedNo.objects.filter(Hospital=hospital, Room='Men Ward').count()
    men_available = BedNo.objects.filter(Hospital=hospital, Room='Men Ward', Availability='Available').count()
    men_used = BedNo.objects.filter(Hospital=hospital, Room='Men Ward', Availability='Used').count()
    men_book = BedNo.objects.filter(Hospital=hospital, Room='Men Ward', Availability='Book').count()

    child = BedNo.objects.filter(Hospital=hospital, Room='Child Ward').count()
    child_available = BedNo.objects.filter(Hospital=hospital, Room='Child Ward', Availability='Available').count()
    child_used = BedNo.objects.filter(Hospital=hospital, Room='Child Ward', Availability='Used').count()
    child_book = BedNo.objects.filter(Hospital=hospital, Room='Child Ward', Availability='Book').count()

    icu = BedNo.objects.filter(Hospital=hospital, Room='ICU').count()
    icu_available = BedNo.objects.filter(Hospital=hospital, Room='ICU', Availability='Available').count()
    icu_used = BedNo.objects.filter(Hospital=hospital, Room='ICU', Availability='Used').count()
    icu_book = BedNo.objects.filter(Hospital=hospital, Room='ICU', Availability='Book').count()

    bed = BedNo.objects.filter(Hospital=hospital)

    imageForm = HospitalImageUploadForm()

    if request.method == 'POST':
        action = request.POST.get('action')
        status = request.POST.get('status')
        bookid = request.POST.get('bookid')

        book = None
        if Bed_Book.objects.filter(Booking_ID=bookid).exists():
            book = Bed_Book.objects.get(Booking_ID=bookid)

        if action == 'search':
            filter_value1 = {}
            filter_value2 = {}
            key = {}
            bookId = request.POST.get('bookingId', '')
            name = request.POST.get('name', '')
            mobile = request.POST.get('mobile', '')
            building = request.POST.get('building', '')
            ward = request.POST.get('ward', '')
            bedNo = request.POST.get('bedNo', '')

            filter_value2['Building'] = building
            filter_value2['Room'] = ward
            filter_value2['Bed_No'] = bedNo

            kwargs = {}
            for k, v in filter_value2.items():
                if v != '':
                    kwargs[k] = v
            Bed = BedNo.objects.filter(**kwargs)

            filter_value1['Booking_ID'] = bookId
            filter_value1['Patient_Name__icontains'] = name
            filter_value1['Mobile'] = mobile
            filter_value1['Hospital_Name'] = hospital
            filter_value1['Status'] = "Admited"
            filter_value1['Bed_No__in'] = Bed

            kwargs = {}
            for k, v in filter_value1.items():
                if v != '':
                    kwargs[k] = v
            admitBook = Bed_Book.objects.filter(**kwargs)

            context = {
                "bookId":bookId,
                "name":name,
                "mobile":mobile,
                "building":building,
                "ward":ward,
                "bedNo":bedNo,
                "hospital": hospital,
                "admitBook": admitBook,
                "general": general,
                "general_avail": general_available,
                "general_used": general_used,
                "women": women,
                "women_avail": women_available,
                "women_used": women_used,
                "men": men,
                "men_avail": men_available,
                "men_used": men_used,
                "child": child,
                "child_avail": child_available,
                "child_used": child_used,
                "icu": icu,
                "icu_avail": icu_available,
                "icu_used": icu_used,
                "general_book":general_book,
                "women_book":women_book,
                "men_book":men_book,
                "child_book":child_book,
                "room": room_list,
                "flor":flor_list,
                "bed": bed,
                "states": state_list,
                "imageForm": imageForm,
            }
            return render(request, 'hospitaladmin.html', context)
        if action == "getBook":
            if Bed_Book.objects.filter(Booking_ID=bookid).exists() == False:
                context = {
                    "hospital": hospital,
                    "admitBook": admitBook,
                    "general":general,
                    "general_avail":general_available,
                    "general_used":general_used,
                    "women":women,
                    "women_avail": women_available,
                    "women_used": women_used,
                    "men":men,
                    "men_avail": men_available,
                    "men_used": men_used,
                    "child":child,
                    "child_avail": child_available,
                    "child_used": child_used,
                    "icu":icu,
                    "icu_avail": icu_available,
                    "icu_used": icu_used,
                    "general_book": general_book,
                    "women_book": women_book,
                    "men_book": men_book,
                    "child_book": child_book,
                    "room": room_list,
                    "flor": flor_list,
                    "bed":bed,
                    "exists": "0",
                    "states": state_list,
                    "imageForm": imageForm,
                }
                return render(request, 'hospitaladmin.html', context)

            elif book.Hospital_Name != hospital:
                context = {
                    "hospital": hospital,
                    "admitBook": admitBook,
                    "general":general,
                    "general_avail":general_available,
                    "general_used":general_used,
                    "women":women,
                    "women_avail": women_available,
                    "women_used": women_used,
                    "men":men,
                    "men_avail": men_available,
                    "men_used": men_used,
                    "child":child,
                    "child_avail": child_available,
                    "child_used": child_used,
                    "icu":icu,
                    "icu_avail": icu_available,
                    "icu_used": icu_used,
                    "general_book": general_book,
                    "women_book": women_book,
                    "men_book": men_book,
                    "child_book": child_book,
                    "room": room_list,
                    "flor": flor_list,
                    "bed": bed,
                    "same": "0",
                    "book": book,
                    "states": state_list,
                    "imageForm": imageForm,
                }
                return render(request, 'hospitaladmin.html', context)
            elif book.Hospital_Name == hospital:
                context = {
                    "hospital": hospital,
                    "admitBook": admitBook,
                    "general":general,
                    "general_avail":general_available,
                    "general_used":general_used,
                    "women":women,
                    "women_avail": women_available,
                    "women_used": women_used,
                    "men":men,
                    "men_avail": men_available,
                    "men_used": men_used,
                    "child":child,
                    "child_avail": child_available,
                    "child_used": child_used,
                    "icu":icu,
                    "icu_avail": icu_available,
                    "icu_used": icu_used,
                    "general_book": general_book,
                    "women_book": women_book,
                    "men_book": men_book,
                    "child_book": child_book,
                    "room": room_list,
                    "flor": flor_list,
                    "bed": bed,
                    "book": book,
                    "states": state_list,
                    "imageForm": imageForm,
                }
                return render(request, 'hospitaladmin.html', context)

        elif action == "ImageUpload":
            pic = request.FILES.get('picture')
            cont_type = str(pic.content_type)
            cont_type = cont_type.split('/')
            if cont_type[0] != 'image':
                errorImg = True,
                message = 'It is not a vaild Image File!'
                context = {
                    "hospital": hospital,
                    "admitBook": admitBook,
                    "general": general,
                    "general_avail": general_available,
                    "general_used": general_used,
                    "women": women,
                    "women_avail": women_available,
                    "women_used": women_used,
                    "men": men,
                    "men_avail": men_available,
                    "men_used": men_used,
                    "child": child,
                    "child_avail": child_available,
                    "child_used": child_used,
                    "icu": icu,
                    "icu_avail": icu_available,
                    "icu_used": icu_used,
                    "general_book": general_book,
                    "women_book": women_book,
                    "men_book": men_book,
                    "child_book": child_book,
                    "room": room_list,
                    "flor": flor_list,
                    "bed": bed,
                    "states": state_list,
                    "imageForm": imageForm,
                    "message":message,
                    "errorImg":errorImg,
                }
                return render(request, 'hospitaladmin.html', context)
            else:
                hos = Hospital.objects.get(Username=request.user)
                hos.Image = pic
                hos.save()
                return HttpResponseRedirect(reverse(HospitalAdmin,))

        elif status is not None or status != "":
            if book.Status != 'Expired':
                BedNo.objects.filter(Booking_Id=bookid).update(Availability='Available', Book_by=None, Booking_Id=None)

                if status == 'Admit':
                    disease = request.POST.get('disease')
                    Bed_Id = request.POST.get('Bed_Id')
                    b = BedNo.objects.get(id=Bed_Id)
                    b.Availability = "Used"
                    b.Booking_Id = book.Booking_ID
                    b.Book_by = book.user
                    b.save()
                    b = BedNo.objects.get(id=Bed_Id)
                    book.Bed_No = b
                    book.Disease = disease
                    book.Status = 'Admited'
                    book.Admit_Time = zonetime.now()
                    book.save()

                    return HttpResponseRedirect(reverse(BedBookView, args=(bookid,)))

                elif status == "Don't Need to Admit":
                    book.delete()
                    context = {
                        "hospital": hospital,
                        "admitBook": admitBook,
                        "general":general,
                        "general_avail":general_available,
                        "general_used":general_used,
                        "women":women,
                        "women_avail": women_available,
                        "women_used": women_used,
                        "men":men,
                        "men_avail": men_available,
                        "men_used": men_used,
                        "child":child,
                        "child_avail": child_available,
                        "child_used": child_used,
                        "icu":icu,
                        "icu_avail": icu_available,
                        "icu_used": icu_used,
                        "general_book": general_book,
                        "women_book": women_book,
                        "men_book": men_book,
                        "child_book": child_book,
                        "room": room_list,
                        "flor": flor_list,
                        "bed": bed,
                        "noAdmit":"yes",
                        "states": state_list,
                        "imageForm": imageForm,
                    }
                    return HttpResponseRedirect(reverse(HospitalAdmin,))
                elif status == "Release":
                    book.Status = "Released"
                    book.save()
                    context = {
                        "hospital": hospital,
                        "admitBook": admitBook,
                        "general":general,
                        "general_avail":general_available,
                        "general_used":general_used,
                        "women":women,
                        "women_avail": women_available,
                        "women_used": women_used,
                        "men":men,
                        "men_avail": men_available,
                        "men_used": men_used,
                        "child":child,
                        "child_avail": child_available,
                        "child_used": child_used,
                        "icu":icu,
                        "icu_avail": icu_available,
                        "icu_used": icu_used,
                        "general_book": general_book,
                        "women_book": women_book,
                        "men_book": men_book,
                        "child_book": child_book,
                        "room": room_list,
                        "flor": flor_list,
                        "bed": bed,
                        "release":"yes",
                        "states": state_list,
                        "imageForm": imageForm,
                    }
                    return HttpResponseRedirect(reverse(HospitalAdmin,))

    else:
        context = {
            "hospital":hospital,
            "admitBook":admitBook,
            "general": general,
            "general_avail": general_available,
            "general_used": general_used,
            "women": women,
            "women_avail": women_available,
            "women_used": women_used,
            "men": men,
            "men_avail": men_available,
            "men_used": men_used,
            "child": child,
            "child_avail": child_available,
            "child_used": child_used,
            "icu": icu,
            "icu_avail": icu_available,
            "icu_used": icu_used,
            "general_book": general_book,
            "women_book": women_book,
            "men_book": men_book,
            "child_book": child_book,
            "room":room_list,
            "flor": flor_list,
            "bed": bed,
            "states": state_list,
            "imageForm":imageForm,
        }
        return render(request, 'hospitaladmin.html', context)


def UserNextBook(request):
    response_data = {}
    if request.user.is_authenticated:
        timeZoneOffset = request.GET.get('timeZoneOffset')
        timeZoneOffset = float(timeZoneOffset)
        if Bed_Book.objects.filter(user=request.user, Status='Not Admit Still Now').exists():
            userbook = Bed_Book.objects.get(user=request.user,Status='Not Admit Still Now')
            nexttime = userbook.Expire_Time
            nexttime = nexttime.astimezone(zonetime.utc)
            if timeZoneOffset >= 0:
                nexttime = nexttime - timedelta(minutes=timeZoneOffset)
            elif timeZoneOffset < 0:
                nexttime =  nexttime + timedelta(minutes=timeZoneOffset)
            nexttime = nexttime.strftime("%B %d, %Y %H:%M:%S")

            response_data['message'] = "0"
            response_data['nexttime'] = nexttime
        else:
            response_data['message'] = "1"
    else:
        response_data['message'] = "1"

    return JsonResponse(response_data)


@login_required(login_url="/login/")
def MyBookings(request):
    user = Users.objects.get(username=request.user.username)
    bookings = Bed_Book.objects.filter(user=user).exclude(Status='Expired')
    response_data = {}
    response_data['error'] = "1"
    if request.method == 'POST':
        bookId = request.POST.get('bookId')
        if Bed_Book.objects.filter(Booking_ID=bookId).exists():
            book = Bed_Book.objects.get(Booking_ID=bookId)
            if book.user == request.user and book.Status == 'Not Admit Still Now':
                if BedNo.objects.filter(Booking_Id=book.Booking_ID).exists():
                    bed = BedNo.objects.get(Booking_Id=book.Booking_ID)
                    bed.Availability = 'Available'
                    bed.Book_by = None
                    bed.Booking_Id = None
                    bed.save()
                Bed_Book.objects.filter(Booking_ID=bookId).delete()
                response_data['error']="0"
        return JsonResponse(response_data)
    else:
        context = {
            'bookings':bookings,
        }
        return render(request, 'mybook.html', context)


@login_required(login_url="/login/")
def BedBook(request, hospitalID):
    if not request.user.is_book_allow:
        context = {
            "nobook": "1",
        }
        return render(request, 'bedbook.html', context)
    if request.user.User_Type != "Hospital" and request.user.User_Type != "Admin" and Bed_Book.objects.filter(Q(user=request.user) & Q(Status='Not Admit Still Now')).exists():
        return redirect(Hospitals)
    if Hospital.objects.filter(Hospital_Id=hospitalID).exists() == False:
        context = {
            'noHospital':True,
        }
        return render(request, 'bedbook.html', context)
    hospital = Hospital.objects.get(Hospital_Id=hospitalID)
    wardgen = BedNo.objects.filter(Hospital=hospital, Room='General Ward', Availability='Available').count()
    wardwomen = BedNo.objects.filter(Hospital=hospital, Room='Women Ward', Availability='Available').count()
    wardmen = BedNo.objects.filter(Hospital=hospital, Room='Men Ward', Availability='Available').count()
    wardchild = BedNo.objects.filter(Hospital=hospital, Room='Child Ward', Availability='Available').count()
    if wardgen == 0 and wardmen == 0 and wardwomen == 0 and wardchild == 0:
        context = {
            'noBed': True,
        }
        return render(request, 'bedbook.html', context)
    NoBook = False
    allowAge = 300
    gen = "all"
    patient = "all"
    genWard = int(BedNo.objects.filter(Hospital=hospital, Availability='Available', Room="General Ward").count())
    womenWard = int(BedNo.objects.filter(Hospital=hospital, Availability='Available', Room="Women Ward").count())
    menWard = int(BedNo.objects.filter(Hospital=hospital, Availability='Available', Room="Men Ward").count())
    childWard = int(BedNo.objects.filter(Hospital=hospital, Availability='Available', Room="Child Ward").count())

    if genWard <= 0 and womenWard <= 0 and menWard <= 0 and childWard <= 0:
        NoBook = True
    else:
        if genWard <= 0 and womenWard <= 0 and menWard > 0 and childWard <= 0:
            gen = "Male"
        elif genWard <= 0 and womenWard > 0 and menWard <= 0 and childWard <= 0:
            gen = "Female"
        if genWard <= 0 and womenWard <= 0 and menWard <= 0 and childWard > 0:
            patient = "child"
            allowAge = 10
            gen = "all"

    if request.method == 'POST':
        otp = request.POST.get('otp')
        name = request.POST.get('patientName')
        Email = request.POST.get('email')
        mobile = request.POST.get('mobile')
        altmobile = request.POST.get('altmobile')
        address = request.POST.get('address')
        state = request.POST.get('state')
        district = request.POST.get('district')
        pin = request.POST.get('pin')
        subdivision = request.POST.get('subdivision')
        gender = request.POST.get('gender')
        age = request.POST.get('age')
        if (gen == "Male" and gender != "Male") or (gen == "Female" and gender != "Female"):
            st = True
            context = {
                "Hospital": hospital,
                "states": state_list,
                "error": True,
                "message": "Provide correct data in Gender field.",
                "patientName": name,
                "email": Email,
                "mobile": mobile,
                "altmobile": altmobile,
                "address": address,
                "state": state,
                "district": district,
                "pin": pin,
                "age": age,
                "st": st,
                "bookAllow": NoBook,
                "ageAllow": allowAge,
                "gen": gen,
            }
            return render(request, 'bedbook.html', context)
        if int(age) > int(allowAge):
            st = True
            context = {
                "Hospital": hospital,
                "states": state_list,
                "error": True,
                "message": "Given Age is not allow!",
                "patientName": name,
                "email": Email,
                "mobile": mobile,
                "altmobile": altmobile,
                "address": address,
                "state": state,
                "district": district,
                "pin": pin,
                "gender": gender,
                "st": st,
                "NoBook": NoBook,
                "ageAllow": allowAge,
                "gen": gen,
            }
            return render(request, 'bedbook.html', context)
        if OTP.objects.filter(Mobile=mobile).exists():

            MobOtp = OTP.objects.get(Mobile=mobile)
            if MobOtp.Is_Verified == True:
                refId = None
                booktime = zonetime.now()
                expire = booktime + timedelta(hours=3.0)
                while(1):
                    hosId = str(hospitalID)
                    refId = str(secrets.randbits(20))
                    refId = ''.join([secrets.choice(refId) for i in range(5)])
                    refId = hosId+refId
                    refId = refId.zfill(10)
                    if Bed_Book.objects.filter(Booking_ID=refId).exists():
                        continue
                    else:
                        break

                Book = Bed_Book(Booking_ID=refId, Age=age, user=request.user, Hospital_Name=hospital, Patient_Name=name, Email=Email, Mobile=mobile, Alternative_Mobile=altmobile, Address=address, State=state, District=district, Pin=pin, Subdivision=subdivision, Gender=gender, Booking_Time=booktime, Expire_Time=expire)
                Book.save()
                bk = Bed_Book.objects.get(Booking_ID=refId)
                if int(age) <= 10:
                    if BedNo.objects.filter(Hospital=hospital, Availability='Available', Room='Child Ward').exists():
                        bed = BedNo.objects.filter(Hospital=hospital, Availability='Available', Room='Child Ward')
                        for i in bed:
                            b = BedNo.objects.get(id=i.id)
                            b.Availability = "Book"
                            b.Book_by = request.user
                            b.Booking_Id = bk.Booking_ID
                            b.Book_Expire = bk.Expire_Time
                            b.save()
                            break
                    elif BedNo.objects.filter(Hospital=hospital, Availability='Available', Room='General Ward').exists():
                        bed = BedNo.objects.filter(Hospital=hospital, Availability='Available', Room='General Ward')
                        for i in bed:
                            b = BedNo.objects.get(id=i.id)
                            b.Availability = "Book"
                            b.Book_by = request.user
                            b.Booking_Id = bk.Booking_ID
                            b.Book_Expire = bk.Expire_Time
                            b.save()
                            break
                    elif gender == "Female" and BedNo.objects.filter(Hospital=hospital, Availability='Available', Room='Women Ward').exists():
                        bed = BedNo.objects.filter(Hospital=hospital, Availability='Available', Room='Women Ward')
                        for i in bed:
                            b = BedNo.objects.get(id=i.id)
                            b.Availability = "Book"
                            b.Book_by = request.user
                            b.Booking_Id = bk.Booking_ID
                            b.Book_Expire = bk.Expire_Time
                            b.save()
                            break
                    elif gender == "Male" and BedNo.objects.filter(Hospital=hospital, Availability='Available', Room='Men Ward').exists():
                        bed = BedNo.objects.filter(Hospital=hospital, Availability='Available', Room='Men Ward')
                        for i in bed:
                            b = BedNo.objects.get(id=i.id)
                            b.Availability = "Book"
                            b.Book_by = request.user
                            b.Booking_Id = bk.Booking_ID
                            b.Book_Expire = bk.Expire_Time
                            b.save()
                            break

                elif gender == "Male" and patient != "child" and BedNo.objects.filter(Hospital=hospital, Availability='Available', Room='Men Ward').exists():
                    bed = BedNo.objects.filter(Hospital=hospital, Availability='Available', Room='Men Ward')
                    for i in bed:
                        b = BedNo.objects.get(id=i.id)
                        b.Availability = "Book"
                        b.Book_by = request.user
                        b.Booking_Id = bk.Booking_ID
                        b.Book_Expire = bk.Expire_Time
                        b.save()
                        break
                elif gender == "Female" and patient != "child" and BedNo.objects.filter(Hospital=hospital, Availability='Available', Room='Women Ward').exists():
                    bed = BedNo.objects.filter(Hospital=hospital, Availability='Available', Room='Women Ward')
                    for i in bed:
                        b = BedNo.objects.get(id=i.id)
                        b.Availability = "Book"
                        b.Book_by = request.user
                        b.Booking_Id = bk.Booking_ID
                        b.Book_Expire = bk.Expire_Time
                        b.save()
                        break
                else:
                    bed = BedNo.objects.filter(Hospital=hospital, Availability='Available', Room='General Ward')
                    for i in bed:
                        b = BedNo.objects.get(id=i.id)
                        b.Availability = "Book"
                        b.Book_by = request.user
                        b.Booking_Id = bk.Booking_ID
                        b.Book_Expire = bk.Expire_Time
                        b.save()
                        break
                var = "1215"
                vty = "2545"
                url = "https://www.fast2sms.com/dev/bulk"
                payload = "sender_id=FSTSMS&language=english&route=qt&numbers="+mobile+"&message=42402&variables={#CC#}|{#BB#}&variables_values="+refId+"|"+hospital.Contact+""

                headers = {
                    'authorization': settings.FAST2SMAS_API_KEY,
                    'Content-Type': "application/x-www-form-urlencoded",
                    'Cache-Control': "no-cache",
                }
                requests.request("POST", url, data=payload, headers=headers)

                file = open('New_Book_Mail.html')
                mes = file.read()
                file.close()
                mes = mes.replace("myhospital", hospital).replace("mybookid", refId)
                subject = 'Bed Book Confirmed'
                body = ''
                htmlMessage = mes
                sender = settings.EMAIL_HOST_USER
                receiver = [request.user.email, ]

                send_mail(subject=subject, message=None, from_email=sender, recipient_list=receiver,
                          fail_silently=False,
                          html_message=htmlMessage)

                return HttpResponseRedirect(reverse(BedBookView, args=(refId,)))

            else:
                st = True
                context = {
                    "Hospital": hospital,
                    "states": state_list,
                    "error":True,
                    "message":"OTP Verification Failed! Please enter correct OTP to Verify your Mobile No",
                    "patientName":name,
                    "email":Email,
                    "mobile":mobile,
                    "altmobile":altmobile,
                    "address":address,
                    "state":state,
                    "district":district,
                    "pin":pin,
                    "gender":gender,
                    "age": age,
                    "st":st,
                    "bookAllow":NoBook,
                    "ageAllow":allowAge,
                    "gen":gen,
                }
                return render(request, 'bedbook.html', context)
        else:
            st = True
            context = {
                "Hospital": hospital,
                "states": state_list,
                "error": True,
                "message": "OTP Verification Failed! Please Send OTP and Enter correct OTP to Verify your Mobile No",
                "patientName": name,
                "email": Email,
                "mobile": mobile,
                "altmobile": altmobile,
                "address": address,
                "state": state,
                "district": district,
                "pin": pin,
                "gender": gender,
                "age": age,
                "st": st,
                "bookAllow": NoBook,
                "ageAllow": allowAge,
                "gen": gen,
            }
            return render(request, 'bedbook.html', context)

    else:
        context = {
                    "Hospital":hospital,
                    "states":state_list,
                    "bookAllow": NoBook,
                    "ageAllow": allowAge,
                    "gen": gen,
                   }
        return render(request, 'bedbook.html',context)


def LoadSpeciality(request):
    speciality = []
    degree = request.GET.get('degree')
    if degree == "MD (Doctor of Medicine)":
        speciality = MD
        length = len(speciality)
    elif degree == "MS (Masters of Surgery)":
        speciality = MS
        length = len(speciality)
    elif degree == "DNB (Diplomate of National Board)":
        speciality = DNB
        length = len(speciality)
    elif degree == "D.M (Super Specialty degree in medicine)":
        speciality = DM
        length = len(speciality)
    elif degree == "M.Ch (Super Specialty degree in surgery)":
        speciality = Mch
        length = len(speciality)
    else:
        speciality = "N/A"
        length = "0"
    response_data = {}

    response_data['speciality'] = speciality
    response_data['count'] = length
    return JsonResponse(response_data)


def LoadAddress(request):
    state_arr = []
    state = None
    division = None
    response_data = {}
    pin = request.GET.get('pin')
    url = "https://api.postalpincode.in/pincode/"+pin
    res_data = requests.get(url)
    data = res_data.json()
    #res = json.dumps(data)
    json_data = str(json.loads(res_data.text))
    data_list = json_data.split(", ")

    status = str(data_list[1])
    status = status.split(":")
    status = status[1]
    status = str(status.replace("'", ''))

    if len(status) == 8:
        district = str(data_list[7])
        district = district.split(":")
        district = district[1]
        district = district.replace("'", '')
        district = district[1:]

        name = str(data_list[2])
        name = name.split(":")
        name = name[2]
        name = name.replace("'", '')
        name = name[1:]

        block = str(data_list[10])
        block = block.split(":")
        block = block[1]
        block = block.replace("'", '')
        block = block[1:]

        division = str(data_list[8])
        division = division.split(":")
        division = division[1]
        division = division.replace("'", '')
        division = division[1:]

        state = str(data_list[11])
        state = state.split(":")
        state = state[1]
        state = state.replace("'", '')
        state = state[1:]

        districts = getDistrict(state)
        districts.insert(0, district)

        state_arr = state_list
        state_arr.insert(0, state)

        subdivision = 'Na'
        if block == "NA":
            subdivision = name
        else:
            subdivision = block


        response_data['state'] = state
        response_data['states'] = state_arr
        response_data['city'] = name
        response_data['division'] = subdivision
        response_data['district'] = district
        response_data['districts'] = districts
        response_data['statecount'] = len(state_arr)
        response_data['districtcount'] = len(districts)
    return JsonResponse(response_data)

def LoadDistrict(request):
    state = request.GET.get('state')
    districts = getDistrict(state)
    response_data = {}
    response_data['district'] = districts
    response_data['districtcount'] = len(districts)
    return JsonResponse(response_data)


@login_required(login_url="/login/")
def NewBook(request):
    if request.method == 'POST':
        patientName = request.POST.get('patientName')
        email = request.POST.get('email')
        mobile = request.POST.get('mobile')
        altmobile = request.POST.get('altmobile')
        address = request.POST.get('address')
        state = request.POST.get('state')
        district = request.POST.get('district')
        subdivision = request.POST.get('subdivision')
        pin = request.POST.get('pin')
        gender = request.POST.get('gender')
        age = request.POST.get('age')
        disease = request.POST.get('disease')
        room = request.POST.get('room')
        Bed_Id = request.POST.get('Bed_Id')
        hospital = Hospital.objects.get(Username=request.user)
        booktime = zonetime.now()
        expire = booktime + timedelta(hours=12.0)
        bed = BedNo.objects.get(id=Bed_Id)

        refId = 0
        while (1):
            hosId = str(hospital.Hospital_Id)
            refId = str(secrets.randbits(20))
            refId = ''.join([secrets.choice(refId) for i in range(5)])
            refId = hosId + refId
            refId = refId.zfill(10)
            if Bed_Book.objects.filter(Booking_ID=refId).exists():
                continue
            else:
                break
        Bed_Book(Booking_ID=refId, user=request.user, Booked_By='Hospital Authority', Age=age, Disease=disease, Hospital_Name=hospital, Bed_No=bed, Patient_Name=patientName, Email=email, Mobile=mobile, Alternative_Mobile=altmobile, Address=address, State=state, District=district, Pin=pin, Subdivision=subdivision, Gender=gender, Status="Admited", Booking_Time=booktime, Expire_Time=expire, Admit_Time=booktime).save()
        bed = BedNo.objects.get(id=Bed_Id)
        bed.Availability = "Used"
        bed.Book_by = request.user
        bed.Booking_Id = refId
        bed.save()

        return HttpResponseRedirect(reverse(BedBookView, args=(refId,)))
    else:
        return HttpResponseRedirect(reverse(NewBook,))

def BedBookView(request, id):
    if Bed_Book.objects.filter(Booking_ID=id).exists() == False:
        context = {
            'noBook': True,
        }
        return render(request, 'bedbook_conf.html', context)
    book = Bed_Book.objects.get(Booking_ID=id)
    context = {
        'book':book,
    }
    return render(request, 'bedbook_conf.html', context)

def OTPSendReg(request):
    email = request.POST.get('email')
    contact = request.POST.get('contact')
    response_data = {}
    if request.method == 'POST':
        if (email is None or contact is None) or (email == '' or contact == ''):
            response_data['error'] = "1"
        else:
            e = str(secrets.randbits(20))
            emailOTP = ''.join([secrets.choice(e) for i in range(6)])
            m = str(secrets.randbits(20))
            mobileOTP = ''.join([secrets.choice(m) for i in range(6)])
            OTP.objects.filter(Email=email).delete()
            OTP.objects.filter(Mobile=contact).delete()

            cur_time = zonetime.now()
            expire = cur_time + timedelta(minutes=10.0)
            OTP(Email=email, Mobile=contact, EmailOTP=emailOTP, MobileOTP=mobileOTP, Expire_Time=expire, Is_Verified=False).save()

            file = open('Registration_otp.html')
            mes = file.read()
            file.close()
            mes = mes.replace("myotp", emailOTP)
            subject = 'OTP For Registration'
            body = ''
            htmlMessage = mes
            sender = settings.EMAIL_HOST_USER
            receiver = [email, ]

            send_mail(subject=subject, message=None, from_email=sender, recipient_list=receiver,
                      fail_silently=False,
                      html_message=htmlMessage)

            url = "https://www.fast2sms.com/dev/bulk"
            payload = {
                'sender_id': 'FSTSMS',
                'message': "42403",
                'language': 'english',
                'route': 'qt',
                'numbers': contact,
                'variables': '{#BB#}',
                'variables_values': mobileOTP,
            }
            headers = {
                'authorization': settings.FAST2SMAS_API_KEY,
                'Content-Type': "application/x-www-form-urlencoded",
                'Cache-Control': "no-cache",
            }
            requests.request("POST", url, data=payload, headers=headers)

            response_data['error'] = "0"
        response_data['email'] = email
        response_data['contact'] = contact
    return JsonResponse(response_data)


def OTPVerifyReg(request):
    emailotp = request.POST.get('emailotp')
    mobileotp = request.POST.get('mobileotp')
    email = request.POST.get('email')
    contact = request.POST.get('contact')
    response_data = {}
    if request.method == 'POST':
        response_data['error'] = "1"
        if emailotp is None or mobileotp is None or emailotp == '' or mobileotp == '' or email == '' or email is None or contact == '' or contact is None:
            response_data['error'] = "1"
            return JsonResponse(response_data)
        else:
            if OTP.objects.filter(Email=email).exists():
                otp = OTP.objects.get(Email=email)

                if otp.MobileOTP == mobileotp and otp.EmailOTP == emailotp:
                    otp.Is_Verified = True
                    otp.save()
                    response_data['error'] = "0"
                else:
                    otp.Is_Verified = False
                    otp.save()
                    response_data['error'] = "1"
            else:
                response_data['error'] = "1"
            return JsonResponse(response_data)

@login_required(login_url="/login/")
def OTPSendBook(request):
    mobile = request.POST.get('mobile')
    response_data = {}
    response = None
    if request.method == 'POST':
        if (mobile is None or mobile == ''):
            response_data['error'] = "1"
        else:
            m = str(secrets.randbits(20))
            mobileOTP = ''.join([secrets.choice(m) for i in range(6)])
            OTP.objects.filter(Mobile=mobile).delete()

            cur_time = zonetime.now()
            expire = cur_time + timedelta(minutes=10.0)

            OTP(Mobile=mobile, MobileOTP=mobileOTP, Expire_Time=expire, Is_Verified=False).save()

            url = "https://www.fast2sms.com/dev/bulk"
            payload = {
                'sender_id':'FSTSMS',
                'message':"42457",
                'language':'english',
                'route':'qt',
                'numbers':mobile,
                'variables':'{#BB#}',
                'variables_values':mobileOTP,
            }
            headers = {
                'authorization': settings.FAST2SMAS_API_KEY,
                'Content-Type': "application/x-www-form-urlencoded",
                'Cache-Control': "no-cache",
            }
            requests.request("POST", url, data=payload, headers=headers)

            response_data['error'] = "0"
        response_data['mobile'] = mobile
    return JsonResponse(response_data)

@login_required(login_url="/login/")
def OTPVerifyBook(request):
    response_data = {}
    mobile = request.POST.get('mobile')
    otp = request.POST.get('otp')
    if OTP.objects.filter(Mobile=mobile).exists():
        otpdata = OTP.objects.get(Mobile=mobile)
        if otp == otpdata.MobileOTP:
            otpdata.Is_Verified = True
            otpdata.save()
            response_data['error'] = "0"
        else:
            response_data['error'] = "1"
    else:
        response_data['error'] = "1"
    return JsonResponse(response_data)

def UsernameValid(request):
    username = request.POST.get('username')
    exists = None
    space = None
    length = None
    if Users.objects.filter(username=username).exists():
        exists = "1"
    elif ' ' in username:
        space = "1"
    elif len(username) > 15:
        length = "max"
    elif len(username) < 5:
        length = "min"
    else:
        exists = "2"
    data = {
        'is_exists':exists,
        'is_space':space,
        'length':length,
    }
    return JsonResponse(data)

def EmailValid(request):
    email = request.POST.get('email')
    if Users.objects.filter(email=email).exists():
        exists = "1"
    else:
        exists = "2"
    data = {
        'is_exists':exists,
    }
    return JsonResponse(data)

def AgeCheck(request):
    dob = request.POST.get('dob')
    d = dob.split("-")
    today = date.today()
    year = int(d[0])
    month = int(d[1])
    day = int(d[2])
    age = today.year - year - ((today.month, today.day) < (month, day))
    error = None
    if age >= 18:
        error = "0"
    else:
        error = "1"
    data = {
        'error': error,
        'age':age
    }
    return JsonResponse(data)

def Passwordcheck(request):
    password = str(request.POST.get('password'))
    Username_with = request.POST.get('username')
    validation_errors = dict()
    validation_errors['password'] = "0"
    exc = "0"
    mes = ''
    mes1 = ''
    mes2 = ''
    mes3 = ''
    mes4 = ''
    hasNumber = False
    if Username_with in password:
        mes = "Password must not be similar to Username<br>"
    if password.isalpha():
        mes1 = "This password is entirely alphabetic<br>"
    hasNumber = any(char.isdigit() for char in password)
    if not hasNumber and (' ' in password):
        mes1 = "This password is entirely alphabetic<br>"
    if not any(char.isupper() for char in password):
        mes2 = "Password must contain atleast one uppercase letter<br>"
    if not any(char.islower() for char in password):
        mes3 = "Password must contain atleast one lowercase letter<br>"
    if not any(char.isdigit() for char in password):
        mes4 = "Password must contain atleast one digit<br>"
    try:
        # validate the password and catch the exception
        validators.validate_password(password=password, user=Username_with)

    # the exception raised here is different than serializers.ValidationError
    except exceptions.ValidationError as e:
        exc = "1"
        message = str(e.messages)
        message += mes
        message += mes1
        message += mes2
        message += mes3
        message += mes4
        message = message.replace('.','<br>')
        message = message.replace('[', '')
        message = message.replace(']', '')
        message = message.replace("'", '')
        message = message.replace(",", '')
        validation_errors['password'] = message
    if exc == "0" and mes != '' or mes1 != '' or mes2 != '' or mes3 != '' or mes4 != '':
        validation_errors['password'] = mes+mes1+mes2+mes3+mes4
    return JsonResponse(validation_errors)

@login_required(login_url="/login/")
def PasswordChange(request):
    user = Users.objects.get(username=request.user.username)
    old_password = request.POST.get('old_password')
    new_password1 = request.POST.get('new_password1')
    new_password2 = request.POST.get('new_password2')
    matchPassword = check_password(old_password, request.user.password)
    error = "0"
    validation_errors = dict()
    validation_errors['password'] = "0"
    exc = "0"
    mes = ''
    mes1 = ''
    mes2 = ''
    mes3 = ''
    mes4 = ''
    hasNumber = False
    if request.user.username in new_password1:
        mes = "Password must not be similar to Username<br>"
    if new_password1.isalpha():
        mes1 = "This password is entirely alphabetic<br>"
    hasNumber = any(char.isdigit() for char in new_password1)
    if not hasNumber and (' ' in new_password1):
        mes1 = "This password is entirely alphabetic<br>"
    if not any(char.isupper() for char in new_password1):
        mes2 = "Password must contain atleast one uppercase letter<br>"
    if not any(char.islower() for char in new_password1):
        mes3 = "Password must contain atleast one lowercase letter<br>"
    if not any(char.isdigit() for char in new_password1):
        mes4 = "Password must contain atleast one digit<br>"
    try:
        # validate the password and catch the exception
        validators.validate_password(password=new_password1, user=request.user.username)

    # the exception raised here is different than serializers.ValidationError
    except exceptions.ValidationError as e:
        exc = "1"
        message = str(e.messages)
        message += mes
        message += mes1
        message += mes2
        message += mes3
        message += mes4
        message = message.replace('.', '<br>')
        message = message.replace('[', '')
        message = message.replace(']', '')
        message = message.replace("'", '')
        message = message.replace(",", '')
        validation_errors['password'] = message
    if exc == "0" and mes != '' or mes1 != '' or mes2 != '' or mes3 != '' or mes4 != '':
        validation_errors['password'] = mes + mes1 + mes2 + mes3 + mes4

    if matchPassword == False:
        error = "1"
    elif new_password1 != new_password2:
        error = "2"
    elif new_password1 == old_password:
        error = "3"
    elif validation_errors['password'] != '0':
        error = "4"
    else:
        data = {
            "old_password":old_password,
            "new_password1":new_password1,
            "new_password2":new_password2,
        }
        form = UsersPaswordChangeForm(request.user, data)
        if form.is_valid():
            new = form.save()
            update_session_auth_hash(request, new)
            file = open('Password_Changed.html')
            mes = file.read()
            file.close()
            subject = 'Password Has Been Changed'
            body = ''
            htmlMessage = mes
            sender = settings.EMAIL_HOST_USER
            receiver = [request.user.email, ]

            send_mail(subject=subject, message=None, from_email=sender, recipient_list=receiver,
                      fail_silently=False,
                      html_message=htmlMessage)

            error = "0"
            Session.objects.filter(session_key=request.session.session_key).delete()
            logout(request)
        else:
            error = form.errors
    response_data = {}
    response_data["error"] = error
    response_data["validation_errors"] = validation_errors['password']
    return JsonResponse(response_data)



def ResetPassword(request, code):
    nocode = False
    if ResetPasswordCode.objects.filter(Code=code).exists() == False:
        nocode = True
        context = {
            'nocode': nocode,
        }
        return render(request, 'resetpasswordlink.html', context)
    else:
        codedata = ResetPasswordCode.objects.get(Code=code)
        if request.method == 'POST':
            password1 = request.POST.get('password1')
            password2 = request.POST.get('password2')
            validation_errors = dict()
            validation_errors['password'] = None
            if password1 != password2:
                error = "1"
            else:
                user = Users.objects.get(username=codedata.Username.username)
                try:
                    # validate the password and catch the exception
                    validators.validate_password(password=password1, user=user)

                # the exception raised here is different than serializers.ValidationError
                except exceptions.ValidationError as e:
                    validation_errors['password'] = list(e.messages)

                if validation_errors['password'] is not None:
                    error = "4"
                else:
                    user.set_password(password1)
                    user.save()
                    ResetPasswordCode.objects.filter(Code=code).delete()
                    file = open('Multiple_Booking_Alert.html')
                    mes = file.read()
                    file.close()
                    subject = 'Reset Password Success'
                    body = ''
                    htmlMessage = mes
                    sender = settings.EMAIL_HOST_USER
                    receiver = [user.email, ]

                    send_mail(subject=subject, message=None, from_email=sender, recipient_list=receiver,
                              fail_silently=False,
                              html_message=htmlMessage)
                    Session.objects.filter(session_key=request.session.session_key).delete()
                    error = "0"
            data = {
                'error':error,
                "validation_errors": validation_errors['password'],
            }
            return JsonResponse(data)
        else:
            context = {
                'username':codedata.Username,
            }
            return render(request, 'resetpasswordlink.html', context)



def ResetPasswordLink(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')

        if Users.objects.filter(username=username).exists() == False:
            error = '1'
        else:
            user = Users.objects.get(username=username)
            if user.email != email:
                error = '2'
            else:
                code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for i in range(20))
                code = str(code)
                ResetPasswordCode.objects.filter(Username=user).delete()

                cur_time = zonetime.now()
                expire = cur_time + timedelta(minutes=10.0)
                link = 'https://gohealthy.pythonanywhere.com/reset-password/'+code
                ResetPasswordCode(Username=user, Code=code, Expire_Time=expire).save()
                file = open('Multiple_Booking_Alert.html')
                mes = file.read()
                file.close()
                mes = mes.replace('mycode', code)
                subject = 'Reset Password Link'
                body = ''
                htmlMessage = mes
                sender = settings.EMAIL_HOST_USER
                receiver = [email, ]

                send_mail(subject=subject, message=None, from_email=sender, recipient_list=receiver,
                          fail_silently=False,
                          html_message=htmlMessage)
                error = '0'
                Session.objects.filter(session_key=request.session.session_key).delete()
                logout(request)
        data = {
            'error': error,
        }
        return JsonResponse(data)
    else:
        return render(request, 'resetpassword.html')


def ImageCheck(request):
    picture = request.FILES.get('picture')
    cont_type = str(picture.content_type)
    cont_type = cont_type.split('/')
    if cont_type[0] != 'image':
        error = "1"
    else:
        error = "0"
    response_data = {}
    response_data['error'] = error
    return JsonResponse(response_data)



def RegisterDonor(request):
    if request.method == 'POST':
        verified = request.POST.get('verified')
        emailotp = request.POST.get('emailotp')
        mobileotp = request.POST.get('mobileotp')

        username = request.POST.get('username')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        email = request.POST.get('email')
        name = request.POST.get('name')
        gender = request.POST.get('gender')
        dob = request.POST.get('dob')
        bloodGroup = request.POST.get('bloodGroup')
        contact = request.POST.get('contact')
        idType = request.POST.get('idType')
        idNumber = request.POST.get('idNumber')
        address = request.POST.get('address')
        state = request.POST.get('state')
        city = request.POST.get('city')
        subdivision = request.POST.get('subdivision')
        district = request.POST.get('district')
        pin = request.POST.get('pin')
        pic = request.FILES.get('picture')
        cont_type = str(pic.content_type)
        cont_type = cont_type.split('/')

        datauser = {
            "username":username,
            "email":email,
            "password1":password1,
            "password2":password2
        }
        if OTP.objects.filter(Email=email, Mobile=contact).exists() == False:
            error = "-2"
            context = {"error": error, }
            return render(request, 'registerdonor.html', context)
        otp = OTP.objects.get(Email=email)
        if otp.Is_Verified == False:
            error = "-1"
            context = {"error": error, }
            return render(request, 'registerdoctor.html', context)
        if otp.Is_Verified == True:
            error = "0"
            otp.delete()

        if Users.objects.filter(username=username).exists():
            error = "1"
            context = {"error": error, }
            return render(request, 'registerdonor.html', context)
        elif Users.objects.filter(email=email).exists():
            error = "2"
            context = {"error": error, }
            return render(request, 'registerdonor.html', context)
        elif password1 != password2:
            error = "3"
            context = {"error": error, }
            return render(request, 'registerdonor.html', context)
        elif cont_type[0] != 'image':
            error = "4"
            context = {"error": error, }
            return render(request, 'registerdonor.html', context)

        formuser = UsersCreationForm(datauser)
        if formuser.is_valid():
            new = formuser.save(commit=False)
            new.User_Type = 'Blood Donor'
            new.save()
            newuser = Users.objects.get(username=new.username)
            Blood_Donar(Username=newuser, Name=name, Gender=gender, Date_of_Birth=dob, Blood_Group=bloodGroup, Contact=contact,
                        ID_Type=idType, ID_Number=idNumber, Address=address, State=state, City=city,
                        Subdivision=subdivision, District=district, Pin=pin, Image=pic).save()

            file = open('Registration_Success_Mail.html')
            mes = file.read()
            file.close()
            mes = mes.replace("myusername", username).replace("myemail", email).replace("mycontact", contact).replace("user", "Blood Donor")
            subject = 'Registration Successful'
            body = ''
            htmlMessage = mes
            sender = settings.EMAIL_HOST_USER
            receiver = [email, ]

            send_mail(subject=subject, message=None, from_email=sender, recipient_list=receiver,
                      fail_silently=False,
                      html_message=htmlMessage)

            context = {
                'error':"-0",
                "username":username
            }
            return render(request, 'registerdonor.html', context)
        else:
            context = {
                "error": "5",
                "message1":formuser.errors,
            }
            return render(request, 'registerdonor.html', context)

    context = {"error":"0",}
    return render(request, 'registerdonor.html', context)


def RegisterDoctor(request):
    if request.method == 'POST':
        verified = request.POST.get('verified')
        donor = request.POST.get('donor')
        emailotp = request.POST.get('emailotp')
        mobileotp = request.POST.get('mobileotp')

        bloodGroup = request.POST.get('bloodGroup')
        username = request.POST.get('username')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        email = request.POST.get('email')
        name = request.POST.get('name')
        gender = request.POST.get('gender')
        registrationNo = request.POST.get('registrationNo')
        contact = request.POST.get('contact')
        degree = request.POST.get('degree')
        specialty = request.POST.get('speciality')
        address = request.POST.get('address')
        state = request.POST.get('state')
        city = request.POST.get('city')
        subdivision = request.POST.get('subdivision')
        district = request.POST.get('district')
        pin = request.POST.get('pin')
        pic = request.FILES.get('picture')
        cont_type = str(pic.content_type)
        cont_type = cont_type.split('/')

        datauser = {
            "username": username,
            "email": email,
            "password1": password1,
            "password2": password2
        }

        if OTP.objects.filter(Email=email, Mobile=contact).exists() == False:
            error = "-2"
            context = {"error": error, "degree":doctor_degree,}
            return render(request, 'registerdoctor.html', context)
        otp = OTP.objects.get(Email=email)
        if otp.Is_Verified == False:
            error = "-1"
            context = {"error": error, "degree":doctor_degree, }
            return render(request, 'registerdoctor.html', context)
        if otp.Is_Verified == True:
            error = "0"
            otp.delete()

        if Users.objects.filter(username=username).exists():
            error = "1"
            context = {
                "error": error,
                "degree":doctor_degree,
            }
            return render(request, 'registerdoctor.html', context)
        elif Users.objects.filter(email=email).exists():
            error = "2"
            context = {
                "error": error,
                "degree": doctor_degree,
            }
            return render(request, 'registerdoctor.html', context)
        elif password1 != password2:
            error = "3"
            context = {"error": error,
                       "degree": doctor_degree,
                       }
            return render(request, 'registerdoctor.html', context)
        elif cont_type[0] != 'image':
            error = "4"
            context = {"error": error,
                       "degree": doctor_degree,
                       }
            return render(request, 'registerdoctor.html', context)

        formuser = UsersCreationForm(datauser)

        if formuser.is_valid():
            type = None
            new = formuser.save(commit=False)
            if donor == "BloodDonor":
                type = 'Blood Donor & Doctor'
                new.User_Type = type
            else:
                type = 'Doctor'
                new.User_Type = type
            new.save()
            newuser = Users.objects.get(username=new.username)
            Doctor(Username=newuser, Name=name, Gender=gender, Blood_Group=bloodGroup,
                   Registration_Number=registrationNo, Contact=contact,
                   Degree=degree, Special=specialty, Address=address, State=state, City=city,
                   Subdivision=subdivision, District=district, Pin=pin, Image=pic).save()
            if donor == "BloodDonor":
                usern = Users.objects.get(username=username)
                Blood_Donar(Username=usern,Name=name,Gender=gender,Blood_Group=bloodGroup,Contact=contact,ID_Type="Doctors's Registration",ID_Number=registrationNo,
                            Address=address,State=state,Subdivision=subdivision,District=district,Pin=pin,Image=pic).save()

            file = open('Registration_Success_Mail.html')
            mes = file.read()
            file.close()
            mes = mes.replace("myusername", username).replace("myemail", email).replace("mycontact", contact).replace("user", type)

            subject = 'Registration Successful'
            body = ''
            htmlMessage = mes
            sender = settings.EMAIL_HOST_USER
            receiver = [email, ]
            send_mail(subject=subject, message=None, from_email=sender, recipient_list=receiver,
                      fail_silently=False,
                      html_message=htmlMessage)

            context = {
                'error': "-0",
                "username": username,
                "degree": doctor_degree,
            }
            return render(request, 'registerdoctor.html', context)
        else:
            context = {
                "error": "5",
                "message1": formuser.errors,
                "degree": doctor_degree,
            }
            return render(request, 'registerdoctor.html', context)

    context = {
        "error": "0",
        "degree": doctor_degree,
    }
    return render(request, 'registerdoctor.html', context)

def NormalRegistration(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        email = request.POST.get('email')
        name = request.POST.get('name')
        gender = request.POST.get('gender')
        idType = request.POST.get('idType')
        idNumber = request.POST.get('idNumber')
        contact = request.POST.get('contact')
        address = request.POST.get('address')
        state = request.POST.get('state')
        city = request.POST.get('city')
        subdivision = request.POST.get('subdivision')
        district = request.POST.get('district')
        pin = request.POST.get('pin')
        pic = request.FILES.get('picture')
        cont_type = str(pic.content_type)
        cont_type = cont_type.split('/')

        datauser = {
            "username": username,
            "email": email,
            "password1": password1,
            "password2": password2
        }

        if OTP.objects.filter(Email=email, Mobile=contact).exists() == False:
            error = "-2"
            context = {"error": error,}
            return render(request, 'normalregistration.html', context)
        otp = OTP.objects.get(Email=email)
        if otp.Is_Verified == False:
            error = "-1"
            context = {"error": error, }
            return render(request, 'normalregistration.html', context)
        if otp.Is_Verified == True:
            error = "0"
            otp.delete()

        if Users.objects.filter(username=username).exists():
            error = "1"
            context = {
                "error": error,
            }
            return render(request, 'normalregistration.html', context)
        elif Users.objects.filter(email=email).exists():
            error = "2"
            context = {
                "error": error,
            }
            return render(request, 'normalregistration.html', context)
        elif password1 != password2:
            error = "3"
            context = {"error": error,
                       }
            return render(request, 'normalregistration.html', context)
        elif cont_type[0] != 'image':
            error = "4"
            context = {"error": error,
                       }
            return render(request, 'normalregistration.html', context)

        formuser = UsersCreationForm(datauser)

        if formuser.is_valid():
            new = formuser.save(commit=False)
            new.User_Type = 'Normal'
            new.save()
            newuser = Users.objects.get(username=new.username)
            NormalUser(Username=newuser, Name=name, ID_Type=idType, ID_Number=idNumber, Gender=gender, Contact=contact, Address=address, State=state, City=city, Subdivision=subdivision, District=district, Pin=pin, Image=pic).save()

            file = open('Registration_Success_Mail.html')
            mes = file.read()
            file.close()
            mes = mes.replace("myusername", username).replace("myemail", email).replace("mycontact", contact).replace("user", "Normal Registration")

            subject = 'Registration Successful'
            body = ''
            htmlMessage = mes
            sender = settings.EMAIL_HOST_USER
            receiver = [email, ]
            send_mail(subject=subject, message=None, from_email=sender, recipient_list=receiver,
                      fail_silently=False,
                      html_message=htmlMessage)

            context = {
                'error': "-0",
                "username": username,
            }
            return render(request, 'normalregistration.html', context)
        else:
            context = {
                "error": "5",
                "message1": formuser.errors,
            }
            return render(request, 'normalregistration.html', context)

    context = {
        "error": "0",
    }
    return render(request, 'normalregistration.html', context)


def Login(request):
    if request.method == 'POST':
        remember = request.POST.get('remember')
        username = request.POST.get('username')
        password = request.POST.get('password')
        next = request.POST.get('next')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            if user.is_verified:
                if user.is_active:
                    if remember is None:
                        request.session.set_expiry(0)
                    login(request, user)
                    data = {
                        "error": "0",
                        "next":next,
                    }
                    return JsonResponse(data)

                else:
                    message = 'Account is Deactive!'
                    data = {
                        "message": message,
                        "error": "1",
                    }
                    return JsonResponse(data)
            else:
                data = {
                    "not_verify": "1",
                    "message": "User is not verified still Now, We will verify your information."
                }
                return JsonResponse(data)

        else:
            messages = "Invalid Crediential"
            data = {
                "error": "1",
                "message": messages,
            }
            return JsonResponse(data)

    else:
        return render(request, 'login.html',)

def LoginMain(request):
    redirect_user_to = request.POST.get('tonext', '')
    if request.method == 'POST':
        remember = request.POST.get('remember')
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            if user.is_verified:
                if user.is_active:
                    if remember is None:
                        request.session.set_expiry(0)
                    login(request, user)
                    context = {
                        "error": "0",
                    }
                    if redirect_user_to == '':
                        return redirect(UserProfile)
                    else:
                        return redirect(redirect_user_to)


                else:
                    message = 'Account is Deactive!'
                    context = {
                        "message": message,
                        "error": "1",
                    }
                    return render(request, 'login.html', context)
            else:
                context = {
                    "not_verify": "1",
                    "message": "User is not verified still Now, We will verify your information."
                }
                return render(request, 'login.html', context)

        else:
            messages = "Invalid Crediential"
            context = {
                "error": "1",
                "message": messages,
            }
            return render(request, 'login.html', context)
    else:
        return render(request, 'login.html',)

def Logout(request):
    logout(request)
    return redirect(LoginMain)
