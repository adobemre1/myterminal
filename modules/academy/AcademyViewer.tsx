
import React, { useState, useEffect } from 'react';
import { PYTHON_CURRICULUM, JS_TS_CURRICULUM, CS_FOUNDATIONS_CURRICULUM, CPP_CURRICULUM, JAVA_CURRICULUM } from '../../services/curriculum';
import { agentGenerateLesson } from '../../services/gemini';
import { LessonContent } from '../../types';
import { BinaryLab } from './BinaryLab';

interface AcademyViewerProps {
    onTryCode: (code: string) => void;
}

type CurriculumType = 'cs' | 'python' | 'js' | 'cpp' | 'java';

export const AcademyViewer: React.FC<AcademyViewerProps> = ({ onTryCode }) => {
    const [currentLang, setCurrentLang] = useState<CurriculumType>('cs');
    const [selectedTopicId, setSelectedTopicId] = useState<string>('');
    const [lessonData, setLessonData] = useState<LessonContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [showBinaryLab, setShowBinaryLab] = useState(false);

    // Initial Load
    useEffect(() => {
        // Load default CS
        loadLesson('cs-bits', CS_FOUNDATIONS_CURRICULUM[0].topics[0].prompt);
        setSelectedTopicId('cs-bits');
    }, []);

    const getActiveCurriculum = () => {
        switch(currentLang) {
            case 'cs': return CS_FOUNDATIONS_CURRICULUM;
            case 'python': return PYTHON_CURRICULUM;
            case 'js': return JS_TS_CURRICULUM;
            case 'cpp': return CPP_CURRICULUM;
            case 'java': return JAVA_CURRICULUM;
            default: return CS_FOUNDATIONS_CURRICULUM;
        }
    }

    const loadLesson = async (id: string, prompt: string) => {
        if (id === 'cs-bits' && currentLang === 'cs') {
             // Optional: Show lab by default for first topic, or just text
        }
        setShowBinaryLab(false);
        setSelectedTopicId(id);
        setLoading(true);
        setLessonData(null);
        try {
            const data = await agentGenerateLesson(prompt);
            setLessonData(data);
        } catch (e) {
            console.error(e);
            setLessonData({
                title: "Error Loading Lesson",
                htmlContent: "<p class='text-red-400'>Failed to contact Professor Code. Please try again.</p>",
                runnableCode: "# Error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full bg-[#0d1117] text-gray-300">
            {/* Syllabus Sidebar */}
            <div className="w-80 border-r border-gray-800 bg-[#161b22] flex flex-col overflow-y-auto custom-scrollbar shrink-0">
                <div className="p-4 border-b border-gray-800 bg-[#0d1117]">
                    <h2 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-blue-500 text-transparent bg-clip-text mb-3">
                        OmniCode Academy
                    </h2>
                    
                    {/* Category Selector */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <button 
                            onClick={() => { setCurrentLang('cs'); loadLesson('cs-bits', CS_FOUNDATIONS_CURRICULUM[0].topics[0].prompt); }}
                            className={`text-[10px] py-1.5 rounded font-bold transition-colors ${currentLang === 'cs' ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-400'}`}
                        >
                            CS Foundations
                        </button>
                         <button 
                            onClick={() => { setCurrentLang('cpp'); loadLesson('cpp-intro', CPP_CURRICULUM[0].topics[0].prompt); }}
                            className={`text-[10px] py-1.5 rounded font-bold transition-colors ${currentLang === 'cpp' ? 'bg-blue-800 text-white' : 'bg-gray-800 text-gray-400'}`}
                        >
                            C++ Systems
                        </button>
                         <button 
                            onClick={() => { setCurrentLang('java'); loadLesson('java-jvm', JAVA_CURRICULUM[0].topics[0].prompt); }}
                            className={`text-[10px] py-1.5 rounded font-bold transition-colors ${currentLang === 'java' ? 'bg-red-800 text-white' : 'bg-gray-800 text-gray-400'}`}
                        >
                            Java Ent.
                        </button>
                        <button 
                            onClick={() => { setCurrentLang('python'); loadLesson('py-history', PYTHON_CURRICULUM[0].topics[0].prompt); }}
                            className={`text-[10px] py-1.5 rounded font-bold transition-colors ${currentLang === 'python' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                        >
                            Python
                        </button>
                        <button 
                            onClick={() => { setCurrentLang('js'); loadLesson('js-history', JS_TS_CURRICULUM[0].topics[0].prompt); }}
                            className={`text-[10px] py-1.5 rounded font-bold transition-colors ${currentLang === 'js' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                        >
                            JS / TS
                        </button>
                    </div>
                </div>

                {/* CS TOOLS BUTTONS */}
                {currentLang === 'cs' && (
                     <div className="p-2 border-b border-gray-800">
                         <button 
                            onClick={() => setShowBinaryLab(true)}
                            className="w-full bg-green-900/20 hover:bg-green-900/40 text-green-400 border border-green-900/50 py-2 rounded text-xs font-bold flex items-center justify-center gap-2"
                         >
                             <span>🧮</span> Open Binary Lab
                         </button>
                     </div>
                )}
                
                <div className="p-4 space-y-6">
                    {getActiveCurriculum().map(chapter => (
                        <div key={chapter.id}>
                            <h3 className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-2">
                                {chapter.title}
                            </h3>
                            <div className="space-y-1">
                                {chapter.topics.map(topic => (
                                    <button
                                        key={topic.id}
                                        onClick={() => loadLesson(topic.id, topic.prompt)}
                                        className={`w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                                            selectedTopicId === topic.id && !showBinaryLab
                                            ? 'bg-blue-900/40 text-blue-300 border-l-2 border-blue-500' 
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`}
                                    >
                                        {topic.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                
                {showBinaryLab ? (
                    <BinaryLab />
                ) : loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-blue-400 font-medium">Professor Code is generating curriculum...</p>
                    </div>
                ) : lessonData ? (
                    <div className="max-w-4xl mx-auto p-8 md:p-12">
                        {/* Title Header */}
                        <div className="mb-8 pb-8 border-b border-gray-800">
                            <h1 className="text-4xl font-bold text-white mb-2">{lessonData.title}</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>Updated: 2025</span>
                                <span>•</span>
                                <span className="uppercase">{currentLang} Standard</span>
                            </div>
                        </div>

                        {/* Article Body */}
                        <div 
                            className="prose prose-invert prose-lg max-w-none mb-12"
                            dangerouslySetInnerHTML={{ __html: lessonData.htmlContent }}
                        />

                        {/* Code Block */}
                        <div className="bg-[#161b22] border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
                            <div className="bg-[#0d1117] px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase">Interactive Example</span>
                                <button 
                                    onClick={() => onTryCode(lessonData.runnableCode)}
                                    className="bg-green-700 hover:bg-green-600 text-white text-xs font-bold px-4 py-1.5 rounded transition-colors flex items-center gap-2"
                                >
                                    <span>▶</span> Try It Yourself
                                </button>
                            </div>
                            <div className="p-4 font-mono text-sm overflow-x-auto text-blue-100 bg-[#0d1117]">
                                <pre>{lessonData.runnableCode}</pre>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                            <p>Content generated by OmniCode Academy Engine (Professor Persona).</p>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
