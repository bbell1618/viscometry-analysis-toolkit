import { RheologyPoint, ModelParams, AnalysisResult } from '../types';

/**
 * Generates synthetic rheology data using the Carreau-Yasuda model approximation.
 * eta = eta_inf + (eta_0 - eta_inf) * [1 + (lambda * gamma_dot)^2] ^ ((n-1)/2)
 */
export const generateFlowCurve = (params: ModelParams, points: number = 50): RheologyPoint[] => {
  const data: RheologyPoint[] = [];
  const minShear = 0.1;
  const maxShear = 1000;

  // Logarithmic spacing for shear rates
  for (let i = 0; i < points; i++) {
    const logShear = Math.log10(minShear) + (i / (points - 1)) * (Math.log10(maxShear) - Math.log10(minShear));
    const shearRate = Math.pow(10, logShear);

    // Carreau Model calculation
    const baseTerm = 1 + Math.pow(params.relaxationTime * shearRate, 2);
    const exponent = (params.powerIndex - 1) / 2;
    const viscosity = params.infiniteShearViscosity + 
      (params.zeroShearViscosity - params.infiniteShearViscosity) * Math.pow(baseTerm, exponent);
    
    // Add some synthetic noise
    const noise = (Math.random() - 0.5) * (viscosity * 0.02); // 2% noise
    const finalViscosity = Math.max(0.1, viscosity + noise);

    data.push({
      shearRate,
      viscosity: finalViscosity,
      shearStress: shearRate * finalViscosity / 1000 // Convert cP to Pa s for stress if needed, rough calc
    });
  }

  return data;
};

/**
 * Performs basic analysis to estimate cluster indicators.
 * In this toy model, "Cluster Length Scale" is proportional to the Relaxation Time (lambda)
 * and the degree of shear thinning (1-n).
 */
export const analyzeSample = (params: ModelParams, data: RheologyPoint[]): AnalysisResult => {
  // Calculate Flow Behavior Index (n) from the high-shear region slope in log-log
  // Slope approx = (log(eta2) - log(eta1)) / (log(gamma2) - log(gamma1))
  // For power law: log(eta) = (n-1)log(gamma) + K
  // So slope = n - 1.
  
  // We'll take the slope of the last 20% of data points (high shear)
  const highShearData = data.slice(Math.floor(data.length * 0.8));
  let sumSlope = 0;
  for (let i = 1; i < highShearData.length; i++) {
    const p1 = highShearData[i-1];
    const p2 = highShearData[i];
    const dLogEta = Math.log10(p2.viscosity) - Math.log10(p1.viscosity);
    const dLogGamma = Math.log10(p2.shearRate) - Math.log10(p1.shearRate);
    sumSlope += dLogEta / dLogGamma;
  }
  const avgSlope = sumSlope / (highShearData.length - 1);
  const flowBehaviorIndex = 1 + avgSlope; // n

  // Toy Metric: Cluster Length Scale
  // Higher relaxation time + More shear thinning = Larger clusters
  const clusterLengthScale = (params.relaxationTime * 10) + (1 - flowBehaviorIndex) * 50;

  return {
    sampleId: params.id,
    clusterLengthScale: Math.max(0, clusterLengthScale), // arbitrary units (nm simulated)
    flowBehaviorIndex,
    isNewtonian: Math.abs(flowBehaviorIndex - 1) < 0.05
  };
};

export const DEFAULT_SAMPLES: ModelParams[] = [
  {
    id: 'sample-a',
    name: 'Sample A (Buffer)',
    zeroShearViscosity: 1.2,
    infiniteShearViscosity: 1.0,
    relaxationTime: 0.01,
    powerIndex: 0.98,
    color: '#94a3b8' // slate-400
  },
  {
    id: 'sample-b',
    name: 'Sample B (mAb 50mg/mL)',
    zeroShearViscosity: 8.5,
    infiniteShearViscosity: 4.0,
    relaxationTime: 0.5,
    powerIndex: 0.85,
    color: '#3b82f6' // blue-500
  },
  {
    id: 'sample-c',
    name: 'Sample C (mAb 150mg/mL + Clusters)',
    zeroShearViscosity: 45.0,
    infiniteShearViscosity: 12.0,
    relaxationTime: 2.5,
    powerIndex: 0.6,
    color: '#ef4444' // red-500
  }
];