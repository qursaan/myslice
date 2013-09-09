# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Institution'
        db.create_table(u'portal_institution', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'portal', ['Institution'])

        # Adding model 'PendingUser'
        db.create_table(u'portal_pendinguser', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('first_name', self.gf('django.db.models.fields.TextField')()),
            ('last_name', self.gf('django.db.models.fields.TextField')()),
            ('affiliation', self.gf('django.db.models.fields.TextField')()),
            ('email', self.gf('django.db.models.fields.EmailField')(max_length=75)),
            ('password', self.gf('django.db.models.fields.TextField')()),
            ('keypair', self.gf('django.db.models.fields.TextField')()),
            ('authority_hrn', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'portal', ['PendingUser'])

        # Adding model 'PendingSlice'
        db.create_table(u'portal_pendingslice', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('slice_name', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'portal', ['PendingSlice'])


    def backwards(self, orm):
        # Deleting model 'Institution'
        db.delete_table(u'portal_institution')

        # Deleting model 'PendingUser'
        db.delete_table(u'portal_pendinguser')

        # Deleting model 'PendingSlice'
        db.delete_table(u'portal_pendingslice')


    models = {
        u'portal.institution': {
            'Meta': {'object_name': 'Institution'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.TextField', [], {})
        },
        u'portal.pendingslice': {
            'Meta': {'object_name': 'PendingSlice'},
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