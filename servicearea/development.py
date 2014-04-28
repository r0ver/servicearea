'''
Settings for development environment
'''

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
TEMPLATE_DEBUG = True
ALLOWED_HOSTS = []

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'servicearea',
        'USER': 'admin',
        'PASSWORD': 'saadmin',
    }
}

