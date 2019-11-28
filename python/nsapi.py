# only look at:
# "classType": "SECOND", or "FIRST"
# "discountType": "NONE",
# "productType": "SINGLE_FARE", or "RETURN_FARE"

import urllib
import json

from urllib.request import Request, urlopen  # Python 3
apikey = 'fcdbd1c4a6a3444a84f8d0d6142d2e6f'

def price_search(date, fromstation, tostation):
    url = 'https://gateway.apiportal.ns.nl/public-prijsinformatie/prices/?'
    final_url = url + "&date=" + date + "&fromStation=" + fromstation + "&toStation=" + tostation
    req = Request(final_url)
    req.add_header('Ocp-Apim-Subscription-Key', apikey)
    return json.load(urlopen(req))

# result of a random example
data = price_search('2019-11-27', 'Amsterdam', 'Utrecht')

# For the ease of use: Only look in the route without options for ease of use.
# In the other list there are fixed price tickets like one for children and supplements for a single use ov chipcard and for the international IC
routeswithoutoptions = data['priceOptions'][1]['totalPrices']

#print the prices when discountType is none and producttype is single fare or return fare
for item in routeswithoutoptions:
    if item['discountType'] == 'NONE' and ((item['productType'] == "SINGLE_FARE") or (item['productType'] == "RETURN_FARE")):
        print('ProductType: ' + item['productType'])
        print('Class: ' + item['classType'])
        print('Price without discount: ' + str(item['price']))
