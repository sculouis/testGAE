'''
Created on 2014/7/30

@author: Louis
'''
from google.appengine.ext import ndb
    
class Product(ndb.Model):
    Product_Id = ndb.StringProperty()    
    Product_Name = ndb.StringProperty()
    Catalog_Id = ndb.StringProperty()
    Create_Time = ndb.DateTimeProperty(auto_now=True)
    Modify_Time = ndb.DateTimeProperty(auto_now=True)  

class Catalog(ndb.Model):
    Catalog_Id = ndb.StringProperty()    
    Catalog_Name = ndb.StringProperty()
    Create_Time = ndb.DateTimeProperty(auto_now=True)
    Modify_Time = ndb.DateTimeProperty(auto_now=True)  

def productscount():
    q = Product.query()
    return q.count() 
    
def getProducts():
    Q=Product.query()
    return Q      

def getCatalogs():
    Q=Catalog.query()
    return Q      

    