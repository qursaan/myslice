# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Institution',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PendingAuthority',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('site_name', models.TextField()),
                ('site_authority', models.TextField()),
                ('site_abbreviated_name', models.TextField()),
                ('site_url', models.TextField()),
                ('site_latitude', models.TextField()),
                ('site_longitude', models.TextField()),
                ('address_line1', models.TextField()),
                ('address_line2', models.TextField()),
                ('address_line3', models.TextField()),
                ('address_city', models.TextField()),
                ('address_postalcode', models.TextField()),
                ('address_state', models.TextField()),
                ('address_country', models.TextField()),
                ('authority_hrn', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PendingJoin',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('user_hrn', models.TextField()),
                ('email', models.TextField()),
                ('project_name', models.TextField(null=True)),
                ('authority_hrn', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PendingProject',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('project_name', models.TextField()),
                ('user_hrn', models.TextField()),
                ('email', models.TextField()),
                ('authority_hrn', models.TextField(null=True)),
                ('purpose', models.TextField(default=b'NA')),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PendingSlice',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('slice_name', models.TextField()),
                ('user_hrn', models.TextField()),
                ('authority_hrn', models.TextField(null=True)),
                ('number_of_nodes', models.TextField(default=0)),
                ('type_of_nodes', models.TextField(default=b'NA')),
                ('purpose', models.TextField(default=b'NA')),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PendingUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('first_name', models.TextField()),
                ('last_name', models.TextField()),
                ('email', models.EmailField(max_length=75)),
                ('password', models.TextField()),
                ('user_hrn', models.TextField()),
                ('public_key', models.TextField()),
                ('private_key', models.TextField()),
                ('authority_hrn', models.TextField()),
                ('login', models.TextField()),
                ('pi', models.TextField()),
                ('email_hash', models.TextField()),
                ('status', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
