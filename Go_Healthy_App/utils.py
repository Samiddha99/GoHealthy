from django.conf import settings
import secrets
import string
import random
from django.core.cache import cache
from django.urls import reverse
from typing import *
from django.http import HttpRequest
from django.utils.cache import get_cache_key
import json, urllib, urllib3
from twilio.rest import Client
from django.core.mail import EmailMessage, send_mail
from email_validator import validate_email
from django.utils import timezone as zonetime
from django.contrib.sessions.models import Session
from mailjet_rest import Client as mailjet_client
import io
from io import BytesIO, StringIO
from django.http import HttpResponse
import png
import docx
import os
import mimetypes
import ast
import base64
from pyqrcode import QRCode
import django.contrib.auth.password_validation as validators
import dropbox
import numpy
import requests
import http.client
import sendgrid
from dateutil import tz
from django.core import exceptions
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from django.db.models.expressions import F
from django.core.files import File
from django.template import Context, Template
from django.template.loader import get_template
from xhtml2pdf import pisa
from docx import Document
import django
import re
from itertools import islice
import time as t
import threading
import qrcode
import pyqrcode
import pdfkit
import imgkit
from fpdf import FPDF, HTMLMixin
from dateutil import parser
from django.db.models.functions import *
from ipware import get_client_ip
import calendar
import traceback
import inspect
import sys 
import platform, subprocess
from .models import *
from .choice import *


# Logout the user from all devices.
def logoff_all(user):
    try:
        # Filtering all session objects.
        session_query = Session.objects.all()
        # Iterating session_query and fetching session key.
        for session in session_query:
            var_id = session.get_decoded().get('_auth_user_id')  # Decoding session key and getting user id from that.
            if str(var_id) == str(user.id): # if user Id from decode and user id of the given user is same then delete that session key from Session table from database.
                session.delete()
    except Exception as e:
        traceback.print_exc()

# In how many devices user is curently loging in
def activeLogedCount(user):
    try:
        count = 0
        # Filtering all session objects.
        session_query = Session.objects.all()
        # Iterating session_query and fetching session key.
        for session in session_query:
            var_id = session.get_decoded().get('_auth_user_id')  # Decoding session key and getting user id from that.
            if str(var_id) == str(user.id): # if user Id from decode and user id of the given user is same then delete that session key from Session table from database.
                count += 1
        return count
    except Exception as e:
        print(e)
        return 0



def getUserIpInfo(ip_address):
    # ip_address = '223.231.79.86'
    url = "https://vpnapi.io/api/"+str(ip_address)+"?key="+str(settings.VPNAPI_KEY)
    headers = {
        'Content-Type': "application/x-www-form-urlencoded",
        'Cache-Control': "no-cache",
    }
    ipInfo = requests.request("GET", url, headers=headers)
    ipInfo = json.loads(ipInfo.text)
    return ipInfo

def getDistrict(state : str):
    districts = []
    if States.objects.filter(Name=state).exists():
        state = States.objects.get(Name=state)
        districts = list(Districts.objects.values_list('Name', flat=True).filter(state=state))
    return districts


def usernameValidation(username):
    exists = None
    space = None
    length = None
    invalid = False
    hasError = False
    usernameValidation = [False for character in username if(not re.findall("[a-zA-Z0-9@.+-_]", character))]
    if usernameValidation:
        invalid = True
        hasError = True
        message = "Non supported special character entered!<br>Only @, _, ., +, - are acceptable."
    elif Users.objects.filter(username=username).exists():
        exists = "1"
        hasError = True
        message = "The username is not available"
    elif ' ' in username:
        space = "1"
        hasError = True
        message = "Space is not allow!"
    elif len(username) > 15:
        length = "max"
        hasError = True
        message = "Length must be maximum 15!"
    elif len(username) < 5:
        length = "min"
        hasError = True
        message = "Length must be minimum 5!"
    else:
        hasError = False
        message = "Valid username"
    data = {
        'is_exists':exists,
        'is_space':space,
        'length':length,
        'invalid':invalid,
        'hasError': hasError,
        'message': message,
    }
    return data

    
def EmailValidation(email : str, checkExistency :bool = True):
    exists = '0'
    valid = '1'
    hasError = '0'
    message = 'Valid email id'
    try:
        validate_email(email)
        if checkExistency:
            if Users.objects.filter(email=email).exists():
                exists = "1"
                hasError = '1'
                message = "The email is not available!"
            else:
                exists = "0"
                hasError = '0'
                message = "The email is available!"
    except Exception as e:
        valid = '0'
        hasError = '1'
        message = "Invalid email id!"
    finally:
        data = {
            'is_exists':exists,
            'valid':valid,
            'hasError':hasError,
            'message': message,
        }
        return data



def firstCharacterCapital(theString):
    return theString[0].upper() + theString[1:]

def firstCharOfEachWordCapital(theString):
    splittedLines = theString.split("\n")
    capitalizedLineList = []
    for line in splittedLines:
        capitalizedLine = string.capwords(line)
        capitalizedLineList.append(capitalizedLine)
    return "\n".join(capitalizedLineList)


def formatInputs(inputData :str, notIgnoreSpecialCharacter :str = ' ', isAlphaNumeric :bool = False, isOnlyNumeric :bool = False):
    if(isAlphaNumeric):
        notValidCharacters = "[^A-Za-z0-9"+notIgnoreSpecialCharacter+"]"
    elif isOnlyNumeric:
        notValidCharacters = "[^0-9"+notIgnoreSpecialCharacter+"]"
    else:
        notValidCharacters = "[^A-Za-z"+notIgnoreSpecialCharacter+"]"
    formatedInput = re.sub(notValidCharacters, '', inputData) 
    return formatedInput


def passwordValidation(password :str, Username :str):
    passwordErrors = []
    hasNumber = False
    special_characters = ['`', '~', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', '{', '}', '[', ']', "'", '"', ",", ".", "/", "?", "<", ">"]
    has_special_characters = any(symbol in password for symbol in special_characters)
    hasNumber = any(char.isdecimal() for char in password)
    try:
        # validate the password and catch the exception
        validators.validate_password(password=password, user=Username)
    # the exception raised here is different than serializers.ValidationError
    except exceptions.ValidationError as e:
        message = str(e.messages)
        if "This password is too common" in message:
            password_error = {
                'error_code': '1',
                'error_message': "This password is too common",
            }
            passwordErrors.append(password_error)
    if password.lower().find(Username.lower()) != -1:
        password_error = {
            'error_code': '2',
            'error_message': "Password must not be similar to the Username",
        }
        passwordErrors.append(password_error)
    if (len(password) < 8):
        password_error = {
            'error_code': '3',
            'error_message': "This password must not be too short<br>It must contain at least 8 characters",
        }
        passwordErrors.append(password_error)
    if (password.isalpha()):
        password_error = {
            'error_code': '4',
            'error_message': "This password must not be entirely alphabetic",
        }
        passwordErrors.append(password_error)
    if password.isdecimal():
        password_error = {
            'error_code': '5',
            'error_message': "This password must not be entirely numeric",
        }
        passwordErrors.append(password_error)
    if not any(char.isupper() for char in password):
        password_error = {
            'error_code': '6',
            'error_message': "Password must contain at least one uppercase letter",
        }
    if not any(char.islower() for char in password):
        password_error = {
            'error_code': '7',
            'error_message': "Password must contain at least one lowercase letter",
        }
        passwordErrors.append(password_error)
    if not hasNumber:
        password_error = {
            'error_code': '8',
            'error_message': "Password must contain at least one digit",
        }
        passwordErrors.append(password_error)
    if not has_special_characters:
        password_error = {
            'error_code': '9',
            'error_message': "Password must contain at least one special character",
        }
        passwordErrors.append(password_error)
    
    if len(passwordErrors) > 0:
        responseData = {
            'password_error': passwordErrors
        }
        return responseData
    else:
        responseData = {
            'password_error': 'No Error'
        }
        return responseData

        

def shortUrl(destination, title):
    linkRequest = {
        "destination": destination,
        "domain": { "fullName": "rebrand.ly" },
        "title": title
    }
    requestHeaders = {
        "Content-type": "application/json",
        "apikey": settings.REBRANDLY_API_KEY,
        #"workspace": "YOUR_WORKSPACE_ID"
    }
    r = requests.post("https://api.rebrandly.com/v1/links", data=json.dumps(linkRequest), headers=requestHeaders)
    if (r.status_code == requests.codes.ok):
        link = r.json()
        return link["shortUrl"]
    else:
        res = r.json()
        return res


def generateIMGfromHTML(template_src :str, file_name :str, save :bool, context :dict = {}):
    if settings.DEPLOY:
        imgkit_config = imgkit.config(wkhtmltoimage=settings.WKHTMLTOIMAGE_BINARY_PATH)
    else:
        imgkit_config = imgkit.config()

    template_file = open(template_src, "r")
    template = Template(template_file.read())
    template_file.close()
    context = Context(context)
    html = template.render(context)
    file_extension = str(file_name.split('.')[-1])
    if not (file_extension.lower() == 'png'):
        file_name = str(file_name)+".png"
    options = {
        'format': 'png',
        'crop-x': '0',
        'crop-y': '0',
        'encoding': "UTF-8",
        'no-outline': True,
        'image-quality': 100,
        'quality': 100,
        'image-dpi': 600,
    }
    if save:
        img = imgkit.from_string(string=html, output_path=file_name, options=options, config=imgkit_config)
        result_file = open(file_name, "rb")
        result_file.close()
        return result_file
    else:
        img = imgkit.from_string(string=html, output_path=False, options=options, config=imgkit_config) # this will return the generated image in bytes format
        result = BytesIO(initial_bytes=img) # convert the bytes format in bytesIO
        imgFile = File(result, name=file_name) # return the created image as file format
        return imgFile



def generatePDFfromHTML(template_src :str, file_name :str, save :bool, title :str, context :dict = {}, pdf_url=''):
    pdfkit_config = pdfkit.configuration(wkhtmltopdf=settings.WKHTMLTOPDF_BINARY_PATH)
    template_file = open(template_src, "r")
    template = Template(template_file.read())
    template_file.close()
    context = Context(context)
    html = template.render(context)
    file_extension = str(file_name.split('.')[-1])
    if not (file_extension == 'pdf'):
        file_name = str(file_name)+".pdf"
    options = {
        'title': str(title),
        'page-size': 'A4',
        'margin-top': '0.2in',
        'margin-right': '0.1in',
        'margin-bottom': '0.5in',
        'margin-left': '0.1in',
        'orientation': 'Portrait',
        'no-outline': True,
        'encoding': "UTF-8",
        'page-offset': '1',
        'footer-font-size': '8',
        'header-font-size': '8',
        'header-left': str(pdf_url),
        'footer-right': "Page [page] of [topage]",
    }
    if save:
        pdf = pdfkit.from_string(input=html, output_path=file_name, options=options, configuration=pdfkit_config)
        result_file = open(file_name, "rb")
        result_file.close()
        return result_file
    else:
        pdf = pdfkit.from_string(input=html, options=options, configuration=pdfkit_config) # this will return the generated pdf in bytes format
        result = BytesIO(initial_bytes=pdf) # convert the bytes format in bytesIO
        pdfFile = File(result, name=file_name) # return the created pdf as file format
        return pdfFile
    #pdf = pisa.pisaDocument(BytesIO(html.encode("utf-8")), result)
    #pdf = pisa.CreatePDF(BytesIO(html.encode("utf-8")), result)
 

def generateQR(data :str, file_name :str, save :bool):
    qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=1,)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#007bff", back_color="white")
    if save: # it will permanently save the generated QR image and return the image
        img.save(file_name, format='PNG') # save the QR image permanently in server with the given file name
        result_file = open(file_name, "rb")
        fileName = os.path.split(str(file_name))[1]
        qrImage = File(result_file, name=fileName) # return the created image as file format
        result_file.close()
        return qrImage
    else: # it will not save the generated QR image in server and only return the image
        result = BytesIO() # as we don't save it permanently, so we will save it in memory buffer for temporary
        img.save(result, format='PNG') # save the QR image in a byte object
        qrImage = File(result, name=file_name) # return the Byte object format in a file format with the given file name
        return qrImage


class Send_Mail(threading.Thread):
    def __init__(self, From :str, To, Subject :str, Text :str = ' ', HTML :str = ' ', cc=[], bcc=[], Attachments :list = [{'file': None, 'file_name': None}], From_Name :str = "Go Healthy", reply_to_list = [{"email":settings.DEFAULT_FROM_EMAIL, "name": "Go Healthy"}], uniqueID :str = "GoHealthyMail", messageGroup :str = 'GoHealthyMail', Sandbox_Mode :bool = False, utm_source="Sent Email"):
        self.From = From
        self.To = To
        self.cc = cc
        self.bcc = bcc
        self.reply_to_list = reply_to_list
        self.Subject = Subject
        self.Text = Text
        self.HTML= HTML
        self.Attachments = Attachments
        self.uniqueID = uniqueID
        self.messageGroup = messageGroup
        self.From_Name = From_Name
        self.Sandbox_Mode = Sandbox_Mode
        self.utm_source = utm_source
        threading.Thread.__init__(self)   
    def run(self):
        try:
            if len(self.To) > 0:
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + settings.SENDGRID_API_KEY
                }
                payload = {
                    "personalizations": [
                        {
                            # "to": self.To,
                            "headers": {
                                "unique-message-id": self.uniqueID,
                                "message-group": self.messageGroup
                            },
                            "custom_args": {
                                "unique-message-id": self.uniqueID,
                                "message-group": self.messageGroup
                            }
                        }
                    ],
                    "from": {
                        "email": self.From,
                        "name": self.From_Name
                    },
                    "subject": self.Subject,
                    "content": [
                        {
                            "type": "text/plain",
                            "value": self.Text
                        },
                        {
                            "type": "text/html",
                            "value": self.HTML
                        }
                    ],
                    "mail_settings" : {
                        "sandbox_mode": {
                            "enable": self.Sandbox_Mode,
                        },
                        "bypass_spam_management": {
                            "enable": True,
                        },
                        "bypass_bounce_management": {
                            "enable": True,
                        },
                        "bypass_unsubscribe_management": {
                            "enable": True,
                        }
                    },
                    "tracking_settings": {
                        "click_tracking": {
                            "enable": True,
                            "enable_text": True,
                        },
                        "open_tracking": {
                            "enable": True,
                        },
                        "ganalytics": {
                            "enable": True,
                            "utm_source": self.utm_source,
                            "utm_medium": "Email",
                            "utm_campaign": "Email Communication",
                        }
                    }
                }
                if len(self.reply_to_list) > 0:
                    payload["reply_to_list"] = self.reply_to_list
                attachments = []
                for attachment in self.Attachments:
                    file = attachment['file']
                    file_name = attachment['file_name']
                    if file is not None and file_name is not None:
                        file = file.open().read()
                        mime = mimetypes.MimeTypes().guess_type(file_name)[0]
                        base64Encoded = base64.b64encode(file)
                        base64Encoded = base64Encoded.decode() # convert base64 byte to string like base64. 
                        obj = {
                            "type": mime,
                            "content": base64Encoded,
                            "filename": file_name,
                            "disposition": "attachment",
                        }
                        attachments.append(obj)
                if len(attachments) > 0:
                    payload["attachments"] = attachments
                if len(self.cc) > 0:
                    payload['personalizations'][0]['cc'] = self.cc
                if len(self.bcc) > 0:
                    payload['personalizations'][0]['bcc'] = self.bcc

                total_recipients = len(self.To)
                total_cc = len(self.cc) + len(self.bcc)
                recipients_limit = 1000 - total_cc
                if (total_recipients+total_cc) <= recipients_limit: # at a time we can send a message to 1000 recipients including cc and bcc.
                    payload['personalizations'][0]['to'] = self.To
                    result = requests.request("POST", "https://api.sendgrid.com/v3/mail/send", data=json.dumps(payload), headers=headers)
                else:
                    splits = [self.To[i:i + recipients_limit] for i in range(0, len(self.To), recipients_limit)] # make a splitted array of recipients arrray and each array contains 1000 recipients
                    for recipients in splits:
                        payload['personalizations'][0]['to'] = recipients
                        result = requests.request("POST", "https://api.sendgrid.com/v3/mail/send", data=json.dumps(payload), headers=headers)
                result = result.text
            else:
                result = None
        except Exception as e:
            traceback.print_exc()
            print("\n\n")
            result = None
        finally:
            print(result)
            return result


class sendSMS(threading.Thread):    
    def __init__(self, numbers, message :str, template_id :str, sender_id :str="GOHSMS", flash='0', entity_id=settings.DLT_ENTITY_ID):
        self.numbers = numbers
        self.message = message
        self.template_id = template_id
        self.flash = flash
        self.sender_id = sender_id
        self.entity_id = entity_id
        threading.Thread.__init__(self) 
    def run(self):
        try:
            if len(self.numbers) > 0 and settings.SMS_SEND_ENABLED == '1':
                url = "https://www.fast2sms.com/dev/bulkV2"
                Numbers = (str(self.numbers)).replace("'", "").replace('"', "").replace("[", "").replace("]", "")
                payload = {
                    "sender_id": self.sender_id,
                    "message": self.message,
                    "template_id": self.template_id,
                    "entity_id": self.entity_id,
                    "route": "dlt_manual",
                    "numbers": Numbers,
                    "flash": self.flash,
                }
                headers = {
                    'authorization': settings.FAST2SMS_API_KEY,
                    'Content-Type': "application/x-www-form-urlencoded",
                    'Cache-Control': "no-cache",
                }
                response = None
                response = requests.request("POST", url, data=payload, headers=headers)
            else:
                response = None
        except Exception as e:
            traceback.print_exc()
            print("\n\n")
            response = None
        finally:
            print(response)
            return response


class sendWebPushNotification(threading.Thread):
    """
    Send Web Push Notification to subscribed users.

    Args:
       notification_title (str):  The title of the push notification.
       notification_message (str): The main text of the push notification.
       notification_target_url (str): The url the user is redirected to when clicks the push notification.

    Kwargs:
       notification_icon_url (str): The url of an image that will be used as the notification icon. Suggested size: 192x192px.
       notification_image_url (str): The url of an image that will be displayed in the notification content. Suggested size: 800px for the longer side.
       uids (list): The users that must receive the push notification. If not mentioned, then everybody will be receive the push notification.
       tags (list): The segments that must receive the push notification (i.e. the browsers that have at least one of those tags associated will receive the notification). If both uids and tags are present only the browsers that match both the conditions will receive the notification (i.e. a browser must be associated to a user ID listed in uids and have at least one of those tags). Instead of simple tags, you can pass boolean expressions that use the operators !, &&, || (from highest to lowest precedence). Parenthesis are not allowed. If you pass an array of tags and boolean expressions they are interpreted as ||: the example above is equivalent to "tag0 || tag1 || tagA && !tagB".
       action_title (str): The label to display on the action button.
       action_target_url (str): The page that opens up when the user clicks the action button.
       action_button_icon (str): The URL of a small icon for the action button.
       action_Id (str): An ID for the action that can be used to trigger a Javascript callback. It must be a string of word characters.
       
    Returns:
       obj.  HTTP Response::
    
    """
    def __init__(self, notification_title :str, notification_message :str, notification_topic :str, notification_target_url :str, notification_icon_url :str = None, notification_image_url :str = None, uids :Iterable = [], tags :Iterable = [], action_title :str = None, action_target_url :str = None, action_button_icon :str = None, action_Id :str = None):
        self.notification_title = notification_title
        self.notification_message = notification_message
        self.notification_topic = notification_topic
        self.notification_target_url = notification_target_url
        self.notification_icon_url = notification_icon_url
        self.notification_image_url = notification_image_url
        self.uids = uids
        self.tags = tags
        self.action_title = action_title
        self.action_target_url = action_target_url
        self.action_button_icon = action_button_icon
        self.action_Id = action_Id
        threading.Thread.__init__(self) 
    def run(self):
        try:
            if len(self.uids) > 0:
                header = {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": "Basic " + settings.ONESIGNAL_API_KEY
                }
                payload = {
                    "app_id": "6113d9f8-ed30-4dd6-adb4-2d311af9d27b",
                    "channel_for_external_user_ids": "push",
                    "contents": {
                        "en": self.notification_message
                    },
                    "headings": {
                        "en": self.notification_title
                    },
                    "web_push_topic": self.notification_topic,
                    "android_group": self.notification_topic, # For Android
                    "web_url": self.notification_target_url,
                    "app_url": self.notification_target_url, # For Android
                    "priority": 10,
                    "isChromeWeb": True,
                    "isAndroid": True,
                    "android_group_message": {
                        "en": "You have $[notif_count] new messages"
                    } # For Android
                }
                if len(self.tags) > 0:
                    filterTags = []
                    for tag in self.tags:
                        t = {"field": "tag", "key": tag, "relation": "exists"}
                        filterTags.append(t)
                    payload["filters"] = filterTags
                if self.notification_image_url is not None:
                    payload["chrome_web_image"] = self.notification_image_url
                    payload["big_picture"] = self.notification_image_url # For Android
                if self.notification_icon_url is not None:
                    payload["chrome_web_icon"] = self.notification_icon_url
                    payload["small_icon"] = self.notification_icon_url # For Android
                    payload["large_icon"] = self.notification_icon_url # For Android
                if self.action_Id is not None and self.action_title is not None and self.action_button_icon is not None and self.action_target_url is not None:
                    payload["web_buttons"] = [
                        {
                            "id": self.action_Id,
                            "text": self.action_title,
                            "icon": self.action_button_icon,
                            "url": self.action_target_url
                        }
                    ]
                    payload["buttons"] = [
                        {
                            "id": self.action_Id,
                            "text": self.action_title,
                            "icon": self.action_button_icon,
                        }
                    ]   # For Android
                
                if len(self.uids) > 2000: # We can send message to upto 2000 uids
                    splits = [self.uids[i:i + 2000] for i in range(0, len(self.uids), 2000)] # make a splitted array of uids arrray and each array contains 2000 uids
                    for users in splits:
                        payload["include_external_user_ids"] = users
                        req = requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))
                else:
                    payload["include_external_user_ids"] = self.uids
                req = requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))
            else:
                req = None
        except Exception as e:
            traceback.print_exc()
            print("\n\n")
            req = None
        finally:
            print(req)
            return req


def generateOTP(length :int):
    e = string.digits
    otp = ''.join([secrets.choice(e) for i in range(length)])
    print(otp)
    return otp


def checkUserStatus(user :object):
    status = user.is_active and user.is_verified
    return status


def addressFromPin(pin :str):
    url = "https://api.postalpincode.in/pincode/" + pin
    res_data = requests.get(url)
    res_data = res_data.text  # convert url response to string
    res_data = res_data[1:-1]  # in the response, at the first there have "[" and at last there have "]", so it is a list format,
                                # But in generally url response doesn't contains that thing. So by this method we remove this two character.
    res_data = json.loads(res_data)  # convert converted string to dict
    status = res_data["Status"]
    response_data = {}
    if status == "Success":
        BranchType = res_data["PostOffice"][0]["BranchType"]
        district = res_data["PostOffice"][0]["District"]
        name = res_data["PostOffice"][0]["Name"]
        block = res_data["PostOffice"][0]["Block"]
        division = res_data["PostOffice"][0]["Division"]
        state = res_data["PostOffice"][0]["State"]
        country = res_data["PostOffice"][0]['Country']

        districts = getDistrict(state)
        districtFind = True
        if district not in districts:
            districtFind = False

        #state_arr = state_list()
        #state_arr.insert(0, state)

        if block == "NA":
            city = name
        else:
            city = block

        response_data['status'] = status
        response_data['pin'] = pin
        response_data['state'] = state
        response_data['city'] = city
        response_data['division'] = city
        response_data['district'] = district
        response_data['districts'] = districts
        response_data['districtcount'] = len(districts)
        response_data['districtFind'] = districtFind
        response_data['country'] = country
        return response_data
    else:
        response_data['status'] = status
    return response_data


def addressFromCord(latitude :str, longitude :str):
    OPENCAGEDATA_API = settings.OPENCAGEDATA_API
    address = {}
    url = "https://api.opencagedata.com/geocode/v1/json?q=" +latitude+"+"+longitude+"&key="+OPENCAGEDATA_API
    response_data = requests.get(url)
    response_data = response_data.text  # convert url response to string
    response_data = json.loads(response_data)  # convert converted string to dict
    response_data = response_data["results"][0]["components"]
    city = response_data.get('city', '')
    town = response_data.get('town', '')
    village = response_data.get('village', '')
    
    if 'postcode' in response_data:
        if city != '':
            t = city
        elif town != '':
            t = town
        elif village != '':
            t = village
        else:
            t = ''
        address['pin'] = response_data.get('postcode')
        data = addressFromPin(address.get('pin'))
        address['state'] = data.get('state')
        address['city'] = t
        address['division'] = response_data.get('county', '')
        address['district'] = data.get('district')
        address['country'] = data.get('country')

        districts = getDistrict(address.get('state'))

        address['districts'] = districts
        address['districtcount'] = len(districts)

        return address
    else:
        return 0


def cityFromCord(latitude :str, longitude :str):
    OPENCAGEDATA_API = settings.OPENCAGEDATA_API
    address = {}
    url = "https://api.opencagedata.com/geocode/v1/json?q=" + latitude + "+" + longitude + "&key=" + OPENCAGEDATA_API
    response_data = requests.get(url)
    response_data = response_data.text  # convert url response to string
    response_data = json.loads(response_data)  # convert converted string to dict
    response_data = response_data["results"][0]["components"]
    city = response_data.get('city', '')
    town = response_data.get('town', '')
    village = response_data.get('village', '')
    if city != '':
        t = city
    elif town != '':
        t = town
    elif village != '':
        t = village
    else:
        t = ''
    print(t)
    return t


def ageCheck(dob):
    try:
        d = dob.split("-")
        today = datetime.date.today()
        year = int(d[0])
        month = int(d[1])
        day = int(d[2])
        age = today.year - year - ((today.month, today.day) < (month, day))
        error = None
        if age < 18:
            message = "not adult"
            error = '1'
        elif age > 65:
            message = "too old age"
            error = '1'
        else:
            error = "0"
            message = "age okay"
        data = {
            'error': error,
            'message': message,
            'age':age
        }
    except:
        data = {
            'error': "-1"
        }
    return data



def getBedsDataFromHospitalQuery(hospitalQuerySet):
    try:
        departments = list(HospitalDepartment.objects.all().values_list('department', flat=True))
        values = ["id", "Unique_Id", "Name", "Type", "Ownership", "Emergency_Number", "Toll_Free_Number", "Helpline_Number", "Contacts", "Username__email", "Address", "State__Name", "City", "Subdivision", "District__Name", "Pin", "Has_Antivenom", "Oxygen_Remaining_Time", "Website", "Latitude", "Longitude", "Image"]
        hospitalsId = list(hospitalQuerySet.values_list("id", flat=True))
        hospitals = list(Hospital.objects.filter(id__in=hospitalsId).values(*values))
        for item in hospitals:
            item['Image'] = Hospital.objects.get(id=item['id']).Image.url
            deptBeds = {}
            for dept in departments:
                bedData = list(Hospital.objects.filter(id=item['id']).values('id').annotate(last_update=Max('hospital_bed__Last_Update', filter=Q(hospital_bed__Department__department=dept)), total_available=Count('id', filter=(Q(hospital_bed__Ward__in=['Female Ward', 'Male Ward', 'Child Ward', 'ICU', 'PICU'], hospital_bed__Availability='Available', hospital_bed__Department__department=dept))), \
                total_female_O2_available=Count('id', filter=Q(hospital_bed__Ward='Female Ward', hospital_bed__Availability='Available', hospital_bed__Support='With Oxygen', hospital_bed__Department__department=dept)), total_female_O2=Count('id', filter=Q(hospital_bed__Ward='Female Ward', hospital_bed__Support='With Oxygen', hospital_bed__Department__department=dept)), \
                total_female_NonO2_available=Count('id', filter=Q(hospital_bed__Ward='Female Ward', hospital_bed__Availability='Available', hospital_bed__Support='Non-Oxygen', hospital_bed__Department__department=dept)), total_female_NonO2=Count('id', filter=Q(hospital_bed__Ward='Female Ward', hospital_bed__Support='Non-Oxygen', hospital_bed__Department__department=dept)), \
                total_male_O2_available=Count('id', filter=Q(hospital_bed__Ward='Male Ward', hospital_bed__Availability='Available', hospital_bed__Support='With Oxygen', hospital_bed__Department__department=dept)), total_male_O2=Count('id', filter=Q(hospital_bed__Ward='Male Ward', hospital_bed__Support='With Oxygen', hospital_bed__Department__department=dept)), \
                total_male_NonO2_available=Count('id', filter=Q(hospital_bed__Ward='Male Ward', hospital_bed__Availability='Available', hospital_bed__Support='Non-Oxygen', hospital_bed__Department__department=dept)), total_male_NonO2=Count('id', filter=Q(hospital_bed__Ward='Male Ward', hospital_bed__Support='Non-Oxygen', hospital_bed__Department__department=dept)), \
                total_child_O2_available=Count('id', filter=Q(hospital_bed__Ward='Child Ward', hospital_bed__Availability='Available', hospital_bed__Support='With Oxygen', hospital_bed__Department__department=dept)), total_child_O2=Count('id', filter=Q(hospital_bed__Ward='Child Ward', hospital_bed__Support='With Oxygen', hospital_bed__Department__department=dept)), \
                total_child_NonO2_available=Count('id', filter=Q(hospital_bed__Ward='Child Ward', hospital_bed__Availability='Available', hospital_bed__Support='Non-Oxygen', hospital_bed__Department__department=dept)), total_child_NonO2=Count('id', filter=Q(hospital_bed__Ward='Child Ward', hospital_bed__Support='Non-Oxygen', hospital_bed__Department__department=dept)), \
                total_icu_Venti_available=Count('id', filter=Q(hospital_bed__Ward='ICU', hospital_bed__Availability='Available', hospital_bed__Support='With Ventilator', hospital_bed__Department__department=dept)), total_icu_Venti=Count('id', filter=Q(hospital_bed__Ward='ICU', hospital_bed__Support='With Ventilator', hospital_bed__Department__department=dept)), \
                total_icu_NonVenti_available=Count('id', filter=Q(hospital_bed__Ward='ICU', hospital_bed__Availability='Available', hospital_bed__Support='Non-Ventilator', hospital_bed__Department__department=dept)), total_icu_NonVenti=Count('id', filter=Q(hospital_bed__Ward='ICU', hospital_bed__Support='Non-Ventilator', hospital_bed__Department__department=dept)), \
                total_picu_Venti_available=Count('id', filter=Q(hospital_bed__Ward='PICU', hospital_bed__Availability='Available', hospital_bed__Support='With Ventilator', hospital_bed__Department__department=dept)), total_picu_Venti=Count('id', filter=Q(hospital_bed__Ward='PICU', hospital_bed__Support='With Ventilator', hospital_bed__Department__department=dept)), \
                total_picu_NonVenti_available=Count('id', filter=Q(hospital_bed__Ward='PICU', hospital_bed__Availability='Available', hospital_bed__Support='Non-Ventilator', hospital_bed__Department__department=dept)), total_picu_NonVenti=Count('id', filter=Q(hospital_bed__Ward='PICU', hospital_bed__Support='Non-Ventilator', hospital_bed__Department__department=dept)), \
                total_nicu_Venti_available=Count('id', filter=Q(hospital_bed__Ward='NICU', hospital_bed__Availability='Available', hospital_bed__Support='With Ventilator', hospital_bed__Department__department=dept)), total_nicu_Venti=Count('id', filter=Q(hospital_bed__Ward='NICU', hospital_bed__Support='With Ventilator', hospital_bed__Department__department=dept)), \
                total_nicu_NonVenti_available=Count('id', filter=Q(hospital_bed__Ward='NICU', hospital_bed__Availability='Available', hospital_bed__Support='Non-Ventilator', hospital_bed__Department__department=dept)), total_nicu_NonVenti=Count('id', filter=Q(hospital_bed__Ward='NICU', hospital_bed__Support='Non-Ventilator', hospital_bed__Department__department=dept))))
                deptBeds[dept] = bedData[0]
            item['Departments'] = deptBeds
        return hospitals
    except Exception as e:
        traceback.print_exc()
        return []




class FetchBedThread(threading.Thread):    
    def __init__(self, hospitals :QuerySet):
        self.hospitals = hospitals
        threading.Thread.__init__(self) 
    def run(self):
        try:
            runFetchBed(self.hospitals)
        except Exception as e:
            traceback.print_exc()
        
def fetchBed(hospitals :QuerySet, needThread :bool = False):
    try:
       if needThread:
           bedFetchThread = FetchBedThread(hospitals)
           bedFetchThread.start()
       else:
           runFetchBed(hospitals)
    except Exception as e:
        traceback.print_exc()
 
    
def runFetchBed(hospitals :QuerySet):
    try:
        bedData = list(getBedsDataFromHospitalQuery(hospitals))
        send_event('liveBed', 'message', bedData)
        eventData = {
            'total_beds': BedNo.objects.filter(Q(Hospital__Username__is_verified=True, Hospital__Username__is_active=True, Hospital__Username__Registered=True) & ~Q(Availability="Null")).count(),
            'beds_changed': '1',
            'total_availableBeds': BedNo.objects.filter(Q(Hospital__Username__is_verified=True, Hospital__Username__is_active=True, Hospital__Username__Registered=True, Availability='Available') & ~Q(Availability="Null")).count(),
            'availableBeds_changed': '1',
            'total_usedBeds': BedNo.objects.filter(Q(Hospital__Username__is_verified=True, Hospital__Username__is_active=True, Hospital__Username__Registered=True, Availability='Used') & ~Q(Availability="Null")).count(),
            'usedBeds_changed': '1',
        }
        send_event('liveData', 'message', eventData)
    except Exception as e:
        traceback.print_exc()
        print("\n\n")
    finally:
        return True