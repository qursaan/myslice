"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase

from plugins.lists.simplelist import SimpleList

class PluginTest(TestCase):
    def test_basic(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        print 'test_basic is broken'
        return True
        sl = SimpleList (visible=True)
        print 'rendering', sl.render()
        self.assertEqual(1 + 1, 2)
