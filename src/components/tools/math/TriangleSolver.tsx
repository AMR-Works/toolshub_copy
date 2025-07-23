import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Triangle, ArrowRight } from 'lucide-react';

const TriangleSolver: React.FC = () => {
  const [sideA, setSideA] = useState<string>('');
  const [sideB, setSideB] = useState<string>('');
  const [sideC, setSideC] = useState<string>('');
  const [angleA, setAngleA] = useState<string>('');
  const [angleB, setAngleB] = useState<string>('');
  const [angleC, setAngleC] = useState<string>('');
  const [solution, setSolution] = useState<string | null>(null);

  const toRadians = (angle: number) => angle * (Math.PI / 180);
  const toDegrees = (angle: number) => angle * (180 / Math.PI);

  const solveTriangle = () => {
    let a = parseFloat(sideA);
    let b = parseFloat(sideB);
    let c = parseFloat(sideC);
    let A = parseFloat(angleA);
    let B = parseFloat(angleB);
    let C = parseFloat(angleC);

    let knownSides = [a, b, c].filter(val => !isNaN(val) && val > 0).length;
    let knownAngles = [A, B, C].filter(val => !isNaN(val) && val > 0).length;

    // Convert angles to radians if they are known
    if (!isNaN(A)) A = toRadians(A);
    if (!isNaN(B)) B = toRadians(B);
    if (!isNaN(C)) C = toRadians(C);

    try {
      // Case 1: SSS (Side-Side-Side)
      if (knownSides === 3 && knownAngles === 0) {
        if (a + b <= c || a + c <= b || b + c <= a) {
          throw new Error('Invalid triangle sides');
        }
        A = Math.acos((b * b + c * c - a * a) / (2 * b * c));
        B = Math.acos((a * a + c * c - b * b) / (2 * a * c));
        C = Math.acos((a * a + b * b - c * c) / (2 * a * b));
      }
      // Case 2: SAS (Side-Angle-Side)
      else if (knownSides === 2 && knownAngles === 1) {
        if (!isNaN(a) && !isNaN(b) && !isNaN(C)) {
          c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C));
          A = Math.acos((b * b + c * c - a * a) / (2 * b * c));
          B = Math.acos((a * a + c * c - b * b) / (2 * a * c));
        } else if (!isNaN(a) && !isNaN(c) && !isNaN(B)) {
          b = Math.sqrt(a * a + c * c - 2 * a * c * Math.cos(B));
          A = Math.acos((b * b + c * c - a * a) / (2 * b * c));
          C = Math.acos((a * a + b * b - c * c) / (2 * a * b));
        } else if (!isNaN(b) && !isNaN(c) && !isNaN(A)) {
          a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(A));
          B = Math.acos((a * a + c * c - b * b) / (2 * a * c));
          C = Math.acos((a * a + b * b - c * c) / (2 * a * b));
        } else {
          throw new Error('Insufficient data for SAS');
        }
      }
      // Case 3: ASA (Angle-Side-Angle) or AAS (Angle-Angle-Side)
      else if (knownSides === 1 && knownAngles === 2) {
        let knownSide: number | undefined;
        let knownSideName: string = '';
        if (!isNaN(a)) { knownSide = a; knownSideName = 'a'; }
        else if (!isNaN(b)) { knownSide = b; knownSideName = 'b'; }
        else if (!isNaN(c)) { knownSide = c; knownSideName = 'c'; }

        let knownAngle1: number | undefined;
        let knownAngle2: number | undefined;
        let unknownAngleName: string = '';

        if (!isNaN(A) && !isNaN(B)) { knownAngle1 = A; knownAngle2 = B; unknownAngleName = 'C'; C = Math.PI - A - B; }
        else if (!isNaN(A) && !isNaN(C)) { knownAngle1 = A; knownAngle2 = C; unknownAngleName = 'B'; B = Math.PI - A - C; }
        else if (!isNaN(B) && !isNaN(C)) { knownAngle1 = B; knownAngle2 = C; unknownAngleName = 'A'; A = Math.PI - B - C; }
        else { throw new Error('Insufficient data for ASA/AAS'); }

        if (A + B + C > Math.PI + 0.0001) { // Add a small tolerance for floating point errors
          throw new Error('Angles sum to more than 180 degrees');
        }

        if (knownSideName === 'a') {
          b = (a / Math.sin(A)) * Math.sin(B);
          c = (a / Math.sin(A)) * Math.sin(C);
        } else if (knownSideName === 'b') {
          a = (b / Math.sin(B)) * Math.sin(A);
          c = (b / Math.sin(B)) * Math.sin(C);
        } else if (knownSideName === 'c') {
          a = (c / Math.sin(C)) * Math.sin(A);
          b = (c / Math.sin(C)) * Math.sin(B);
        }
      }
      // Case 4: SSA (Side-Side-Angle) - Ambiguous case, handle with care
      else if (knownSides === 2 && knownAngles === 1) {
        // This is a simplified handling, a full SSA solution is complex
        // For simplicity, we'll assume a unique solution if possible
        // Example: a, b, A known
        if (!isNaN(a) && !isNaN(b) && !isNaN(A)) {
          const sinB = (b * Math.sin(A)) / a;
          if (sinB > 1) throw new Error('No solution (SSA)');
          B = Math.asin(sinB);
          C = Math.PI - A - B;
          c = (a * Math.sin(C)) / Math.sin(A);
        } else if (!isNaN(a) && !isNaN(c) && !isNaN(C)) {
          const sinA = (a * Math.sin(C)) / c;
          if (sinA > 1) throw new Error('No solution (SSA)');
          A = Math.asin(sinA);
          B = Math.PI - A - C;
          b = (c * Math.sin(B)) / Math.sin(C);
        } else if (!isNaN(b) && !isNaN(c) && !isNaN(B)) {
          const sinC = (c * Math.sin(B)) / b;
          if (sinC > 1) throw new Error('No solution (SSA)');
          C = Math.asin(sinC);
          A = Math.PI - B - C;
          a = (b * Math.sin(A)) / Math.sin(B);
        } else {
          throw new Error('Insufficient data for SSA');
        }
      }
      else {
        throw new Error('Please provide 3 valid values (sides/angles) to solve the triangle.');
      }

      setSolution(
        `Side a: ${a.toFixed(2)}, Side b: ${b.toFixed(2)}, Side c: ${c.toFixed(2)}\n` +
        `Angle A: ${toDegrees(A).toFixed(2)}°, Angle B: ${toDegrees(B).toFixed(2)}°, Angle C: ${toDegrees(C).toFixed(2)}°`
      );
    } catch (error: any) {
      setSolution(`Error: ${error.message}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md"
    >
      <div className="flex items-center mb-4">
        <Triangle className="w-6 h-6 text-red-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Triangle Solver</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="sideA" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Side a
          </label>
          <input
            type="number"
            id="sideA"
            value={sideA}
            onChange={(e) => setSideA(e.target.value)}
            placeholder="Enter side a"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="sideB" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Side b
          </label>
          <input
            type="number"
            id="sideB"
            value={sideB}
            onChange={(e) => setSideB(e.target.value)}
            placeholder="Enter side b"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="sideC" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Side c
          </label>
          <input
            type="number"
            id="sideC"
            value={sideC}
            onChange={(e) => setSideC(e.target.value)}
            placeholder="Enter side c"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="angleA" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Angle A (degrees)
          </label>
          <input
            type="number"
            id="angleA"
            value={angleA}
            onChange={(e) => setAngleA(e.target.value)}
            placeholder="Enter angle A"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="angleB" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Angle B (degrees)
          </label>
          <input
            type="number"
            id="angleB"
            value={angleB}
            onChange={(e) => setAngleB(e.target.value)}
            placeholder="Enter angle B"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="angleC" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
            Angle C (degrees)
          </label>
          <input
            type="number"
            id="angleC"
            value={angleC}
            onChange={(e) => setAngleC(e.target.value)}
            placeholder="Enter angle C"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <button
          onClick={solveTriangle}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
        >
          Solve Triangle
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {solution && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 p-4 bg-red-50 dark:bg-red-900 rounded-md whitespace-pre-wrap"
        >
          <p className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            Solution:
          </p>
          <p className="text-md text-gray-700 dark:text-gray-200">
            {solution}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TriangleSolver;