from flask import Flask, request
from flask_restful import Resource, Api
from json import dumps


app = Flask(__name__)
api = Api(app)

from pprint import pprint
from yelpapi import YelpAPI
import json as JSON
import time
yelp_api = YelpAPI('iHH-v_aKTI_vNAJeL6Jmag', 'IUgyiguE-4z7idZ7Yi48DpGGCKY', 'HRonseLc9wxZam_oXKUqiflwNlF-kd_G', 
    'orfctLydn-gPVx3fNPvuBdQVOUM')

#class GetTop5(Resource):
#    def get(self, keyword, lat, lng):
#        response = yelp_api.search_query(term=keyword, ll=lat+','+lng, sort=2, limit=5)
#        return response['businesses']
        #We can have PUT,DELETE,POST here. But in our API GET implementation is sufficient
 
#api.add_resource(GetTop5, '/yelp/ke')

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
                #print business['name'] + " " + business['categories'][0][0] + " " + str(business['rating'])
                lat = business['location']['coordinate']['latitude']
                lng = business['location']['coordinate']['longitude']
                features.append({"lat":lat, "lng":lng, "weight":business['rating'] })

        return JSON.dumps(features)
    except Exception, e:
        raise e
        return JSON.dumps(features)
    
if __name__ == '__main__':
     app.run()