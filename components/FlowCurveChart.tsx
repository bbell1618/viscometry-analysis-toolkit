import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from 'recharts';
import { RheologyPoint } from '../types';

interface FlowCurveChartProps {
  data: { [key: string]: number }[];
  sampleKeys: { id: string; color: string; name: string }[];
}

export const FlowCurveChart: React.FC<FlowCurveChartProps> = ({ data, sampleKeys }) => {
  return (
    <div className="w-full h-80 bg-white rounded-lg p-4 shadow-sm border border-slate-200">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Flow Curve (Linear Scale)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="shearRate" 
            type="number" 
            domain={['dataMin', 'dataMax']} 
            tickFormatter={(val) => val.toFixed(0)}
          >
            <Label value="Shear Rate (1/s)" offset={0} position="bottom" style={{ fontSize: '12px', fill: '#64748b' }} />
          </XAxis>
          <YAxis label={{ value: 'Viscosity (cP)', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#64748b' } }} />
          <Tooltip 
            formatter={(value: number) => value.toFixed(2)}
            labelFormatter={(label) => `Shear Rate: ${Number(label).toFixed(1)} s⁻¹`}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {sampleKeys.map((sample) => (
            <Line
              key={sample.id}
              type="monotone"
              dataKey={sample.id}
              name={sample.name}
              stroke={sample.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};