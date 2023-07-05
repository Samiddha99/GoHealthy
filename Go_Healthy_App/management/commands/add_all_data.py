from django.core.management.base import BaseCommand, CommandError
import json
from Go_Healthy_App.models import *
import traceback
from Go_Healthy_App.choice import *

json_data = {}
def addStates():
    try:
        for state in json_data["states"]:
            state_obj = States.objects.get_or_create(Name=state["state"], Is_Union_Territory=state['union_territory'])[0]
            for district in state['districts']:
                Districts.objects.get_or_create(Name=district, state=state_obj)
    except Exception as e:
        traceback.print_exc()
        print('\n\n')
    finally:
        return True



def addDegrees():
    try:
        for degree in json_data["degrees"]:
            degree_obj = Degrees.objects.get_or_create(Degree=degree["degree"])[0]
            for specialty in degree['specialties']:
                Specialities.objects.get_or_create(Degree=degree_obj, Speciality=specialty)
    except Exception as e:
        traceback.print_exc()
        print('\n\n')
    finally:
        return True


def addLanguages():
    for lang in json_data['languages']:
        try:
            if not Languages.objects.filter(Language=lang['name']).exists():
                Languages.objects.get_or_create(Language=lang['name'], Local_Script=lang['local'], place_at_top=lang['place_top'])
        except Exception as e:
            print(e)


def addDepartments():
    for dept in json_data["departments"]:
        try:
            HospitalDepartment.objects.get_or_create(department=dept)
        except Exception as e:
            print(e)


def addSomeCommonDisease():
    
    for disease in json_data["common_diseases"]:
        try:
            dept = HospitalDepartment.objects.get_or_create(department=disease['dept'])[0]
            SomeCommonDisease.objects.get_or_create(Disease=disease['name'], Concerned_Department=dept)
        except Exception as e:
            print(e)


class Command(BaseCommand):
    help = 'Create data'
    def handle(self, *args, **kwargs):
        global json_data
        json_path = f"./assets/static/json/data.json"
        json_file = open(json_path, "r")
        json_data = json.load(json_file)
        addStates()
        addDegrees()
        addLanguages()
        addDepartments()
        addSomeCommonDisease()

