from django.db import models

class Shape(models.Model):
    session_id = models.CharField(max_length=255)
    northeast_lat = models.FloatField()
    northeast_lng = models.FloatField()
    southwest_lat = models.FloatField()
    southwest_lng  = models.FloatField()
    
    def __unicode__(self):
        return self.session_id
    