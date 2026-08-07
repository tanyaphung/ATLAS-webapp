#!/usr/bin/python

import sys
import MySQLdb
import numpy as np
import json
from scipy.stats import pearsonr, linregress
import time
import math


if len(sys.argv)<2:
	sys.exit("ERROR: Not enought argument.\nUSAGE: ./getPlotCor.py <json data>")
indata = json.loads(sys.argv[1])
indata = np.array(indata['data'])
if len(indata)<2:
	print("")
	sys.exit()

def is_float(s):
	try:
		return float(s)
	except ValueError:
		return False

def getH2idx(x):
	out = []
	for i in range(0, len(x)):
		if is_float(x[i]):
			out.append(i)
	return out

def getLinReg(x, y):
	tmp = linregress(x, y)
	x1 = min(x)
	x2 = max(x)
	y1 = tmp[0]*x1+tmp[1]
	y2 = tmp[0]*x2+tmp[1]
	if y1 < 0:
		y1 = 0;
		x1 = -tmp[1]/tmp[0]

	return {'intercept': tmp[1], 'slope': tmp[0], 'r': tmp[2], 'p': tmp[3], 'se':tmp[4], 'x1': x1, 'x2': x2, 'y1': y1, 'y2': y2}

def clean_nan(obj):
    if isinstance(obj, dict):
        return {k: clean_nan(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_nan(v) for v in obj]
    elif isinstance(obj, float) and math.isnan(obj):
        return None
    else:
        return obj

out = {}
h2_idx = getH2idx(indata[:,4].astype(str))

# year vs sample size
if max(indata[:,1].astype(int))-min(indata[:,1].astype(int)) > 0:
	out['yearVSn'] = getLinReg(indata[:,1].astype(int), indata[:,2].astype(float))
else:
	out['yearVSn'] = {}

# risk loci vs sample size
out['nVSloci'] = getLinReg(indata[:,2].astype(float), indata[:,3].astype(int))

if len(h2_idx)==0:
	out['nVSh2'] = {}
	out['lociVSh2'] = {}
else:
	# h2 vs sample size
	out['nVSh2'] = getLinReg(indata[h2_idx,2].astype(float), indata[h2_idx,4].astype(float))
	# h2 vs risk loci
	out['lociVSh2'] = getLinReg(indata[h2_idx,3].astype(int), indata[h2_idx,4].astype(float))
 

# print(out, file=sys.stderr)

# print(json.dumps(out))
# print(json.dumps(out, default=lambda x: int(x) if isinstance(x, np.integer) else float(x) if isinstance(x, np.floating) else x.tolist() if isinstance(x, np.ndarray) else str(x)))

print(json.dumps(clean_nan(out), default=lambda x: int(x) if isinstance(x, np.integer) else float(x) if isinstance(x, np.floating) else x.tolist() if isinstance(x, np.ndarray) else str(x)))