import os
import re
import threading
import traceback
import datetime
import django.contrib.auth.password_validation as validators
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy
from django.core import exceptions
from django.conf import settings
from PIL import Image
import magic


class Validate_image_aspect_ratio(object):
    def __init__(self, aspect_ratio):
        self.aspect_ratio = aspect_ratio

    def __call__(self, value):
        if value != '' and value is not None:
            value.seek(0)
            cont_type = str(magic.from_buffer(value.read(), mime=True))
            cont_type = cont_type.split('/')
            if cont_type[0] == 'image':
                value.seek(0)
                img = Image.open(value)
                width, height = img.size
                if width/height != self.aspect_ratio:
                    raise ValidationError('Un-supported aspect ratio!')


def check_user_type(value):
    if value != '' and value is not None:
        authorityUserTypes = ['Hospital', 'Blood Bank']
        generalUserTypes = ['Normal', 'Blood Donor', 'Doctor']
        specialUser = ['Site Admin', 'First Aid Instructor']
        match1 = False
        match2 = False
        for i in authorityUserTypes:
            if(i in value):
                match1 = True
                break
        for i in generalUserTypes+specialUser:
            if(i in value):
                match2 = True
                break
        if match1 and match2:
            raise ValidationError('Check User Type!')

        m = False
        if value == generalUserTypes[0]:
            for i in generalUserTypes:
                if i != generalUserTypes[0]:
                    m = i in value
                    break
        if m:
            raise ValidationError('Check User Type!')


def validate_subtitle_file(value):
    if value != '' and value is not None:
        value.seek(0)
        if not str(value).lower().endswith(('.srt')):
            raise ValidationError('It is not a subtitle file, only .srt files are accepted.')

def validate_video_type(value):
    if value != '' and value is not None:
        value.seek(0)
        cont_type = str(magic.from_buffer(value.read(), mime=True))
        cont_type = cont_type.split('/')
        if cont_type[0] != 'video':
            raise ValidationError('It is not a video file.')

def validate_image_type(value):
    if value != '' and value is not None:
        value.seek(0)
        cont_type = str(magic.from_buffer(value.read(), mime=True))
        cont_type = cont_type.split('/')
        if cont_type[0] != 'image':
            raise ValidationError('It is not a image file.')

def validate_file_size(value):
    if value != '' and value is not None:
        value.seek(0)
        if value.size > 5242880:
            raise ValidationError('File size should not be more than 5 MB')

def validate_large_file_size(value):
    if value != '' and value is not None:
        value.seek(0)
        if value.size > int(settings.MAX_UPLOAD_SIZE):
            raise ValidationError('File size should not be more than 100 MB')

def validate_file_type(value):
    if value != '' and value is not None:
        value.seek(0)
        typeError = True
        cont_type = str(magic.from_buffer(value.read(), mime=True))
        for contentType in settings.CONTENT_TYPES:
            if len(re.findall(contentType, cont_type)) > 0:
                typeError = False
                break
        if typeError:
            raise ValidationError('Only Audio, Video, Image and Document Type Files Are Allowed.')


def validate_document_file_type(value):
    if value != '' and value is not None:
        value.seek(0)
        typeError = True
        cont_type = str(magic.from_buffer(value.read(), mime=True))
        for contentType in settings.DOCUMENT_CONTENT_TYPES:
            if len(re.findall(contentType, cont_type)) > 0:
                typeError = False
                break
        if typeError:
            raise ValidationError('Only Image and PDF Type Files Are Allowed.')


def dob_validation(value):
    if value != '' and value is not None:
        today = datetime.date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 18:
            raise ValidationError(
                gettext_lazy('%(value)s is invalid input. Your age must be minimum 18.'),
                params={'value': value},
            )

def whitespace_validation(value):
    hasSpaceAtBegain = str(value).startswith(" ")
    hasSpaceAtEnd = str(value).endswith(" ")
    hasNewLineAtBegain = str(value).startswith("\n")
    hasNewLineAtEnd = str(value).endswith("\n")
    if hasSpaceAtBegain or hasSpaceAtEnd or hasNewLineAtBegain or hasNewLineAtEnd:
        raise ValidationError('Whitespace or new line is not allowed at begaining and ending position.')
    invaliMatch1 = re.findall(" {2,}", str(value)) # check if more than one space
    if len(invaliMatch1) > 0:
        raise ValidationError('More than one whitespace!')
    invaliMatch2 = re.findall("\n{2,}", str(value)) # check if more than one new line
    if len(invaliMatch2) > 0:
        raise ValidationError('More than one new line!')

def contact_validation(value):
    if value != '' and value is not None:
        invaliMatch = re.findall("[^0-9^ ^.^+^(^)^*^#^-]", str(value)) # check how many character exists expect numeric and some other symbola.
        if len(invaliMatch) > 0:
            raise ValidationError('Invalid contact number.')

def only_numeric(value): # e.g. for Pin field
    if value != '' and value is not None:
        invaliMatch = re.findall("[^0-9]", str(value)) # check how many character exists expect numeric.
        if len(invaliMatch) > 0:
            raise ValidationError('Only digits are allowed.')

def only_alphabet(value):
    if value != '' and value is not None:
        first_character_validation = re.findall("[a-zA-Z]", str(value)[0]) # return the first character only in a list if it is alphabet (not any symbol or digit), otherwise return empty list
        last_character_validation = re.findall("[a-zA-Z]", str(value)[len(value)-1]) # return the last character only in a list if it is alphabet (not any symbol or digit), otherwise return empty list
        invaliMatch = re.findall("[^a-z^A-Z^ ^.]", str(value)) # check how many character exists expect alphabets, space and dot.
        if len(first_character_validation) <= 0 or len(last_character_validation) <= 0 or len(invaliMatch) > 0:
            raise ValidationError('Only alphabets, space and dot are allowed.')

def name_validation(value): # eg: for Name field
    if value != '' and value is not None:
        first_character_validation = re.findall("[a-zA-Z]", str(value)[0]) #return the first character only in a list if it is alphabet (not any symbol or digit), otherwise return empty list
        last_character_validation = re.findall("[a-zA-Z]", str(value)[len(value)-1]) # return the last character only in a list if it is alphabet (not any symbol or digit), otherwise return empty list
        invaliMatch = re.findall("[^a-z^A-Z^ ^.^(^)]", str(value)) # check how many character exists expect alphabets, space and dot.
        if len(first_character_validation) <= 0 or len(last_character_validation) <= 0 or len(invaliMatch) > 0:
            raise ValidationError('Only alphabets, space, dot and bracket are allowed.')

def prefix_validation(value):
    titles = ['dr', 'esq', 'hon', 'jr', 'sr', 'mr', 'mrs', 'ms', 'prof', 'sri', 'smt']
    first_word_in_name = value.split(" ")[0]
    dot_at_end = re.findall("\.$", first_word_in_name)
    if((dot_at_end) or (first_word_in_name.lower() in titles)):
        raise ValidationError("Don't use prefix (title) in name")

def office_name_validation(value): # eg: for Office Name field
    if value != '' and value is not None:
        invaliMatch = re.findall("[^a-z^A-Z^ ^.^-^:^,^&^(^)^`^']", str(value)) # check how many character exists expect alphabets, space and some symbols.
        if len(invaliMatch) > 0:
            raise ValidationError('Only alphabets and limited symbools are allowed.')

def only_alphabet_and_digit(value): # eg: for Subdivision field
    if value != '' and value is not None:
        first_character_validation = re.findall("[a-zA-Z0-9]", str(value)[0]) # return the first character only in a list if it is alphabet or digit (not any symbol), otherwise return empty list
        invaliMatch = re.findall("[^a-z^A-Z^0-9^ ^.]", str(value)) # check how many character exists expect alphabets, digits, space and dot.
        if len(first_character_validation) <= 0 or len(invaliMatch) > 0:
            raise ValidationError('Only alphabets and digits are allowed.')

def only_alphabet_and_digit_and_some_symbol(value): # eg: for Address field
    if value != '' and value is not None:
        invaliMatch = re.findall("[^a-z^A-Z^0-9^ ^.^-^_^/^:^,^&^(^)^;^`^'^\n]", str(value)) # check how many character exists expect alphabets, digits, and some symbols.
        if len(invaliMatch) > 0:
            raise ValidationError('Only alphabets, digits and some special symbols are allowed.')
