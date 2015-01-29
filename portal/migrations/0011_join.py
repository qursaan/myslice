# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import DataMigration
from django.db import models

class Migration(DataMigration):

    def forwards(self, orm):
        "Write your forwards methods here."
        # Note: Remember to use orm['appname.ModelName'] rather than "from appname.models..."

    def backwards(self, orm):
        "Write your backwards methods here."

    models = {
        u'portal.institution': {
            'Meta': {'object_name': 'Institution'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.TextField', [], {})
        },
        u'portal.pendingauthority': {
            'Meta': {'object_name': 'PendingAuthority'},
            'address_city': ('django.db.models.fields.TextField', [], {}),
            'address_country': ('django.db.models.fields.TextField', [], {}),
            'address_line1': ('django.db.models.fields.TextField', [], {}),
            'address_line2': ('django.db.models.fields.TextField', [], {}),
            'address_line3': ('django.db.models.fields.TextField', [], {}),
            'address_postalcode': ('django.db.models.fields.TextField', [], {}),
            'address_state': ('django.db.models.fields.TextField', [], {}),
            'authority_hrn': ('django.db.models.fields.TextField', [], {}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'site_abbreviated_name': ('django.db.models.fields.TextField', [], {}),
            'site_authority': ('django.db.models.fields.TextField', [], {}),
            'site_latitude': ('django.db.models.fields.TextField', [], {}),
            'site_longitude': ('django.db.models.fields.TextField', [], {}),
            'site_name': ('django.db.models.fields.TextField', [], {}),
            'site_url': ('django.db.models.fields.TextField', [], {})
        },
        u'portal.pendingjoin': {
            'Meta': {'object_name': 'PendingJoin'},
            'authority_hrn': ('django.db.models.fields.TextField', [], {}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'email': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project_name': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'user_hrn': ('django.db.models.fields.TextField', [], {})
        },
        u'portal.pendingproject': {
            'Meta': {'object_name': 'PendingProject'},
            'authority_hrn': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'email': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project_name': ('django.db.models.fields.TextField', [], {}),
            'purpose': ('django.db.models.fields.TextField', [], {'default': "'NA'"}),
            'user_hrn': ('django.db.models.fields.TextField', [], {})
        },
        u'portal.pendingslice': {
            'Meta': {'object_name': 'PendingSlice'},
            'authority_hrn': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'number_of_nodes': ('django.db.models.fields.TextField', [], {'default': '0'}),
            'purpose': ('django.db.models.fields.TextField', [], {'default': "'NA'"}),
            'slice_name': ('django.db.models.fields.TextField', [], {}),
            'type_of_nodes': ('django.db.models.fields.TextField', [], {'default': "'NA'"}),
            'user_hrn': ('django.db.models.fields.TextField', [], {})
        },
        u'portal.pendinguser': {
            'Meta': {'object_name': 'PendingUser'},
            'authority_hrn': ('django.db.models.fields.TextField', [], {}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75'}),
            'email_hash': ('django.db.models.fields.TextField', [], {}),
            'first_name': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_name': ('django.db.models.fields.TextField', [], {}),
            'login': ('django.db.models.fields.TextField', [], {}),
            'password': ('django.db.models.fields.TextField', [], {}),
            'pi': ('django.db.models.fields.TextField', [], {}),
            'private_key': ('django.db.models.fields.TextField', [], {}),
            'public_key': ('django.db.models.fields.TextField', [], {}),
            'status': ('django.db.models.fields.TextField', [], {}),
            'user_hrn': ('django.db.models.fields.TextField', [], {})
        }
    }

    complete_apps = ['portal']
    symmetrical = True
