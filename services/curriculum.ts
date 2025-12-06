
import { AcademyChapter } from "../types";

// --- COMPUTER SCIENCE FOUNDATIONS (THE ORIGIN) ---
export const CS_FOUNDATIONS_CURRICULUM: AcademyChapter[] = [
    {
        id: "cs-binary",
        title: "Module 1: The Language of Machines (Binary)",
        topics: [
            { id: "cs-bits", title: "Bits, Bytes & Voltage", prompt: "Explain how computers use Transistors (On/Off) to represent 0 and 1. Explain Voltage levels. What is a Bit vs Byte?" },
            { id: "cs-numbers", title: "Binary Number Systems", prompt: "Teach how to count in Binary. Convert Decimal (Human) to Binary (Machine). Explain Hexadecimal." },
            { id: "cs-ascii", title: "Text Encoding (ASCII/Unicode)", prompt: "How do numbers become text? Explain ASCII table and UTF-8 encoding." }
        ]
    },
    {
        id: "cs-hardware",
        title: "Module 2: CPU Architecture",
        topics: [
            { id: "cs-von-neumann", title: "Von Neumann Architecture", prompt: "Explain CPU, RAM, ALU, and Control Unit. How do they fetch-decode-execute instructions?" },
            { id: "cs-logic", title: "Logic Gates (AND, OR, NOT)", prompt: "Explain fundamental digital logic gates. Provide truth tables. How do gates make a CPU adder?" },
            { id: "cs-assembly", title: "Assembly Language", prompt: "What is Assembly (ASM)? Explain Registers (EAX, EBX) and basic instructions (MOV, ADD, JMP)." }
        ]
    },
    {
        id: "cs-theory",
        title: "Module 3: Compilation & Execution",
        topics: [
            { id: "cs-compiler", title: "Compiler vs Interpreter", prompt: "Difference between Compiled (C++) and Interpreted (Python) languages. What is a binary executable?" },
            { id: "cs-memory", title: "Stack vs Heap Memory", prompt: "Deep dive into Memory Management. What is Stack overflow? What is a Memory Leak?" }
        ]
    }
];

// --- SYSTEMS PROGRAMMING (C++, RUST) ---
export const CPP_CURRICULUM: AcademyChapter[] = [
    {
        id: "cpp-basics",
        title: "Module 1: C++ Foundations",
        topics: [
            { id: "cpp-intro", title: "Hello World & Main", prompt: "Introduction to C++. #include <iostream>, int main(), and cout." },
            { id: "cpp-types", title: "Static Typing & Primitives", prompt: "int, double, char, bool in C++. Size of types (sizeof)." }
        ]
    },
    {
        id: "cpp-memory",
        title: "Module 2: The Power of Pointers",
        topics: [
            { id: "cpp-pointers", title: "Pointers & References", prompt: "Explain *ptr and &ref. How to access memory addresses directly. Why is this dangerous but powerful?" },
            { id: "cpp-new-delete", title: "Manual Memory Management", prompt: "Explain 'new' and 'delete'. How to allocate memory on the Heap manually." }
        ]
    },
    {
        id: "cpp-oop",
        title: "Module 3: OOP in C++",
        topics: [
            { id: "cpp-classes", title: "Classes & Objects", prompt: "Define class, public/private access modifiers, and constructors/destructors." },
            { id: "cpp-inheritance", title: "Inheritance & Polymorphism", prompt: "Explain virtual functions, override, and inheritance hierarchies." }
        ]
    }
];

// --- ENTERPRISE (JAVA) ---
export const JAVA_CURRICULUM: AcademyChapter[] = [
    {
        id: "java-core",
        title: "Module 1: Java Core & JVM",
        topics: [
            { id: "java-jvm", title: "Write Once, Run Anywhere", prompt: "Explain the JVM (Java Virtual Machine), JRE, and JDK. What is Bytecode (.class)?" },
            { id: "java-syntax", title: "Basic Syntax", prompt: "public static void main(String[] args). System.out.println. Class structure." }
        ]
    },
    {
        id: "java-oop",
        title: "Module 2: Pure Object Oriented",
        topics: [
            { id: "java-interfaces", title: "Interfaces & Abstract Classes", prompt: "Deep dive into Interfaces. implementing vs extending." },
            { id: "java-collections", title: "Collections Framework", prompt: "ArrayList, HashMap, HashSet. Generics in Java." }
        ]
    }
];

export const PYTHON_CURRICULUM: AcademyChapter[] = [
    {
        id: "intro",
        title: "Module 1: The History & Foundation",
        topics: [
            { id: "py-history", title: "Python's Origin (1991-2025)", prompt: "Explain the history of Python from Guido van Rossum in 1991 to its dominance in AI in 2025. Mention Python 2 vs 3." },
            { id: "py-why", title: "Why Python Rules the World", prompt: "Explain why Python is used in Web, Data Science, AI, and Automation. Compare it to C++ and JS." },
            { id: "py-install", title: "Environment Setup", prompt: "Explain how to install Python, pip, and virtual environments (venv) on Windows, Mac, and Linux." }
        ]
    },
    {
        id: "basics",
        title: "Module 2: Python Syntax Basics",
        topics: [
            { id: "py-syntax", title: "Variables & Data Types", prompt: "Explain int, float, str, bool. Explain dynamic typing." },
            { id: "py-lists", title: "Lists, Tuples, Sets", prompt: "Deep dive into Python Data Structures. List vs Tuple vs Set." },
            { id: "py-dicts", title: "Dictionaries & HashMaps", prompt: "Explain Key-Value pairs, .get(), .items(), and dictionary comprehension." },
            { id: "py-flow", title: "Control Flow (If/Else/Loops)", prompt: "Explain if, elif, else, for loops, while loops, and break/continue." }
        ]
    },
    {
        id: "intermediate",
        title: "Module 3: Intermediate Concepts",
        topics: [
            { id: "py-functions", title: "Functions & Lambda", prompt: "Explain def, args, kwargs, return values, and lambda functions." },
            { id: "py-oop", title: "Classes & OOP", prompt: "Explain Object Oriented Programming: Class, Object, Inheritance, self, __init__." },
            { id: "py-modules", title: "Modules & Pip", prompt: "Explain import, from...import, and how pip requirements.txt works." },
            { id: "py-exceptions", title: "Error Handling", prompt: "Explain try, except, finally, and raising custom exceptions." }
        ]
    },
    {
        id: "advanced",
        title: "Module 4: Professional Python",
        topics: [
            { id: "py-decorators", title: "Decorators (@wrapper)", prompt: "Explain @decorators, wrappers, and how frameworks like Flask/FastAPI use them." },
            { id: "py-generators", title: "Generators & Iterators", prompt: "Explain yield vs return, memory efficiency, and lazy evaluation." },
            { id: "py-async", title: "Async IO & Concurrency", prompt: "Explain async def, await, asyncio library, and threading vs multiprocessing." },
            { id: "py-typing", title: "Type Hinting (PEP 484)", prompt: "Explain standard type hints, List, Dict, Optional, and MyPy." }
        ]
    },
    {
        id: "datascience",
        title: "Module 5: Data Science & AI",
        topics: [
            { id: "py-pandas", title: "Pandas DataFrames", prompt: "Explain DataFrames, Series, reading CSVs, and data manipulation." },
            { id: "py-numpy", title: "NumPy Arrays", prompt: "Explain ndarray, vectorization, and mathematical operations." },
            { id: "py-ai", title: "Intro to PyTorch/TensorFlow", prompt: "Brief overview of how Python interacts with Neural Networks and Tensors." }
        ]
    }
];

export const JS_TS_CURRICULUM: AcademyChapter[] = [
    {
        id: "js-intro",
        title: "Module 1: JavaScript Engine & History",
        topics: [
            { id: "js-history", title: "From Netscape to V8", prompt: "Explain the history of JavaScript, Brendan Eich, Netscape, ES6 revolution, and the V8 Engine." },
            { id: "js-eventloop", title: "The Event Loop", prompt: "Explain the Call Stack, Callback Queue, Microtask Queue, and how JS is single-threaded but non-blocking." },
            { id: "js-scope", title: "Scope & Hoisting", prompt: "Explain var vs let vs const, lexical scope, and hoisting." }
        ]
    },
    {
        id: "ts-basics",
        title: "Module 2: TypeScript Fundamentals (Google Std)",
        topics: [
            { id: "ts-types", title: "Static Typing System", prompt: "Explain primitive types, arrays, tuples, and 'any' vs 'unknown' in TypeScript." },
            { id: "ts-interfaces", title: "Interfaces vs Types", prompt: "Compare Interfaces and Type Aliases. Explain when to use which according to Google Style Guide." },
            { id: "ts-generics", title: "Generics <T>", prompt: "Explain Generics in functions and interfaces. Why they are crucial for reusable code." }
        ]
    },
    {
        id: "modern-web",
        title: "Module 3: Modern Web Patterns",
        topics: [
            { id: "js-async", title: "Promises & Async/Await", prompt: "Explain Callback Hell, Promises, and the modern async/await syntax." },
            { id: "js-modules", title: "ES Modules (Import/Export)", prompt: "Explain ESM (import x from y) vs CommonJS (require). Why the web is moving to ESM." },
            { id: "js-fetch", title: "Fetch API & JSON", prompt: "Explain how to make HTTP requests using fetch() and handling JSON responses." }
        ]
    },
    {
        id: "node-ecosystem",
        title: "Module 4: Node.js & NPM",
        topics: [
            { id: "node-runtime", title: "Node.js Runtime", prompt: "Explain what Node.js is (JS outside browser), fs module, and http module." },
            { id: "npm-basics", title: "NPM & package.json", prompt: "Explain npm install, package.json scripts, dependencies vs devDependencies." }
        ]
    }
];
