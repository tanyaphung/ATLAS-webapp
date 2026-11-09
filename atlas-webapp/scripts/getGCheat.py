#!/usr/bin/python

##### getGCheat.py #####
# return json for heatmap of genetic correlatioin
# arguments need mysql connection info and ids
# 2 Mar 2017
########################

import sys
import MySQLdb
import atlas_db
import numpy as np
import pandas as pd
import json
from scipy.cluster.hierarchy import linkage, leaves_list
import time

if len(sys.argv)<2:
    sys.exit("ERROR: Not enought argument.\nUSAGE: ./getGCheat.py <ids>")

## Get arguments
ids = sys.argv[1]
ids = ids.split(":")
ids = [int(s) for s in ids]

## connect mysql
conn = atlas_db.connect()
c = conn.cursor()

## genetic correlation filters on given ids
c.execute('SELECT * from GenCor')
rows = c.fetchall()
gc = []
for r in rows:
    if int(r[0]) in ids and int(r[1]) in ids:
        r = np.array(r)
        r[0] = int(r[0])
        r[1] = int(r[1])
        gc.append([int(r[0]), int(r[1])]+list(r[2:]))
gc = np.array(gc, dtype=object)


if len(gc)==0:
	data = {"data":{"id":[], "Domain":[], "Trait":[], "rg":[], "order":{"alph":[], "domain":[], "clst": []}}}
	print(json.dumps(data))
	sys.exit()

## ids of GWAS which have at least one genetic correlation
inids = np.unique(list(gc[:,0].astype(int))+list(gc[:,1].astype(int)))
if len(inids) == 0:
	data = {"data":{"id":[], "Domain":[], "Trait":[], "rg":[], "order":{"alph":[], "domain":[], "clst": []}}}
	print(json.dumps(data))
	sys.exit()
inids.sort()

## for mat gc
n = len(inids)*(len(inids)-1)/2 # number of test to correct for
pbon = gc[:,5]*n
pbon[pbon>1] = 1.0
gc = np.c_[gc[:,[0,1,2,5]], pbon, gc[:,[3,4,6,7]]]
gc = np.r_[gc, gc[:,[1,0,2,3,4,5,6,7,8]]]
gc = np.r_[gc, np.c_[inids,inids,[1]*len(inids),[0]*len(inids),[0]*len(inids),[1]*len(inids),[1]*len(inids),[1]*len(inids),[1]*len(inids)]]

## get trait and domain info
c.execute('SELECT id,Domain,Trait,Year from gwasDB');
rows = c.fetchall()
traits = []
for r in rows:
	if int(r[0]) in inids:
		traits.append([r[0], r[1], r[2], str(r[0])+": "+r[2]+" ("+str(r[3])+")"])

traits = np.array(traits)

## create matrix for hierarchical clustering
rg = gc[:,0:3]
rg = pd.DataFrame(rg, columns=["id1", "id2", "rg"])
rg[['id1', 'id2']] = rg[['id1', 'id2']].astype(int)
rg['rg'] = rg['rg'].astype(float)
rg = rg.pivot_table(index='id1', columns='id2', values='rg', fill_value=0)
rg = np.matrix(rg)

## clustering order
clst = list(leaves_list(linkage(rg, "single")))
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
    trait[str(int(l[0]))]=l[3]

## return nested json
inids = list(inids)
data = {"data":{"id":inids, "Domain":domain, "Trait":trait, "rg":gc.tolist(), "order":{"alph":otrait, "domain":odomain, "clst": oclst}}}
print(json.dumps(data, default=int))
