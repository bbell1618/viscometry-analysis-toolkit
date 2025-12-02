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

interface LogLogChartProps {
  data: { [key: string]: number }[];
  sampleKeys: { id: string; color: string; name: string }[];
}

export const LogLogChart: React.FC<LogLogChartProps> = ({ data, sampleKeys }) => {
  return (
    <div className="w-full h-80 bg-white rounded-lg p-4 shadow-sm border border-slate-200">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Log-Log Viscosity Plot</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="shearRate" 
            type="number" 
            scale="log"
            domain={['dataMin', 'dataMax']} 
            tickFormatter={(val) => val.toExponential(0)}
            allowDataOverflow
          >
            <Label value="Shear Rate (1/s) [Log]" offset={0} position="bottom" style={{ fontSize: '12px', fill: '#64748b' }} />
          </XAxis>
          <YAxis 
            scale="log" 
            domain={['auto', 'auto']}
            tickFormatter={(val) => val.toFixed(1)}
            label={{ value: 'Viscosity (cP) [Log]', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#64748b' } }} 
          />
          <Tooltip 
            formatter={(value: number) => value.toFixed(2)}
            labelFormatter={(label) => `Shear Rate: ${Number(label).toFixed(1)}`}
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
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};