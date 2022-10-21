from .choice import *
from .models import *
from .utils import activeLogedCount

def add_variable_to_context(request):
    try:
        hasIssuedCertificates = BloodDonationCollectionRecord.objects.filter(Username=request.user).exists()
    except:
        hasIssuedCertificates = False
    return {
        'hasIssuedCertificates': hasIssuedCertificates,
        'baseBloodGroups': blood_groups,
        'allStates': States.objects.all(),
        'generalUserTypes': general_user_types,
        'specialUserTypes': special_user_types,
        'siteContacts': SiteContact.objects.all(),
        'siteContactsMain': SiteContact.objects.filter(is_main=True),
        'siteContacts24x7': SiteContact.objects.filter(is_24x7=True),
        'siteContactsWorkingHours': SiteContact.objects.filter(is_24x7=False),
        'siteEmails': SiteEmail.objects.all(),
        'siteEmailsMain': SiteEmail.objects.filter(is_main=True),
        'whatsappNumbers': WhatsappNumber.objects.all(),
        'languages': Languages.objects.all(),
        'months': month_choice,
        'activeLogedCount': activeLogedCount(request.user)
    }