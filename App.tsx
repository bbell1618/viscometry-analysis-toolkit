import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULT_SAMPLES, generateFlowCurve, analyzeSample } from './services/rheologyService';
import { ModelParams, AnalysisResult, TabView } from './types';
import { FlowCurveChart } from './components/FlowCurveChart';
import { LogLogChart } from './components/LogLogChart';
import { AIReport } from './components/AIReport';

function App() {
  const [samples, setSamples] = useState<ModelParams[]>(DEFAULT_SAMPLES);
  const [activeTab, setActiveTab] = useState<TabView>(TabView.DASHBOARD);
  
  // Computed Data for Charts
  const chartData = useMemo(() => {
    // We need to merge all sample curves into a single array of objects for Recharts
    // { shearRate: 0.1, 'sample-a': 1.2, 'sample-b': 8.5 ... }
    const allCurves = samples.map(s => ({
      id: s.id,
      data: generateFlowCurve(s)
    }));
    
    // Assume all curves have same shear rates for simplicity
    if (allCurves.length === 0) return [];

    return allCurves[0].data.map((point, index) => {
      const mergedPoint: any = { shearRate: point.shearRate };
      allCurves.forEach(curve => {
        mergedPoint[curve.id] = curve.data[index].viscosity;
      });
      return mergedPoint;
    });
  }, [samples]);

  // Computed Analysis Results
  const analysisResults: AnalysisResult[] = useMemo(() => {
    return samples.map(s => analyzeSample(s, generateFlowCurve(s)));
  }, [samples]);

  const updateSampleParam = (id: string, field: keyof ModelParams, value: number) => {
    setSamples(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm">
              <i className="fa-solid fa-flask"></i>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Viscometry Analysis <span className="text-indigo-600">Toolkit</span>
            </h1>
          </div>
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab(TabView.DASHBOARD)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === TabView.DASHBOARD ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab(TabView.PYTHON_GUIDE)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === TabView.PYTHON_GUIDE ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Python Implementation
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === TabView.DASHBOARD ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Controls & Analysis */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Sample Controls */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="font-semibold text-slate-700">Sample Configuration</h2>
                  <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">Synthetic Data</span>
                </div>
                <div className="p-4 space-y-6">
                  {samples.map(sample => (
                    <div key={sample.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: sample.color }}></span>
                        <h3 className="font-medium text-slate-900">{sample.name}</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Zero Shear Viscosity (η₀)</span>
                            <span className="font-mono text-slate-700">{sample.zeroShearViscosity} cP</span>
                          </label>
                          <input 
                            type="range" min="1" max="100" step="1"
                            value={sample.zeroShearViscosity}
                            onChange={(e) => updateSampleParam(sample.id, 'zeroShearViscosity', parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                        <div>
                          <label className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Relaxation Time (λ) - Cluster Proxy</span>
                            <span className="font-mono text-slate-700">{sample.relaxationTime} s</span>
                          </label>
                          <input 
                            type="range" min="0.01" max="5.0" step="0.01"
                            value={sample.relaxationTime}
                            onChange={(e) => updateSampleParam(sample.id, 'relaxationTime', parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis Results Card */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                 <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <h2 className="font-semibold text-slate-700">Calculated Metrics</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {analysisResults.map(res => (
                    <div key={res.sampleId} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: samples.find(s => s.id === res.sampleId)?.color }}></span>
                        <span className="text-sm font-medium text-slate-700">{res.sampleId.split('-')[1].toUpperCase()}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Flow Index (n)</div>
                        <div className={`font-mono font-bold ${res.flowBehaviorIndex < 0.9 ? 'text-amber-600' : 'text-green-600'}`}>
                          {res.flowBehaviorIndex.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Cluster Scale</div>
                        <div className="font-mono text-slate-700">{res.clusterLengthScale.toFixed(1)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col: Visualization */}
            <div className="lg:col-span-8 space-y-6">
              <LogLogChart data={chartData} sampleKeys={samples} />
              <FlowCurveChart data={chartData} sampleKeys={samples} />
              
              <AIReport analysisResults={analysisResults} />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Python Toolkit Structure</h2>
            <p className="text-slate-600 mb-8">
              This web application is a TypeScript implementation of the requested Python `viscometry-analysis-toolkit`. 
              Below is the structure of the Python package as originally designed.
            </p>

            <div className="grid gap-6">
              <div className="bg-slate-900 rounded-lg p-6 text-slate-200 font-mono text-sm overflow-x-auto">
                <div className="mb-2 text-slate-400"># Project Structure</div>
                <pre>{`viscometry-analysis-toolkit/
  ├── README.md
  ├── requirements.txt
  ├── data/
  │   └── example_viscosity_data.csv
  ├── notebooks/
  │   ├── 01_explore_shear_rate_vs_viscosity.ipynb
  │   └── 02_cluster_length_scale_demo.ipynb
  ├── src/
  │   └── visco_tools/
  │       ├── __init__.py
  │       ├── io.py
  │       ├── plotting.py
  │       └── analysis.py
  └── tests/
      └── test_analysis.py`}</pre>
              </div>

              <div className="space-y-4">
                 <h3 className="text-lg font-semibold text-slate-800">Key Python Implementations</h3>
                 
                 <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                    <div className="text-xs font-bold text-slate-500 mb-2 uppercase">src/visco_tools/analysis.py</div>
                    <code className="block whitespace-pre text-xs text-slate-800 overflow-x-auto font-mono">
{`import numpy as np
import pandas as pd

def calculate_flow_behavior_index(shear_rate, viscosity):
    """
    Calculates power law index (n) from the slope of log-log plot.
    n < 1 indicates shear thinning.
    """
    log_shear = np.log10(shear_rate)
    log_visc = np.log10(viscosity)
    slope, _ = np.polyfit(log_shear, log_visc, 1)
    return 1 + slope

def estimate_cluster_scale(n, relaxation_time):
    """
    Toy metric for cluster size based on shear thinning degree.
    """
    return relaxation_time * 10 + (1 - n) * 50`}
                    </code>
                 </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;