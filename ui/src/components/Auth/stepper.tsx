'use client';

import { StepperProps } from '../../utils/types';

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className='flex items-center justify-between mb-8'>
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div
            key={step.id}
            className={`flex items-center ${index !== steps.length - 1 ? 'w-full' : 'w-auto'}`}
          >
            {/* Circle */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2
                ${
                  isCompleted
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-gray-300 text-gray-400'
                }
              `}
            >
              {step.id}
            </div>

            {/* Title */}
            <span
              className={`ml-3 text-sm font-medium ${
                isActive || isCompleted ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {step.title}
            </span>

            {/* Line */}
            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
