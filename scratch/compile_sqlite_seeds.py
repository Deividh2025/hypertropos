import os
import re
import json

def scan_values(s):
    idx = 0
    n = len(s)
    vals = []
    while idx < n:
        # Skip whitespace
        while idx < n and s[idx].isspace():
            idx += 1
        if idx >= n:
            break
        
        # Check token type
        if s[idx] == "'":
            # Single quoted string
            idx += 1
            val_chars = []
            while idx < n:
                if s[idx] == "'" and idx + 1 < n and s[idx+1] == "'":
                    val_chars.append("'")
                    idx += 2
                elif s[idx] == "'":
                    idx += 1
                    break
                else:
                    val_chars.append(s[idx])
                    idx += 1
            vals.append("".join(val_chars))
        elif s[idx:idx+2] == "$$":
            # Dollar quoted string
            idx += 2
            val_chars = []
            while idx < n:
                if s[idx:idx+2] == "$$":
                    idx += 2
                    break
                else:
                    val_chars.append(s[idx])
                    idx += 1
            vals.append("".join(val_chars))
        elif s[idx:idx+6].upper() == "ARRAY[":
            # Postgres array like ARRAY['a', 'b']
            idx += 6
            bracket_count = 1
            start = idx
            while idx < n:
                if s[idx] == '[':
                    bracket_count += 1
                elif s[idx] == ']':
                    bracket_count -= 1
                    if bracket_count == 0:
                        break
                idx += 1
            arr_content = s[start:idx]
            idx += 1 # past ']'
            vals.append(f"ARRAY[{arr_content}]")
        else:
            # Number, NULL, boolean, or json cast
            start = idx
            while idx < n and s[idx] not in (',', ')'):
                idx += 1
            val_str = s[start:idx].strip()
            # clean json cast e.g. ::jsonb
            if "::jsonb" in val_str:
                val_str = val_str.replace("::jsonb", "")
            if "::TEXT[]" in val_str:
                val_str = val_str.replace("::TEXT[]", "")
            vals.append(val_str)
            
        # Skip to next comma
        while idx < n and s[idx] != ',':
            idx += 1
        if idx < n and s[idx] == ',':
            idx += 1
            
    return vals

def clean_value(val):
    if not isinstance(val, str):
        return val
    
    # Check for Postgres arrays
    if val.startswith("ARRAY[") and val.endswith("]"):
        inner = val[6:-1]
        if not inner.strip():
            return []
        items = re.findall(r"'([^']*)'", inner)
        return items
    
    # Parse JSON if it looks like one (and is a valid dict or list)
    if (val.startswith('{') and val.endswith('}')) or (val.startswith('[') and val.endswith(']')):
        try:
            parsed = json.loads(val)
            if isinstance(parsed, (dict, list)):
                return parsed
        except Exception:
            pass

    # Check for PG-style string array e.g. '{"a","b"}'
    if val.startswith('{') and val.endswith('}'):
        if val == '{}':
            return []
        items = re.findall(r'"((?:[^"\\]|\\.)*)"', val)
        if items:
            return [item.replace('\\"', '"') for item in items]
        
        # Fallback for unquoted comma-separated elements
        inner = val[1:-1].strip()
        if inner:
            return [x.strip() for x in inner.split(',') if x.strip()]
        return []
            
    # Number conversion
    if val.isdigit():
        return int(val)
    try:
        return float(val)
    except ValueError:
        pass
        
    if val.lower() == 'true':
        return 1
    if val.lower() == 'false':
        return 0
    if val.lower() == 'null':
        return None
        
    return val

def parse_sql_file(file_path, table_name):
    print(f"Lendo {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Find all INSERT statements
    # Pattern: INSERT INTO table_name (cols) VALUES (vals)
    # Using regex to find the starts
    pattern = rf"INSERT\s+INTO\s+{table_name}\s*\((.*?)\)\s*VALUES\s*\("
    matches = list(re.finditer(pattern, content, re.IGNORECASE | re.DOTALL))
    
    records = []
    for i, match in enumerate(matches):
        cols_str = match.group(1)
        columns = [c.strip() for c in cols_str.split(',')]
        
        # Locate the end of the VALUES block
        start_vals = match.end()
        # Find the matching closing parenthesis for VALUES
        # Since VALUES can contain nested parens (e.g. inside JSON/arrays), we scan count parens
        paren_count = 1
        idx = start_vals
        n = len(content)
        while idx < n:
            if content[idx] == '(':
                paren_count += 1
            elif content[idx] == ')':
                paren_count -= 1
                if paren_count == 0:
                    break
            idx += 1
            
        vals_str = content[start_vals:idx]
        raw_values = scan_values(vals_str)
        
        if len(columns) != len(raw_values):
            print(f"Warning: Columns count ({len(columns)}) != Values count ({len(raw_values)}) in insert {i}!")
            print(f"Columns: {columns}")
            print(f"Raw Values: {raw_values}")
            
        record = {}
        for col, val in zip(columns, raw_values):
            cleaned = clean_value(val)
            record[col] = cleaned
            
        records.append(record)
        
    print(f"Mapeados {len(records)} registros para a tabela '{table_name}'.")
    return records

def compile_all():
    base_dir = r"c:\Users\user\Documents\Projetos Antigravity\Hypotros\hypertropos"
    supabase_mig_dir = os.path.join(base_dir, "supabase", "migrations")
    seeds_out_dir = os.path.join(base_dir, "db", "seeds")
    os.makedirs(seeds_out_dir, exist_ok=True)
    
    # 1. Parse Referencias
    ref_file = os.path.join(supabase_mig_dir, "20260520000003_seed_referencias.sql")
    referencias = parse_sql_file(ref_file, "referencias_cientificas")
    
    # 2. Parse Exercicios
    exe_file = os.path.join(supabase_mig_dir, "20260520000002_seed_exercicios.sql")
    exercicios = parse_sql_file(exe_file, "exercicios")
    
    # 3. Parse Links (Junction)
    link_file = os.path.join(supabase_mig_dir, "20260520000004_link_exercicios_referencias.sql")
    print(f"Lendo {link_file}...")
    with open(link_file, 'r', encoding='utf-8') as f:
        link_content = f.read()
    
    # Find all ('ex_id', 'ref_id') links
    links = re.findall(r"\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)", link_content)
    print(f"Mapeados {len(links)} links entre exercícios e referências.")
    
    # Group links by exercise ID
    exe_links = {}
    for exe_id, ref_id in links:
        if exe_id not in exe_links:
            exe_links[exe_id] = []
        exe_links[exe_id].append(ref_id)
        
    # Inject links into exercises
    for exe in exercicios:
        exe_id = exe.get('id')
        exe['referencias'] = exe_links.get(exe_id, [])
        
    # 4. Parse Suplementos
    suple_file = os.path.join(supabase_mig_dir, "20260520000005_seed_suplementos.sql")
    suplementos = parse_sql_file(suple_file, "suplementos")
    
    # 5. Parse Artigos
    art_file = os.path.join(supabase_mig_dir, "20260523000002_artigos_cientificos.sql")
    artigos = parse_sql_file(art_file, "artigos_cientificos")
    
    # Write JSON files
    with open(os.path.join(seeds_out_dir, "referencias.json"), 'w', encoding='utf-8') as f:
        json.dump(referencias, f, indent=2, ensure_ascii=False)
        
    with open(os.path.join(seeds_out_dir, "exercicios.json"), 'w', encoding='utf-8') as f:
        json.dump(exercicios, f, indent=2, ensure_ascii=False)
        
    with open(os.path.join(seeds_out_dir, "suplementos.json"), 'w', encoding='utf-8') as f:
        json.dump(suplementos, f, indent=2, ensure_ascii=False)
        
    with open(os.path.join(seeds_out_dir, "artigos.json"), 'w', encoding='utf-8') as f:
        json.dump(artigos, f, indent=2, ensure_ascii=False)
        
    print("Arquivos JSON gerados com sucesso na pasta db/seeds/!")

if __name__ == "__main__":
    compile_all()
