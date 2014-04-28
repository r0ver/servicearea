from django.db import models

class Shape(models.Model):
    northeast_lat = models.FloatField()
    northeast_lng = models.FloatField()
    southwest_lat = models.FloatField()
    southwest_lng  = models.FloatField()
    
 
    