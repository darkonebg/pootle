#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Copyright 2009-2012 Zuza Software Foundation
# Copyright 2013 Evernote Corporation
#
# This file is part of Pootle.
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, see <http://www.gnu.org/licenses/>.

"""A set of singal handlers for generating automatic notifications on system
events."""

from pootle_app.models import Directory
from pootle_notifications.models import Notice


##### Model Events #####

def new_object(created, message, parent):
    if created:
        notice = Notice(directory=parent, message=message)
        notice.save()


def new_language(sender, instance, created=False, raw=False, **kwargs):
    if raw:
        return

    message = 'New language <a href="%s">%s</a> created.' % (
            instance.get_absolute_url(), instance.fullname)
    new_object(created, message, instance.directory.parent)


def new_project(sender, instance, created=False, raw=False, **kwargs):
    if raw:
        return

    message = 'New project <a href="%s">%s</a> created.' % (
        instance.get_absolute_url(), instance.fullname)
    new_object(created, message, parent=Directory.objects.root)


def new_user(sender, instance, created=False, raw=False, **kwargs):
    if raw:
        return

    # New user needs to be wrapped in a try block because it might be
    # called before the rest of the models are loaded when first
    # installing Pootle

    try:
        message = 'New user <a href="%s">%s</a> registered.' % (
            instance.get_profile().get_absolute_url(),
            instance.get_profile())
        new_object(created, message, parent=Directory.objects.root)
    except:
        pass
