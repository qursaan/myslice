%define name myslice
%define version 0.2
%define taglevel 4

%define release %{taglevel}%{?pldistro:.%{pldistro}}%{?date:.%{date}}

Summary: MySlice Frontend
Name: %{name}
Version: %{version}
Release: %{release}
License: GPLv3
Source0: %{name}-%{version}.tar.gz
BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root

Vendor: OpenLab
Packager: OpenLab <thierry.parmentelat@inria.fr>
URL: %{SCMURL}

Requires: python >= 2.7
# in f14 this used to be called Django
Requires: python-django
Requires: httpd
Requires: mod_wsgi
BuildRequires: python-setuptools make

%description 
The MySlice frontend provides a django application that interacts with
a manifold backend to provide a User-Interface to a federation of
testbeds.

%prep
%setup -q

%build
%{__make} build

%install
rm -rf $RPM_BUILD_ROOT
%{__make} install DESTDIR="$RPM_BUILD_ROOT" datadir="%{_datadir}" bindir="%{_bindir}"

%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(-,root,root,-)
%dir %{_datadir}/myslice
%{_datadir}/myslice/*

%changelog
* Wed Sep 25 2013 Thierry Parmentelat <thierry.parmentelat@sophia.inria.fr> - myslice-0.2-4
- move to bootstrap v3 complete - hopefully
- static files directory is now plain static/
- templates files directory is now plain templates/
- packaging for debian should be working fine, using apache+wsgi

* Fri Sep 20 2013 Thierry Parmentelat <thierry.parmentelat@sophia.inria.fr> - myslice-0.2-3
- checkpoint for deployment on test.myslice.info

* Mon Sep 09 2013 Thierry Parmentelat <thierry.parmentelat@sophia.inria.fr> - myslice-0.2-2
- cleaner tag, using module-tag for consistent numbering

* Mon Apr 08 2013 Thierry Parmentelat <thierry.parmentelat@sophia.inria.fr> - myslice-django-0.1-3
- a small number of representative plugins are available
- next step is to correlate a Get query with its corresponding Update like in slice.php

* Mon Mar 25 2013 Thierry Parmentelat <thierry.parmentelat@sophia.inria.fr> - myslice-django-0.1-2
- new pluing 'hazelnut' which is a tmpname for the former datatables one
- querycode is syntaxhighlighter-enabled

