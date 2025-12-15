import React, { useState, ChangeEvent } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Text } from '@/components/reuseables/text';

type CriteriaKey = 'Culture' | 'Experience' | 'Education' | 'Location' | 'Salary' | 'Skills' | 'Others';

type CriteriaData = Record<CriteriaKey, { context: string; weight: number }>;

export default function ScreeningCriteriaForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTag, setActiveTag] = useState<CriteriaKey>('Culture');
  const [criteriaData, setCriteriaData] = useState<CriteriaData>({
    Culture: {
      context: 'Looking for team players who thrive in fast-paced environments and strong problem-solving abilities.',
      weight: 20
    },
    Experience: { context: '', weight: 50 },
    Education: { context: '', weight: 50 },
    Location: { context: '', weight: 50 },
    Salary: { context: '', weight: 50 },
    Skills: { context: '', weight: 50 },
    Others: { context: '', weight: 50 }
  });

  const tags: CriteriaKey[] = ['Culture', 'Experience', 'Education', 'Location', 'Salary', 'Skills', 'Others'];

  const handleContextChange = (value: string) => {
    setCriteriaData(prev => ({
      ...prev,
      [activeTag]: {
        ...prev[activeTag],
        context: value
      }
    }));
  };

  const handleWeightChange = (value: number[]) => {
    setCriteriaData(prev => ({
      ...prev,
      [activeTag]: {
        ...prev[activeTag],
        weight: value[0]
      }
    }));
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white p-2 sm:p-6 lg:p-8 rounded-b-lg space-y-4 sm:space-y-6">
        <div>
          <Text variant="SubHeadings" as="h1" className="text-sm sm:text-2xl">
            Role Requirements Context for Screening (Screening Criteria)
          </Text>

          <Text
            variant="SubText"
            className="mt-1 text-sm sm:text-base"
            color="#0e7490"
          >
            (This section will not be published for public view)
          </Text>
        </div>

        {/* Tag Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 sm:px-6 py-2 rounded-lg border transition-colors text-sm sm:text-base ${
                activeTag === tag
                  ? 'border-brand-primary bg-cyan-50 text-brand-primary font-medium'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <Text variant="RegularText" className="text-brand-primary text-sm sm:text-base">
          For each selected tag, add details on the specifics to screen for. Also, provide a weighted score for the tag.
        </Text>

        {/* Screening Box */}
        <div className="border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
          
          <Text variant="SubHeadings" as="h3" className="text-lg sm:text-xl">
            {activeTag}
          </Text>

          {/* Screening Context */}
          <div className="space-y-2 sm:space-y-3">
            <Text variant="RegularText" className="font-medium text-sm sm:text-base">
              Screening Context
            </Text>

            <textarea
              rows={4}
              value={criteriaData[activeTag].context}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleContextChange(e.target.value)}
              placeholder={`Add ${activeTag.toLowerCase()} screening context...`}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Weight Slider */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">

              <Text variant="RegularText" className="font-medium text-sm sm:text-base">
                Weight:
              </Text>

              <Text variant="RegularText" className="text-base sm:text-lg font-semibold">
                {criteriaData[activeTag].weight}%
              </Text>
            </div>

            <Slider
              value={[criteriaData[activeTag].weight]}
              onValueChange={handleWeightChange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

        </div>
      </div>
    </div>
  );
}