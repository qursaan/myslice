from django.db import models

# Create your models here.

class Institution(models.Model):
    name = models.TextField()
    # list of associated email domains 

class PendingUser(models.Model):
    first_name  = models.TextField()
    last_name   = models.TextField()
    email       = models.TextField()
    password    = models.TextField()
    keypair     = models.TextField()
    # institution

class PendingSlice(models.Model):
    slice_name  = models.TextField()
