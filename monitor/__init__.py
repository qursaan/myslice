import os
import threading
from sfa.client.sfaserverproxy import SfaServerProxy
from sfa.client.return_value import ReturnValue

path=os.path.dirname(os.path.abspath(__file__))

SFA_KEY_FILE=os.path.abspath(path + "../myslice/sfa.pkey")
SFA_CERT_FILE=os.path.abspath(path + "../myslice/sfa.cert")

def get_version(url):
    server=SfaServerProxy(url, SFA_KEY_FILE, SFA_CERT_FILE)
    try:
        version = server.GetVersion()
    except Exception, why:
        raise
    return version