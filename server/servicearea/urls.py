from django.conf.urls import patterns, include, url
from shape.models import Shape
from rest_framework import viewsets, routers
 
from django.contrib.auth.models import User
from django.contrib.auth.models import Permission

from django.contrib import admin
admin.autodiscover()

class PermissionViewSet(viewsets.ModelViewSet):
    model = Permission

# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    model = User
    
class ShapeViewSet(viewsets.ModelViewSet):
    model = Shape

 
# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'shape', ShapeViewSet)

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'servicearea.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
)
