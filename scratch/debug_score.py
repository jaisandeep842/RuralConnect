# -*- coding: utf-8 -*-
import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

query = "डिजिटल मार्केटिंग क्या है?"
tokens = [w.strip("?,.!;:।\'\"()[]{}") for w in query.split()]
tokens = [w for w in tokens if w]
print("Clean tokens:", tokens)
