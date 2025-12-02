# Viscometry Analysis Toolkit

Small Python toolkit and set of Jupyter notebooks for exploring **shear-rate-dependent viscosity** data using synthetic datasets.  
The goal is to demonstrate how you might analyze flow curves, compute basic metrics, and experiment with simple “cluster length-scale” indicators inspired by protein–protein interaction / cluster formation work in biotherapeutic formulations.

> **Note:** All data in this repo is synthetic and is provided for demonstration and educational purposes only.

---

## Features

- Load and clean viscosity vs shear-rate data from CSV.
- Plot flow curves and log–log representations (viscosity vs shear rate).
- Compute basic metrics such as:
  - apparent viscosity at user-selected shear rates,
  - a toy “cluster length-scale” indicator based on slope/curvature of log(viscosity) vs log(shear-rate).
- Example Jupyter notebooks that walk through:
  - basic data exploration,
  - computing and visualizing the toy cluster metric.

---

## Repository structure

```text
viscometry-analysis-toolkit/
  README.md
  requirements.txt
  data/
    example_viscosity_data.csv
  notebooks/
    01_explore_shear_rate_vs_viscosity.ipynb
    02_cluster_length_scale_demo.ipynb
  src/
    visco_tools/
      __init__.py
      io.py          # load/save CSV data
      plotting.py    # common plotting helpers
      analysis.py    # basic metrics and cluster indicator
  tests/
    test_analysis.py # simple tests on synthetic data
Tech stack

Python 3.10+

numpy, pandas

matplotlib, seaborn

scipy (for simple curve metrics)

pytest (for lightweight tests)

Jupyter (for notebooks)

Getting started
1. Clone the repo
git clone https://github.com/bbell1618/viscometry-analysis-toolkit.git
cd viscometry-analysis-toolkit

2. Create and activate a virtual environment (optional but recommended)
python -m venv .venv
source .venv/bin/activate      # Linux/macOS
# or
.\.venv\Scripts\activate       # Windows

3. Install dependencies
pip install -r requirements.txt

4. Run the notebooks
jupyter lab      # or jupyter notebook


Open the notebooks in the notebooks/ folder:

01_explore_shear_rate_vs_viscosity.ipynb

02_cluster_length_scale_demo.ipynb

Usage overview

Typical workflow:

Load data from data/example_viscosity_data.csv using visco_tools.io.

Use visco_tools.plotting to visualize viscosity vs shear-rate and log–log plots.

Call functions in visco_tools.analysis to compute:

apparent viscosity at specific shear rates,

simple cluster metrics.

Explore and tweak analysis logic in the notebooks.

Disclaimer

This repository is a toy example meant to demonstrate analysis patterns and code structure for shear-rate-dependent viscosity data. The cluster metrics implemented here are simplified and should not be interpreted as production-grade PPI/cluster analysis tools.
