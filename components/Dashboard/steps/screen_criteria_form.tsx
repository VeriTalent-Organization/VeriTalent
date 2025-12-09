import React, { useState, ChangeEvent } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

// Define allowed keys for criteriaData
type CriteriaKey = 'Culture' | 'Experience' | 'Education' | 'Location' | 'Salary' | 'Skills' | 'Others';

// Define structure for each criteria
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

  const handleBack = () => console.log('Going back');
  const handleSaveDraft = () => console.log('Saving draft:', criteriaData);
  const handleNext = () => console.log('Proceeding to next step:', criteriaData);

  return (
    <div className="min-h-screen">
      <div className="bg-white p-8 rounded-b-lg space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Role Requirements Context for Screening (Screening Criteria)
          </h2>
          <p className="text-sm text-cyan-600 mt-1">(This section will not be published for public view)</p>
        </div>

        {/* Tag Buttons */}
        <div className="flex flex-wrap gap-3">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-6 py-2 rounded-lg border transition-colors ${
                activeTag === tag
                  ? 'border-brand-primary bg-cyan-50 text-brand-primary font-medium'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <p className="text-sm text-brand-primary">
          For each selected tag, add details on the specifics to screen for. Also, provide a weighted score for the tag.
        </p>

        {/* Screening Section */}
        <div className="border border-gray-200 rounded-lg p-6 space-y-6">
          <h3 className="text-xl font-bold text-gray-900">{activeTag}</h3>

          {/* Screening Context */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">Screening Context</label>
            <textarea
              rows={4}
              value={criteriaData[activeTag].context}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleContextChange(e.target.value)}
              placeholder={`Add ${activeTag.toLowerCase()} screening context...`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Weight Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-900">Weight:</label>
              <span className="text-lg font-semibold text-gray-900">{criteriaData[activeTag].weight}%</span>
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
