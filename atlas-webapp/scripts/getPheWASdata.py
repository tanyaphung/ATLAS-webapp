#!/usr/bin/python

##### getPheWASdata.py #####
# return json for PheWAS plot
# 5 Mar 2018
###########################

import sys
import os
import ConfigParser
import MySQLdb
import numpy as np
import pandas as pd
import json
import re
import tabix
import subprocess

##### check integer #####
def is_int(s):
	try:
		int(s)
		return True
	except ValueError:
		return False

##### define input type (SNP or Gene) ####
def CheckInputType(text):
	if re.match(r'^rs\d+', text, re.IGNORECASE):
		return "SNP"
	elif ":" in text:
		chrom,pos = text.split(":")
		if is_int(chrom) and is_int(pos):
			return "SNP"
		else:
			"SNP_error"
	else:
		return "Gene"

##### get SNP data #####
def getSNP(text, ids, host, user, passwd, db, datadir, maxP):
	## connect mysql
	conn = MySQLdb.connect(host=host, user=user, passwd=passwd, db=db)
	c = conn.cursor()

	chrom = 0;
	pos = 0;
	if re.match(r'^rs', text, re.IGNORECASE):
		ucsc = MySQLdb.connect(host="genome-mysql.soe.ucsc.edu", user="genome", db="hg19")
		dbSNP = ucsc.cursor()
		dbSNP.execute('SELECT chrom, chromEnd FROM snp146 WHERE name='+'"'+text+'"')
		rows = dbSNP.fetchall()
		chrom, pos = rows[0]
		chrom = int(chrom.replace('chr', ''))
		pos = int(pos)
	else:
		chrom, pos = [int(x) for x in text.split(":")]

	if len(ids)==0:
		c.execute('SELECT id FROM gwasDB')
		rows = c.fetchall()
		for r in rows:
			ids.append(int(r[0]))

	out = []
	p = {}
	ea = {}
	nea = {}
	tb = tabix.open(datadir+"/snps_P_lt_0_05_chr"+str(chrom)+".txt.gz")
	snps = tb.querys(str(chrom)+":"+str(pos)+"-"+str(pos))
	for l in snps:
		if int(l[5]) in ids and float(l[4])<maxP:
			p[int(l[5])] = float(l[4])
			ea[int(l[5])] = l[2]
			nea[int(l[5])] = l[3]
	c.execute("SELECT id,PMID,Year,Domain,Trait,N FROM gwasDB")
	rows = c.fetchall()
	for r in rows:
		if r[0] in p:
			out.append([r[0], p[r[0]]]+list(r)[1:]+[ea[r[0]], nea[r[0]]])

	return out

##### get Gene data #####
def getGene(text, ids, host, user, passwd, db, datadir, genesdir, maxP):
	text = text.upper()
	if not re.match(r'^ENSG', text):
		stdo = subprocess.Popen("grep "+text+" "+genesdir, stdout=subprocess.PIPE, shell=True)
		stdo = stdo.communicate()[0]
		stdo = stdo.strip().split("\n")
		if len(stdo)>0:
			with open(genesdir, 'r') as ensg:
				header = ensg.readline().strip().split()
			for l in stdo:
				l = l.split()
				if l[header.index("external_gene_name")]==text or l[header.index("hgnc_symbol")]==text or l[header.index("entrezID")]==text or '|'+text+'|' in l[header.index("alias")]:
					text = l[0]
					break;
		if not re.match(r'^ENSG', text):
			return "Gene_id_not_match"

	## connect mysql
	conn = MySQLdb.connect(host=host, user=user, passwd=passwd, db=db)
	c = conn.cursor()

	if len(ids)==0:
		c.execute('SELECT id FROM gwasDB')
		rows = c.fetchall()
		for r in rows:
			ids.append(int(r[0]))

	out = []
	p = {}
	genes = pd.read_csv(datadir+"/magma.P.txt", delim_whitespace=True, header=0, dtype=str, usecols=["GENE"])
	genes = np.array(genes)[:,0]
	if text in genes:
		idx = list(genes).index(text)
		tmp = pd.read_csv(datadir+"/magma.P.txt", delim_whitespace=True, header=None, dtype=str, skiprows=idx+1, nrows=1)
		tmp = np.array(tmp)[0,:]
		for i in range(1, len(tmp)):
			if i in ids and tmp[i]!="NA" and float(tmp[i])<maxP:
				p[i] = tmp[i]

	c.execute("SELECT id,PMID,Year,Domain,Trait,N FROM gwasDB")
	rows = c.fetchall()
	for r in rows:
		if r[0] in p:
			g = [r[0], float(p[r[0]])]
			c.execute("SELECT PMID,Year,Domain,Trait,N FROM gwasDB WHERE id="+str(r[0]))
			rows = c.fetchall()
			out.append(g+list(r)[1:])

	return out

def main():
	if len(sys.argv)<8:
	    sys.exit("ERROR: Not enought argument.\nUSAGE: ./getPheWASdata.py <host> <user> <passwd> <database> <text> <ids> <maxP> <datadir>")

	## Get arguments
	host = sys.argv[1]
	user = sys.argv[2]
	passwd = sys.argv[3]
	db = sys.argv[4]
	text = sys.argv[5]
	ids = sys.argv[6]
	if ids=="NA":
		ids = []
	else:
		ids = [int(s) for s in ids.split(":")]
		ids.sort()
	maxP = float(sys.argv[7])
	datadir = sys.argv[8]

	## config
	cfg = ConfigParser.ConfigParser()
	cfg.read(os.path.dirname(os.path.realpath(__file__))+'/app.config')
 	genedir = cfg.get('path', 'ENSG')
	datadir = cfg.get('path', 'data')

	## check type of text
	input_type = CheckInputType(text)

	error=""
	out = []
	order = []
	if input_type=="SNP_error":
		error = "SNP_input_error"
	elif input_type=="SNP":
		out = getSNP(text, ids, host, user, passwd, db, datadir, maxP)
		if len(out)==0:
			error = "SNP_not_found"
	else:
		out = getGene(text, ids, host, user, passwd, db, datadir, genedir, maxP)
		if len(out)==0:
			error = "Gene_not_found"
		elif out=="Gene_id_not_match":
			error = out
			out = []

	if len(out)>0:
		t = np.array(out, dtype=object)
		order.append(list(t[np.argsort(t[:,5]),0])) ## alph
		order.append(list(t[np.argsort(t[:,1].astype(float)),0])) ## p
		order.append(list(t[np.argsort(t[:,6].astype(int)),0][::-1])) ## n
		order.append(list(t[np.lexsort((t[:,5], t[:,4])),0])) ## domain_alph
		order.append(list(t[np.lexsort((t[:,1].astype(float), t[:,4])),0])) ## domain_p

	print json.dumps({"type":input_type, "data":out, "order":order, "error":error})

if __name__=="__main__": main()
