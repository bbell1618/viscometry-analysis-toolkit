export interface RheologyPoint {
  shearRate: number; // s^-1
  viscosity: number; // cP or mPa.s
  shearStress: number; // Pa
}

export interface ModelParams {
  id: string;
  name: string;
  zeroShearViscosity: number; // eta_0
  infiniteShearViscosity: number; // eta_inf
  relaxationTime: number; // lambda (correlated with cluster size)
  powerIndex: number; // n (shear thinning index)
  color: string;
}

export interface AnalysisResult {
  sampleId: string;
  clusterLengthScale: number; // Synthetic metric
  flowBehaviorIndex: number; // Slope of log-log
  isNewtonian: boolean;
}

export enum TabView {
  DASHBOARD = 'DASHBOARD',
  PYTHON_GUIDE = 'PYTHON_GUIDE'
}