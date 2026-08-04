#!/usr/bin/python

##### getGeneheat.py #####
# return json for heatmap of significant gene overlap
# 2 Mar 2017
########################

import sys
import os
import configparser
import MySQLdb
import numpy as np
import pandas as pd
import json
import math
from scipy.cluster.hierarchy import linkage, leaves_list
import time

if len(sys.argv)<6:
    sys.exit("ERROR: Not enough argument.\nUSAGE: ./getGeneheat.py <host> <user> <passwd> <database> <ids> <p-value>")

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
p = float(sys.argv[6])

## config
cfg = configparser.ConfigParser()
cfg.read(os.path.dirname(os.path.realpath(__file__))+'/app.config')

datadir = cfg.get('path', 'data')

## connect mysql
conn = MySQLdb.connect(host=host, user=user, passwd=passwd, db=db)
c = conn.cursor()

## get sig genes
magma = pd.read_csv(datadir+"/magma.P.txt", sep=r"\s+", header=0, index_col=0, usecols=["GENE"]+[str(x) for x in ids])
magma = magma.dropna()
genes = np.array(list(magma.index.values))
magma = np.array(magma)
minP = np.min(magma, axis=1)
idx = np.where(minP<p)
genes = genes[idx]
magma = magma[idx]
magma = -1*np.log10(magma)
np.place(magma, magma<-1*math.log10(p), 0)
np.place(magma, magma>-1*math.log10(p), 1)

## number of sig genes
ng = np.sum(magma, axis=0)
inids = np.array(ids)[np.where(ng>0)].astype(int)
magma = magma[:,np.where(ng>0)[0]]
ng = np.c_[inids, np.sum(magma, axis=0, dtype=int)]

go = []
for i in range(len(inids)):
	tmp = np.sum(np.multiply(magma[:,i].reshape(len(magma),1),magma[:,(i+1):]), axis=0, dtype=float)/float(ng[i,1])
	if len(go)==0:
		go = np.c_[[inids[i]]*len(tmp), inids[(i+1):], tmp]
	else:
		tmp = np.c_[[inids[i]]*len(tmp), inids[(i+1):], tmp]
		go = np.r_[go, tmp]
tmp = np.c_[inids, inids, [1.0]*len(inids)]
go = np.r_[go, tmp]
inids = np.flip(inids, axis=0)
magma = np.flip(magma, axis=1)
for i in range(len(inids)):
	tmp = np.sum(np.multiply(magma[:,i].reshape(len(magma),1),magma[:,(i+1):]), axis=0, dtype=float)/float(ng[len(ng)-i-1,1])
	tmp = np.c_[[inids[i]]*len(tmp), inids[(i+1):], tmp]
	go = np.r_[go, tmp]
inids = list(np.flip(inids, axis=0))

## create overlap matrix
go = pd.DataFrame(go, columns=["id1", "id2", "p"])
go[['id1', 'id2']] = go[['id1', 'id2']].astype(int)
mat = go.pivot_table(index='id1', columns='id2', values='p')
mat = np.matrix(mat)
go = np.array(go, dtype=object)
go = [[int(l[0]), int(l[1]), l[2]] for l in go if l[2]>0]

if len(mat)<=1:
	data = {"data":{"id":[], "Domain":[], "Trait":[], "go":[], "ng":[], "order":{"alph":[], "domain":[], "clst":[]}}}
	print(json.dumps(data))
	sys.exit()

## get trait and domain info
c.execute('SELECT id,Domain,Trait,Year from gwasDB');
rows = c.fetchall()
traits = []
for r in rows:
    if int(r[0]) in inids:
        traits.append([r[0], r[1], r[2], str(r[0])+": "+r[2]+" ("+str(r[3])+")"])

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
    trait[str(int(l[0]))]=l[3]

## return nested json
data = {"data":{"id":inids, "Domain":domain, "Trait":trait, "go":go, "ng":ng.tolist(), "order":{"alph":otrait, "domain":odomain, "clst": oclst}}}
# print(json.dumps(data))

def convert(obj):
    if isinstance(obj, np.integer):
        return int(obj)
    if isinstance(obj, np.floating):
        return float(obj)
    if isinstance(obj, np.bool_):
        return bool(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, dict):
        return {k: convert(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [convert(v) for v in obj]
    return obj

print(json.dumps(convert(data)))
