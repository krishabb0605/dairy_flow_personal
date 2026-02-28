'use client';

import { StepperProps } from '../../utils/types';

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className='flex gap-4 flex-row sm:items-center sm:justify-between mb-6 sm:mb-8'>
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div
            key={step.id}
            className={`flex sm:items-center ${
              index !== steps.length - 1 ? 'w-full' : 'w-auto'
            }`}
          >
            <div
              key={step.id}
              className={`flex flex-col sm:flex-row items-center `}
            >
              {/* Circle */}
              <div
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2
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
                className={`mt-2 sm:mt-0 sm:ml-3 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  isActive || isCompleted ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            </div>
            {/* Line */}
            {index !== steps.length - 1 && (
              <div
                className={`w-full h-px my-3 sm:my-0 sm:flex-1 sm:h-0.5 sm:mx-4 ${
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
