import { React, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CodeforcesVerify() {

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    console.log(email);
    const [codeforcesHandle, setCodeforcesHandle] = useState('');
    const [contestId, setContestId] = useState(0);
    const [index, setIndex] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [verificationStep, setVerificationStep] = useState(1); // 1: input, 2: verify, 3: confirm

    const handleCodeforcesUsername = async () => {
        if (codeforcesHandle === '') {
            alert("Please enter a valid Codeforces username");
            return;
        }

        setIsLoading(true);
        try {
            let result = await fetch("http://localhost:5000/random-problem", {
                method: "get",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            result = await result.json();
            setContestId(result.problem.contestId);
            setIndex(result.problem.index);
            setVerificationStep(2);
        } catch (error) {
            alert("Failed to fetch verification problem");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmation = async () => {
        if (codeforcesHandle === '' || contestId === 0 || index === "") {
            alert("Please verify first");
            return;
        }

        setIsLoading(true);
        try {
            let result = await fetch("http://localhost:5000/last-submission", {
                method: "post",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ handle: codeforcesHandle }),
            });
            result = await result.json();
            console.log(result);

            if (result.message === "Invalid Codeforces handle") {
                alert("Invalid Codeforces handle");
                return;
            }

            if (result.submission?.problem?.contestId === contestId && 
                result.submission?.problem?.index === index && 
                result.submission?.verdict === "COMPILATION_ERROR") {
                
                let response = await fetch("http://localhost:5000/get-token", {
                    method: "post",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ handle: codeforcesHandle, email }),
                });
                response = await response.json();
                console.log(response);

                if (response.message === "Codeforces handle added") {
                    navigate("/home", {replace: true});
                    setVerificationStep(3);
                } else {
                    alert("Verification failed");
                }
            } else {
                alert("Please submit a compilation error to the given problem first");
            }
        } catch (error) {
            alert("Verification failed");
        } finally {
            setIsLoading(false);
        }
    };

    const resetVerification = () => {
        setCodeforcesHandle('');
        setContestId(0);
        setIndex("");
        setVerificationStep(1);
    };

    return (
        <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-teal-700">Codeforces Profile Verification</h1>
                <p className="text-gray-600">Verify your account to access all features</p>
            </div>

            <div className="space-y-6">
                {/* Step 1: Enter Handle */}
                {verificationStep === 1 && (
                    <div className="p-6 bg-teal-50 rounded-lg border border-teal-200">
                        <h2 className="text-lg font-semibold text-teal-800 mb-4">Enter Your Codeforces Handle</h2>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="e.g. tourist"
                                className="flex-grow px-4 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                                value={codeforcesHandle}
                                onChange={(e) => setCodeforcesHandle(e.target.value)}
                            />
                            <button 
                                onClick={handleCodeforcesUsername}
                                disabled={isLoading}
                                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                            >
                                {isLoading ? "Loading..." : "Verify"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Verification Problem */}
                {verificationStep >= 2 && verificationStep < 3 && (
                    <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-blue-800">Verification Steps</h2>
                            <button 
                                onClick={resetVerification}
                                className="text-sm text-blue-600 hover:text-blue-800 underline hover:cursor-pointer"
                            >
                                Change Handle
                            </button>
                        </div>
                        
                        <div className="mb-4 p-4 bg-white rounded-md border border-blue-100">
                            <h3 className="font-medium text-blue-700 mb-2">Problem to Solve:</h3>
                            {index ? (
                                <a 
                                    href={`https://codeforces.com/contest/${contestId}/problem/${index}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline break-all"
                                >
                                    {`https://codeforces.com/contest/${contestId}/problem/${index}`}
                                </a>
                            ) : (
                                <p className="text-gray-500">Problem link will appear here</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <h3 className="font-medium text-blue-700 mb-2">Current Handle:</h3>
                            <p className="text-gray-700">{codeforcesHandle}</p>
                        </div>

                        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                            <li>Submit <span className="font-semibold">any code</span> that produces a compilation error to the problem above</li>
                            <li>Return to this page and click the confirmation button below</li>
                            <li className="text-sm text-gray-500">Do not refresh the page during verification</li>
                        </ol>

                        <div className="mt-6 flex justify-center">
                            <button 
                                onClick={handleConfirmation}
                                disabled={isLoading || !index}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {isLoading ? "Verifying..." : "Confirm Verification"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Success Message */}
                {verificationStep === 3 && (
                    <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                                <h2 className="text-lg font-semibold text-green-800">Verification Successful!</h2>
                                <p className="text-green-600">Your Codeforces handle {codeforcesHandle} has been verified.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CodeforcesVerify;