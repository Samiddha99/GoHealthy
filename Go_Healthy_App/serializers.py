from rest_framework import serializers
from .models import *

class HospitalPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = ['Unique_Id', 'Oxygen_Remaining_Time']