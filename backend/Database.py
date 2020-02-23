import cv2
import numpy as np
import sqlite3

def convertToBinaryData(filename):
    #Convert digital data to binary format
    with open(filename, 'rb') as file:
        blobData = file.read()
    return blobData

def insertBLOB(name, image):
    #--- database creator
    conn = sqlite3.connect('Database.db')
    print("Connected to SQLite")
    #--- create table
    conn.cursor().execute("drop table if exists Images")
    conn.cursor().execute("""create table Images (image_id INTEGER PRIMARY KEY, name TEXT UNIQUE, image BLOB)""")

    #--- img is a numpy array
    print("Type img", type(image), "Shape", image.shape)
    b = cv2.imencode('.jpg', image)[1].tobytes()
    #--- b is binary
    print("Type b", type(b))
    #--- insert image and data into table
    name = 'window'
    conn.cursor().execute("insert into Images VALUES (?,?,?)",(None, None, sqlite3.Binary(b),))
    conn.commit()
    conn.cursor().close()