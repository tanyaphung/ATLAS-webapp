#!/usr/bin/python

import sys
import os
import MySQLdb
import ConfigParser
import numpy as np
import json
import time
import pandas as pd
import math

##### Return index of a1 which exists in a2 #####
def ArrayIn(a1, a2):
	return np.where(np.in1d(a1, a2))[0]

##### Return unique array #####
def unique(a):
	unique = []
	[unique.append(s) for s in a if s not in unique]
	return unique

if len(sys.argv)<2:
    sys.exit("ERROR: Not enought argument.\nUSAGE: ./getGenesPleiotropy.py <host> <user> <passwd> <db> <ids>")

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
genedir = cfg.get('path', 'ENSG')

## connect mysql
conn = MySQLdb.connect(host=host, user=user, passwd=passwd, db=db)
c = conn.cursor()

## magma genes
magma = pd.read_csv(datadir+"/magma.P.txt", delim_whitespace=True, header=0, index_col=0, usecols=["GENE"]+[str(x) for x in ids])
magma = magma.dropna()
genes = np.array(list(magma.index.values))
magma = np.array(magma)
n = len(genes)
pbon = 0.05/n
minP = np.min(magma, axis=1)
idx = np.where(minP<pbon)
genes = genes[idx]
magma = magma[idx]
magma = -1*np.log10(magma)
np.place(magma, magma<-1*math.log10(pbon), 0)
np.place(magma, magma>-1*math.log10(pbon), 1)
ng = np.sum(magma, axis=0)
inids = np.array(ids)[np.where(ng>0)].astype(int)
magma = magma[:,np.where(ng>0)[0]]
magma = magma[genes.argsort()]
genes = genes[genes.argsort()]

## ENSG
ENSG = pd.read_csv(genedir, sep="\t", header=0, usecols=["ensembl_gene_id", "external_gene_name", "chromosome_name", "start_position", "end_position"])
ENSG = np.array(ENSG)
ENSG = ENSG[ENSG[:,0].argsort()]
ENSG = ENSG[ArrayIn(ENSG[:,0], genes)]

## trait info
c.execute('SELECT id,Domain,Trait,Year FROM gwasDB ORDER BY id');
rows = c.fetchall()
traits = []
for r in rows:
    if int(r[0]) in inids:
        traits.append([r[0], r[1], r[2], str(r[0])+": "+r[2]+" ("+str(r[3])+")"])
traits = np.array(traits)
domains = traits[:,1]

## domain and trait name
domain = {}
trait = {}
for l in traits:
    domain[str(int(l[0]))]=l[1]
    trait[str(int(l[0]))]=l[3]

nTrait = np.sum(magma, axis=1, dtype=int)
nDomain = map(lambda x: len(unique(domains[np.where(x==1)])), magma)

genes = np.array([ENSG[i,:].tolist()+[nTrait[i], nDomain[i]] for i in range(len(genes))], dtype=object)
data = {"id":inids.tolist(), "Domain":domain, "Trait":trait, "genes":genes.tolist()}
print json.dumps(data)
