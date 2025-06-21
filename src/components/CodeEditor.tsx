
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface CodeEditorProps {
  challenge: {
    title: string;
    instruction: string;
    starterCode: string;
    expectedOutput: string;
    hints: string[];
  };
  onComplete: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ challenge, onComplete }) => {
  const [code, setCode] = useState(challenge.starterCode);
  const [output, setOutput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  const runCode = () => {
    try {
      // Simple code execution simulation
      const result = executeCode(code);
      setOutput(result);
      
      if (result.trim() === challenge.expectedOutput.trim()) {
        setIsCorrect(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        setIsCorrect(false);
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
      setIsCorrect(false);
    }
  };

  const executeCode = (code: string): string => {
    // Simple JavaScript execution for educational purposes
    // In a real implementation, this would use a secure sandbox
    try {
      const func = new Function(`
        let output = [];
        const print = (msg) => output.push(msg);
        ${code}
        return output.join('\\n');
      `);
      return func();
    } catch (error) {
      throw error;
    }
  };

  const resetCode = () => {
    setCode(challenge.starterCode);
    setOutput('');
    setIsCorrect(false);
  };

  const nextHint = () => {
    if (currentHint < challenge.hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
    setShowHint(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Instructions Panel */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🍳</span>
            <span>{challenge.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-gray-800 mb-2">Recipe Instructions:</h3>
            <p className="text-gray-700">{challenge.instruction}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-gray-800 mb-2">Expected Result:</h3>
            <pre className="text-sm bg-gray-50 p-2 rounded border font-mono">
              {challenge.expectedOutput}
            </pre>
          </div>

          {showHint && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-medium text-yellow-800 mb-2">💡 Chef's Tip:</h3>
              <p className="text-yellow-700">{challenge.hints[currentHint]}</p>
              {currentHint < challenge.hints.length - 1 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={nextHint}
                  className="mt-2"
                >
                  Next Tip
                </Button>
              )}
            </div>
          )}

          {!showHint && (
            <Button 
              variant="outline" 
              onClick={() => setShowHint(true)}
              className="w-full"
            >
              Need a Chef's Tip? 🍴
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Code Editor Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Code Kitchen</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={resetCode}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button onClick={runCode} className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-1" />
                Cook It!
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono text-sm min-h-[200px] bg-gray-50"
            placeholder="Write your code here..."
          />
          
          {output && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">Output:</h3>
                {isCorrect ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Perfect!
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Keep trying
                  </Badge>
                )}
              </div>
              <pre className={`text-sm p-3 rounded border font-mono ${
                isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                {output}
              </pre>
            </div>
          )}

          {isCorrect && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
              <div className="text-2xl mb-2">🎉</div>
              <h3 className="font-bold text-green-800">Delicious Success!</h3>
              <p className="text-green-700">You've mastered this recipe. Great job, chef!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
