# Generated by Django 3.2 on 2023-05-05 16:27

import Go_Healthy_App.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Go_Healthy_App', '0004_auto_20220819_1317'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hospital',
            name='Image',
            field=models.ImageField(upload_to=Go_Healthy_App.models.user_image_directory_path),
        ),
    ]
