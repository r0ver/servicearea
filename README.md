Servicearea
===========

A proof of concept apps which allows you to draw a rectangle in a Google Map using Google Maps Api V3 and then add flags in a map. If the place is inside the area previously drawn, the flag will be green, otherwise red.

Test this application [here](http://djangoapp-env-ebkbthnsf6.elasticbeanstalk.com/static/index.html). It was tested with Chrome v34 and v36.

Design and coding decisions 
===========================

The key parts of this applications are: 

 * A client coded in html, css and javascript using Google Maps Api V3. 

 * A Django application with a shape model, which stores four coordinates, exposed via a REST API built with Django Rest Framework.

The html client is the result of merge of Google Maps API, therefore this application is not using any third party javascript framework such as Jquery, AngularJS or similar. Just plain Javascript. The html client uses the next Google Maps libraries:

 * Geolocation

 * Drawing

 * Places

Geolocations is used to detect the location of the user and based on that the map to be shown will be the place where the user is at the moment. If the user doesn't allow the browser to ask for the location, Aockland International Airport in California will be displayed as the default location. The maps location can be changed using the search box, this functionality is provided by Places library. The Drawing library is the one which provides the rectangle functionality.

When the rectangle is ready and the user clicks in submit, the rectangle coordinates are sent to the backend application. The four coordinates are saved on the backend and the browser will store a cookie with the url of the these coordinates, then the browser shows a new map and using the cookie's value the map will determinte the coordinates of the map to be shown and a 'hidden rectangle' which is the same drawn in the previous screen. If the user clicks 'inside' of the rectangle, the flag will be green. Otherwise red.

The second screen, coded in the defined-area.html and gmapwrapper-definedarea.js. These doesn't use any special Google Map Library, it just calculate where the click is made and if it fits with the coordinate.

The source code has comments with urls to the code reused, for futher details look there, along with the API sample, the code should be self descriptive, although it might require Google Maps api understanding.

The only third party being used besides Google Maps Api is the su3.js file, which implements a post and get method. Besides that, this application is mainly developed with plain javascript to focus just on Google Maps Api reuse and understanding. 

Local Deployment
================ 

The application is made with Google App Engine API and Django. It can be deployed locally or in AWS. 

0. Create a directory for your project

   $ mkdir localdeploy

1. Create a virtualenvironment, this is optional but recomended. 

   $ cd localdeploy
   $ virtualenv python27
   $ source python27/bin/activate

   If you get an error check if virtualenv is not installed. You can install it with 'sudo easy_install virtualenv'

2. Clone the project

   $ git clone https://github.com/r0ver/servicearea.git

3. Install Django and other required dependencies

   $ pip install -r requirements.txt 
   
4. Launch the app

   $ python manage.py syncdb
   $ python manage.py runserver 

5. Open the app in your browser, the default address should be localhost:8000

AWS Deployement
===============

This application was tested with AWS using same Python and Django version described above.  Follow all the steps described at [Deploying a Django Application x ccto AWS Elastic Beanstalk](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_Python_django.html)
Once you complete the tutorial, replace the django app created with this one. 






