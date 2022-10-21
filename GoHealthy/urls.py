"""GoHealthy URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.sitemaps.views import sitemap
from Go_Healthy_App.sitemaps import *
from Go_Healthy_App import views

sitemaps = {
    'main':MainStaticSitemap, #add StaticSitemap to the dictionary
    'first-aid':FirstAidStaticSitemap,
    'firstaid-photo-courses': FirstAidPhotoSitemap,
    'firstaid-video-courses': FirstAidVideoSitemap,
    'hospitals': HospitalSitemap,
    'blood_banks': BloodBankSitemap,
}

urlpatterns = [
    path('admin/clearcache/', include('clearcache.urls')),
    #path('jet/', include('jet.urls', 'jet')),  # Django JET URLS
    #path('jet/dashboard/', include('jet.dashboard.urls', 'jet-dashboard')),  # Django JET dashboard URLS
    path(settings.ADMIN_URL, admin.site.urls),
    path(r'', include('Go_Healthy_App.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('robots.txt', views.robotsText),
    path('manifest.json', views.manifest),
    path('Service-Worker.js', views.serviceWorkerJs),
    path('push/onesignal/OneSignalSDKWorker.js', views.OneSignalSDKWorkerJs),
    path('push/onesignal/OneSignalSDKUpdaterWorker.js', views.OneSignalSDKUpdaterWorkerJs),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [path('__debug__', include(debug_toolbar.urls))]
    
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


