'''
Created on 2014/7/30

@author: Louis
'''
import webapp2
from model import Product
import json
import model

def AsDict(p):
    return {'id': p.key.id(), 'Product_Id': p.Product_Id, 'Product_Name': p.Product_Name,'Catalog_Id':p.Catalog_Id}

class RestHandler(webapp2.RequestHandler):
    def dispatch(self):
    #time.sleep(1)
        super(RestHandler, self).dispatch()

    def SendJson(self, r):
        self.response.headers['content-type'] = 'text/plain'
        self.response.write(json.dumps(r))
        
class CountHandler(RestHandler):
    def get(self):
        count = model.productscount()
        r = [{'count':count}]
        self.SendJson(r)

class ProductHandler(RestHandler):
    def get(self, poffSet, pageRecNo):
        q = Product.query()
        products = q.fetch(offset=int(poffSet),limit=int(pageRecNo))
        r = [ AsDict(p) for p in products ]
        self.SendJson(r)

    def post(self,catalog_id,product_id):
        pass
    
    def put(self,catalog_id,product_id):    
        self.response.write('put. '
            'catalog id is %s product id is %s' % (catalog_id,product_id))

    def delete(self,catalog_id,product_id):    
        self.response.write('delete. '
            'catalog id is %s product id is %s' % (catalog_id,product_id))

class GetDataHandler(RestHandler):
    def get(self):
        products = model.getProducts()
        r = [ AsDict(p) for p in products ]
        self.SendJson(r)

class InsDataHandler(RestHandler):
    def post(self):
        myproduct = Product()
        myproduct.Product_Id = self.request.get('Product_Id')
        myproduct.Product_Name = self.request.get('Product_Name')
        myproduct.Catalog_Id = self.request.get('Catalog_Id')
        myproduct.put()    
#         self.response.write(product_key)

app = webapp2.WSGIApplication([
    ('/products/(\d+)/(\d+)', ProductHandler),
    ('/products/count', CountHandler),
    (r'/products/getdata', GetDataHandler),
    (r'/products/insdata', InsDataHandler),
])

def main():
    app.run()
    
if __name__ == '__main__':
    main()    
        