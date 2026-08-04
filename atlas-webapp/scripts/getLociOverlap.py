#!/usr/bin/python

import sys
import os
import MySQLdb
import ConfigParser
import numpy as np
import json
import time
import pandas as pd
import numpy as np

##### Return index of a1 which exists in a2 #####
def ArrayIn(a1, a2):
	return np.where(np.in1d(a1, a2))[0]

##### Return unique array #####
def unique(a):
	unique = []
	[unique.append(s) for s in a if s not in unique]
	return unique

if len(sys.argv)<2:
    sys.exit("ERROR: Not enought argument.\nUSAGE: ./getLociOverlap.py <host> <user> <passwd> <db> <ids>")

# Get arguments
host = sys.argv[1]
user = sys.argv[2]
passwd = sys.argv[3]
db = sys.argv[4]
ids = sys.argv[5]
ids = ids.split(":")
ids = [int(s) for s in ids]
ids.sort()

## config
cfg = ConfigParser.ConfigParser()
cfg.read(os.path.dirname(os.path.realpath(__file__))+'/app.config')

datadir = cfg.get('path', 'data')

## connect mysql
conn = MySQLdb.connect(host=host, user=user, passwd=passwd, db=db)
c = conn.cursor()

## get risk loci
loci = pd.read_csv(datadir+"/RiskLoci.txt", header=0, sep="\t")
loci = np.array(loci)
loci = loci[ArrayIn(loci[:,0], ids)]
if len(loci)==0:
	data = {"id":[], "Domain":[], "Trait":[], "loci":[], "loci_group":[]}
	print json.dumps(data)
	sys.exit()

## identify overlapped loci
loci = loci[np.lexsort((loci[:,4], loci[:,3]))]
lociid = []
cur_id = 1
cur_end = loci[0,7]
cur_chr = loci[0,3]
lociid.append(cur_id)

for i in range(1,len(loci)):
	if cur_chr == loci[i,3]:
		if cur_end > loci[i,6]:
			lociid.append(cur_id)
			cur_end = max(cur_end, loci[i,7])
		else:
			cur_id += 1
			lociid.append(cur_id)
			cur_end = loci[i,7]
	else:
		cur_chr = loci[i,3]
		cur_id += 1
		lociid.append(cur_id)
		cur_end = loci[i,7]

loci = np.c_[loci, lociid]

## get trait and domain info
ids = unique(loci[:,0])
c.execute('SELECT id,Domain,Trait,Year from gwasDB');
rows = c.fetchall()
traits = []
for r in rows:
    if int(r[0]) in ids:
        traits.append([r[0], r[1], r[2], str(r[0])+": "+r[2]+" ("+str(r[3])+")"])

traits = np.array(traits)
domains = traits[:,1]

## summary of overlapped loci
loci_group = []
lociid = unique(lociid)

for i in lociid:
	tmp = loci[loci[:,8]==i]
	chrom = tmp[0,3]
	start = min(tmp[:,6])
	end = max(tmp[:,7])
	loci_group.append([i, chrom, start, end, len(unique(tmp[:,0])), len(unique(domains[ArrayIn(traits[:,0].astype(int),tmp[:,0])]))])

## domain and trait name
domain = {}
trait = {}
for l in traits:
    domain[str(int(l[0]))]=l[1]
    trait[str(int(l[0]))]=l[3]

## return nested json
loci = [list(l) for l in loci]
data = {"id":ids, "Domain":domain, "Trait":trait, "loci": loci, "loci_group": loci_group}
print json.dumps(data)
