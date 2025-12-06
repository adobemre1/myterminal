
import React, { useState, useEffect } from 'react';

export const BinaryLab: React.FC = () => {
    // 8-bit state
    const [bits, setBits] = useState<boolean[]>([false, false, false, false, false, false, false, false]);
    
    // Toggle a specific bit
    const toggleBit = (index: number) => {
        const newBits = [...bits];
        newBits[index] = !newBits[index];
        setBits(newBits);
    };

    // Calculate Values
    const binaryString = bits.map(b => (b ? '1' : '0')).join('');
    const decimalValue = parseInt(binaryString, 2);
    const hexValue = decimalValue.toString(16).toUpperCase().padStart(2, '0');
    const asciiChar = decimalValue >= 32 && decimalValue <= 126 ? String.fromCharCode(decimalValue) : '•';

    return (
        <div className="flex flex-col h-full bg-[#0d1117] text-white p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full">
                
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                        <span className="text-green-500 font-mono">010101</span> Binary Laboratory
                    </h1>
                    <p className="text-gray-400">Interactive visualization of how computers store data. Click bits to change values.</p>
                </div>

                {/* THE BYTE VISUALIZER */}
                <div className="bg-[#161b22] border border-gray-800 rounded-xl p-8 mb-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
                    
                    {/* Bits Row */}
                    <div className="flex justify-center gap-2 md:gap-4 mb-8">
                        {bits.map((isOn, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="text-[10px] text-gray-500 font-mono mb-1">
                                    2<sup>{7-i}</sup> ({Math.pow(2, 7-i)})
                                </div>
                                <button
                                    onClick={() => toggleBit(i)}
                                    className={`w-10 h-14 md:w-16 md:h-24 rounded-lg border-2 flex items-center justify-center text-2xl md:text-4xl font-mono font-bold transition-all duration-200 transform hover:scale-105 ${
                                        isOn 
                                        ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                                        : 'bg-[#0d1117] border-gray-700 text-gray-600 shadow-inner'
                                    }`}
                                >
                                    {isOn ? '1' : '0'}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#0d1117] p-4 rounded-lg border border-gray-800 text-center">
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Decimal</div>
                            <div className="text-3xl font-mono text-blue-400">{decimalValue}</div>
                        </div>
                        <div className="bg-[#0d1117] p-4 rounded-lg border border-gray-800 text-center">
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Hexadecimal</div>
                            <div className="text-3xl font-mono text-purple-400">0x{hexValue}</div>
                        </div>
                        <div className="bg-[#0d1117] p-4 rounded-lg border border-gray-800 text-center">
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Binary</div>
                            <div className="text-3xl font-mono text-green-400">{binaryString}</div>
                        </div>
                        <div className="bg-[#0d1117] p-4 rounded-lg border border-gray-800 text-center">
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">ASCII</div>
                            <div className="text-3xl font-mono text-yellow-400">{asciiChar}</div>
                        </div>
                    </div>
                </div>

                {/* Logic Gates Theory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Why Binary?</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            Computers are built from <strong>Transistors</strong>, which act like tiny switches. A switch can only be ON (1) or OFF (0). 
                            By combining billions of these switches, we can represent complex numbers, text, images, and logic.
                        </p>
                        <div className="flex gap-2">
                             <div className="bg-green-900/20 text-green-400 px-3 py-1 rounded text-xs border border-green-900/50">High Voltage (5V) = 1</div>
                             <div className="bg-gray-800 text-gray-400 px-3 py-1 rounded text-xs border border-gray-700">Low Voltage (0V) = 0</div>
                        </div>
                    </div>

                    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Memory Sizes</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex justify-between border-b border-gray-800 pb-2">
                                <span><strong>Bit</strong></span>
                                <span>Single 0 or 1</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-800 pb-2">
                                <span><strong>Byte</strong></span>
                                <span>8 Bits (Max value: 255)</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-800 pb-2">
                                <span><strong>Kilobyte (KB)</strong></span>
                                <span>1,024 Bytes</span>
                            </li>
                            <li className="flex justify-between">
                                <span><strong>Gigabyte (GB)</strong></span>
                                <span>1 Billion Bytes</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};
