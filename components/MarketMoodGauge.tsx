'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MarketMoodGaugeProps {
  value: number; // 0-100
  size?: number;
}

export default function MarketMoodGauge({ value, size = 400 }: MarketMoodGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  // Calculate needle rotation (-90 to 90 degrees for 0-100 value)
  // At value 0: needle points left (-180 degrees from positive x-axis = -90 from top)
  // At value 100: needle points right (0 degrees from positive x-axis = 90 from top)
  const needleAngle = -180 + (animatedValue / 100) * 180;

  // Determine zone and color based on value
  const getZoneInfo = (val: number) => {
    if (val <= 25) return { zone: 'Extreme Fear', textColor: 'text-red-500' };
    if (val <= 50) return { zone: 'Fear', textColor: 'text-orange-500' };
    if (val <= 75) return { zone: 'Greed', textColor: 'text-orange-500' };
    return { zone: 'Extreme Greed', textColor: 'text-green-500' };
  };

  const { textColor } = getZoneInfo(value);

  // SVG dimensions with padding for labels
  const padding = size * 0.18;
  const svgWidth = size + padding * 2;
  const svgHeight = size * 0.8;

  const centerX = svgWidth / 2;
  const centerY = size * 0.5;
  const radius = size * 0.32;
  const arcWidth = size * 0.055;

  // Create arc path
  const createArc = (startAngle: number, endAngle: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  // Zone angles (from left to right: -180 to 0 degrees)
  const zones = [
    { startAngle: -180, endAngle: -135, color: '#ef4444' }, // Extreme Fear - Red
    { startAngle: -135, endAngle: -90, color: '#f97316' },  // Fear - Orange
    { startAngle: -90, endAngle: -45, color: '#fb923c' },   // Greed - Light Orange
    { startAngle: -45, endAngle: 0, color: '#22c55e' },     // Extreme Greed - Green
  ];

  // Rotated labels that follow the arc
  const labels = [
    { angle: -157.5, text: 'EXTREME FEAR', rotation: -157.5 + 90 }, // Vertical on left
    { angle: -112.5, text: 'FEAR', rotation: -112.5 + 90 },
    { angle: -67.5, text: 'GREED', rotation: -67.5 + 90 },
    { angle: -22.5, text: 'EXTREME GREED', rotation: -22.5 + 90 },  // Vertical on right
  ];

  // Calculate needle end point
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleLength = radius - 15;
  const needleEndX = centerX + needleLength * Math.cos(needleRad);
  const needleEndY = centerY + needleLength * Math.sin(needleRad);

  // Calculate tail end point (opposite direction)
  const tailLength = 60;
  const tailEndX = centerX - tailLength * Math.cos(needleRad);
  const tailEndY = centerY - tailLength * Math.sin(needleRad);

  return (
    <div className="relative" style={{ width: svgWidth, height: svgHeight }}>
      <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        {/* Outer dashed circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius + arcWidth / 2 + 25}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Zone arcs */}
        {zones.map((zoneData, index) => (
          <path
            key={index}
            d={createArc(zoneData.startAngle, zoneData.endAngle)}
            fill="none"
            stroke={zoneData.color}
            strokeWidth={arcWidth}
            strokeLinecap="round"
          />
        ))}

        {/* Rotated labels following the arc */}
        {labels.map((label, index) => {
          const rad = (label.angle * Math.PI) / 180;
          const labelRadius = radius + arcWidth / 2 + 50;
          const x = centerX + labelRadius * Math.cos(rad);
          const y = centerY + labelRadius * Math.sin(rad);

          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${label.rotation}, ${x}, ${y})`}
              className="fill-muted-foreground"
              style={{
                fontSize: size * 0.022,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              {label.text}
            </text>
          );
        })}

        {/* Tick marks */}
        {Array.from({ length: 41 }).map((_, i) => {
          const angle = -180 + (i * 180) / 40;
          const rad = (angle * Math.PI) / 180;
          const isMajor = i % 10 === 0;
          const isMinor = i % 5 === 0 && !isMajor;
          const innerRadius = radius - arcWidth / 2 - 3;
          const outerRadius = innerRadius - (isMajor ? 12 : isMinor ? 8 : 5);

          const x1 = centerX + innerRadius * Math.cos(rad);
          const y1 = centerY + innerRadius * Math.sin(rad);
          const x2 = centerX + outerRadius * Math.cos(rad);
          const y2 = centerY + outerRadius * Math.sin(rad);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#d1d5db"
              strokeWidth={isMajor ? 2 : 1}
            />
          );
        })}

        {/* Needle with tail */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.line
            x1={tailEndX}
            y1={tailEndY}
            x2={needleEndX}
            y2={needleEndY}
            stroke="#f97316"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{
              x1: centerX - tailLength * Math.cos((-180 * Math.PI) / 180),
              y1: centerY - tailLength * Math.sin((-180 * Math.PI) / 180),
              x2: centerX + needleLength * Math.cos((-180 * Math.PI) / 180),
              y2: centerY + needleLength * Math.sin((-180 * Math.PI) / 180)
            }}
            animate={{
              x1: tailEndX,
              y1: tailEndY,
              x2: needleEndX,
              y2: needleEndY
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {/* Needle tip circle */}
          <motion.circle
            r="7"
            fill="#f97316"
            initial={{
              cx: centerX + needleLength * Math.cos((-180 * Math.PI) / 180),
              cy: centerY + needleLength * Math.sin((-180 * Math.PI) / 180)
            }}
            animate={{
              cx: needleEndX,
              cy: needleEndY
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </motion.g>

        {/* Center dot */}
        <circle
          cx={centerX}
          cy={centerY}
          r="4"
          fill="#f97316"
        />
      </svg>

      {/* Value display */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-center"
        style={{ bottom: size * 0.08 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className={`text-5xl font-display font-bold ${textColor}`}>
            {value.toFixed(2)}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
