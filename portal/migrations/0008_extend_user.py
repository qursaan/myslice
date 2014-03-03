# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'PendingUser.keypair'
        db.delete_column(u'portal_pendinguser', 'keypair')

        # Adding field 'PendingUser.user_hrn'
        db.add_column(u'portal_pendinguser', 'user_hrn',
                      self.gf('django.db.models.fields.TextField')(default=''),
                      keep_default=False)

        # Adding field 'PendingUser.public_key'
        db.add_column(u'portal_pendinguser', 'public_key',
                      self.gf('django.db.models.fields.TextField')(default=''),
                      keep_default=False)

        # Adding field 'PendingUser.private_key'
        db.add_column(u'portal_pendinguser', 'private_key',
                      self.gf('django.db.models.fields.TextField')(default=''),
                      keep_default=False)


    def backwards(self, orm):
        # Adding field 'PendingUser.keypair'
        db.add_column(u'portal_pendinguser', 'keypair',
                      self.gf('django.db.models.fields.TextField')(default=''),
                      keep_default=False)

        # Deleting field 'PendingUser.user_hrn'
        db.delete_column(u'portal_pendinguser', 'user_hrn')

        # Deleting field 'PendingUser.public_key'
        db.delete_column(u'portal_pendinguser', 'public_key')

        # Deleting field 'PendingUser.private_key'
        db.delete_column(u'portal_pendinguser', 'private_key')


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
            'first_name': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_name': ('django.db.models.fields.TextField', [], {}),
            'login': ('django.db.models.fields.TextField', [], {}),
            'password': ('django.db.models.fields.TextField', [], {}),
            'pi': ('django.db.models.fields.TextField', [], {}),
            'private_key': ('django.db.models.fields.TextField', [], {}),
            'public_key': ('django.db.models.fields.TextField', [], {}),
            'user_hrn': ('django.db.models.fields.TextField', [], {})
        }
    }

    complete_apps = ['portal']