'''
Created on 2014/8/1

@author: Louis
'''
import webapp2
from model import Catalog
import json
import model

def AsDict(p):
    return {'id': p.key.id(), 'Catalog_Id': p.Catalog_Id, 'Catalog_Name': p.Catalog_Name}

class HomeHandler(webapp2.RequestHandler):
    def get(self):
        pass

class CatalogHandler(webapp2.RequestHandler):
    def get(self, catalog_id):
        self.response.write('get. '
            'catalog id is %s' % catalog_id)

    def post(self,catalog_id):
        pass
    
    def put(self,catalog_id):    
        self.response.write('put. '
            'catalog id is %s' % catalog_id)

    def delete(self,catalog_id,product_id):    
        self.response.write('delete. '
            'catalog id is %s' % catalog_id)

class GetDataHandler(webapp2.RequestHandler):
    def get(self):
        catalogs = model.getCatalogs()
        r = [ AsDict(p) for p in catalogs ]
        self.SendJson(r)
        
    def SendJson(self, r):
        self.response.headers['content-type'] = 'text/plain'
        self.response.write(json.dumps(r))

class InsDataHandler(webapp2.RequestHandler):
    def post(self):
        mycatalog = Catalog()
        mycatalog.Catalog_Id = self.request.get('Catalog_Id')
        mycatalog.Catalog_Name = self.request.get('Catalog_Name')
        catalog_key = mycatalog.put()    
        self.response.write(catalog_key)

app = webapp2.WSGIApplication([
    (r'/catalogs/(\d+)', CatalogHandler),
    (r'/catalogs/getdata', GetDataHandler),
    (r'/catalogs/insdata', InsDataHandler),
])

def main():
    app.run()
    
if __name__ == '__main__':
    main()    
                