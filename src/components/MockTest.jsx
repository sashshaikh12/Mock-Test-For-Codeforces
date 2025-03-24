import React from "react";

function MockTest() {
    return(
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto mt-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                            Mock Test
                        </h1>
                        <h3 className="text-xl md:text-2xl text-gray-600">
                            Test your knowledge and boost your skills!
                        </h3>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 hover:cursor-pointer">
                            Start Test
                        </button>
                    </div>
                    
                    {/* Image */}
                    <div className="flex justify-center">
                        <img 
                            src="src/assets/MockTest.svg" 
                            alt="Mock test illustration" 
                            className="h-80 md:h-96 w-auto object-contain animate-float"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MockTest;