from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, HttpResponseNotFound
from django.http import HttpResponseRedirect, response, JsonResponse, StreamingHttpResponse
from django.views.decorators.http import require_http_methods, require_GET, require_safe, require_POST
from django.views.decorators.cache import cache_page
from django.core.cache import caches, cache
from django.core.cache.backends import locmem
from django.core.exceptions import *
from django.utils.cache import get_cache_key
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.core.paginator import Paginator
from django.contrib.auth.decorators import *
from django.core.files import File
from django.urls import reverse
from django.db import transaction
from django.contrib.sessions.models import Session
from django.template.loader import get_template
from django.views.decorators.csrf import csrf_exempt
import os
import math
from urllib.request import urlopen
from numerize import numerize
from django.db import connection
from email_validator import *
from django.db.models import *
from django.core.serializers import *
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models.expressions import RawSQL
import shutil
from django.db.models.expressions import F
from django_ratelimit.decorators import ratelimit
import django
import pytz
import time as t
import qrcode
import pyqrcode
import urllib.request
import urllib.parse
import png
from pyqrcode import QRCode
from mailjet_rest import Client as mailjet_client
import dropbox
import requests
import http.client
from dateutil import tz
from django.core import exceptions
from django.contrib.auth.hashers import check_password
import datetime
from django.utils import timezone as zonetime
from sendgrid.helpers.mail import Mail
from rest_framework.response import Response
from itertools import chain
from operator import attrgetter, truediv
from collections import OrderedDict
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from functools import reduce
import operator
import json, urllib, urllib3
from django.core.files.uploadedfile import SimpleUploadedFile, InMemoryUploadedFile
from rest_framework import generics
from django.db.models.query import QuerySet
from django.contrib.auth import update_session_auth_hash
import django.contrib.auth.password_validation
from django.contrib import messages
from django.views.generic.edit import CreateView
from django.contrib.auth.models import User
from django.contrib.auth import *
from django.contrib.auth.password_validation import *
import django.contrib.auth.password_validation as validators
from django.core.mail import EmailMessage, send_mail
from django.conf import settings
from twilio.rest import Client
from django import forms
import googlemaps
import smtplib
from django.db.models import Q
from django_eventstream import send_event, get_current_event_id
import django_filters
import secrets
import string
import random
import traceback
from .decorator.custom_decorator import *
from .serializers import *
from .validators import *
from .utils import *
from .forms import *
from .models import *
from .choice import *


class Hospital_Oxygen_Level(generics.ListCreateAPIView):
    queryset = Hospital.objects.all()
    serializer_class = HospitalPostSerializer
class Hospital_Oxygen_Level_details(generics.RetrieveUpdateDestroyAPIView):
    queryset = Hospital.objects.all()
    serializer_class = HospitalPostSerializer

@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def robotsText(request):
    f = open('robots.txt', 'r')
    file_content = f.read()
    f.close()
    return HttpResponse(file_content, content_type="text/plain")

@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def manifest(request):
    f = open('assets/static/javascripts/manifest.json', 'rb')
    file_content = f.read()
    f.close()
    return HttpResponse(file_content, content_type="application/manifest+json")

@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def serviceWorkerJs(request):
    f = open('assets/static/javascripts/service_worker/pwa-service-worker.js', 'rb')
    file_content = f.read()
    f.close()
    return HttpResponse(file_content, content_type="text/javascript; charset=utf-8")

@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def OneSignalSDKWorkerJs(request):
    f = open('assets/static/javascripts/Push_Notification/OneSignal/OneSignalSDKWorker.js', 'rb')
    file_content = f.read()
    f.close()
    return HttpResponse(file_content, content_type="text/javascript; charset=utf-8")

@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def OneSignalSDKUpdaterWorkerJs(request):
    f = open('assets/static/javascripts/Push_Notification/OneSignal/OneSignalSDKUpdaterWorker.js', 'rb')
    file_content = f.read()
    f.close()
    return HttpResponse(file_content, content_type="text/javascript; charset=utf-8")


@ratelimit(key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def rateLimitView(request, exception):
    return render(request, 'ratelimit.html', status=429)
    # return HttpResponse("<h1>You exceeded the rate limit. Try after some time.</h1>", status=429)



@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def getAddressFromCord(request):
    latitude = request.GET.get('latitude')
    longitude = request.GET.get('longitude')
    address = addressFromCord(latitude, longitude)
    if address != 0:
        data = {
            "success":"1",
            "pin":address['pin'],
            "state": address['state'],
            "city": address['city'],
            "division": address['division'],
            "district": address['district'],
            "districts": address['districts'],
            "districtcount": address['districtcount'],
        }
    else:
        data = {
            "success":"0"
        }
    return JsonResponse(data)

@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def LoadAddressFromPin(request):
    pin = request.GET.get('pin')
    response_data = addressFromPin(pin)
    return JsonResponse(response_data)


@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def LoadDistrict(request):
    state = request.GET.get('state')
    districts = getDistrict(state)
    response_data = {}
    response_data['districts'] = districts
    response_data['districtcount'] = len(districts)
    return JsonResponse(response_data)


@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def getAllDiseases(request):
    disease = request.GET.get('disease', '')
    kawags = {}
    if disease != '' and disease is not None:
        kawags['Disease'] = disease
    diseases = list(Disease.objects.filter(**kawags).values_list('Disease', flat=True))
    context = dict()
    context["diseases"] = diseases
    return JsonResponse(context)

@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def getHospitalsByName(request):
    name = request.GET.get('name')
    hospitals = list(Hospital.objects.filter(Username__is_verified=True, Username__is_active=True, Username__User_Type__contains=['Hospital'], Username__Registered=True).filter(Q(Name__icontains=name) | Q(Subdivision__icontains=name) | Q(City__icontains=name) | Q(State__Name__icontains=name) | Q(District__Name__icontains=name)).values('id', 'Name', 'State__Name', 'City', 'Subdivision', 'District__Name', 'Pin').order_by('Name'))
    context = dict()
    context["hospitals"] = hospitals
    return JsonResponse(context)


@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def getHospitalsByState(request):
    state = request.GET.get('state')
    district = request.GET.get('district', '')
    exclude_user = request.GET.get('exclude_user', False)
    kwargs = {}
    kwargs['State__Name'] = state
    if district != '':
        kwargs['District__Name'] = district
    hospitals = Hospital.objects.filter(Username__is_verified=True, Username__is_active=True, Username__User_Type__contains=['Hospital'], Username__Registered=True, **kwargs)
    if exclude_user:
        hospitals = hospitals.exclude(Username=request.user)
    hospitals = list(hospitals.order_by('Name', 'City', 'Subdivision', 'District__Name').values('id', 'Name', 'City', 'Subdivision', 'State__Name', 'District__Name', 'Pin'))
    response_data = {
        'hospitals': hospitals
    }
    return JsonResponse(response_data)
    

@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def getHospitalByCord(request):
    latitude = request.GET.get('latitude')
    longitude = request.GET.get('longitude')
    filter_value = {}
    filter_value['Latitude__lte'] = float(latitude) + 0.0353 # add 3km to latitude
    filter_value['Latitude__gte'] = float(latitude) - 0.0353 # subtract 3km to latitude
    filter_value['Longitude__lte'] = float(longitude) + 0.0270 # add 3km to longitude
    filter_value['Longitude__gte'] = float(longitude) - 0.0270 # subtract 3km to longitude
    response_data = {}
    hospitals = list(Hospital.objects.filter(Username__is_verified=True, Username__is_active=True, Username__User_Type__contains=['Hospital'], Username__Registered=True, **filter_value).values('id', 'Name'))
    response_data['hospitals'] = hospitals
    return JsonResponse(response_data)


@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def getBloodBanksByState(request):
    state = request.GET.get('state')
    district = request.GET.get('district', '')
    exclude_user = request.GET.get('exclude_user', False)
    kwargs = {}
    kwargs['State__Name'] = state
    if district != '':
        kwargs['District__Name'] = district
    bloodBanks = BloodBank.objects.filter(Username__is_verified=True, Username__is_active=True, Username__User_Type__contains=['Blood Bank'], Username__Registered=True, **kwargs)
    if exclude_user:
        bloodBanks = bloodBanks.exclude(Username=request.user)
    bloodBanks = list(bloodBanks.order_by('Name', 'City', 'Subdivision', 'District__Name').values('id', 'Name', 'City', 'Subdivision', 'State__Name', 'District__Name', 'Pin'))
    response_data = {
        'bloodBanks': bloodBanks
    }
    return JsonResponse(response_data)


@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def getCity(request):
    latitude = request.GET.get('latitude')
    longitude = request.GET.get('longitude')
    city = cityFromCord(latitude, longitude)
    response_data = {}
    if city != 'N/A':
        response_data['success'] = "1"
        response_data['city'] = city
    else:
        response_data['success'] = "0"
    return JsonResponse(response_data)



@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def bloodRequest(request):
    name = firstCharOfEachWordCapital(request.POST.get('name'))
    group = request.POST.get('group')
    unit = request.POST.get('unit')
    phone = request.POST.get('phone')
    hospital = request.POST.get('hospital')
    mobileOtp = request.POST.get('otp')
    otp = OTP.objects.filter(Mobile=phone, Is_Verified=False, Send_For='Blood Request')
    if otp.exists():
        otp = otp.first()
        if otp.MobileOTP == mobileOtp:
            hospital = Hospital.objects.get(id=hospital)
            BloodRequest.objects.create(Patient_Name=name, Blood_Group=group, Unit=unit, Contact=phone, Admit_Hospital=hospital, Username=request.user)
            donorsContacts = (list(Blood_Donar.objects.filter(Username__is_verified=True, Username__is_active=True, Username__User_Type__contains=['Blood Donor'], City=hospital.City).exclude(Username=request.user).values_list('Username__Contact', flat=True))).remove(phone)
            file = open('SMS_Templates/Blood_Request.txt')
            message = file.read()
            file.close()
            mes = message.replace("**patientName**", name).replace("**unit**", unit).replace("**bloodGroup**", group).replace("**hospitalName**", hospital.Name).replace("**hospitalCity**", hospital.City).replace("**contactNumber**", phone)
            newThreadSMS = sendSMS(numbers=donorsContacts, message=mes, template_id='1407166168695522496')
            newThreadSMS.start()

            notificationMessage = ""+name+" needs "+unit+" Units "+group+" blood at "+hospital.Name+", "+hospital.City+". Please help the patient by donating blood. Call "+phone+" to contact"
            usersList = list(Blood_Donar.objects.filter(Username__is_verified=True, Username__is_active=True, Username__User_Type__contains=['Blood Donor'], City=hospital.City).exclude(Username=request.user).values_list('Username__username', flat=True))
            title = "URGENT!! A patient needs blood in " + str(hospital.Name)
            targetURL = settings.SITE_URL + reverse("Go_Healthy_App:RequestedBlood") + "?city="+hospital.City+"&group="+group
            newThreadWebPush = sendWebPushNotification(notification_title=title, notification_message=notificationMessage, notification_topic="Need Blood", notification_target_url=targetURL, notification_image_url=settings.SITE_URL+"/static/Notification_images/donate_blood_notification.png", uids=usersList, tags=['blood_need'], action_title="Call", action_target_url="https://link2dial.com/+91"+phone, action_button_icon=settings.SITE_URL+"/static/Notification_images/notification_call_icon.png", action_Id="call_button")
            newThreadWebPush.start()
            OTP.objects.filter(Mobile=phone, Send_For='Blood Request').delete()
            response_data = {
                "success": "1"
            }
        else:
            response_data = {
                "error": "1"
            }
    else:
        response_data = {
            "error": "2"
        }
    return JsonResponse(response_data)

@require_http_methods(["GET", "POST"])
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def peopleVoice(request):
    if request.method == 'POST':
        language = request.POST.get('language')
        text = request.POST.get('text')
        hospital = request.POST.get('hospitalId', '')
        recaptcha_response = request.POST.get('g-recaptcha-response')
        data = {
            'secret': settings.GOOGLE_RECAPTCHA_SECRET_KEY,
            'response': recaptcha_response
        }
        r = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
        result = r.json()
        response_data = {}
        response_data['status'] = 'failed'
        if result['success']:
            language = Languages.objects.get(Language=language)
            if hospital != '' and hospital is not None:
                hospital = Hospital.objects.filter(id=hospital)
                if not hospital.exists():
                    response_data['status'] = 'not success'
                    return JsonResponse(response_data)
                else:
                    hospital = hospital.first()
            else:
                hospital = None
            PeopleVoice.objects.create(Text=text, hospital=hospital, Language=language)
            response_data['status'] = 'success'
            return JsonResponse(response_data)
        else:
            response_data['status'] = 'invalidCaptcha'
            return JsonResponse(response_data)
    else:
        voice = PeopleVoice.objects.filter(Is_Approved=True)
        context = {
            "voice": voice,
        }
        return render(request, 'peoplevoice.html', context)



@csrf_exempt
@require_POST
def updateOxygen(request):
    oxygenPressure = str(request.POST.get('Oxygen_Pressure'))  #in PSI
    oxygenFlow = str(request.POST.get('Oxygen_Flow'))  #in LPM
    tankConversionFactor = request.POST.get('Tank_Conversion_Factor')
    hospitalId = request.headers.get('Hospital_Id')
    token = request.headers.get('Auth_Key')
    invalid = False
    response_data = {}
    response_data["error"] = "1"
    response_data["success"] = ""
    response_data["message"] = ""
    mes = ''
    try:
        with transaction.atomic(durable=True):
            if request.headers.get("Content-Type") != "application/json; charset=utf-8":
                response_data["error"] = "010"
                response_data["success"] = False
                response_data["message"] = "Invalid content-type! Set content-type to 'application/json; charset=utf-8' in header."
                status = 400 # Bed Request
            else:
                hospital = Hospital.objects.filter(Unique_Id=hospitalId, Auth_Key=token)
                if hospital.exists():
                    if tankConversionFactor == "D" or tankConversionFactor == "d":
                        tankConversionFactor = 0.16
                    elif tankConversionFactor == "E" or tankConversionFactor == "e":
                        tankConversionFactor = 0.28
                    elif tankConversionFactor == "G" or tankConversionFactor == "g":
                        tankConversionFactor = 2.41
                    elif tankConversionFactor == "H" or tankConversionFactor == "h":
                        tankConversionFactor = 3.14
                    elif tankConversionFactor == "K" or tankConversionFactor == "k":
                        tankConversionFactor = 3.14
                    elif tankConversionFactor == "M" or tankConversionFactor == "m":
                        tankConversionFactor = 1.56
                    else:
                        invalid = True
                        mes = "Invalid Tank Conversion Factor."
                    if not oxygenPressure.isdecimal():
                        invalid = True
                        mes += "Field 'Oxygen_Pressure' must be in number format."
                    if not oxygenFlow.isdecimal():
                        invalid = True
                        mes += "Field 'Oxygen_Flow' must be in number format."
                    if invalid:
                        response_data["error"] = "003"
                        response_data["success"] = False
                        response_data["message"] = mes
                        status = 400 # Bed Request
                        
                    hos = hospital.first()
                    remaining_time = (int(oxygenPressure) * tankConversionFactor)/int(oxygenFlow) # Boyle's law (in minutes)
                    if not hos.Oxygen_Remaining_Time == remaining_time:
                        hos.Oxygen_Remaining_Time = remaining_time
                        hos.save()
                        response_data["error"] = "000"
                        response_data["message"] = "Data Updated"
                        status = 200 # OK
                    else:
                        response_data["error"] = "110"
                        response_data["message"] = "Data is same"
                        status = 304 # Not Modified
                    remain = hos.Oxygen_Remaining_Time
                    if(remain > 525600):
                        oxygenAvailable = "" + str(round(remain / 525600, 2)) + "Years"
                    elif(remain > 43200):
                        oxygenAvailable = "" + str(round(remain / 43800, 2)) + "Months"
                    elif(remain > 1440):
                        oxygenAvailable = "" + str(round(remain / 1440, 2)) + "Days"
                    elif(remain < 30):
                        oxygenAvailable = "No Oxygen"
                    elif(remain < 60):
                        oxygenAvailable = "" + str(round(remain, 2)) + "Minutes"
                    else:
                        oxygenAvailable = "" + str(remain // 60) + "Hr" + str(int(remain % 60)) + "Min"
                    response_data["success"] = True
                    response_data["oxygenAvailable"] = oxygenAvailable
                else:
                    response_data["error"] = "002"
                    response_data["success"] = True
                    response_data["message"] = "Authentication Failed"
                    status = 401 # Unauthorized
    except:
        response_data["error"] = "001"
        response_data["success"] = False
        response_data["message"] = "Server Error"
        status = 500 # Internal Server Error
    finally:
        return JsonResponse(response_data, status=status)

@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def Hospitals(request):
    action = request.GET.get('action', '')
    search = request.GET.get('Name', '')
    page = int(request.GET.get('page', '1'))
    
    last_id_1 = get_current_event_id(['nowBook-{}'.format(request.user.username)])
    last_id_2 = get_current_event_id(['liveBed'])

    if action == 'Name_Search':
        searchedHospital = list(Hospital.objects.filter(Username__is_verified=True, Username__is_active=True, Username__User_Type__contains=['Hospital'], Username__Registered=True, Name__icontains=search).order_by('Name').distinct('Name').values('Name'))
        data = {
            'hospitals': searchedHospital
        }
        return JsonResponse(data)
    elif action == 'Hospital_Search':
        total = 0
        count = 0
        try:
            sort = request.GET.get('sort', '')

            latitude = request.GET.get('latitude', '')
            longitude = request.GET.get('longitude', '')

            hospitalType = request.GET.get('hospitalType', '')
            hospitalOwnership = request.GET.get('hospitalOwnership', '')
            department = request.GET.get('department', 'General Medicine')
            if department == '':
                department = 'General Medicine'
            ward = request.GET.get('ward', '')
            wardWith = request.GET.get('wardWith', '')
            search = request.GET.get('Name', '')
            state_search = request.GET.get('State', '')
            district_search = request.GET.get('District', '')
            sub_search = request.GET.get('Subdivision', '')
            Pin = request.GET.get('Pin', '')
            City = request.GET.get('City', '')
            antivenom = request.GET.get('Antivenom_Availability', '')
            bedAvailability = request.GET.get('Bed_Availability', '')

            filter_value = {}
            if City != '' or district_search != '' or Pin != '' or state_search != '' or sub_search != '':
                latitude = ''
                longitude = ''
            elif latitude != '' and longitude != '':
                City = ''
                Pin = ''
                sub_search = ''
                state_search = ''
                district_search = ''
                filter_value['Latitude__lte'] = float(latitude) + 0.0353 # add 3km to latitude
                filter_value['Latitude__gte'] = float(latitude) - 0.0353 # subtract 3km to latitude
                filter_value['Longitude__lte'] = float(longitude) + 0.0270 # add 3km to longitude
                filter_value['Longitude__gte'] = float(longitude) - 0.0270 # subtract 3km to longitude
            else:
                latitude = ''
                longitude = ''

            if hospitalType != '':
                count += 1
            if department != '':
                count += 1
            if ward != '':
                count += 1
            if wardWith != '':
                count += 1
            if search != '':
                count += 1
            if state_search != '':
                count += 1
            if district_search != '':
                count += 1
            if sub_search != '':
                count += 1
            if Pin != '':
                count += 1
            if City != '':
                count += 1
            if antivenom != '':
                count += 1
            if bedAvailability != '':
                count += 1

            if state_search == 'All States & Union Territories':
                state_search = ''

            filter_value['Name__icontains'] = search
            filter_value['Type'] = hospitalType
            filter_value['Ownership'] = hospitalOwnership
            filter_value['State__Name'] = state_search
            filter_value['Subdivision__icontains'] = sub_search
            filter_value['District__Name'] = district_search
            filter_value['Pin'] = Pin
            filter_value['City__icontains'] = City
            filter_value['Has_Antivenom'] = antivenom
        
            kwargs = {}
            for k, v in filter_value.items():
                if v != '':
                    kwargs[k] = v
            obj = Hospital.objects.filter(Username__is_verified=True, Username__is_active=True, Username__User_Type__contains=['Hospital'], Username__Registered=True).filter(**kwargs)
            filter_value1 = {}
            if ward != '':
                filter_value1['Department__department'] = department
                filter_value1['Availability'] = 'Available'
                filter_value1['Ward'] = ward
                if wardWith != '' and wardWith != 'Both':
                    filter_value1['Support'] = wardWith
            elif bedAvailability == 'Available':
                filter_value1['Department__department'] = department
                filter_value1['Availability'] = 'Available'
            hospitalBeds = BedNo.objects.filter(Q(Hospital__in=obj) & ~Q(Availability="Null")).filter(**filter_value1).values_list('Hospital__id', flat=True)
            obj = obj.filter(id__in=hospitalBeds)

            if sort != '':
                obj = obj.order_by(sort)
            total = obj.count()
            
            p = Paginator(obj, 50) # 50 items on each page
            whichPage = p.page(page)
            obj = getBedsDataFromHospitalQuery(whichPage.object_list)            

            context = {
                'Hospitals': obj,
                'department': department,
                'totalPageItem': whichPage.object_list.count(),
                'total': total,
                'count':count,
                'is_login': request.user.is_authenticated,
                'pagination': {
                    'total_page': p.num_pages,
                    'current_page': page,
                }
            }
        except Exception as e:
            print(e)
            traceback.print_exc()
            obj = []
            total = 0
            context = {
                'Hospitals': obj,
                'totalPageItem': 0,
                'total': total,
                'count':count,
                'department': department,
                'is_login': request.user.is_authenticated,
            }
        return JsonResponse(context)
    else:
        context = {
            'types': Type_choice,
            'states': States.objects.all(),
            'ownerships': Ownership_choice,
            'wards': ward_ch,
            'departments': HospitalDepartment.objects.all(),
            'last_id_nowBook': last_id_1,
            'last_id_liveBed': last_id_2,
        }
        return render(request, 'hospital.html', context)
        

@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def hospitalPage(request, id):
    try:
        hospital = Hospital.objects.get(Unique_Id=id)
        context = {
            'hospital': hospital,
            'departments': HospitalDepartment.objects.all(),
        }
        return render(request, "hospitalpage.html", context)
    except BloodBank.DoesNotExist:
        return HttpResponseNotFound()


@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def Doctors(request):
    current_user = Users.objects.filter(username=request.user.username).first()
    action = request.GET.get('action', '')
    Name = request.GET.get('Name', '')
    if action == 'Name_Search':
        searchedDoctor = list(Doctor.upgrade_Not_Pending_objects.filter(Username__is_verified=True, Username__is_active=True, Username__User_Type__contains=['Doctor'], Name__icontains=Name).order_by('Name').distinct('Name').values('Name'))
        data = {
            'doctors': searchedDoctor
        }
        return JsonResponse(data)
    elif action == 'Doctor_Search':
        total = 0
        count = 0
        page_size = 50
        page_no = int(request.GET.get('page', '1'))
        isFirstLoad = request.GET.get('isFirstLoad')
        total_page = None
        try:
            sort = str(request.GET.get('sort', ''))
            Reg_no = request.GET.get('Registration_no', '')
            specialities = request.GET.getlist('specialities[]', '')
            state_search = request.GET.get('State', '')
            district_search = request.GET.get('District', '')
            sub_search = request.GET.get('Subdivision', '')
            Pin = request.GET.get('Pin', '')
            City = request.GET.get('City', '')

            start = (page_no-1)*page_size
            end = page_no*page_size

            if state_search != '':
                count += 1
            if district_search != '':
                count += 1
            if sub_search != '':
                count += 1
            if Pin != '':
                count += 1
            if City != '':
                count += 1
            count += len(specialities)

            filter_value = {}
            if state_search == 'All States & Union Territories':
                state_search = ''

            filter_value['Name__icontains'] = Name
            filter_value['Username__ID_Number'] = Reg_no
            if len(specialities) > 0:
                filter_value['Special__Speciality__in'] = specialities
            filter_value['State__Name'] = state_search
            filter_value['District__Name'] = district_search
            filter_value['Subdivision__icontains'] = sub_search
            filter_value['Pin'] = Pin
            filter_value['City__icontains'] = City
            filter_value['Username__is_verified'] = True
            filter_value['Username__is_active'] = True
            filter_value['Username__User_Type__contains'] = ['Doctor']
            kwargs = {}
            for k, v in filter_value.items():
                if v != '':
                    kwargs[k] = v

            obj = Doctor.upgrade_Not_Pending_objects.filter(**kwargs)
            total = obj.count()
            total_page = math.ceil(total / page_size)

            if sort != '':
                obj.order_by(sort)
    
            obj = obj[start:end]
            totalPageItem = obj.count()
            obj = list(obj.values("Name", "Username__ID_Number", "Username__Contact", "Username__display_profile_pic", "Gender", "Special__Speciality", "Degree__Degree", "Address", "State__Name", "City", "Subdivision", "District__Name", "Pin", "Image", "id", chat=F("Username__id")).annotate(user_rated=Avg('doctor_rating__Rate', filter=(Q(doctor_rating__Person=current_user))), total_votes=Count("doctor_rating"), total_rating=Sum("doctor_rating__Rate")))
        
            for item in obj:
                if item['Username__display_profile_pic'] == True:
                    item['Image'] = Doctor.objects.get(id=item['id']).Image.url

        except Exception as e:
            traceback.print_exc()
            obj = []
            total = 0
            totalPageItem = 0
            total_page = 0
        finally:
            context = {
                'request_user': request.user.username,
                'Doctors': obj,
                'total': total,
                'totalPageItem':totalPageItem,
                'count':count,
                'is_login': request.user.is_authenticated,
                'total_page': total_page,
            }
            return JsonResponse(context)
    else:
        context = {
            'special_list': Specialities.objects.all().exclude(Speciality='N/A').order_by('Speciality').distinct('Speciality'),
            'states': States.objects.all(),
        }
        return render(request, 'doctor.html', context)


@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def Blood(request):
    action = request.GET.get('action', '')
    search = request.GET.get('Name', '')
    if action == 'Name_Search':
        searchedDonor = list(Blood_Donar.objects.filter(Username__is_verified=True, Username__is_active=True, Username__User_Type__contains=['Blood Donor'], Name__icontains=search).order_by('Name').distinct('Name').values('Name'))
        data = {
            'donors': searchedDonor
        }
        return JsonResponse(data)
    elif action == 'Donor_Search':
        total = 0
        count = 0
        page_size = 50
        total_page = None
        page_no = int(request.GET.get('page', '1'))
        isFirstLoad = request.GET.get('isFirstLoad')
        try:
            sort = request.GET.get('sort', '')
            latitude = request.GET.get('latitude', '')
            longitude = request.GET.get('longitude', '')
            group = request.GET.getlist('groups[]')
            state_search = request.GET.get('State', '')
            district_search = request.GET.get('District', '')
            sub_search = request.GET.get('Subdivision', '')
            Pin = request.GET.get('Pin', '')
            City = request.GET.get('City', '')

            start = (page_no-1)*page_size
            end = page_no*page_size

            if state_search != '':
                count += 1
            if district_search != '':
                count += 1
            if sub_search != '':
                count += 1
            if Pin != '':
                count += 1
            if City != '':
                count += 1
            count += len(group)

            filter_value = {}
            if state_search == 'All States & Union Territories':
                state_search = ''

            filter_value['Name__icontains'] = search
            if len(group) > 0:
                filter_value['Blood_Group__in'] = group
            filter_value['State__Name'] = state_search
            filter_value['District__Name'] = district_search
            filter_value['Subdivision__icontains'] = sub_search
            filter_value['Pin'] = Pin
            filter_value['City__icontains'] = City
            filter_value['Username__is_verified'] = True
            filter_value['Username__is_active'] = True
            filter_value['Username__User_Type__contains'] = ['Blood Donor']
            kwargs = {}
            for k, v in filter_value.items():
                if v != '':
                    kwargs[k] = v

            obj = Blood_Donar.objects.filter(**kwargs)
            total = obj.count()
            total_page = math.ceil(total / page_size)

            if sort != '':
                obj.order_by(sort)
    
            obj = obj[start:end]
            totalPageItem = obj.count()
        
            obj = list(obj.values("id", "Name", "Username__Contact", "Username__display_profile_pic", "Gender", "Date_of_Birth", "Blood_Group", "Address", "State__Name", "City", "Subdivision", "District__Name", "Pin", "Image", chat=F("Username__id")).annotate(blood_donated=Count(('Username__user_bloodcertificate'))))
        
            for item in obj:
                if item['Username__display_profile_pic'] == True:
                    item['Image'] = Blood_Donar.objects.get(id=item['id']).Image.url

        except Exception as e:
            traceback.print_exc()
            obj = []
            total = 0
            totalPageItem = 0
            total_page = 0
        finally:
            context = {
                'request_user': request.user.username,
                'Donors': obj,
                'total': total,
                'totalPageItem': totalPageItem,
                'count':count,
                'is_login': request.user.is_authenticated,
                'total_page': total_page,
            }
            return JsonResponse(context)
    else:
        context = {
            'group': blood_groups,
            'states': States.objects.all(),
        }
        return render(request, 'blood_donor.html', context)

@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def BloodBankView(request):
    action = request.GET.get('action')
    search = request.GET.get('Name', '')
    if action == 'Name_Search':
        results = list(BloodBank.objects.filter(Username__is_verified=True, Username__is_active=True, Username__User_Type__contains=['Blood Bank'], Name__icontains=search).order_by('Name').distinct('Name').values('Name'))
        data = {
            'results': results,
        }
        return JsonResponse(data)
    elif action == 'filter':
        total = 0
        total_page = None
        try:
            page_size = 50
            page_no = int(request.GET.get('page', '1'))
            isFirstLoad = request.GET.get('isFirstLoad')

            latitude = request.GET.get('latitude', '')
            longitude = request.GET.get('longitude', '')
            sort = request.GET.get('Sort', '')
            groupField = request.GET.getlist('Groups[]')
            state_search = request.GET.get('State', '')
            district_search = request.GET.get('District', '')
            sub_search = request.GET.get('Subdivision', '')
            Pin = request.GET.get('Pin', '')
            City = request.GET.get('City', '')

            start = (page_no-1)*page_size
            end = page_no*page_size

            if City != '' or district_search != '' or Pin != '' or state_search != '' or sub_search != '':
                latitude = ''
                longitude = ''
            elif latitude != '' and longitude != '':
                City = ''
                Pin = ''
                sub_search = ''
                state_search = ''
                district_search = ''
                filter_value['Latitude__lte'] = float(latitude) + 0.0353 # add 3km to latitude
                filter_value['Latitude__gte'] = float(latitude) - 0.0353 # subtract 3km to latitude
                filter_value['Longitude__lte'] = float(longitude) + 0.0270 # add 3km to longitude
                filter_value['Longitude__gte'] = float(longitude) - 0.0270 # subtract 3km to longitude
            else:
                latitude = ''
                longitude = ''

            filter_value = {}
            if state_search == 'All States & Union Territories':
                state_search = ''

            filter_value['Name__icontains'] = search
            filter_value['State__Name'] = state_search
            filter_value['Subdivision__icontains'] = sub_search
            filter_value['District__Name'] = district_search
            filter_value['Pin'] = Pin
            filter_value['City__icontains'] = City
            filter_value['Username__is_verified'] = True
            filter_value['Username__is_active'] = True
            filter_value['Username__User_Type__contains'] = ['Blood Bank']
            if len(groupField) > 0:
                for i in groupField:
                    filter_value['Blood_Availability__'+i+'__gte'] = 1
            kwargs = {}
            for k, v in filter_value.items():
                if v != '':
                    kwargs[k] = v
         
            obj = BloodBank.objects.filter(**kwargs)
            total = obj.count()
            total_page = math.ceil(total / page_size)

            if sort != '':
                obj.order_by(sort)
    
            obj = obj[start:end]
            totalPageItem = obj.count()
            obj = obj.values("id", "Unique_Id", "Name", "Ownership", "Emergency_Number", 'Toll_Free_Number', 'Helpline_Number', 'Contacts', "Username__email", "Address", "State__Name", "City", "Subdivision", "District__Name", "Pin", "Blood_Availability", "Website", "Latitude", "Longitude", "Last_Update")
            if totalPageItem < page_size:
                isLast = True
            else:
                isLast = False
        except Exception as e:
            print(e)
            traceback.print_exc()
            obj = []
            total = 0
            totalPageItem = 0
            total_page = 0
            isLast = False
        finally:
            data = {
                'total': total,
                'bloodBanks': list(obj),
                'totalPageItem': totalPageItem,
                'total_page': total_page,
                'isLast': isLast,
            }
            return JsonResponse(data)
    else:
        context = {
            'bloodGroupsFields': group_fields_ch,
            'states': States.objects.all(),
        }
        return render(request, 'bloodbank.html', context)


@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def bloodBankPage(request, id):
    try:
        bank = BloodBank.objects.get(Unique_Id=id)
        context = {
            'bank': bank,
        }
        return render(request, "bloodbankpage.html", context)
    except BloodBank.DoesNotExist:
        return HttpResponseNotFound()



@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def requestedBlood(request):
    page_size = 50
    action = request.GET.get('action')
    if action == 'filter':
        city = request.GET.get('city', '')
        group = request.GET.get('group', '')
        page_no = int(request.GET.get("page", "1"))
        start = (page_no-1)*page_size
        end = page_no*page_size
        filter_value = {}
        filter_value['Blood_Group'] = group
        filter_value['Admit_Hospital__City__icontains'] = city
        kwargs = {}
        for k, v in filter_value.items():
            if v != '':
                kwargs[k] = v
        bloodRequests = BloodRequest.past_few_days_objects.filter(**kwargs)[start:end].values("Patient_Name", "Blood_Group", "Unit", "Contact", "Admit_Hospital__Name", "Admit_Hospital__City", "Admit_Hospital__State__Name", "Requested_at")
        if bloodRequests.count() <= 0:
            noResults = True
        else:
            noResults = False
        total = bloodRequests.count()
        if total < page_size:
            isLast = True
        else:
            isLast = False
        data = {
            "bloodRequests": list(bloodRequests),
            "noResults": noResults,
            'isLast': isLast,
        }
        return JsonResponse(data)
    else:
        context = {
            'bloodGroups': blood_groups,
        }
        return render(request, 'bloodrequests.html', context)


@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def bloodDonationCamp(request):
    page_size = 50
    action = request.GET.get('action')
    search = request.GET.get('Name', '')
    if action == 'Name_Search':
        results = list(BloodDonationCamp.current_and_future_objects.filter(Organizer__icontains=search).order_by('Organizer').distinct('Organizer').values('Organizer'))
        data = {
            'results': results,
        }
        return JsonResponse(data)
    elif action == 'filter':
        total = 0
        total_page = None
        try:
            page_size = 50
            page_no = int(request.GET.get('page', '1'))
            isFirstLoad = request.GET.get('isFirstLoad')

            latitude = request.GET.get('latitude', '')
            longitude = request.GET.get('longitude', '')
            date = request.GET.get('Date', '')
            state_search = request.GET.get('State', '')
            district_search = request.GET.get('District', '')
            sub_search = request.GET.get('Subdivision', '')
            Pin = request.GET.get('Pin', '')
            City = request.GET.get('City', '')

            start = (page_no-1)*page_size
            end = page_no*page_size

            filter_value = {}
            if City != '' or district_search != '' or Pin != '' or state_search != '' or sub_search != '':
                latitude = ''
                longitude = ''
            elif latitude != '' and longitude != '':
                City = cityFromCord(latitude, longitude)
                Pin = ''
                sub_search = ''
                state_search = ''
                district_search = ''
            else:
                latitude = ''
                longitude = ''
            if state_search == 'All States & Union Territories':
                state_search = ''

            filter_value['Organizer__icontains'] = search
            filter_value['State__Name'] = state_search
            filter_value['Subdivision__icontains'] = sub_search
            filter_value['District__Name'] = district_search
            filter_value['Pin'] = Pin
            filter_value['City__icontains'] = City
            # if date != '':
            #     filter_value['Start_Date__lte'] = date
            #     filter_value['End_Date__gte'] = date
         
            kwargs = {}
            for k, v in filter_value.items():
                if v != '':
                    kwargs[k] = v
         
            obj = BloodDonationCamp.current_and_future_objects.filter(**kwargs)
            if date != '':
                obj = obj.filter(Q(Start_Date=date, End_Date=None) | Q(Start_Date__lte=date, End_Date__gte=date))
            total = obj.count()
            total_page = math.ceil(total / page_size)
                
            obj = obj[start:end]
            totalPageItem = obj.count()
            obj = obj.values("camp_id", "Organizer", "Organizer_Contact", "Email", "Organizer_Website", "State__Name", "City", "Subdivision", "District__Name", "Pin", "Landmark", "Start_Date", "End_Date", "Start_Time", "End_Time")
            if totalPageItem < page_size:
                isLast = True
            else:
                isLast = False
        except Exception as e:
            print(e)
            obj = []
            total = 0
            totalPageItem = 0
            total_page = 0
            isLast = False
        finally:
            data = {
                'total': total,
                'donationCamps': list(obj),
                'totalPageItem': totalPageItem,
                'total_page': total_page,
                'isLast': isLast,
            }
            return JsonResponse(data)
    context = {
        'states':States.objects.all(),
    }
    return render(request, 'blooddonationcamps.html',context)


@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def EmergencyNumber(request):
    page_size = 50
    action = request.GET.get('action')
    page_no = int(request.GET.get('page', '1'))
    state = request.GET.get('state', '')
    district = request.GET.get('district', '')
    subdivision = request.GET.get('subdivision', '')
    office = request.GET.get('office', '')

    if action == 'Search' or action == 'Name_Search':

        start = (page_no-1)*page_size
        end = page_no*page_size

        filter_value = {}

        if state == 'All States & Union Territories':
            state = ''

        filter_value['State__Name'] = state
        filter_value['District__Name'] = district
        filter_value['Subdivision'] = subdivision
        filter_value['Office__icontains'] = office
        kwargs = {}
        for k, v in filter_value.items():
            if v != '':
                kwargs[k] = v
        if action == 'Search':
            emergency = (Emergency_Number.objects.filter(**kwargs)[start:end].values("id", "Office", "Title", "Person", "Person_Designation", "State__Name", "District__Name", "Subdivision", "Contact"))
            total = emergency.count()
            if total < page_size:
                isLast = True
            else:
                isLast = False
            data = {
                'emergencies': list(emergency),
                'total': total,
                'isLast':isLast,
            }
        elif action == 'Name_Search':
            emergency = list(Emergency_Number.objects.filter(**kwargs).order_by('Office', 'Subdivision').distinct('Office', 'Subdivision').values("Office", "Subdivision", "District__Name", "State__Name"))
            data = {
                'emergencies': emergency
            }
        return JsonResponse(data)
    else:
        context = {
            'states':States.objects.all(),
        }
        return render(request, 'emergency.html',context)
        
    

@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def OTPSendBloodDonationCampRegister(request):
    contact = request.POST.get('contact', '')
    response_data = {}
    response_data['error'] = "1"
    if request.method == 'POST':
        if contact != '':
            mobileOTP = generateOTP(6)
            OTP.objects.filter(Mobile=contact, Send_For='Blood Donation Camp Registration').delete()
            OTP.objects.create(Mobile=contact, MobileOTP=mobileOTP, Is_Verified=False, Send_For='Blood Donation Camp Registration')
            file = open('SMS_Templates/Blood_Donation_Camp_Register_OTP.txt')
            mes = file.read()
            file.close()
            mes = mes.replace("**yourOTP**", mobileOTP)
            newThreadSMS = sendSMS(numbers=[contact, ], message=mes, template_id='1407166168668227156')
            newThreadSMS.start()
            response_data['error'] = "0"
        else:
            response_data['error'] = "1"
        response_data['contact'] = contact
    return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def OTPVerifyBloodDonationCampRegister(request):
    enteredOTP = request.POST.get('otp', '')
    contact = request.POST.get('contact', '')
    response_data = {}
    if request.method == 'POST':
        if len(enteredOTP) != 6:
            response_data['error'] = "1"
            response_data['message'] = "Please enter 6 digit OTP"
        elif OTP.objects.filter(Mobile=contact, MobileOTP=enteredOTP, Is_Verified=False, Send_For='Blood Donation Camp Registration').exists():
            otp = OTP.objects.get(Mobile=contact, MobileOTP=enteredOTP, Is_Verified=False, Send_For='Blood Donation Camp Registration')
            otp.Is_Verified = True
            otp.save()
            response_data['error'] = "0"
        else:
            response_data['error'] = "1"
            response_data['message'] = "Invalid OTP!"
        return JsonResponse(response_data)


@require_http_methods(["GET", "POST"])
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def bloodDonationCampRegistration(request):
    if request.method == 'POST':
        Organization = firstCharOfEachWordCapital(request.POST.get('Organization'))
        Contact = request.POST.get('Contact')
        Email = request.POST.get('Email').lower()
        Website = request.POST.get('Website', None)
        State = request.POST.get('State')
        District = request.POST.get('District')
        City = firstCharOfEachWordCapital(request.POST.get('City'))
        Subdivision = firstCharOfEachWordCapital(request.POST.get('Subdivision'))
        Pin = request.POST.get('Pin')
        Landmark = request.POST.get('Landmark')
        Start_Date = request.POST.get('Start_Date')
        End_Date = request.POST.get('End_Date', '')
        From = request.POST.get('From')
        To = request.POST.get('To')
        otp = request.POST.get('OTP')
        response_data = {}

        today = datetime.datetime.now()
        startDate = parser.parse(Start_Date+" "+From)
        startDateNotOld = (startDate - today) > datetime.timedelta(minutes=15)

        fromTime = From.split(":")
        fromTime = datetime.time(int(fromTime[0]), int(fromTime[1]))
        toTime = To.split(":")
        toTime = datetime.time(int(toTime[0]), int(toTime[1]))
        timeDiff = datetime.datetime.combine(datetime.date.today(), toTime) - datetime.datetime.combine(datetime.date.today(), fromTime)
        hasDiffBetweenStartTimeandEndTime = timeDiff >= datetime.timedelta(minutes=30)

        endDateNotBefore = True
        if End_Date != '':
            startDate = Start_Date.split("-")
            startDate = datetime.date(int(startDate[0]), int(startDate[1]), int(startDate[2]))
            endDate = End_Date.split("-")
            endDate = datetime.date(int(endDate[0]), int(endDate[1]), int(endDate[2]))
            endDateNotBefore = (endDate - startDate) >= datetime.timedelta(days=1)

        try:
            if startDateNotOld and hasDiffBetweenStartTimeandEndTime and endDateNotBefore:
                if OTP.objects.filter(Mobile=Contact, MobileOTP=otp, Is_Verified=True, Send_For='Blood Donation Camp Registration').exists():
                    State = States.objects.get(Name=State)
                    District = Districts.objects.get(Name=District, state=State)
                    extraFields = {}
                    with transaction.atomic(durable=True):
                        if End_Date != '':
                            extraFields['End_Date'] = End_Date
                        donationCamp = BloodDonationCamp.objects.create(Organizer=Organization, Organizer_Contact=Contact, Email=Email, Organizer_Website=Website, State=State, City=City, Subdivision=Subdivision, District=District, Pin=Pin, Landmark=Landmark, Start_Date=Start_Date, Start_Time=From, End_Time=To, **extraFields)
                        response_data = {
                            'error': '0',
                            'message': 'Event Successfully created',
                        }
                        def runAfterSuccess():
                            try:
                                normalUserContact = list(NormalUser.objects.filter(Username__is_verified=True, Username__is_active=True, State=State, District=District, Subdivision=Subdivision).values_list('Username__Contact', flat=True))
                                donorUserContact = list(Blood_Donar.objects.filter(Username__is_verified=True, Username__is_active=True, State=State, District=District, Subdivision=Subdivision).values_list('Username__Contact', flat=True))
                                doctorUserContact = list(Doctor.upgrade_Not_Pending_objects.filter(Username__is_verified=True, Username__is_active=True, State=State, District=District, Subdivision=Subdivision).values_list('Username__Contact', flat=True))
                                usersContact = normalUserContact + donorUserContact + doctorUserContact
                                usersContact = list(OrderedDict.fromkeys(usersContact)) # remove duplicate items
                                file = open('SMS_Templates/Blood_Donation_Camp_Event.txt')
                                message = file.read()
                                file.close()
                                targetURL = settings.SITE_URL + reverse("Go_Healthy_App:BloodDonationCampDetail", kwargs={'id': donationCamp.camp_id})
                                shortedTargetUrl = shortUrl(destination=targetURL, title="Blood Donation Camp Details")
                                shortedOrganizerWebsite = 'Not Provided'
                                if Website is not None:
                                    shortedOrganizerWebsite = shortUrl(destination=Website, title="Blood Donation Camp's Organizer's Website")
                                if End_Date == None:
                                    date = Start_Date
                                else:
                                    date = str(Start_Date)+" To "+str(End_Date)
                                time = str(From)+" To "+str(To)
                                mes = message.replace("**Organizer**", Organization).replace("**State**", State.Name).replace("**District**", District.Name).replace("**Subdivision**", Subdivision).replace("**City**", City).replace("**Landmark**", Landmark).replace("**Pin**", Pin).replace("**Date**", date).replace("**Time**", time).replace("**Contact**", Contact).replace("**Website**", shortedOrganizerWebsite).replace('**Event_Link**', shortedTargetUrl)

                                newThreadSMS = sendSMS(numbers=usersContact, message=mes, template_id='1407166179835350197')
                                newThreadSMS.start()

                                notificationMessage = "A Blood donation camp will be organized in your city.\nOrganizer: "+Organization+"\n Contact: "+Contact+"\nVENUE:\nState: "+State.Name+"\nDistrict: "+District.Name+"\nSubdivision: "+Subdivision+"\nCity: "+City+"\nLandmark: "+Landmark+"\n\nDATE and TIME:\nDate: "+date+"\nTime: "+time+"\n\nWe requesting you to attend the blood donation camp to donate blood to save life of someone."
                                normalUser = list(NormalUser.objects.filter(Username__is_verified=True, Username__is_active=True, State=State, District=District, Subdivision=Subdivision).values_list('Username__username', flat=True))
                                donorUser = list(Blood_Donar.objects.filter(Username__is_verified=True, Username__is_active=True, State=State, District=District, Subdivision=Subdivision).values_list('Username__username', flat=True))
                                doctorUser = list(Doctor.upgrade_Not_Pending_objects.filter(Username__is_verified=True, Username__is_active=True, State=State, District=District, Subdivision=Subdivision).values_list('Username__username', flat=True))
                                usersList = normalUser + donorUser + doctorUser
                                usersList = list(OrderedDict.fromkeys(usersList)) # remove duplicate items
                                title = "A Blood Donation Camp will be organized in your city"
                                newThreadWebPush = sendWebPushNotification(notification_title=title, notification_message=notificationMessage, notification_topic="Blood Donation Camp", notification_target_url=targetURL, uids=usersList, tags=['blood_donation_camp'])
                                newThreadWebPush.start()
                            except Exception as e:
                                print(e)
                            finally:
                                OTP.objects.filter(Mobile=Contact, Send_For='Blood Donation Camp Registration').delete()
                        transaction.on_commit(runAfterSuccess)
                else:
                    response_data = {
                        'error': '2',
                        'message': 'OTP not verified',
                    }
            else:
                response_data = {
                'error': '1',
                'message': 'Event date or time is not valid!',
            }
        except Exception as e:
            traceback.print_exc()
            print(e)
            response_data = {
                'error': '1',
                'message': 'Error occurred. Try again!',
            }
        finally:
            return JsonResponse(response_data)
    else:
        return render(request, 'blooddonationcampregistration.html')


@require_http_methods(["GET", "POST"])
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def bloodDonationCampEdit(request):
    if request.method == 'POST':
        campId = request.POST.get('id')
        Email = request.POST.get('Email').lower()
        Website = request.POST.get('Website', None)
        State = request.POST.get('State')
        District = request.POST.get('District')
        City = firstCharOfEachWordCapital(request.POST.get('City'))
        Subdivision = firstCharOfEachWordCapital(request.POST.get('Subdivision'))
        Pin = request.POST.get('Pin')
        Landmark = request.POST.get('Landmark')
        Start_Date = request.POST.get('Start_Date')
        End_Date = request.POST.get('End_Date')
        From = request.POST.get('From')
        To = request.POST.get('To')
        otp = request.POST.get('otp')
        response_data = {}

        today = datetime.datetime.now()
        startDate = parser.parse(Start_Date+" "+From)
        startDateNotOld = (startDate - today) > datetime.timedelta(minutes=15)

        fromTime = From.split(":")
        fromTime = datetime.time(int(fromTime[0]), int(fromTime[1]))
        toTime = To.split(":")
        toTime = datetime.time(int(toTime[0]), int(toTime[1]))
        timeDiff = datetime.datetime.combine(datetime.date.today(), toTime) - datetime.datetime.combine(datetime.date.today(), fromTime)
        hasDiffBetweenStartTimeandEndTime = timeDiff >= datetime.timedelta(minutes=30)

        endDateNotBefore = True
        if End_Date != '':
            startDate = Start_Date.split("-")
            startDate = datetime.date(int(startDate[0]), int(startDate[1]), int(startDate[2]))
            endDate = End_Date.split("-")
            endDate = datetime.date(int(endDate[0]), int(endDate[1]), int(endDate[2]))
            endDateNotBefore = (endDate - startDate) >= datetime.timedelta(days=1)

        try:
            if startDateNotOld and hasDiffBetweenStartTimeandEndTime and endDateNotBefore:
                donationCamp = BloodDonationCamp.incoming_objects.get(camp_id=campId)
                if OTP.objects.filter(Mobile=donationCamp.Organizer_Contact, MobileOTP=otp, Is_Verified=True, Send_For='Blood Donation Camp Edit').exists():
                    State = States.objects.get(Name=State)
                    District = Districts.objects.get(Name=District, state=State)
                    with transaction.atomic(durable=True):
                        extraFields = {}
                        if End_Date != '':
                            extraFields['End_Date'] = End_Date
                        BloodDonationCamp.incoming_objects.filter(camp_id=campId).update(Email=Email, Organizer_Website=Website, State=State, City=City, Subdivision=Subdivision, District=District, Pin=Pin, Landmark=Landmark, Start_Date=Start_Date, Start_Time=From, End_Time=To, **extraFields)
                        BloodDonationCamp.objects.get(camp_id=campId).save()
                        response_data = {
                            'error': '0',
                            'message': 'Event Changed',
                        }
                        def runAfterSuccess():
                            try:
                                reminders_mobile = list(donationCamp.camp_reminders.all().values_list('Mobile', flat=True))
                                reminders_mobile = list(OrderedDict.fromkeys(reminders_mobile))
                                file = open('SMS_Templates/Blood_Donation_Camp_Event_Changed.txt')
                                message = file.read()
                                file.close()
                            
                                targetURL = settings.SITE_URL + reverse("Go_Healthy_App:BloodDonationCampDetail", kwargs={'id': donationCamp.camp_id})
                                shortedTargetUrl = shortUrl(destination=targetURL, title="Blood Donation Camp Details")
                                shortedOrganizerUrl = 'Not Provided'
                                if Website is not None:
                                    shortedOrganizerUrl = shortUrl(destination=Website, title="Blood Donation Camp's Organizer's Website")
                                if End_Date == None:
                                    date = Start_Date
                                else:
                                    date = str(Start_Date)+" To "+str(End_Date)
                                time = str(From)+" To "+str(To)

                                mes = message.replace("**Organizer**", donationCamp.Organizer).replace("**State**", State.Name).replace("**District**", District.Name).replace("**Subdivision**", Subdivision).replace("**City**", City).replace("**Landmark**", Landmark).replace("**Pin**", Pin).replace("**Date**", date).replace("**Time**", time).replace("**Contact**", donationCamp.Organizer_Contact).replace("**Website**", shortedOrganizerUrl).replace('**Event_Link**', shortedTargetUrl)

                                newThreadSMS = sendSMS(numbers=reminders_mobile, message=mes, template_id='')
                                newThreadSMS.start()

                                notificationMessage = "You have set a reminder for this blood donation camp. But organizer changed the event details, check the updated details:\nOrganizer: "+donationCamp.Organizer+"\nContact: "+donationCamp.Organizer_Contact+"\nVENUE:\nState: "+State.Name+"\nDistrict: "+District.Name+"\nSubdivision: "+Subdivision+"\nCity: "+City+"\nLandmark: "+Landmark+"\n\nDATE and TIME:\nDate: "+date+"\nTime: "+time+"\n\nWe requesting you to attend the blood donation camp to donate blood to save life of someone."
                                reminders_user = list(donationCamp.camp_reminders.all().values_list('Username__username', flat=True))
                                reminders_user = list(OrderedDict.fromkeys(reminders_user))
                                title = "Blood Donation Camp Changed"
                                newThreadWebPush = sendWebPushNotification(notification_title=title, notification_message=notificationMessage, notification_topic="Blood Donation Camp", notification_target_url=targetURL, uids=reminders_user, tags=['blood_donation_camp'])
                                newThreadWebPush.start()
                            except Exception as e:
                                print(e)
                            finally:
                                OTP.objects.filter(Mobile=donationCamp.Organizer_Contact, Send_For='Blood Donation Camp Edit').delete()
                        transaction.on_commit(runAfterSuccess)
                else:
                    response_data = {
                        'error': '2',
                        'message': 'OTP not verified',
                    }
            else:
                response_data = {
                'error': '1',
                'message': 'Event date or time is not valid!',
            }
        except Exception as e:
            traceback.print_exc()
            print(e)
            response_data = {
                'error': '1',
                'message': 'Error occurred. Try again!',
            }
        finally:
            return JsonResponse(response_data)
    else:
        return render(request, 'blooddonationcampedit.html')


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def cancelBloodDonationCamp(request):
    campId = request.POST.get('id')
    otp = request.POST.get('otp')
    response_data = {}
    try:
        donationCamp = BloodDonationCamp.incoming_objects.get(camp_id=campId)
        if OTP.objects.filter(Mobile=donationCamp.Organizer_Contact, MobileOTP=otp, Is_Verified=True, Send_For='Blood Donation Camp Edit').exists():
            with transaction.atomic(durable=True):
                reminders_mobile = list(donationCamp.camp_reminders.all().values_list('Mobile', flat=True))
                reminders_mobile = list(OrderedDict.fromkeys(reminders_mobile))
                if donationCamp.End_Date == None:
                    date = donationCamp.Start_Date
                else:
                    date = str(donationCamp.Start_Date)+" To "+str(donationCamp.End_Date)
                time = str(donationCamp.Start_Time)+" To "+str(donationCamp.End_Time)
                file = open('SMS_Templates/Blood_Donation_Camp_Event_Canceled.txt')
                message = file.read()
                file.close()
                organizerWebsite = donationCamp.Organizer_Website
                shortedUrl = 'Not Provided'
                if organizerWebsite is not None:
                    shortedUrl = shortUrl(destination=organizerWebsite, title="Blood Donation Camp's Organizer's Website")
                smsMessage = message.replace("**Organizer**", donationCamp.Organizer).replace("**State**", donationCamp.State.Name).replace("**District**", donationCamp.District.Name).replace("**Subdivision**", donationCamp.Subdivision).replace("**City**", donationCamp.City).replace("**Landmark**", donationCamp.Landmark).replace("**Pin**", donationCamp.Pin).replace("**Date**", date).replace("**Time**", time).replace("**Contact**", donationCamp.Organizer_Contact).replace("**Website**", shortedUrl)
                
                reminders_user = list(donationCamp.camp_reminders.all().values_list('Username__username', flat=True))
                reminders_user = list(OrderedDict.fromkeys(reminders_user))
                targetURL = settings.SITE_URL + reverse("Go_Healthy_App:BloodDonationCampDetail", kwargs={'id': donationCamp.camp_id})
                title = "Blood Donation Camp Postponed"
                notificationMessage = "You have set a reminder for this blood donation camp. But the organizer ("+donationCamp.Organizer+") postponed the event. The event details are: Contact: "+donationCamp.Organizer_Contact+"\nVENUE:\nState: "+donationCamp.State.Name+"\nDistrict: "+donationCamp.District.Name+"\nSubdivision: "+donationCamp.Subdivision+"\nCity: "+donationCamp.City+"\nLandmark: "+donationCamp.Landmark+"\n\nDATE and TIME:\nDate: "+date+"\nTime: "+time+"\nOrganizer may announce the new venue, date and time later."
                
                BloodDonationCamp.incoming_objects.filter(camp_id=campId).delete()
                response_data = {
                    'error': '0',
                    'message': 'Event Postponed',
                }
                def runAfterSuccess():
                    try:
                        newThreadSMS = sendSMS(numbers=reminders_mobile, message=smsMessage, template_id='')
                        newThreadSMS.start()

                        newThreadWebPush = sendWebPushNotification(notification_title=title, notification_message=notificationMessage, notification_topic="Blood Donation Camp Postponed", notification_target_url=targetURL, uids=reminders_user, tags=['blood_donation_camp'])
                        newThreadWebPush.start()
                    except Exception as e:
                        print(e)
                        traceback.print_exc()
                    finally:
                        OTP.objects.filter(Mobile=donationCamp.Organizer_Contact, Send_For='Blood Donation Camp Edit').delete()
                transaction.on_commit(runAfterSuccess)
    except Exception as e:
            traceback.print_exc()
            print(e)
            response_data = {
                'error': '1',
                'message': 'Error occurred. Try again!',
            }
    finally:
        return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def OTPSendBloodDonationCampEdit(request):
    contact = request.POST.get('contact', '')
    response_data = {}
    response_data['error'] = "1"
    if request.method == 'POST':
        if contact != '':
            mobileOTP = generateOTP(6)
            OTP.objects.filter(Mobile=contact, Send_For='Blood Donation Camp Edit').delete()
            OTP.objects.create(Mobile=contact, MobileOTP=mobileOTP, Is_Verified=False, Send_For='Blood Donation Camp Edit')
            file = open('SMS_Templates/Blood_Donation_Camp_Edit_OTP.txt')
            mes = file.read()
            file.close()
            mes = mes.replace("**yourOTP**", mobileOTP)
            newThreadSMS = sendSMS(numbers=[contact, ], message=mes, template_id='')
            newThreadSMS.start()
            response_data['error'] = "0"
        else:
            response_data['error'] = "1"
        response_data['contact'] = contact
    return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def OTPVerifyBloodDonationCampEdit(request):
    enteredOTP = request.POST.get('otp', '')
    contact = request.POST.get('contact', '')
    response_data = {}
    if request.method == 'POST':
        if len(enteredOTP) != 6:
            response_data['error'] = "1"
            response_data['message'] = "Please enter 6 digit OTP"
        elif OTP.objects.filter(Mobile=contact, MobileOTP=enteredOTP, Is_Verified=False, Send_For='Blood Donation Camp Edit').exists():
            otp = OTP.objects.get(Mobile=contact, MobileOTP=enteredOTP, Is_Verified=False, Send_For='Blood Donation Camp Edit')
            otp.Is_Verified = True
            otp.save()
            response_data['error'] = "0"
        else:
            response_data['error'] = "1"
            response_data['message'] = "Invalid OTP!"
        return JsonResponse(response_data)



@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def getRegisteredBloodDonoationCamps(request):
    contact = request.POST.get('contact')
    otp = request.POST.get('otp')
    if OTP.objects.filter(Mobile=contact, MobileOTP=otp, Is_Verified=True, Send_For='Blood Donation Camp Edit').exists():
        registeredCamps = list(BloodDonationCamp.incoming_objects.filter(Organizer_Contact=contact).values('camp_id', 'Organizer', 'Email', 'Landmark', 'Start_Date', 'End_Date', 'Start_Time', 'End_Time'))
        response_data = {
            'registeredCamps': registeredCamps,
            'verified': True,
        }
        return JsonResponse(response_data)
    else:
        response_data = {
            'Verified': False,
        }
        return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def getBloodDonationCampData(request):
    campId = request.POST.get('id')
    donationCamp = BloodDonationCamp.objects.get(camp_id=campId)
    if OTP.objects.filter(Mobile=donationCamp.Organizer_Contact, Is_Verified=True, Send_For='Blood Donation Camp Edit').exists():
        camp = list(BloodDonationCamp.objects.filter(camp_id=campId).values('camp_id', 'Organizer', 'Organizer_Contact', 'Email', 'Organizer_Website', 'State__Name', 'City', 'Subdivision', 'District__Name', 'Pin', 'Landmark', 'Start_Date', 'End_Date', 'Start_Time', 'End_Time'))
        response_data = {
            'camp': camp
        }
        return JsonResponse(response_data)


@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def bloodDonationCampDetail(request, id):
    if BloodDonationCamp.objects.filter(camp_id=id).exists():
        camp = BloodDonationCamp.objects.get(camp_id=id)
        context = {
            'camp': camp,
        }
        return render(request, 'blooddonationcampdetail.html', context)
    else:
        context = {
            'notFound': True,
        }
        return render(request, 'blooddonationcampdetail.html', context)


@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def setBloodDonationCampReminder(request):
    contact = request.POST.get('reminder_mobile')
    hh = int(request.POST.get('reminder_hh', '00'))
    mm = int(request.POST.get('reminder_mm', '30'))
    send_before = ((hh*60)+mm)
    event_id = request.POST.get('reminder_event')
    Camp = BloodDonationCamp.incoming_objects.get(camp_id=event_id)
    start_date = Camp.Start_Date
    start_time = Camp.Start_Time

    current_time = datetime.datetime.now()
    reminder_time = parser.parse(str(start_date)+" "+str(start_time)) - datetime.timedelta(minutes=send_before)
    isReminderSetEarlier = (reminder_time - current_time) <= datetime.timedelta(minutes=5)
    if not isReminderSetEarlier:
        CampReminder.objects.create(Camp=Camp, Mobile=contact, Send_Before_in_minute=send_before)
        send_before_text = ''
        if hh > 0 and mm > 0:
            send_before_text = str(hh)+" hours "+str(mm)+" minutes"
        elif hh > 0:
            send_before_text = str(hh)+" hours "
        elif mm > 0:
            send_before_text = str(mm)+" minutes"
        response_data = {
            'error': '0',
            'send_before_minute': send_before,
            'message': "Thanks. We will send you a reminder "+str(send_before_text)+" before the start of the event."
        }
    else:
        response_data = {
            'error': '1',
            'send_before_minute': send_before,
            'message': "Reminder can't be set Before the current time!"
        }
    return JsonResponse(response_data)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def addRating(request):
    try:
        with transaction.atomic(durable=True):
            doctorId = request.POST.get('doctor')
            star = int(request.POST.get('star'))
            doctor = Doctor.upgrade_Not_Pending_objects.get(id=doctorId)
            d = DoctorRatingRecord.objects.filter(Doctor_ID=doctor, Person=request.user)
            if star == 0:
                d.delete()
            elif d.exists():
                d = d.first()
                d.Rate = star
                d.save()
            else:
                r = DoctorRatingRecord(Doctor_ID=doctor, Person=request.user, Rate=star)
                r.save()
            reviews = DoctorRatingRecord.objects.filter(Doctor_ID=doctor).count()
            scores = list(DoctorRatingRecord.objects.filter(Doctor_ID=doctor).values_list('Rate', flat=True))
            try:
                rating = (sum(scores)) / reviews
                rating = str(round(rating, 1))
            except ZeroDivisionError:
                rating = '0.0'

            response_data = {}
            response_data['status'] = "success"
            response_data['votes'] = numerize.numerize(reviews, 1)  # it will do 1000 to 1.0K and so on
            response_data['ratings'] = rating
    except Exception as e:
        print(e)
        traceback.print_exc()
        response_data = {}
        response_data['status'] = 'failed'
    finally:
        return JsonResponse(response_data)

@require_http_methods(["GET", "POST"])
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
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

@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def About(request):  
    return render(request, 'about.html')

@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def firstaidInstructor(request, username):
    try:
        instructor = CourseInstructor.objects.get(username__username=username)
        context = {
            'instructor': instructor,
        }
        return render(request, 'firstaidinstructor.html', context)
    except CourseInstructor.DoesNotExist:
        return HttpResponseNotFound()
    

@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@cache_page(timeout=60 * 60 * 24 * 365) # Expire after 365 days
def firstaid(request):
    return render(request, 'firstaid.html')

@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def firstaid_photo_course(request, id, slug):
    try:
        course = FirstaidPhotoCourse.objects.get(Course_Id=id, slug=slug)
        context = {
            'course': course,
        }
        return render(request, 'firstaidphotocourse.html', context)
    except FirstaidPhotoCourse.DoesNotExist:
        return HttpResponseNotFound()

@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def firstaid_video_course(request, id, slug):
    try:
        course = FirstaidVideoCourse.objects.get(Course_Id=id, slug=slug)
        context = {
            'course': course,
        }
        return render(request, 'firstaidvideocourse.html', context)
    except FirstaidVideoCourse.DoesNotExist:
        return HttpResponseNotFound()

@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@cache_page(timeout=60 * 60 * 24 * 365) # Expire after 365 days
def firstaid_photo(request):
    obj = FirstaidPhoto.objects.all()
    action = request.GET.get("action")
    language = request.GET.get('language', '')
    filter_value = {}
    try:
        if action == "filter":
            language = language.replace("\00", "").replace("\x00", "")
            if language == "All Languages":
                obj = FirstaidPhoto.objects.all()
            else:
                language = Languages.objects.get(Language=language)
                filter_value['Language'] = language
                kwargs = {}
                for k, v in filter_value.items():
                    if v != '':
                        kwargs[k] = v
                obj = FirstaidPhoto.objects.filter(**kwargs)
    except Exception as e:
        print(e)
    finally:
        context = {
            'Ph':obj,
            'languages':Languages.objects.all(),
            'language': language,
            }
        return render(request, 'firstaid_photo.html', context)

@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def firstaid_video(request):
    obj = FirstaidVideo.objects.all()
    action = request.GET.get("action")
    language = request.GET.get('language', '')
    filter_value = {}
    try:
        if action == "filter":
            language = language.replace("\x00", "").replace("\00", "")
            if language == "All Languages":
                obj = FirstaidVideo.objects.all()
            else:
                language = Languages.objects.get(Language=language)
                filter_value['Language'] = language
                kwargs = {}
                for k, v in filter_value.items():
                    if v != '':
                        kwargs[k] = v
                obj = FirstaidVideo.objects.filter(**kwargs)
    except Exception as e:
        print(e)
    finally:
        context = {
            'videos':obj,
            'languages':Languages.objects.all(),
            'language': language,
            }
        return render(request, 'firstaid_video.html', context)



@require_POST
@csrf_exempt
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def countVisitor(request):
    isVisited = request.POST.get('isVisited')
    value = str(request.COOKIES.get('isVisited'))
    if value != '1' and isVisited != '1':
        if TotalVisitor.objects.all().exists():
            totalVisitors = TotalVisitor.objects.all().first()
        else:
            totalVisitors = TotalVisitor.objects.create(Total=0)
        totalVisitors.Total += 1
        totalVisitors.save()
        response_data = {
            "success":'1'
        }
        responseData = JsonResponse(response_data)

        responseData.set_cookie(
            "isVisited",
            "1",
            expires='Tue, 10 Jan 2038 04:14:07 GMT',
            secure=settings.SESSION_COOKIE_SECURE,
            samesite='Lax',
        )

    else:
        response_data = {
            "success": '0'
        }
        responseData = JsonResponse(response_data)
    return responseData

@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def Home(request):
    totalVisitors = TotalVisitor.objects.all().first()
    if totalVisitors is not None:
        totalVisitors = totalVisitors.Total
    else:
        TotalVisitor.objects.create(Total=0)
        totalVisitors = 0
    last_id = get_current_event_id(['liveSiteVisitor'])
    context = {
        "totalVisitors":totalVisitors,
        "last_id": last_id,
    }
    return render(request, 'index.html', context)


@require_POST
@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
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
        last = who.last_seen + datetime.timedelta(hours=5.50)
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

@require_POST
@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def DeleteChat(request):
    id = request.POST.get('id')
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

@require_http_methods(["GET", "POST"])
@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
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
        searchAdmin = SiteAdmin.objects.filter(Name__icontains=mychatsearch)
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
        searchDoctor = Doctor.upgrade_Not_Pending_objects.filter(Name__icontains=mychatsearch)
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
            if 'Blood Donor' in user.User_Type:
                profile = Blood_Donar.objects.get(Username=user)
            elif 'Doctor' in user.User_Type:
                profile = Doctor.upgrade_Not_Pending_objects.get(Username=user)
            elif 'Normal' in user.User_Type:
                profile = NormalUser.objects.get(Username=user)
            elif 'Hospital' in user.User_Type:
                profile = Hospital.objects.get(Username=user)
            elif 'Site Admin' in user.User_Type:
                profile = SiteAdmin.objects.get(Username=user)
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
    if 'Blood Donor' in request.user.User_Type:
        myself = Blood_Donar.objects.get(Username=me)
    elif 'Doctor' in request.user.User_Type:
        myself = Doctor.upgrade_Not_Pending_objects.get(Username=me)
    elif 'Hospital' in request.user.User_Type:
        myself = Hospital.objects.get(Username=me)
    elif 'Normal' in request.user.User_Type:
        myself = NormalUser.objects.get(Username=me)
    elif 'Site Admin' in request.User_Type:
        myself = SiteAdmin.objects.get(Username=me)

    if request.method == "POST":
        if Users.objects.filter(username=person).exists():
            person = Users.objects.get(username=person)
            data = None
            if 'Blood Donor' in person.User_Type:
                data = Blood_Donar.objects.get(Username=person)
            elif 'Doctor' in person.User_Type:
                data = Doctor.upgrade_Not_Pending_objects.get(Username=person)
            elif 'Normal' in person.User_Type:
                data = NormalUser.objects.get(Username=person)
            elif 'Hospital' in person.User_Type:
                data = Hospital.objects.get(Username=person)
            elif 'Site Admin' in person.User_Type:
                myself = SiteAdmin.objects.get(Username=me)
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




@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def feedbackSubmit(request):
    if request.method == 'POST':
        email = request.POST.get('email').lower()
        feedback = request.POST.get('feedback')
        savedFeedback = UserFeedback.objects.create(Email=email, Feedback=feedback)

        subject = "New Feedback"
        body = ' '
        htmlMessage = "<b>Email:<//b> <a href='mailto:'"+email+">"+email+"</a> </b><br><p style='white-space: pre-wrap'>" + feedback + "</p>"
        sender = settings.DEFAULT_FROM_EMAIL
        receiver = [
            {
                "email": settings.DEFAULT_FROM_EMAIL,
                "name": "Go Healthy"
            }
        ]
        uniqueId = "Feedback-" + str(savedFeedback.id)
        newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, uniqueID=uniqueId, messageGroup="Feedback")
        newThreadEmail.start()
        data = {
            "success": "1",
        }
        return JsonResponse(data)

@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def AjaxContact(request):
    if request.method == 'POST':  # ContactUs Form
        name = firstCharOfEachWordCapital(request.POST.get('name'))
        email = request.POST.get('email').lower()
        phone = request.POST.get('phone')
        message = request.POST.get('message')
        savedContact = ContactUs.objects.create(Name=name, Phone=phone, Email=email, Message=message)

        subject = "Reach Us From " + name + ""
        body = ' '
        htmlMessage = "<b>Name: " + name + "<br>" + "Phone: " + phone + "<br>" + "Email: " + email + "</b><br><br><p style='white-space: pre-wrap'>" + message + "</p>"
        sender = settings.DEFAULT_FROM_EMAIL
        receiver = [
            {
                "email": settings.DEFAULT_FROM_EMAIL,
                "name": "Go Healthy"
            }
        ]
        uniqueId = "Reach_Us-" + str(savedContact.pk)
        newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, uniqueID=uniqueId, messageGroup="Reach_Us")
        newThreadEmail.start()
        data = {
            "success": "1",
        }
        return JsonResponse(data)

@require_http_methods(["GET"])
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def ContactUsView(request):
    context = {
        'workingHour': WorkingHour.objects.all().first(),
    }
    return render(request, 'contact.html', context)


@require_http_methods(["GET", "POST"])
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def ComplaintView(request):
    if request.method == 'POST':  #Complaint Form
        name = firstCharOfEachWordCapital(request.POST.get('name'))
        email = request.POST.get('email').lower()
        phone = request.POST.get('phone')
        address = firstCharOfEachWordCapital(request.POST.get('address'))
        district = request.POST.get('district')
        city = firstCharOfEachWordCapital(request.POST.get('city'))
        pin = request.POST.get('pin')
        attachment = request.FILES.get('attachment', None)
        complain = request.POST.get('complaint')
        state = request.POST.get('state')
        subdivision = firstCharOfEachWordCapital(request.POST.get('subdivision'))
        subject = firstCharOfEachWordCapital(request.POST.get('subject'))
        otherSubject = firstCharOfEachWordCapital(request.POST.get('otherSubject'))
        language = request.POST.get('language')
        st = States.objects.get(Name=state)
        dis = Districts.objects.get(Name=district, state=st)
        language = Languages.objects.get(Language=language)
        if subject == 'Other':
            subject = otherSubject
        if attachment is not None:
            fileTypeError = True
            cont_type = str(attachment.content_type)

            for contentType in settings.CONTENT_TYPES:
                if len(re.findall(contentType, cont_type)) > 0:
                    fileTypeError = False
                    break
            if fileTypeError:
                context = {
                    "success": 0,
                    "title": "Invalid File",
                    "message": "Only Document, Image, Video and Audio Files Are Allowed In Attachment."
                }
                return JsonResponse(context)
            elif attachment.size > settings.MAX_UPLOAD_SIZE:
                context = {
                    "success": 0,
                    "title": "File Size Exceed",
                    "message": "File Size Should Be Maximum 100 MB!"
                }
                return JsonResponse(context)
                
        
        while (1):
            e = string.digits
            comId = ''.join([secrets.choice(e) for i in range(5)])
            if Complaint.objects.filter(Complain_Id=comId).exists():
                continue
            else:
                break
        try:
            with transaction.atomic(durable=True):
                data = {
                    "Complain_Id": comId,
                    "Name":name,
                    "Email":email,
                    "Phone":phone,
                    "Address":address,
                    "City":city,
                    "Subdivision":subdivision,
                    "State":st,
                    "District":dis,
                    "Pin":pin,
                    "Subject":subject,
                    "Complain":complain,
                    "Language": language,
                    "Status": "Pending",
                    "Attachment": attachment,
                }
                complaint = Complaint.objects.create(**data)
                # if attachment is not None:
                #     comp = complaint.objects.get(Complain_Id=comId)
                #     comp.Attachment = attachment
                #     comp.save()

                file = open('Email_Templates/User/Complaint_Received.html')
                mes = file.read()
                file.close()
                mes = mes.replace("**mycomplaintId**", comId).replace("**mysite**", settings.SITE_URL).replace("**complaint_status_url**", reverse('Go_Healthy_App:StatusCheck')).replace("**messageSentTo**", email).replace('**person_name**', name)
                subject = 'Your Complaint Submitted'
                body = ' '
                htmlMessage = mes
                sender = settings.DEFAULT_FROM_EMAIL
                receiver = [
                    {
                        "email": email,
                        "name": name
                    }
                ]
                uniqueId = "Complaint-" + str(comId)
                newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, uniqueID=uniqueId, messageGroup="Complaint")
                newThreadEmail.start()

                context = {
                    "compId":comId,
                    "success": 1,
                }
                return JsonResponse(context)
        except ValidationError as e:
            context = {
                "success": 0,
                "message": "Invalid Input!"
            }
            return JsonResponse(context)
        except IntegrityError as e:
            context = {
                "success": 0,
                "message": "Invalid Input!"
            }
            return JsonResponse(context)
    else:
        context = {
            "states":States.objects.all(),
        }
        return render(request, 'complaint.html', context)


@require_http_methods(["GET", "POST"])
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def StatusChecK(request):
    if request.method == 'POST':
        statusType = request.POST.get('type')
        id = request.POST.get('id')
        response_data = {}
        if statusType == 'Bed_Book':
            if PatientData.objects.filter(Booking_ID=id).exclude(Status='Expired').exists() == False:
                response_data['type'] = 'Bed Book' 
                response_data["has_book"] = 'No'
            else:
                response_data['type'] = 'Bed Book' 
                response_data["has_book"] = 'Yes'
                response_data['url'] = settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', args=(id,))
        elif statusType == 'Complaint':
            comp = Complaint.objects.filter(Complain_Id=id)
            if comp.exists() == False:
                response_data['type'] = 'Complaint'
                response_data['has_Complaint'] = 'No' 
            else:
                attachment = comp.first().Attachment
                attachmentURI = ''
                attachmentName = ''
                if attachment != '':
                    #attachmentURI = request.build_absolute_uri(attachment.url)
                    attachmentURI = attachment.url
                    attachmentName = os.path.split(comp.first().Attachment.name)[1]

                comp = list(comp.values('Complain_Id', 'Name', 'Email', 'Phone', 'State__Name', 'Address', 'District__Name', 'Subdivision', 'City', 'Pin', 'Attachment', 'Language__Language', 'Language__Local_Script', 'Subject', 'Complain', 'Status', 'Complaint_Time'))
                response_data['type'] = 'Complaint'
                response_data['has_Complaint'] = 'Yes'
                response_data['complaint'] = comp
                response_data['attachment_url'] = attachmentURI
                response_data['attachment_Name'] = attachmentName
        return JsonResponse(response_data)
    else:
        return render(request, 'statuscheck.html')


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def displayProfile(request):
    user = Users.objects.get(username=request.user.username)
    if request.user.display_profile_pic:
        user.display_profile_pic = False
        user.save()
    else:
        user.display_profile_pic = True
        user.save()
    response_data = {
        'error': '0'
    }
    return JsonResponse(response_data)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_safe
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def UserProfile(request):
    if 'Hospital' in request.user.User_Type:
        return redirect('Go_Healthy_App:HospitalAdmin')
    elif 'Blood Bank' in request.user.User_Type:
        return redirect('Go_Healthy_App:BloodBankAdminProfile')
    elif 'Normal' in request.user.User_Type:
        return redirect('Go_Healthy_App:NormalProfile')
    elif 'Doctor' in request.user.User_Type:
        return redirect('Go_Healthy_App:DoctorProfile')
    elif 'Blood Donor' in request.user.User_Type:
        return redirect('Go_Healthy_App:DonorProfile')
    elif 'First Aid Instructor' in request.user.User_Type:
        return redirect('Go_Healthy_App:FirstAidInstructorProfile')
    elif 'Site Admin' in request.user.User_Type:
        return redirect('Go_Healthy_App:SiteAdminProfile')


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_http_methods(["GET", "POST"])
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def siteAdminProfile(request):
    if 'Site Admin' not in request.user.User_Type:
        return redirect('Go_Healthy_App:Profile')
    return render(request, 'siteadminprofile.html')


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_http_methods(["GET", "POST"])
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def bloodBankAdminProfile(request):
    if 'Blood Bank' not in request.user.User_Type:
        return redirect('Go_Healthy_App:Profile')

    bank = BloodBank.objects.get(Username=request.user)
    bloodBankStateDistricts = Districts.objects.filter(state=bank.State)
    context = {
        'bank': bank,
        'blood_groups': blood_groups,
        'blood_main_components': blood_main_components,
        "states": States.objects.all(),
        "bloodBankOwnership": Ownership_choice,
        "bloodBankStateDistricts": bloodBankStateDistricts,
    }
    return render(request, 'bloodbankadmin.html', context)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def updateBlood(request):
    bloodAvailability = dict()
    userInputs = dict(request.POST) # get all user inputs in a dict
    for key, val in userInputs.items(): # go through all user inputs
        if "BloodAvailability" in key: # only do for inputs which name has this string
            k = key.split("-")[1] # get substring of input name after the -
            inputValue = str(request.POST.get(key, '00'))
            if not inputValue.isdecimal():
                bloodAvailability[k] = '00'
            else:
                bloodAvailability[k] = str(int(inputValue)).zfill(2) # store the value of input in dict with leading zero (1 -> 01)

    bloodBank = BloodBank.objects.get(Username=request.user)
 
    bloodBank.Blood_Availability = bloodAvailability
    bloodBank.save()
    response_data = {
        'success': True,
        'last_update': BloodBank.objects.get(Username=request.user).Last_Update,
    }
    return JsonResponse(response_data)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def certificatesSearch(request):
    name = request.GET.get("name")
    mobile = request.GET.get("mobile")
    blood_group = request.GET.get("blood_group")
    blood_component = request.GET.get("blood_component")
    issueDate = request.GET.get("issueDate")
    issued_for = request.GET.get("issued_for")
    page_no = int(request.GET.get('page', '1'))
        
    page_size = 50
    start = (page_no-1)*page_size
    end = page_no*page_size

    filter_value = {}

    filter_value['Name'] = name
    filter_value['Phone'] = mobile
    filter_value['Blood_Group'] = blood_group
    filter_value['Component'] = blood_component
    filter_value['Certificate_issued_for'] = issued_for
    filter_value['Issued_at__date'] = issueDate
    kwargs = {}
    for k, v in filter_value.items():
        if v != '':
            kwargs[k] = v
        
    certificates = list(BloodDonationCollectionRecord.objects.filter(**kwargs)[start:end].values("Certificate_Id", "Email", "Name", "Gender", "Age", "Phone", "Blood_Group", "Unit", "Component", "Blood_Bank__Name", "Certificate_issued_for", "Certificate", "Issued_at"))
    response_data = {
        "certificates": certificates,
        'is_last': len(certificates) < page_size,
    }
    return JsonResponse(response_data)



@require_safe
@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def myBloodBankRecord(request):
    page_size = 50
    action = request.GET.get('action')
    page_no = int(request.GET.get('page', '1'))
    issued_for = request.GET.get('issued_for', '')
    issued_date = request.GET.get('issued_date', '')

    if action == 'Search':
        start = (page_no-1)*page_size
        end = page_no*page_size

        filter_value = {}

        filter_value['Certificate_issued_for'] = issued_for
        filter_value['Issued_at__date'] = issued_date
        filter_value['Username'] = request.user
        kwargs = {}
        for k, v in filter_value.items():
            if v != '':
                kwargs[k] = v
        
        certificates = BloodDonationCollectionRecord.objects.filter(**kwargs)[start:end].values("Certificate_Id", "Email", "Name", "Gender", "Age", "Phone", "Blood_Group", "Unit", "Component", "Blood_Bank__Name", "Certificate_issued_for", "Certificate", "Issued_at")
        total = certificates.count()
        if total < page_size:
            isLast = True
        else:
            isLast = False
        data = {
            'certificates': list(certificates),
            'total': total,
            'isLast':isLast,
        }
        return JsonResponse(data)
    else:
        context = {
            'issued_for': Certificate_issued_for_ch,
        }
        return render(request, "mycertificates.html", context)


@require_safe
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def showBloodDonationCertificate(request, id):
    try:
        certificate = BloodDonationCollectionRecord.objects.get(Certificate_Id=id, Certificate_issued_for="Blood Donation")
        context = {
            "certificate": certificate,
        }
        return render(request, 'displaycertificate.html', context)
    except BloodDonationCollectionRecord.DoesNotExist:
        return HttpResponseNotFound()

@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def generateBloodCertificate(request):
    name = firstCharOfEachWordCapital(request.POST.get('name'))
    age = request.POST.get('age')
    gender = request.POST.get('gender')
    blood_group = request.POST.get('blood_group')
    component = request.POST.get('component')
    unit = request.POST.get('unit')
    mobile = request.POST.get('mobile')
    email = request.POST.get('email').lower()
    issues_for = request.POST.get('issues_for')
    bank = BloodBank.objects.get(Username=request.user)

    if issues_for == "Blood Donation" and (int(age) < 18 or int(age) > 65):
        context = {
            'error': True,
            'messageTitle': 'Invalid Age',
            'message':'A person having the given age is not eligible for blood donation.'
        }
        return JsonResponse(context)

    if issues_for == "Blood Donation":
        generatedCertificate = generateIMGfromHTML(template_src='Image_Templates/donor_certificate_image.html.html', file_name='certificate.png', save=False)
    else:
        generatedCertificate = None

    certificate =  BloodDonationCollectionRecord.objects.create(Name=name, Gender=gender, Age=age, Email=email, Phone=mobile, Blood_Group=blood_group, Component=component, Unit=unit, Blood_Bank=bank, Certificate=generatedCertificate, Certificate_issued_for=issues_for)
    try:
        emailUser = Users.objects.get(email=email)
        certificate.Username.add(emailUser)
    except:
        emailUser = None
    try:
        mobileUser = Users.objects.get(Contact=mobile)
        if (emailUser is not None and mobileUser.username != emailUser.username) or emailUser is None:
            certificate.Username.add(mobileUser)
    except:
        mobileUser = None

    if issues_for == "Blood Donation":
        downloadLink = settings.SITE_URL + reverse('Go_Healthy_App:ShowBloodDonationCertificate', kwargs={'id': certificate.Certificate_Id})
        shortedDownloadLink = shortUrl(destination=downloadLink, title="Certificate Download Link")
        file = open('SMS_Templates/Blood_Donor_Certificate.txt')
        mes = file.read()
        file.close()
        mes = mes.replace("**BloodBank**", bank.Name).replace("**DownloadLink**", shortedDownloadLink)
        newThreadSMS = sendSMS(numbers=[mobile, ], message=mes, template_id='')
        newThreadSMS.start()
    elif issues_for == "Blood Collection":
        file = open('SMS_Templates/Blood_collection_Certificate.txt')
        mes = file.read()
        file.close()
        mes = mes.replace("**BloodBank**", bank.Name).replace("**unit**", unit).replace("**BloodGroup**", blood_group)
        newThreadSMS = sendSMS(numbers=[mobile, ], message=mes, template_id='')
        newThreadSMS.start()
    context = {
        'certificate': serialize('json', [certificate, ]),
    }
    return JsonResponse(context)
    


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_http_methods(["GET", "POST"])
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def firstaidInstructorProfile(request):
    if 'First Aid Instructor' not in request.user.User_Type:
        return redirect('Go_Healthy_App:Profile')
    return render(request, 'firstinstructionprofile.html')


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_http_methods(["GET", "POST"])
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def HospitalAdmin(request):
    if 'Hospital' not in request.user.User_Type:
        return redirect('Go_Healthy_App:Profile')

    hospital = Hospital.objects.get(Username=request.user)
    hospitalStateDistricts = Districts.objects.filter(state=hospital.State)
    last_live_bed_streem_id = get_current_event_id(['liveBed'])
    last_new_disease_streem_id = get_current_event_id(['newDisease'])
    context = {
        "hospital": hospital,
        "wards": ward_ch,
        "floors": floor_ch,
        'departments': HospitalDepartment.objects.all(),
        'rooms': HospitalRoom.objects.filter(Hospital=hospital),
        'units': HospitalUnit.objects.filter(Hospital=hospital),
        'buildings': HospitalBuilding.objects.filter(Hospital=hospital),
        'diseases': Disease.objects.all(),
        "states": States.objects.all(),
        "hospitalTypes": Type_choice,
        "hospitalOwnerships": Ownership_choice,
        "hospitalStateDistricts": hospitalStateDistricts,
        "last_live_bed_streem_id": last_live_bed_streem_id,
        "last_new_disease_streem_id": last_new_disease_streem_id,
    }
    return render(request, 'hospitaladmin.html', context)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_http_methods(["GET", "POST"])
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def NormalProfile(request):
    if 'Normal' not in request.user.User_Type:
        return redirect('Go_Healthy_App:Profile')
    person = NormalUser.objects.get(Username=request.user)
    if request.method == 'POST':
        pic = request.FILES.get('picture')
        action = str(request.POST.get('action'))
        if action == 'image':
            cont_type = str(pic.content_type)
            cont_type = cont_type.split('/')
            if cont_type[0] != 'image':
                success = '0'
                message = 'Not a valid Image File!'
            elif pic.size > 5242880:
                success = '0'
                message = 'Image size should be maximum 5 MB'
            else:
                person.Image = pic
                person.save()
                success = '1'
                message = 'Image Changed'
            context = {
                'success': success,
                'message': message,
            }
            return JsonResponse(context)
        elif action == "AddressUpdate":
            address = firstCharOfEachWordCapital(request.POST.get('address'))
            pin = request.POST.get('pin')
            state = request.POST.get('state')
            district = request.POST.get('district')
            city = firstCharOfEachWordCapital(request.POST.get('city'))
            subdivision = firstCharOfEachWordCapital(request.POST.get('subdivision'))
            state = States.objects.get(Name=state)
            district = Districts.objects.get(Name=district, state=state)
            person.Address = address
            person.State = state
            person.Pin = pin
            person.District = district
            person.City = city
            person.Subdivision = subdivision
            person.save()
            return JsonResponse(request.POST)
    else:
        context = {
            'person':person,
            'districts':Districts.objects.filter(state=person.State),
            'states': States.objects.all(),
            'degree': Degrees.objects.all(),
            'bloodGroups': blood_groups,
        }
        return render(request, 'normaluser.html', context)

@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_http_methods(["GET", "POST"])
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def DoctorProfile(request):
    if 'Doctor' in request.user.User_Type:
        person = Doctor.upgrade_Not_Pending_objects.get(Username=request.user)
        if 'Blood Donor' in request.user.User_Type:
            person2 = Blood_Donar.objects.get(Username=request.user)
        if request.method == 'POST':
            pic = request.FILES.get('picture')
            action = str(request.POST.get('action'))
            if action == 'image':
                cont_type = str(pic.content_type)
                cont_type = cont_type.split('/')
                if cont_type[0] != 'image':
                    success = '0'
                    message = 'Not a valid Image File!'
                elif pic.size > 5242880:
                    success = '0'
                    message = 'Image size should be maximum 5 MB'
                else:
                    person.Image = pic
                    person.save()
                    if 'Blood Donor' in request.user.User_Type:
                        person2.Image = pic
                        person2.save()
                    success = '1'
                    message = 'Image Changed'
                context = {
                    'success': success,
                    'message': message,
                }
                return JsonResponse(context)
            elif action == "AddressUpdate":
                address = firstCharOfEachWordCapital(request.POST.get('address'))
                pin = request.POST.get('pin')
                state = request.POST.get('state')
                district = request.POST.get('district')
                city = firstCharOfEachWordCapital(request.POST.get('city'))
                subdivision = firstCharOfEachWordCapital(request.POST.get('subdivision'))
                state = States.objects.get(Name=state)
                district = Districts.objects.get(Name=district, state=state)
                person.Address = address
                person.State = state
                person.Pin = pin
                person.District = district
                person.City = city
                person.Subdivision = subdivision
                person.save()
                if 'Blood Donor' in request.user.User_Type:
                    person2.Address = address
                    person2.State = state
                    person2.Pin = pin
                    person2.District = district
                    person2.City = city
                    person2.Subdivision = subdivision
                    person2.save()
                return JsonResponse(request.POST)
        else:
            context = {
                'person': person,
                'districts': Districts.objects.filter(state=person.State),
                'states': States.objects.all(),
                'degree': Degrees.objects.all(),
                'bloodGroups': blood_groups,
            }
            return render(request, 'doctorprofile.html', context)
    else:
        return redirect('Go_Healthy_App:Profile')

@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_http_methods(["GET", "POST"])
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def DonorProfile(request):
    if 'Doctor' in request.user.User_Type or 'Blood Donor' not in request.user.User_Type:
        return redirect('Go_Healthy_App:Profile')
    person = Blood_Donar.objects.get(Username=request.user)
    if request.method == 'POST':
        pic = request.FILES.get('picture')
        action = str(request.POST.get('action'))
        if action == 'image':
            cont_type = str(pic.content_type)
            cont_type = cont_type.split('/')
            if cont_type[0] != 'image':
                success = '0'
                message = 'Not a valid Image File!'
            elif pic.size > 5242880:
                success = '0'
                message = 'Image size should be maximum 5 MB'
            else:
                person.Image = pic
                person.save()
                success = '1'
                message = 'Image Changed'
            context = {
                'success': success,
                'message': message,
            }
            return JsonResponse(context)
        elif action == "AddressUpdate":
            address = firstCharOfEachWordCapital(request.POST.get('address'))
            pin = request.POST.get('pin')
            state = request.POST.get('state')
            district = request.POST.get('district')
            city = firstCharOfEachWordCapital(request.POST.get('city'))
            subdivision = firstCharOfEachWordCapital(request.POST.get('subdivision'))
            state = States.objects.get(Name=state)
            district = Districts.objects.get(Name=district, state=state)
            person.Address = address
            person.State = state
            person.Pin = pin
            person.District = district
            person.City = city
            person.Subdivision = subdivision
            person.save()
            return JsonResponse(request.POST)
    else:
        context = {
            'person':person,
            'districts':Districts.objects.filter(state=person.State),
            'states': States.objects.all(),
            'degree': Degrees.objects.all(),
            'bloodGroups': blood_groups,
        }
        return render(request, 'donorprofile.html', context)

@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def ProfileUpgrade(request):
    data = {}
    if request.method == "POST" and request.user.Is_in_Upgradation == False:
        upgradeto = request.POST.get('upgradeto')
        registrationNo = request.POST.get('registrationNo').upper()
        speciality = request.POST.get('speciality')
        degree = request.POST.get('degree')
        blood = request.POST.get('blood')
        dob = request.POST.get('dob')
        user = Users.objects.get(username=request.user.username)
        userType = user.User_Type
        person = None
        if('Normal' in userType):
            person = NormalUser.objects.get(Username=request.user)
        elif('Doctor' in userType):
            person = Doctor.upgrade_Not_Pending_objects.get(Username=request.user)
        elif('Blood Donor' in userType):
            person = Blood_Donar.objects.get(Username=request.user)

        profilePic = person.Image
        head, tail = os.path.split(str(profilePic.file))
        imageFile = File(profilePic.file, name=tail)
 
        if upgradeto == "Doctor":
            if Users.objects.filter(ID_Number=registrationNo, ID_Type="Doctor's Registration").exists():
                error_data = {
                    'registrationExists': True,
                    'message': "Doctor with this registration number already registered"
                }
                return JsonResponse(error_data)
            if 'Blood Donor' in userType:
                blood = person.Blood_Group
            degree = Degrees.objects.get(id=degree)
            speciality = Specialities.objects.get(id=speciality, Degree=degree)

            Doctor.objects.filter(Username=request.user).delete()
            doctor =  Doctor.objects.create(Username=user, Name=person.Name, Image=imageFile, Degree=degree, Special=speciality, Gender=person.Gender, Blood_Group=blood, Address=person.Address, State=person.State, City=person.City, Subdivision=person.Subdivision, District=person.District, Pin=person.Pin, Permanent_Address=person.Permanent_Address, Permanent_State=person.Permanent_State, Permanent_City=person.Permanent_City, Permanent_Subdivision=person.Permanent_Subdivision, Permanent_District=person.Permanent_District, Permanent_Pin=person.Permanent_Pin, Pending_Upgradation=True)
            
            user.Is_in_Upgradation = True
            user.save()
            data["error"] = "0"
            data['upgradeTo'] = "Doctor"
            data['message'] = 'Profile Upgrade request has been recorded.\nWe will verify your Registration No to successfully upgrade your profile.'
        elif upgradeto == "Blood Donor":
            if 'Doctor' in userType:
                blood = person.Blood_Group
            userTypes = user.User_Type
            userTypes.remove('Normal')
            if 'Blood Donor' not in userTypes:
                userTypes.append('Blood Donor')
            user.User_Type = userTypes
            user.save()

            Blood_Donar.objects.filter(Username=request.user).delete()
            Blood_Donar.objects.create(Username=user, Image=imageFile, Name=person.Name, Date_of_Birth=dob, Gender=person.Gender, Blood_Group=blood, Address=person.Address, State=person.State, City=person.City, Subdivision=person.Subdivision, District=person.District, Pin=person.Pin, Permanent_Address=person.Permanent_Address, Permanent_State=person.Permanent_State, Permanent_City=person.Permanent_City, Permanent_Subdivision=person.Permanent_Subdivision, Permanent_District=person.Permanent_District, Permanent_Pin=person.Permanent_Pin)

            NormalUser.objects.filter(Username=request.user).delete()

            data["error"] = "0"
            data['upgradeTo'] = "Blood Donor"
            data['message'] = "Profile Upgraded.\nNow you are also a Registered Blood Donor"
        elif upgradeto == "Blood Donor & Doctor":
            if Users.objects.filter(ID_Number=registrationNo, ID_Type="Doctor's Registration").exists():
                error_data = {
                    'registrationExists': True,
                    'message': "Doctor with this registration number already registered"
                }
                return JsonResponse(error_data)
            degree = Degrees.objects.get(id=degree)
            speciality = Specialities.objects.get(Degree=degree, id=speciality)
            userTypes = user.User_Type
            userTypes.remove('Normal')
            if 'Blood Donor' not in userTypes:
                userTypes.append('Blood Donor')
            user.User_Type = userTypes
            user.Is_in_Upgradation = True
            user.save()

            Blood_Donar.objects.filter(Username=request.user).delete()
            Blood_Donar.objects.create(Username=user, Name=person.Name, Image=imageFile, Date_of_Birth=dob, Gender=person.Gender, Blood_Group=blood, Address=person.Address, State=person.State, City=person.City, Subdivision=person.Subdivision, District=person.District, Pin=person.Pin, Permanent_Address=person.Permanent_Address, Permanent_State=person.Permanent_State, Permanent_City=person.Permanent_City, Permanent_Subdivision=person.Permanent_Subdivision, Permanent_District=person.Permanent_District, Permanent_Pin=person.Permanent_Pin)

            Doctor.objects.filter(Username=request.user).delete()
            doctor = Doctor.objects.create(Username=user, Name=person.Name, Image=imageFile, Degree=degree, Special=speciality, Gender=person.Gender, Blood_Group=blood, Address=person.Address, State=person.State, City=person.City, Subdivision=person.Subdivision, District=person.District, Pin=person.Pin, Permanent_Address=person.Permanent_Address, Permanent_State=person.Permanent_State, Permanent_City=person.Permanent_City, Permanent_Subdivision=person.Permanent_Subdivision, Permanent_District=person.Permanent_District, Permanent_Pin=person.Permanent_Pin, Pending_Upgradation=True)

            NormalUser.objects.filter(Username=request.user).delete()

            data['message'] = 'Your profile has been upgraded to Blood Donor.\nWe will verify your Registration No to upgrade your profile to Doctor also.'
            data["error"] = "0"
            data['upgradeTo'] = "Blood Donor & Doctor"
    return JsonResponse(data)

@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def OTPSendEdit(request):
    email = request.POST.get('email', '').lower()
    contact = request.POST.get('contact', '')
    response_data = {}
    userTypes = request.user.User_Type
    person = None
    if 'Normal' in userTypes:
        person = NormalUser.objects.get(Username=request.user)
    elif 'Doctor' in userTypes:
        person = Doctor.upgrade_Not_Pending_objects.get(Username=request.user)
    elif 'Blood Donor' in userTypes:
        person = Blood_Donar.objects.get(Username=request.user)

    emailChange = "no"
    mobileChange = "no"
    if request.method == 'POST':
        emailOTP = None
        mobileOTP = None
        if (email is None or contact is None) or (email == '' or contact == ''):
            response_data['error'] = "1"
        else:
            if email != request.user.email:
                OTP.objects.filter(Email=email, Send_For='Profile Edit').delete()
                emailOTP = generateOTP(6)
                OTP.objects.create(Email=email, EmailOTP=emailOTP, Is_Verified=False, Send_For='Profile Edit')
                file = open('Email_Templates/User/Email_Update_otp.html')
                mes = file.read()
                file.close()
                mes = mes.replace("**myotp**", emailOTP).replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", email)
                subject = 'OTP For Email Update'
                body = ' '
                htmlMessage = mes
                sender = settings.DEFAULT_FROM_EMAIL
                receiver = [
                    {
                        "email": email,
                        "name": person.Name
                    }
                ]

                newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, messageGroup="Contact_Edit_OTP")
                newThreadEmail.start()
                response_data['error'] = "0"
                emailChange = "yes"

            if contact != request.user.Contact:
                OTP.objects.filter(Mobile=contact, Send_For='Profile Edit').delete()
                mobileOTP = generateOTP(6)
                OTP.objects.create(Mobile=contact, MobileOTP=mobileOTP, Is_Verified=False, Send_For='Profile Edit')
                file = open('SMS_Templates/Contact_Update_OTP.txt')
                mes = file.read()
                file.close()
                mes = mes.replace("**yourOTP**", mobileOTP)
                newThreadSMS = sendSMS(numbers=[contact,], message=mes, template_id='')
                newThreadSMS.start()
                response_data['error'] = "0"
                mobileChange = "yes"

    response_data['emailChange'] = emailChange
    response_data['mobileChange'] = mobileChange
    response_data['email'] = email
    response_data['contact'] = contact
    return JsonResponse(response_data)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def otpSendHospitalContactEdit(request):
    mobile = request.POST.get('contact', '')
    email = request.POST.get('email', '').lower()
    sendTo = request.POST.get('sendTo')
    hospital = Hospital.objects.get(Username=request.user)
    if sendTo == 'mobile':
        OTP.objects.filter(Mobile=mobile, Send_For='Profile Edit').delete()
        mobileOTP = generateOTP(6)
        OTP.objects.create(Mobile=mobile, MobileOTP=mobileOTP, Is_Verified=False, Send_For='Profile Edit')
        file = open('SMS_Templates/Contact_Update_OTP.txt')
        mes = file.read()
        file.close()
        mes = mes.replace("**yourOTP**", mobileOTP)
        newThreadSMS = sendSMS(numbers=[mobile,], message=mes, template_id='')
        newThreadSMS.start()
    elif sendTo == 'email':
        OTP.objects.filter(Email=email, Send_For='Profile Edit').delete()
        emailOTP = generateOTP(6)
        OTP.objects.create(Email=email, EmailOTP=emailOTP, Is_Verified=False, Send_For='Profile Edit')
        file = open('Email_Templates/User/Email_Update_otp.html')
        mes = file.read()
        file.close()
        mes = mes.replace("**myotp**", emailOTP).replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", email)
        subject = 'OTP For Email Update'
        body = ' '
        htmlMessage = mes
        sender = settings.DEFAULT_FROM_EMAIL
        receiver = [
            {
                "email": email,
                "name": hospital.Name
            }
        ]
        newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, messageGroup="Contact_Edit_OTP")
        newThreadEmail.start()
    response_data = {
        'success': True,
    }
    return JsonResponse(response_data)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def otpSendBloodBankContactEdit(request):
    mobile = request.POST.get('contact', '')
    email = request.POST.get('email', '').lower()
    sendTo = request.POST.get('sendTo')
    bank = BloodBank.objects.get(Username=request.user)
    if sendTo == 'mobile':
        OTP.objects.filter(Mobile=mobile, Send_For='Profile Edit').delete()
        mobileOTP = generateOTP(6)
        OTP.objects.create(Mobile=mobile, MobileOTP=mobileOTP, Is_Verified=False, Send_For='Profile Edit')
        file = open('SMS_Templates/Contact_Update_OTP.txt')
        mes = file.read()
        file.close()
        mes = mes.replace("**yourOTP**", mobileOTP)
        newThreadSMS = sendSMS(numbers=[mobile,], message=mes, template_id='')
        newThreadSMS.start()
    elif sendTo == 'email':
        OTP.objects.filter(Email=email, Send_For='Profile Edit').delete()
        emailOTP = generateOTP(6)
        OTP.objects.create(Email=email, EmailOTP=emailOTP, Is_Verified=False, Send_For='Profile Edit')
        file = open('Email_Templates/User/Email_Update_otp.html')
        mes = file.read()
        file.close()
        mes = mes.replace("**myotp**", emailOTP).replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", email)
        subject = 'OTP For Email Update'
        body = ' '
        htmlMessage = mes
        sender = settings.DEFAULT_FROM_EMAIL
        receiver = [
            {
                "email": email,
                "name": bank.Name
            }
        ]
        newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, messageGroup="Contact_Edit_OTP")
        newThreadEmail.start()
    response_data = {
        'success': True,
    }
    return JsonResponse(response_data)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def ContactUpdate(request):
    data = {}
    if request.method == "POST":
        contact = request.POST.get('contact')
        email = request.POST.get('email').lower()
        emailotp = request.POST.get('emailotp')
        mobileotp = request.POST.get('mobileotp')
        match = False
        if email != request.user.email:
            if OTP.objects.filter(Email=email, Is_Verified=False, Send_For='Profile Edit').exists():
                otp = OTP.objects.get(Email=email, Is_Verified=False, Send_For='Profile Edit')
                if otp.EmailOTP == emailotp:
                    match = True
                else:
                    match = False
            else:
                match = False
        if contact != request.user.Contact:
            if OTP.objects.filter(Mobile=contact, Is_Verified=False, Send_For='Profile Edit').exists():
                otp = OTP.objects.get(Mobile=contact, Is_Verified=False, Send_For='Profile Edit')
                if otp.MobileOTP == mobileotp:
                    match = True
                else:
                    match = False
            else:
                match = False

        if match:
            person = None
            userTypes = request.user.User_Type
            if 'Normal' in userTypes:
                person = NormalUser.objects.get(Username=request.user)
            elif 'Doctor' in userTypes:
                person = Doctor.upgrade_Not_Pending_objects.get(Username=request.user)
            elif 'Blood Donor' in userTypes:
                person = Blood_Donar.objects.get(Username=request.user)

            if Users.objects.filter(email=email).exclude(email=request.user.email).exists() or Users.objects.filter(Contact=contact).exclude(Contact=request.user.Contact).exists():
                data['error'] = '3'
                data['message'] = "We have found misinformation in your contact info!"
            else:
                if contact != request.user.Contact:
                    oldcontact = request.user.Contact
                    user = Users.objects.get(username=request.user.username)
                    user.Contact = contact
                    user.save()
                    file = open('Email_Templates/User/Contact_Update_Success.html')
                    mes = file.read()
                    file.close()
                    mes = mes.replace("**oldcontact**", oldcontact).replace("**newcontact**", contact).replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", request.user.email)
                    subject = 'Contact Update Success'
                    body = ' '
                    htmlMessage = mes
                    sender = settings.DEFAULT_FROM_EMAIL
                    receiver = [
                        {
                            "email": request.user.email,
                            "name": person.Name
                        }
                    ]
                    newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, messageGroup="Contact_Update_Success")
                    newThreadEmail.start()
                    OTP.objects.filter(Mobile=contact, Send_For='Profile Edit').delete()

                if email != request.user.email:
                    oldemail = request.user.email
                    user = Users.objects.get(username=request.user.username)
                    user.email = email
                    user.save()
                    file = open('Email_Templates/User/Email_Update_Success.html')
                    mes = file.read()
                    file.close()
                    mes = mes.replace("**oldemail**", oldemail).replace("**newemail**", email).replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", oldemail)
                    subject = 'Email Update Success'
                    body = ' '
                    htmlMessage = mes
                    sender = settings.DEFAULT_FROM_EMAIL
                    receiver = [
                        {
                            "email": oldemail,
                            "name": person.Name
                        }
                    ]
                    newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, messageGroup="Email_Update_Success")
                    newThreadEmail.start()
                    OTP.objects.filter(Email=email, Send_For='Profile Edit').delete()
                otp.delete()
                data['error'] = "0"
                data['email'] = email
                data['contact'] = contact
        else:
            data['error'] = "1"
            data['message'] = "Invalid OTP!"
    else:
        data['error'] = "2"
        data['message'] = "Failed!"
    return JsonResponse(data)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def EditBloodGroup(request):
    data = {}
    data['error'] = "1"
    bloodGroup = request.POST.get('bloodGroup')
    if "Blood Donor" in request.user.User_Type:
        donor = Blood_Donar.objects.get(Username=request.user)
        donor.Blood_Group = bloodGroup
        donor.save()
        data['error'] = "0"
    if "Doctor" in request.user.User_Type:
        doctor = Doctor.upgrade_Not_Pending_objects.get(Username=request.user)
        doctor.Blood_Group = bloodGroup
        doctor.save()
        data['error'] = "0"
    return JsonResponse(data)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_safe
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def getDepartmentBeds(request):
    response_data = {}
    if 'Hospital' in request.user.User_Type:
        filter_value = {}
        hospital = Hospital.objects.get(Username=request.user)
        bookingId = request.GET.get('bookingId', '')
        department = request.GET.get('department')
        ward = request.GET.get('ward')
        room = request.GET.get('room')
        unit = request.GET.get('unit')
        requirement = request.GET.get('requirement')
        allowReserve = request.GET.get('allowReserve')

        filter_value['Hospital'] = hospital
        filter_value['Department'] = HospitalDepartment.objects.filter(id=department).first()
        filter_value['Ward'] = ward
        filter_value['Support'] = requirement
        if not(room == '' or room is None):
            filter_value['Room'] = HospitalRoom.objects.filter(id=room).first()
        if not(unit == '' or unit is None):
            filter_value['Unit'] = HospitalUnit.objects.filter(id=unit).first()
            
        availability = ['Available']
        if allowReserve == 'Yes':
            availability.append("Reserved")
        filter_value['Availability__in'] = availability
        bed = []
        bed = list(BedNo.objects.filter(~Q(Availability="Null")).filter(**filter_value).values("id", "Department__department", "Bed_No", "Room__id", "Room__Room", "Unit__id", "Unit__Unit", "Floor", "Ward", "Building__id", "Building__Building", "Support"))
        if bookingId != '':
            filter_value['Availability__in'] = ['Book']
            filter_value['Booking_Id'] = bookingId
            b = list(BedNo.objects.filter(~Q(Availability="Null")).filter(**filter_value).values("id", "Department__department", "Bed_No", "Room__id", "Room__Room", "Unit__id", "Unit__Unit", "Floor", "Ward", "Building__id", "Building__Building", "Support"))
            bed = b + bed
        response_data['ward'] = ward
        response_data['bed'] = bed
        return JsonResponse(response_data)
    

@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def getBookingDetails(request):
    if 'Hospital' in request.user.User_Type:
        bookid = request.POST.get('bookid')
        book = PatientData.objects.filter(Booking_ID=bookid)
        if book.exists() == False:
            context = {
                'message':'not_exists'
            }
            return JsonResponse(context)

        hospital = Hospital.objects.get(Username=request.user)
        bedbook = list(book.values("Booking_ID", "Status", "Bed_No__id", "Bed_No__Ward", "Bed_No__Department__id", "Bed_No__Department__department", "Bed_No__Bed_No", 'Bed_No__Support', "Bed_No__Floor", "Bed_No__Room__id", "Bed_No__Room__Room", "Bed_No__Unit__id", "Bed_No__Unit__Unit", "Bed_No__Building__Building", "Booking_Time", "Expire_Time", "Admit_Time", "Status_Changed_At", "Patient_Name", "Email", "Mobile", "Alternative_Mobile", "State", "District", "Pin", "Subdivision", "Gender", "Hospital_Name__Name").order_by('Bed_No__Hospital__Name', 'Bed_No__Ward', 'Bed_No__Support', "Bed_No__Department__department", 'Bed_No__Bed_No', "Bed_No__Room__Room", "Bed_No__Unit__Unit", "Bed_No__Building__Building", 'Bed_No__Floor'))
        book = book.first()
        bed = ''
        bedID = ''
        if book.Bed_No is not None:
            bedID = book.Bed_No.id
            if book.Bed_No.Building is not None and book.Bed_No.Building != '':
                bookBuilding = f" BUILDING: {book.Bed_No.Building.Building};"
            else:
                bookBuilding = ''
            if book.Bed_No.Room is not None and book.Bed_No.Room != '':
                bookRoom = f" ROOM: {book.Bed_No.Room.Room};"
            else:
                bookRoom = ''
            if book.Bed_No.Unit is not None and book.Bed_No.Unit != '':
                bookUnit = f" UNIT: {book.Bed_No.Unit.Unit};"
            else:
                bookUnit = ''
            if bookRoom != '' or bookUnit != '':
                addBreak = "<br>"
            else:
                addBreak = ""
            bed = f"WARD: {book.Bed_No.Ward}; SUPPORT: {book.Bed_No.Support};{addBreak}{bookRoom}{bookUnit}<br>FLOOR: {book.Bed_No.Floor};{bookBuilding}"
        if book.Hospital_Name == hospital:
            if book.Is_Checked != True:
                book.Is_Checked = True
                book.When_Checked = zonetime.now()
                book.save()
            message = 'no_error'
        else:
            message = 'hospital_not_matched'
        referFrom = None
        referTo = None
        if book.Status == 'Referred':
            refer = ReferredPatient.objects.filter(Patient=book, is_action_took=False).first()
            refer_from_hospital = refer.Referral_Hospital_From
            referFrom = ""+str(refer_from_hospital.Name)+", "+str(refer_from_hospital.City)+", "+str(refer_from_hospital.Subdivision)+", "+str(refer_from_hospital.District.Name)+", "+str(refer_from_hospital.State.Name)
            refer_to_hospital = refer.Referral_Hospital_To
            referTo = ""+str(refer_to_hospital.Name)+", "+str(refer_to_hospital.City)+", "+str(refer_to_hospital.Subdivision)+", "+str(refer_to_hospital.District.Name)+", "+str(refer_to_hospital.State.Name)
        context = {
            'message': message,
            'book': bedbook,
            'bedID': bedID,
            'bed': bed,
            'referFrom': referFrom,
            'referTo': referTo,
        }
        return JsonResponse(context)


def getDepartmentBedAvailabilityData(request):
    department = request.GET.get('department')
    hospitalId = request.GET.get('hospitalId')
    beds = BedNo.objects.filter(~Q(Availability="Null") & Q(Hospital__Unique_Id=hospitalId, Department__department=department))
    response_data = {
        'femaleWithO2': beds.filter(Ward='Female Ward', Availability='Available', Support='With Oxygen').count(),
        'femaleNonO2': beds.filter(Ward='Female Ward', Availability='Available', Support='Non-Oxygen').count(),
        'maleWithO2': beds.filter(Ward='Male Ward', Availability='Available', Support='With Oxygen').count(),
        'maleNonO2': beds.filter(Ward='Male Ward', Availability='Available', Support='Non-Oxygen').count(),
        'childWithO2': beds.filter(Ward='Child Ward', Availability='Available', Support='With Oxygen').count(),
        'childNonO2': beds.filter(Ward='Child Ward', Availability='Available', Support='Non-Oxygen').count(),
        'availableO2Beds': beds.filter(Availability='Available', Support='With Oxygen').count(),
        'availableNonO2Beds': beds.filter(Availability='Available', Support='Non-Oxygen').count(),
        'ventilation': beds.filter(Ward__in=['ICU', 'PICU'], Availability='Available', Support='With Ventilator').count(),
        'NonVentilation': beds.filter(Ward__in=['ICU', 'PICU'], Availability='Available', Support='Non-Ventilator').count(),
        'hasICU': beds.filter(Ward='ICU', Availability='Available').exists(),
        'hasPICU': beds.filter(Ward='PICU', Availability='Available').exists(),
        'hasNICU': beds.filter(Ward='NICU', Availability='Available').exists(),
        'NonICU': beds.filter(Ward__in=['Female Ward', 'Male Ward', 'Child Ward'], Availability='Available').exists(),
        "totalAvailableBed": beds.filter(Availability='Available').exclude(Ward="NICU").count(),
    }
    return JsonResponse(response_data)


@require_http_methods(["GET", "POST"])
@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def BedBook(request, hospitalID=''):
    user_type = request.user.User_Type
    
    if ((PatientData.objects.filter(Username=request.user, Status='Not Admit Still Now').exists()) and (not any(item in user_type for item in special_user_types))):
        return redirect('Go_Healthy_App:project-Hospital')
   
    hos = Hospital.objects.filter(Unique_Id=hospitalID)
    hospital = hos.first()
    beds = hospital.hospital_beds.all() #use reverse relationship to find all beds of the hospital
    if not request.user.is_book_allow:
        context = {
            "nobook": "1",
            "Hospital":hospital,
        }
        return render(request, 'bedbook.html', context)

    
    if request.method == 'GET':
        if hos.exists() == False:
            context = {
                'noHospital':True,
                "Hospital": None,
            }
            return render(request, 'bedbook.html', context)
        elif beds.filter(Availability="Available", Ward__in=["Female Ward", "Male Ward", "Child Ward", "ICU", "PICU"]).count() <= 0:
            context = {
                'noBed': True,
                "Hospital":hospital,
            }
            return render(request, 'bedbook.html', context)

    if request.method == 'POST' and request.user.is_book_allow:
        child_age_max = 10
        
        gender = request.POST.get('gender')
        age = int(request.POST.get('age'))
        NeedICUvalue = request.POST.get('NeedICU', 'No')
        o2 = request.POST.get('NeedO2', 'No')
        department = request.POST.get('department')

        femaleWithO2 = beds.filter(Ward='Female Ward', Availability='Available', Support='With Oxygen', Department__department=department)
        femaleNonO2 = beds.filter(Ward='Female Ward', Availability='Available', Support='Non-Oxygen', Department__department=department)
        maleWithO2 = beds.filter(Ward='Male Ward', Availability='Available', Support='With Oxygen', Department__department=department)
        maleNonO2 = beds.filter(Ward='Male Ward', Availability='Available', Support='Non-Oxygen', Department__department=department)
        childWithO2 = beds.filter(Ward='Child Ward', Availability='Available', Support='With Oxygen', Department__department=department)
        childNonO2 = beds.filter(Ward='Child Ward', Availability='Available', Support='Non-Oxygen', Department__department=department)

        hasICU = beds.filter(Ward='ICU', Availability='Available', Department__department=department)
        hasPICU = beds.filter(Ward='PICU', Availability='Available', Department__department=department)
        hasNICU = beds.filter(Ward='NICU', Availability='Available', Department__department=department)

        try:
            bed = ''
            with transaction.atomic(durable=True): #Use Atomic property (If any error occurred then don't commit the changes; i.e. only when all operation execute successfully then commit the changes in database)
                bed_not_update_sid = transaction.savepoint()
                if age > child_age_max:
                    if(NeedICUvalue == 'Yes' and hasICU.count() > 0):
                        bed = hasICU.first()
                        bed.Availability = 'Book'
                        bed.Book_by = request.user
                        bed.save()

                    elif(NeedICUvalue == 'No'):
                        if o2 == 'No':
                            if gender == 'Male' and maleNonO2.count() > 0:
                                bed = maleNonO2.first()
                                bed.Availability = 'Book'
                                bed.Book_by = request.user
                                bed.save()

                            elif gender == 'Female' and femaleNonO2.count() > 0:
                                bed = femaleNonO2.first()
                                bed.Availability = 'Book'
                                bed.Book_by = request.user
                                bed.save()

                            else:
                                context = {
                                    "error": "1",
                                    "message": "<b>Some input error found. Please fill up the form correctly</b>",
                                }
                                return JsonResponse(context)

                        elif o2 == 'Yes':
                            if gender == 'Male' and maleWithO2.count() > 0:
                                bed = maleWithO2.first()
                                bed.Availability = 'Book'
                                bed.Book_by = request.user
                                bed.save()

                            elif gender == 'Female' and femaleWithO2.count() > 0:
                                bed = femaleWithO2.first()
                                bed.Availability = 'Book'
                                bed.Book_by = request.user
                                bed.save()

                            else:
                                context = {
                                    "error": "1",
                                    "message": "<b>Some input error found. Please fill up the form correctly</b>",
                                }
                                return JsonResponse(context)
                        else:
                            context = {
                                "error": "1",
                                "message": "<b>Some input error found. Please fill up the form correctly</b>",
                            }
                            return JsonResponse(context)
                    else:
                        context = {
                            "error": "1",
                            "message": "<b>Some input error found. Please fill up the form correctly</b>",
                        }
                        return JsonResponse(context)
                else:
                    if (NeedICUvalue == 'Yes' and hasPICU.count() > 0):
                        bed = hasPICU.first()
                        bed.Availability = 'Book'
                        bed.Book_by = request.user
                        bed.save()

                    elif (NeedICUvalue == 'No'):
                        if o2 == 'Yes' and childWithO2.count() > 0:
                            bed = childWithO2.first()
                            bed.Availability = 'Book'
                            bed.Book_by = request.user
                            bed.save()

                        elif o2 == 'No' and childNonO2.count() > 0:
                            bed = childNonO2.first()
                            bed.Availability = 'Book'
                            bed.Book_by = request.user
                            bed.save()

                        else:
                            context = {
                                "error": "1",
                                "message": "<b>Some input error found. Please fill up the form correctly</b>",
                            }
                            return JsonResponse(context)
                    else:
                        context = {
                            "error": "1",
                            "message": "<b>Some input error found. Please fill up the form correctly</b>",
                        }
                        return JsonResponse(context)
            
                book_not_create_sid = transaction.savepoint()
                hosId = str(hospitalID)
                booktime = zonetime.now()
                expire = booktime + datetime.timedelta(hours=3.0)
                refId = ''
                e = string.digits
                while(1):
                    refId = ''.join([secrets.choice(e) for i in range(10)])
                    refId = hosId+"-"+refId
                    if PatientData.objects.filter(Booking_ID=refId).exists():
                        continue
                    else:
                        break
                bed.Booking_Id = refId
                bed.save()
                
                name = firstCharOfEachWordCapital(request.POST.get('patientName'))
                mobile = request.POST.get('mobile')
                altmobile = request.POST.get('altmobile')
                state = request.POST.get('state')
                district = request.POST.get('district')
                pin = request.POST.get('pin')
                subdivision = firstCharOfEachWordCapital(request.POST.get('subdivision'))

                statusUrl = settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', kwargs={'id': refId})

                file_name = "QR_" + str(refId) + '.png'
                qrImage = generateQR(data=statusUrl, file_name=file_name, save=False) # generate a QR
                
                book = PatientData.objects.create(Booking_ID=refId, QR=qrImage, Bed_No=bed, Age=age, Username=request.user, Hospital_Name=hospital, Patient_Name=name, Email=request.user.email, Mobile=mobile, Alternative_Mobile=altmobile, State=state, District=district, Pin=pin, Subdivision=subdivision, Gender=gender, Booking_Time=booktime, Expire_Time=expire)
                def runAfterSuccess():
                    try:
                        file = open('SMS_Templates/Bed_Booked.txt')
                        mes = file.read()
                        file.close()
                        shortedStatusUrl = shortUrl(destination=statusUrl, title="Status Check URL")
                        mes = mes.replace("**bookingId**", refId).replace("**hospitalName**", hospital.Name).replace("**hospitalCity**", hospital.City).replace("**hospitalName**", hospital.Name).replace("**hospitalTown**", hospital.City).replace("**hospitalDist**", hospital.District.Name).replace("**hospitalState**", hospital.State.Name).replace('**hospitalContact**', hospital.Emergency_Number).replace("**statusURL**", shortedStatusUrl)
                        newThreadSMS = sendSMS(numbers=[mobile, ], message=mes, template_id='1407166168607257676')
                        newThreadSMS.start()

                        file = open('Email_Templates/User/New_Book_Mail.html')
                        mes = file.read()
                        file.close()
                        mes = mes.replace("**myhospital**", hospital.Name).replace("**mybookid**", refId).replace("**mysite**", settings.SITE_URL).replace("**booking_status_url**", reverse('Go_Healthy_App:BookStatus', args=(refId,))).replace("**messageSentTo**", request.user.email)
                        
                        subject = 'Bed Book Confirmed'
                        body = ' '
                        htmlMessage = mes
                        sender = settings.DEFAULT_FROM_EMAIL
                        receiver = [
                            {
                                "email": request.user.email,
                                "name": request.user.username
                            }
                        ]
                        uniqueId = "Bed_Book-" + str(refId)

                        context = {
                            'static': settings.SITE_URL+"/static/",
                            'book': book,
                        }
                        pdf_url = settings.SITE_URL + reverse('Go_Healthy_App:BookingPDF', kwargs={'id': book.Booking_ID})
                        pdfTitle = "Bed_Book_Confirmation-"+str(refId)
                        pdf_file_name = pdfTitle+".pdf" # choice a name for the generated pdf file
                        pdf = generatePDFfromHTML(template_src="PDF_Templates/bedbook_pdf.html", file_name=pdf_file_name, save=False, title=pdfTitle, context=context, pdf_url=pdf_url)
                        attachments = [{
                            'file': pdf,
                            'file_name': pdf_file_name,
                        }]
                        
                        newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, Attachments=attachments, uniqueID=uniqueId, messageGroup="Bed_Booked")
                        newThreadEmail.start()
                    except Exception as e:
                        print(e)
                    finally:
                        return True
                transaction.on_commit(runAfterSuccess)
        except Exception as e:
            print(e)
            traceback.print_exc()
            #transaction.savepoint_rollback(bed_not_update_sid)
            #transaction.savepoint_rollback(book_not_create_sid)
            context = {
                "error": "1",
                "message": "<b>Some server error occurred. Please try again!</b>",
            }
        else:
            context = {
                'error': '0',
                'url': statusUrl,
            }
        finally:
            return JsonResponse(context)
    else:
        context = {
            "Hospital":hospital,
            "states":States.objects.all(),
            "common_diseases": SomeCommonDisease.objects.all(),
       }
        return render(request, 'bedbook.html',context)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def NewBook(request):
    if request.method == 'POST' and 'Hospital' in request.user.User_Type:
        Bed_Id = request.POST.get('Bed_Id')
        hos = Hospital.objects.filter(Username=request.user)
        hospital = hos.first()
        try:
            with transaction.atomic(durable=True):
                hosId = str(hospital.Unique_Id)
                booktime = zonetime.now()
                expire = booktime + datetime.timedelta(hours=3.0)
                refId = ""
                e = string.digits
                while (1):
                    refId = ''.join([secrets.choice(e) for i in range(10)])
                    refId = hosId+"-"+refId
                    if PatientData.objects.filter(Booking_ID=refId).exists():
                        continue
                    else:
                        break
                if Bed_Id is not None and Bed_Id != '':
                    bed = BedNo.objects.get(Q(id=Bed_Id, Hospital=hospital))
                    if  bed.Availability == 'Reserved' or bed.Availability == 'Available':
                        bed.Availability = 'Used'
                        bed.Book_by = request.user
                        bed.Booking_Id = refId
                        bed.Last_Update = zonetime.now()
                        bed.save()
                    else:
                        response_data = {
                            'error':'1',
                        }
                        return JsonResponse(response_data)
                else:
                    value_dict = {}
                    department = request.POST.get('department')
                    value_dict['Department'] = HospitalDepartment.objects.get(id=department)
                    value_dict['Ward'] = request.POST.get('ward')
                    value_dict['Support'] = request.POST.get('requirement')
                    room = request.POST.get('room')
                    if room is not None and room != '':
                        value_dict['Room'] = HospitalRoom.objects.get(Hospital=hospital, id=room)
                    else:
                        value_dict['Room'] = None
                    unit = request.POST.get('unit')
                    if unit is not None and unit != '':
                        value_dict['Unit'] = HospitalRoom.objects.get(Hospital=hospital, id=unit)
                    else:
                        value_dict['Unit'] = None
                    value_dict['Building'] = None
                    value_dict['Floor'] = None
                    value_dict['Bed_No'] = None
                    value_dict['Hospital'] = hospital
                    value_dict['Availability'] = "Null"
                    bed = BedNo.objects.get_or_create(**value_dict)[0]
                
                patientName = firstCharOfEachWordCapital(request.POST.get('patientName', ''))
                email = request.POST.get('email', '').lower()
                mobile = request.POST.get('mobile')
                altmobile = request.POST.get('altmobile', '')
                state = request.POST.get('state')
                district = request.POST.get('district')
                subdivision = firstCharOfEachWordCapital(request.POST.get('subdivision', ''))
                pin = request.POST.get('pin')
                gender = request.POST.get('gender')
                age = request.POST.get('age')
                unknown = request.POST.get('unknown')
                disease = request.POST.get('disease')

                if unknown == 'true':
                    unknown = True
                    patientName = 'Unknown'
                    mobile = 'Unknown'
                    state = 'Unknown'
                    district = 'Unknown'
                    subdivision = 'Unknown'
                    pin = 'Unknown'
                    age = 'Unknown'
                else:
                    unknown = False

                statusUrl = settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', kwargs={'id': refId})
                                
                file_name = "QR_" + str(refId) + '.png'
                qrImage = generateQR(data=statusUrl, file_name=file_name, save=False) # generate a QR
                disease = Disease.objects.get_or_create(Disease=disease)[0]
                PatientData.objects.create(Booking_ID=refId, Username=request.user, QR=qrImage, Booked_By='Hospital Authority', Age=age, Disease=disease, Hospital_Name=hospital, Bed_No=bed, Patient_Name=patientName, Email=email, Mobile=mobile, Alternative_Mobile=altmobile, State=state, District=district, Pin=pin, Subdivision=subdivision, Gender=gender, Status="Admitted", Booking_Time=booktime, Expire_Time=expire, Admit_Time=booktime, Is_Checked=True, Is_Unknown=unknown)
                
                def sendConfirmation():
                    try:
                        file = open('SMS_Templates/New_Booked.txt')
                        mes = file.read()
                        file.close()
                        shortedStatusUrl = shortUrl(destination=statusUrl, title="Status Check URL")
                        mes = mes.replace("**hospitalName**", hospital.Name).replace('**bookingId**', refId).replace('**hospitalContact**', hospital.Emergency_Number).replace("**statusURL**", shortedStatusUrl)
                        newThreadSMS = sendSMS(numbers=[mobile, ], message=mes, template_id='1407166179866683454')
                        newThreadSMS.start()
                    except Exception as e:
                        print(e)
                    finally:
                        return True
                transaction.on_commit(sendConfirmation)
        except Exception as e:
            print(e)
            traceback.print_exc()
            print("\n\n")
            response_data = {
                'success': '0', 
            }
        else:
            response_data = {}
            response_data['success'] = '1'
            response_data['url'] = statusUrl
        finally:
            return JsonResponse(response_data) 


@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def BedBookView(request, id):
    if PatientData.objects.filter(Booking_ID=id).exclude(Status='Expired').exists() == False:
        context = {
            'noBook': True,
        }
        return render(request, 'bedbook_conf.html', context)
    book = PatientData.objects.get(Booking_ID=id)
    bed = book.Bed_No
    referral = ReferredPatient.objects.filter(Patient=book)
    patientShiftRecords = PatientShiftRecords.objects.filter(patient=book)
    context = {
        'book':book,
        'referral': referral,
        'referralCount': referral.count(), 
        'patientShiftRecords': patientShiftRecords,
        'patientShiftRecordsCount': patientShiftRecords.count(),
        'bed': bed,
    }
    return render(request, 'bedbook_conf.html', context)


@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def bedBookPDF(request, id):
    try:
        book = PatientData.objects.get(Q(Booking_ID=id) & ~Q(Status="Expired"))
        context = {
            'base_url': settings.SITE_URL,
            'static': settings.SITE_URL+"/static/",
            'book': book,
        }
        pdf_url = settings.SITE_URL + reverse('Go_Healthy_App:BookingPDF', kwargs={'id': book.Booking_ID})
        pdfTitle = "Bed_Book_Confirmation-"+str(id)
        pdf_file_name = pdfTitle+".pdf" # choice a name for the generated pdf file
        pdf = generatePDFfromHTML(template_src="PDF_Templates/bedbook_pdf.html", file_name=pdf_file_name, save=False, title=pdfTitle, context=context, pdf_url=pdf_url)

        return HttpResponse(pdf, content_type='application/pdf')

    except PatientData.DoesNotExist:
        book = None
        return HttpResponseNotFound()


@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def bedBookPDFHTML(request, id):
    try:
        book = PatientData.objects.get(Q(Booking_ID=id) & ~Q(Status="Expired"))
        context = {
            'base_url': settings.SITE_URL,
            'static': settings.SITE_URL+"/static/",
            'book': book,
        }
        return render(request, "bedbook_pdf.html", context)
    except PatientData.DoesNotExist:
        book = None
        return HttpResponseNotFound()
    


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def statusUpdate(request):
    if 'Hospital' in request.user.User_Type:
        try:
            with transaction.atomic(durable=True):
                status = str(request.POST.get('status'))
                bookid = request.POST.get('bookid')
                hospital = Hospital.objects.get(Username=request.user)
                book = PatientData.objects.filter(Booking_ID=bookid, Hospital_Name=hospital).first()
                context = {}
                if status is not None or status != "":
                    Bed_Id = request.POST.get("Bed_Id")
                    if book.Status != 'Expired':
                        ReferredPatient.objects.filter(Patient=book).update(is_action_took=True)
                        if status == 'Admit' and book.Status == "Not Admit Still Now":
                            if Bed_Id is not None and Bed_Id != '':
                                bed = BedNo.objects.get(Q(id=Bed_Id, Hospital=hospital) & Q(Q(Availability='Available') | Q(Availability='Book', Booking_Id=bookid)))
                            else:
                                value_dict = {}
                                department = request.POST.get('department')
                                value_dict['Department'] = HospitalDepartment.objects.get(id=department)
                                value_dict['Ward'] = request.POST.get('ward')
                                value_dict['Support'] = request.POST.get('requirement')
                                room = request.POST.get('room')
                                if room is not None and room != '':
                                    value_dict['Room'] = HospitalRoom.objects.get(Hospital=hospital, id=room)
                                else:
                                    value_dict['Room'] = None
                                unit = request.POST.get('unit')
                                if unit is not None and unit != '':
                                    value_dict['Unit'] = HospitalRoom.objects.get(Hospital=hospital, id=unit)
                                else:
                                    value_dict['Unit'] = None
                                value_dict['Building'] = None
                                value_dict['Floor'] = None
                                value_dict['Bed_No'] = None
                                value_dict['Hospital'] = hospital
                                value_dict['Availability'] = "Null"
                                bed = BedNo.objects.get_or_create(**value_dict)[0]
                            disease = request.POST.get('disease')
                            disease = Disease.objects.get_or_create(Disease=disease)[0]
                            book.Bed_No = bed
                            book.Disease = disease
                            book.Status = 'Admitted'
                            book.Admit_Time = zonetime.now()
                            book.Status_Changed_At = zonetime.now()
                            book.Hospital_Name = hospital
                            book.save()
                            if Bed_Id is not None and Bed_Id != '':
                                bed.Availability = 'Used'
                                bed.Booking_Id = book.Booking_ID
                                bed.Book_by =  book.Username
                                bed.Last_Update = zonetime.now()
                                bed.save()
                            BedNo.objects.filter(Booking_Id=bookid, Hospital=hospital, Availability='Book').update(Availability='Available', Book_by=None, Booking_Id=None, Last_Update=zonetime.now())
                            def sendConfirmation():
                                try:
                                    file = open('SMS_Templates/Admitted.txt')
                                    mes = file.read()
                                    file.close()
                                    mes = mes.replace("**bookingId**", bookid).replace("**hospitalName**", hospital.Name).replace("**hospitalTown**", hospital.City).replace("**hospitalDist**", hospital.District.Name).replace("**hospitalState**", hospital.State.Name).replace('**hospitalContact**', hospital.Emergency_Number)
                                    newThreadSMS = sendSMS(numbers=[book.Mobile, ], message=mes, template_id='1407166168558797879')
                                    newThreadSMS.start()
                                except Exception as e:
                                    print(e)
                                finally:
                                    return True
                            if bed.Building is not None and bed.Building != '':
                                bookBuilding = f" BUILDING: {bed.Building.Building};"
                            else:
                                bookBuilding = ''
                            if bed.Room is not None and bed.Room != '':
                                bookRoom = f" ROOM: {bed.Room.Room};"
                            else:
                                bookRoom = ''
                            if bed.Unit is not None and bed.Unit != '':
                                bookUnit = f" UNIT: {bed.Unit.Unit};"
                            else:
                                bookUnit = ''
                            if bookRoom != '' or bookUnit != '':
                                addBreak = "<br>"
                            else:
                                addBreak = ""
                            bed = f"WARD: {bed.Ward}; SUPPORT: {bed.Support};{addBreak}{bookRoom}{bookUnit}<br>FLOOR: {bed.Floor};{bookBuilding}"
                            context = {
                                'error': '0',
                                'status':'Admitted',
                                'bed': bed,
                                'url': settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', kwargs={'id': book.Booking_ID}),
                                'patientData': list(PatientData.objects.filter(Booking_ID=bookid).values('Booking_ID', 'Status', 'Disease__Disease', "Bed_No__Department__department", 'Bed_No__Bed_No', 'Bed_No__Ward', 'Bed_No__Support', 'Bed_No__Floor', "Bed_No__Room__Room", "Bed_No__Unit__Unit", "Bed_No__Building__Building", 'Booking_Time', 'Expire_Time', 'Admit_Time', 'Status_Changed_At')),
                            }
                            print(context)
                        elif status == "Release" and book.Status == "Admitted" and book.Hospital_Name == hospital:
                            BedNo.objects.filter(~Q(Availability="Null") & Q(Booking_Id=bookid, Hospital=hospital)).update(Availability='Available', Book_by=None, Booking_Id=None, Last_Update=zonetime.now())
                            book.Status = "Released"
                            book.Status_Changed_At = zonetime.now()
                            book.save()
                            def sendConfirmation():
                                try:
                                    file = open('SMS_Templates/Released.txt')
                                    mes = file.read()
                                    file.close()
                                    mes = mes.replace("**bookingId**", bookid).replace("**patientName**", book.Patient_Name).replace('**hospitalName**', hospital.Name).replace('**hospitalContact**', hospital.Emergency_Number)
                                    newThreadSMS = sendSMS(numbers=[book.Mobile, ], message=mes, template_id='')
                                    newThreadSMS.start()
                                except Exception as e:
                                    print(e)
                                finally:
                                    return True
                            context = {
                                'error': '0',
                                'status': 'Released',
                                'url': settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', kwargs={'id': book.Booking_ID}),
                                'patientData': list(PatientData.objects.filter(Booking_ID=bookid).values('Booking_ID', 'Status', 'Booking_Time', 'Expire_Time', 'Admit_Time', 'Status_Changed_At')),
                            }

                        elif status == "Died" and book.Status != 'Released' and book.Status != "Don't Need to Admit" and ((book.Status == 'Admitted' and book.Hospital_Name == hospital) or book.Status == 'Not Admit Still Now' or book.Status == "Referred"):
                            BedNo.objects.filter(~Q(Availability="Null") & Q(Booking_Id=bookid, Hospital=hospital)).update(Availability='Available', Book_by=None, Booking_Id=None, Last_Update=zonetime.now())
                            book.Status = "Died"
                            book.Status_Changed_At = zonetime.now()
                            book.Hospital_Name = hospital
                            book.save()
                            def sendConfirmation():
                                try:
                                    file = open('SMS_Templates/Patient_Died.txt')
                                    mes = file.read()
                                    file.close()
                                    mes = mes.replace("**patientId**", book.Booking_ID).replace("**patientName**", book.Patient_Name).replace("**hospitalName**", hospital.Name).replace("**hospitalContact**", hospital.Emergency_Number)
                                    newThreadSMS = sendSMS(numbers=[book.Mobile, ], message=mes, template_id='')
                                    newThreadSMS.start()
                                except Exception as e:
                                    print(e)
                                finally:
                                    return True
                            context = {
                                'error': '0',
                                'status': 'Died',
                                'url': settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', kwargs={'id': book.Booking_ID}),
                                'patientData': list(PatientData.objects.filter(Booking_ID=bookid).values('Booking_ID', 'Status', 'Booking_Time', 'Expire_Time', 'Admit_Time', 'Status_Changed_At')),
                            }

                        elif status == "Referred" and book.Status != 'Released' and book.Status != "Don't Need to Admit" and book.Status != "Died" and ((book.Status == 'Admitted' and book.Hospital_Name == hospital) or book.Status == 'Not Admit Still Now' or  book.Status == "Referred"):
                            if book.Status == 'Admitted':
                                admit_time = book.Admit_Time
                            else:
                                admit_time = None
                            BedNo.objects.filter(~Q(Availability="Null") & Q(Booking_Id=bookid, Hospital=hospital)).update(Availability='Available', Book_by=None, Booking_Id=None, Last_Update=zonetime.now())
                            referralHospital = request.POST.get('referralHospital')
                            referralHospital = Hospital.objects.get(id=referralHospital)
                            book.Status = "Referred"
                            book.Status_Changed_At = zonetime.now()
                            book.Hospital_Name = hospital
                            book.save()
                            r = ReferredPatient.objects.create(Referral_Hospital_From=book.Hospital_Name, Referral_Hospital_To=referralHospital, Patient=book, Bed=book.Bed_No, ReferredDate=zonetime.now())
                            r.Admit_Time = admit_time
                            r.save()
                            def sendConfirmation():
                                try:
                                    file = open('SMS_Templates/Patient_Referred.txt')
                                    mes = file.read()
                                    file.close()
                                    mes = mes.replace("**patientId**", book.Booking_ID).replace("**patientName**", book.Patient_Name).replace("**hospitalName**", hospital.Name).replace("**hospitalContact**", hospital.Emergency_Number).replace("**referralHospitalName**", referralHospital.Name).replace("**referralHospitalState**", referralHospital.State.Name).replace("**referralHospitalDistrict**", referralHospital.District.Name).replace("**referralHospitalSubdivision**", referralHospital.Subdivision).replace("**referralHospitalCity**", referralHospital.City).replace("**referralHospitalPin**", referralHospital.Pin).replace("**referralHospitalContact**", referralHospital.Emergency_Number)
                                    newThreadSMS = sendSMS(numbers=[book.Mobile, ], message=mes, template_id='')
                                    newThreadSMS.start()
                                except Exception as e:
                                    print(e)
                                finally:
                                    return True
                            context = {
                                'error': '0',
                                'status': 'Referred',
                                'url': settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', kwargs={'id': book.Booking_ID}),
                                'patientData': list(PatientData.objects.filter(Booking_ID=bookid).values('Booking_ID', 'Status', 'Booking_Time', 'Expire_Time', 'Admit_Time', 'Status_Changed_At')),
                            }

                        elif status == "Don't Need to Admit" and book.Status == "Not Admit Still Now":
                            BedNo.objects.filter(~Q(Availability="Null") & Q(Booking_Id=bookid, Hospital=hospital)).update(Availability='Available', Book_by=None, Booking_Id=None, Last_Update=zonetime.now())
                            book.Status = "Don't Need to Admit"
                            book.Bed_No = None
                            book.Status_Changed_At = zonetime.now()
                            book.save()
                            context = {
                                'error': '0',
                                'url': settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', kwargs={'id': book.Booking_ID}),
                                'status': "Don't Need to Admit",
                                'patientData': list(PatientData.objects.filter(Booking_ID=bookid).values('Booking_ID', 'Status', 'Booking_Time', 'Expire_Time', 'Admit_Time', 'Status_Changed_At')),
                            }
                        elif status == "Cancel" and book.Status == "Not Admit Still Now":
                            PatientData.objects.filter(Booking_ID=bookid).delete()
                            context = {
                                'error': '0',
                                'status': "Canceled",
                            }
                        def runAfterSuccess():
                            try:
                                BedNo.objects.filter(Q(Booking_Id=bookid, Hospital=hospital)).first().save()
                                sendConfirmation()
                            except Exception as e:
                                print(e)
                            finally:
                                return True
                        transaction.on_commit(runAfterSuccess)
                        print(context)
                        return JsonResponse(context)
        except Exception as e:
            traceback.print_exc()
            context = {}
            return JsonResponse(context)



@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def PatientEdit(request):
    if 'Hospital' in request.user.User_Type:
        try:
            bookid = request.POST.get('bookid')
            status = request.POST.get('status')
            with transaction.atomic(durable=True):
                book = PatientData.objects.get(Booking_ID=bookid)
                response_data = {}
                hospital = Hospital.objects.get(Username=request.user)
                response_data = {}
                if status == 'Release':
                    patient = PatientData.objects.get(Booking_ID=bookid, Hospital_Name=hospital, Status="Admitted")
                    patient.Status = "Released"
                    patient.Status_Changed_At = zonetime.now()
                    patient.save()
                    BedNo.objects.filter(~Q(Availability="Null") & Q(Booking_Id=bookid, Hospital=hospital)).update(Availability="Available", Book_by=None, Booking_Id=None, Last_Update=zonetime.now())
                    def sendConfirmation():
                        file = open('SMS_Templates/Released.txt')
                        mes = file.read()
                        file.close()
                        mes = mes.replace("**bookingId**", bookid).replace("**patientName**", book.Patient_Name).replace('**hospitalName**', hospital.Name).replace('**hospitalContact**', hospital.Emergency_Number)
                        newThreadSMS = sendSMS(numbers=[book.Mobile, ], message=mes, template_id='')
                        newThreadSMS.start()
                    response_data['success'] = "Release"
                    response_data['url'] = settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', kwargs={'id': book.Booking_ID})
                elif status == 'Referred':
                    referralHospital = request.POST.get('referralHospital')
                    referralHospital = Hospital.objects.get(id=referralHospital)
                    patient = PatientData.objects.get(Booking_ID=bookid, Hospital_Name=hospital, Status="Admitted")
                    patient.Status = "Referred"
                    patient.Status_Changed_At = zonetime.now()
                    patient.save()
                    ReferredPatient.objects.create(Referral_Hospital_From=patient.Hospital_Name, Referral_Hospital_To=referralHospital, Patient=patient, Bed=patient.Bed_No, Admit_Time=patient.Admit_Time, ReferredDate=zonetime.now())
                    BedNo.objects.filter(~Q(Availability="Null") & Q(Booking_Id=bookid, Hospital=hospital)).update(Availability="Available", Book_by=None, Booking_Id=None, Last_Update=zonetime.now())
                    def sendConfirmation():
                        file = open('SMS_Templates/Patient_Referred.txt')
                        mes = file.read()
                        file.close()
                        mes = mes.replace("**patientId**", book.Booking_ID).replace("**patientName**", book.Patient_Name).replace("**hospitalName**", hospital.Name).replace("**hospitalContact**", hospital.Emergency_Number).replace("**referralHospitalName**", referralHospital.Name).replace("**referralHospitalState**", referralHospital.State.Name).replace("**referralHospitalDistrict**", referralHospital.District.Name).replace("**referralHospitalSubdivision**", referralHospital.Subdivision).replace("**referralHospitalCity**", referralHospital.City).replace("**referralHospitalPin**", referralHospital.Pin).replace("**referralHospitalContact**", referralHospital.Emergency_Number)
                        newThreadSMS = sendSMS(numbers=[book.Mobile, ], message=mes, template_id='')
                        newThreadSMS.start()
                    response_data['success'] = "Referred"
                    response_data['url'] = settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', kwargs={'id': book.Booking_ID})
                elif status == 'Died':
                    patient = PatientData.objects.get(Booking_ID=bookid, Hospital_Name=hospital, Status="Admitted")
                    patient.Status = "Died"
                    patient.Status_Changed_At = zonetime.now()
                    patient.save()
                    BedNo.objects.filter(~Q(Availability="Null") & Q(Booking_Id=bookid, Hospital=hospital)).update(Availability="Available", Book_by=None, Booking_Id=None, Last_Update=zonetime.now())
                    def sendConfirmation():
                        file = open('SMS_Templates/Patient_Died.txt')
                        mes = file.read()
                        file.close()
                        mes = mes.replace("**patientId**", book.Booking_ID).replace("**patientName**", book.Patient_Name).replace("**hospitalName**", hospital.Name).replace("**hospitalContact**", hospital.Emergency_Number)
                        newThreadSMS = sendSMS(numbers=[book.Mobile, ], message=mes, template_id='')
                        newThreadSMS.start()
                    response_data['success'] = "Died"
                    response_data['url'] = settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', kwargs={'id': book.Booking_ID})
                elif status == "patient_shift":
                    disease = request.POST.get('disease')
                    disease = Disease.objects.get_or_create(Disease=disease)[0]
                    BedNo.objects.filter(~Q(Availability="Null") & Q(Booking_Id=bookid, Hospital=hospital)).update(Availability="Available", Book_by=None, Booking_Id=None, Last_Update=zonetime.now())
                    bedId = request.POST.get('Bed_Id')
                    previous_bed = book.Bed_No
                    bed = BedNo.objects.filter(id=bedId)
                    book.Bed_No = bed.first()
                    book.Disease = disease
                    book.save()
                    bed.update(Availability = "Used", Book_by = book.Username, Booking_Id = book.Booking_ID, Last_Update=zonetime.now())
                    bed = bed.first()
                    PatientShiftRecords.objects.create(patient=book, hospital=hospital, shift_form=previous_bed, shift_to=bed)
                    def sendConfirmation():
                        file = open('SMS_Templates/Bed_Changed.txt')
                        mes = file.read()
                        file.close()
                        room = bed.Room
                        if room is None:
                            room = ''
                        else:
                            room = room.Room
                        unit = bed.Unit
                        if unit is None:
                            unit = ''
                        else:
                            unit = unit.Unit
                        building = bed.Building
                        if building is None:
                            building = ''
                        else:
                            building = building.Building
                        mes = mes.replace("**patientId**", book.Booking_ID).replace("**patientName**", book.Patient_Name).replace("**hospitalContact**", hospital.Emergency_Number).replace("**department**", bed.Department.department).replace("**bed_no**", bed.Bed_No).replace("**ward**", bed.Ward).replace("**support**", bed.Support).replace("**room**", room).replace("**unit**", unit).replace("**building**", building).replace("**floor**", bed.Floor)
                        newThreadSMS = sendSMS(numbers=[book.Mobile, ], message=mes, template_id='')
                        newThreadSMS.start()
                    shiftToBed = list(BedNo.objects.filter(id=bedId).values('Department__department', 'Bed_No', 'Ward', 'Support', 'Room__Room', 'Unit__Unit', 'Building__Building', 'Floor'))[0]
                    response_data['name'] = book.Patient_Name
                    response_data['disease'] = disease.Disease
                    response_data['shiftToBed'] = shiftToBed
                    response_data['success'] = "change"
                    response_data['url'] = settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', kwargs={'id': book.Booking_ID})
                elif status == "change_disease":
                    disease = request.POST.get('disease')
                    disease = Disease.objects.get_or_create(Disease=disease)[0]
                    book.Disease = disease
                    book.save()
                    response_data['disease'] = disease.Disease
                def runAfterSuccess():
                    try:
                        BedNo.objects.filter(Q(Booking_Id=bookid, Hospital=hospital)).first().save()
                        sendConfirmation()
                    except Exception as e:
                        print(e)
                    finally:
                        return True
                transaction.on_commit(runAfterSuccess)
            return JsonResponse(response_data)
        except Exception as e:
            traceback.print_exc()
            context = {}
            return JsonResponse(context)

@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def referralpatientEdit(request):
    if 'Hospital' in request.user.User_Type:
        try:
            getId = request.POST.get('id')
            status = request.POST.get('status')
            Bed_Id = request.POST.get('Bed_Id')
            refer = ReferredPatient.objects.get(id=getId, Referral_Hospital_To__Username=request.user)
            with transaction.atomic(durable=True):
                refer.is_action_took = True
                refer.save()
                patient = refer.Patient
                response_data = {}
                hospital = Hospital.objects.get(Username=request.user)
                response_data = {}
                if status == 'Admit':
                    if Bed_Id is not None and Bed_Id != '':
                        bed = BedNo.objects.get(Hospital=hospital, id=Bed_Id, Availability__in=['Available'])
                    else:
                        value_dict = {}
                        department = request.POST.get('department')
                        value_dict['Department'] = HospitalDepartment.objects.get(id=department)
                        value_dict['Ward'] = request.POST.get('ward')
                        value_dict['Support'] = request.POST.get('requirement')
                        room = request.POST.get('room')
                        if room is not None and room != '':
                            value_dict['Room'] = HospitalRoom.objects.get(Hospital=hospital, id=room)
                        else:
                            value_dict['Room'] = None
                        unit = request.POST.get('unit')
                        if unit is not None and unit != '':
                            value_dict['Unit'] = HospitalRoom.objects.get(Hospital=hospital, id=unit)
                        else:
                            value_dict['Unit'] = None
                        value_dict['Building'] = None
                        value_dict['Floor'] = None
                        value_dict['Bed_No'] = None
                        value_dict['Hospital'] = hospital
                        value_dict['Availability'] = "Null"
                        bed = BedNo.objects.get_or_create(**value_dict)[0]
                    patient.Hospital_Name = hospital
                    patient.Bed_No = bed.first()
                    patient.Status = 'Admitted'
                    patient.Admit_Time = zonetime.now()
                    patient.Status_Changed_At = zonetime.now()
                    patient.save()
                    if Bed_Id is not None and Bed_Id != '':
                        bed.Availability = "Used"
                        bed.Book_by = patient.Username
                        bed.Booking_Id = patient.Booking_ID
                        bed.Last_Update = zonetime.now()
                        bed.save()
                    def sendConfirmation():
                        file = open('SMS_Templates/Admitted.txt')
                        mes = file.read()
                        file.close()
                        mes = mes.replace("**bookingId**", patient.Booking_ID).replace("**hospitalName**", hospital.Name).replace("**hospitalTown**", hospital.City).replace("**hospitalDist**", hospital.District.Name).replace("**hospitalState**", hospital.State.Name).replace('**hospitalContact**', hospital.Emergency_Number)
                        newThreadSMS = sendSMS(numbers=[patient.Mobile, ], message=mes, template_id='1407166168558797879')
                        newThreadSMS.start()
                    response_data['success'] = "Admitted"
                    response_data['url'] = settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', kwargs={'id': patient.Booking_ID})
                elif status == 'Release':
                    patient.Hospital_Name = hospital
                    patient.Status = 'Released'
                    patient.Bed_No = None
                    patient.Status_Changed_At = zonetime.now()
                    patient.save()
                    def sendConfirmation():
                        file = open('SMS_Templates/Released.txt')
                        mes = file.read()
                        file.close()
                        mes = mes.replace("**bookingId**", patient.Booking_ID).replace("**patientName**", patient.Patient_Name).replace('**hospitalName**', hospital.Name).replace('**hospitalContact**', hospital.Emergency_Number)
                        newThreadSMS = sendSMS(numbers=[patient.Mobile, ], message=mes, template_id='')
                        newThreadSMS.start()
                    response_data['success'] = "Released"
                    response_data['url'] = settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', kwargs={'id': patient.Booking_ID})
                elif status == 'Referred':
                    referralHospital = request.POST.get('referralHospital')
                    referralHospital = Hospital.objects.get(id=referralHospital)
                    patient.Hospital_Name = hospital
                    patient.Status = 'Referred'
                    patient.Status_Changed_At = zonetime.now()
                    patient.Bed_No = None
                    patient.save()
                    r = ReferredPatient.objects.create(Referral_Hospital_From=hospital, Referral_Hospital_To=referralHospital, Patient=patient, Bed=None, ReferredDate=zonetime.now())
                    r.Admit_Time = None
                    r.save()
                    def sendConfirmation():
                        file = open('SMS_Templates/Patient_Referred.txt')
                        mes = file.read()
                        file.close()
                        mes = mes.replace("**patientId**", patient.Booking_ID).replace("**patientName**", patient.Patient_Name).replace("**hospitalName**", hospital.Name).replace("**hospitalContact**", hospital.Emergency_Number).replace("**referralHospitalName**", referralHospital.Name).replace("**referralHospitalState**", referralHospital.State.Name).replace("**referralHospitalDistrict**", referralHospital.District.Name).replace("**referralHospitalSubdivision**", referralHospital.Subdivision).replace("**referralHospitalCity**", referralHospital.City).replace("**referralHospitalPin**", referralHospital.Pin).replace("**referralHospitalContact**", referralHospital.Emergency_Number)
                        newThreadSMS = sendSMS(numbers=[patient.Mobile, ], message=mes, template_id='')
                        newThreadSMS.start()
                    response_data['success'] = "Referred"
                    response_data['url'] = settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', kwargs={'id': patient.Booking_ID})
                elif status == 'Died':
                    patient.Hospital_Name = hospital
                    patient.Status = 'Died'
                    patient.Bed_No = None
                    patient.Status_Changed_At = zonetime.now()
                    patient.save()
                    def sendConfirmation():
                        file = open('SMS_Templates/Patient_Died.txt')
                        mes = file.read()
                        file.close()
                        mes = mes.replace("**patientId**", patient.Booking_ID).replace("**patientName**", patient.Patient_Name).replace("**hospitalName**", hospital.Name).replace("**hospitalContact**", hospital.Emergency_Number)
                        newThreadSMS = sendSMS(numbers=[patient.Mobile, ], message=mes, template_id='')
                        newThreadSMS.start()
                    response_data['success'] = "Died"
                    response_data['url'] = settings.SITE_URL + reverse('Go_Healthy_App:BookStatus', kwargs={'id': patient.Booking_ID})
                def runAfterSuccess():
                    try:
                        BedNo.objects.filter(Q(Hospital=hospital, id=Bed_Id)).first().save()
                        sendConfirmation()
                    except Exception as e:
                        print(e)
                    finally:
                        return True
                transaction.on_commit(runAfterSuccess)
            return JsonResponse(response_data)
        except Exception as e:
            traceback.print_exc()
            context = {}
            return JsonResponse(context)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def patientUpdate(request):
    patient_id = request.POST.get('patient_id')
    name = firstCharOfEachWordCapital(request.POST.get('name'))
    age = request.POST.get('age')
    gender = request.POST.get('gender')
    email = request.POST.get('email').lower()
    mobile = request.POST.get('mobile')
    alternative_mobile = request.POST.get('alternative_mobile')
    pin = request.POST.get('pin')
    subdivision = request.POST.get('subdivision')
    state = request.POST.get('state')
    district = request.POST.get('district')
    patient = PatientData.objects.get(Booking_ID=patient_id)
    if patient.Is_Unknown:
        PatientData.objects.filter(Booking_ID=patient_id).update(Patient_Name=name, Email=email, Mobile=mobile, Alternative_Mobile=alternative_mobile, Age=age, Subdivision=subdivision, State=state, District=district, Pin=pin, Gender=gender, Is_Unknown=False)
        patient = PatientData.objects.get(Booking_ID=patient_id)
        response_data = {
            'success': True,
            'patient': serialize('json', [patient, ]),
        }
        return JsonResponse(response_data)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def hospitalgeneralEdit(request):
    if request.method == "POST":
        hospitalType = request.POST.get('type')
        ownership = request.POST.get('ownership')
        name = firstCharOfEachWordCapital(request.POST.get('name'))
        address = firstCharOfEachWordCapital(request.POST.get('address'))
        state = request.POST.get('state')
        district = request.POST.get('district')
        city = firstCharOfEachWordCapital(request.POST.get('city'))
        subdivision = firstCharOfEachWordCapital(request.POST.get('subdivision'))
        pin = request.POST.get('pin')
        latitude = request.POST.get("latitude")
        longitude = request.POST.get("longitude")
        state = States.objects.get(Name=state)
        district = Districts.objects.get(Name=district, state=state)
        hospital = Hospital.objects.get(Username=request.user)
        hospital.Name = name
        hospital.Type = hospitalType
        hospital.Ownership = ownership
        hospital.Address = address
        hospital.State = state
        hospital.Subdivision = subdivision
        hospital.City = city
        hospital.District = district
        hospital.Pin = pin
        hospital.Latitude = latitude
        hospital.Longitude = longitude
        hospital.save()
        return JsonResponse(request.POST)



@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def HospitalContactEdit(request):
    response_data = {}
    if 'Hospital' in request.user.User_Type:
        user = Users.objects.get(username=request.user.username)
        website = request.POST.get('website', '')
        emergency_number = request.POST.get('emergency')
        toll_free = request.POST.get('toll_free', '')
        helpline = request.POST.get('helpline', '')
        other_contacts = request.POST.get('other_contacts').split(',')
        
        mobile = request.POST.get('mobile')
        mobileOTP = request.POST.get('mobileOTP')
        email = request.POST.get('email').lower()
        emailOTP = request.POST.get('emailOTP')
        invalidEmailOtp = False
        invalidMobileOtp = False
        emailExists = False
        mobileExists = False
        if email != user.email:
            if OTP.objects.filter(Email=email, EmailOTP=emailOTP, Send_For="Profile Edit", Is_Verified=False).exists():
                if Users.objects.filter(email=email).exists() == False:
                    OTP.objects.filter(Email=email, Send_For="Profile Edit").delete()
                else:
                    emailExists = True
            else:
                invalidEmailOtp = True
        if mobile != user.Contact:
            if OTP.objects.filter(Mobile=mobile, MobileOTP=mobileOTP, Send_For="Profile Edit", Is_Verified=False).exists():
                if Users.objects.filter(Contact=mobile).exists() == False:
                    OTP.objects.filter(Mobile=mobile, Send_For="Profile Edit").delete()
                else:
                    mobileExists = True
            else:
                invalidMobileOtp = True
        if not emailExists and not mobileExists and not invalidEmailOtp and not invalidMobileOtp:
            user.email = email
            user.Contact = mobile
            user.save()
            Hospital.objects.filter(Username=request.user).update(Website=website, Emergency_Number=emergency_number, Toll_Free_Number=toll_free, Helpline_Number=helpline, Contacts=other_contacts)
        response_data['emailExists'] = emailExists
        response_data['mobileExists'] = mobileExists
        response_data['invalidEmailOtp'] = invalidEmailOtp
        response_data['invalidMobileOtp'] = invalidMobileOtp
    return JsonResponse(response_data)




@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def updateAntivenom(request):
    if 'Hospital' in request.user.User_Type:
        hospital = Hospital.objects.get(Username=request.user)
        hospitalId = request.POST.get('hospitalId')
        error = "1"
        if hospitalId == hospital.Unique_Id:
            if hospital.Has_Antivenom == 'Yes':
                hospital.Has_Antivenom = 'No'
                hospital.save()
                error = '0'
            else:
                hospital.Has_Antivenom = 'Yes'
                hospital.save()
                error = '0'
        response_data = {
            'error': error,
            'antivenom': hospital.Has_Antivenom
        }
        return JsonResponse(response_data)



@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def reserveBooking(request):
    if 'Hospital' in request.user.User_Type:
        try:
            with transaction.atomic(durable=True):
                hospital = Hospital.objects.filter(Username=request.user)
                bedNo = request.POST.get('bedNo')
                if bedNo is not None and bedNo != '':
                    response_data = {}
                    BedNo.objects.filter(Availability='Reserved', Book_by=request.user).update(Availability='Available', Book_by=None, Last_Update=zonetime.now())
                    if BedNo.objects.get(id=bedNo, Hospital=hospital.first()).Availability == "Available":
                        bedsUpdates = BedNo.objects.filter(Q(id=bedNo, Hospital=hospital.first()) & ~Q(Availability="Null"))
                        bedsUpdates.update(Availability='Reserved', Book_by=request.user, Last_Update=zonetime.now())
                        response_data['error'] = "0"
                        response_data['message'] = "Bed Reserved for 15 minutes. Now fill up the bellow form"
                    else:
                        response_data['error'] = "1"
                    def runAfterSuccess():
                        try:
                            BedNo.objects.filter(id=bedNo).first().save()
                        except Exception as e:
                            print(e)
                        finally:
                            return True
                    transaction.on_commit(runAfterSuccess)
                else:
                    response_data = {}
                    response_data['error'] = "00"
                    response_data['message'] = "No bed is selected. So no bed will be allocate for the admitted patient."
            return JsonResponse(response_data)
        except Exception as e:
            traceback.print_exc()
            context = {}
            return JsonResponse(context)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_safe
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def admitSearch(request):
    if 'Hospital' in request.user.User_Type:
        filter_value1 = {}
        bookId = request.GET.get('bookingId', '')
        name = request.GET.get('name', '')
        mobile = request.GET.get('mobile', '')
        department = request.GET.get('department', '')
        ward = request.GET.get('ward', '')
        requirement = request.GET.get('requirement', '')
        bedNo = request.GET.get('bedNo', '')
        room = request.GET.get('room', '')
        unit = request.GET.get('unit', '')
        building = request.GET.get('building', '')
        admitDateFrom = request.GET.get('admitDateFrom', '')
        admitDateTo = request.GET.get('admitDateTo', '')
        page_no = int(request.GET.get('page', '1'))
        
        page_size = 50
        start = (page_no-1)*page_size
        end = page_no*page_size

        hospital = Hospital.objects.filter(Username=request.user).first()

        filter_value1['Booking_ID'] = bookId
        filter_value1['Patient_Name__icontains'] = name
        filter_value1['Mobile'] = mobile
        filter_value1['Bed_No__Department'] = department
        filter_value1['Bed_No__Ward'] = ward
        filter_value1['Bed_No__Support'] = requirement
        filter_value1['Bed_No__Bed_No'] = bedNo
        filter_value1['Bed_No__Building__id'] = building
        filter_value1['Bed_No__Room__id'] = room
        filter_value1['Bed_No__Unit__id'] = unit

        if admitDateFrom != '' and admitDateTo != '':
            filter_value1['Admit_Time__date__gte'] = admitDateFrom
            filter_value1['Admit_Time__date__lte'] = admitDateTo
        elif admitDateFrom != '':
            filter_value1['Admit_Time__date'] = admitDateFrom
        elif admitDateTo != '':
            filter_value1['Admit_Time__date'] = admitDateTo
        kwargs = {}
        for k, v in filter_value1.items():
            if v != '':
                kwargs[k] = v
        admitBook = list(PatientData.objects.filter(Hospital_Name=hospital, Status='Admitted').filter(**kwargs).order_by('-Admit_Time')[start:end].values('Booking_ID', 'Patient_Name', 'Disease__Disease', 'Email', 'Mobile', 'Alternative_Mobile', 'Subdivision', 'State', 'District', 'Pin', 'Gender', 'Age', "Bed_No__Department__department", 'Bed_No__Bed_No', 'Bed_No__Ward', 'Bed_No__Support', 'Bed_No__Floor', "Bed_No__Room__Room", "Bed_No__Unit__Unit", "Bed_No__Building__Building", 'Status', 'Is_Unknown', 'Admit_Time'))
        context = {
            "admitBook": admitBook,
            'is_last': len(admitBook) < page_size,
        }
        return JsonResponse(context)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_safe
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def referSearch(request):
    if 'Hospital' in request.user.User_Type:
        filter_value1 = {}
        bookId = request.GET.get('bookingId', '')
        name = request.GET.get('name', '')
        mobile = request.GET.get('mobile', '')
        department = request.GET.get('department', '')
        ward = request.GET.get('ward', '')
        requirement = request.GET.get('requirement', '')
        bedNo = request.GET.get('bedNo', '')
        room = request.GET.get('room', '')
        unit = request.GET.get('unit', '')
        building = request.GET.get('building', '')
        admitDateFrom = request.GET.get('admitDateFrom', '')
        admitDateTo = request.GET.get('admitDateTo', '')
        referDateFrom = request.GET.get('referDateFrom', '')
        referDateTo = request.GET.get('referDateTo', '')
        page_no = int(request.GET.get('page', '1'))
        
        page_size = 50
        start = (page_no-1)*page_size
        end = page_no*page_size

        hospital = Hospital.objects.filter(Username=request.user).first()

        kwargs = {}

        filter_value1['Patient__Booking_ID'] = bookId
        filter_value1['Patient__Patient_Name__icontains'] = name
        filter_value1['Patient__Mobile'] = mobile
        filter_value1['Bed_No__Department'] = department
        filter_value1['Bed_No__Ward'] = ward
        filter_value1['Bed_No__Support'] = requirement
        filter_value1['Bed_No__Bed_No'] = bedNo
        filter_value1['Bed_No__Building__id'] = building
        filter_value1['Bed_No__Room__id'] = room
        filter_value1['Bed_No__Unit__id'] = unit

        if admitDateFrom != '' and admitDateTo != '':
            filter_value1['Admit_Time__date__gte'] = admitDateFrom
            filter_value1['Admit_Time__date__lte'] = admitDateTo
        elif admitDateFrom != '':
            filter_value1['Admit_Time__date'] = admitDateFrom
        elif admitDateTo != "":
            filter_value1['Admit_Time__date'] = admitDateTo

        if referDateFrom != '' and referDateTo != '':
            filter_value1['ReferredDate__date__gte'] = referDateFrom
            filter_value1['ReferredDate__date__lte'] = referDateTo
        elif referDateFrom != '':
            filter_value1['ReferredDate__date'] = referDateFrom
        elif referDateTo != '':
            filter_value1['ReferredDate__date'] = referDateTo

        for k, v in filter_value1.items():
            if v != '':
                kwargs[k] = v
        referredBook = list(ReferredPatient.objects.filter(Referral_Hospital_From=hospital).filter(**kwargs)[start:end].values('Patient__Booking_ID', 'Patient__Patient_Name', 'Patient__Disease__Disease', 'Patient__Email', 'Patient__Mobile', 'Patient__Alternative_Mobile', 'Patient__Subdivision', 'Patient__State', 'Patient__District', 'Patient__Pin', 'Patient__Gender', 'Patient__Age', 'Patient__Status_Changed_At', "Bed__Department__department", 'Bed__Bed_No', 'Bed__Ward', 'Bed__Support', 'Bed__Floor', "Bed__Room__Room", "Bed__Unit__Unit", "Bed__Building__Building", 'Patient__Status', 'Referral_Hospital_To__Name', 'Referral_Hospital_To__City', 'Referral_Hospital_To__Subdivision', 'Referral_Hospital_To__State__Name', 'Referral_Hospital_To__District__Name', 'Referral_Hospital_To__Pin', 'Referral_Hospital_To__Emergency_Number', 'is_action_took', 'Admit_Time', 'ReferredDate', 'Patient__Hospital_Name__Name', 'Patient__Hospital_Name__City', 'Patient__Hospital_Name__Subdivision', 'Patient__Hospital_Name__State__Name', 'Patient__Hospital_Name__District__Name', 'Patient__Hospital_Name__Pin', 'Patient__Hospital_Name__Emergency_Number',))

        context = {
            "referredBook": referredBook,
            'is_last': len(referredBook) < page_size,
        }
        return JsonResponse(context)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_safe
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def pastPatientsSearch(request):
    if 'Hospital' in request.user.User_Type:
        filter_value1 = {}
        bookId = request.GET.get('bookingId', '')
        name = request.GET.get('name', '')
        mobile = request.GET.get('mobile', '')
        department = request.GET.get('department', '')
        ward = request.GET.get('ward', '')
        requirement = request.GET.get('requirement', '')
        bedNo = request.GET.get('bedNo', '')
        room = request.GET.get('room', '')
        unit = request.GET.get('unit', '')
        building = request.GET.get('building', '')
        admitDateFrom = request.GET.get('admitDateFrom', '')
        admitDateTo = request.GET.get('admitDateTo', '')
        statusUpdateDateFrom = request.GET.get('statusUpdateDateFrom', '')
        statusUpdatedDateTo = request.GET.get('statusUpdatedDateTo', '')
        page_no = int(request.GET.get('page', '1'))
        
        page_size = 50
        start = (page_no-1)*page_size
        end = page_no*page_size

        hospital = Hospital.objects.filter(Username=request.user).first()
    
        kwargs = {}

        filter_value1['Booking_ID'] = bookId
        filter_value1['Patient_Name__icontains'] = name
        filter_value1['Mobile'] = mobile
        filter_value1['Bed_No__Department'] = department
        filter_value1['Bed_No__Ward'] = ward
        filter_value1['Bed_No__Support'] = requirement
        filter_value1['Bed_No__Bed_No'] = bedNo
        filter_value1['Bed_No__Building__id'] = building
        filter_value1['Bed_No__Room__id'] = room
        filter_value1['Bed_No__Unit__id'] = unit

        if admitDateFrom != '' and admitDateTo != '':
            filter_value1['Admit_Time__date__gte'] = admitDateFrom
            filter_value1['Admit_Time__date__lte'] = admitDateTo
        elif admitDateFrom != '':
            filter_value1['Admit_Time__date'] = admitDateFrom
        elif admitDateTo != '':
            filter_value1['Admit_Time__date'] = admitDateTo

        if statusUpdateDateFrom != '' and statusUpdatedDateTo != '':
            filter_value1['Status_Changed_At__date__gte'] = statusUpdateDateFrom
            filter_value1['Status_Changed_At__date__lte'] = statusUpdatedDateTo
        elif statusUpdateDateFrom != '':
            filter_value1['Status_Changed_At__date'] = statusUpdateDateFrom
        elif statusUpdatedDateTo != '':
            filter_value1['Status_Changed_At__date'] = statusUpdatedDateTo
        
        for k, v in filter_value1.items():
            if v != '':
                kwargs[k] = v
        pastPatients = list(PatientData.objects.filter(Hospital_Name=hospital, Status__in=['Released', 'Died']).filter(**kwargs).order_by('-Status_Changed_At')[start:end].values('Booking_ID', 'Patient_Name', 'Disease__Disease', 'Email', 'Mobile', 'Alternative_Mobile', 'Subdivision', 'State', 'District', 'Pin', 'Gender', 'Age', "Bed_No__Department__department", 'Bed_No__Bed_No', 'Bed_No__Ward', 'Bed_No__Support', 'Bed_No__Floor', "Bed_No__Room__Room", "Bed_No__Unit__Unit", "Bed_No__Building__Building", 'Status', 'Admit_Time', 'Status_Changed_At'))

        context = {
            "pastPatients": pastPatients,
            'is_last': len(pastPatients) < page_size,
        }
        return JsonResponse(context)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_safe
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def referralPatientSearch(request):
    if 'Hospital' in request.user.User_Type:
        filter_value1 = {}
        bookId = request.GET.get('bookingId', '')
        name = request.GET.get('name', '')
        mobile = request.GET.get('mobile', '')
        referDateFrom = request.GET.get('referDateFrom', '')
        referDateTo = request.GET.get('referDateTo', '')
        page_no = int(request.GET.get('page', '1'))
        
        page_size = 50
        start = (page_no-1)*page_size
        end = page_no*page_size

        hospital = Hospital.objects.filter(Username=request.user).first()

        filter_value1['Patient__Booking_ID'] = bookId
        filter_value1['Patient__Patient_Name__icontains'] = name
        filter_value1['Patient__Mobile'] = mobile

        if referDateFrom != '' and referDateTo != '':
            filter_value1['ReferredDate__date__gte'] = referDateFrom
            filter_value1['ReferredDate__date__lte'] = referDateTo
        elif referDateFrom != '':
            filter_value1['ReferredDate__date'] = referDateFrom
        elif referDateTo != '':
            filter_value1['ReferredDate__date'] = referDateTo
    
        kwargs = {}
        for k, v in filter_value1.items():
            if v != '':
                kwargs[k] = v
        referralBook = list(ReferredPatient.past_few_days_objects.filter(Referral_Hospital_To=hospital, is_action_took=False).filter(**kwargs)[start:end].values('id', 'Patient__Booking_ID', 'Patient__Patient_Name', 'Patient__Disease__Disease', 'Patient__Email', 'Patient__Mobile', 'Patient__Alternative_Mobile', 'Patient__Subdivision', 'Patient__State', 'Patient__District', 'Patient__Pin', 'Patient__Gender', 'Patient__Age', 'Referral_Hospital_From__Name', 'Referral_Hospital_From__City', 'Referral_Hospital_From__Subdivision', 'Referral_Hospital_From__State__Name', 'Referral_Hospital_From__District__Name', 'Referral_Hospital_From__Pin', 'Referral_Hospital_From__Emergency_Number', 'ReferredDate'))

        context = {
            "referralBook": referralBook,
            'is_last': len(referralBook) < page_size,
        }
        return JsonResponse(context)

@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def hospitalImageChange(request):
    pic = request.FILES.get('picture')
    cont_type = str(pic.content_type)
    cont_type = cont_type.split('/')
    if cont_type[0] != 'image':
        success = '0'
        message = 'It is not a valid Image File!'
    elif pic.size > 5242880:
        success = '0'
        message = 'Image size should be maximum 5 MB'
    else:
        hos = Hospital.objects.get(Username=request.user)
        hos.Image = pic
        hos.save()
        success = '1',
        message = 'Image Changed'
    context = {
        "message": message,
        "success": success,
    }
    return JsonResponse(context)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_safe
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def fetchBedInfo(request):
    hospital = Hospital.objects.get(Username=request.user)
    beds = BedNo.objects.filter(~Q(Availability="Null") & Q(Hospital=hospital))
    total_beds = beds.count()
    available_beds = beds.filter(Availability='Available').count()
    context = {
        'total_beds': total_beds,
        'available_beds': available_beds,
    }
    return JsonResponse(context)
    
    
    
@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_safe
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def getBedData(request):
    get_value = {}
    get_value['Department__id'] = request.GET.get('department', '')
    get_value['Room__id'] = request.GET.get('room', '')
    get_value['Unit__id'] = request.GET.get('unit', '')
    get_value['Building__id'] = request.GET.get('building', '')
    fiterValue = {}
    for k, v in get_value.items():
        if v != '' and v != None:
            fiterValue[k] = v
    hospital = Hospital.objects.get(Username=request.user)
    beds = BedNo.objects.filter(~Q(Availability="Null") & Q(Hospital=hospital)).filter(**fiterValue)
    total_beds_count = beds.count()
    available_beds_count = beds.filter(Availability='Available').count()
    used_beds_count = beds.filter(Availability='Used').count()
    booked_beds_count = beds.filter(Availability='Book').count()
    try:
        available_beds_percent = round(((available_beds_count/total_beds_count)*100), 1)
    except ZeroDivisionError:
        available_beds_percent = 0
    try:
        used_beds_percent = round(((used_beds_count/total_beds_count)*100), 1)
    except ZeroDivisionError:
        used_beds_percent = 0
    
    
    female_O2_total = beds.filter(Ward='Female Ward', Support='With Oxygen')
    female_O2_available = beds.filter(Ward='Female Ward', Support='With Oxygen', Availability='Available')
    female_O2_used = beds.filter(Ward='Female Ward', Support='With Oxygen', Availability='Used')
    female_O2_booked = beds.filter(Ward='Female Ward', Support='With Oxygen', Availability='Book')
    
    female_NonO2_total = beds.filter(Ward='Female Ward', Support='Non-Oxygen')
    female_NonO2_available = beds.filter(Ward='Female Ward', Support='Non-Oxygen', Availability='Available')
    female_NonO2_used = beds.filter(Ward='Female Ward', Support='Non-Oxygen', Availability='Used')
    female_NonO2_booked = beds.filter(Ward='Female Ward', Support='Non-Oxygen', Availability='Book')
    
    female_total = beds.filter(Ward='Female Ward')
    female_available = beds.filter(Ward='Female Ward', Availability='Available')
    female_used = beds.filter(Ward='Female Ward', Availability='Used')
    female_booked = beds.filter(Ward='Female Ward', Availability='Book')
    
    male_O2_total = beds.filter(Ward='Male Ward', Support='With Oxygen')
    male_O2_available = beds.filter(Ward='Male Ward', Support='With Oxygen', Availability='Available')
    male_O2_used = beds.filter(Ward='Male Ward', Support='With Oxygen', Availability='Used')
    male_O2_booked = beds.filter(Ward='Male Ward', Support='With Oxygen', Availability='Book')
    
    male_NonO2_total = beds.filter(Ward='Male Ward', Support='Non-Oxygen')
    male_NonO2_available = beds.filter(Ward='Male Ward', Support='Non-Oxygen', Availability='Available')
    male_NonO2_used = beds.filter(Ward='Male Ward', Support='Non-Oxygen', Availability='Used')
    male_NonO2_booked = beds.filter(Ward='Male Ward', Support='Non-Oxygen', Availability='Book')
    
    male_total = beds.filter(Ward='Male Ward')
    male_available = beds.filter(Ward='Male Ward', Availability='Available')
    male_used = beds.filter(Ward='Male Ward', Availability='Used')
    male_booked = beds.filter(Ward='Male Ward', Availability='Book')
    
    child_O2_total = beds.filter(Ward='Child Ward', Support='With Oxygen')
    child_O2_available = beds.filter(Ward='Child Ward', Support='With Oxygen', Availability='Available')
    child_O2_used = beds.filter(Ward='Child Ward', Support='With Oxygen', Availability='Used')
    child_O2_booked = beds.filter(Ward='Child Ward', Support='With Oxygen', Availability='Book')
    
    child_NonO2_total = beds.filter(Ward='Child Ward', Support='Non-Oxygen')
    child_NonO2_available = beds.filter(Ward='Child Ward', Support='Non-Oxygen', Availability='Available')
    child_NonO2_used = beds.filter(Ward='Child Ward', Support='Non-Oxygen', Availability='Used')
    child_NonO2_booked = beds.filter(Ward='Child Ward', Support='Non-Oxygen', Availability='Book')
    
    child_total = beds.filter(Ward='Child Ward')
    child_available = beds.filter(Ward='Child Ward', Availability='Available')
    child_used = beds.filter(Ward='Child Ward', Availability='Used')
    child_booked = beds.filter(Ward='Child Ward', Availability='Book')
    
    icu_Ventilation_total = beds.filter(Ward='ICU', Support='With Ventilator')
    icu_Ventilation_available = beds.filter(Ward='ICU', Support='With Ventilator', Availability='Available')
    icu_Ventilation_used = beds.filter(Ward='ICU', Support='With Ventilator', Availability='Used')
    icu_Ventilation_booked = beds.filter(Ward='ICU', Support='With Ventilator', Availability='Book')
    
    icu_NonVentilation_total = beds.filter(Ward='ICU', Support='Non-Ventilator')
    icu_NonVentilation_available = beds.filter(Ward='ICU', Support='Non-Ventilator', Availability='Available')
    icu_NonVentilation_used = beds.filter(Ward='ICU', Support='Non-Ventilator', Availability='Used')
    icu_NonVentilation_booked = beds.filter(Ward='ICU', Support='Non-Ventilator', Availability='Book')
    
    icu_total = beds.filter(Ward='ICU')
    icu_available = beds.filter(Ward='ICU', Availability='Available')
    icu_used = beds.filter(Ward='ICU', Availability='Used')
    icu_booked = beds.filter(Ward='ICU', Availability='Book')
    
    picu_Ventilation_total = beds.filter(Ward='PICU', Support='With Ventilator')
    picu_Ventilation_available = beds.filter(Ward='PICU', Support='With Ventilator', Availability='Available')
    picu_Ventilation_used = beds.filter(Ward='PICU', Support='With Ventilator', Availability='Used')
    picu_Ventilation_booked = beds.filter(Ward='PICU', Support='With Ventilator', Availability='Book')
    
    picu_NonVentilation_total = beds.filter(Ward='PICU', Support='Non-Ventilator')
    picu_NonVentilation_available = beds.filter(Ward='PICU', Support='Non-Ventilator', Availability='Available')
    picu_NonVentilation_used = beds.filter(Ward='PICU', Support='Non-Ventilator', Availability='Used')
    picu_NonVentilation_booked = beds.filter(Ward='PICU', Support='Non-Ventilator', Availability='Book')
    
    picu_total = beds.filter(Ward='PICU')
    picu_available = beds.filter(Ward='PICU', Availability='Available')
    picu_used = beds.filter(Ward='PICU', Availability='Used')
    picu_booked = beds.filter(Ward='PICU', Availability='Book')
    
    nicu_Ventilation_total = beds.filter(Ward='NICU', Support='With Ventilator')
    nicu_Ventilation_available = beds.filter(Ward='NICU', Support='With Ventilator', Availability='Available')
    nicu_Ventilation_used = beds.filter(Ward='NICU', Support='With Ventilator', Availability='Used')
    nicu_Ventilation_booked = beds.filter(Ward='NICU', Support='With Ventilator', Availability='Book')
    
    nicu_NonVentilation_total = beds.filter(Ward='NICU', Support='Non-Ventilator')
    nicu_NonVentilation_available = beds.filter(Ward='NICU', Support='Non-Ventilator', Availability='Available')
    nicu_NonVentilation_used = beds.filter(Ward='NICU', Support='Non-Ventilator', Availability='Used')
    nicu_NonVentilation_booked = beds.filter(Ward='NICU', Support='Non-Ventilator', Availability='Book')
    
    nicu_total = beds.filter(Ward='NICU')
    nicu_available = beds.filter(Ward='NICU', Availability='Available')
    nicu_used = beds.filter(Ward='NICU', Availability='Used')
    nicu_booked = beds.filter(Ward='NICU', Availability='Book')
    
    values_list = ["id", "Department__department", "Bed_No", "Room__id", "Room__Room", "Unit__id", "Unit__Unit", "Floor", "Ward", "Building__id", "Building__Building", "Support", "Availability"]
    all_available_beds = list(beds.filter(Availability='Available').values(*values_list))
    values_list_for_used_beds = values_list.copy()
    values_list_for_used_beds.extend(['bed_patientData__Admit_Time', 'bed_patientData__Booking_Time', 'bed_patientData__Expire_Time'])
    values_list_for_booked_beds = values_list.copy()
    values_list_for_booked_beds.extend(['bed_patientData__Booking_Time', 'bed_patientData__Expire_Time'])
    if 'Hospital' in request.user.User_Type:
        more_used_bed_values = ['bed_patientData__Booking_ID', 'bed_patientData__Patient_Name', 'bed_patientData__Email', 'bed_patientData__Mobile', 'bed_patientData__Alternative_Mobile', 'bed_patientData__Age', 'bed_patientData__Gender', 'bed_patientData__Subdivision', 'bed_patientData__State', 'bed_patientData__District', 'bed_patientData__Pin']
        values_list_for_used_beds.extend(more_used_bed_values)
        more_booked_bed_values = ['bed_patientData__Mobile', 'bed_patientData__Alternative_Mobile']
        values_list_for_booked_beds.extend(more_booked_bed_values)

    all_booked_beds = list(beds.filter(Availability='Book').values(*values_list_for_used_beds))
    all_used_beds = list(beds.filter(Availability='Used').values(*values_list_for_used_beds))

    last_updated_object = beds.order_by('-Last_Update').first()
    lastUpdate = ''
    if last_updated_object is not None:
        lastUpdate = last_updated_object.Last_Update
    context = {
        'total_beds_count': total_beds_count,
        'available_beds_count': available_beds_count,
        'used_beds_count': used_beds_count,
        'booked_beds_count': booked_beds_count,
        'available_beds_percent': available_beds_percent,
        'used_beds_percent': used_beds_percent,
        'lastUpdate': str(lastUpdate),
        
        'female_O2_total': female_O2_total.count(),
        'female_O2_available': female_O2_available.count(),
        'female_O2_used': female_O2_used.count(),
        'female_O2_booked': female_O2_booked.count(),
        
        'female_NonO2_total': female_NonO2_total.count(),
        'female_NonO2_available': female_NonO2_available.count(),
        'female_NonO2_used': female_NonO2_used.count(),
        'female_NonO2_booked': female_NonO2_booked.count(),
        
        'female_total': female_total.count(),
        'female_available': female_available.count(),
        'female_used': female_used.count(),
        'female_booked': female_booked.count(),
        
        'male_O2_total': male_O2_total.count(),
        'male_O2_available': male_O2_available.count(),
        'male_O2_used': male_O2_used.count(),
        'male_O2_booked': male_O2_booked.count(),
        
        'male_NonO2_total': male_NonO2_total.count(),
        'male_NonO2_available': male_NonO2_available.count(),
        'male_NonO2_used': male_NonO2_used.count(),
        'male_NonO2_booked': male_NonO2_booked.count(),
        
        'male_total': male_total.count(),
        'male_available': male_available.count(),
        'male_used': male_used.count(),
        'male_booked': male_booked.count(),
        
        'child_O2_total': child_O2_total.count(),
        'child_O2_available': child_O2_available.count(),
        'child_O2_used': child_O2_used.count(),
        'child_O2_booked': child_O2_booked.count(),
        
        'child_NonO2_total': child_NonO2_total.count(),
        'child_NonO2_available': child_NonO2_available.count(),
        'child_NonO2_used': child_NonO2_used.count(),
        'child_NonO2_booked': child_NonO2_booked.count(),
        
        'child_total': child_total.count(),
        'child_available': child_available.count(),
        'child_used': child_used.count(),
        'child_booked': child_booked.count(),
        
        'icu_Ventilation_total': icu_Ventilation_total.count(),
        'icu_Ventilation_available': icu_Ventilation_available.count(),
        'icu_Ventilation_used': icu_Ventilation_used.count(),
        'icu_Ventilation_booked': icu_Ventilation_booked.count(),
        
        'icu_NonVentilation_total': icu_NonVentilation_total.count(),
        'icu_NonVentilation_available': icu_NonVentilation_available.count(),
        'icu_NonVentilation_used': icu_NonVentilation_used.count(),
        'icu_NonVentilation_booked': icu_NonVentilation_booked.count(),
        
        'icu_total': icu_total.count(),
        'icu_available': icu_available.count(),
        'icu_used': icu_used.count(),
        'icu_booked': icu_booked.count(),
        
        'picu_Ventilation_total': picu_Ventilation_total.count(),
        'picu_Ventilation_available': picu_Ventilation_available.count(),
        'picu_Ventilation_used': picu_Ventilation_used.count(),
        'picu_Ventilation_booked': picu_Ventilation_booked.count(),
        
        'picu_NonVentilation_total': picu_NonVentilation_total.count(),
        'picu_NonVentilation_available': picu_NonVentilation_available.count(),
        'picu_NonVentilation_used': picu_NonVentilation_used.count(),
        'picu_NonVentilation_booked': picu_NonVentilation_booked.count(),
        
        'picu_total': picu_total.count(),
        'picu_available': picu_available.count(),
        'picu_used': picu_used.count(),
        'picu_booked': picu_booked.count(),
        
        'nicu_Ventilation_total': nicu_Ventilation_total.count(),
        'nicu_Ventilation_available': nicu_Ventilation_available.count(),
        'nicu_Ventilation_used': nicu_Ventilation_used.count(),
        'nicu_Ventilation_booked': nicu_Ventilation_booked.count(),
        
        'nicu_NonVentilation_total': nicu_NonVentilation_total.count(),
        'nicu_NonVentilation_available': nicu_NonVentilation_available.count(),
        'nicu_NonVentilation_used': nicu_NonVentilation_used.count(),
        'nicu_NonVentilation_booked': nicu_NonVentilation_booked.count(),
        
        'nicu_total': nicu_total.count(),
        'nicu_available': nicu_available.count(),
        'nicu_used': nicu_used.count(),
        'nicu_booked': nicu_booked.count(),
        
        'all_available_beds': all_available_beds,
        'all_used_beds': all_used_beds,
        'all_booked_beds': all_booked_beds,
        
        'floor_list': floor_ch,
        'normalWard_list': normalWard_list,
        'wardList': ward_ch,
        'department_list': list(HospitalDepartment.objects.all().values_list('department', flat=True)),
        'room_list': list(HospitalRoom.objects.filter(Hospital=hospital).values_list('Room', flat=True)),
        'unit_list': list(HospitalUnit.objects.filter(Hospital=hospital).values_list('Unit', flat=True)),
        'building_list': list(HospitalBuilding.objects.filter(Hospital=hospital).values_list('Building', flat=True)),
        
        'oxygen_remain': hospital.Oxygen_Remaining_Time,
    }
    return JsonResponse(context)




# @login_required(login_url=settings.LOGIN_URL)
# @user_passes_test(checkUserStatus)
# @require_safe
# @ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
# def UserNextBook(request):
#     response_data = {}
#     if request.user.is_authenticated:
#         timeZoneOffset = request.COOKIES.get('TimeZoneOffset')
#         timeZoneOffset = float(timeZoneOffset)
#         if(request.user.User_Type in ['Normal', 'Doctor', 'Blood Donor', 'Blood Donor & Doctor']):
#             userbook = PatientData.objects.filter(Username=request.user, Status='Not Admit Still Now')
#             if userbook.exists():
#                 nexttime = userbook.first().Expire_Time
#                 response_data['nexttime'] = nexttime
#                 response_data['message'] = "0"
#             else:
#                 response_data['message'] = "1"
#         else:
#             response_data['message'] = "1"
#     else:
#         response_data['message'] = "1"

#     return JsonResponse(response_data)



@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def bloodBankGeneralEdit(request):
    if request.method == "POST":
        ownership = request.POST.get('ownership')
        name = firstCharOfEachWordCapital(request.POST.get('name'))
        address = firstCharOfEachWordCapital(request.POST.get('address'))
        state = request.POST.get('state')
        district = request.POST.get('district')
        city = firstCharOfEachWordCapital(request.POST.get('city'))
        subdivision = firstCharOfEachWordCapital(request.POST.get('subdivision'))
        pin = request.POST.get('pin')
        latitude = request.POST.get("latitude")
        longitude = request.POST.get("longitude")
        state = States.objects.get(Name=state)
        district = Districts.objects.get(Name=district, state=state)
        bloodbank = BloodBank.objects.filter(Username=request.user)
        bloodbank.Name = name
        bloodbank.Ownership = ownership
        bloodbank.Address = address
        bloodbank.Subdivision = subdivision
        bloodbank.City = city
        bloodbank.District = district
        bloodbank.Pin = pin
        bloodbank.Latitude = latitude
        bloodbank.Longitude = longitude
        bloodbank.save()
        return JsonResponse(request.POST)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def BloodBankContactEdit(request):
    response_data = {}
    if 'Blood Bank' in request.user.User_Type:
        user = Users.objects.get(username=request.user.username)
        website = request.POST.get('website', '')
        emergency_number = request.POST.get('emergency')
        toll_free = request.POST.get('toll_free', '')
        helpline = request.POST.get('helpline', '')
        other_contacts = request.POST.get('other_contacts').split(',')
        mobile = request.POST.get('mobile')
        mobileOTP = request.POST.get('mobileOTP')
        email = request.POST.get('email').lower()
        emailOTP = request.POST.get('emailOTP')
        invalidEmailOtp = False
        invalidMobileOtp = False
        emailExists = False
        mobileExists = False
        if email != user.email:
            if OTP.objects.filter(Email=email, EmailOTP=emailOTP, Send_For="Profile Edit", Is_Verified=False).exists():
                if Users.objects.filter(email=email).exists() == False:
                    OTP.objects.filter(Email=email, Send_For="Profile Edit").delete()
                else:
                    emailExists = True
            else:
                invalidEmailOtp = True
        if mobile != user.Contact:
            if OTP.objects.filter(Mobile=mobile, MobileOTP=mobileOTP, Send_For="Profile Edit", Is_Verified=False).exists():
                if Users.objects.filter(Contact=mobile).exists() == False:
                    OTP.objects.filter(Mobile=mobile, Send_For="Profile Edit").delete()
                else:
                    mobileExists = True
            else:
                invalidMobileOtp = True
        if not emailExists and not mobileExists and not invalidEmailOtp and not invalidMobileOtp:
            user.email = email
            user.Contact = mobile
            user.save()
            BloodBank.objects.filter(Username=request.user).update(Website=website, Emergency_Number=emergency_number, Toll_Free_Number=toll_free, Helpline_Number=helpline, Contacts=other_contacts)
        response_data['emailExists'] = emailExists
        response_data['mobileExists'] = mobileExists
        response_data['invalidEmailOtp'] = invalidEmailOtp
        response_data['invalidMobileOtp'] = invalidMobileOtp
    return JsonResponse(response_data)



@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_http_methods(["GET", "POST"])
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def MyBookings(request):
    user = Users.objects.get(username=request.user.username)
    response_data = {}
    response_data['error'] = "1"
    try:
        with transaction.atomic(durable=True):
            if request.method == 'POST':
                bookId = request.POST.get('bookId')
                book = PatientData.objects.filter(Booking_ID=bookId, Username=request.user, Status='Not Admit Still Now')
                hospitalId = book.first().Hospital_Name.id
                if book.exists():
                    bedsUpdates = BedNo.objects.filter(Q(Booking_Id=bookId) & ~Q(Availability="Null"))
                    bedsUpdates.update(Availability='Available', Book_by=None, Booking_Id=None, Last_Update=zonetime.now())
                    PatientData.objects.filter(Booking_ID=bookId).delete()
                    if PatientData.objects.filter(Username=user).exclude(Status='Expired').exclude(Booked_By='Hospital Authority').count() > 0:
                        haveBook = '1'
                    else:
                        haveBook = '0'
                    response_data['error']= "0"
                    response_data['id'] = bookId
                    response_data['haveBook'] = haveBook
                else:
                    response_data['error'] = "1"
                return JsonResponse(response_data)
            else:
                bookings = PatientData.objects.filter(Username=user).exclude(Status='Expired').exclude(Booked_By='Hospital Authority')
                context = {
                    'bookings':bookings,
                    'count':bookings.count(),
                }
                return render(request, 'mybook.html', context)
    except Exception as e:
        traceback.print_exc()



@require_safe
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def LoadSpeciality(request):
    degree = request.GET.get('degree')
    speciality = list(Specialities.objects.filter(Degree__id=degree).values('id', 'Speciality'))
    response_data = {}
    response_data['speciality'] = speciality
    return JsonResponse(response_data)




@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def OTPSendReg(request):
    email = request.POST.get('email', '').lower()
    contact = request.POST.get('contact', '')
    sendTo = request.POST.get('sendTo')
    response_data = {}
    response_data['error'] = "1"
    if request.method == 'POST':
        if email != '' or contact != '':
            if sendTo == 'email':
                emailOTP = generateOTP(6)
                OTP.objects.filter(Email=email, Send_For='Registration').delete()
                OTP.objects.create(Email=email, EmailOTP=emailOTP, Is_Verified=False, Send_For='Registration')
                file = open('Email_Templates/User/Registration_otp.html')
                mes = file.read()
                file.close()
                mes = mes.replace("**myotp**", emailOTP).replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", email)
                subject = 'OTP For Registration'
                body = ' '
                htmlMessage = mes
                sender = settings.DEFAULT_FROM_EMAIL
                receiver = [
                    {
                        "email": email,
                    }
                ]
                newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, messageGroup="Register_OTP")
                newThreadEmail.start()
                response_data['error'] = "0"
            if sendTo == 'mobile':
                mobileOTP = generateOTP(6)
                OTP.objects.filter(Mobile=contact, Send_For='Registration').delete()
                OTP.objects.create(Mobile=contact, MobileOTP=mobileOTP, Is_Verified=False, Send_For='Registration')
                file = open('SMS_Templates/Registration_OTP.txt')
                mes = file.read()
                file.close()
                mes = mes.replace("**yourOTP**", mobileOTP)
                newThreadSMS = sendSMS(numbers=[contact, ], message=mes, template_id='1407166168721838446')
                newThreadSMS.start()
                response_data['error'] = "0"
        else:
            response_data['error'] = "1"
        response_data['email'] = email
        response_data['contact'] = contact
    return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def OTPVerifyReg(request):
    enteredOTP = request.POST.get('otp', '')
    email = request.POST.get('email', '').lower()
    contact = request.POST.get('contact', '')
    verificationFor = request.POST.get('verificationFor')
    response_data = {}
    if request.method == 'POST':
        if len(enteredOTP) != 6:
            response_data['error'] = "1"
            response_data['message'] = "Please enter OTP"
        elif verificationFor == 'Email':
            if OTP.objects.filter(Email=email, EmailOTP=enteredOTP, Is_Verified=False, Send_For='Registration').exists():
                otp = OTP.objects.get(Email=email, EmailOTP=enteredOTP, Is_Verified=False, Send_For='Registration')
                otp.Is_Verified = True
                otp.save()
                response_data['error'] = "0"
            else:
                response_data['error'] = "1"
                response_data['message'] = "Invalid OTP!"
        elif verificationFor == 'Mobile':
            if len(enteredOTP) != 6:
                response_data['error'] = "1"
                response_data['message'] = "Please enter OTP"
            elif OTP.objects.filter(Mobile=contact, MobileOTP=enteredOTP, Is_Verified=False, Send_For='Registration').exists():
                otp = OTP.objects.get(Mobile=contact, MobileOTP=enteredOTP, Is_Verified=False, Send_For='Registration')
                otp.Is_Verified = True
                otp.save()
                response_data['error'] = "0"
            else:
                response_data['error'] = "1"
                response_data['message'] = "Invalid OTP!"
        return JsonResponse(response_data)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def OTPSendBloodRequest(request):
    mobile = request.POST.get('mobile')
    response_data = {}
    if request.method == 'POST':
        if (mobile is None or mobile == ''):
            response_data['error'] = "1"
        else:
            mobileOTP = generateOTP(6)
            OTP.objects.filter(Mobile=mobile, Send_For='Blood Request').delete()

            OTP.objects.create(Mobile=mobile, MobileOTP=mobileOTP, Is_Verified=False, Send_For='Blood Request')
            file = open('SMS_Templates/Blood_Request_OTP.txt')
            mes = file.read()
            file.close()
            mes = mes.replace("**yourOTP**", mobileOTP)
            newThreadSMS = sendSMS(numbers=[mobile,], message=mes, template_id='1407166168706622021')
            newThreadSMS.start()

            response_data['error'] = "0"
        response_data['mobile'] = mobile
    return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def UsernameValid(request):
    username = firstCharacterCapital(request.POST.get('username'))
    data = usernameValidation(username)
    return JsonResponse(data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def EmailValid(request):
    email = request.POST.get('email').lower()
    data = EmailValidation(email=email)
    return JsonResponse(data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def AgeCheck(request):
    dob = request.POST.get('dob')
    data = ageCheck(dob)
    return JsonResponse(data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def registrationNoCheck(request):
    registrationNo = request.POST.get('registrationNo')
    checkExistency = Users.objects.filter(ID_Type="Doctor's Registration", ID_Number=registrationNo).exists()
    response_data = {
        'exists': checkExistency,
        'message': "Doctor with this registration number already registered"
    }
    return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def Passwordcheck(request):
    password = str(request.POST.get('password'))
    Username_with = request.POST.get('username')
    validation_errors = passwordValidation(password, Username_with)
    return JsonResponse(validation_errors)



@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate='10/h', block=True)
@transaction.atomic(durable=True)
def PasswordChange(request):
    user_email = request.user.email
    old_password = request.POST.get('old_password')
    new_password1 = request.POST.get('new_password1')
    new_password2 = request.POST.get('new_password2')
    matchPassword = check_password(old_password, request.user.password)
    validation_errors = passwordValidation(new_password1, request.user.username)
    error = {}
    password_errors = []
    responseData = {}
    if matchPassword == False:
        error = {
            'error_code': '002',
            'error_message': "Incorrect old Password",
            'input_error': True,
        }
        password_errors.append(error)
    if new_password1 != new_password2:
        error = {
            'error_code': '002',
            'error_message': "New Password and Confirm Password didn't match",
            'input_error': True,
        }
        password_errors.append(error)
    elif validation_errors['password_error'] != 'No Error':
        password_errors += validation_errors['password_error']
    elif new_password1 == old_password:
        error = {
            'error_code': '003',
            'error_message': "New Password and Old Password can't be same",
            'input_error': True,
        }
        password_errors.append(error)
    elif matchPassword == True:
        data = {
            "old_password":old_password,
            "new_password1":new_password1,
            "new_password2":new_password2,
        }
        form = UsersPaswordChangeForm(request.user, data)
        if form.is_valid():
            new = form.save()
            logoff_all(request.user)
            logout(request)
            file = open('Email_Templates/User/Password_Changed.html')
            mes = file.read()
            mes = mes.replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**reset_password_url**", reverse('Go_Healthy_App:ResetPassword')).replace("**messageSentTo**", user_email)
            file.close()
            subject = 'Password Has Been Changed'
            body = ' '
            htmlMessage = mes
            sender = settings.DEFAULT_FROM_EMAIL
            receiver = [
                {
                    "email": user_email,
                    "name": request.user.username
                }
            ]
            newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, messageGroup="Password_Changed")
            newThreadEmail.start()
            responseData = {
                'password_error': 'No Error',
                'login_url': reverse('Go_Healthy_App:LoginMain'),
            }
            return JsonResponse(responseData)
        else:
            #error_message = form.errors
            error = {
                'error_code': '001',
                'error_message': "Invalid Input!",
                'input_error': True,
            }
            password_errors.append(error)
            responseData = {
                'password_error': password_errors,
            }
    return JsonResponse(responseData)


@prevent_anonymous_ip
@require_http_methods(["GET", "POST"])
@ratelimit(key='ip', rate='10/d', block=True)
@transaction.atomic(durable=True)
def ResetPassword(request, code):
    if ResetPasswordCode.objects.filter(Code=code).exists() == False:
        nocode = True
        context = {
            'nocode': nocode,
        }
        return render(request, 'resetpasswordlink.html', context)
    else:
        codedata = ResetPasswordCode.objects.get(Code=code)
        locationPermission = request.POST.get('locationPermission')
        if request.method == 'POST' and locationPermission == 'granted':
            password1 = request.POST.get('password1')
            password2 = request.POST.get('password2')

            latitude = request.POST.get('latitude')
            longitude = request.POST.get('longitude')  

            user = Users.objects.get(username=codedata.Username.username)
            person = user.username
            validation_errors = passwordValidation(password1, person)
            if password1 != password2:
                error = {
                    'error_code': '001',
                    'error_message': "Password and Confirm Password didn't match",
                }
                validation_errors['password_error'] = [error,]
                return JsonResponse(validation_errors)
            else:
                if validation_errors['password_error'] == 'No Error':
                    user.set_password(password1)
                    user.save()

                    geoAddress = addressFromCord(latitude, longitude)
                    client_ip, is_routable = get_client_ip(request)

                    userDevice = request.user_agent.device.family
                    userOSFamily = request.user_agent.os.family
                    userOSVersion = request.user_agent.os.version_string
                    userBrowserFamily = request.user_agent.browser.family
                    userBrowserVersion = request.user_agent.browser.version_string

                    userDeviceDetails = userDevice+" (OS: "+userOSFamily+", OS-Version: "+userOSVersion+")"
                    userBrowserDetails = userBrowserFamily+"(version-"+userBrowserVersion+")"

                    userIpInfo = getUserIpInfo(client_ip)
                    security = userIpInfo.get('security', {})
                    location = userIpInfo.get('location', {})
                    network = userIpInfo.get('network', {})

                    file = open('Email_Templates/User/Reset_Password_Success.html')
                    mes = file.read()
                    mes = mes.replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", user.email)
                    file.close()
                    replaces = {
                        "**Login_Time**": zonetime.now().strftime("%d %B %Y, %I:%M %p"),
                        "**Login_Device**": userDeviceDetails,
                        "**Login_Browser**": userBrowserDetails,
                        "**Login_geo_latitude**": latitude,
                        "**Login_geo_longitude**": longitude,
                        "**Login_geo_pin**": geoAddress.get('pin', 'Unknown'),
                        "**Login_geo_city**": geoAddress.get('city', 'Unknown'),
                        "**Login_geo_state**": geoAddress.get('state', 'Unknown'),
                        "**Login_geo_district**": geoAddress.get('district', 'Unknown'),
                        "**Login_geo_country**": geoAddress.get('country', 'Unknown'),
                        "**Login_IP**": client_ip,
                        "**Login_isp**": str(network.get('autonomous_system_organization', 'Unknown')).replace("AS for GPRS Service", ""),
                        "**Login_ip_city**": location.get('city', 'Unknown'),
                        "**Login_ip_region**": location.get('region', 'Unknown'),
                        "**Login_ip_country**": location.get('country', 'Unknown'),
                        "**Login_ip_latitude**": location.get('latitude', 'Unknown'),
                        "**Login_ip_longitude**": location.get('longitude', 'Unknown'),
                        "**Login_ip_vpn**": security.get('vpn', 'Unknown'),
                        "**Login_ip_proxy**": security.get('proxy', 'Unknown'),
                        "**Login_ip_tor**": security.get('tor', 'Unknown'),
                        "**Login_ip_relay**": security.get('relay', 'Unknown'),
                    }
                    for key, value in replaces.items():
                        mes = mes.replace(key, value)
                    subject = 'Reset Password Success'
                    body = ' '
                    htmlMessage = mes
                    sender = settings.DEFAULT_FROM_EMAIL
                    receiver = [
                        {
                            "email": user.email,
                            "name": user.username
                        }
                    ]
                    newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, messageGroup="Password_Reset")
                    newThreadEmail.start()
                    logoff_all(user)
                    logout(request)
                    #ResetPasswordCode.objects.filter(Code=code).delete()
                    context = {
                        'password_error': 'No Error',
                        'login_url': reverse('Go_Healthy_App:LoginMain')
                    }
                    return JsonResponse(context)
        else:
            context = {
                'username':codedata.Username,
                'uniqueCode': code
            }
            return render(request, 'resetpasswordlink.html', context)



@require_http_methods(["GET", "POST"])
@ratelimit(key='ip', rate='10/d', block=True)
@transaction.atomic(durable=True)
def ResetPasswordLink(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email').lower()
        try:
            user = Users.objects.get(username=username, email=email)
            if not user.is_active:
                error = '2'
                message = "Your account is deactivated!"
            elif not user.is_verified:
                error = '2'
                message = "Your account is not verified yet!"
            else:
                code = str(secrets.token_urlsafe(75))
                ResetPasswordCode.objects.filter(Username=user).delete()
                ResetPasswordCode.objects.create(Username=user, Code=code)
                file = open('Email_Templates/User/Reset_Password_Link.html')
                mes = file.read()
                file.close()
                mes = mes.replace('**resetPasswordLink**', reverse('Go_Healthy_App:ResetPasswordDone', kwargs={'code': code})).replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", email)
                subject = 'Reset Password Link'
                body = ' '
                htmlMessage = mes
                sender = settings.DEFAULT_FROM_EMAIL
                receiver = [
                    {
                        "email": email,
                        "name": user.username
                    }
                ]
                newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, messageGroup="Password_Reset_Link")
                newThreadEmail.start()
                error = '0'
                message = "Reset password link has been sent to your email"
        except Users.DoesNotExist:
            error = '1'
            message = "Invalid username or email."
        data = {
            'error': error,
            'message': message,
        }
        return JsonResponse(data)
    else:
        return render(request, 'resetpassword.html')


@require_http_methods(["GET", "POST"])
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def RegisterDonor(request):
    if request.method == 'POST':
        username = firstCharacterCapital(request.POST.get('username'))
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        email = request.POST.get('email').lower()
        name = firstCharOfEachWordCapital(request.POST.get('name'))
        gender = request.POST.get('gender')
        dob = request.POST.get('dob')
        bloodGroup = request.POST.get('bloodGroup')
        contact = request.POST.get('contact')
        idType = request.POST.get('idType')
        idNumber = request.POST.get('idNumber').upper()
        permanent_address = firstCharOfEachWordCapital(request.POST.get('permanent_address'))
        permanent_state = request.POST.get('permanent_state')
        permanent_city = firstCharOfEachWordCapital(request.POST.get('permanent_city'))
        permanent_subdivision = firstCharOfEachWordCapital(request.POST.get('permanent_subdivision'))
        permanent_district = request.POST.get('permanent_district')
        permanent_pin = request.POST.get('permanent_pin')
        address = firstCharOfEachWordCapital(request.POST.get('address'))
        state = request.POST.get('state', '')
        city = firstCharOfEachWordCapital(request.POST.get('city'))
        subdivision = firstCharOfEachWordCapital(request.POST.get('subdivision'))
        district = request.POST.get('district', '')
        pin = request.POST.get('pin')
        pic = request.FILES.get('picture')
        cont_type = str(pic.content_type)
        cont_type = cont_type.split('/')
        sameCurrent = request.POST.get('samecurrent', False)
        showPic = request.POST.get('picShow')
        if sameCurrent == 'on':
            state = permanent_state
            district = permanent_district
        if showPic == 'on':
            showPic = True
        else:
            showPic = False
        data = []
        no = 0
        try:
            with transaction.atomic(durable=True):
                validateUsername = usernameValidation(username)
                if validateUsername['hasError']:
                    no += 1
                    context = {
                        "no": no,
                        "error": '1',
                        "message": validateUsername['message']
                    }
                    data.append(context)

                validateEmail = EmailValidation(email=email, checkExistency=True)
                if OTP.objects.filter(Email=email, Is_Verified=True, Send_For='Registration').exists() == False:
                    no += 1
                    context = {
                        "no": no,
                        "error": '2',
                        "message": "Verify your Email Id"
                    }
                    data.append(context)
                elif validateEmail['hasError'] == '1':
                    no += 1
                    context = {
                        "no": no,
                        "error": '3',
                        "message": validateEmail['message']
                    }
                    data.append(context)

                if OTP.objects.filter(Mobile=contact, Is_Verified=True, Send_For='Registration').exists() == False:
                    no += 1
                    context = {
                        "no": no,
                        "error": '4',
                        "message": "Verify your Mobile Number"
                    }
                    data.append(context)
                elif Users.objects.filter(Contact=contact).exists():
                    no += 1
                    context = {
                        "no": no,
                        "error": "5",
                        "message": "Please check your contact info!",
                    }
                    data.append(context)
                
                validatePassword = passwordValidation(password1, username)
                if password1 != password2:
                    no += 1
                    context = {
                        "no": no,
                        "error": '6',
                        "message": "Password and Confirm Password didn't match"
                    }
                    data.append(context)
                elif validatePassword['password_error'] != 'No Error':
                    no += 1
                    context = {
                        "no": no,
                        "error": '6',
                        "message": validatePassword.password_error,
                        "validationError": True,
                    }
                    data.append(context)

                if cont_type[0] != 'image':
                    no += 1
                    context = {
                        "no": no,
                        "error": '7',
                        "message": "Please select an Image File"
                    }
                    data.append(context)
                elif pic.size > 5242880:
                    no += 1
                    context = {
                        "no": no,
                        "error": '8',
                        "message": "Image size should be maximum 5 MB"
                    }
                    data.append(context)

                if Users.objects.filter(ID_Number=idNumber, ID_Type=idType).exists():
                    no += 1
                    context = {
                        "no": no,
                        "error": '9',
                        "message": "We have found misinformation in your given data!",
                    }
                    data.append(context)
                
                validateAge = ageCheck(dob)
                if validateAge['error'] == "1":
                    no += 1
                    context = {
                        "no": no,
                        "error": '10',
                        "message": "You are not eligible to be a blood donor.<br>Your age must be between 18 and 65 years.<br>Your current age is "+str(data.age)
                    }
                    data.append(context)

                if len(data) > 0:
                    response_data = {
                        'data': data,
                    }
                    return JsonResponse(response_data)

                datauser = {
                    "username":username,
                    "email":email,
                    "password1":password1,
                    "password2":password2,
                    "Contact":contact,
                    "ID_Type":idType,
                    "ID_Number":idNumber, 
                }
                formuser = UsersCreationForm(datauser)
                if formuser.is_valid() and len(data) <= 0:
                    new = formuser.save(commit=False)
                    new.display_profile_pic = showPic
                    new.User_Type = ['Blood Donor']
                    new.save()
                    newuser = Users.objects.get(username=new.username)
                    state = States.objects.get(Name=state)
                    district = Districts.objects.get(Name=district, state=state)
                    permanent_state = States.objects.get(Name=permanent_state)
                    permanent_district = Districts.objects.get(Name=permanent_district, state=permanent_state)
                    Blood_Donar.objects.create(Username=newuser, Name=name, Gender=gender, Date_of_Birth=dob, Blood_Group=bloodGroup, Address=address, State=state, City=city, Subdivision=subdivision, District=district, Pin=pin, Permanent_Address=permanent_address, Permanent_State=permanent_state, Permanent_City=permanent_city, Permanent_Subdivision=permanent_subdivision, Permanent_District=permanent_district, Permanent_Pin=permanent_pin, Image=pic)
                    def sendConfirmation():
                        try:
                            file = open('Email_Templates/User/Registration_Success_Mail.html')
                            mes = file.read()
                            file.close()
                            mes = mes.replace("**myusername**", username).replace("**myemail**", email).replace("**mycontact**", contact).replace("**user**", "Blood Donor").replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", email)
                            subject = 'Registration Successful'
                            body = ' '
                            htmlMessage = mes
                            sender = settings.DEFAULT_FROM_EMAIL
                            receiver = [
                                {
                                    "email": email,
                                    "name": name
                                }
                            ]
                            uniqueId = "Donor_Register-" + str(username)
                            newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, uniqueID=uniqueId, messageGroup="Donor_Registered")
                            newThreadEmail.start()
                        except Exception as e:
                            print(e)
                        finally:
                            return True
                    transaction.on_commit(sendConfirmation)
                    OTP.objects.filter(Email=email, Send_For='Registration').delete()
                    OTP.objects.filter(Mobile=contact, Send_For='Registration').delete()
                    no += 1
                    context = {
                        "no": no,
                        "error": '0',
                        "userType": "Blood Donor",
                        "message": "Registered",
                    }
                    return JsonResponse(context)
                else:
                    formError = str(formuser.errors)
                    no += 1
                    context = {
                        "no": no,
                        "error": '001',
                        "message": "We have found wrong input! Correct it first",
                    }
                    return JsonResponse(context)
        except Exception as e:
            print(e)
            no += 1
            context = {
                "no": no,
                "error": '002',
                "message": "Server Error! Try again after some time.",
            }
            return JsonResponse(context)
    else:
        context = {
            "error":"0",
            "states": States.objects.all(),
            'bloodGroups': blood_groups,
        }
        return render(request, 'registerdonor.html', context)


@require_http_methods(["GET", "POST"])
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def RegisterDoctor(request):
    if request.method == 'POST':
        donor = request.POST.get('donor')
        bloodGroup = request.POST.get('bloodGroup')
        username = firstCharacterCapital(request.POST.get('username'))
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        email = request.POST.get('email').lower()
        name = firstCharOfEachWordCapital(request.POST.get('name'))
        gender = request.POST.get('gender')
        dob = request.POST.get('dob', '')
        registrationNo = request.POST.get('registrationNo').upper()
        contact = request.POST.get('contact')
        degree = request.POST.get('degree')
        specialty = request.POST.get('speciality')
        permanent_address = firstCharOfEachWordCapital(request.POST.get('permanent_address'))
        permanent_state = request.POST.get('permanent_state')
        permanent_city = firstCharOfEachWordCapital(request.POST.get('permanent_city'))
        permanent_subdivision = firstCharOfEachWordCapital(request.POST.get('permanent_subdivision'))
        permanent_district = request.POST.get('permanent_district')
        permanent_pin = request.POST.get('permanent_pin')
        address = firstCharOfEachWordCapital(request.POST.get('address'))
        state = request.POST.get('state', '')
        city = firstCharOfEachWordCapital(request.POST.get('city'))
        subdivision = firstCharOfEachWordCapital(request.POST.get('subdivision'))
        district = request.POST.get('district', '')
        pin = request.POST.get('pin')
        pic = request.FILES.get('picture')
        cont_type = str(pic.content_type)
        cont_type = cont_type.split('/')
        showPic = request.POST.get('picShow')
        sameCurrent = request.POST.get('samecurrent', False)
        if sameCurrent == 'on':
            state = permanent_state
            district = permanent_district
        if showPic == 'on':
            showPic = True
        else:
            showPic = False
        data = []
        no = 0
        try:
            with transaction.atomic(durable=True):
                validateUsername = usernameValidation(username)
                if validateUsername['hasError']:
                    no += 1
                    context = {
                        "no": no,
                        "error": '1',
                        "message": validateUsername['message']
                    }
                    data.append(context)

                validateEmail = EmailValidation(email=email, checkExistency=True)
                if OTP.objects.filter(Email=email, Is_Verified=True, Send_For='Registration').exists() == False:
                    no += 1
                    context = {
                        "no": no,
                        "error": '2',
                        "message": "Verify your Email Id"
                    }
                    data.append(context)
                elif validateEmail['hasError'] == '1':
                    no += 1
                    context = {
                        "no": no,
                        "error": '3',
                        "message": validateEmail['message']
                    }
                    data.append(context)

                if OTP.objects.filter(Mobile=contact, Is_Verified=True, Send_For='Registration').exists() == False:
                    no += 1
                    context = {
                        "no": no,
                        "error": '4',
                        "message": "Verify your Mobile Number"
                    }
                    data.append(context)
                elif Users.objects.filter(Contact=contact).exists():
                    no += 1
                    context = {
                        "no": no,
                        "error": "5",
                        "message": "Please check your contact info!",
                    }
                    data.append(context)
                
                validatePassword = passwordValidation(password1, username)
                if password1 != password2:
                    no += 1
                    context = {
                        "no": no,
                        "error": '6',
                        "message": "Password and Confirm Password didn't match"
                    }
                    data.append(context)
                elif validatePassword['password_error'] != 'No Error':
                    no += 1
                    context = {
                        "no": no,
                        "error": '6',
                        "message": validatePassword.password_error,
                        "validationError": True,
                    }
                    data.append(context)

                if cont_type[0] != 'image':
                    no += 1
                    context = {
                        "no": no,
                        "error": '7',
                        "message": "Please select an Image File"
                    }
                    data.append(context)
                elif pic.size > 5242880:
                    no += 1
                    context = {
                        "no": no,
                        "error": '8',
                        "message": "Image size should be maximum 5 MB"
                    }
                    data.append(context)

                if Users.objects.filter(ID_Number=registrationNo, ID_Type="Doctor's Registration").exists():
                    no += 1
                    context = {
                        "no": no,
                        "error": '9',
                        "Registration_No_Not_Matched": True,
                        "message": "Doctor with this registration number already registered",
                    }
                    data.append(context)

                if dob != '':
                    validateAge = ageCheck(dob)
                    if validateAge['error'] == "1":
                        no += 1
                        context = {
                            "no": no,
                            "error": '10',
                            "message": "You are not eligible to be a blood donor.<br>Your age must be between 18 and 65 years.<br>Your current age is "+str(data.age)
                        }
                        data.append(context)

                if len(data) > 0:
                    response_data = {
                        'data': data,
                    }
                    print(response_data)
                    return JsonResponse(response_data)

                datauser = {
                    "username": username,
                    "email": email,
                    "password1": password1,
                    "password2": password2,
                    "Contact": contact,
                    "ID_Type": "Doctor's Registration",
                    "ID_Number":registrationNo,
                }
                formuser = UsersCreationForm(datauser)
                if formuser.is_valid():
                    usertype = None
                    new = formuser.save(commit=False)
                    new.display_profile_pic = showPic
                    if donor == "BloodDonor":
                        usertype = "Blood Donor & Doctor"
                        new.User_Type = ['Blood Donor', 'Doctor']
                    else:
                        usertype = 'Doctor'
                        new.User_Type = ['Doctor']
                    new.save()
                    newuser = Users.objects.get(username=new.username)
                    state = States.objects.get(Name=state)
                    district = Districts.objects.get(Name=district, state=state)
                    degree = Degrees.objects.get(id=degree)
                    permanent_state = States.objects.get(Name=permanent_state)
                    permanent_district = Districts.objects.get(Name=permanent_district, state=permanent_state)
                    specialty = Specialities.objects.get(Speciality=specialty, Degree=degree)
                    Doctor.objects.create(Username=newuser, Name=name, Gender=gender, Blood_Group=bloodGroup, Degree=degree, Special=specialty, Address=address, State=state, City=city, Subdivision=subdivision, District=district, Pin=pin, Permanent_Address=permanent_address, Permanent_State=permanent_state, Permanent_City=permanent_city, Permanent_Subdivision=permanent_subdivision, Permanent_District=permanent_district, Permanent_Pin=permanent_pin, Image=pic)
                    if donor == "BloodDonor":
                        usern = Users.objects.get(username=username)
                        Blood_Donar.objects.create(Username=usern, Name=name, Gender=gender, Date_of_Birth=dob, Blood_Group=bloodGroup, Address=address, State=state, Subdivision=subdivision, District=district, Pin=pin, Permanent_Address=permanent_address, Permanent_State=permanent_state, Permanent_City=permanent_city, Permanent_Subdivision=permanent_subdivision, Permanent_District=permanent_district, Permanent_Pin=permanent_pin, Image=pic)

                    def sendConfirmation():
                        try:
                            file = open('Email_Templates/User/Registration_Success_Mail.html')
                            mes = file.read()
                            file.close()
                            mes = mes.replace("**myusername**", username).replace("**myemail**", email).replace("**mycontact**", contact).replace("**user**", "Blood Donor").replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", email)

                            subject = 'Registration Successful'
                            body = ' '
                            htmlMessage = mes
                            sender = settings.DEFAULT_FROM_EMAIL
                            receiver = [
                                {
                                    "email": email,
                                    "name": name
                                }
                            ]
                            uniqueId = "Doctor_Register-" + str(username)
                            newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, uniqueID=uniqueId, messageGroup="Doctor_Registered")
                            newThreadEmail.start()
                        except Exception as e:
                            print(e)
                        finally:
                            return True
                    transaction.on_commit(sendConfirmation)
                    OTP.objects.filter(Email=email, Send_For='Registration').delete()
                    OTP.objects.filter(Mobile=contact, Send_For='Registration').delete()
                    no += 1
                    context = {
                        "no": no,
                        'error': "0",
                        "username": username,
                        "userType": usertype,
                        "message": "Registered"
                    }
                    return JsonResponse(context)
                else:
                    formError = str(formuser.errors)
                    no += 1
                    context = {
                        "no": no,
                        "error": "001",
                        "message": "We have found wrong input! Correct it first",
                    }
                    return JsonResponse(context)
        except Exception as e:
            print(e)
            no += 1
            context = {
                "no": no,
                "error": "002",
                "message": "Server Error! Try again after some time."
            }
            return JsonResponse(context)
    else:
        context = {
            "error": "0",
            "degree": Degrees.objects.all(),
            "states": States.objects.all(),
            'bloodGroups': blood_groups,
        }
        return render(request, 'registerdoctor.html', context)


@require_http_methods(["GET", "POST"])
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def NormalRegistration(request):
    if request.method == 'POST':
        username = firstCharacterCapital(request.POST.get('username'))
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        email = request.POST.get('email').lower()
        name = firstCharOfEachWordCapital(request.POST.get('name'))
        gender = request.POST.get('gender')
        idType = request.POST.get('idType')
        idNumber = request.POST.get('idNumber').upper()
        contact = request.POST.get('contact')
        permanent_address = firstCharOfEachWordCapital(request.POST.get('permanent_address'))
        permanent_state = request.POST.get('permanent_state')
        permanent_city = firstCharOfEachWordCapital(request.POST.get('permanent_city'))
        permanent_subdivision = firstCharOfEachWordCapital(request.POST.get('permanent_subdivision'))
        permanent_district = request.POST.get('permanent_district')
        permanent_pin = request.POST.get('permanent_pin')
        address =firstCharOfEachWordCapital(request.POST.get('address'))
        state = request.POST.get('state', '')
        city = firstCharOfEachWordCapital(request.POST.get('city'))
        subdivision = firstCharOfEachWordCapital(request.POST.get('subdivision'))
        district = request.POST.get('district', '')
        pin = request.POST.get('pin')
        pic = request.FILES.get('picture')
        cont_type = str(pic.content_type)
        cont_type = cont_type.split('/')
        sameCurrent = request.POST.get('samecurrent', False)
        if sameCurrent == 'on':
            state = permanent_state
            district = permanent_district
        data = []
        context = {}
        no = 0
        try:
            with transaction.atomic(durable=True):
                validateUsername = usernameValidation(username)
                if validateUsername['hasError']:
                    no += 1
                    context = {
                        "no": no,
                        "error": '1',
                        "message": validateUsername['message']
                    }
                    data.append(context)

                validateEmail = EmailValidation(email=email, checkExistency=True)
                if OTP.objects.filter(Email=email, Is_Verified=True, Send_For='Registration').exists() == False:
                    no += 1
                    context = {
                        "no": no,
                        "error": '2',
                        "message": "Verify your Email Id"
                    }
                    data.append(context)
                elif validateEmail['hasError'] == '1':
                    no += 1
                    context = {
                        "no": no,
                        "error": '3',
                        "message": validateEmail['message']
                    }
                    data.append(context)

                if OTP.objects.filter(Mobile=contact, Is_Verified=True, Send_For='Registration').exists() == False:
                    no += 1
                    context = {
                        "no": no,
                        "error": '4',
                        "message": "Verify your Mobile Number"
                    }
                    data.append(context)
                elif Users.objects.filter(Contact=contact).exists():
                    no += 1
                    context = {
                        "no": no,
                        "error": "5",
                        "message": "Please check your contact info!",
                    }
                    data.append(context)
                
                validatePassword = passwordValidation(password1, username)
                if password1 != password2:
                    no += 1
                    context = {
                        "no": no,
                        "error": '6',
                        "message": "Password and Confirm Password didn't match"
                    }
                    data.append(context)
                elif validatePassword['password_error'] != 'No Error':
                    no += 1
                    context = {
                        "no": no,
                        "error": '6',
                        "message": validatePassword['password_error'],
                        "validationError": True,
                    }
                    data.append(context)

                if cont_type[0] != 'image':
                    no += 1
                    context = {
                        "no": no,
                        "error": '7',
                        "message": "Please select an Image File"
                    }
                    data.append(context)
                elif pic.size > 5242880:
                    no += 1
                    context = {
                        "no": no,
                        "error": '8',
                        "message": "Image size should be maximum 5 MB"
                    }
                    data.append(context)

                if Users.objects.filter(ID_Number=idNumber, ID_Type=idType).exists():
                    no += 1
                    context = {
                        "no": no,
                        "error": '9',
                        "message": "We have found misinformation in your given data!",
                    }
                    data.append(context)

                if len(data) > 0:
                    response_data = {
                        'data': data,
                        'inputError': True,
                    }
                    return JsonResponse(response_data)

                datauser = {
                    "username": username,
                    "email": email,
                    "password1": password1,
                    "password2": password2,
                    "Contact": contact,
                    "ID_Type": idType,
                    "ID_Number": idNumber,
                }
                formuser = UsersCreationForm(datauser)
                if formuser.is_valid():
                    new = formuser.save(commit=False)
                    new.User_Type = ['Normal']
                    new.save()
                    newuser = Users.objects.get(username=new.username)
                    state = States.objects.get(Name=state)
                    district = Districts.objects.get(Name=district, state=state)
                    permanent_state = States.objects.get(Name=permanent_state)
                    permanent_district = Districts.objects.get(Name=permanent_district, state=permanent_state)
                    NormalUser.objects.create(Username=newuser, Name=name, Gender=gender, Address=address, State=state, City=city, Subdivision=subdivision, District=district, Pin=pin, Permanent_Address=permanent_address, Permanent_State=permanent_state, Permanent_City=permanent_city, Permanent_Subdivision=permanent_subdivision, Permanent_District=permanent_district, Permanent_Pin=permanent_pin, Image=pic)
                    def sendConfirmation():
                        try:
                            file = open('Email_Templates/User/Registration_Success_Mail.html')
                            mes = file.read()
                            file.close()
                            mes = mes.replace("**myusername**", username).replace("**myemail**", email).replace("**mycontact**", contact).replace("**user**", "Blood Donor").replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", email)

                            subject = 'Registration Successful'
                            body = ' '
                            htmlMessage = mes
                            sender = settings.DEFAULT_FROM_EMAIL
                            receiver = [email, ]
                            receiver = [
                                {
                                    "email": email,
                                    "name": name
                                }
                            ]  
                            uniqueId = "User_Register-" + str(username)
                            newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, uniqueID=uniqueId, messageGroup="User_Registered")
                            newThreadEmail.start()
                        except Exception as e:
                            print(e)
                        finally:
                            return True
                    transaction.on_commit(sendConfirmation)
                    OTP.objects.filter(Email=email, Send_For='Registration').delete()
                    OTP.objects.filter(Mobile=contact, Send_For='Registration').delete()
                    no += 1
                    context = {
                        "no": no,
                        'error': "0",
                        "username": username,
                        "userType": "Normal User",
                        "message": "Registered"
                    }
                    return JsonResponse(context)
                else:
                    formError = str(formuser.errors)
                    no += 1
                    context = {
                        "no": no,
                        "error": "001",
                        "message": "You have found wrong inout! Correct it first",
                    }
                    return JsonResponse(context)
        except Exception as e:
            print(e)
            no += 1
            context = {
                "no": no,
                "error": "002",
                "message": "Server Error! Try again after some time."
            }
            return JsonResponse(context)
    else:
        context = {
            "error": "0",
            "states": States.objects.all(),
        }
        return render(request, 'normalregistration.html', context)
    
    


@require_http_methods(["GET", "POST"])
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def hospitalRegistration(request):
    if request.method == 'POST':
        username = firstCharacterCapital(request.POST.get('username'))
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        name = firstCharOfEachWordCapital(request.POST.get('name'))
        hospitalType = request.POST.get('type')
        ownership = request.POST.get('ownership')
        registration_no = str(request.POST.get('registration_no')).upper()
        website = request.POST.get('website', '')
        emergency_contact = request.POST.get('emergency_contact')
        toll_free_no = request.POST.get('toll_free_no', '')
        helpline_number = request.POST.get('helpline_number', '')
        other_contacts = request.POST.get('other_contacts').split(',')
        mobile = request.POST.get('mobile')
        email = request.POST.get('email').lower()
        registration_document = request.FILES.get('registration_document')
        address = firstCharOfEachWordCapital(request.POST.get('address'))
        pin = request.POST.get('pin')
        state = request.POST.get('state')
        district = request.POST.get('district')
        subdivision = firstCharOfEachWordCapital(request.POST.get('subdivision'))
        city = firstCharOfEachWordCapital(request.POST.get('city'))
        latitude = request.POST.get('latitude')
        longitude = request.POST.get('longitude')
        mobileotp = request.POST.get('mobileotp')
        emailotp = request.POST.get('emailotp')
        pic = request.FILES.get('picture')
        cont_type = str(pic.content_type)
        cont_type = cont_type.split('/')
        data = []
        context = {}
        no = 0
        try:
            OTPinvalidFor = []
            with transaction.atomic(durable=True):
                emailOtpOkay = OTP.objects.filter(Email=email, EmailOTP=emailotp, Is_Verified=False, Send_For='Registration').exists()
                mobileOtpOkay = OTP.objects.filter(Mobile=mobile, MobileOTP=mobileotp, Is_Verified=False, Send_For='Registration').exists()
                if not emailOtpOkay:
                    OTPinvalidFor.append("Email")
                if not mobileOtpOkay:
                    OTPinvalidFor.append("Mobile")
                if len(OTPinvalidFor) > 0:
                    context = {
                        "no": no,
                        "error": "003",
                        "OTPinvalidFor": OTPinvalidFor,
                        "message": "You entered invalid OTP"
                    }
                    return JsonResponse(context)
                else:
                    validateUsername = usernameValidation(username)
                    if validateUsername['hasError']:
                        no += 1
                        context = {
                            "no": no,
                            "error": '1',
                            "message": validateUsername['message']
                        }
                        data.append(context)

                    validateEmail = EmailValidation(email=email, checkExistency=True)
                    if validateEmail['hasError'] == '1':
                        no += 1
                        context = {
                            "no": no,
                            "error": '2',
                            "message": validateEmail['message']
                        }
                        data.append(context)

                    if Users.objects.filter(Contact=mobile).exists():
                        no += 1
                        context = {
                            "no": no,
                            "error": "3",
                            "message": "Please check your mobile no!",
                        }
                        data.append(context)
                    
                    validatePassword = passwordValidation(password1, username)
                    if password1 != password2:
                        no += 1
                        context = {
                            "no": no,
                            "error": '4',
                            "message": "Password and Confirm Password didn't match"
                        }
                        data.append(context)
                    elif validatePassword['password_error'] != 'No Error':
                        no += 1
                        context = {
                            "no": no,
                            "error": '5',
                            "message": validatePassword['password_error'],
                            "validationError": True,
                        }
                        data.append(context)

                    if cont_type[0] != 'image':
                        no += 1
                        context = {
                            "no": no,
                            "error": '6',
                            "message": "Please select an Image File"
                        }
                        data.append(context)
                    elif pic.size > 5242880:
                        no += 1
                        context = {
                            "no": no,
                            "error": '7',
                            "message": "Image size should be maximum 5 MB"
                        }
                        data.append(context)

                    if Users.objects.filter(ID_Type="Hospital's Registration", ID_Number=registration_no).exists():
                        no += 1
                        context = {
                            "no": no,
                            "error": '8',
                            "message": "Hospital with the registration no already registered."
                        }
                        data.append(context)

                    cont_type1 = str(registration_document.content_type)
                    typeError = True
                    for contentType in settings.DOCUMENT_CONTENT_TYPES:
                        if len(re.findall(contentType, cont_type1)) > 0:
                            typeError = False
                            break
                    if typeError:
                        no += 1
                        context = {
                            "no": no,
                            "error": '9',
                            "message": "Please select an Image or PDF File"
                        }
                        data.append(context)
                    elif registration_document.size > 5242880:
                        no += 1
                        context = {
                            "no": no,
                            "error": '10',
                            "message": "Document size should be maximum 5 MB"
                        }
                        data.append(context)

                    if len(data) > 0:
                        response_data = {
                            'data': data,
                            'inputError': True,
                        }
                        return JsonResponse(response_data)

                    datauser = {
                        "username": username,
                        "email": email,
                        "password1": password1,
                        "password2": password2,
                        "Contact": mobile,
                        "ID_Type": "Hospital's Registration",
                        "ID_Number": registration_no
                    }
                    formuser = UsersCreationForm(datauser)
                    if formuser.is_valid():
                        OTP.objects.filter(Email=email, EmailOTP=emailotp, Is_Verified=False, Send_For='Registration').update(Is_Verified=True)
                        OTP.objects.filter(Mobile=mobile, MobileOTP=mobileotp, Is_Verified=False, Send_For='Registration').update(Is_Verified=True)
                        new = formuser.save(commit=False)
                        new.User_Type = ['Hospital']
                        new.Registered = False
                        new.save()
                        newuser = Users.objects.get(username=new.username)
                        state = States.objects.get(Name=state)
                        district = Districts.objects.get(Name=district, state=state)
                        createdHospital = Hospital.objects.create(Username=newuser, Name=name, Toll_Free_Number=toll_free_no, Helpline_Number=helpline_number, Emergency_Number=emergency_contact, Contacts=other_contacts, Type=hospitalType, Ownership=ownership, Registration_Document=registration_document, Address=address, State=state, City=city, Subdivision=subdivision, District=district, Pin=pin, Image=pic, Website=website, Latitude=latitude, Longitude=longitude)
                        nextStepUrl = settings.SITE_URL + reverse("Go_Healthy_App:HospitalRegistrationPart_2", kwargs={'id': createdHospital.Unique_Id})
                        def sendConfirmation():
                            try:
                                file = open('Email_Templates/User/Hospital_Partial_Registration_Mail.html')
                                mes = file.read()
                                file.close()
                                expire = zonetime.now() + datetime.timedelta(days=3)
                                expire = expire.strftime("%d %B %Y")
                                mes = mes.replace("**HospitalID**", createdHospital.Unique_Id).replace("**myusername**", username).replace("**myemail**", email).replace("**mycontact**", mobile).replace("**expireDate**", expire).replace("**addBedUrl**", nextStepUrl).replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", email)

                                subject = 'Registration Partially Completed'
                                body = ' '
                                htmlMessage = mes
                                sender = settings.DEFAULT_FROM_EMAIL
                                receiver = [email, ]
                                receiver = [
                                    {
                                        "email": email,
                                        "name": name
                                    }
                                ]  
                                uniqueId = "User_Register-" + str(username)
                                newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, uniqueID=uniqueId, messageGroup="Hospital_Partially_Registered")
                                newThreadEmail.start()
                            except Exception as e:
                                print(e)
                            finally:
                                return True
                        transaction.on_commit(sendConfirmation)
                        no += 1
                        context = {
                            "no": no,
                            'error': "0",
                            "username": username,
                            "hospitalId": createdHospital.Unique_Id,
                            "userType": "Hospital",
                            "message": "Registered",
                            'next_step_url': nextStepUrl,
                        }
                        return JsonResponse(context)

                    else:
                        formError = str(formuser.errors)
                        no += 1
                        context = {
                            "no": no,
                            "error": "001",
                            "message": "You have found wrong inout! Correct it first",
                        }
                        return JsonResponse(context)
        except Exception as e:
            print(e)
            no += 1
            context = {
                "no": no,
                "error": "002",
                "message": "Server Error! Try again after some time."
            }
            return JsonResponse(context)
    else:
        context = {
            "error": "0",
            "states": States.objects.all(),
            "hospitalTypes": Type_choice,
            "hospitalOwnerships": Ownership_choice,
            'departments': HospitalDepartment.objects.all(),
            'hospitalWards': ward_ch,
            'hospitalFloors': floor_ch,
            'registration_part1': True,
        }
        return render(request, 'registerhospital.html', context)


@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def hospitalRegistrationPart_2(request, id):
    try:
        hospital = Hospital.objects.get(Unique_Id=id)
        if hospital.Username.is_verified:
          return HttpResponseNotFound()
        email = hospital.Username.email
        mobile = hospital.Username.Contact
        if request.method == "POST":
            sendTo = request.POST.get('sendTo')
            action = request.POST.get('action')
            if action == 'OTPSend':
                if sendTo == 'email':
                    otp = generateOTP(6)
                    OTP.objects.filter(Email=email, Send_For="Hospital Register User Verification").delete()
                    OTP.objects.create(Email=email, EmailOTP=otp, Send_For="Hospital Register User Verification", expire="unlimited")
                    file = open('Email_Templates/User/Final_Registration_otp.html')
                    mes = file.read()
                    file.close()
                    mes = mes.replace("**myotp**", otp).replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", email)
                    subject = 'OTP To Complete Registration'
                    body = ' '
                    htmlMessage = mes
                    sender = settings.DEFAULT_FROM_EMAIL
                    receiver = [
                        {
                            "email": email,
                        }
                    ]
                    newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, messageGroup="Register_OTP")
                    newThreadEmail.start()
                    response_data = {
                        'success': True,
                    }
                    return JsonResponse(response_data)
                elif sendTo == 'mobile':
                    otp = generateOTP(6)
                    OTP.objects.filter(Mobile=mobile, Send_For="Hospital Register User Verification").delete()
                    OTP.objects.create(Mobile=mobile, MobileOTP=otp, Send_For="Hospital Register User Verification", expire="unlimited")
                    file = open('SMS_Templates/Complete_Registration_OTP.txt')
                    mes = file.read()
                    file.close()
                    mes = mes.replace("**yourOTP**", otp)
                    newThreadSMS = sendSMS(numbers=[mobile, ], message=mes, template_id='1407166168714475303')
                    newThreadSMS.start()
                    response_data = {
                        'success': True,
                    }
                    return JsonResponse(response_data)
            elif action == 'OTPVerify':
                otp = request.POST.get('otp')
                verifyFor = request.POST.get('verifyFor')
                if verifyFor == 'email':
                    try:
                        otp = OTP.objects.get(Email=email, EmailOTP=otp, Is_Verified=False, Send_For="Hospital Register User Verification")
                        otp.Is_Verified = True
                        otp.save()
                        response_data = {
                            'valid': True,
                        }
                    except OTP.DoesNotExist:
                        response_data = {
                            'valid': False,
                        }
                    return JsonResponse(response_data)
                elif verifyFor == 'mobile':
                    try:
                        otp = OTP.objects.get(Mobile=mobile, MobileOTP=otp, Is_Verified=False, Send_For="Hospital Register User Verification")
                        otp.Is_Verified = True
                        otp.save()
                        response_data = {
                            'valid': True,
                        }
                    except OTP.DoesNotExist:
                        response_data = {
                            'valid': False,
                        }
                    return JsonResponse(response_data)
        else:
            context = {
                'isRegistered': hospital.Username.Registered,
                'hospital': hospital,
                "error": "0",
                "states": States.objects.all(),
                "hospitalTypes": Type_choice,
                "hospitalOwnerships": Ownership_choice,
                'departments': HospitalDepartment.objects.all(),
                'hospitalWards': ward_ch,
                'hospitalFloors': floor_ch,
                'registration_part2': True,
            }
            return render(request, 'registerhospital.html', context)
    except Hospital.DoesNotExist:
        return HttpResponseNotFound()


@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def allAddedBeds(request):
    hospitalId = request.GET.get('hospitalId')
    hospital = Hospital.objects.filter(Unique_Id=hospitalId).first()
    beds = list(BedNo.objects.filter(~Q(Availability="Null") & Q(Hospital=hospital)).values("id", "Department__department", "Bed_No", "Room__id", "Room__Room", "Unit__id", "Unit__Unit", "Floor", "Ward", "Building__id", "Building__Building", "Support"))
    response_data = {
        'beds': beds
    }
    return JsonResponse(response_data)

@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def allAddedRooms(request):
    hospitalId = request.GET.get('hospitalId')
    hospital = Hospital.objects.filter(Unique_Id=hospitalId).first()
    rooms = list(HospitalRoom.objects.filter(Hospital=hospital).values('id', 'Room'))
    response_data = {
        'rooms': rooms
    }
    return JsonResponse(response_data)

@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def allAddedUnits(request):
    hospitalId = request.GET.get('hospitalId')
    hospital = Hospital.objects.filter(Unique_Id=hospitalId).first()
    units = list(HospitalUnit.objects.filter(Hospital=hospital).values('id', 'Unit'))
    response_data = {
        'units': units
    }
    return JsonResponse(response_data)

@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def allAddedBuildings(request):
    hospitalId = request.GET.get('hospitalId')
    hospital = Hospital.objects.filter(Unique_Id=hospitalId).first()
    buildings = list(HospitalBuilding.objects.filter(Hospital=hospital).values('id', 'Building'))
    response_data = {
        'buildings': buildings
    }
    return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def addRoom(request):
    if request.method == 'POST':
        hospitalId = request.POST.get('hospitalId')
        room = firstCharOfEachWordCapital(request.POST.get('room'))
        emailOTP = request.POST.get('emailOTP')
        mobileOTP = request.POST.get('mobileOTP')
        hospital = Hospital.objects.get(Unique_Id=hospitalId)
        if((request.user.is_authenticated and request.user == hospital.Username and hospital.Username.Registered == True) or (OTP.objects.filter(MobileOTP=mobileOTP, Mobile=hospital.Username.Contact, Is_Verified=True, Send_For="Hospital Register User Verification").exists() and OTP.objects.filter(EmailOTP=emailOTP, Email=hospital.Username.email, Is_Verified=True, Send_For="Hospital Register User Verification").exists())):
            try:
                room = HospitalRoom.objects.create(Hospital=hospital, Room=room)
                response_data = {
                    'room': serialize('json', [room, ])
                }
            except ValidationError as e:
                if 'already exists' in str(e):
                    response_data = {
                        'exists': True
                    }
                else:
                    raise ValidationError(e)
            except IntegrityError as e:
                if 'already exists' in str(e):
                    response_data = {
                        'exists': True
                    }
                else:
                    raise IntegrityError(e)
            return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def deleteRoom(request):
    if request.method == 'POST':
        hospitalId = request.POST.get('hospitalId')
        roomId = request.POST.get('roomId')
        emailOTP = request.POST.get('emailOTP')
        mobileOTP = request.POST.get('mobileOTP')
        hospital = Hospital.objects.get(Unique_Id=hospitalId)
        if((request.user.is_authenticated and request.user == hospital.Username and hospital.Username.Registered == True) or (OTP.objects.filter(MobileOTP=mobileOTP, Mobile=hospital.Username.Contact, Is_Verified=True, Send_For="Hospital Register User Verification").exists() and OTP.objects.filter(EmailOTP=emailOTP, Email=hospital.Username.email, Is_Verified=True, Send_For="Hospital Register User Verification").exists())):
            try:
                HospitalRoom.objects.filter(Hospital=hospital, id=roomId).delete()
                response_data = {
                    'success': True,
                    'totalRoom': HospitalRoom.objects.filter(Hospital=hospital).count(),
                }
            except Exception as e:
                traceback.print_exc()
                response_data = {
                    'success': False
                }
            print(response_data)
            return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def editRoom(request):
    if request.method == 'POST':
        hospitalId = request.POST.get('hospitalId')
        roomId = request.POST.get('roomId')
        roomName = request.POST.get('roomName')
        emailOTP = request.POST.get('emailOTP')
        mobileOTP = request.POST.get('mobileOTP')
        hospital = Hospital.objects.get(Unique_Id=hospitalId)
        if((request.user.is_authenticated and request.user == hospital.Username and hospital.Username.Registered == True) or OTP.objects.filter(MobileOTP=mobileOTP, Mobile=hospital.Username.Contact, Is_Verified=True, Send_For="Hospital Register User Verification").exists() and OTP.objects.filter(EmailOTP=emailOTP, Email=hospital.Username.email, Is_Verified=True, Send_For="Hospital Register User Verification").exists()):
            try:
                HospitalRoom.objects.filter(Hospital=hospital, id=roomId).update(Room=roomName)
                response_data = {
                    'success': True
                }
            except ValidationError as e:
                if 'already exists' in str(e):
                    response_data = {
                        'exists': True
                    }
                else:
                    raise ValidationError(e)
            except IntegrityError as e:
                if 'already exists' in str(e):
                    response_data = {
                        'exists': True
                    }
                else:
                    raise IntegrityError(e)
            return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def addUnit(request):
    if request.method == 'POST':
        hospitalId = request.POST.get('hospitalId')
        unit = firstCharOfEachWordCapital(request.POST.get('unit'))
        emailOTP = request.POST.get('emailOTP')
        mobileOTP = request.POST.get('mobileOTP')
        hospital = Hospital.objects.get(Unique_Id=hospitalId)
        if((request.user.is_authenticated and request.user == hospital.Username and hospital.Username.Registered == True) or (OTP.objects.filter(MobileOTP=mobileOTP, Mobile=hospital.Username.Contact, Is_Verified=True, Send_For="Hospital Register User Verification").exists() and OTP.objects.filter(EmailOTP=emailOTP, Email=hospital.Username.email, Is_Verified=True, Send_For="Hospital Register User Verification").exists())):
            try:
                unit = HospitalUnit.objects.create(Hospital=hospital, Unit=unit)
                response_data = {
                    'unit': serialize('json', [unit, ])
                }
            except ValidationError as e:
                if 'already exists' in str(e):
                    response_data = {
                        'exists': True
                    }
                else:
                    raise ValidationError(e)
            except IntegrityError as e:
                if 'already exists' in str(e):
                    response_data = {
                        'exists': True
                    }
                else:
                    raise IntegrityError(e)
            return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def deleteUnit(request):
    if request.method == 'POST':
        hospitalId = request.POST.get('hospitalId')
        unitId = request.POST.get('unitId')
        emailOTP = request.POST.get('emailOTP')
        mobileOTP = request.POST.get('mobileOTP')
        print(request.POST)
        hospital = Hospital.objects.get(Unique_Id=hospitalId)
        if((request.user.is_authenticated and request.user == hospital.Username and hospital.Username.Registered == True) or (OTP.objects.filter(MobileOTP=mobileOTP, Mobile=hospital.Username.Contact, Is_Verified=True, Send_For="Hospital Register User Verification").exists() and OTP.objects.filter(EmailOTP=emailOTP, Email=hospital.Username.email, Is_Verified=True, Send_For="Hospital Register User Verification").exists())):
            try:
                HospitalUnit.objects.filter(Hospital=hospital, id=unitId).delete()
                response_data = {
                    'success': True,
                    'totalUnit': HospitalUnit.objects.filter(Hospital=hospital).count(),
                }
            except Exception as e:
                traceback.print_exc()
                response_data = {
                    'success': False
                }
            return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def editUnit(request):
    if request.method == 'POST':
        hospitalId = request.POST.get('hospitalId')
        unitId = request.POST.get('unitId')
        unitName = request.POST.get('unitName')
        emailOTP = request.POST.get('emailOTP')
        mobileOTP = request.POST.get('mobileOTP')
        hospital = Hospital.objects.get(Unique_Id=hospitalId)
        if((request.user.is_authenticated and request.user == hospital.Username and hospital.Username.Registered == True) or OTP.objects.filter(MobileOTP=mobileOTP, Mobile=hospital.Username.Contact, Is_Verified=True, Send_For="Hospital Register User Verification").exists() and OTP.objects.filter(EmailOTP=emailOTP, Email=hospital.Username.email, Is_Verified=True, Send_For="Hospital Register User Verification").exists()):
            try:
                HospitalUnit.objects.filter(Hospital=hospital, id=unitId).update(Unit=unitName)
                response_data = {
                    'success': True
                }
            except ValidationError as e:
                if 'already exists' in str(e):
                    response_data = {
                        'exists': True
                    }
                else:
                    raise ValidationError(e)
            except IntegrityError as e:
                if 'already exists' in str(e):
                    response_data = {
                        'exists': True
                    }
                else:
                    raise IntegrityError(e)
            return JsonResponse(response_data)

@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def addBuilding(request):
    if request.method == 'POST':
        hospitalId = request.POST.get('hospitalId')
        building = firstCharOfEachWordCapital(request.POST.get('building'))
        emailOTP = request.POST.get('emailOTP')
        mobileOTP = request.POST.get('mobileOTP')
        hospital = Hospital.objects.get(Unique_Id=hospitalId)
        if((request.user.is_authenticated and request.user == hospital.Username and hospital.Username.Registered == True) or (OTP.objects.filter(MobileOTP=mobileOTP, Mobile=hospital.Username.Contact, Is_Verified=True, Send_For="Hospital Register User Verification").exists() and OTP.objects.filter(EmailOTP=emailOTP, Email=hospital.Username.email, Is_Verified=True, Send_For="Hospital Register User Verification").exists())):
            try:
                building = HospitalBuilding.objects.create(Hospital=hospital, Building=building)
                response_data = {
                    'building': serialize('json', [building, ])
                }
            except ValidationError as e:
                if 'already exists' in str(e):
                    response_data = {
                        'exists': True
                    }
                else:
                    raise ValidationError(e)
            except IntegrityError as e:
                if 'already exists' in str(e):
                    response_data = {
                        'exists': True
                    }
                else:
                    raise IntegrityError(e)
            return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def deleteBuilding(request):
    if request.method == 'POST':
        hospitalId = request.POST.get('hospitalId')
        buildingId = request.POST.get('buildingId')
        emailOTP = request.POST.get('emailOTP')
        mobileOTP = request.POST.get('mobileOTP')
        hospital = Hospital.objects.get(Unique_Id=hospitalId)
        if((request.user.is_authenticated and request.user == hospital.Username and hospital.Username.Registered == True) or (OTP.objects.filter(MobileOTP=mobileOTP, Mobile=hospital.Username.Contact, Is_Verified=True, Send_For="Hospital Register User Verification").exists() and OTP.objects.filter(EmailOTP=emailOTP, Email=hospital.Username.email, Is_Verified=True, Send_For="Hospital Register User Verification").exists())):
            try:
                HospitalBuilding.objects.filter(Hospital=hospital, id=buildingId).delete()
                response_data = {
                    'success': True,
                    'totalBuilding': HospitalBuilding.objects.filter(Hospital=hospital).count(),
                }
            except Exception as e:
                traceback.print_exc()
                response_data = {
                    'success': False
                }
            return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def editBuilding(request):
    if request.method == 'POST':
        hospitalId = request.POST.get('hospitalId')
        buildingId = request.POST.get('buildingId')
        buildingName = request.POST.get('buildingName')
        emailOTP = request.POST.get('emailOTP')
        mobileOTP = request.POST.get('mobileOTP')
        hospital = Hospital.objects.get(Unique_Id=hospitalId)
        if((request.user.is_authenticated and request.user == hospital.Username and hospital.Username.Registered == True) or OTP.objects.filter(MobileOTP=mobileOTP, Mobile=hospital.Username.Contact, Is_Verified=True, Send_For="Hospital Register User Verification").exists() and OTP.objects.filter(EmailOTP=emailOTP, Email=hospital.Username.email, Is_Verified=True, Send_For="Hospital Register User Verification").exists()):
            try:
                HospitalBuilding.objects.filter(Hospital=hospital, id=buildingId).update(Building=buildingName)
                response_data = {
                    'success': True
                }
            except ValidationError as e:
                if 'already exists' in str(e):
                    response_data = {
                        'exists': True
                    }
                else:
                    raise ValidationError(e)
            except IntegrityError as e:
                if 'already exists' in str(e):
                    response_data = {
                        'exists': True
                    }
                else:
                    raise IntegrityError(e)
            return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def addBed(request):
    department = request.POST.get('hospitalDepartment')
    ward = request.POST.get('hospitalWard')
    support = request.POST.get('hospitalSupport')
    bedNo = request.POST.get('hospitalBedNo')
    room = request.POST.get('hospitalRoomName')
    unit = request.POST.get('hospitalUnitName')
    floor = request.POST.get('hospitalFloor')
    building = firstCharOfEachWordCapital(request.POST.get('hospitalBuilding'))
    hospitalId = request.POST.get('hospitalID')
    emailOTP = request.POST.get('emailOTP')
    mobileOTP = request.POST.get('mobileOTP')
    hospital = Hospital.objects.get(Unique_Id=hospitalId)
    if((request.user.is_authenticated and request.user == hospital.Username and hospital.Username.Registered == True) or (OTP.objects.filter(MobileOTP=mobileOTP, Mobile=hospital.Username.Contact, Is_Verified=True, Send_For="Hospital Register User Verification").exists() and OTP.objects.filter(EmailOTP=emailOTP, Email=hospital.Username.email, Is_Verified=True, Send_For="Hospital Register User Verification").exists())):
        if room != '' and room is not None:
            room = HospitalRoom.objects.get(Hospital=hospital, Room=room)
        else:
            room = None
        if building != '' and building is not None:
            building = HospitalBuilding.objects.get(Hospital=hospital, Building=building)
        else:
            building = None
        if unit != '' and unit is not None:
            unit = HospitalUnit.objects.get(Hospital=hospital, Unit=unit)
        else:
            unit = None
        department = HospitalDepartment.objects.get(department=department)
        try:
            createdBed = BedNo.objects.create(Hospital=hospital, Department=department, Bed_No=bedNo, Room=room, Floor=floor, Ward=ward, Unit=unit, Building=building, Support=support)
            response_data = {
                'success': True,
                'createdBed': list(BedNo.objects.filter(id=createdBed.id).values("id", "Department__department", "Bed_No", "Room__id", "Room__Room", "Unit__id", "Unit__Unit", "Floor", "Ward", "Building__id", "Building__Building", "Support", "added_at", "Last_Update"))
            }
            beds = BedNo.objects.filter(Q(Hospital=hospital) & ~Q(Availability="Null"))
            total_beds = beds.count()
            available_beds = beds.filter(Availability='Available').count()
        
            response_data['total_beds'] = total_beds,
            response_data['available_beds'] = available_beds,
        except ValidationError as e:
            if 'already exists' in str(e):
                response_data = {
                    'exists': '1'
                }
            else:
                raise ValidationError(e)
        except IntegrityError as e:
            if 'already exists' in str(e):
                response_data = {
                    'exists': '1'
                }
            else:
                raise IntegrityError(e)
        return JsonResponse(response_data)


@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def recentAddeBeds(request):
    hospital = request.GET.get('hospital')
    recentAddeBeds = list(BedNo.objects.filter(~Q(Availability="Null") & Q(Hospital__Unique_Id=hospital)).order_by('-added_at')[0:50].values("id", "Department__department", "Bed_No", "Floor", "Ward", "Room__Room", "Unit__Unit", "Building__Building", "Support", "added_at", "Last_Update"))
    response_data = {
        'recentAddeBeds': recentAddeBeds,
    }
    return JsonResponse(response_data)


@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def allBedRemoveRequests(request):
    hospital = request.GET.get('hospital')
    removeRequests = list(BedRemoveRequests.objects.filter(Bed__Hospital__Unique_Id=hospital).values("id", "Bed__Department__department", "Bed__Bed_No", "Bed__Floor", "Bed__Ward", "Bed__Room__Room", "Bed__Unit__Unit", "Bed__Building__Building", "Bed__Support", "Status", "requested_at", "status_change_at"))
    response_data = {
        'removeRequests': removeRequests,
    }
    return JsonResponse(response_data)

@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def undoBedRemove(request):
    Id = request.POST.get('id')
    removeRequest = BedRemoveRequests.objects.get(id=Id)
    if removeRequest.Status == 'Pending' and removeRequest.Bed.Hospital.Username == request.user:
        BedRemoveRequests.objects.filter(id=Id).delete()
        totalRequests = BedRemoveRequests.objects.filter(Bed__Hospital__Username=request.user).count()
        response_data = {
            'success': True,
            'totalRequests': totalRequests,
        }
        return JsonResponse(response_data)

@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
@transaction.atomic(durable=True)
def removeBed(request):
    response_data = {}
    if request.user.is_authenticated and 'Hospital' in request.user.User_Type:
        hospital = Hospital.objects.get(Username=request.user)
        if(request.user == hospital.Username and hospital.Username.Registered == True):
            Bed_No = request.POST.get('hospitalBed_No')
            department = request.POST.get('hospitalDepartment')
            ward = request.POST.get('hospitalWard')
            support = request.POST.get('hospitalSupport')
            bedNo = request.POST.get('hospitalBedNo')
            room = request.POST.get('hospitalRoomName')
            unit = request.POST.get('hospitalUnitName')
            floor = request.POST.get('hospitalFloor')
            building = firstCharOfEachWordCapital(request.POST.get('hospitalBuilding'))
            if room != '' and room is not None:
                room = HospitalRoom.objects.get(Hospital=hospital, Room=room)
            else:
                room = None
            if building != '' and building is not None:
                building = HospitalBuilding.objects.get(Hospital=hospital, Building=building)
            else:
                building = None
            if unit != '' and unit is not None:
                unit = HospitalUnit.objects.get(Hospital=hospital, Unit=unit)
            else:
                unit = None
            bed = BedNo.objects.filter(Q(Hospital=hospital, Department__department=department, Bed_No=bedNo, Room=room, Floor=floor, Ward=ward, Building=building, Support=support) & ~Q(Availability="Null"))
            if bed.exists() == False:
                response_data['error'] = "noexists"
            elif bed.filter(~Q(Availability__in=['Available', 'Not Available'])).exists():
                response_data['error'] = "used"
            else:
                try:
                    removeRequest = BedRemoveRequests.objects.create(Bed=bed.first())
                    removeRequest = list(BedRemoveRequests.objects.filter(id=removeRequest.id).values("id", "Bed__Department__department", "Bed__Bed_No", "Bed__Floor", "Bed__Ward", "Bed__Room__Room", "Bed__Unit__Unit", "Bed__Building__Building", "Bed__Support", "Status", "requested_at", "status_change_at"))
                    response_data['error'] = "0"
                    response_data['removeRequest'] = removeRequest
                except Exception as e:
                    if "is in Pending status" in str(e):
                       response_data['error'] = "already requested" 
    else:
        bedId = request.POST.get('bedId')
        hospitalId = str(request.POST.get('hospitalId'))
        emailOTP = request.POST.get('emailOTP')
        mobileOTP = request.POST.get('mobileOTP')
        theBed = BedNo.objects.filter(~Q(Availability="Null") & Q(id=bedId, Hospital__id=hospitalId))
        hospital = theBed.first().Hospital
        if(OTP.objects.filter(MobileOTP=mobileOTP, Mobile=hospital.Username.Contact, Is_Verified=True, Send_For="Hospital Register User Verification").exists() and OTP.objects.filter(EmailOTP=emailOTP, Email=hospital.Username.email, Is_Verified=True, Send_For="Hospital Register User Verification").exists()):
            theBed.delete()
            response_data = {
                'success': True,
            }
    return JsonResponse(response_data)


@login_required(login_url=settings.LOGIN_URL)
@user_passes_test(checkUserStatus)
@require_POST
@ratelimit(group='User', key='user', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def editBedInfo(request):
    if 'Hospital' in request.user.User_Type:
        hospital = Hospital.objects.get(Username=request.user)
        bedId = request.POST.get('bedId')
        bed = BedNo.objects.get(~Q(Availability="Null") & Q(id=bedId, Hospital=hospital))
        bedNo = request.POST.get('bedNo', '')
        floor = request.POST.get('floor', bed.Floor)
        ward = request.POST.get('ward', bed.Ward)
        support = request.POST.get('support', bed.Support)
        department = request.POST.get('department', bed.Department.department)
        room = request.POST.get('room', '')
        unit = request.POST.get('unit', '')
        building = request.POST.get('building', '')
        if department != '':
            department = HospitalDepartment.objects.get(department=department)
        else:
            department = bed.Department
        if room != '':
            room = HospitalRoom.objects.get(Hospital=hospital, Room=room)
        else:
            room = bed.Room
        if unit != '':
            unit = HospitalUnit.objects.get(Hospital=hospital, Unit=unit)
        else:
            unit = bed.Unit
        if building != '':
            building = HospitalBuilding.objects.get(Hospital=hospital, Building=building)
        else:
            building = bed.Building
        response_data = {}
        response_data['changed'] = True
        response_data['ward_changed'] = False
        try:
            with transaction.atomic(durable=True):
                if bed.Hospital.Username == request.user:  
                    bedsUpdates = BedNo.objects.filter(~Q(Availability="Null") & Q(id=bedId, Hospital=hospital))
                    if(department != bed.Department or ward != bed.Ward or support != bed.Support or room != bed.Room or unit != bed.Unit or building != bed.Building):
                        if bed.Availability != 'Available' and bed.Availability != 'Not Available':
                            response_data['changed'] = False
                        else:
                            bedsUpdates.update(Department=department, Ward=ward, Support=support, Last_Update=zonetime.now())
                            response_data['changed'] = True
                            response_data['ward_changed'] = True

                    if response_data['changed']:
                        bedsUpdates.update(Bed_No=bedNo, Floor=floor, Room=room, Unit=unit, Building=building)

                        def runAfterSuccess():
                            try:
                                if response_data['ward_changed']:
                                    bedsUpdates.first().save()
                            except Exception as e:
                                print(e)
                            finally:
                                return True
                        transaction.on_commit(runAfterSuccess)
                    response_data['error'] = '0'
        except ValidationError as e:
            if 'already exists' in str(e):
                response_data = {
                    'exists': True
                }
            else:
                raise ValidationError(e)
        except IntegrityError as e:
            if 'already exists' in str(e):
                response_data = {
                    'exists': True
                }
            else:
                raise IntegrityError(e)
        return JsonResponse(response_data)


@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def registerHospitalSubmit(request):
    hospitalId = request.POST.get('hospitalID')
    antivenom = request.POST.get('antivenom')
    emailOTP = request.POST.get('emailOTP')
    mobileOTP = request.POST.get('mobileOTP')
    if BedNo.objects.filter(~Q(Availability="Null") & Q(Hospital__Unique_Id=hospitalId)).exists():
        try:
            with transaction.atomic(durable=True):
                hospital = Hospital.objects.get(Unique_Id=hospitalId, Username__Registered=False)
                if OTP.objects.filter(MobileOTP=mobileOTP, Mobile=hospital.Username.Contact, Is_Verified=True, Send_For="Hospital Register User Verification").exists() and OTP.objects.filter(EmailOTP=emailOTP, Email=hospital.Username.email, Is_Verified=True, Send_For="Hospital Register User Verification").exists():
                    hospital.Username.Registered = True
                    hospital.Has_Antivenom = antivenom
                    hospital.Username.save()
                    hospital.save()
                    def sendConfirmation():
                        try:
                            file = open('Email_Templates/User/Hospital_Registration_Success_Mail.html')
                            mes = file.read()
                            file.close()
                            expire = zonetime.now() + datetime.timedelta(days=3)
                            expire = expire.strftime("%d %B %Y")
                            mes = mes.replace("**HospitalID**", hospital.Unique_Id).replace("**myusername**", hospital.Username.username).replace("**myemail**", hospital.Username.email).replace("**mycontact**", hospital.Username.Contact).replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", hospital.Username.email)

                            subject = 'Registration Successful'
                            body = ' '
                            htmlMessage = mes
                            sender = settings.DEFAULT_FROM_EMAIL
                            receiver = [hospital.Username.email, ]
                            receiver = [
                                {
                                    "email": hospital.Username.email,
                                    "name": hospital.Name
                                }
                            ]  
                            uniqueId = "User_Register-" + str(hospital.Username.username)
                            newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, uniqueID=uniqueId, messageGroup="Hospital_Registered")
                            newThreadEmail.start()
                        except Exception as e:
                            print(e)
                        finally:
                            OTP.objects.filter(Mobile=hospital.Username.Contact, Is_Verified=True, Send_For="Hospital Register User Verification").delete()
                            OTP.objects.filter(Email=hospital.Username.email, Is_Verified=True, Send_For="Hospital Register User Verification").delete()
                            return True
                    transaction.on_commit(sendConfirmation)
                    response_data = {
                        'success': True,
                    }
                    return JsonResponse(response_data)
        except:
            traceback.print_exc()
            response_data = {
                'success': False,
            }
            return JsonResponse(response_data)



@require_http_methods(["GET", "POST"])
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def bloodBankRegistration(request):
    if request.method == 'POST':
        username = firstCharacterCapital(request.POST.get('username'))
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        name = firstCharOfEachWordCapital(request.POST.get('name'))
        ownership = request.POST.get('ownership')
        registration_no = str(request.POST.get('registration_no')).upper()
        toll_free_no = request.POST.get('toll_free_no', '')
        helpline_number = request.POST.get('helpline_number', '')
        emergency_contact = request.POST.get('emergency_contact')
        other_contacts = request.POST.get('other_contacts').split(',')
        mobile = request.POST.get('mobile')
        email = request.POST.get('email').lower()
        website = request.POST.get('website', '')
        registration_document = request.FILES.get('registration_document')
        address = firstCharOfEachWordCapital(request.POST.get('address'))
        pin = request.POST.get('pin')
        state = request.POST.get('state')
        district = request.POST.get('district')
        subdivision = firstCharOfEachWordCapital(request.POST.get('subdivision'))
        city = firstCharOfEachWordCapital(request.POST.get('city'))
        latitude = request.POST.get('latitude')
        longitude = request.POST.get('longitude')
        mobileotp = request.POST.get('mobileotp')
        emailotp = request.POST.get('emailotp')
        data = []
        context = {}
        no = 0
        try:
            OTPinvalidFor = []
            with transaction.atomic(durable=True):
                emailOtpOkay = OTP.objects.filter(Email=email, EmailOTP=emailotp, Is_Verified=False, Send_For='Registration').exists()
                mobileOtpOkay = OTP.objects.filter(Mobile=mobile, MobileOTP=mobileotp, Is_Verified=False, Send_For='Registration').exists()
                if not emailOtpOkay:
                    OTPinvalidFor.append("Email")
                if not mobileOtpOkay:
                    OTPinvalidFor.append("Mobile")
                if len(OTPinvalidFor) > 0:
                    context = {
                        "no": no,
                        "error": "003",
                        "OTPinvalidFor": OTPinvalidFor,
                        "message": "You entered invalid OTP"
                    }
                    return JsonResponse(context)
                else:
                    validateUsername = usernameValidation(username)
                    if validateUsername['hasError']:
                        no += 1
                        context = {
                            "no": no,
                            "error": '1',
                            "message": validateUsername['message']
                        }
                        data.append(context)

                    validateEmail = EmailValidation(email=email, checkExistency=True)
                    if validateEmail['hasError'] == '1':
                        no += 1
                        context = {
                            "no": no,
                            "error": '2',
                            "message": validateEmail['message']
                        }
                        data.append(context)

                    if Users.objects.filter(Contact=mobile).exists():
                        no += 1
                        context = {
                            "no": no,
                            "error": "3",
                            "message": "Please check your mobile no!",
                        }
                        data.append(context)
                    
                    validatePassword = passwordValidation(password1, username)
                    if password1 != password2:
                        no += 1
                        context = {
                            "no": no,
                            "error": '4',
                            "message": "Password and Confirm Password didn't match"
                        }
                        data.append(context)
                    elif validatePassword['password_error'] != 'No Error':
                        no += 1
                        context = {
                            "no": no,
                            "error": '5',
                            "message": validatePassword['password_error'],
                            "validationError": True,
                        }
                        data.append(context)

                    if Users.objects.filter(ID_Type="Blood Bank's Registration", ID_Number=registration_no).exists():
                        no += 1
                        context = {
                            "no": no,
                            "error": '6',
                            "message": "Blood bank with the registration no already registered."
                        }
                        data.append(context)

                    cont_type1 = str(registration_document.content_type)
                    typeError = True
                    for contentType in settings.DOCUMENT_CONTENT_TYPES:
                        if len(re.findall(contentType, cont_type1)) > 0:
                            typeError = False
                            break
                    if typeError:
                        no += 1
                        context = {
                            "no": no,
                            "error": '7',
                            "message": "Please select an Image or PDF File"
                        }
                        data.append(context)
                    elif registration_document.size > 5242880:
                        no += 1
                        context = {
                            "no": no,
                            "error": '8',
                            "message": "Document size should be maximum 5 MB"
                        }
                        data.append(context)

                    if len(data) > 0:
                        response_data = {
                            'data': data,
                            'inputError': True,
                        }
                        return JsonResponse(response_data)

                    datauser = {
                        "username": username,
                        "email": email,
                        "password1": password1,
                        "password2": password2,
                        "Contact": mobile,
                        "ID_Type": "Blood Bank's Registration",
                        "ID_Number": registration_no
                    }
                    formuser = UsersCreationForm(datauser)
                    if formuser.is_valid():
                        OTP.objects.filter(Email=email, EmailOTP=emailotp, Is_Verified=False, Send_For='Registration').update(Is_Verified=True)
                        OTP.objects.filter(Mobile=mobile, MobileOTP=mobileotp, Is_Verified=False, Send_For='Registration').update(Is_Verified=True)
                        new = formuser.save(commit=False)
                        new.User_Type = ['Blood Bank']
                        new.Registered = False
                        new.save()
                        newuser = Users.objects.get(username=new.username)
                        state = States.objects.get(Name=state)
                        district = Districts.objects.get(Name=district, state=state)
                        createdBloodBank = BloodBank.objects.create(Username=newuser, Name=name, Toll_Free_Number=toll_free_no, Helpline_Number=helpline_number, Emergency_Number=emergency_contact, Contacts=other_contacts, Ownership=ownership, Registration_Document=registration_document, Address=address, State=state, City=city, Subdivision=subdivision, District=district, Pin=pin, Website=website, Latitude=latitude, Longitude=longitude, Blood_Availability={})
                        nextStepUrl = settings.SITE_URL + reverse("Go_Healthy_App:BloodBankRegistration_part2", kwargs={'id': createdBloodBank.Unique_Id})
                        def sendConfirmation():
                            try:
                                file = open('Email_Templates/User/Blood_Bank_Partial_Registration_Mail.html')
                                mes = file.read()
                                file.close()
                                expire = zonetime.now() + datetime.timedelta(days=3)
                                expire = expire.strftime("%d %B %Y")
                                mes = mes.replace("**BloodBankID**", createdBloodBank.Unique_Id).replace("**myusername**", username).replace("**myemail**", email).replace("**mycontact**", mobile).replace("**expireDate**", expire).replace("**registrationNextStep**", nextStepUrl).replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", email)

                                subject = 'Registration Partially Completed'
                                body = ' '
                                htmlMessage = mes
                                sender = settings.DEFAULT_FROM_EMAIL
                                receiver = [email, ]
                                receiver = [
                                    {
                                        "email": email,
                                        "name": name
                                    }
                                ]  
                                uniqueId = "User_Register-" + str(username)
                                newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, uniqueID=uniqueId, messageGroup="Blood_Bank_Partially_Registered")
                                newThreadEmail.start()
                            except Exception as e:
                                print(e)
                            finally:
                                return True
                        transaction.on_commit(sendConfirmation)
                        no += 1
                        context = {
                            "no": no,
                            'error': "0",
                            "username": username,
                            "bloodBankID": createdBloodBank.Unique_Id,
                            "userType": "Blood Bank",
                            "message": "Registered",
                            'next_step_url': nextStepUrl,
                        }
                        return JsonResponse(context)

                    else:
                        formError = str(formuser.errors)
                        no += 1
                        context = {
                            "no": no,
                            "error": "001",
                            "message": "You have found wrong inout! Correct it first",
                        }
                        return JsonResponse(context)
        except Exception as e:
            print(e)
            no += 1
            context = {
                "no": no,
                "error": "002",
                "message": "Server Error! Try again after some time."
            }
            return JsonResponse(context)
    else:
        context = {
            "error": "0",
            "states": States.objects.all(),
            "bloodBankOwnerships": Ownership_choice,
            "registration_part1": True,
        }
        return render(request, 'registerbloodbank.html', context)


@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def bloodBankRegistration_part2(request, id):
    try:
        bloodBank = BloodBank.objects.get(Unique_Id=id)
        if bloodBank.Username.is_verified:
            return HttpResponseNotFound()
        email = bloodBank.Username.email
        mobile = bloodBank.Username.Contact
        if request.method == 'POST':
            sendTo = request.POST.get('sendTo')
            action = request.POST.get('action')
            if action == 'OTPSend':
                if sendTo == 'email':
                    otp = generateOTP(6)
                    OTP.objects.filter(Email=email, Send_For="Blood Bank Register User Verification").delete()
                    OTP.objects.create(Email=email, EmailOTP=otp, Send_For="Blood Bank Register User Verification", expire="unlimited")
                    response_data = {
                        'success': True,
                    }
                    return JsonResponse(response_data)
                elif sendTo == 'mobile':
                    otp = generateOTP(6)
                    OTP.objects.filter(Mobile=mobile, Send_For="Blood Bank Register User Verification").delete()
                    OTP.objects.create(Mobile=mobile, MobileOTP=otp, Send_For="Blood Bank Register User Verification", expire="unlimited")
                    response_data = {
                        'success': True,
                    }
                    return JsonResponse(response_data)
            elif action == 'OTPVerify':
                otp = request.POST.get('otp')
                verifyFor = request.POST.get('verifyFor')
                if verifyFor == 'email':
                    try:
                        otp = OTP.objects.get(Email=email, EmailOTP=otp, Is_Verified=False, Send_For="Blood Bank Register User Verification")
                        otp.Is_Verified = True
                        otp.save()
                        response_data = {
                            'valid': True,
                        }
                    except OTP.DoesNotExist:
                        response_data = {
                            'valid': False,
                        }
                    return JsonResponse(response_data)
                elif verifyFor == 'mobile':
                    try:
                        otp = OTP.objects.get(Mobile=mobile, MobileOTP=otp, Is_Verified=False, Send_For="Blood Bank Register User Verification")
                        otp.Is_Verified = True
                        otp.save()
                        response_data = {
                            'valid': True,
                        }
                    except OTP.DoesNotExist:
                        response_data = {
                            'valid': False,
                        }
                    return JsonResponse(response_data)
        else:
            context = {
                "isRegistered": bloodBank.Username.Registered,
                "bloodBank": bloodBank,
                "error": "0",
                "states": States.objects.all(),
                "bloodBankOwnerships": Ownership_choice,
                "registration_part2": True,
            }
            return render(request, 'registerbloodbank.html', context)
    except BloodBank.DoesNotExist:
        return HttpResponseNotFound()

@require_POST
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def registerBloodBankAddBlood(request):
    bankId = request.POST.get('bloodBankID')
    emailOTP = request.POST.get('emailOTP')
    mobileOTP = request.POST.get('mobileOTP')
    try:
        bloodAvailability = dict()
        userInputs = dict(request.POST) # get all user inputs in a dict
        for key, val in userInputs.items(): # go through all user inputs
            if "BloodAvailability" in key: # only do for inputs which name has this string
                k = key.split("-")[1] # get substring of input name after the -
                inputValue = str(request.POST.get(key, '00'))
                if not inputValue.isdecimal():
                    bloodAvailability[k] = '00'
                else:
                    bloodAvailability[k] = str(int(inputValue)).zfill(2) # store the value of input in dict with leading zero
        bloodBank = BloodBank.objects.get(Unique_Id=bankId, Username__Registered=False)
    except BloodBank.DoesNotExist:
        bloodBank = None
    try:
        with transaction.atomic(durable=True):
            if bloodBank is not None:
                if OTP.objects.filter(MobileOTP=mobileOTP, Mobile=bloodBank.Username.Contact, Is_Verified=True, Send_For="Blood Bank Register User Verification").exists() and OTP.objects.filter(EmailOTP=emailOTP, Email=bloodBank.Username.email, Is_Verified=True, Send_For="Blood Bank Register User Verification").exists():
                    bloodBank.Username.Registered = True
                    bloodBank.Blood_Availability = bloodAvailability
                    bloodBank.Username.save()
                    bloodBank.save()
                    def sendConfirmation():
                        try:
                            file = open('Email_Templates/User/Blood_Bank_Registration_Success_Mail.html')
                            mes = file.read()
                            file.close()
                            expire = zonetime.now() + datetime.timedelta(days=3)
                            expire = expire.strftime("%d %B %Y")
                            mes = mes.replace("**BloodBankID**", bloodBank.Unique_Id).replace("**myusername**", bloodBank.Username.username).replace("**myemail**", bloodBank.Username.email).replace("**mycontact**", bloodBank.Username.Contact).replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**messageSentTo**", bloodBank.Username.email)

                            subject = 'Registration Successful'
                            body = ' '
                            htmlMessage = mes
                            sender = settings.DEFAULT_FROM_EMAIL
                            receiver = [bloodBank.Username.email, ]
                            receiver = [
                                {
                                    "email": bloodBank.Username.email,
                                    "name": bloodBank.Name
                                }
                            ]  
                            uniqueId = "User_Register-" + str(bloodBank.Username.username)
                            newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, uniqueID=uniqueId, messageGroup="Blood_Bank_Registered")
                            newThreadEmail.start()
                        except Exception as e:
                            print(e)
                        finally:
                            OTP.objects.filter(Mobile=bloodBank.Username.Contact, Is_Verified=True, Send_For="Blood Bank Register User Verification").delete()
                            OTP.objects.filter(Email=bloodBank.Username.email, Is_Verified=True, Send_For="Blood Bank Register User Verification").delete()
                            return True
                    transaction.on_commit(sendConfirmation)
                    response_data = {
                        'success': True,
                    }
                    return JsonResponse(response_data)  
    except:
        response_data = {
            'success': False,
        }
        return JsonResponse(response_data)      
       


@prevent_anonymous_ip
@require_http_methods(["GET", "POST"])
@ratelimit(key='ip', rate='100/d', block=True)
@ratelimit(key='post:username', rate='10/d', block=True, method='POST')
@ratelimit(key='post:password', rate='50/d', block=True, method='POST')
@transaction.atomic(durable=True)
def LoginMain(request):
    redirect_user_to = request.POST.get('tonext', '')
    locationPermission = request.POST.get('locationPermission')
    if request.method == 'POST' and locationPermission == 'granted':
        remember = request.POST.get('remember', None)
        username = request.POST.get('username')
        password = request.POST.get('password')

        latitude = request.POST.get('latitude')
        longitude = request.POST.get('longitude')

        if redirect_user_to == '':
            path =  reverse('Go_Healthy_App:Profile')
        else:
            path =  redirect_user_to

        user = authenticate(request, email=username, password=password)
        if user is None:
            user = authenticate(request, username=username, password=password)

        if request.user.is_authenticated and request.user == user:
            # if the same user already logged in they do nothing just redirect to the path
            context = {
                "error": "0",
                "redirect": path,
            }
            return JsonResponse(context)
        else:
            if user is not None and user.Registered:
                if user.is_verified:
                    if user.is_active:
                        if request.user.is_authenticated:
                            # if another user is logging in then log out the user
                            logout(request)
                        client_ip, is_routable = get_client_ip(request)
                        # x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                        # if x_forwarded_for:
                        #     ip = x_forwarded_for.split(',')[0]
                        # else:
                        #     ip = request.META.get('REMOTE_ADDR')

                        userDevice = request.user_agent.device.family
                        userOSFamily = request.user_agent.os.family
                        userOSVersion = request.user_agent.os.version_string
                        userBrowserFamily = request.user_agent.browser.family
                        userBrowserVersion = request.user_agent.browser.version_string

                        userDeviceDetails = userDevice+" (OS: "+userOSFamily+", OS-Version: "+userOSVersion+")"
                        userBrowserDetails = userBrowserFamily+"(version-"+userBrowserVersion+")"

                        userIpInfo = getUserIpInfo(client_ip)
                        security = userIpInfo.get('security', {})
                        location = userIpInfo.get('location', {})
                        network = userIpInfo.get('network', {})
                        
                        ipInfo = {
                            "vpn": security.get('vpn', 'Unknown'),
                            "proxy": security.get('proxy', 'Unknown'),
                            "tor": security.get('tor', 'Unknown'),
                            "relay": security.get('relay', 'Unknown'),
                            "city": location.get('city', 'Unknown'),
                            "region": location.get('region', 'Unknown'),
                            "country": location.get('country', 'Unknown'),
                            "latitude": location.get('latitude', 'Unknown'),
                            "longitude": location.get('longitude', 'Unknown'),
                            "isp": str(network.get('autonomous_system_organization', 'Unknown')).replace("AS for GPRS Service", "")
                        }
                        geoAddress = addressFromCord(latitude, longitude)
                        geoInfo = {
                            'latitude': latitude,
                            'longitude': longitude,
                            'pin': geoAddress.get('pin', 'Unknown'),
                            'city': geoAddress.get('city', 'Unknown'),
                            'state': geoAddress.get('state', 'Unknown'),
                            'district': geoAddress.get('district', 'Unknown'),
                            'country': geoAddress.get('country', 'Unknown'),
                        }

                        if remember is not None and remember != '':
                            request.session.set_expiry(5 * 365 * 24 * 60 * 60) # 5 year in second
                        
                        login(request, user)

                        session = {
                            'session_key': request.session.session_key,
                        }

                        recentLogin = {
                            'Time': zonetime.now().strftime("%d %B %Y, %I:%M %p"),
                            'IP': client_ip,
                            'Device': userDeviceDetails,
                            'Browser': userBrowserDetails,
                            'session': session,
                            'ipInfo': ipInfo,
                            'geoInfo': geoInfo,
                        }
                        previousLastLogins = None
                        if user.last_login_details is not None:
                            previousLastLogins = user.last_login_details.get('last_logins', None)
                        
                        if previousLastLogins is not None:
                            previousLastLogins = ast.literal_eval(previousLastLogins)  # Convert string like list to pure list
                            if len(previousLastLogins) >= 10:
                                previousLastLogins.pop(0)
                        else:
                            previousLastLogins = []
                        previousLastLogins.append(recentLogin)
                        lastLogins = {
                            'last_logins': previousLastLogins
                        }
                        user.last_login_details = lastLogins
                        user.save()
                    
                        context = {
                            "error": "0",
                            "redirect": path,
                        }
                        def sendAlert():
                            file = open('Email_Templates/User/Login_Alert.html')
                            mes = file.read()
                            mes = mes.replace("**Username**", user.username).replace("**mysite**", settings.SITE_URL).replace("**contact_url**", reverse('Go_Healthy_App:project-Contact')).replace("**reset_password_url**", reverse('Go_Healthy_App:ResetPassword')).replace("**messageSentTo**", user.email)
                            file.close()
                            replaces = {
                                "**Login_Time**": zonetime.now().strftime("%d %B %Y, %I:%M %p"),
                                "**Session_Key**": request.session.session_key,
                                "**Login_Device**": userDeviceDetails,
                                "**Login_Browser**": userBrowserDetails,
                                "**Login_geo_latitude**": latitude,
                                "**Login_geo_longitude**": longitude,
                                "**Login_geo_pin**": geoAddress.get('pin', 'Unknown'),
                                "**Login_geo_city**": geoAddress.get('city', 'Unknown'),
                                "**Login_geo_state**": geoAddress.get('state', 'Unknown'),
                                "**Login_geo_district**": geoAddress.get('district', 'Unknown'),
                                "**Login_geo_country**": geoAddress.get('country', 'Unknown'),
                                "**Login_IP**": client_ip,
                                "**Login_isp**": str(network.get('autonomous_system_organization', 'Unknown')).replace("AS for GPRS Service", ""),
                                "**Login_ip_city**": location.get('city', 'Unknown'),
                                "**Login_ip_region**": location.get('region', 'Unknown'),
                                "**Login_ip_country**": location.get('country', 'Unknown'),
                                "**Login_ip_latitude**": location.get('latitude', 'Unknown'),
                                "**Login_ip_longitude**": location.get('longitude', 'Unknown'),
                                "**Login_ip_vpn**": security.get('vpn', 'Unknown'),
                                "**Login_ip_proxy**": security.get('proxy', 'Unknown'),
                                "**Login_ip_tor**": security.get('tor', 'Unknown'),
                                "**Login_ip_relay**": security.get('relay', 'Unknown'),
                            }
                            for key, value in replaces.items():
                                mes = mes.replace(key, str(value))
                            subject = 'New Login Alert'
                            body = ' '
                            htmlMessage = mes
                            sender = settings.DEFAULT_FROM_EMAIL
                            receiver = [
                                {
                                    "email": user.email,
                                    "name":  user.username
                                }
                            ]
                            newThreadEmail = Send_Mail(From=sender, To=receiver, Subject=subject, Text=body, HTML=htmlMessage, messageGroup="Login Alert")
                            newThreadEmail.start()
                        transaction.on_commit(sendAlert)
                    else:
                        message = 'Account is Deactivated!'
                        context = {
                            "message": message,
                            "error": "1",
                        }
                else:
                    context = {
                        "error": "1",
                        "message": "Account is not verified still Now, We will verify your information."
                    }
            else:
                messages = "Invalid Credential"
                context = {
                    "error": "1",
                    "message": messages,
                }
            return JsonResponse(context)
    else:
        return render(request, 'login.html')

@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def Logout(request):
    logout(request)
    return redirect('Go_Healthy_App:LoginMain')


def noScriptView(request):
    return render(request, 'noscript.html')


@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def faq(request):
    return render(request, 'faq.html')

@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def donorEligibility(request):
    return render(request, 'blooddonoreligibility.html')

@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def termsConditions(request):
    return render(request, 'terms_conditions.html')




@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def dataCenter(request):  

    totalHos = Hospital.objects.filter(Username__is_verified=True, Username__is_active=True, Username__Registered=True, Username__User_Type__contains=['Hospital']).count()
    totalBank = BloodBank.objects.filter(Username__is_verified=True, Username__is_active=True, Username__Registered=True,  Username__User_Type__contains=['Blood Bank']).count()
    totalDoc = Doctor.upgrade_Not_Pending_objects.filter(Username__is_verified=True, Username__is_active=True, Username__User_Type__contains=['Doctor']).count()
    totalDonor = Blood_Donar.objects.filter(Username__is_verified=True, Username__is_active=True, Username__User_Type__contains=['Blood Donor']).count()
    
    totalBeds = BedNo.objects.filter(Q(Hospital__Username__is_verified=True, Hospital__Username__is_active=True, Hospital__Username__Registered=True) & ~Q(Availability="Null")).count()
    totalAvailableBeds = BedNo.objects.filter(Q(Hospital__Username__is_verified=True, Hospital__Username__is_active=True, Hospital__Username__Registered=True, Availability='Available') & ~Q(Availability="Null")).count()
    totalUsedBeds = BedNo.objects.filter(Q(Hospital__Username__is_verified=True, Hospital__Username__is_active=True, Hospital__Username__Registered=True, Availability='Used') & ~Q(Availability="Null")).count()
    totalBook = PatientData.objects.filter(Booking_Time__date=zonetime.now()).exclude(Status='Expired').exclude(Booked_By='Hospital Authority').count()
    
    totalBloodRequest = BloodRequest.today_objects.all().count()
    totalBloodDonationCampToday = BloodDonationCamp.today_objects.all().count()
    totalBloodDonatedToday = BloodDonationCollectionRecord.objects.filter(Issued_at__date=datetime.datetime.now(), Certificate_issued_for="Blood Donation").count()
    totalBloodCollectedToday = BloodDonationCollectionRecord.objects.filter(Issued_at__date=datetime.datetime.now(), Certificate_issued_for="Blood Collection").count()

    totalAdmit = PatientData.objects.filter(Admit_Time__date=zonetime.now(), Status='Admitted').count()
    totalReleased = PatientData.objects.filter(Status_Changed_At__date=zonetime.now(), Status='Released').count()
    totalReferred = ReferredPatient.objects.filter(ReferredDate__date=zonetime.now()).order_by('Patient__pk').distinct('Patient__pk').count()
    totalDied = PatientData.objects.filter(Status_Changed_At__date=zonetime.now(), Status='Died').count()

    current_year = datetime.date.today().year
    old_year = current_year - 10
    years = []
    for i in range(current_year, old_year, -1):
        years.append(str(i))
    
    last_id = get_current_event_id(['liveData'])
    context = {
        "totalHos":totalHos,
        "totalBank": totalBank,
        "totalDoc":totalDoc,
        "totalDonor":totalDonor,
        "totalBeds":totalBeds,
        "totalAvailableBeds": totalAvailableBeds,
        "totalUsedBeds": totalUsedBeds,
        "totalBloodRequest":totalBloodRequest,
        "totalBook":totalBook,
        'totalAdmit':totalAdmit,
        'totalReleased':totalReleased,
        'totalDied':totalDied,
        'totalBloodDonationCampToday': totalBloodDonationCampToday,
        'totalBloodDonatedToday': totalBloodDonatedToday,
        'totalBloodCollectedToday': totalBloodCollectedToday,
        'totalReferred': totalReferred,
        "years": years,
        "last_id": last_id,
    }
    return render(request, 'data.html', context)


@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def columnGraph_bloodDonatedandCollected(request):
    state = request.GET.get('state', 'India')
    district = request.GET.get('district', '')
    x_axis = request.GET.get('x_axis', 'year')
    y_axis = request.GET.get('y_axis', 'Units')
    group = request.GET.get('group')
    month_name = str(request.GET.get('month', datetime.date.today().strftime("%B")))
    datetime_object = datetime.datetime.strptime(month_name, "%B")
    month_number = datetime_object.month # convert month to number
    year = str(request.GET.get('year', datetime.date.today().strftime("%Y")))
    bloodBank = request.GET.get('blood_bank', '')

    current_day = datetime.date.today().day
    current_month = datetime.date.today().month
    current_year = datetime.date.today().year
    old_year = current_year - 10

    kwargs = {}
    if state != 'India':
        kwargs['Blood_Bank__State__Name'] = state
        if district != '':
            kwargs['Blood_Bank__District__Name'] = district
        if bloodBank != '':
            kwargs['Blood_Bank__id'] = bloodBank
    
    if x_axis == 'day':
        kwargs['Issued_at__month'] = month_number
        kwargs['Issued_at__year'] = year
    elif x_axis == 'month':
        kwargs['Issued_at__year'] = year
    elif x_axis == 'year':
        kwargs['Issued_at__year__gt'] = old_year

    donationData = BloodDonationCollectionRecord.objects.filter(Certificate_issued_for="Blood Donation", **kwargs)
    collectionData = BloodDonationCollectionRecord.objects.filter(Certificate_issued_for="Blood Collection", **kwargs)       

    if donationData.count() <= 0 and collectionData.count() <= 0:
        response_data = {
            'donoationCollectionData': [],
        }
        return JsonResponse(response_data)
    # model.objects
    # .annotate(month=Extract('created', 'month'))  # Truncate to month and add to select list
    # .order_by()      # To do group we need order by
    # .values('month')                          # Group By month
    # .annotate(total=Count('id'))                  # Select the count of the grouping (count how many group created)
    # .values('month', 'total')                     # select month and count
    if y_axis == "Persons":
        # donor data
        if group == "Gender":
            donationDataGroup1 = donationData.filter(Gender='Male').annotate(x=Extract('Issued_at', x_axis))
        elif group == 'Age':
            donationDataGroup1 = donationData.filter(Age__lte=30).annotate(x=Extract('Issued_at', x_axis))
        donationDataGroup1 = donationDataGroup1.values('x').order_by('x') \
        .annotate(value=Count('Phone', distinct=True)) \
        .values('x', 'value')
        donationDataGroup1 = list(donationDataGroup1)
        if group == "Gender":
            donationDataGroup2 = donationData.filter(Gender='Female').annotate(x=Extract('Issued_at', x_axis))
        elif group == 'Age':
            donationDataGroup2 = donationData.filter(Age__gt=30,Age__lte=45).annotate(x=Extract('Issued_at', x_axis))
        donationDataGroup2 = donationDataGroup2.values('x').order_by('x') \
        .annotate(value=Count('Phone', distinct=True)) \
        .values('x', 'value')
        donationDataGroup2 = list(donationDataGroup2)
        if group == "Gender":
            donationDataGroup3 = donationData.filter(Gender='Other').annotate(x=Extract('Issued_at', x_axis))
        elif group == 'Age':
            donationDataGroup3 = donationData.filter(Age__gt=45).annotate(x=Extract('Issued_at', x_axis))
        donationDataGroup3 = donationDataGroup3.values('x').order_by('x') \
        .annotate(value=Count('Phone', distinct=True)) \
        .values('x', 'value')
        donationDataGroup3 = list(donationDataGroup3)
        # collector data
        if group == "Gender":
            collectionDataGroup1 = collectionData.filter(Gender='Male').annotate(x=Extract('Issued_at', x_axis))
        elif group == 'Age':
            collectionDataGroup1 = collectionData.filter(Age__lte=30).annotate(x=Extract('Issued_at', x_axis))
        collectionDataGroup1 = collectionDataGroup1.values('x').order_by('x') \
        .annotate(value=Count('Phone', distinct=True)) \
        .values('x', 'value')
        collectionDataGroup1 = list(collectionDataGroup1)
        if group == "Gender":
            collectionDataGroup2 = collectionData.filter(Gender='Female').annotate(x=Extract('Issued_at', x_axis))
        elif group == 'Age':
            collectionDataGroup2 = collectionData.filter(Age__gt=30, Age__lte=45).annotate(x=Extract('Issued_at', x_axis))
        collectionDataGroup2 = collectionDataGroup2.values('x').order_by('x') \
        .annotate(value=Count('Phone', distinct=True)) \
        .values('x', 'value')
        collectionDataGroup2 = list(collectionDataGroup2)
        if group == "Gender":
            collectionDataGroup3 = collectionData.filter(Gender='Other').annotate(x=Extract('Issued_at', x_axis))
        elif group == 'Age':
            collectionDataGroup3 = collectionData.filter(Age__gt=45).annotate(x=Extract('Issued_at', x_axis))
        collectionDataGroup3 = collectionDataGroup3.values('x').order_by('x') \
        .annotate(value=Count('Phone', distinct=True)) \
        .values('x', 'value')
        collectionDataGroup3 = list(collectionDataGroup3)
    elif y_axis == "Units":
        # donor data
        if group == "Gender":
            donationDataGroup1 = donationData.filter(Gender='Male').annotate(x=Extract('Issued_at', x_axis))
        elif group == 'Age':
            donationDataGroup1 = donationData.filter(Age__lte=30).annotate(x=Extract('Issued_at', x_axis))
        donationDataGroup1 = donationDataGroup1.values('x').order_by('x') \
        .annotate(value=Sum('Unit')) \
        .values('x', 'value')
        donationDataGroup1 = list(donationDataGroup1)
        if group == "Gender":
            donationDataGroup2 = donationData.filter(Gender='Female').annotate(x=Extract('Issued_at', x_axis))
        elif group == 'Age':
            donationDataGroup2 = donationData.filter(Age__gt=30,Age__lte=45).annotate(x=Extract('Issued_at', x_axis))
        donationDataGroup2 = donationDataGroup2.values('x').order_by('x') \
        .annotate(value=Sum('Unit')) \
        .values('x', 'value')
        donationDataGroup2 = list(donationDataGroup2)
        if group == "Gender":
            donationDataGroup3 = donationData.filter(Gender='Other').annotate(x=Extract('Issued_at', x_axis))
        elif group == 'Age':
            donationDataGroup3 = donationData.filter(Age__gt=45).annotate(x=Extract('Issued_at', x_axis))
        donationDataGroup3 = donationDataGroup3.values('x').order_by('x') \
        .annotate(value=Sum('Unit')) \
        .values('x', 'value')
        donationDataGroup3 = list(donationDataGroup3)
        # collector data
        if group == "Gender":
            collectionDataGroup1 = collectionData.filter(Gender='Male').annotate(x=Extract('Issued_at', x_axis))
        elif group == 'Age':
            collectionDataGroup1 = collectionData.filter(Age__lte=30).annotate(x=Extract('Issued_at', x_axis))
        collectionDataGroup1 = collectionDataGroup1.values('x').order_by('x') \
        .annotate(value=Sum('Unit')) \
        .values('x', 'value')
        collectionDataGroup1 = list(collectionDataGroup1)
        if group == "Gender":
            collectionDataGroup2 = collectionData.filter(Gender='Female').annotate(x=Extract('Issued_at', x_axis))
        elif group == 'Age':
            collectionDataGroup2 = collectionData.filter(Age__gt=30, Age__lte=45).annotate(x=Extract('Issued_at', x_axis))
        collectionDataGroup2 = collectionDataGroup2.values('x').order_by('x') \
        .annotate(value=Sum('Unit')) \
        .values('x', 'value')
        collectionDataGroup2 = list(collectionDataGroup2)
        if group == "Gender":
            collectionDataGroup3 = collectionData.filter(Gender='Other').annotate(x=Extract('Issued_at', x_axis))
        elif group == 'Age':
            collectionDataGroup3 = collectionData.filter(Age__gt=45).annotate(x=Extract('Issued_at', x_axis))
        collectionDataGroup3 = collectionDataGroup3.values('x').order_by('x') \
        .annotate(value=Sum('Unit')) \
        .values('x', 'value')
        collectionDataGroup3 = list(collectionDataGroup3)
    donoationCollectionData = []
    if x_axis == 'day':
        day_in_the_month = calendar.monthrange(int(year), month_number)[1]
        day_upto = day_in_the_month + 1
        if str(year) == str(current_year) and str(month_number) == str(current_month):
            day_upto = int(current_day)+1
        limit =  range(1, day_upto)
    elif x_axis == 'month':
        month_upto = 12 + 1
        if str(year) == str(current_year):
            month_upto = int(current_month)+1
        limit = range(1, month_upto)
    elif x_axis == 'year':
        limit = range(old_year+1, current_year+1)
    
    for date in limit:
        if x_axis == 'day':
            arr = ['Day '+str(date), ]
        elif x_axis == 'month':
            datetime_object = datetime.datetime.strptime(str(date), "%m")
            month_name = datetime_object.strftime("%B")
            arr = [month_name, ]
        elif x_axis == 'year':
            arr = [str(date), ]
        
        v = 0
        if len(donationDataGroup3) > 0:
            for dictionary in donationDataGroup3:
                if date == dictionary.get('x'): # if the list of dicts has data of this year
                    v = dictionary.get('value')
                    break
                else:
                    v = 0
        else:
            v = 0
        arr.append(v)

        v = 0
        if len(donationDataGroup2) > 0:
            for dictionary in donationDataGroup2:
                if date == dictionary.get('x'): # if the list of dicts has data of this year
                    v = dictionary.get('value')
                    break
                else:
                    v = 0
        else:
            v = 0
        arr.append(v)

        v = 0
        if len(donationDataGroup1) > 0:
            for dictionary in donationDataGroup1:
                if date == dictionary.get('x'): # if the list of dicts has value of this year
                    v = dictionary.get('value')
                    break
                else:
                    v = 0
        else:
            v = 0
        arr.append(v)
        
        v = 0
        if len(collectionDataGroup3) > 0:
            for dictionary in collectionDataGroup3:
                if date == dictionary.get('x'): # if the list of dicts has value of this year
                    v = dictionary.get('value')
                    break
                else:
                    v = 0
        else:
            v = 0
        arr.append(v)

        v = 0
        if len(collectionDataGroup2) > 0:
            for dictionary in collectionDataGroup2:
                if date == dictionary.get('x'): # if the list of dicts has value of this year
                    v = dictionary.get('value')
                    break
                else:
                    v = 0
        else:
            v = 0
        arr.append(v)

        v = 0
        if len(collectionDataGroup1) > 0:
            for dictionary in collectionDataGroup1:
                if date == dictionary.get('x'): # if the list of dicts has value of this year
                    v = dictionary.get('value')
                    break
                else:
                    v = 0
        else:
            v = 0
        arr.append(v)
        donoationCollectionData.append(arr)
        
    response_data = {
        'donoationCollectionData': donoationCollectionData,
    }
    return JsonResponse(response_data)

    
    
@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def columnGraph_bloodRequestedandDonated(request):
    state = request.GET.get('state', 'India')
    district = request.GET.get('district', '')
    x_axis = request.GET.get('x_axis', 'year')
    y_axis = request.GET.get('y_axis', 'Units')
    group = request.GET.get('group')
    month_name = str(request.GET.get('month', datetime.date.today().strftime("%B")))
    datetime_object = datetime.datetime.strptime(month_name, "%B")
    month_number = datetime_object.month # convert month to number
    year = str(request.GET.get('year', datetime.date.today().strftime("%Y")))
    hospital = request.GET.get('hospital', '')

    current_day = datetime.date.today().day
    current_month = datetime.date.today().month
    current_year = datetime.date.today().year
    old_year = current_year - 10

    kwargs1 = {}
    kwargs2 = {}
    if state != 'India':
        kwargs1['Blood_Bank__State__Name'] = state
        kwargs2['Admit_Hospital__State__Name'] = state
        if district != '':
            kwargs1['Blood_Bank__District__Name'] = district
            kwargs2['Admit_Hospital__District__Name'] = district
        if hospital != '':
            kwargs2['Admit_Unique_Id'] = hospital
    
    if x_axis == 'day':
        kwargs1['Issued_at__month'] = month_number
        kwargs1['Issued_at__year'] = year
        kwargs2['Requested_at__month'] = month_number
        kwargs2['Requested_at__year'] = year
    elif x_axis == 'month':
        kwargs1['Issued_at__year'] = year
        kwargs2['Requested_at__year'] = year
    elif x_axis == 'year':
        kwargs1['Issued_at__year__gt'] = old_year
        kwargs2['Requested_at__year__gt'] = old_year

    donationData = BloodDonationCollectionRecord.objects.filter(Certificate_issued_for="Blood Donation", **kwargs1)
    bloodRequests = BloodRequest.objects.filter(**kwargs2)
    
    if donationData.count() <= 0 and bloodRequests.count() <= 0:
        response_data = {
            'donoationAndRequestData': [],
        }
        return JsonResponse(response_data)

    if y_axis == "Persons":
        # donor data
        donationData = donationData.annotate(x=Extract('Issued_at', x_axis)) \
        .values('x').order_by('x') \
        .annotate(value=Count('Phone', distinct=True)) \
        .values('x', 'value')
        donationData = list(donationData)
        
        # blood request data
        requestData = bloodRequests.annotate(x=Extract('Requested_at', x_axis)) \
        .values('x').order_by('x') \
        .annotate(value=Count('Contact', distinct=True)) \
        .values('x', 'value')
        requestData = list(requestData)
        
    elif y_axis == "Units":
        # donor data
        donationData = donationData.annotate(x=Extract('Issued_at', x_axis)) \
        .values('x').order_by('x') \
        .annotate(value=Sum('Unit')) \
        .values('x', 'value')
        donationData = list(donationData)
        # blood request data
        requestData = bloodRequests.annotate(x=Extract('Requested_at', x_axis)) \
        .values('x').order_by('x') \
        .annotate(value=Sum('Unit')) \
        .values('x', 'value')
        requestData = list(requestData)
        
    donoationAndRequestData = []
    if x_axis == 'day':
        day_in_the_month = calendar.monthrange(int(year), month_number)[1]
        day_upto = day_in_the_month + 1
        if str(year) == str(current_year) and str(month_number) == str(current_month):
            day_upto = int(current_day)+1
        limit =  range(1, day_upto)
    elif x_axis == 'month':
        month_upto = 12 + 1
        if str(year) == str(current_year):
            month_upto = int(current_month)+1
        limit = range(1, month_upto)
    elif x_axis == 'year':
        limit = range(old_year+1, current_year+1)
    
    for date in limit:
        if x_axis == 'day':
            arr = ['Day '+str(date), ]
        elif x_axis == 'month':
            datetime_object = datetime.datetime.strptime(str(date), "%m")
            month_name = datetime_object.strftime("%B")
            arr = [month_name, ]
        elif x_axis == 'year':
            arr = [str(date), ]

        v = 0
        if len(requestData) > 0:
            for dictionary in requestData:
                if date == dictionary.get('x'): # if the list of dicts has value of this year
                    v = dictionary.get('value')
                    break
                else:
                    v = 0
        else:
            v = 0
        arr.append(v)

        v = 0
        if len(donationData) > 0:
            for dictionary in donationData:
                if date == dictionary.get('x'): # if the list of dicts has data of this year
                    v = dictionary.get('value')
                    break
                else:
                    v = 0
        else:
            v = 0
        arr.append(v)
        donoationAndRequestData.append(arr)

    response_data = {
        'donoationAndRequestData': donoationAndRequestData,
    }
    return JsonResponse(response_data)



@ratelimit(group='Main', key='ip', rate=settings.DEFAULT_VIEW_RATE_LIMIT, block=True)
def columnGraph_bloodDonationCamps(request):
    state = request.GET.get('state', 'India')
    district = request.GET.get('district', '')
    x_axis = request.GET.get('x_axis', 'year')
    y_axis = request.GET.get('y_axis', 'Units')
    group = request.GET.get('group')
    month_name = str(request.GET.get('month', datetime.date.today().strftime("%B")))
    datetime_object = datetime.datetime.strptime(month_name, "%B")
    month_number = datetime_object.month # convert month to number
    year = str(request.GET.get('year', datetime.date.today().strftime("%Y")))

    current_day = datetime.date.today().day
    current_month = datetime.date.today().month
    current_year = datetime.date.today().year
    old_year = current_year - 10

    kwargs = {}
    if state != 'India':
        kwargs['State__Name'] = state
        if district != '':
            kwargs['District__Name'] = district

    donationCamps = BloodDonationCamp.past_and_present_objects.filter(**kwargs)
    if x_axis == 'day':
        donationCamps = donationCamps.filter(Q(End_Date=None, Start_Date__month=month_number, Start_Date__year=year) | Q(~Q(End_Date=None), Start_Date__month__lte=month_number, Start_Date__year__lte=year, End_Date__month__gte=month_number, End_Date__year__gte=year))
    elif x_axis == 'month':
        donationCamps = donationCamps.filter(Q(End_Date=None, Start_Date__year=year) | Q(~Q(End_Date=None), Start_Date__year__lte=year, End_Date__year__gte=year))
    elif x_axis == 'year':
        donationCamps = donationCamps.filter(Q(End_Date=None, Start_Date__year__gt=old_year) | Q(~Q(End_Date=None), End_Date__year__gt=old_year))
    
    if donationCamps.count() <= 0:
        response_data = {
            'donoationCampData': [],
        }
        return JsonResponse(response_data)

    donationCamps = donationCamps.annotate(x=Extract('Start_Date', x_axis)) \
    .values('x').order_by('x') \
    .annotate(value=Count('id')) \
    .values('x', 'value')
    donationCamps = list(donationCamps)
    
    if len(donationCamps) <= 0:
        response_data = {
            'donoationCampData': [],
        }
        return JsonResponse(response_data)
        
    donoationCampsList = []
    if x_axis == 'day':
        day_in_the_month = calendar.monthrange(int(year), month_number)[1]
        day_upto = day_in_the_month + 1
        if str(year) == str(current_year) and str(month_number) == str(current_month):
            day_upto = int(current_day)+1
        limit =  range(1, day_upto)
    elif x_axis == 'month':
        month_upto = 12 + 1
        if str(year) == str(current_year):
            month_upto = int(current_month)+1
        limit = range(1, month_upto)
    elif x_axis == 'year':
        limit = range(old_year+1, current_year+1)
    
    for date in limit:
        if x_axis == 'day':
            arr = ['Day '+str(date), ]
        elif x_axis == 'month':
            datetime_object = datetime.datetime.strptime(str(date), "%m")
            month_name = datetime_object.strftime("%B")
            arr = [month_name, ]
        elif x_axis == 'year':
            arr = [str(date), ]

        v = 0
        for dictionary in donationCamps:
            if date == dictionary.get('x'): # if the list of dicts has value of this date
                v = dictionary.get('value')
                break
            else:
                v = 0
        arr.append(v)
        donoationCampsList.append(arr)
     
    response_data = {
        'donoationCampData': donoationCampsList,
    }
    return JsonResponse(response_data)