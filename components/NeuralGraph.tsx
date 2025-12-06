
import React, { useEffect, useRef } from 'react';
import { ProjectFile } from '../types';

interface NeuralGraphProps {
    files: ProjectFile[];
}

interface Node {
    x: number;
    y: number;
    radius: number;
    vx: number;
    vy: number;
    file: ProjectFile;
    color: string;
}

export const NeuralGraph: React.FC<NeuralGraphProps> = ({ files }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || files.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize
        const resize = () => {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Initialize Nodes
        const nodes: Node[] = files.map(file => {
            // Determine color based on extension
            let color = '#6b7280'; // gray
            if (file.name.endsWith('ts') || file.name.endsWith('tsx')) color = '#3b82f6'; // blue
            if (file.name.endsWith('py')) color = '#10b981'; // green
            if (file.name.endsWith('json')) color = '#fbbf24'; // yellow
            if (file.name.endsWith('html')) color = '#f97316'; // orange

            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 2,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                file,
                color
            };
        });

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update Positions & Draw Connections
            nodes.forEach((node, i) => {
                // Move
                node.x += node.vx;
                node.y += node.vy;

                // Bounce
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                // Draw Connections (Synapses)
                // Simple logic: connect to nearby nodes to simulate dependency graph
                for (let j = i + 1; j < nodes.length; j++) {
                    const other = nodes[j];
                    const dx = other.x - node.x;
                    const dy = other.y - node.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(100, 116, 139, ${1 - dist / 150})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });

            // Draw Nodes
            nodes.forEach(node => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.fill();
                
                // Glow effect
                ctx.shadowBlur = 10;
                ctx.shadowColor = node.color;
                
                // Labels (if few files)
                if (files.length < 15) {
                    ctx.fillStyle = '#9ca3af';
                    ctx.font = '10px monospace';
                    ctx.fillText(node.file.name.split('/').pop() || '', node.x + 8, node.y + 3);
                }
                ctx.shadowBlur = 0;
            });

            requestAnimationFrame(draw);
        };

        const animationId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [files]);

    return (
        <div className="w-full h-full relative" ref={containerRef}>
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400">Neural File Graph</h3>
                <p className="text-[10px] text-gray-500">Visualizing Code Topology</p>
            </div>
            <canvas ref={canvasRef} className="w-full h-full bg-[#0d1117]" />
        </div>
    );
};
