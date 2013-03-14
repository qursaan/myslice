%define name myslice
%define version 0.1
%define taglevel 1

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

# We use set everywhere
Requires: python >= 2.7
Requires: Django
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
