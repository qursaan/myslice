# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'PendingUser.login'
        db.add_column(u'portal_pendinguser', 'login',
                      self.gf('django.db.models.fields.TextField')(default='dummy'),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'PendingUser.login'
        db.delete_column(u'portal_pendinguser', 'login')


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
            'number_of_nodes': ('django.db.models.fields.TextField', [], {'default': '0'}),
            'purpose': ('django.db.models.fields.TextField', [], {'default': "'NA'"}),
            'slice_name': ('django.db.models.fields.TextField', [], {}),
            'type_of_nodes': ('django.db.models.fields.TextField', [], {'default': "'NA'"})
        },
        u'portal.pendinguser': {
            'Meta': {'object_name': 'PendingUser'},
            'authority_hrn': ('django.db.models.fields.TextField', [], {}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75'}),
            'first_name': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'keypair': ('django.db.models.fields.TextField', [], {}),
            'last_name': ('django.db.models.fields.TextField', [], {}),
            'login': ('django.db.models.fields.TextField', [], {}),
            'password': ('django.db.models.fields.TextField', [], {})
        }
    }

    complete_apps = ['portal']