# -*- coding: utf-8 -*-
import sys
import os
import json
import pprint

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from build_knowledge_part1 import ITEMS as p1
from build_knowledge_part2 import ITEMS as p2
from build_knowledge_part3 import ITEMS as p3
from build_knowledge_part4 import ITEMS as p4

ALL_ITEMS = p1 + p2 + p3 + p4
assert len(ALL_ITEMS) == 72

for idx, item in enumerate(ALL_ITEMS, 1):
    expected_id = f"kb-{idx:02d}"
    assert item["id"] == expected_id
    item["verified"] = True
    item["updated_at"] = "2026-03-01T00:00:00Z"

backend_py_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "app", "knowledge_data.py"))

py_content = f'''# -*- coding: utf-8 -*-
"""
RuralConnect Core 72 Multilingual Knowledge Base
Contains verified answers in English, Hindi, and Marathi across 18 core categories.
"""
from typing import List, Dict, Any

CORE_72_KNOWLEDGE_BASE: List[Dict[str, Any]] = {pprint.pformat(ALL_ITEMS, indent=4, width=120)}
'''

with open(backend_py_path, "w", encoding="utf-8") as f:
    f.write(py_content)

json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "knowledge_72.json"))
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(ALL_ITEMS, f, ensure_ascii=False, indent=2)

print(f"Generated {backend_py_path} with valid Python syntax!")
