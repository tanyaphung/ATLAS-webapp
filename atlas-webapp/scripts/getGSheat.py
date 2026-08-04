#!/usr/bin/python

##### getGeneheat.py #####
# return json for heatmap of significant gene-sets overlap
# 4 Mar 2017
########################

import sys
import os
import ConfigParser
import MySQLdb
import numpy as np
import json
from scipy.cluster.hierarchy import linkage, leaves_list

if len(sys.argv)<6:
    sys.exit("ERROR: Not enought argument.\nUSAGE: ./getGSheat.py <host> <user> <passwd> <database> <ids>")

##### Return index of a1 which exists in a2 #####
def ArrayIn(a1, a2):
	# results = [i for i, x in enumerate(a1) if x in a2]
	results = np.where(np.in1d(a1, a2))[0]
	return results

## Get arguments
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

## get sig genes
GS = []
inids = []

with open(datadir+"/magma.sig.sets", 'r') as fin:
    fin.readline()
    for l in fin:
        l = l.strip().split()
        if int(l[0]) not in ids:
            continue
        if len(l) > 1:
            GS.append(l[1].split(";"))
            inids.append(int(l[0]))
        else:
            continue
    fin.close()

## n genes
ngs = []
for i in range(0, len(inids)):
    ngs.append([inids[i], len(GS[i])])

## create matrix for hierarchical clustering
gso = []
mat = []
for i in range(0,len(inids)):
    row = []
    if len(GS[i]) == 0:
        row = [0]*len(inids)
        for j in range(0,len(inids)):
            gso.append([inids[i], inids[j], -1])
    else:
        for j in range(0,len(inids)):
            if i==j:
                row.append(1)
                gso.append([inids[i], inids[j], 1])
            elif float(len(GS[j]))==0:
                row.append(0)
                gso.append([inids[i], inids[j], -1])
            else:
                n = len(ArrayIn(np.array(GS[i]), np.array(GS[j])))
                gso.append([inids[i], inids[j], float(n)/float(len(GS[j]))])
                row.append(float(n)/float(len(GS[j])))
    mat.append(row)

mat = np.array(mat)

## get trait and domain info
c.execute('SELECT id,Domain,Trait from gwasDB');
rows = c.fetchall()
traits = []
for r in rows:
    if int(r[0]) in inids:
        traits.append(list(r))

traits = np.array(traits)

## clustering order
clst = list(leaves_list(linkage(mat, "single")))
oclst = {}

## Domain order
domain = list(np.lexsort((traits[:,2], traits[:,1])))
odomain = {}

## Trait alphabetical order
trait = list(np.argsort(traits[:,2]))
otrait = {}

for i in range(0,len(inids)):
    oclst[str(int(inids[int(clst[i])]))] = i
    odomain[str(int(inids[domain[i]]))] = i
    otrait[str(int(inids[trait[i]]))] = i

## domain and trait name
domain = {}
trait = {}
for l in traits:
    domain[str(int(l[0]))]=l[1]
    trait[str(int(l[0]))]=l[2]

## return nested json
data = {"data":{"id":inids, "Domain":domain, "Trait":trait, "gso":gso, "ngs":ngs, "order":{"alph":otrait, "domain":odomain, "clst": oclst}}}
print json.dumps(data)
