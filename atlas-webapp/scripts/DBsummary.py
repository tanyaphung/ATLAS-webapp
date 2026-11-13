#!/usr/bin/python

##### DBsummary.py #####
# Create json for summary plots
# require mysql connection info and column to group
# 21 Nov 2017
########################

import sys
import MySQLdb
import atlas_db
import numpy as np
import json
from scipy.cluster.hierarchy import linkage, leaves_list
import time

##### return unique element in a list #####
def unique(a):
	unique = []
	[unique.append(s) for s in a if s not in unique]
	return unique

if len(sys.argv)<2:
    sys.exit("ERROR: Not enought argument.\nUSAGE: ./DBsummary.py <column>")

### Get arguments
col = sys.argv[1]
# col is pasted into the query below, so only allow the two columns the site uses
if col not in ("Year", "Domain"):
    sys.exit("ERROR: column must be Year or Domain")

## connect mysql
conn = atlas_db.connect()
c = conn.cursor()

### get values
c.execute('SELECT '+col+',PMID, uniqTrait, N, IFNULL(SNPh2_l, SNPh2) as SNPh2 from gwasDB')
rows = c.fetchall()
data = []
for r in rows:
	data.append(np.array(r))

data = np.array(data)

### groups
groups = unique(data[:,0])
# groups.sort()
groups.sort(key=str)

### summary
summary = []
for g in groups:
	summary.append([g, int(len(unique(data[data[:,0]==g,1]))), int(len(np.where(data[:,0]==g)[0])), int(len(unique(data[data[:,0]==g,2])))])

### box plot for sample size
Nbox = []
Nboxout = []
for g in groups:
	med = np.median(data[data[:,0]==g,3].astype(int))
	avg = round(np.mean(data[data[:,0]==g,3].astype(int)), 2)
	q1 = np.percentile(data[data[:,0]==g,3].astype(int), 25)
	q3 = np.percentile(data[data[:,0]==g,3].astype(int), 75)
	IQR = q3-q1
	xmin = min(data[np.where((data[:,0]==g) & (data[:,3].astype(int)>=q1-1.5*IQR))][:,3].astype(int))
	xmax = max(data[np.where((data[:,0]==g) & (data[:,3].astype(int)<=q3+1.5*IQR))][:,3].astype(int))
	Nbox.append([g, med, avg, q1, q3, xmin, xmax])
	for l in data[np.where((data[:,0]==g) & ((data[:,3].astype(int)<q1-1.5*IQR) | (data[:,3].astype(int)>q3+1.5*IQR)))][:,[0,3]]:
		Nboxout.append([l[0], int(l[1])])
### box plot for SNP h2
Hbox = []
Hboxout = []
data[data[:,4].astype(float)>1,4] = "1"
data[data[:,4].astype(float)<0,4] = "0"
data = data[data[:,4].astype(float)>=0]
for g in groups:
	if g in data[:,0]:
		med = round(np.median(data[data[:,0]==g,4].astype(float)), 2)
		avg = round(np.mean(data[data[:,0]==g,4].astype(float)), 2)
		q1 = np.percentile(data[data[:,0]==g,4].astype(float), 25)
		q3 = np.percentile(data[data[:,0]==g,4].astype(float), 75)
		IQR = q3-q1
		xmin = min(data[np.where((data[:,0]==g) & (data[:,4].astype(float)>=q1-1.5*IQR))][:,4].astype(float))
		xmax = max(data[np.where((data[:,0]==g) & (data[:,4].astype(float)<=q3+1.5*IQR))][:,4].astype(float))
		Hbox.append([g, med, avg, q1, q3, xmin, xmax])
		for l in data[np.where((data[:,0]==g) & ((data[:,4].astype(float)<q1-1.5*IQR) | (data[:,4].astype(float)>q3+1.5*IQR)))][:,[0,4]]:
			Hboxout.append([l[0], float(l[1])])

### return nested json
summary = [[str(row[0]), *row[1:]] for row in summary]
out = {"sum": summary, "Nbox":{"data":Nbox, "out":Nboxout}, "Hbox":{"data":Hbox, "out":Hboxout}}

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return super().default(obj)

print(json.dumps(out, cls=NumpyEncoder))