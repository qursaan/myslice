import sys
import psycopg2
import psycopg2.extras

class Database():
    
    def __init__( self, DbConfigurations ):
        self.connection = None
        self.connect( DbConfigurations['dbHost'], DbConfigurations['dbUser'],
                      DbConfigurations['dbPassword'], DbConfigurations['dbName'] )
    
    
    def connect( self, host, user, password, database ):
        result = True
        try:
            self.connection = psycopg2.connect(	"host=" + host + " dbname=" + database + " user=" +
                                                user + " password=" + password )
        except psycopg2.DatabaseError, e:
            result = False
            
        return result
    
    
    def close( self ):
        if self.connection:
            self.connection.close()
            self.connection = None
    
    
    def query( self, queryString ):
        result = True
        try:
            cursor = self.connection.cursor()
            cursor.execute( queryString )
            self.connection.commit()
        except Exception, e:
            result = False
            self.rollback()
            
        return result
    
    
    def rollback( self ):
        if self.connection:
            self.connection.rollback()
    
    
    def fetchRows( self, queryString ):
        rows = None
        try:
            cursor = self.connection.cursor( cursor_factory = psycopg2.extras.RealDictCursor )
            cursor.execute( queryString )
            rows = cursor.fetchall()
        except Exception, e:
            pass
            
        return rows
