from flask import Flask, request
from flask_restful import Resource, Api
from json import dumps


app = Flask(__name__)
api = Api(app)

from pprint import pprint
from yelpapi import YelpAPI
import json as JSON
import time

yelpKeys = JSON.load(open('keys.json'))
yelp_api = YelpAPI(yelpKeys["yelp_consumerKey"], yelpKeys["yelp_consumerSecret"], yelpKeys["yelp_token"], yelpKeys["yelp_tokenSecret"])

@app.route('/business')
def api_business():
    lati = request.args['lat']
    lngi = request.args['lng']
    cati = request.args['cat']
    print str(lati)
    print str(lngi)
    print lati
    print lngi

    features = []
    total = 500
    off = 0
    try:
        while off+20 < total:
            time.sleep(1)
            response = yelp_api.search_query(ll=str(lati)+','+str(lngi),category_filter=str(cati), offset=off)
            if response['total'] > 500:
                total = 500
            else:
                response['total']
            print off
            print total
            if off+20 <= total:
                off = off+20
            for business in response['businesses']:
                lat = business['location']['coordinate']['latitude']
                lng = business['location']['coordinate']['longitude']
                features.append({"lat":lat, "lng":lng, "weight":business['rating'] })

        return JSON.dumps(features)
    except Exception, e:
        raise e
        return JSON.dumps(features)
    
if __name__ == '__main__':
     app.run()