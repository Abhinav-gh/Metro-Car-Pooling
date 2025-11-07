import csv
import random
import string
import numpy as np
from tqdm import tqdm

# ==============================
# CONFIGURABLE PARAMETERS
# ==============================

k = 100   # Number of points per letter (e.g., A1...A100)
m = 20    # Maximum distance value (randomly from 1..m)
output_file = "distances.csv"  # Output CSV file name
random_seed = 42               # For reproducibility
# ==============================

random.seed(random_seed)
np.random.seed(random_seed)

# Generate node list like A1...Ak, B1...Bk, ..., Z1...Zk
letters = list(string.ascii_uppercase)  # ['A', 'B', ..., 'Z']
nodes = [f"{L}{i}" for L in letters for i in range(1, k + 1)]

N = len(nodes)
print(f"Generating {N} nodes → total {N*N:,} pairs")

# Write the CSV
with open(output_file, mode="w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["source", "destination", "distance"])

    for src in tqdm(nodes, desc="Writing rows"):
        # Generate random distances for all destinations in vectorized form
        dists = np.random.randint(1, m + 1, size=N)
        rows = [(src, dst, int(dist)) for dst, dist in zip(nodes, dists)]
        writer.writerows(rows)

print(f"✅ CSV file '{output_file}' created successfully with {N*N:,} rows.")