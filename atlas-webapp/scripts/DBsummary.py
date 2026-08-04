#!/usr/bin/python

##### DBsummary.py #####
# Create json for summary plots
# require mysql connection info and column to group
# 21 Nov 2017
########################

import sys
import MySQLdb
import numpy as np
import json
from scipy.cluster.hierarchy import linkage, leaves_list
import time

##### return unique element in a list #####
def unique(a):
	unique = []
	[unique.append(s) for s in a if s not in unique]
	return unique

if len(sys.argv)<6:
    sys.exit("ERROR: Not enought argument.\nUSAGE: ./DBsummary.py <host> <user> <passwd> <database> <column>")

### Get arguments
host = sys.argv[1]
user = sys.argv[2]
passwd = sys.argv[3]
db = sys.argv[4]
col = sys.argv[5]

## connect mysql
conn = MySQLdb.connect(host=host, user=user, passwd=passwd, db=db)
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
groups.sort()

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
out = {"sum": summary, "Nbox":{"data":Nbox, "out":Nboxout}, "Hbox":{"data":Hbox, "out":Hboxout}}
print json.dumps(out)
