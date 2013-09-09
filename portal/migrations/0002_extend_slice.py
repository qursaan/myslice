# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'PendingSlice.authority_hrn'
        db.add_column(u'portal_pendingslice', 'authority_hrn',
                      self.gf('django.db.models.fields.TextField')(null=True),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'PendingSlice.authority_hrn'
        db.delete_column(u'portal_pendingslice', 'authority_hrn')


    models = {
        u'portal.institution': {
            'Meta': {'object_name': 'Institution'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.TextField', [], {})
        },
        u'portal.pendingslice': {
            'Meta': {'object_name': 'PendingSlice'},
            'authority_hrn': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'slice_name': ('django.db.models.fields.TextField', [], {})
        },
        u'portal.pendinguser': {
            'Meta': {'object_name': 'PendingUser'},
            'affiliation': ('django.db.models.fields.TextField', [], {}),
            'authority_hrn': ('django.db.models.fields.TextField', [], {}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75'}),
            'first_name': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'keypair': ('django.db.models.fields.TextField', [], {}),
            'last_name': ('django.db.models.fields.TextField', [], {}),
            'password': ('django.db.models.fields.TextField', [], {})
        }
    }

    complete_apps = ['portal']