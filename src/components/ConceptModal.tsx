
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen, X } from 'lucide-react';

interface ConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  concept: string;
  explanation: string;
}

export const ConceptModal: React.FC<ConceptModalProps> = ({
  isOpen,
  onClose,
  title,
  concept,
  explanation
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span>Learn: {concept}</span>
          </DialogTitle>
          <DialogDescription>
            Understanding the concept for "{title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              What is {concept}?
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
              {explanation}
            </p>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              💡 Quick Tips:
            </h4>
            <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
              <li>• Read the code blocks carefully</li>
              <li>• Think about the logical order</li>
              <li>• Comments usually come before code</li>
              <li>• Variables must be defined before use</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
            Got it! Let's try again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
