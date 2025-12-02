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
